"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Play, Pause, RotateCcw, Zap, Activity } from "lucide-react";

// Real-time Mini Oscilloscope Waveform Component
function LiveOscilloscope({ emf, eMax }: { emf: number; eMax: number }) {
  const [history, setHistory] = useState<number[]>(() => Array(45).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), emf]);
  }, [emf]);

  const width = 120;
  const height = 36;
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
    <div className="w-[120px] h-[36px] bg-slate-950/90 rounded-lg border border-cyan-500/30 overflow-hidden relative shadow-inner">
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
      <div className="absolute top-0.5 right-1.5 text-[7px] font-mono font-bold text-cyan-400">
        e(t)
      </div>
    </div>
  );
}

// Clean Magnetic Flux Line with Arrow
function FluxLine({ start, length }: { start: [number, number, number]; length: number }) {
  return (
    <group position={start}>
      <mesh position={[length / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, length, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>
      <mesh position={[length * 0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.035, 0.12, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Compact & Realistic Laboratory Magnet
function CompactLabMagnet() {
  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Laboratory Base */}
      <mesh position={[0, -1.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.16, 2.2]} />
        <meshPhysicalMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Horseshoe Steel Yoke */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <boxGeometry args={[2.4, 0.24, 1.4]} />
        <meshPhysicalMaterial color="#475569" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Left Pole (North - Satin Red) */}
      <group position={[-1.25, -0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 1.2, 1.3]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.25} metalness={0.3} clearcoat={0.3} />
        </mesh>
        {/* Steel Pole Shoe */}
        <mesh position={[0.24, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 1.1, 1.2]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Clean 'N' Letter Painted on Top */}
        <Html position={[0, 0.7, 0]} center transform sprite scale={0.55}>
          <span className="font-black text-red-400 text-sm tracking-wider drop-shadow-md">
            Pôle N
          </span>
        </Html>
      </group>

      {/* Right Pole (South - Cobalt Blue) */}
      <group position={[1.25, -0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.45, 1.2, 1.3]} />
          <meshPhysicalMaterial color="#2563eb" roughness={0.25} metalness={0.3} clearcoat={0.3} />
        </mesh>
        {/* Steel Pole Shoe */}
        <mesh position={[-0.24, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 1.1, 1.2]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Clean 'S' Letter Painted on Top */}
        <Html position={[0, 0.7, 0]} center transform sprite scale={0.55}>
          <span className="font-black text-blue-400 text-sm tracking-wider drop-shadow-md">
            Pôle S
          </span>
        </Html>
      </group>

      {/* Bearing Support Brackets (Paliers) */}
      <mesh position={[0, -0.5, -0.9]} castShadow>
        <boxGeometry args={[0.25, 0.85, 0.1]} />
        <meshPhysicalMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.5, 0.9]} castShadow>
        <boxGeometry args={[0.25, 0.85, 0.1]} />
        <meshPhysicalMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Glowing AC Light Bulb
function MiniLightBulb({ emf, eMax }: { emf: number; eMax: number }) {
  const intensity = eMax > 0.05 ? Math.min(1, (emf * emf) / (eMax * eMax)) : 0;
  const isGlowing = intensity > 0.04;

  return (
    <group position={[0.95, -0.75, 0.75]}>
      {/* Brass Socket */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.12, 0.14, 16]} />
        <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glass Bulb */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial 
          color={isGlowing ? "#fef08a" : "#e2e8f0"} 
          emissive={isGlowing ? "#fbbf24" : "#000000"}
          emissiveIntensity={intensity * 2.0}
          transmission={0.8}
          transparent
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Filament */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshBasicMaterial color={isGlowing ? "#ffffff" : "#64748b"} />
      </mesh>

      {/* Warm Ambient Glow */}
      {isGlowing && (
        <pointLight position={[0, 0.2, 0]} intensity={intensity * 2.5} distance={2.5} color="#f59e0b" />
      )}

      {/* Red & Blue Output Wires */}
      <mesh position={[-0.3, 0, 0.05]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-0.3, 0, -0.05]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <Html position={[0, -0.16, 0]} center transform sprite scale={0.45}>
        <span className="text-[9px] font-bold text-amber-300 bg-slate-950/80 px-1 rounded border border-amber-500/20 whitespace-nowrap">
          Ampoule
        </span>
      </Html>
    </group>
  );
}

// 3D Scene Controller
const AlternatorVisualization = ({ 
  speed, 
  isPaused,
  onUpdateValues 
}: { 
  speed: number; 
  isPaused: boolean;
  onUpdateValues: (emf: number, eMax: number) => void;
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const thetaRef = useRef(0);

  // Constants
  const coilW = 0.9;  // along Z
  const coilH = 1.0;  // along Y
  const B0 = 1.0;     // Tesla

  useFrame((_, delta) => {
    if (isPaused || speed === 0) {
      const e = B0 * (coilW * coilH) * speed * Math.sin(thetaRef.current);
      const eMax = B0 * (coilW * coilH) * speed;
      onUpdateValues(e, eMax);
      return;
    }
    
    if (rotorRef.current) {
      thetaRef.current += speed * delta;
      rotorRef.current.rotation.z = thetaRef.current;
      
      const e = B0 * (coilW * coilH) * speed * Math.sin(thetaRef.current);
      const eMax = B0 * (coilW * coilH) * speed;
      onUpdateValues(e, eMax);
    }
  });

  const currentEmf = B0 * (coilW * coilH) * speed * Math.sin(thetaRef.current);
  const currentEMax = B0 * (coilW * coilH) * speed;

  // 4 Subtle Field Lines Spanning N to S
  const fluxLines: [number, number, number][] = useMemo(() => [
    [-0.95, 0.3, 0.25],
    [-0.95, 0.3, -0.25],
    [-0.95, -0.3, 0.25],
    [-0.95, -0.3, -0.25],
  ], []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Laboratory Magnet Frame */}
      <CompactLabMagnet />

      {/* 2. Magnetic Flux Streamlines */}
      {fluxLines.map((pos, i) => (
        <FluxLine key={i} start={pos} length={1.9} />
      ))}

      {/* 3. Central Steel Axle */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 2.5, 20]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 4. Slip Rings & Carbon Brushes */}
      <group position={[0, -0.1, 0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.07]}>
          <cylinderGeometry args={[0.065, 0.065, 0.045, 20]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.065, 0.065, 0.045, 20]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Carbon Brushes */}
        <mesh position={[0.09, 0, -0.07]}>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0.09, 0, 0.07]}>
          <boxGeometry args={[0.04, 0.06, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* 5. Hand Crank (Manivelle arrière) */}
      <group position={[0, -0.1, -1.25]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.04, 0.4, 0.03]} />
          <meshPhysicalMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 12]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* 6. Rotating Armature Rotor */}
      <group ref={rotorRef} position={[0, -0.1, 0]}>
        {/* Multi-turn Copper Frame */}
        {[-0.015, 0, 0.015].map((offset, idx) => (
          <group key={idx} position={[0, 0, offset]}>
            {/* Top */}
            <mesh position={[0, coilH / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, coilW, 12]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
            </mesh>
            {/* Bottom */}
            <mesh position={[0, -coilH / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, coilW, 12]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
            </mesh>
            {/* Left */}
            <mesh position={[-coilW / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, coilH, 12]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
            </mesh>
            {/* Right */}
            <mesh position={[coilW / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, coilH, 12]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
            </mesh>
          </group>
        ))}

        {/* Translucent Surface */}
        <mesh>
          <planeGeometry args={[coilW, coilH]} />
          <meshPhysicalMaterial color="#fbbf24" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>

        {/* Normal Vector n */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.045, 0.15, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Html position={[0, 0, 1.0]} center transform sprite scale={0.5}>
            <span className="text-[11px] font-black text-red-400 drop-shadow">
              <LatexMath math="\vec{n}" />
            </span>
          </Html>
        </group>
      </group>

      {/* 7. Connected Light Bulb */}
      <MiniLightBulb emf={currentEmf} eMax={currentEMax} />

      {/* Floor Shadow */}
      <ContactShadows position={[0, -1.1, 0]} opacity={0.5} scale={6} blur={2.0} far={2.5} />
    </group>
  );
};

export default function Alternator3DCanvas() {
  const [speed, setSpeed] = useState(2.0); // omega
  const [isPaused, setIsPaused] = useState(false);
  const [emfData, setEmfData] = useState({ e: 0, eMax: 0 });

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[700px] mx-auto select-none">
      <div className="w-full h-[360px] sm:h-[400px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-800">
        
        {/* Top-Left Badge */}
        <div className="absolute top-3 left-3 z-10 flex gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-200 font-bold">Alternateur & Dynamo</span>
          </div>
        </div>

        {/* Top-Right HUD: Oscilloscope & Digital Voltmeter */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-2 sm:p-2.5 rounded-xl shadow-xl pointer-events-none">
          <LiveOscilloscope emf={emfData.e} eMax={emfData.eMax} />
          
          <div className="flex flex-col items-center min-w-[65px]">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Tension e(t)</span>
            <span 
              className={`text-sm font-mono font-black transition-colors ${
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

        {/* 3D Canvas with pulled-back camera and spacious framing */}
        <Canvas camera={{ position: [2.5, 2.0, 4.2], fov: 36 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 7, 5]} intensity={1.8} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.7} color="#38bdf8" />
          <pointLight position={[3, -1, 3]} intensity={0.5} color="#f59e0b" />
          
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2.5} maxDistance={8} />
          
          <AlternatorVisualization 
            speed={speed} 
            isPaused={isPaused} 
            onUpdateValues={(e, eMax) => setEmfData({ e, eMax })} 
          />
        </Canvas>
      </div>

      {/* Control Toolbar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-center gap-3 shadow-md backdrop-blur-sm">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm border ${
              isPaused 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20"
            }`}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            {isPaused ? "Tourner" : "Pause"}
          </button>
          
          <button
            onClick={() => { setSpeed(2.0); setIsPaused(false); }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            title="Réinitialiser la vitesse"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex-1 w-full flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-purple-400 flex items-center gap-1 text-[11px]">
              <Activity size={12} />
              Vitesse de rotation (<LatexMath math="\omega" />)
            </span>
            <span className="font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded text-[10px] border border-purple-800/60">
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
