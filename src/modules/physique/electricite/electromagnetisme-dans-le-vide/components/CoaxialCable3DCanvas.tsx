"use client";

import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Helper component for animated contour/field lines
function AmpereContour({ radius, isZero = false }: { radius: number, isZero?: boolean }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }
    return pts;
  }, [radius]);

  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current && !isZero) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const color = "#f43f5e"; // rose for contour
  const opacity = 0.8;
  const lineWidth = 3;

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} lineWidth={lineWidth} transparent opacity={opacity} />
      {!isZero && [0, Math.PI, Math.PI/2, 3*Math.PI/2].map((angle, idx) => (
        <group key={idx} position={[radius * Math.cos(angle), 0, radius * Math.sin(angle)]} rotation={[0, angle, 0]}>
          <mesh rotation={[-Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.15, 0.4, 16]} />
            <meshBasicMaterial color={color} transparent opacity={opacity + 0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SurfaceCurrentDensity({ radius, height, dirI, color }: { radius: number, height: number, dirI: number, color: string }) {
  const arrows = useMemo(() => {
    const arr = [];
    // more arrows for larger radius
    const numArrows = Math.floor(16 * radius);
    for (let i = 0; i < numArrows; i++) {
      const angle = (i / numArrows) * Math.PI * 2;
      arr.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }
    return arr;
  }, [radius]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
     if (groupRef.current) {
        groupRef.current.position.y = (clock.elapsedTime * 1.5 * dirI) % 1;
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
                  <coneGeometry args={[0.05, 0.3, 8]} />
                  <meshBasicMaterial color={color} transparent opacity={0.8} />
                </mesh>
                <mesh position={[0, -0.3, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.6]} />
                  <meshBasicMaterial color={color} transparent opacity={0.6} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function CoaxialScene({ rho, R1, R2, planeMode }: { rho: number, R1: number, R2: number, planeMode: string }) {
  let bMag = 0;
  let isZero = true;
  let dirB = 1;

  if (rho > R1 && rho < R2) {
    bMag = (R1 * 2) / rho; // B field from inner cylinder
    isZero = false;
    dirB = 1; // + theta
  } else if (rho >= R2) {
    bMag = 0; // Ideal coaxial: sum I_enl = 0
    isZero = true;
  }
  
  const bVectorLength = bMag * 0.6; 
  const bColor = "#34d399"; // emerald-400

  return (
    <group position={[0, 0, 0]}>
      {/* Inner Cylinder R1 (Copper/Orange) */}
      <Cylinder args={[R1, R1, 8, 32]} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#f97316" metalness={0.6} roughness={0.3} transparent opacity={0.4} side={THREE.DoubleSide} />
      </Cylinder>
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R1*Math.cos(i*2*Math.PI/32), 4, R1*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#fdba74" lineWidth={1} transparent opacity={0.6} />
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R1*Math.cos(i*2*Math.PI/32), -4, R1*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#fdba74" lineWidth={1} transparent opacity={0.6} />
      <SurfaceCurrentDensity radius={R1} height={8} dirI={1} color="#fcd34d" />
      <Html position={[R1, 3, 0]} center>
        <div className="text-amber-400 font-bold font-serif italic text-sm drop-shadow-md pointer-events-none">j<sub>s1</sub></div>
      </Html>

      {/* Outer Cylinder R2 (Gray/Blue) */}
      <Cylinder args={[R2, R2, 8, 32]} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#64748b" metalness={0.8} roughness={0.2} transparent opacity={0.15} side={THREE.DoubleSide} />
      </Cylinder>
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R2*Math.cos(i*2*Math.PI/32), 4, R2*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />
      <Line points={(() => {
        const pts = [];
        for(let i=0; i<=32; i++) pts.push(new THREE.Vector3(R2*Math.cos(i*2*Math.PI/32), -4, R2*Math.sin(i*2*Math.PI/32)));
        return pts;
      })()} color="#94a3b8" lineWidth={1} transparent opacity={0.4} />
      <SurfaceCurrentDensity radius={R2} height={8} dirI={-1} color="#60a5fa" />
      <Html position={[R2, -3, 0]} center>
        <div className="text-blue-400 font-bold font-serif italic text-sm drop-shadow-md pointer-events-none">- j<sub>s2</sub></div>
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
      <AmpereContour radius={rho} isZero={isZero} />

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
          <Line points={[[0,0,0], [1.2, 0, 0]]} color="#c084fc" lineWidth={2} />
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[1.5, 0, 0]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>ρ</sub></div></Html>

          <Line points={[[0,0,0], [0, 1.2, 0]]} color="#c084fc" lineWidth={2} />
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[0, 1.5, 0]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>z</sub></div></Html>

          <Line points={[[0,0,0], [0, 0, -1.2]]} color="#c084fc" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
          <mesh position={[0, 0, -1.2]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html position={[0, 0.2, -1.5]} center zIndexRange={[100,0]}><div className="text-purple-300 text-[12px] italic font-bold pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">e<sub>θ</sub></div></Html>
        </group>

        {/* Magnetic Field Vector B */}
        {!isZero && (
          <group>
            <Line points={[[0,0,0], [0, 0, -dirB * bVectorLength]]} color={bColor} lineWidth={5} />
            <mesh position={[0, 0, -dirB * bVectorLength]} rotation={[dirB > 0 ? -Math.PI/2 : Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color={bColor} toneMapped={false} />
            </mesh>
            <Html position={[0, 0.3, -dirB * (bVectorLength + 0.3)]} center zIndexRange={[100,0]}>
              <div className="text-emerald-400 font-black italic font-serif text-sm drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none">B</div>
            </Html>
          </group>
        )}
      </group>
    </group>
  );
}

export default function CoaxialCable3DCanvas() {
  const [rho, setRho] = useState(1.5); // Default in between cylinders
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  
  const R1 = 0.8;
  const R2 = 1.8;

  const percRho = ((rho - 0.2) / (3.5 - 0.2)) * 100;

  // Determine Zone
  let zoneText = "";
  let bFormula = "";
  if (rho < R1) {
    zoneText = "Zone 1 : À l'intérieur (ρ < R₁)";
    bFormula = "\\vec{B}(M) = \\vec{0}";
  } else if (rho > R1 && rho < R2) {
    zoneText = "Zone 2 : Entre les cylindres (R₁ < ρ < R₂)";
    bFormula = "\\vec{B}(M) = \\frac{\\mu_0 j_{s1} R_1}{\\rho} \\, \\vec{e_\\theta}";
  } else {
    zoneText = "Zone 3 : À l'extérieur (ρ > R₂)";
    // Assuming ideal coaxial cable (I_total = 0)
    bFormula = "\\vec{B}(M) = \\frac{\\mu_0}{\\rho} (j_{s1} R_1 - j_{s2} R_2) \\vec{e_\\theta}";
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col font-sans mb-8">
      
      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        {/* Label Concours */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 max-w-[calc(100%-1rem)] pointer-events-none">
          <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-[9px] sm:text-xs font-bold px-2 py-1 sm:px-3 rounded-full flex items-center gap-1 sm:gap-2 backdrop-blur-md shadow-lg shadow-yellow-500/10 whitespace-normal text-center sm:text-left leading-tight">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            Extrait du Concours d'Enseignement 2025
          </div>
        </div>

        <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          
          <Environment preset="night" />
          <OrbitControls enableDamping dampingFactor={0.05} makeDefault minDistance={3} maxDistance={25} />
          
          <gridHelper args={[24, 24, 0x1e293b, 0x090f1e]} position={[0, -4, 0]} />

          <CoaxialScene rho={rho} R1={R1} R2={R2} planeMode={planeMode} />

          <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -3.9, 0]} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-sm">
        
        {/* Row 1: Controls */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Group 1: Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
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

          {/* Group 2: Slider & Reset */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full lg:w-auto">
            {/* Slider: Distance */}
            <div className="flex items-center gap-2 w-full sm:w-64 md:w-80 shrink-0">
              <label className="text-[12px] font-bold text-rose-500 w-2">ρ</label>
              <input 
                type="range" min={0.2} max={3.5} step={0.1} value={rho} 
                onChange={(e) => setRho(parseFloat(e.target.value))} 
                className="w-full h-2 rounded-full appearance-none cursor-pointer shadow-inner [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
                style={{ background: `linear-gradient(to right, #f43f5e ${percRho}%, #f1f5f9 ${percRho}%)` }} 
              />
            </div>
            {/* Reset */}
            <button 
              onClick={() => { setRho(1.5); }}
              className="w-8 h-8 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 shadow-inner border border-slate-700/50"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Result display */}
        <div className="w-full mt-2 bg-slate-900/50 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center gap-2">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{zoneText}</span>
          <div className="text-emerald-400 font-bold flex items-center gap-2 text-sm sm:text-base">
            <LatexMath math={bFormula} block={false} />
          </div>
          {rho >= R2 && (
             <div className="text-[10px] text-yellow-400/80 bg-yellow-950/50 px-3 py-1 rounded-md border border-yellow-500/20 mt-1">
               Idéalement B = 0 si les courants s'annulent (j_{"s1"} R₁ = j_{"s2"} R₂) !
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
