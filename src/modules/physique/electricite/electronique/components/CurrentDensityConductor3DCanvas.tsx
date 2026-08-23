"use client";

import React, { Suspense, useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html } from "@react-three/drei";
import * as THREE from "three";
import { Sliders, RotateCw, Activity, Compass, Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

function ConductorFluxScene({
  densityJ,
  surfaceAngleDeg,
  radius,
  isPlaying,
}: {
  densityJ: number;
  surfaceAngleDeg: number;
  radius: number;
  isPlaying: boolean;
}) {
  const thetaRad = (surfaceAngleDeg * Math.PI) / 180;

  // Streamlines / Vectors of Current Density j along the cylinder (X-axis)
  const streamLines = useMemo(() => {
    const lines: { y: number; z: number }[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const r = (radius * 0.8) * Math.sqrt((i + 1) / count);
      const angle = (i * 2.39996); // golden angle distribution
      lines.push({
        y: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
      });
    }
    return lines;
  }, [radius]);

  // Animated charge packets flowing along j
  const packets = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      initX: (Math.sin(i * 19) * 0.5 + 0.5) * 5.0 - 2.5,
      y: (Math.cos(i * 23) * 0.5) * (radius * 0.75),
      z: (Math.sin(i * 31) * 0.5) * (radius * 0.75),
      speed: 0.8 + (i % 4) * 0.2,
    }));
  }, [radius]);

  const packetMeshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    packets.forEach((p, idx) => {
      p.initX += p.speed * (densityJ * 0.25) * delta;
      if (p.initX > 2.5) p.initX = -2.5;

      const m = packetMeshes.current[idx];
      if (m) {
        m.position.set(p.initX, p.y, p.z);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <pointLight position={[-5, -2, -3]} intensity={0.5} color="#38bdf8" />

      {/* 1. Translucent Cylindrical Conductor (along X-axis) */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[radius, radius, 5.0, 32, 1, true]}>
          <meshStandardMaterial
            color="#1e293b"
            transparent
            opacity={0.35}
            roughness={0.2}
            metalness={0.8}
            side={THREE.DoubleSide}
          />
        </Cylinder>
      </group>

      {/* Conductor Outer Wireframe Rings */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[radius, radius, 5.0, 16, 4, true]}>
          <meshBasicMaterial color="#475569" wireframe transparent opacity={0.25} />
        </Cylinder>
      </group>

      {/* 2. Current Density Vectors (Glowing Arrows) */}
      {streamLines.map((line, idx) => (
        <group key={idx} position={[-2.2, line.y, line.z]}>
          <Cylinder args={[0.02, 0.02, 4.0]} rotation={[0, 0, -Math.PI / 2]}>
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
          </Cylinder>
          {/* Arrow Head Cone */}
          <mesh position={[2.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.25, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}

      {/* Moving Charge Packets (visual current flow) */}
      {packets.map((p, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            packetMeshes.current[idx] = el;
          }}
          position={[p.initX, p.y, p.z]}
        >
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1} />
        </mesh>
      ))}

      {/* 3. Oriented Surface Disk (Cross Section with Angle theta) */}
      <group position={[0.2, 0, 0]} rotation={[0, thetaRad, 0]}>
        {/* Surface Ellipse/Disk */}
        <Cylinder args={[radius * 0.98, radius * 0.98, 0.03, 32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.4}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </Cylinder>

        {/* Normal Vector n Arrow */}
        <group position={[0, 0, 0]}>
          <Cylinder args={[0.04, 0.04, 1.6]} rotation={[0, 0, -Math.PI / 2]} position={[0.8, 0, 0]}>
            <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.8} />
          </Cylinder>
          <mesh position={[1.65, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.12, 0.35, 16]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1} />
          </mesh>

          <Html position={[1.8, 0.25, 0]} center className="hidden sm:block">
            <div className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-mono text-[10px] px-1.5 py-0.5 rounded shadow backdrop-blur-md whitespace-nowrap font-bold">
              Vecteur Normal <LatexMath math="\vec{n}" />
            </div>
          </Html>
        </group>
      </group>

      <OrbitControls enableZoom={true} minDistance={3.5} maxDistance={12} />
    </>
  );
}

export default function CurrentDensityConductor3DCanvas() {
  const [densityJ, setDensityJ] = useState<number>(5.0); // A/mm^2
  const [surfaceAngleDeg, setSurfaceAngleDeg] = useState<number>(25); // degrees
  const [radiusMm, setRadiusMm] = useState<number>(1.2); // cm in visual
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Surface Area S = pi * r^2
  const areaMm2 = useMemo(() => {
    return Math.PI * Math.pow(radiusMm * 10, 2); // mm^2
  }, [radiusMm]);

  // Current I = j * S * cos(theta)
  const currentIntensityA = useMemo(() => {
    const thetaRad = (surfaceAngleDeg * Math.PI) / 180;
    const current = densityJ * areaMm2 * Math.cos(thetaRad) * 1e-3; // in kA or A
    return (current * 10).toFixed(2); // scaled in Amperes
  }, [densityJ, areaMm2, surfaceAngleDeg]);

  const cosTheta = useMemo(() => {
    return Math.cos((surfaceAngleDeg * Math.PI) / 180).toFixed(3);
  }, [surfaceAngleDeg]);

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Controls Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse shrink-0"></div>
          <h4 className="text-sm font-bold text-white tracking-wide flex flex-wrap items-center gap-2 leading-snug">
            <Activity size={16} className="text-blue-400 shrink-0" /> 
            <span>Flux de <LatexMath math="\vec{j}" /> & Intensité</span>
            <LatexMath math="I = \iint \vec{j} \cdot d\vec{S}" />
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all shrink-0"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={() => setSurfaceAngleDeg(surfaceAngleDeg === 0 ? 45 : surfaceAngleDeg === 45 ? 90 : 0)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 flex-1 sm:flex-none justify-center whitespace-nowrap"
          >
            <RotateCw size={14} className="shrink-0" /> Angle Rapide ({surfaceAngleDeg}°)
          </button>
        </div>
      </div>

      {/* Real-time Math Formula (Mobile: Static, Desktop: Overlay) */}
      <div className="block sm:hidden bg-slate-900/90 border-b border-slate-800 p-4 text-xs space-y-2">
        <div className="text-slate-300 font-bold flex flex-wrap items-center gap-2 justify-center">
          <LatexMath math="I = \iint_S \vec{j} \cdot d\vec{S} = j \cdot S \cdot \cos(\theta)" />
        </div>
        <div className="text-[11px] text-slate-400 font-mono text-center">
          <LatexMath math={`I = ${densityJ} \\times ${areaMm2.toFixed(1)} \\times ${cosTheta} = `} />
          <span className="text-emerald-400 font-bold text-sm ml-1">{currentIntensityA} A</span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[260px] sm:h-[300px] bg-[#040817] cursor-grab active:cursor-grabbing">
        <Canvas dpr={[1, 1.5]} camera={{ position: [2.5, 2.8, 6.0], fov: 46 }}>
          <Suspense fallback={null}>
            <ConductorFluxScene
              densityJ={densityJ}
              surfaceAngleDeg={surfaceAngleDeg}
              radius={radiusMm}
              isPlaying={isPlaying}
            />
          </Suspense>
        </Canvas>

        {/* Real-time Math Formula Overlay (Desktop only) */}
        <div className="hidden sm:block absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl">
          <div className="text-slate-300 font-bold flex items-center gap-2">
            <LatexMath math="I = \iint_S \vec{j} \cdot d\vec{S} = j \cdot S \cdot \cos(\theta)" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            <LatexMath math={`I = ${densityJ} \\times ${areaMm2.toFixed(1)} \\times ${cosTheta} = `} />
            <span className="text-emerald-400 font-bold text-sm ml-1">{currentIntensityA} A</span>
          </div>
        </div>

        {/* Legend (Desktop only) */}
        <div className="hidden sm:block absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-xs space-y-1 text-slate-300 shadow-xl pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></span>
            <span>Densité de courant <LatexMath math="\vec{j}" /></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
            <span>Normale à la surface <LatexMath math="\vec{n}" /></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
            <span>Surface de coupe <LatexMath math="S" /></span>
          </div>
        </div>
      </div>

      {/* Legend (Mobile: Static below canvas) */}
      <div className="block sm:hidden bg-[#040817] border-t border-slate-800 p-3 text-[11px] text-slate-300 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></span>
            <span>Densité <LatexMath math="\vec{j}" /></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
            <span>Normale <LatexMath math="\vec{n}" /></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
            <span>Surface <LatexMath math="S" /></span>
          </div>
        </div>
      </div>

      {/* Sliders Area */}
      <div className="p-4 bg-slate-900/70 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Surface Angle Theta */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Compass size={14} className="text-rose-400" /> Angle d&apos;inclinaison <LatexMath math="\theta" /> :
            </span>
            <span className="text-rose-400 font-mono font-bold">{surfaceAngleDeg}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={90}
            step={1}
            value={surfaceAngleDeg}
            onChange={(e) => setSurfaceAngleDeg(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <p className="text-[10px] text-slate-500">
            À <LatexMath math="\theta = 90^\circ" />, la surface est parallèle à <LatexMath math="\vec{j}" /> et le flux est nul (<LatexMath math="I = 0" />).
          </p>
        </div>

        {/* Current Density J */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-blue-400" /> Norme de <LatexMath math="j" /> :
            </span>
            <span className="text-blue-400 font-mono font-bold">{densityJ.toFixed(1)} A/mm²</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={10.0}
            step={0.5}
            value={densityJ}
            onChange={(e) => setDensityJ(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-[10px] text-slate-500">
            Augmente le nombre de charges traversant chaque unité de surface par seconde.
          </p>
        </div>

        {/* Section Radius */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Activity size={14} className="text-amber-400" /> Rayon du conducteur <LatexMath math="R" /> :
            </span>
            <span className="text-amber-400 font-mono font-bold">{(radiusMm * 10).toFixed(0)} mm</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.8}
            step={0.1}
            value={radiusMm}
            onChange={(e) => setRadiusMm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">
            Surface de la section droite : <LatexMath math={`S = ${areaMm2.toFixed(1)}\\,\\text{mm}^2`} />.
          </p>
        </div>
      </div>
    </div>
  );
}
