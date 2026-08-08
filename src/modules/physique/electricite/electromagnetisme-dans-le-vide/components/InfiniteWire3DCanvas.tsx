"use client";

import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Helper component for animated contour/field lines
function AmpereContour({ radius, dir, isMain = false, yOffset = 0 }: { radius: number, dir: number, isMain?: boolean, yOffset?: number }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(angle), yOffset, radius * Math.sin(angle)));
    }
    return pts;
  }, [radius, yOffset]);

  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dir * 0.005;
    }
  });

  const color = isMain ? "#f43f5e" : "#0ea5e9"; // rose for contour, sky for field lines
  const opacity = isMain ? 0.8 : 0.3;
  const lineWidth = isMain ? 3 : 1;

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={lineWidth} transparent opacity={opacity} />
      {[0, Math.PI, Math.PI/2, 3*Math.PI/2].map((angle, idx) => (
        <group key={idx} position={[radius * Math.cos(angle), yOffset, radius * Math.sin(angle)]} rotation={[0, -angle - Math.PI/2 + (dir > 0 ? 0 : Math.PI), 0]}>
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <coneGeometry args={[isMain ? 0.15 : 0.1, isMain ? 0.4 : 0.3, 16]} />
            <meshBasicMaterial color={color} transparent opacity={opacity + 0.2} />
          </mesh>
        </group>
      ))}
      {isMain && (
         <Html position={[radius * Math.cos(Math.PI/4), yOffset + 0.3, radius * Math.sin(Math.PI/4)]} center zIndexRange={[100,0]}>
           <div className="text-rose-400 font-bold font-serif text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded backdrop-blur border border-rose-500/20 pointer-events-none whitespace-nowrap">
             Contour (C)
           </div>
         </Html>
      )}
    </group>
  );
}

function MovingCurrent({ dirI }: { dirI: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
     if (groupRef.current) {
        groupRef.current.position.y = (clock.elapsedTime * 3 * dirI) % 1;
     }
  });

  return (
    <group ref={groupRef}>
      {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((y, i) => (
        <Sphere key={i} args={[0.09, 16, 16]} position={[0, y, 0]}>
          <meshBasicMaterial color="#fcd34d" />
        </Sphere>
      ))}
    </group>
  );
}

function InfiniteWireScene({ rho, dirI, planeMode }: { rho: number, dirI: number, planeMode: string }) {
  const bMag = 3 / rho; 
  const bVectorLength = bMag * 1.5; 
  const bColor = "#34d399"; // emerald-400

  return (
    <group position={[0, 0, 0]}>
      {/* Infinite Wire */}
      <Cylinder args={[0.08, 0.08, 14, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.2} emissive="#d97706" emissiveIntensity={0.5} />
      </Cylinder>
      
      {/* Animated Current */}
      <MovingCurrent dirI={dirI} />

      {/* Current Arrow Label */}
      <group position={[0, dirI > 0 ? 3 : -3, 0]}>
        <mesh rotation={[dirI > 0 ? 0 : Math.PI, 0, 0]}>
          <coneGeometry args={[0.3, 0.8, 16]} />
          <meshStandardMaterial color="#fcd34d" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
        <Html position={[0.5, 0, 0]} center>
          <div className="text-amber-400 font-bold font-mono text-sm drop-shadow-md pointer-events-none">I</div>
        </Html>
      </group>

      {/* Sym Plane (XY plane containing wire (Y) and M (X)) => Normal is Z */}
      {planeMode === "sym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[10, 8]} />
            <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Line points={[[-5, 4, 0], [5, 4, 0], [5, -4, 0], [-5, -4, 0], [-5, 4, 0]]} color="#3b82f6" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, 3.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-blue-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 backdrop-blur-md whitespace-nowrap flex flex-col items-center gap-0.5 pointer-events-none">
              <span>Plan Π</span>
              <span className="text-[8px] text-blue-300/80">(Symétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Anti-Sym Plane (XZ plane perpendicular to wire (Y) passing through M) => Normal is Y */}
      {planeMode === "antisym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[10, 8]} />
            <meshPhysicalMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Line points={[[-5, 0, 4], [5, 0, 4], [5, 0, -4], [-5, 0, -4], [-5, 0, 4]]} color="#10b981" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, 0, 3.5]} center zIndexRange={[100,0]}>
            <div className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30 backdrop-blur-md whitespace-nowrap flex flex-col items-center gap-0.5 pointer-events-none">
              <span>Plan Π*</span>
              <span className="text-[8px] text-emerald-300/80">(Antisymétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Field Lines & Contour d'Ampère */}
      <AmpereContour radius={rho} dir={dirI} isMain={true} yOffset={0} />
      <AmpereContour radius={rho} dir={dirI} isMain={false} yOffset={2.5} />
      <AmpereContour radius={rho} dir={dirI} isMain={false} yOffset={-2.5} />

      {/* Point M */}
      <group position={[rho, 0, 0]}>
        <Sphere args={[0.12, 16, 16]}>
          <meshStandardMaterial color="#f8fafc" emissive="#94a3b8" />
        </Sphere>
        <Html position={[0.1, 0.3, 0]} center zIndexRange={[100,0]}>
          <div className="text-white font-black font-serif text-base drop-shadow-md pointer-events-none">M</div>
        </Html>

        {/* Local Basis */}
        <group>
          {/* ur (along +X) */}
          <Line points={[[0,0,0], [1.2, 0, 0]]} color="#e2e8f0" lineWidth={2} />
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#e2e8f0" toneMapped={false} />
          </mesh>
          <Html position={[1.5, 0, 0]} center zIndexRange={[100,0]}><div className="text-white text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e_ρ</div></Html>

          {/* uz (along +Y) */}
          <Line points={[[0,0,0], [0, 1.2, 0]]} color="#e2e8f0" lineWidth={2} />
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#e2e8f0" toneMapped={false} />
          </mesh>
          <Html position={[0, 1.5, 0]} center zIndexRange={[100,0]}><div className="text-white text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e_z</div></Html>

          {/* utheta (along -Z if right hand rule around Y) */}
          <Line points={[[0,0,0], [0, 0, -1.2]]} color="#e2e8f0" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
          <mesh position={[0, 0, -1.2]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#e2e8f0" toneMapped={false} />
          </mesh>
          <Html position={[0, 0.2, -1.5]} center zIndexRange={[100,0]}><div className="text-white text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e_θ</div></Html>
        </group>

        {/* Magnetic Field Vector B */}
        <group>
          {/* B is along -Z if dirI is 1, and +Z if dirI is -1 */}
          <Line points={[[0,0,0], [0, 0, -dirI * bVectorLength]]} color={bColor} lineWidth={5} />
          <mesh position={[0, 0, -dirI * bVectorLength]} rotation={[dirI > 0 ? -Math.PI/2 : Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.15, 0.4, 16]} />
            <meshBasicMaterial color={bColor} toneMapped={false} />
          </mesh>
          <Html position={[0, 0.3, -dirI * (bVectorLength + 0.3)]} center zIndexRange={[100,0]}>
            <div className="text-emerald-400 font-black italic font-serif text-sm drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none">B</div>
          </Html>
        </group>
      </group>
    </group>
  );
}

export default function InfiniteWire3DCanvas() {
  const [rho, setRho] = useState(2.5);
  const [dirI, setDirI] = useState(1);
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  
  const percRho = ((rho - 1) / (5 - 1)) * 100;

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col font-sans">
      
      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          
          <Environment preset="night" />
          <OrbitControls enableDamping dampingFactor={0.05} makeDefault minDistance={2} maxDistance={20} />
          
          <gridHelper args={[24, 24, 0x1e293b, 0x090f1e]} position={[0, -4, 0]} />

          <InfiniteWireScene rho={rho} dirI={dirI} planeMode={planeMode} />

          <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -3.9, 0]} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-sm">
        
        {/* Row 1: Controls */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Group 1: Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
            {/* Toggle: Sens du courant */}
            <div className="flex items-center bg-slate-800/50 p-1 rounded-xl shrink-0 border border-slate-700/50">
              <button
                onClick={() => setDirI(1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  dirI === 1 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ↑
              </button>
              <button
                onClick={() => setDirI(-1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  dirI === -1 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ↓
              </button>
            </div>

            {/* Toggle: Symetry */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPlaneMode(planeMode === "sym" ? "none" : "sym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "sym" 
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                }`}
              >
                Π
              </button>
              <button
                onClick={() => setPlaneMode(planeMode === "antisym" ? "none" : "antisym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "antisym" 
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                Π*
              </button>
            </div>
          </div>

          {/* Group 2: Sliders & Reset */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full lg:w-auto">
            {/* Slider: Distance */}
            <div className="flex items-center gap-2 w-full sm:w-64 md:w-80 shrink-0">
              <label className="text-[10px] font-bold text-orange-400 uppercase w-2">ρ</label>
              <input 
                type="range" min={1} max={5} step={0.1} value={rho} 
                onChange={(e) => setRho(parseFloat(e.target.value))} 
                className="w-full h-2 rounded-full appearance-none cursor-pointer shadow-inner [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
                style={{ background: `linear-gradient(to right, #fb923c ${percRho}%, #1e293b ${percRho}%)` }} 
              />
            </div>

            {/* Reset */}
            <button 
              onClick={() => { setRho(2.5); setDirI(1); setPlaneMode("none"); }}
              className="w-8 h-8 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 shadow-inner border border-slate-700/50"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div> {/* End Row 1 */}

        {/* Row 2: Result display */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 text-emerald-500 dark:text-emerald-400 overflow-x-auto py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner">
          <LatexMath 
             math={`\\vec{B}(M) = \\frac{\\mu_0 I}{2\\pi \\rho} \\vec{e_\\theta}`} 
             block={false} 
             className="text-sm sm:text-base whitespace-nowrap font-bold"
          />
          <span className="hidden md:block text-slate-500">ou avec signe :</span>
          <LatexMath 
             math={`\\vec{B}(M) = ${dirI > 0 ? "-" : "+"}\\frac{\\mu_0 I}{2\\pi \\rho} \\vec{e_z}`} 
             block={false} 
             className="text-[13px] sm:text-[15px] font-bold whitespace-nowrap"
          />
        </div>

      </div>
    </div>
  );
}
