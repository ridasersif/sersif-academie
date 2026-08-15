"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";

// Real-time Mini Oscilloscope Waveform Component
function LiveOscilloscope({ emf, eMax }: { emf: number; eMax: number }) {
  const [history, setHistory] = useState<number[]>(() => Array(40).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), emf]);
  }, [emf]);

  const width = 140;
  const height = 45;
  const midY = height / 2;
  const scaleY = eMax > 0.1 ? (height * 0.4) / eMax : 1;

  const points = history
    .map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = midY - val * scaleY;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="w-[140px] h-[45px] bg-slate-950/90 rounded-lg border border-emerald-500/30 overflow-hidden relative shadow-inner">
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_14px] opacity-30" />
      {/* Center zero line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-500/20" />
      
      {/* SVG Waveform */}
      <svg className="w-full h-full relative z-10" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.8))" }}
        />
      </svg>
      <div className="absolute top-1 right-1 text-[8px] font-mono font-bold text-emerald-400">
        e(t)
      </div>
    </div>
  );
}

// Arrow Helper Component
function CustomArrow({ start, dir, length, color, thickness = 0.03 }: { start: THREE.Vector3; dir: THREE.Vector3; length: number; color: string; thickness?: number }) {
  const normDir = useMemo(() => dir.clone().normalize(), [dir]);
  const end = useMemo(() => start.clone().add(normDir.clone().multiplyScalar(length)), [start, normDir, length]);
  const arrowLength = Math.max(0.001, length);
  const headLength = Math.min(0.2, arrowLength * 0.3);
  const bodyLength = Math.max(0.001, arrowLength - headLength);
  
  const midPoint = useMemo(() => start.clone().add(normDir.clone().multiplyScalar(bodyLength / 2)), [start, normDir, bodyLength]);
  const headPos = useMemo(() => start.clone().add(normDir.clone().multiplyScalar(bodyLength + headLength / 2)), [start, normDir, bodyLength, headLength]);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(up.dot(normDir)) > 0.999) {
      q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), normDir.y > 0 ? 0 : Math.PI);
    } else {
      q.setFromUnitVectors(up, normDir);
    }
    return q;
  }, [normDir]);

  return (
    <group>
      <mesh position={midPoint} quaternion={quaternion}>
        <cylinderGeometry args={[thickness, thickness, bodyLength, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[thickness * 2.5, headLength, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Realistic Laboratory Magnet Pole (Compact with Curved Shoes)
function RealisticMagnet({ type, position }: { type: "N" | "S"; position: [number, number, number] }) {
  const isNorth = type === "N";
  const mainColor = isNorth ? "#dc2626" : "#2563eb";
  const poleColor = isNorth ? "#ef4444" : "#3b82f6";
  const label = isNorth ? "N" : "S";

  return (
    <group position={position}>
      {/* Heavy Steel Base Mount */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.3, 2.6]} />
        <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Main Magnet Body (Compact & Beveled) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 2.3, 2.4]} />
        <meshPhysicalMaterial 
          color={mainColor} 
          metalness={0.5} 
          roughness={0.25} 
          clearcoat={0.3}
        />
      </mesh>

      {/* Steel Pole Shoe Facing the Rotor */}
      <mesh position={[isNorth ? 0.41 : -0.41, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 2.1, 2.2]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Embossed Metallic Pole Badge */}
      <Html position={[isNorth ? -0.45 : 0.45, 0.4, 0]} center transform sprite scale={0.9}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-2xl border-2 border-white/40 ${
          isNorth ? "bg-red-600 shadow-red-500/50" : "bg-blue-600 shadow-blue-500/50"
        }`}>
          {label}
        </div>
      </Html>
    </group>
  );
}

// Alternator 3D Scene
const AlternatorVisualization = ({ speed, isPaused }: { speed: number; isPaused: boolean }) => {
  const rotorRef = useRef<THREE.Group>(null);
  const [theta, setTheta] = useState(0);

  // Physical parameters
  const coilW = 1.4; // along Z
  const coilH = 1.8; // along Y
  const B0 = 1.2;    // Tesla

  useFrame((_, delta) => {
    if (isPaused || speed === 0) return;
    
    if (rotorRef.current) {
      const dTheta = speed * delta;
      rotorRef.current.rotation.z += dTheta;
      setTheta(rotorRef.current.rotation.z);
    }
  });

  // Calculate live values
  const e = B0 * (coilW * coilH) * speed * Math.sin(theta);
  const eMax = B0 * (coilW * coilH) * speed;

  // Streamlined Magnetic Flux Lines
  const fluxLines = useMemo(() => {
    const lines = [];
    for (let y = -0.7; y <= 0.7; y += 0.35) {
      for (let z = -0.8; z <= 0.8; z += 0.4) {
        lines.push({ y, z });
      }
    }
    return lines;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Realistic Magnets (N on Left, S on Right) */}
      <RealisticMagnet type="N" position={[-2.2, 0, 0]} />
      <RealisticMagnet type="S" position={[2.2, 0, 0]} />

      {/* 2. Magnetic Flux Streamlines (N -> S along +X) */}
      {fluxLines.map((p, i) => (
        <group key={i}>
          <CustomArrow
            start={new THREE.Vector3(-1.7, p.y, p.z)}
            dir={new THREE.Vector3(1, 0, 0)}
            length={3.4}
            color="#38bdf8"
            thickness={0.015}
          />
        </group>
      ))}

      {/* Main Magnetic Field B Vector Label */}
      <Html position={[0, 1.4, 0]} center transform sprite scale={0.9}>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-950/90 border border-sky-500/50 shadow-lg text-sky-400 font-bold text-xs">
          <span>Champ</span>
          <LatexMath math="\vec{B}_0 \rightarrow" />
        </div>
      </Html>

      {/* 3. Central Steel Shaft (Axis of Rotation along Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 4.4, 32]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} clearcoat={1} />
      </mesh>

      {/* 4. Slip Rings & Carbon Brushes (Bagues collectrices & Balais) */}
      <group position={[0, 0, 1.6]}>
        {/* Slip Ring 1 */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Slip Ring 2 */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 32]} />
          <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Carbon Brushes */}
        <mesh position={[0.18, 0, -0.15]}>
          <boxGeometry args={[0.08, 0.12, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0, 0.15]}>
          <boxGeometry args={[0.08, 0.12, 0.06]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* 5. Rotating Armature Rotor Group */}
      <group ref={rotorRef}>
        {/* Multi-turn Copper Armature Coils (Shiny Winding) */}
        {[-0.03, 0, 0.03].map((offset, idx) => (
          <group key={idx} position={[0, 0, offset]}>
            {/* Top Wire */}
            <mesh position={[0, coilH / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, coilW, 16]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            {/* Bottom Wire */}
            <mesh position={[0, -coilH / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, coilW, 16]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            {/* Left Wire */}
            <mesh position={[-coilW / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, coilH, 16]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            {/* Right Wire */}
            <mesh position={[coilW / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, coilH, 16]} />
              <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
          </group>
        ))}

        {/* Semi-transparent flux capture surface */}
        <mesh>
          <planeGeometry args={[coilW, coilH]} />
          <meshPhysicalMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.15} 
            side={THREE.DoubleSide}
            roughness={0.1}
          />
        </mesh>

        {/* Normal Vector n (Orthogonal to coil plane) */}
        <group position={[0, 0, 0]}>
          <CustomArrow 
            start={new THREE.Vector3(0, 0, 0)} 
            dir={new THREE.Vector3(0, 0, 1)} 
            length={1.3} 
            color="#ef4444" 
            thickness={0.035} 
          />
          <Html position={[0, 0, 1.45]} center transform sprite scale={0.8}>
            <div className="px-2 py-0.5 rounded-md bg-red-950/90 border border-red-500/50 text-red-400 font-bold text-xs shadow-md">
              <LatexMath math="\vec{n}" />
            </div>
          </Html>
        </group>
      </group>

      {/* 6. Live HUD floating in 3D (Oscilloscope & Digital Voltmeter) */}
      <Html position={[0, 2.3, 0]} center transform sprite scale={0.9}>
        <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-none">
          {/* Mini Oscilloscope */}
          <LiveOscilloscope emf={e} eMax={eMax} />

          {/* Voltmeter Readout */}
          <div className="flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">TENSION e(t)</span>
            <span 
              className={`text-lg font-mono font-black transition-colors ${
                Math.abs(e) < 0.1 ? "text-slate-300" : e > 0 ? "text-emerald-400" : "text-rose-400"
              }`}
              style={{ textShadow: `0 0 10px ${e >= 0 ? "rgba(16,185,129,0.5)" : "rgba(244,63,94,0.5)"}` }}
            >
              {e > 0 ? "+" : ""}{e.toFixed(2)} V
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              e₀ = {eMax.toFixed(2)} V
            </span>
          </div>
        </div>
      </Html>

      {/* Floor Contact Shadow */}
      <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
    </group>
  );
};

export default function Alternator3DCanvas() {
  const [speed, setSpeed] = useState(2.0); // omega
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[700px] mx-auto select-none">
      <div className="w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-800">
        
        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-slate-300 font-medium">Alternateur CA</span>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [3, 2.5, 5], fov: 42 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 6]} intensity={1.8} castShadow />
          <pointLight position={[-4, 2, -4]} intensity={0.8} color="#38bdf8" />
          <pointLight position={[4, -2, 4]} intensity={0.5} color="#f59e0b" />
          
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={15} />
          
          <AlternatorVisualization speed={speed} isPaused={isPaused} />
        </Canvas>
      </div>

      {/* Control Toolbar */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 shadow-md backdrop-blur-sm">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm border ${
              isPaused 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20"
            }`}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? "Reprendre" : "Pause"}
          </button>
          
          <button
            onClick={() => { setSpeed(2.0); setIsPaused(false); }}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            title="Réinitialiser la vitesse"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-purple-400 flex items-center gap-1">
              Vitesse de rotation (<LatexMath math="\omega" />)
            </span>
            <span className="font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded text-[11px] border border-purple-800/60">
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
