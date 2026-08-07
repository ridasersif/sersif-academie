"use client";

import React, { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Ruler, ArrowRightToLine, ArrowUpDown } from "lucide-react";

/* ── Animated dB contribution dot traveling along segment ── */
const TravelingDot = ({ segStart, segEnd, mPos, speed = 0.6 }: { segStart: number; segEnd: number; mPos: [number, number, number]; speed?: number }) => {
  const ref = React.useRef<THREE.Group>(null);
  const t = React.useRef(0);

  useFrame((_, d) => {
    t.current += d * speed;
    if (t.current > 1) t.current = 0;
    if (ref.current) {
      const y = segStart + t.current * (segEnd - segStart);
      ref.current.position.set(0, y, 0);
    }
  });

  return (
    <group ref={ref}>
      <Sphere args={[0.08, 16, 16]}>
        <meshBasicMaterial color="#06b6d4" toneMapped={false} />
      </Sphere>
    </group>
  );
};

/* ── Filled Angle Slice for visualization ── */
const AngleSlice = ({ center, radius, color, isTop, distance, yRel, label }: { center: [number, number, number], radius: number, color: string, isTop: boolean, distance: number, yRel: number, label: string }) => {
  let thetaStart, thetaLength, midAngle;
  if (isTop) {
    thetaStart = Math.atan2(yRel, -distance);
    thetaLength = Math.PI - thetaStart;
    midAngle = thetaStart + thetaLength / 2;
  } else {
    thetaStart = -Math.PI;
    thetaLength = Math.atan2(yRel, -distance) - (-Math.PI);
    midAngle = thetaStart + thetaLength / 2;
  }
  
  return (
    <group position={center}>
      <mesh>
        <circleGeometry args={[radius, 32, thetaStart, thetaLength]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>
      <mesh position={[0,0,0.01]}>
         <ringGeometry args={[radius, radius + 0.02, 32, 1, thetaStart, thetaLength]} />
         <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <Html position={[Math.cos(midAngle) * (radius + 0.35), Math.sin(midAngle) * (radius + 0.35), 0]} center>
        <div className="font-bold text-[11px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ color: color }}>{label}</div>
      </Html>
    </group>
  );
};

export default function BiotSavartSegment3DCanvas() {
  const [halfLength, setHalfLength] = useState(3.0); // Half-length of segment
  const [distance, setDistance] = useState(2.0);      // Distance d from wire to M
  const [heightM, setHeightM] = useState(0.0);        // Height (Z/Y position) of point M

  // Field line circle points
  const fieldLinePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * distance, 0, Math.sin(theta) * distance));
    }
    return pts;
  }, [distance]);

  // Segment from -halfLength to +halfLength along Y axis
  const segTop = halfLength;
  const segBot = -halfLength;

  // Point M position (on x-axis at distance d, and y-axis at heightM)
  const mX = distance;
  const mY = heightM;

  // Angles α₁ and α₂ (relative to horizontal line passing through M)
  const yRelBot = segBot - mY;
  const yRelTop = segTop - mY;
  
  const alpha1 = Math.atan2(yRelBot, distance); // angle to bottom A
  const alpha2 = Math.atan2(yRelTop, distance); // angle to top B

  // Magnitude for visualization of B
  const bMag = (Math.sin(alpha2) - Math.sin(alpha1)) / distance;
  const bVisLength = bMag * 2.5; // Scale for visual purposes

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">

        {/* HUD Légende */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-xl shadow-xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span className="text-slate-300">Segment</span>
              <span className="text-cyan-400 font-mono font-bold">[AB]</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span className="text-slate-300">Point</span>
              <span className="text-amber-400 font-mono font-bold">M</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="text-slate-300">Champ</span>
              <span className="text-emerald-400 font-mono font-bold">B⃗</span>
            </div>
          </div>
        </div>

        {/* Result HUD Inside Canvas */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-lg">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
              <span className="text-cyan-400 font-bold">α₁</span>
              <span className="text-slate-400">=</span>
              <span className="text-cyan-300 font-mono">{(alpha1 * 180 / Math.PI).toFixed(1)}°</span>
              <span className="text-slate-600 mx-1">|</span>
              <span className="text-teal-400 font-bold">α₂</span>
              <span className="text-slate-400">=</span>
              <span className="text-teal-300 font-mono">{(alpha2 * 180 / Math.PI).toFixed(1)}°</span>
            </div>
          </div>
        </div>

        <Canvas camera={{ position: [5, 2, 5], fov: 50 }} dpr={[1, 1.5]} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#06b6d4" />

          {/* Grille */}
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -0.01, 0]} />

          <group>
            {/* Segment [AB] — fil portant le courant I */}
            <Cylinder args={[0.04, 0.04, halfLength * 2, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </Cylinder>

            {/* Glow around wire */}
            <Cylinder args={[0.12, 0.12, halfLength * 2, 16]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
            </Cylinder>

            {/* Labels A and B */}
            <Html position={[0, -halfLength - 0.4, 0]} center>
              <div className="text-cyan-400 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">A</div>
            </Html>
            <Html position={[0, halfLength + 0.4, 0]} center>
              <div className="text-cyan-400 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">B</div>
            </Html>

            {/* Current arrow I (upward) */}
            <mesh position={[0, halfLength + 0.15, 0]}>
              <coneGeometry args={[0.1, 0.35, 8]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <Html position={[-0.5, halfLength + 0.3, 0]} center>
              <div className="text-cyan-400 font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">I</div>
            </Html>

            {/* Point M */}
            <Sphere args={[0.15, 16, 16]} position={[mX, mY, 0]}>
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
            </Sphere>
            <Html position={[mX + 0.35, mY + 0.35, 0]} center>
              <div className="text-amber-400 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">M</div>
            </Html>

            {/* Distance d (horizontal line from wire to M) */}
            <Line points={[[0, mY, 0], [mX, mY, 0]]} color="#f472b6" lineWidth={2} dashed dashSize={0.15} gapSize={0.1} />
            <Html position={[mX / 2, mY - 0.35, 0]} center>
              <div className="text-pink-400 font-bold text-xs italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">d</div>
            </Html>

            {/* r lines from segment endpoints to M */}
            <Line points={[[0, segBot, 0], [mX, mY, 0]]} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />
            <Line points={[[0, segTop, 0], [mX, mY, 0]]} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />

            {/* Angle Filled Slices α₁ and α₂ */}
            <AngleSlice center={[mX, mY, 0]} radius={0.7} color="#0ea5e9" isTop={false} distance={distance} yRel={yRelBot} label="α₁" />
            <AngleSlice center={[mX, mY, 0]} radius={0.9} color="#14b8a6" isTop={true} distance={distance} yRel={yRelTop} label="α₂" />

            {/* Field Line (Circle) passing through M */}
            <group position={[0, mY, 0]}>
              <Line points={fieldLinePoints} color="#10b981" lineWidth={1.5} transparent opacity={0.3} dashed dashSize={0.2} gapSize={0.2} />
              {/* Directional arrows on the field line */}
              <mesh position={[0, 0, distance]} rotation={[0, 0, Math.PI / 2]}> {/* Pointing -X */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
              <mesh position={[-distance, 0, 0]} rotation={[Math.PI / 2, 0, 0]}> {/* Pointing +Z */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
              <mesh position={[0, 0, -distance]} rotation={[0, 0, -Math.PI / 2]}> {/* Pointing +X */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
            </group>

            {/* Magnetic Field Vector B at M */}
            <group position={[mX, mY, 0]} rotation={[-Math.PI / 2, 0, 0]}> {/* Pointing -Z */}
              <Cylinder args={[0.03, 0.03, bVisLength, 8]} position={[0, bVisLength / 2, 0]}>
                <meshBasicMaterial color="#10b981" />
              </Cylinder>
              <mesh position={[0, bVisLength, 0]}>
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
              <Html position={[0, bVisLength + 0.3, 0]} center>
                <div className="text-emerald-400 font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">B⃗</div>
              </Html>
            </group>

            {/* Traveling contribution dot */}
            <TravelingDot segStart={segBot} segEnd={segTop} mPos={[mX, mY, 0]} speed={0.4} />
          </group>

          <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-4 sm:p-5 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        
        {/* Slider: Longueur du segment */}
        <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-48">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-cyan-500" />
              <label className="text-[10px] sm:text-xs font-bold text-foreground/80 dark:text-cyan-300 uppercase tracking-wider">
                Longueur L
              </label>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              {halfLength.toFixed(1)} m
            </span>
          </div>
          <input
            type="range" min={0.5} max={6} step={0.1}
            value={halfLength}
            onChange={(e) => setHalfLength(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
          />
          <div className="flex justify-between text-[8px] text-muted-foreground font-medium mt-0.5 px-0.5">
            <span>0.5</span>
            <span className="text-cyan-600/70 dark:text-cyan-400/60 transition-colors">L → ∞</span>
            <span>6.0</span>
          </div>
        </div>

        {/* Slider: Distance d */}
        <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-48">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <ArrowRightToLine className="w-3.5 h-3.5 text-pink-500" />
              <label className="text-[10px] sm:text-xs font-bold text-foreground/80 dark:text-pink-300 uppercase tracking-wider">
                Distance d
              </label>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">
              {distance.toFixed(1)} m
            </span>
          </div>
          <input
            type="range" min={0.5} max={5} step={0.1}
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-600 dark:accent-pink-500"
          />
          <div className="flex justify-between text-[8px] text-muted-foreground font-medium mt-0.5 px-0.5">
            <span>0.5</span>
            <span>5.0</span>
          </div>
        </div>

        {/* Slider: Hauteur z */}
        <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-48">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-500" />
              <label className="text-[10px] sm:text-xs font-bold text-foreground/80 dark:text-purple-300 uppercase tracking-wider">
                Hauteur z
              </label>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
              {heightM > 0 ? "+" : ""}{heightM.toFixed(1)} m
            </span>
          </div>
          <input
            type="range" min={-5} max={5} step={0.1}
            value={heightM}
            onChange={(e) => setHeightM(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-500"
          />
          <div className="flex justify-between text-[8px] text-muted-foreground font-medium mt-0.5 px-0.5">
            <span>-5.0</span>
            <span>0.0</span>
            <span>5.0</span>
          </div>
        </div>

        {/* Reset Button */}
        <div className="shrink-0 flex items-center justify-center mt-2 sm:mt-0">
          <button 
             onClick={() => {
               setHalfLength(3.0);
               setDistance(2.0);
               setHeightM(0.0);
             }}
             title="Réinitialiser"
             className="flex items-center justify-center gap-1.5 p-2 px-4 bg-muted hover:bg-muted/80 text-foreground/80 rounded-lg transition-colors border border-border text-[10px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md"
           >
             <RotateCcw className="w-3.5 h-3.5" />
             Reset
          </button>
        </div>

        {/* Result display */}
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border shrink-0 w-full md:w-auto text-center shadow-sm flex-1 max-w-xl mx-auto">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-2 tracking-widest uppercase">Résultat du Champ B</div>
          
          <div className="flex flex-col gap-2 items-center justify-center font-mono text-xs sm:text-sm">
            {/* Ligne 1: Formule formelle avec les angles */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">B</span>
              <span className="text-slate-500 dark:text-slate-400">=</span>
              <span className="text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/10 whitespace-nowrap">(μ₀I / 4πd)</span>
              <span className="text-slate-400">×</span>
              <span className="text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/10">
                [sin({(alpha2 * 180 / Math.PI).toFixed(1)}°) - sin({(alpha1 * 180 / Math.PI).toFixed(1)}°)]
              </span>
            </div>

            {/* Ligne 2: Valeur numérique calculée */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base mt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">B</span>
              <span className="text-slate-500 dark:text-slate-400">≈</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-inner whitespace-nowrap">
                {((Math.sin(alpha2) - Math.sin(alpha1)) / distance).toFixed(3)} × (μ₀I / 4π)
              </span>
            </div>
          </div>

          {halfLength >= 5.5 && (
            <div className="mt-3 text-center text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse bg-amber-500/10 border border-amber-500/20 py-1.5 rounded-md">
              ⚠️ L → ∞ : α₁ → -90° , α₂ → 90° ⟹ B ≈ {(2 / distance).toFixed(3)} × (μ₀I / 4π) (Fil Infini !)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
