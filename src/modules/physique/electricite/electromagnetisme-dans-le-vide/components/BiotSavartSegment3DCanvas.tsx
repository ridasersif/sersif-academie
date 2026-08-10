"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Ruler, ArrowRightToLine, ArrowUpDown, ArrowUp, ArrowDown, Infinity as InfinityIcon } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

/* ── Animated dB contribution dot traveling along segment ── */
const TravelingDot = ({ segStart, segEnd, mPos, speed = 0.6 }: { segStart: number; segEnd: number; mPos: [number, number, number]; speed?: number }) => {
  const ref = React.useRef<THREE.Group>(null);
  const t = React.useRef(0);

  useFrame((_, d) => {
    t.current += d * speed;
    if (speed > 0 && t.current > 1) t.current -= 1;
    if (speed < 0 && t.current < 0) t.current += 1;
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
  const [currentDirection, setCurrentDirection] = useState<1 | -1>(1); // Direction of I
  const [isInfinite, setIsInfinite] = useState(false); // Infinite wire case

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
  const visualHalfLength = isInfinite ? 15.0 : halfLength;
  const segTop = isInfinite ? 500.0 : halfLength;
  const segBot = isInfinite ? -500.0 : -halfLength;

  // Point M position (on x-axis at distance d, and y-axis at heightM)
  const mX = distance;
  const mY = heightM;

  // Angles α₁ and α₂ (relative to horizontal line passing through M)
  const yRelBot = segBot - mY;
  const yRelTop = segTop - mY;
  
  const alpha1 = isInfinite ? -Math.PI / 2 : Math.atan2(yRelBot, distance); // angle to bottom A
  const alpha2 = isInfinite ? Math.PI / 2 : Math.atan2(yRelTop, distance); // angle to top B

  // Magnitude for visualization of B
  const bMag = (Math.sin(alpha2) - Math.sin(alpha1)) / distance;
  const bVisLength = bMag * 2.5; // Scale for visual purposes

  // Slider Fill Percentages
  const percL = ((halfLength - 0.5) / (6 - 0.5)) * 100;
  const percD = ((distance - 0.5) / (5 - 0.5)) * 100;
  const percZ = ((heightM - (-5)) / (5 - (-5))) * 100;

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div ref={canvasContainerRef} className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">

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

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 2, 5], fov: 50 }} dpr={[1, 1.5]} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#06b6d4" />

          {/* Grille */}
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -0.01, 0]} />

          <group>
            {/* Segment [AB] — fil portant le courant I */}
            <Cylinder args={[0.04, 0.04, visualHalfLength * 2, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </Cylinder>

            {/* Glow around wire */}
            <Cylinder args={[0.12, 0.12, visualHalfLength * 2, 16]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
            </Cylinder>

            {/* Labels A and B (hide if infinite) */}
            {!isInfinite && (
              <>
                <Html position={[0, -halfLength - 0.4, 0]} center>
                  <div className="text-cyan-400 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">A</div>
                </Html>
                <Html position={[0, halfLength + 0.4, 0]} center>
                  <div className="text-cyan-400 font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">B</div>
                </Html>
              </>
            )}

            {/* Current arrow I */}
            <mesh position={[0, (isInfinite ? 4.0 : halfLength + 0.15), 0]} rotation={[currentDirection === -1 ? Math.PI : 0, 0, 0]}>
              <coneGeometry args={[0.1, 0.35, 8]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <Html position={[-0.5, (isInfinite ? 4.0 : halfLength + 0.3), 0]} center>
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

            {/* r lines from segment endpoints to M (hide if infinite) */}
            {!isInfinite && (
              <>
                <Line points={[[0, segBot, 0], [mX, mY, 0]]} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />
                <Line points={[[0, segTop, 0], [mX, mY, 0]]} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />
              </>
            )}

            {/* Angle Filled Slices α₁ and α₂ (hide if infinite) */}
            {!isInfinite && (
              <>
                <AngleSlice center={[mX, mY, 0]} radius={0.7} color="#0ea5e9" isTop={false} distance={distance} yRel={yRelBot} label="α₁" />
                <AngleSlice center={[mX, mY, 0]} radius={0.9} color="#14b8a6" isTop={true} distance={distance} yRel={yRelTop} label="α₂" />
              </>
            )}

            {/* Field Line (Circle) passing through M */}
            <group position={[0, mY, 0]}>
              <Line points={fieldLinePoints} color="#10b981" lineWidth={1.5} transparent opacity={0.3} dashed dashSize={0.2} gapSize={0.2} />
              {/* Directional arrows on the field line */}
              <mesh position={[0, 0, distance]} rotation={[0, 0, Math.PI / 2 * currentDirection]}> {/* Pointing -X or +X */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
              <mesh position={[-distance, 0, 0]} rotation={[Math.PI / 2 * currentDirection, 0, 0]}> {/* Pointing +Z or -Z */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
              <mesh position={[0, 0, -distance]} rotation={[0, 0, -Math.PI / 2 * currentDirection]}> {/* Pointing +X or -X */}
                <coneGeometry args={[0.08, 0.25, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
              </mesh>
            </group>

            {/* Magnetic Field Vector B at M */}
            <group position={[mX, mY, 0]} rotation={[currentDirection === 1 ? -Math.PI / 2 : Math.PI / 2, 0, 0]}> {/* Pointing -Z or +Z */}
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
            <TravelingDot segStart={-visualHalfLength} segEnd={visualHalfLength} mPos={[mX, mY, 0]} speed={0.4 * currentDirection} />
          </group>

          <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
        
        {/* Group 1: Sliders */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full lg:w-auto flex-1 max-w-md lg:max-w-xl">
          {/* Slider: L */}
          <div className={`flex items-center gap-2 w-full sm:w-32 shrink-0 transition-opacity ${isInfinite ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <label className="text-[10px] font-bold text-cyan-400 uppercase w-2">L</label>
            <input type="range" min={0.5} max={6} step={0.1} value={halfLength} onChange={(e) => setHalfLength(parseFloat(e.target.value))} className="w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-inner" style={{ background: `linear-gradient(to right, #22d3ee ${percL}%, rgba(30,41,59,0.5) ${percL}%)` }} />
          </div>

          {/* Slider: d */}
          <div className="flex items-center gap-2 w-full sm:w-32 shrink-0">
            <label className="text-[10px] font-bold text-pink-400 uppercase w-2">d</label>
            <input type="range" min={0.5} max={5} step={0.1} value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer accent-pink-400 shadow-inner" style={{ background: `linear-gradient(to right, #f472b6 ${percD}%, rgba(30,41,59,0.5) ${percD}%)` }} />
          </div>

          {/* Slider: z */}
          <div className="flex items-center gap-2 w-full sm:w-32 shrink-0">
            <label className="text-[10px] font-bold text-purple-400 uppercase w-2">z</label>
            <input type="range" min={-5} max={5} step={0.1} value={heightM} onChange={(e) => setHeightM(parseFloat(e.target.value))} className="w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer accent-purple-400 shadow-inner" style={{ background: `linear-gradient(to right, #c084fc ${percZ}%, rgba(30,41,59,0.5) ${percZ}%)` }} />
          </div>
        </div>

        {/* Group 2: Buttons */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 shrink-0">
          {/* Toggle: Sens du courant */}
          <div className="flex items-center bg-slate-800/50 p-1 rounded-xl shrink-0 border border-border/50">
            <button
              onClick={() => setCurrentDirection(1)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentDirection === 1 ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
              title="Courant vers le haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDirection(-1)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentDirection === -1 ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
              title="Courant vers le bas"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle: Fil Infini */}
          <button
            onClick={() => setIsInfinite(!isInfinite)}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all shadow-sm shrink-0 ${
              isInfinite 
                ? "border-amber-400 bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                : "border-slate-700/50 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
            title="Cas Infini"
          >
            <InfinityIcon className="w-5 h-5" />
          </button>

          {/* Reset Button */}
          <button 
             onClick={() => {
               setHalfLength(3.0);
               setDistance(2.0);
               setHeightM(0.0);
               setCurrentDirection(1);
               setIsInfinite(false);
             }}
             title="Réinitialiser"
             className="flex items-center justify-center w-9 h-9 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all shadow-inner border border-slate-700/50 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

        {/* Result display */}
        <div className="w-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 overflow-x-auto py-2 px-1">
          {isInfinite ? (
            <LatexMath 
               math={`\\vec{B}(M) = \\frac{\\mu_0 I}{2\\pi d} \\vec{k} \\approx ${ (currentDirection * 2 / distance).toFixed(3) } \\frac{\\mu_0 I}{4\\pi} \\vec{k}`} 
               block={false} 
               className="text-[10px] sm:text-sm whitespace-nowrap"
            />
          ) : (
            <LatexMath 
               math={`\\vec{B}(M) = \\frac{\\mu_0 I}{4\\pi d} \\left[ \\sin(${ (alpha2 * 180 / Math.PI).toFixed(1) }^\\circ) - \\sin(${ (alpha1 * 180 / Math.PI).toFixed(1) }^\\circ) \\right] \\vec{k} \\approx ${ (currentDirection * (Math.sin(alpha2) - Math.sin(alpha1)) / distance).toFixed(3) } \\frac{\\mu_0 I}{4\\pi} \\vec{k}`} 
               block={false} 
               className="text-[10px] sm:text-sm whitespace-nowrap"
            />
          )}
        </div>
      </div>
  );
}
