"use client";

import React, { Suspense, useState, useMemo, useRef, useEffect } from "react";
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
        <group key={idx} position={[radius * Math.cos(angle), yOffset, radius * Math.sin(angle)]} rotation={[0, angle + (dir > 0 ? 0 : Math.PI), 0]}>
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <coneGeometry args={[isMain ? 0.15 : 0.1, isMain ? 0.4 : 0.3, 16]} />
            <meshBasicMaterial color={color} transparent opacity={opacity + 0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function UniformCurrentDensity({ radius, height, dirI }: { radius: number, height: number, dirI: number }) {
  // Generate a grid of points inside the cylinder
  const arrows = useMemo(() => {
    const arr = [];
    const step = 0.6;
    for (let x = -radius; x <= radius; x += step) {
      for (let z = -radius; z <= radius; z += step) {
        if (x*x + z*z < radius*radius * 0.8) {
          arr.push(new THREE.Vector3(x, 0, z));
        }
      }
    }
    return arr;
  }, [radius]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
     if (groupRef.current) {
        groupRef.current.position.y = (clock.elapsedTime * 2 * dirI) % 1;
     }
  });

  return (
    <group>
      <group ref={groupRef}>
        {[-3, -1, 1, 3].map((yOffset, i) => (
          <group key={i} position={[0, yOffset, 0]}>
            {arrows.map((pos, j) => (
              <group key={j} position={[pos.x, 0, pos.z]} rotation={[dirI > 0 ? 0 : Math.PI, 0, 0]}>
                <mesh rotation={[0, 0, 0]}>
                  <coneGeometry args={[0.06, 0.4, 8]} />
                  <meshBasicMaterial color="#fcd34d" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0, -0.4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.8]} />
                  <meshBasicMaterial color="#fcd34d" transparent opacity={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function CylinderScene({ rho, dirI, planeMode, R }: { rho: number, dirI: number, planeMode: string, R: number }) {
  const bMag = rho <= R ? rho : (R * R) / rho; 
  const bVectorLength = bMag * 0.8; 
  const bColor = "#34d399"; // emerald-400

  return (
    <group position={[0, 0, 0]}>
      {/* Infinite Cylinder */}
      <Cylinder args={[R, R, 10, 32]} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#3b82f6" metalness={0.2} roughness={0.5} transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
      {/* Cylinder Edges for better visibility */}
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R*Math.cos(i*2*Math.PI/32), 5, R*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#60a5fa" lineWidth={1} transparent opacity={0.5} />
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R*Math.cos(i*2*Math.PI/32), -5, R*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#60a5fa" lineWidth={1} transparent opacity={0.5} />
      
      {/* Current Density Vectors */}
      <UniformCurrentDensity radius={R} height={10} dirI={dirI} />

      {/* Vector j Label */}
      <Html position={[R + 0.5, dirI > 0 ? 3 : -3, 0]} center>
        <div className="text-amber-400 font-bold font-serif italic text-sm drop-shadow-md pointer-events-none">j</div>
      </Html>

      {/* Sym Plane (XY plane containing cylinder axis (Y) and M (X)) => Normal is Z */}
      {planeMode === "sym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[12, 8]} />
            <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Line points={[[-6, 4, 0], [6, 4, 0], [6, -4, 0], [-6, -4, 0], [-6, 4, 0]]} color="#3b82f6" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, 3.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-blue-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 backdrop-blur-md whitespace-nowrap flex flex-col items-center gap-0.5 pointer-events-none">
              <span>Plan Π</span>
              <span className="text-[8px] text-blue-300/80">(Symétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Anti-Sym Plane (XZ plane perpendicular to cylinder (Y) passing through M) => Normal is Y */}
      {planeMode === "antisym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[12, 12]} />
            <meshPhysicalMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Line points={[[-6, 0, 6], [6, 0, 6], [6, 0, -6], [-6, 0, -6], [-6, 0, 6]]} color="#10b981" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, 0, 4.5]} center zIndexRange={[100,0]}>
            <div className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30 backdrop-blur-md whitespace-nowrap flex flex-col items-center gap-0.5 pointer-events-none">
              <span>Plan Π*</span>
              <span className="text-[8px] text-emerald-300/80">(Antisymétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Contour d'Ampère */}
      <AmpereContour radius={rho} dir={dirI} isMain={true} yOffset={0} />

      {/* Centre O du contour */}
      <group position={[0, 0, 0]}>
        <Sphere args={[0.08, 16, 16]}>
          <meshBasicMaterial color="#f43f5e" />
        </Sphere>
        <Html position={[0, 0.3, 0]} center zIndexRange={[100,0]}>
          <div className="text-rose-400 font-bold font-serif text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none">O</div>
        </Html>
      </group>

      {/* Rayon ρ du contour */}
      <Line points={[[0, 0, 0], [rho, 0, 0]]} color="#f43f5e" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
      <Html position={[rho / 2, 0.2, 0]} center zIndexRange={[100,0]}>
        <div className="text-rose-400 font-bold font-serif italic text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none">ρ</div>
      </Html>

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
          <Line points={[[0,0,0], [1.2, 0, 0]]} color="#c084fc" lineWidth={2} />
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[1.5, 0, 0]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>ρ</sub></div></Html>

          {/* uz (along +Y) */}
          <Line points={[[0,0,0], [0, 1.2, 0]]} color="#c084fc" lineWidth={2} />
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[0, 1.5, 0]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>z</sub></div></Html>

          {/* utheta (along -Z if right hand rule around Y) */}
          <Line points={[[0,0,0], [0, 0, -1.2]]} color="#c084fc" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
          <mesh position={[0, 0, -1.2]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[0, 0.2, -1.5]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>θ</sub></div></Html>
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

export default function Cylinder3DCanvas() {
  const [rho, setRho] = useState(3.5);
  const [dirI, setDirI] = useState(1);
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  
  const R = 1.5; // Fixed radius of the cylinder

  const percRho = ((rho - 0.5) / (5 - 0.5)) * 100;

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
    <div className="w-full max-w-[1000px] mx-auto flex flex-col font-sans mb-8">
      
      <div ref={canvasContainerRef} className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [6, 6, 6], fov: 50 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          
          <Environment preset="night" />
          <OrbitControls enableDamping dampingFactor={0.05} makeDefault minDistance={3} maxDistance={25} />
          
          <gridHelper args={[24, 24, 0x1e293b, 0x090f1e]} position={[0, -4, 0]} />

          <CylinderScene rho={rho} dirI={dirI} planeMode={planeMode} R={R} />

          <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -3.9, 0]} />
                    </Suspense>
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
              <label className="text-[12px] font-bold text-orange-500 w-2">ρ</label>
              <input 
                type="range" min={0.5} max={5} step={0.1} value={rho} 
                onChange={(e) => setRho(parseFloat(e.target.value))} 
                className="w-full h-2 rounded-full appearance-none cursor-pointer shadow-inner [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
                style={{ background: `linear-gradient(to right, #f97316 ${percRho}%, #f1f5f9 ${percRho}%)` }} 
              />
            </div>

            {/* Reset */}
            <button 
              onClick={() => { setRho(3.5); setDirI(1); setPlaneMode("none"); }}
              className="w-8 h-8 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 shadow-inner border border-slate-700/50"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div> {/* End Row 1 */}

        {/* Row 2: Result display */}
        <div className="w-full mt-2 bg-slate-900/50 rounded-xl border border-slate-800 p-3 sm:p-4 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base">
            <span className="text-emerald-400 font-bold flex items-center gap-2">
              <LatexMath math={`\\vec{B}(M) = ${dirI > 0 ? "" : "-"}`} block={false} />
              {rho <= R ? (
                 <LatexMath math={`\\frac{\\mu_0 j}{2} \\rho \\, \\vec{e_\\theta}`} block={false} />
              ) : (
                 <LatexMath math={`\\frac{\\mu_0 j R^2}{2 \\rho} \\, \\vec{e_\\theta}`} block={false} />
              )}
            </span>
            <span className="text-slate-500 text-xs font-medium px-2 py-1 bg-slate-800/50 rounded-md">
              {rho <= R ? "À l'intérieur (ρ ≤ R)" : "À l'extérieur (ρ > R)"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
