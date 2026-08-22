"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { Zap, Play, Pause, Flame, Eye, RotateCcw, Target, Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface ElectronParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  baseThermalSpeed: number;
}

// 35 realistic electron seed particles initialized outside render for React 19 compliance
const INITIAL_ELECTRONS: ElectronParticle[] = Array.from({ length: 32 }).map((_, i) => {
  const p = new THREE.Vector3(
    (Math.sin(i * 13) * 0.5 + 0.5) * 4.6 - 2.3,
    (Math.cos(i * 17) * 0.5 + 0.5) * 1.6 - 0.8,
    (Math.sin(i * 29) * 0.5 + 0.5) * 1.6 - 0.8
  );
  const angle = (i / 32) * Math.PI * 2;
  const v = new THREE.Vector3(Math.cos(angle), Math.sin(angle * 2), Math.cos(angle * 3)).normalize();
  return {
    pos: p,
    vel: v,
    baseThermalSpeed: 0.85 + (i % 4) * 0.15,
  };
});

function RealisticCopperWireScene({
  eField,
  temperature,
  isPlaying,
  driftOnly,
  trackSingle,
}: {
  eField: number;
  temperature: number;
  isPlaying: boolean;
  driftOnly: boolean;
  trackSingle: boolean;
}) {
  // Ordered lattice of Cu2+ ions arranged inside the cylinder
  const latticeIons = useMemo(() => {
    const ions: THREE.Vector3[] = [];
    const layersX = [-1.8, -0.9, 0, 0.9, 1.8];
    const ringRadius = 0.65;

    layersX.forEach((x) => {
      // Center ion
      ions.push(new THREE.Vector3(x, 0, 0));
      // Surrounding hexagonal ring ions
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
  }, [trackSingle, driftOnly]);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const thermalFactor = driftOnly ? 0 : Math.sqrt(temperature / 300) * 1.4;
    const driftSpeed = eField * 0.45;
    const cylinderRadius = 0.95;
    const halfLength = 2.4;

    const countToUpdate = trackSingle ? 1 : electronsRef.current.length;

    for (let idx = 0; idx < countToUpdate; idx++) {
      const el = electronsRef.current[idx];

      if (!driftOnly) {
        // Thermal random motion
        el.pos.x += el.vel.x * el.baseThermalSpeed * thermalFactor * delta;
        el.pos.y += el.vel.y * el.baseThermalSpeed * thermalFactor * delta;
        el.pos.z += el.vel.z * el.baseThermalSpeed * thermalFactor * delta;

        // Radial boundary collision inside cylindrical wire
        const rCurrent = Math.sqrt(el.pos.y * el.pos.y + el.pos.z * el.pos.z);
        if (rCurrent > cylinderRadius) {
          const normalY = el.pos.y / rCurrent;
          const normalZ = el.pos.z / rCurrent;
          // Reflect velocity vector
          const dot = el.vel.y * normalY + el.vel.z * normalZ;
          el.vel.y -= 2 * dot * normalY;
          el.vel.z -= 2 * dot * normalZ;
          el.pos.y = normalY * cylinderRadius;
          el.pos.z = normalZ * cylinderRadius;
        }

        // Longitudinal boundary collision
        if (Math.abs(el.pos.x) > halfLength) {
          el.vel.x = -el.vel.x;
          el.pos.x = Math.sign(el.pos.x) * halfLength;
        }

        // Collision with Cu2+ cations
        for (let ionIdx = 0; ionIdx < latticeIons.length; ionIdx++) {
          const ionPos = latticeIons[ionIdx];
          if (el.pos.distanceTo(ionPos) < 0.28) {
            // Elastic collision / scatter velocity
            el.vel.set(
              Math.sin(el.pos.x * 12 + ionIdx),
              Math.cos(el.pos.y * 12 + ionIdx),
              Math.sin(el.pos.z * 12 + ionIdx)
            ).normalize();

            // Ion glow impact
            const ionMesh = ionMeshRefs.current[ionIdx];
            if (ionMesh && ionMesh.material) {
              const mat = ionMesh.material as THREE.MeshStandardMaterial;
              mat.emissiveIntensity = 1.3;
            }
          }
        }
      }

      // Applied Electric Field Drift towards Left (towards + terminal at left)
      el.pos.x -= driftSpeed * delta;
      if (el.pos.x < -halfLength) {
        el.pos.x = halfLength;
        if (idx === 0) {
          trailPointsRef.current = [];
        }
      }

      const mesh = meshRefs.current[idx];
      if (mesh) {
        mesh.position.copy(el.pos);
      }

      // Track trajectory of electron #0
      if (idx === 0) {
        trailPointsRef.current.push(el.pos.clone());
        if (trailPointsRef.current.length > 90) {
          trailPointsRef.current.shift();
        }
      }
    }

    // Decay ion glow back to ambient
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
      <directionalLight position={[5, 8, 6]} intensity={1.8} />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[6, 4, -4]} intensity={0.6} color="#f59e0b" />

      {/* ── 1. REALISTIC CYLINDRICAL COPPER WIRE (Cutaway view) ── */}
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* Outer Translucent Metallic Glass Sheath */}
        <Cylinder args={[1.05, 1.05, 5.0, 36, 1, true]}>
          <meshStandardMaterial
            color="#b45309"
            emissive="#78350f"
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.85}
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </Cylinder>

        {/* Wireframe Guides */}
        <Cylinder args={[1.05, 1.05, 5.0, 16, 5, true]}>
          <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.2} />
        </Cylinder>
      </group>

      {/* ── 2. POLARITY TERMINAL PLATES (Left: +, Right: -) ── */}
      {/* Terminal + (Anode) at Left */}
      <group position={[-2.55, 0, 0]}>
        <Cylinder args={[1.12, 1.12, 0.12, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} metalness={0.9} />
        </Cylinder>
        <Html position={[0, 1.45, 0]} center>
          <div className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
            Borne (+) • Potentiel Élevé
          </div>
        </Html>
      </group>

      {/* Terminal - (Cathode) at Right */}
      <group position={[2.55, 0, 0]}>
        <Cylinder args={[1.12, 1.12, 0.12, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.6} metalness={0.9} />
        </Cylinder>
        <Html position={[0, 1.45, 0]} center>
          <div className="bg-blue-950/90 border border-blue-500/50 text-blue-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
            Borne (-) • Potentiel Bas
          </div>
        </Html>
      </group>

      {/* ── 3. FIELD & CURRENT VECTORS ── */}
      {eField > 0 && (
        <>
          {/* Top Arrow: E-Field & Conventional Current (Pointing Right) */}
          <group position={[0, 1.75, 0]}>
            <Cylinder args={[0.035, 0.035, 3.4]} rotation={[0, 0, -Math.PI / 2]}>
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[1.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.13, 0.32, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
            </mesh>
            <Html position={[0, 0.22, 0]} center>
              <div className="bg-amber-950/90 border border-amber-500/40 text-amber-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
                Champ <LatexMath math="\vec{E}" /> & Courant <LatexMath math="I" /> (Sens conventionnel) →
              </div>
            </Html>
          </group>

          {/* Bottom Arrow: Electron Drift Velocity vd (Pointing Left) */}
          <group position={[0, -1.75, 0]}>
            <Cylinder args={[0.035, 0.035, 3.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.13, 0.32, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </mesh>
            <Html position={[0, -0.22, 0]} center>
              <div className="bg-sky-950/90 border border-sky-500/40 text-sky-300 font-mono text-[9px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
                ← Déplacement réel des électrons <LatexMath math="\vec{v}_d = -\mu \vec{E}" />
              </div>
            </Html>
          </group>
        </>
      )}

      {/* ── 4. LATTICE CATIONS Cu2+ (Fixed Copper Ions) ── */}
      {latticeIons.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh
            ref={(el) => {
              ionMeshRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.16, 16, 16]} />
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

      {/* ── 5. GOLDEN TRAIL LINE (For Tracked Electron #0) ── */}
      {trailLinePoints.length > 1 && (
        <Line
          points={trailLinePoints}
          color="#facc15"
          lineWidth={2.8}
          transparent
          opacity={0.9}
        />
      )}

      {/* ── 6. FREE ELECTRONS ── */}
      {Array.from({ length: trackSingle ? 1 : 32 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[idx === 0 ? 0.095 : 0.06, 12, 12]} />
          <meshStandardMaterial
            color={idx === 0 ? "#facc15" : "#38bdf8"}
            emissive={idx === 0 ? "#eab308" : "#0284c7"}
            emissiveIntensity={idx === 0 ? 1.5 : 0.9}
          />
        </mesh>
      ))}

      <OrbitControls enableZoom={true} maxDistance={10} minDistance={3.5} />
    </>
  );
}

export default function DrudeConduction3DCanvas() {
  const [eField, setEField] = useState<number>(3.0);
  const [temperature, setTemperature] = useState<number>(300);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [driftOnly, setDriftOnly] = useState<boolean>(false);
  const [trackSingle, setTrackSingle] = useState<boolean>(false);

  const driftVelocityMms = useMemo(() => {
    return (0.05 * eField).toFixed(2);
  }, [eField]);

  const setPreset = (type: "zero" | "normal" | "strong" | "hot") => {
    if (type === "zero") {
      setEField(0);
      setTemperature(300);
      setDriftOnly(false);
    } else if (type === "normal") {
      setEField(3.0);
      setTemperature(300);
      setDriftOnly(false);
    } else if (type === "strong") {
      setEField(7.0);
      setTemperature(300);
      setDriftOnly(false);
    } else if (type === "hot") {
      setEField(3.0);
      setTemperature(480);
      setDriftOnly(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header Bar with Presets */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-bold text-white tracking-wide">
            Fil de Cuivre 3D • Mouvement Microscopique des Charges
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setTrackSingle(!trackSingle)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              trackSingle
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Target size={13} /> {trackSingle ? "Tous les électrons" : "Tracer 1 électron"}
          </button>

          <button
            onClick={() => setDriftOnly(!driftOnly)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              driftOnly ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Eye size={13} /> {driftOnly ? "Dérive Seule" : "Réel (Chaos)"}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={() => setPreset("normal")}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-[#030612]">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.2, 5.8], fov: 46 }}>
          <Suspense fallback={null}>
            <RealisticCopperWireScene
              eField={eField}
              temperature={temperature}
              isPlaying={isPlaying}
              driftOnly={driftOnly}
              trackSingle={trackSingle}
            />
          </Suspense>
        </Canvas>

        {/* Legend Overlay */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] space-y-1 text-slate-300 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Ions fixes du cuivre (<LatexMath math="\text{Cu}^{2+}" />)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Électrons de conduction (<LatexMath math="e^-" />)</span>
          </div>
          {trackSingle && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="text-yellow-300 font-bold">Électron tracé & trajectoire</span>
            </div>
          )}
        </div>

        {/* HUD stats */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] shadow">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Vitesse de dérive <LatexMath math="v_d" /> : </span>
            <strong className="text-cyan-400 font-mono">{driftVelocityMms} mm/s</strong>
          </div>
          <p className="text-[9px] text-slate-500 text-right">Échelle visuelle amplifiée</p>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] overflow-x-auto">
        <span className="text-slate-500 font-bold shrink-0">Scénarios :</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setPreset("zero")}
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all ${
              eField === 0 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            1. Sans Champ (E = 0)
          </button>
          <button
            onClick={() => setPreset("normal")}
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all ${
              eField === 3 && temperature === 300 ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            2. Régime Normal (300 K)
          </button>
          <button
            onClick={() => setPreset("strong")}
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all ${
              eField === 7 ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            3. Fort Champ (E ↑)
          </button>
          <button
            onClick={() => setPreset("hot")}
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all ${
              temperature > 400 ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            4. Fil Chaud (T ↑)
          </button>
        </div>
      </div>

      {/* Sliders Area */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1">
              <Zap size={12} className="text-amber-400" /> Champ Électrique appliqué <LatexMath math="E" /> :
            </span>
            <span className="text-amber-400 font-mono font-bold">{eField.toFixed(1)} V/m</span>
          </div>
          <input
            type="range"
            min={0}
            max={8}
            step={0.5}
            value={eField}
            onChange={(e) => setEField(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1">
              <Flame size={12} className="text-rose-400" /> Température du fil <LatexMath math="T" /> :
            </span>
            <span className="text-rose-400 font-mono font-bold">{temperature} K ({temperature - 273} °C)</span>
          </div>
          <input
            type="range"
            min={100}
            max={500}
            step={50}
            value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
        <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          {eField === 0 ? (
            <span><strong>Sans champ (E = 0) :</strong> Les électrons s&apos;agitent à <LatexMath math="100\,\text{km/s}" /> dans toutes les directions. La vitesse moyenne est nulle (<LatexMath math="\vec{v}_d = \vec{0}" />) et il n&apos;y a aucun courant électrique.</span>
          ) : temperature > 400 ? (
            <span><strong>Fil chaud ({temperature} K) :</strong> L&apos;agitation thermique est très violente. Les chocs avec les ions sont plus fréquents, ce qui freine la progression globale (la résistance <LatexMath math="R" /> augmente avec la température).</span>
          ) : (
            <span><strong>Sous champ E :</strong> La force électrique <LatexMath math="\vec{F} = -e\vec{E}" /> pousse les électrons vers la gauche (borne +). Le courant conventionnel <LatexMath math="I" /> circule vers la droite.</span>
          )}
        </div>
      </div>
    </div>
  );
}
