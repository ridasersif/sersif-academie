"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Play, Pause, RotateCcw, Zap, Activity, Layers } from "lucide-react";

// Real-time Mini Oscilloscope Waveform Component
function LiveOscilloscope({ emf, eMax }: { emf: number; eMax: number }) {
  const [history, setHistory] = useState<number[]>(() => Array(45).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), emf]);
  }, [emf]);

  const width = 115;
  const height = 34;
  const midY = height / 2;
  const scaleY = eMax > 0.05 ? (height * 0.42) / eMax : 1;

  const points = history
    .map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = midY - val * scaleY;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="w-[115px] h-[34px] bg-slate-950/90 rounded-lg border border-cyan-500/30 overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20" />
      <svg className="w-full h-full relative z-10" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.8))" }}
        />
      </svg>
      <div className="absolute top-0.5 right-1 text-[7px] font-mono font-bold text-cyan-400">
        e(t)
      </div>
    </div>
  );
}

// Curved Magnet Pole Shell (Aligned horizontally along Z)
function CylindricalPoleShell({
  type,
  radius = 1.15,
  length = 1.8,
  arcDeg = 95,
}: {
  type: "N" | "S";
  radius?: number;
  length?: number;
  arcDeg?: number;
}) {
  const isNorth = type === "N";
  const mainColor = isNorth ? "#ef4444" : "#3b82f6";
  const arcRad = (arcDeg * Math.PI) / 180;
  const startAngle = isNorth ? -arcRad / 2 : Math.PI - arcRad / 2;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const segments = 28;
    const rIn = radius;
    const rOut = radius + 0.1;

    const outerPts: THREE.Vector2[] = [];
    const innerPts: THREE.Vector2[] = [];

    for (let i = 0; i <= segments; i++) {
      const a = startAngle + (i / segments) * arcRad;
      outerPts.push(new THREE.Vector2(Math.cos(a) * rOut, Math.sin(a) * rOut));
      innerPts.push(new THREE.Vector2(Math.cos(a) * rIn, Math.sin(a) * rIn));
    }

    shape.moveTo(outerPts[0].x, outerPts[0].y);
    for (let i = 1; i <= segments; i++) shape.lineTo(outerPts[i].x, outerPts[i].y);
    for (let i = segments; i >= 0; i--) shape.lineTo(innerPts[i].x, innerPts[i].y);
    shape.closePath();

    const extrudeSettings = {
      depth: length,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.translate(0, 0, -length / 2);
    return geom;
  }, [radius, length, arcRad, startAngle]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={mainColor}
        roughness={0.3}
        metalness={0.2}
        clearcoat={0.3}
      />
    </mesh>
  );
}

// B-Field Lines: Strictly pointing from North Pole (Red, +X) to South Pole (Blue, -X)
function FieldFluxLines() {
  const lines = useMemo(() => [
    { y: 0.4, z: 0.35 },
    { y: 0.4, z: -0.35 },
    { y: 0.0, z: 0.45 },
    { y: 0.0, z: -0.45 },
    { y: -0.4, z: 0.35 },
    { y: -0.4, z: -0.35 },
  ], []);

  return (
    <group>
      {lines.map((pos, idx) => (
        <group key={idx} position={[0, pos.y, pos.z]}>
          {/* Cyan streamline from +X (North) to -X (South) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 1.7, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
          </mesh>
          {/* Arrowhead cone pointing strictly towards -X (South Pole) */}
          <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.025, 0.1, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Load Resistor at the front of the circuit (Seamlessly plugged into wires)
function LoadResistor({ emf, eMax }: { emf: number; eMax: number }) {
  const intensity = eMax > 0.05 ? Math.min(1, Math.abs(emf) / Math.max(eMax, 4.0)) : 0;
  const isGlowing = intensity > 0.02;

  return (
    <group position={[0, 0, 1.85]}>
      {/* Resistor Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.3, 20]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.3}
          metalness={0.4}
          emissive={isGlowing ? "#38bdf8" : "#000000"}
          emissiveIntensity={intensity * 1.8}
        />
      </mesh>
      {/* Left Silver Terminal Cap (-) */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 20]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Right Silver Terminal Cap (+) */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 20]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Dynamic Glow */}
      {isGlowing && (
        <pointLight position={[0, 0, 0]} intensity={intensity * 2.5} distance={1.8} color="#38bdf8" />
      )}
    </group>
  );
}

// 3D Scene Controller
const AlternatorVisualization = ({
  speed,
  isPaused,
  onUpdateValues,
}: {
  speed: number;
  isPaused: boolean;
  onUpdateValues: (emf: number, eMax: number) => void;
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const thetaRef = useRef(0);

  const loopH = 1.3; // height along Y
  const loopL = 1.4; // length along Z
  const B0 = 1.0;
  const turns = 1;   // Standard single turn loop
  const S = loopH * loopL;

  useFrame((_, delta) => {
    if (isPaused || speed === 0) {
      const e = turns * B0 * S * speed * Math.sin(thetaRef.current);
      const eMax = turns * B0 * S * speed;
      onUpdateValues(e, eMax);
      return;
    }

    if (rotorRef.current) {
      thetaRef.current += speed * delta;
      rotorRef.current.rotation.z = thetaRef.current;

      const e = turns * B0 * S * speed * Math.sin(thetaRef.current);
      const eMax = turns * B0 * S * speed;
      onUpdateValues(e, eMax);
    }
  });

  const currentEmf = turns * B0 * S * speed * Math.sin(thetaRef.current);
  const currentEMax = turns * B0 * S * speed;

  const commutatorRadius = 0.16;
  const commutatorZ = loopL / 2 + 0.35; // z = 1.05

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Curved Stator Pole Shells */}
      <CylindricalPoleShell type="N" radius={1.05} length={1.6} arcDeg={95} />
      <CylindricalPoleShell type="S" radius={1.05} length={1.6} arcDeg={95} />

      {/* 2. Magnetic Flux Streamlines */}
      <FieldFluxLines />

      {/* 3. Central Stainless Steel Axle */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.6, 20]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 4. ROTATING ASSEMBLY (Loop + Commutator Rings) */}
      <group ref={rotorRef} position={[0, 0, 0]}>
        {/* Rectangular Copper Loop Wires */}
        {/* Top horizontal wire */}
        <mesh position={[0, loopH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, loopL, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        {/* Bottom horizontal wire */}
        <mesh position={[0, -loopH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, loopL, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        {/* Back vertical wire */}
        <mesh position={[0, 0, -loopL / 2]}>
          <cylinderGeometry args={[0.022, 0.022, loopH, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        {/* Front vertical wire */}
        <mesh position={[0, 0, loopL / 2]}>
          <cylinderGeometry args={[0.022, 0.022, loopH, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* Central Dual-Color Flux Area (Blue front, Red back) */}
        <mesh position={[0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[loopL, loopH]} />
          <meshPhysicalMaterial color="#3b82f6" roughness={0.3} metalness={0.1} side={THREE.FrontSide} />
        </mesh>
        <mesh position={[-0.004, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[loopL, loopH]} />
          <meshPhysicalMaterial color="#ef4444" roughness={0.3} metalness={0.1} side={THREE.FrontSide} />
        </mesh>

        {/* CONTINUOUS ROTATING COPPER TERMINALS (Welded to Loop & Commutator) */}
        {/* Top Lead */}
        <mesh position={[0, (loopH / 2 + commutatorRadius) / 2, loopL / 2]}>
          <cylinderGeometry args={[0.02, 0.02, loopH / 2 - commutatorRadius, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, commutatorRadius, loopL / 2 + (commutatorZ - loopL / 2) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, commutatorZ - loopL / 2, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* Bottom Lead */}
        <mesh position={[0, -(loopH / 2 + commutatorRadius) / 2, loopL / 2]}>
          <cylinderGeometry args={[0.02, 0.02, loopH / 2 - commutatorRadius, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, -commutatorRadius, loopL / 2 + (commutatorZ - loopL / 2) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, commutatorZ - loopL / 2, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* ROTATING SPLIT-RING COMMUTATOR */}
        <group position={[0, 0, commutatorZ]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[commutatorRadius, commutatorRadius, 0.22, 28, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
            <meshPhysicalMaterial color="#f59e0b" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[commutatorRadius, commutatorRadius, 0.22, 28, 1, true, Math.PI * 0.58, Math.PI * 0.84]} />
            <meshPhysicalMaterial color="#f59e0b" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Normal Vector n Arrow */}
        <group position={[0, 0, 0]}>
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* 5. STATIONARY CARBON BRUSHES & COLOR-CODED OUTPUT CIRCUIT */}
      {/* Left Carbon Brush touching split-ring at x = -commutatorRadius */}
      <mesh position={[-(commutatorRadius + 0.035), 0, commutatorZ]}>
        <boxGeometry args={[0.07, 0.07, 0.12]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.5} />
      </mesh>
      {/* Left Negative (-) Terminal Block - Blue */}
      <mesh position={[-(commutatorRadius + 0.085), 0, commutatorZ]}>
        <boxGeometry args={[0.04, 0.08, 0.1]} />
        <meshPhysicalMaterial color="#2563eb" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Right Carbon Brush touching split-ring at x = +commutatorRadius */}
      <mesh position={[commutatorRadius + 0.035, 0, commutatorZ]}>
        <boxGeometry args={[0.07, 0.07, 0.12]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.5} />
      </mesh>
      {/* Right Positive (+) Terminal Block - Red */}
      <mesh position={[commutatorRadius + 0.085, 0, commutatorZ]}>
        <boxGeometry args={[0.04, 0.08, 0.1]} />
        <meshPhysicalMaterial color="#dc2626" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* LEFT WIRE (BLUE / NEGATIVE −) */}
      <mesh position={[-(commutatorRadius + 0.085), 0, (commutatorZ + 1.85) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.85 - commutatorZ, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[(-(commutatorRadius + 0.085) - 0.15) / 2, 0, 1.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, (commutatorRadius + 0.085) - 0.15, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* RIGHT WIRE (RED / POSITIVE +) */}
      <mesh position={[commutatorRadius + 0.085, 0, (commutatorZ + 1.85) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.85 - commutatorZ, 12]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[(commutatorRadius + 0.085 + 0.15) / 2, 0, 1.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, (commutatorRadius + 0.085) - 0.15, 12]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* 6. Circuit Load Resistor */}
      <LoadResistor emf={currentEmf} eMax={currentEMax} />

      {/* Studio Floor Shadow */}
      <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={5} blur={2.0} far={2.5} />
    </group>
  );
};

export default function Alternator3DCanvas() {
  const [speed, setSpeed] = useState(2.0); // omega (rad/s)
  const [isPaused, setIsPaused] = useState(false);
  const [emfData, setEmfData] = useState({ e: 0, eMax: 0 });

  return (
    <div className="w-full flex flex-col gap-2 font-sans max-w-full select-none">
      <div className="w-full h-[280px] sm:h-[330px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-slate-800">
        
        {/* Top-Left Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-200 font-bold">Générateur / Dynamo</span>
          </div>
        </div>

        {/* Top-Right HUD: Oscilloscope & Digital Voltmeter */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-1.5 sm:p-2 rounded-xl shadow-xl pointer-events-none">
          <LiveOscilloscope emf={emfData.e} eMax={emfData.eMax} />
          
          <div className="flex flex-col items-center min-w-[65px]">
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Tension e(t)</span>
            <span 
              className={`text-xs sm:text-sm font-mono font-black transition-colors ${
                Math.abs(emfData.e) < 0.05 ? "text-slate-300" : emfData.e > 0 ? "text-cyan-400" : "text-rose-400"
              }`}
              style={{ textShadow: `0 0 8px ${emfData.e >= 0 ? "rgba(6,182,212,0.6)" : "rgba(244,63,94,0.6)"}` }}
            >
              {emfData.e > 0 ? "+" : ""}{emfData.e.toFixed(2)} V
            </span>
            <span className="text-[8px] text-slate-400 font-medium">
              e₀ = {emfData.eMax.toFixed(2)} V
            </span>
          </div>
        </div>

        {/* 3D Canvas with clean, unobstructed view */}
        <Canvas camera={{ position: [3.4, 2.2, 4.3], fov: 33 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#0b1120"]} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 7, 5]} intensity={1.8} castShadow />
          <directionalLight position={[-5, -3, -3]} intensity={0.6} color="#38bdf8" />
          <pointLight position={[2, 2, 3]} intensity={0.8} color="#f59e0b" />
          
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2.5} maxDistance={9} />
          
          <AlternatorVisualization 
            speed={speed} 
            isPaused={isPaused} 
            onUpdateValues={(e, eMax) => setEmfData({ e, eMax })} 
          />
        </Canvas>
      </div>

      {/* Clean Single Control Toolbar: Rotation Speed (omega) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex flex-col gap-2 shadow-md backdrop-blur-sm">
        
        {/* Play/Pause & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm border ${
                isPaused 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20"
              }`}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Tourner" : "Pause"}
            </button>
            
            <button
              onClick={() => { setSpeed(2.0); setIsPaused(false); }}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              title="Réinitialiser vitesse"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            e₀ = <span className="text-cyan-400 font-bold">{(1 * 1.0 * (1.3 * 1.4) * speed).toFixed(2)} V</span>
          </div>
        </div>

        {/* Full-width single slider: Vitesse de rotation (omega) */}
        <div className="flex flex-col gap-1 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
          <div className="flex justify-between items-center text-xs font-semibold gap-1.5">
            <span className="text-purple-400 flex items-center gap-1 text-[11px] whitespace-nowrap">
              <Activity size={12} className="shrink-0" />
              Vitesse de rotation (ω)
            </span>
            <span className="font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded text-[10px] border border-purple-800/60 shrink-0">
              {speed === 0 ? "Arrêté" : `${speed.toFixed(1)} rad/s`}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="8" 
            step="0.2"
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-purple-500 hover:accent-purple-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}
