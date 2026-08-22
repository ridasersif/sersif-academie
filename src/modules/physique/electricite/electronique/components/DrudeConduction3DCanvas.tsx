"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, Line, Box, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ChevronRight, ChevronLeft, Zap, Target, Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface ElectronParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  baseThermalSpeed: number;
}

// Fixed 32 electrons initialized statically outside render
const INITIAL_ELECTRONS: ElectronParticle[] = Array.from({ length: 32 }).map((_, i) => {
  const p = new THREE.Vector3(
    (Math.sin(i * 13) * 0.5 + 0.5) * 4.4 - 2.2,
    (Math.cos(i * 17) * 0.5 + 0.5) * 1.4 - 0.7,
    (Math.sin(i * 29) * 0.5 + 0.5) * 1.4 - 0.7
  );
  const angle = (i / 32) * Math.PI * 2;
  const v = new THREE.Vector3(Math.cos(angle), Math.sin(angle * 2), Math.cos(angle * 3)).normalize();
  return {
    pos: p,
    vel: v,
    baseThermalSpeed: 0.85 + (i % 4) * 0.15,
  };
});

/* ── 3D SCENE COMPONENT ── */
function Experiment3DScene({
  phase,
  voltageV,
  temperature,
  trackSingle,
}: {
  phase: number; // 0: Agitation pure, 1: Application de U & E, 2: Regime permanent & Joule
  voltageV: number;
  temperature: number;
  trackSingle: boolean;
}) {
  const isConnected = phase >= 1;
  const eFieldMagnitude = isConnected ? (voltageV / 2.0) : 0;

  // Ordered lattice of Cu2+ ions
  const latticeIons = useMemo(() => {
    const ions: THREE.Vector3[] = [];
    const layersX = [-1.8, -0.9, 0, 0.9, 1.8];
    const ringRadius = 0.55;

    layersX.forEach((x) => {
      ions.push(new THREE.Vector3(x, 0, 0));
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2;
        ions.push(new THREE.Vector3(x, Math.sin(ang) * ringRadius, Math.cos(ang) * ringRadius));
      }
    });
    return ions;
  }, []);

  const ionMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const electronsRef = useRef<ElectronParticle[]>(INITIAL_ELECTRONS);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);
  const [trailLinePoints, setTrailLinePoints] = useState<[number, number, number][]>([[0, 0, 0], [0, 0, 0]]);

  useEffect(() => {
    trailPointsRef.current = [];
  }, [trackSingle, phase]);

  useFrame((_, delta) => {
    // Thermal speed: 0 when T=0K (Absolute zero frozen), high-energy chaos at T > 0K
    const thermalFactor = temperature === 0 ? 0 : Math.sqrt(temperature / 300) * 3.8;
    const driftSpeed = eFieldMagnitude * 0.42;
    const cylinderRadius = 0.85;
    const halfLength = 2.3;

    const countToUpdate = trackSingle ? 1 : electronsRef.current.length;

    for (let idx = 0; idx < countToUpdate; idx++) {
      const el = electronsRef.current[idx];

      // Thermal random motion
      el.pos.x += el.vel.x * el.baseThermalSpeed * thermalFactor * delta;
      el.pos.y += el.vel.y * el.baseThermalSpeed * thermalFactor * delta;
      el.pos.z += el.vel.z * el.baseThermalSpeed * thermalFactor * delta;

      // Radial collision with cylinder walls
      const rCurrent = Math.sqrt(el.pos.y * el.pos.y + el.pos.z * el.pos.z);
      if (rCurrent > cylinderRadius) {
        const normalY = el.pos.y / rCurrent;
        const normalZ = el.pos.z / rCurrent;
        const dot = el.vel.y * normalY + el.vel.z * normalZ;
        el.vel.y -= 2 * dot * normalY;
        el.vel.z -= 2 * dot * normalZ;
        el.pos.y = normalY * cylinderRadius;
        el.pos.z = normalZ * cylinderRadius;
      }

      // Longitudinal boundary
      if (Math.abs(el.pos.x) > halfLength) {
        el.vel.x = -el.vel.x;
        el.pos.x = Math.sign(el.pos.x) * halfLength;
      }

      // Ion collisions
      for (let ionIdx = 0; ionIdx < latticeIons.length; ionIdx++) {
        const ionPos = latticeIons[ionIdx];
        if (el.pos.distanceTo(ionPos) < 0.25) {
          el.vel.set(
            Math.sin(el.pos.x * 12 + ionIdx),
            Math.cos(el.pos.y * 12 + ionIdx),
            Math.sin(el.pos.z * 12 + ionIdx)
          ).normalize();

          // Flash on collision in phase 2 (Joule effect)
          if (phase === 2) {
            const ionMesh = ionMeshRefs.current[ionIdx];
            if (ionMesh && ionMesh.material) {
              const mat = ionMesh.material as THREE.MeshStandardMaterial;
              mat.emissiveIntensity = 1.4;
            }
          }
        }
      }

      // Applied Electric Drift (towards Left / + terminal)
      if (isConnected) {
        el.pos.x -= driftSpeed * delta;
        if (el.pos.x < -halfLength) {
          el.pos.x = halfLength;
          if (idx === 0) trailPointsRef.current = [];
        }
      }

      const mesh = meshRefs.current[idx];
      if (mesh) {
        mesh.position.copy(el.pos);
      }

      if (idx === 0) {
        trailPointsRef.current.push(el.pos.clone());
        if (trailPointsRef.current.length > 75) {
          trailPointsRef.current.shift();
        }
      }
    }

    // Decay ion glow
    latticeIons.forEach((_, ionIdx) => {
      const ionMesh = ionMeshRefs.current[ionIdx];
      if (ionMesh && ionMesh.material) {
        const mat = ionMesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity > 0.35) {
          mat.emissiveIntensity -= delta * 2.5;
        }
      }
    });

    if (trailPointsRef.current.length > 2) {
      setTrailLinePoints(trailPointsRef.current.map((p) => [p.x, p.y, p.z]));
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 5]} intensity={1.8} />
      <pointLight position={[-6, -4, -4]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[6, 4, -4]} intensity={0.6} color="#f59e0b" />

      {/* ── 1. REALISTIC CYLINDRICAL COPPER WIRE ── */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.95, 0.95, 4.8, 32, 1, true]}>
          <meshStandardMaterial
            color="#b45309"
            emissive="#78350f"
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </Cylinder>
        <Cylinder args={[0.95, 0.95, 4.8, 16, 4, true]}>
          <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.15} />
        </Cylinder>
      </group>

      {/* ── 2. POLARITY TERMINALS (Connected in Phase 1 & 2) ── */}
      {/* Terminal + at Left */}
      <group position={[-2.45, 0, 0]}>
        <Cylinder args={[1.02, 1.02, 0.12, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial
            color={isConnected ? "#ef4444" : "#475569"}
            emissive={isConnected ? "#b91c1c" : "#000000"}
            emissiveIntensity={isConnected ? 0.7 : 0}
            metalness={0.9}
          />
        </Cylinder>
        {isConnected && (
          <Html position={[0, 1.35, 0]} center>
            <div className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap animate-in fade-in">
              Pôle (+) • Potentiel Élevé
            </div>
          </Html>
        )}
      </group>

      {/* Terminal - at Right */}
      <group position={[2.45, 0, 0]}>
        <Cylinder args={[1.02, 1.02, 0.12, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial
            color={isConnected ? "#3b82f6" : "#475569"}
            emissive={isConnected ? "#1d4ed8" : "#000000"}
            emissiveIntensity={isConnected ? 0.7 : 0}
            metalness={0.9}
          />
        </Cylinder>
        {isConnected && (
          <Html position={[0, 1.35, 0]} center>
            <div className="bg-blue-950/90 border border-blue-500/50 text-blue-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap animate-in fade-in">
              Pôle (-) • Potentiel Bas
            </div>
          </Html>
        )}
      </group>

      {/* ── 3. GENERATOR / BATTERY & CONNECTING WIRES (Appear in Phase 1 & 2) ── */}
      {isConnected && (
        <group position={[0, -2.1, 0]}>
          {/* Battery Box */}
          <Box args={[1.8, 0.7, 0.8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </Box>
          <Html position={[0, 0, 0.45]} center>
            <div className="bg-slate-900 border border-amber-500/40 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold shadow flex items-center gap-1 whitespace-nowrap">
              <Zap size={11} /> Générateur <LatexMath math={`U = ${voltageV}\\,\\text{V}`} />
            </div>
          </Html>

          {/* Red Wire connecting Battery (+) to Left Terminal */}
          <Line
            points={[
              [-0.8, 0.2, 0],
              [-2.45, 0.2, 0],
              [-2.45, 1.5, 0],
            ]}
            color="#ef4444"
            lineWidth={3}
          />

          {/* Blue Wire connecting Battery (-) to Right Terminal */}
          <Line
            points={[
              [0.8, 0.2, 0],
              [2.45, 0.2, 0],
              [2.45, 1.5, 0],
            ]}
            color="#3b82f6"
            lineWidth={3}
          />
        </group>
      )}

      {/* ── 4. FIELD & CURRENT VECTOR ARROWS ── */}
      {isConnected && (
        <>
          {/* Top Arrow: Electric Field E & Current I (Pointing Right ->) */}
          <group position={[0, 1.6, 0]}>
            <Cylinder args={[0.03, 0.03, 3.2]} rotation={[0, 0, -Math.PI / 2]}>
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
            </mesh>
            <Html position={[0, 0.2, 0]} center>
              <div className="bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
                Champ <LatexMath math="\vec{E}" /> & Courant <LatexMath math="I" /> (Sens conventionnel) →
              </div>
            </Html>
          </group>

          {/* Bottom Arrow: Electron Drift vd (Pointing Left <-) */}
          <group position={[0, -1.5, 0]}>
            <Cylinder args={[0.03, 0.03, 3.2]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[-1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </mesh>
            <Html position={[0, -0.2, 0]} center>
              <div className="bg-sky-950/90 border border-sky-500/40 text-sky-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
                ← Déplacement réel des électrons <LatexMath math="\vec{v}_d = -\mu \vec{E}" />
              </div>
            </Html>
          </group>
        </>
      )}

      {/* ── 5. FIXED LATTICE CATIONS Cu2+ ── */}
      {latticeIons.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh
            ref={(el) => {
              ionMeshRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#9a3412"
              emissiveIntensity={0.35}
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* ── 6. GOLDEN TRAIL LINE FOR TRACKED ELECTRON ── */}
      {trailLinePoints.length > 1 && (
        <Line
          points={trailLinePoints}
          color="#facc15"
          lineWidth={2.8}
          transparent
          opacity={0.9}
        />
      )}

      {/* ── 7. FREE ELECTRONS ── */}
      {Array.from({ length: trackSingle ? 1 : 32 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[idx === 0 ? 0.09 : 0.055, 12, 12]} />
          <meshStandardMaterial
            color={idx === 0 ? "#facc15" : "#38bdf8"}
            emissive={idx === 0 ? "#eab308" : "#0284c7"}
            emissiveIntensity={idx === 0 ? 1.5 : 0.9}
          />
        </mesh>
      ))}

      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2} />
      <OrbitControls enableZoom={true} maxDistance={12} minDistance={4} />
    </>
  );
}

/* ── MAIN COMPONENT WITH STEPPER INTERFACE ── */
export default function DrudeConduction3DCanvas() {
  const [phase, setPhase] = useState<number>(0); // 0: E=0, 1: U connected, 2: Steady state & Joule
  const [voltageV, setVoltageV] = useState<number>(3.0);
  const [temperature, setTemperature] = useState<number>(300);
  const [trackSingle, setTrackSingle] = useState<boolean>(false);

  const nextPhase = () => setPhase((p) => Math.min(2, p + 1));
  const prevPhase = () => setPhase((p) => Math.max(0, p - 1));

  const driftVelocityMms = useMemo(() => {
    if (phase === 0) return "0.00";
    return (0.05 * voltageV).toFixed(2);
  }, [phase, voltageV]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* ── TOP SPLIT VIEW: LEFT STEP CARD & RIGHT 3D CANVAS ── */}
      <div className="flex flex-col lg:flex-row w-full">
        
        {/* LEFT PANEL: EXPLANATORY STEP CARD */}
        <div className="w-full lg:w-[40%] p-4 sm:p-5 flex flex-col justify-between bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4">
          
          <div className="space-y-3">
            {/* Step Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
              <Sparkles size={13} />
              <span>Étape {phase + 1} / 3</span>
            </div>

            {/* Step 1: No Electric Field */}
            {phase === 0 && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <h4 className="text-base font-extrabold text-white">
                  1. Fil Isolé : Agitation Thermique Seule
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Le fil n&apos;est connecté à aucun générateur (<LatexMath math="U = 0\,\text{V}" />). Les électrons libres s&apos;agitent à une vitesse folle (<strong className="text-amber-300">~100 km/s à 300 K</strong>) et rebondissent dans tous les sens sur les ions du cuivre.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-xs text-slate-300">
                  <LatexMath math="\vec{E} = \vec{0} \implies \vec{v}_d = \vec{0} \implies I = 0\,\text{A}" />
                </div>
                <p className="text-[11px] text-slate-400">
                  {temperature === 0
                    ? "Au zéro absolu (T = 0 K), l'agitation thermique s'arrête : les électrons sont totalement immobiles."
                    : "En raison des collisions isotropes aléatoires, la vitesse moyenne est rigoureusement nulle : aucun courant ne circule."}
                </p>
              </div>
            )}

            {/* Step 2: Battery Connected */}
            {phase === 1 && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <h4 className="text-base font-extrabold text-white">
                  2. Connexion du Générateur & Champ <LatexMath math="\vec{E}" />
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Le générateur applique une tension <LatexMath math={`U = ${voltageV}\\,\\text{V}`} />. Un champ électrique <LatexMath math="\vec{E}" /> s&apos;établit instantanément dans le conducteur.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center font-mono text-xs text-cyan-300 font-bold">
                  <LatexMath math="\vec{F} = -e\vec{E} \implies \vec{v}_d = -\mu \vec{E}" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Les électrons sont attirés vers le pôle positif (+) à gauche. Le <strong>courant conventionnel <LatexMath math="I" /></strong> circule vers la droite.
                </p>
              </div>
            )}

            {/* Step 3: Steady State & Joule Effect */}
            {phase === 2 && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <h4 className="text-base font-extrabold text-white">
                  3. Régime Permanent & Effet Joule
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La vitesse de dérive s&apos;est stabilisée sous l&apos;effet des chocs répétés. Observez les <strong>flashs sur les ions</strong> lors des impacts : les électrons cèdent leur énergie cinétique, ce qui chauffe le fil (Effet Joule).
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center font-mono text-xs text-rose-300 font-bold">
                  <LatexMath math="p_J = \vec{j} \cdot \vec{E} = \gamma E^2 \quad \text{et} \quad P_J = R I^2" />
                </div>
              </div>
            )}
          </div>

          {/* Quick HUD Metrics */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tension <LatexMath math="U" /> :</span>
              <strong className="text-amber-400 font-mono">{phase === 0 ? "0.0 V" : `${voltageV.toFixed(1)} V`}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Vitesse thermique <LatexMath math="v_{\text{th}}" /> :</span>
              <strong className="text-amber-400 font-mono">
                {temperature === 0 ? "0 km/s (Figé)" : `~${Math.round(115 * Math.sqrt(temperature / 300))} km/s`}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Vitesse de dérive <LatexMath math="v_d" /> :</span>
              <strong className="text-cyan-400 font-mono">{driftVelocityMms} mm/s</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Température <LatexMath math="T" /> :</span>
              <strong className="text-rose-400 font-mono">{temperature} K</strong>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 3D VIEWPORT */}
        <div className="w-full lg:w-[60%] h-[290px] sm:h-[340px] relative bg-[#020510]">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.2, 6.0], fov: 45 }}>
            <Suspense fallback={null}>
              <Experiment3DScene
                phase={phase}
                voltageV={voltageV}
                temperature={temperature}
                trackSingle={trackSingle}
              />
            </Suspense>
          </Canvas>

          {/* Overlay Legend */}
          <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] space-y-1 text-slate-300 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Ions fixes (<LatexMath math="\text{Cu}^{2+}" />)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Électrons (<LatexMath math="e^-" />)</span>
            </div>
            {trackSingle && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="text-yellow-300 font-bold">Électron tracé</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM PANEL: NAVIGATION & EXPERIMENT CONTROLS ── */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap text-xs shadow-inner">
        
        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPhase}
            disabled={phase === 0}
            className={`px-3 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-xs transition-all ${
              phase === 0
                ? "bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <ChevronLeft size={15} /> Précédent
          </button>

          <button
            onClick={nextPhase}
            disabled={phase === 2}
            className={`px-4 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-xs transition-all ${
              phase === 2
                ? "bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-orange-600 border-orange-500 text-white hover:bg-orange-500 shadow-md shadow-orange-600/30"
            }`}
          >
            Suivant <ChevronRight size={15} />
          </button>
        </div>

        {/* Experiment Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Tension U Slider (active in phase 1 & 2) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold">Tension <LatexMath math="U" /> :</span>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={voltageV}
              onChange={(e) => setVoltageV(parseFloat(e.target.value))}
              disabled={phase === 0}
              className={`w-20 sm:w-24 h-1 bg-slate-800 rounded appearance-none accent-amber-500 ${phase === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
            />
            <span className="text-amber-400 font-mono font-bold text-[11px] min-w-[32px]">
              {phase === 0 ? "0 V" : `${voltageV.toFixed(1)}V`}
            </span>
          </div>

          {/* Temperature T Slider (0 K to 500 K) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold">Temp. <LatexMath math="T" /> :</span>
            <input
              type="range"
              min={0}
              max={500}
              step={25}
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
              className="w-20 sm:w-24 h-1 bg-slate-800 rounded appearance-none accent-rose-500 cursor-pointer"
            />
            <span className="text-rose-400 font-mono font-bold text-[11px] min-w-[40px]">
              {temperature}K
            </span>
          </div>

          {/* Tracer 1 Electron Button */}
          <button
            onClick={() => setTrackSingle(!trackSingle)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              trackSingle
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            <Target size={13} /> {trackSingle ? "Tous les électrons" : "Tracer 1 électron"}
          </button>
        </div>

      </div>

    </div>
  );
}
