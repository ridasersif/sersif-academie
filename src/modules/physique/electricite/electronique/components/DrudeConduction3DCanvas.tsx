"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, Line, Box, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ChevronRight, ChevronLeft, Target, Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface ElectronParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  baseThermalSpeed: number;
}

// 32 electrons initialized statically
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
  phase: number;
  voltageV: number;
  temperature: number;
  trackSingle: boolean;
}) {
  const isConnected = phase >= 1;
  const eFieldMagnitude = isConnected ? voltageV / 2.0 : 0;

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

  // Sparks for Joule effect (Heat/Energy release)
  interface Spark {
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    life: number;
    colorIndex: number;
  }
  const sparksRef = useRef<Spark[]>(Array.from({length: 40}).map(() => ({
    pos: new THREE.Vector3(0, -100, 0),
    vel: new THREE.Vector3(0,0,0),
    life: 0,
    colorIndex: 0
  })));
  const sparkMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const nextSparkIdx = useRef(0);

  useEffect(() => {
    trailPointsRef.current = [];
  }, [trackSingle, phase]);

  useFrame((_, delta) => {
    const thermalFactor = temperature === 0 ? 0 : Math.sqrt(temperature / 300) * (2.2 + (temperature > 300 ? (temperature - 300) / 45 : 0));
    const driftSpeed = eFieldMagnitude * 1.25;
    const cylinderRadius = 0.85;
    const halfLength = 2.3;

    const countToUpdate = trackSingle ? 1 : electronsRef.current.length;

    for (let idx = 0; idx < countToUpdate; idx++) {
      const el = electronsRef.current[idx];

      // Thermal random motion
      el.pos.x += el.vel.x * el.baseThermalSpeed * thermalFactor * delta;
      el.pos.y += el.vel.y * el.baseThermalSpeed * thermalFactor * delta;
      el.pos.z += el.vel.z * el.baseThermalSpeed * thermalFactor * delta;

      // Radial collision with cylinder wall
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

      // Elastic ion collisions
      const collisionRadius = 0.20;
      for (let ionIdx = 0; ionIdx < latticeIons.length; ionIdx++) {
        const ionPos = latticeIons[ionIdx];
        const dist = el.pos.distanceTo(ionPos);
        if (dist < collisionRadius) {
          const normal = el.pos.clone().sub(ionPos);
          if (normal.lengthSq() < 0.0001) {
            normal.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
          }
          normal.normalize();

          el.vel.reflect(normal);
          el.vel.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
          )).normalize();

          el.pos.copy(ionPos.clone().add(normal.multiplyScalar(collisionRadius + 0.02)));

          // Joule Effect (Phase 2 & 3: Field is on)
          if (phase === 2) {
            const ionMesh = ionMeshRefs.current[ionIdx];
            if (ionMesh && ionMesh.material) {
              const mat = ionMesh.material as THREE.MeshStandardMaterial;
              mat.emissiveIntensity = 2.0; // Stronger glow on impact
            }
          }
        }
      }

      // Applied Electric Field Drift (towards Left)
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

    // Continuous radial spark emission in Phase 2
    if (phase === 2 && Math.random() < 0.6) {
      const spark = sparksRef.current[nextSparkIdx.current];
      const angle = Math.random() * Math.PI * 2;
      const x = (Math.random() - 0.5) * 4.4;
      const r = 0.95; // Surface of cylinder
      spark.pos.set(x, Math.sin(angle) * r, Math.cos(angle) * r);
      
      const speed = Math.random() * 3 + 2;
      spark.vel.set((Math.random()-0.5)*0.5, Math.sin(angle) * speed, Math.cos(angle) * speed);
      spark.life = 1.0;
      
      const mesh = sparkMeshRefs.current[nextSparkIdx.current];
      if (mesh) {
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spark.vel.clone().normalize());
      }
      nextSparkIdx.current = (nextSparkIdx.current + 1) % 40;
    }

    // Decay ion glow & Vibrate them (Heat)
    latticeIons.forEach((pos, ionIdx) => {
      const ionMesh = ionMeshRefs.current[ionIdx];
      if (ionMesh && ionMesh.material) {
        const mat = ionMesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity > 0.35) {
          mat.emissiveIntensity -= delta * 2.5;
        }
        
        // Vibrate ions based on heat/glow (Joule effect)
        if (phase === 2 && mat.emissiveIntensity > 0.5) {
          const shake = (mat.emissiveIntensity - 0.5) * 0.08;
          ionMesh.position.set(
            pos.x + (Math.random()-0.5)*shake,
            pos.y + (Math.random()-0.5)*shake,
            pos.z + (Math.random()-0.5)*shake
          );
        } else {
          ionMesh.position.copy(pos); // Return to stable
        }
      }
    });

    // Update Sparks
    sparksRef.current.forEach((spark, idx) => {
      const mesh = sparkMeshRefs.current[idx];
      if (spark.life > 0) {
        spark.pos.add(spark.vel.clone().multiplyScalar(delta));
        spark.life -= delta * 1.5;
        if (mesh) {
          mesh.position.copy(spark.pos);
          mesh.scale.set(1, Math.max(0.01, spark.life), 1);
          mesh.visible = true;
        }
      } else {
        if (mesh) mesh.visible = false;
      }
    });

    if (trailPointsRef.current.length > 2) {
      setTrailLinePoints(trailPointsRef.current.map((p) => [p.x, p.y, p.z]));
    }
  });

  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[6, 8, 5]} intensity={1.8} />
      <pointLight position={[-6, -4, -4]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[6, 4, -4]} intensity={0.6} color="#f59e0b" />

      {/* ── 1. REALISTIC CYLINDRICAL COPPER WIRE (Cutaway view) ── */}
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

      {/* ── 2. POLARITY TERMINAL PLATES ── */}
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
      </group>

      {/* ── 3. FIELD & CURRENT VECTOR ARROWS (Only arrows, no text) ── */}
      {isConnected && (
        <>
          {/* Top Arrow: Electric Field E & Current I (Pointing Right ->) */}
          <group position={[0, 1.35, 0]}>
            <Cylinder args={[0.03, 0.03, 3.2]} rotation={[0, 0, -Math.PI / 2]}>
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[1.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
            </mesh>
          </group>

          {/* Sub-tube Arrow: Electron Drift vd (Pointing Left <-) */}
          <group position={[0, -1.25, 0]}>
            <Cylinder args={[0.025, 0.025, 3.0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
            </Cylinder>
            <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.10, 0.25, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </mesh>
          </group>
        </>
      )}

      {/* ── 4. BEAUTIFUL REALISTIC PANEL VOLTMETER (Scaled down & clean) ── */}
      {isConnected && (
        <>
          <group position={[0, -2.4, 0.2]} rotation={[-0.1, 0, 0]} scale={0.65}>
            
            {/* Main Rectangular Casing */}
            <Box args={[3.2, 1.8, 0.4]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </Box>
            
            {/* Chrome Bezel Frame */}
            <Box args={[2.9, 1.5, 0.45]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
            </Box>

            {/* White Dial Face */}
            <Box args={[2.7, 1.3, 0.42]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#f8fafc" roughness={0.9} />
            </Box>

            {/* High-Resolution SVG Dial Face */}
            <Html transform position={[0, 0.05, 0.215]} scale={0.25} zIndexRange={[100, 0]}>
              <div className="w-[380px] h-[190px] flex flex-col items-center justify-end font-sans text-slate-800 select-none pb-4">
                <svg width="340" height="160" viewBox="0 0 340 160" className="absolute top-2">
                  <path d="M 40 150 A 130 130 0 0 1 300 150" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                  <path d="M 40 150 A 130 130 0 0 1 300 150" fill="none" stroke="url(#gradient)" strokeWidth="6" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <g fill="#0f172a" fontSize="16" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    <text x="35" y="170">0</text>
                    <text x="75" y="90">2</text>
                    <text x="170" y="55">4</text>
                    <text x="265" y="90">6</text>
                    <text x="305" y="170">8</text>
                    <line x1="40" y1="150" x2="50" y2="145" stroke="#475569" strokeWidth="2" />
                    <line x1="300" y1="150" x2="290" y2="145" stroke="#475569" strokeWidth="2" />
                    <line x1="170" y1="20" x2="170" y2="32" stroke="#475569" strokeWidth="3" />
                    <line x1="83" y1="62" x2="93" y2="72" stroke="#475569" strokeWidth="2" />
                    <line x1="257" y1="62" x2="247" y2="72" stroke="#475569" strokeWidth="2" />
                  </g>
                </svg>

                <div className="absolute bottom-4 flex flex-col items-center">
                  <span className="text-4xl font-black font-serif leading-none tracking-tighter text-slate-900">V</span>
                  <div className="mt-2 bg-slate-900 text-emerald-400 font-mono font-bold text-xl px-4 py-1.5 rounded-lg shadow-inner border border-slate-700">
                    {voltageV.toFixed(2)}
                  </div>
                </div>
              </div>
            </Html>

            {/* Pivot Hub */}
            <group position={[0, -0.65, 0.22]}>
              <Cylinder args={[0.2, 0.2, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
              </Cylinder>
              <Cylinder args={[0.12, 0.12, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#334155" metalness={0.6} />
              </Cylinder>

              {/* Dynamic Red Needle */}
              <group rotation={[0, 0, (Math.PI / 3) - (voltageV / 8.0) * (2 * Math.PI / 3)]}>
                <Cylinder args={[0.015, 0.035, 1.4, 16]} position={[0, 0.7, 0.02]}>
                  <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} />
                </Cylinder>
                <mesh position={[0, 1.4, 0.02]}>
                  <coneGeometry args={[0.025, 0.1, 16]} />
                  <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} />
                </mesh>
              </group>
            </group>

            {/* Left Red (+) Terminal Post */}
            <group position={[-1.1, -1.0, 0.2]}>
              <Cylinder args={[0.15, 0.15, 0.25, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#ef4444" metalness={0.4} roughness={0.5} />
              </Cylinder>
              <Cylinder args={[0.08, 0.08, 0.35, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#b91c1c" metalness={0.8} />
              </Cylinder>
            </group>

            {/* Right Blue (-) Terminal Post */}
            <group position={[1.1, -1.0, 0.2]}>
              <Cylinder args={[0.15, 0.15, 0.25, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" metalness={0.4} roughness={0.5} />
              </Cylinder>
              <Cylinder args={[0.08, 0.08, 0.35, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#1d4ed8" metalness={0.8} />
              </Cylinder>
            </group>
          </group>

          {/* Curved Realistic Cables (Rendered in GLOBAL space to connect cleanly to plates) */}
          <Line
            points={[
              [-0.715, -3.05, 0.33], // Start at left terminal (scaled & rotated pos)
              [-1.8, -3.2, 0.1],     // Slack down
              [-2.6, -2.0, 0],       // Curve up
              [-2.45, -0.95, 0],     // End at bottom of left plate
            ]}
            color="#ef4444"
            lineWidth={3.5}
          />

          <Line
            points={[
              [0.715, -3.05, 0.33],  // Start at right terminal
              [1.8, -3.2, 0.1],      // Slack down
              [2.6, -2.0, 0],        // Curve up
              [2.45, -0.95, 0],      // End at bottom of right plate
            ]}
            color="#3b82f6"
            lineWidth={3.5}
          />
        </>
      )}

      {/* ── 5. FIXED LATTICE CATIONS Cu2+ ── */}
      {latticeIons.map((pos, idx) => (
        <mesh
          key={idx}
          position={pos}
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

      {/* ── 8. HEAT SPARKS / LIGHTNING (JOULE EFFECT) ── */}
      {Array.from({ length: 40 }).map((_, idx) => (
        <mesh
          key={`spark-${idx}`}
          ref={(el) => {
            sparkMeshRefs.current[idx] = el;
          }}
          visible={false}
        >
          {/* Thin, long streak to look like a fast spark or lightning */}
          <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? "#facc15" : "#f59e0b"}
            emissive={idx % 2 === 0 ? "#eab308" : "#d97706"}
            emissiveIntensity={4.0}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      <ContactShadows position={[0, -2.8, 0]} opacity={0.5} scale={10} blur={2} />
      <OrbitControls enableZoom={true} maxDistance={12} minDistance={4} />
    </>
  );
}

/* ── MAIN COMPONENT WITH STEPPER INTERFACE ── */
export default function DrudeConduction3DCanvas() {
  const [phase, setPhase] = useState<number>(0);
  const [voltageV, setVoltageV] = useState<number>(3.0);
  const [temperature, setTemperature] = useState<number>(300);
  const [trackSingle, setTrackSingle] = useState<boolean>(false);

  // Auto-heating (Joule Effect) in Phase 3
  useEffect(() => {
    if (phase === 2) {
      // The maximum temperature depends on the voltage squared (P = V^2 / R)
      // We approximate it linearly here for visual effect, up to ~650K
      const maxTemp = Math.floor(300 + (voltageV * voltageV) * 6);
      
      const interval = setInterval(() => {
        setTemperature(prev => {
          if (prev < maxTemp) return Math.min(maxTemp, prev + 4);
          if (prev > maxTemp) return Math.max(maxTemp, prev - 4);
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase, voltageV]);

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
        <div className="w-full lg:w-[60%] h-[300px] sm:h-[360px] relative bg-[#020510]">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.8, 6.4], fov: 46 }}>
            <Suspense fallback={null}>
              <Experiment3DScene
                phase={phase}
                voltageV={voltageV}
                temperature={temperature}
                trackSingle={trackSingle}
              />
            </Suspense>
          </Canvas>

          {/* Overlay Thermometer Gauge */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2 pt-3 rounded-full flex flex-col items-center gap-1 shadow-lg pointer-events-none">
            <div className="text-[9px] text-slate-400 font-bold mb-0.5">°K</div>
            <div className="w-2.5 h-32 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end relative shadow-inner">
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-rose-600 rounded-full transition-all duration-100 ease-linear"
                style={{ height: `${Math.min(100, Math.max(0, (temperature / 700) * 100))}%` }}
              ></div>
            </div>
            <div className={`w-5 h-5 rounded-full ${temperature > 350 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'} border-2 border-slate-900 -mt-2.5 z-10 transition-colors duration-300`}></div>
            <div className={`text-[10px] font-mono font-bold mt-1 ${temperature > 350 ? 'text-rose-400' : 'text-orange-400'} transition-colors duration-300`}>
              {temperature}
            </div>
          </div>

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
              max={700}
              step={25}
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
              disabled={phase === 2}
              className={`w-20 sm:w-24 h-1 bg-slate-800 rounded appearance-none accent-rose-500 ${phase === 2 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
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
