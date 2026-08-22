"use client";

import React, { Suspense, useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Ring } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

// A single rectangular spire for the toroidal coil
function ToroidalSpire({ angle, R1, R2, h, color, dirI }: { angle: number, R1: number, R2: number, h: number, color: string, dirI: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // The path of the rectangle (in the local XZ plane if we rotate by angle around Z)
  // Local X is radial distance (rho), local Y is 0, local Z is Z.
  // Points: (R1, 0, -h/2) -> (R1, 0, h/2) -> (R2, 0, h/2) -> (R2, 0, -h/2) -> (R1, 0, -h/2)
  const pts = useMemo(() => [
    new THREE.Vector3(R1, 0, -h/2),
    new THREE.Vector3(R1, 0, h/2),
    new THREE.Vector3(R2, 0, h/2),
    new THREE.Vector3(R2, 0, -h/2),
    new THREE.Vector3(R1, 0, -h/2)
  ], [R1, R2, h]);

  // Path length for animation
  const perimeter = 2 * (R2 - R1) + 2 * h;
  const speed = 4.0;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = (clock.elapsedTime * speed) % perimeter;
      const dist = dirI === 1 ? t : (perimeter - t);
      
      let x = 0, z = 0;
      let anglePart = 0;

      if (dist <= h) {
        // Going up inner side
        x = R1;
        z = -h/2 + dist;
        anglePart = 0; // pointing up
      } else if (dist <= h + (R2 - R1)) {
        // Going out on top side
        x = R1 + (dist - h);
        z = h/2;
        anglePart = -Math.PI/2; // pointing right
      } else if (dist <= 2*h + (R2 - R1)) {
        // Going down outer side
        x = R2;
        z = h/2 - (dist - (h + R2 - R1));
        anglePart = Math.PI; // pointing down
      } else {
        // Going in on bottom side
        x = R2 - (dist - (2*h + R2 - R1));
        z = -h/2;
        anglePart = Math.PI/2; // pointing left
      }

      groupRef.current.position.set(x, 0, z);
      groupRef.current.rotation.set(0, anglePart, 0);
    }
  });

  return (
    <group rotation={[0, 0, angle]}>
      {/* Wire Frame */}
      <Line points={pts} color={color} lineWidth={1.5} transparent opacity={0.6} />
      
      {/* Animated Current Particle */}
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
        {/* Arrow head pointing in local +Z direction */}
        <mesh position={[0, 0, 0.15]} rotation={[Math.PI/2, 0, 0]}>
          <coneGeometry args={[0.06, 0.2, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

function AmpereCircle({ radius, isZero, dirI }: { radius: number, isZero: boolean, dirI: number }) {
  const pts = useMemo(() => {
    const arr = [];
    for(let i=0; i<=64; i++) {
      arr.push(new THREE.Vector3(radius*Math.cos(i*2*Math.PI/64), radius*Math.sin(i*2*Math.PI/64), 0));
    }
    return arr;
  }, [radius]);

  const color = isZero ? "#ef4444" : "#ec4899"; // Red if B=0, Pink if B!=0

  return (
    <group>
      <Line points={pts} color={color} lineWidth={3} dashed dashSize={0.2} gapSize={0.1} />
      
      {/* Direction Arrows on the contour */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((ang, idx) => (
        <group key={idx} position={[radius*Math.cos(ang), radius*Math.sin(ang), 0]} rotation={[0, 0, ang + (dirI === 1 ? Math.PI/2 : -Math.PI/2)]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}

      {/* Label Removed for mobile clarity */}
    </group>
  );
}

function CylindricalBasis({ radius }: { radius: number }) {
  const basisAng = Math.PI / 6;
  const pos = new THREE.Vector3(radius * Math.cos(basisAng), radius * Math.sin(basisAng), 0);
  
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Point M */}
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html position={[0.2, 0.2, 0]} center>
        <span className="text-white font-bold font-serif text-sm drop-shadow-md">M</span>
      </Html>

      {/* e_rho (Radial) */}
      <group rotation={[0, 0, basisAng]}>
        <Line points={[[0,0,0], [1.5, 0, 0]]} color="#ef4444" lineWidth={3} />
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[1.8, 0, 0]} center>
          <div className="text-red-400 font-bold italic font-serif text-sm drop-shadow-md">e<sub>ρ</sub></div>
        </Html>
      </group>

      {/* e_phi (Tangential) */}
      <group rotation={[0, 0, basisAng + Math.PI/2]}>
        <Line points={[[0,0,0], [1.5, 0, 0]]} color="#10b981" lineWidth={3} />
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <Html position={[1.8, 0, 0]} center>
          <div className="text-emerald-400 font-bold italic font-serif text-sm drop-shadow-md">e<sub>φ</sub></div>
        </Html>
      </group>

      {/* e_z (Vertical) */}
      <group rotation={[0, -Math.PI/2, 0]}>
        <Line points={[[0,0,0], [1.5, 0, 0]]} color="#3b82f6" lineWidth={3} />
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        <Html position={[1.8, 0.2, 0]} center>
          <div className="text-blue-400 font-bold italic font-serif text-sm drop-shadow-md">e<sub>z</sub></div>
        </Html>
      </group>
    </group>
  );
}

function CircleLine({ radius, z, color }: { radius: number, z: number, color: string }) {
  const pts = useMemo(() => {
    const arr = [];
    for(let i=0; i<=64; i++) {
      arr.push(new THREE.Vector3(radius*Math.cos(i*2*Math.PI/64), radius*Math.sin(i*2*Math.PI/64), z));
    }
    return arr;
  }, [radius, z]);
  return <Line points={pts} color={color} lineWidth={2.0} transparent opacity={0.6} />;
}

function ToroidalScene({ rho, R1, R2, h, planeMode, dirI }: { rho: number, R1: number, R2: number, h: number, planeMode: string, dirI: number }) {
  
  const numSpires = 32;
  const spires = useMemo(() => {
    const arr = [];
    for(let i=0; i<numSpires; i++) {
      arr.push(i * 2 * Math.PI / numSpires);
    }
    return arr;
  }, [numSpires]);

  const isZero = rho < R1 || rho > R2;

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI/4, 0, 0]}>
      
      {/* Solid Torus Body (Semi-transparent square section) */}
      <group rotation={[Math.PI/2, 0, 0]}>
        {/* Inner Wall */}
        <mesh>
          <cylinderGeometry args={[R1, R1, h, 12, 1, true]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.2} roughness={0.1} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Outer Wall */}
        <mesh>
          <cylinderGeometry args={[R2, R2, h, 12, 1, true]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.2} roughness={0.1} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Top Lid */}
        <mesh position={[0, h/2, 0]} rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[R1, R2, 64]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.2} roughness={0.1} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom Lid */}
        <mesh position={[0, -h/2, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[R1, R2, 64]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.2} roughness={0.1} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Edges of the square torus */}
      <CircleLine radius={R1} z={h/2} color="#64748b" />
      <CircleLine radius={R1} z={-h/2} color="#64748b" />
      <CircleLine radius={R2} z={h/2} color="#64748b" />
      <CircleLine radius={R2} z={-h/2} color="#64748b" />

      {/* The Spires */}
      {spires.map((ang, i) => (
        <ToroidalSpire key={i} angle={ang} R1={R1} R2={R2} h={h} color="#f59e0b" dirI={dirI} />
      ))}

      {/* Axis Z */}
      <Line points={[[0, 0, -h-2], [0, 0, h+2]]} color="#94a3b8" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
      <Html position={[0, 0, h+2.5]} center><span className="text-slate-400 italic">Axe z (Δ)</span></Html>

      {/* Cylindrical Basis at point M on the contour */}
      <CylindricalBasis radius={rho} />

      {/* Ampere Contour */}
      <AmpereCircle radius={rho} isZero={isZero} dirI={dirI} />

      {/* Magnetic Field B (Only inside) */}
      {!isZero && (
        <group>
          {/* Draw B vectors along the contour */}
          {[Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4].map((ang, idx) => {
            const bx = rho * Math.cos(ang);
            const by = rho * Math.sin(ang);
            // Tangent direction
            const tangentAng = ang + (dirI === 1 ? Math.PI/2 : -Math.PI/2);
            return (
              <group key={idx} position={[bx, by, 0]} rotation={[0, 0, tangentAng]}>
                <Line points={[[0,0,0], [1.5, 0, 0]]} color="#34d399" lineWidth={3} />
                <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
                  <coneGeometry args={[0.1, 0.3, 8]} />
                  <meshBasicMaterial color="#34d399" />
                </mesh>
                {idx === 0 && (
                  <Html position={[1.0, -0.4, 0]} center>
                    <div className="text-emerald-400 font-bold italic font-serif text-sm drop-shadow-md">B</div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Sym Plane (Meridian plane containing Z axis) => Normal is Y (if we take XZ plane) */}
      {planeMode === "sym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[14, 10]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          <Line points={[[-7, 5, 0], [7, 5, 0], [7, -5, 0], [-7, -5, 0], [-7, 5, 0]]} rotation={[Math.PI/2, 0, 0]} color="#3b82f6" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, -4.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-blue-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 backdrop-blur-md flex flex-col items-center pointer-events-none">
              <span>Plan Méridien Π</span>
              <span className="text-[8px] text-blue-300/80">(Symétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Anti-Sym Plane (Equatorial plane Z=0) => Normal is Z */}
      {planeMode === "antisym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[12, 12]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          <Line points={[[6, 6, 0], [6, -6, 0], [-6, -6, 0], [-6, 6, 0], [6, 6, 0]]} color="#10b981" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
          <Html position={[0, -5.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30 backdrop-blur-md flex flex-col items-center pointer-events-none">
              <span>Plan Équatorial Π*</span>
              <span className="text-[8px] text-emerald-300/80">(Antisymétrie)</span>
            </div>
          </Html>
        </group>
      )}

    </group>
  );
}

export default function ToroidalCoil3DCanvas() {
  const [rho, setRho] = useState(2.5); // Default in between R1 and R2
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  const [dirI, setDirI] = useState(1);
  
  const R1 = 1.5;
  const R2 = 3.5;
  const h = 2.0;

  const isZero = rho < R1 || rho > R2;

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
        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 6, 12], fov: 40 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          
          <Environment preset="night" />
          <OrbitControls enableDamping dampingFactor={0.05} makeDefault minDistance={5} maxDistance={30} />
          
          <ToroidalScene rho={rho} R1={R1} R2={R2} h={h} planeMode={planeMode} dirI={dirI} />

          <ContactShadows resolution={512} scale={30} blur={2} opacity={0.5} far={15} color="#000000" position={[0, -5.9, 0]} />
                    </Suspense>
          </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-sm">
        
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shrink-0">
            {/* Toggle: Current Direction */}
            <button
              onClick={() => setDirI(dirI === 1 ? -1 : 1)}
              className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                dirI === 1
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
              }`}
            >
              Sens I : {dirI === 1 ? "Direct" : "Inverse"}
            </button>

            {/* Toggle: Planes */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaneMode(planeMode === "sym" ? "none" : "sym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "sym" 
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                }`}
              >
                Π (Méridien)
              </button>
              <button
                onClick={() => setPlaneMode(planeMode === "antisym" ? "none" : "antisym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "antisym" 
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                Π* (Équatorial)
              </button>
            </div>
          </div>

          {/* Slider: Distance */}
          <div className="flex items-center gap-2 w-full sm:w-64 md:w-80 shrink-0">
            <label className="text-[12px] font-bold text-pink-500 w-2">ρ</label>
            <input 
              type="range" min={0.5} max={5.0} step={0.1} value={rho} 
              onChange={(e) => setRho(parseFloat(e.target.value))}
              className="w-full accent-pink-500"
            />
            <span className="text-[12px] font-mono text-slate-400 w-8">{rho.toFixed(1)}</span>
          </div>

        </div>

        {/* Status Indicator */}
        <div className={`mt-2 p-2 rounded-lg border text-center text-xs font-bold transition-colors ${
          isZero ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        }`}>
          {rho < R1 
            ? "Zone 1 : Trou du tore (I_enl = 0 ➔ B = 0)" 
            : rho > R2 
              ? "Zone 3 : Extérieur (I_enl = NI - NI = 0 ➔ B = 0)"
              : "Zone 2 : Intérieur (I_enl = NI ➔ Champ Magnétique Confiné)"}
        </div>

      </div>

    </div>
  );
}
