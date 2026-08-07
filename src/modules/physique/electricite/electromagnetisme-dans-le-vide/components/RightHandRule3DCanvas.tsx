"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export default function RightHandRule3DCanvas() {
  const [chargeType, setChargeType] = useState<"positive" | "negative">("positive");

  const q = chargeType === "positive" ? 1 : -1;
  
  // v = (1, 0, 0), B = (0, 1, 0), so v x B = (0, 0, 1)
  // F = q * (v x B) -> (0, 0, q)
  
  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800 flex flex-col">
      {/* Controls */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 sm:p-3 rounded-xl pointer-events-auto shadow-xl">
        <h4 className="text-slate-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Signe de la Charge</h4>
        
        <button 
          onClick={() => setChargeType("positive")}
          className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${chargeType === "positive" ? "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-transparent border-red-900/50 text-red-400 hover:bg-red-900/30"}`}
        >
          Charge Positive (+q)
        </button>
        <button 
          onClick={() => setChargeType("negative")}
          className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${chargeType === "negative" ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent border-blue-900/50 text-blue-400 hover:bg-blue-900/30"}`}
        >
          Charge Négative (-e)
        </button>
      </div>

      <Canvas camera={{ position: [4, 4, 4], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 1.5} />
        
        <group position={[0, 0, 0]}>
          
          {/* Particle */}
          <Sphere args={[0.2, 32, 32]} position={[0, 0, 0]}>
            <meshPhysicalMaterial 
              color={chargeType === "positive" ? "#ef4444" : "#3b82f6"} 
              emissive={chargeType === "positive" ? "#b91c1c" : "#1d4ed8"} 
              emissiveIntensity={0.5} 
              metalness={0.8}
              roughness={0.2}
            />
            <Html position={[0.3, 0.3, 0]} center>
              <div className={`font-bold font-mono text-sm px-1.5 py-0.5 rounded ${chargeType === "positive" ? "text-red-300 bg-red-900/80 border border-red-500/50" : "text-blue-300 bg-blue-900/80 border border-blue-500/50"}`}>
                {chargeType === "positive" ? "+q" : "-e"}
              </div>
            </Html>
          </Sphere>

          {/* Vitesse v */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [2, 0, 0]]} color="#a855f7" lineWidth={5} />
            <mesh position={[2, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
            <Html position={[2.3, 0, 0]} center>
              <div className="text-purple-400 font-bold font-mono text-base drop-shadow-md">v</div>
            </Html>
          </group>

          {/* Champ B */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 2, 0]]} color="#10b981" lineWidth={5} />
            <mesh position={[0, 2, 0]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <Html position={[0, 2.3, 0]} center>
              <div className="text-emerald-400 font-bold font-mono text-base drop-shadow-md">B</div>
            </Html>
          </group>

          {/* Force Magnétique Fm = q(v x B) */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 0, q * 2]]} color="#f59e0b" lineWidth={7} />
            <mesh position={[0, 0, q * 2]} rotation={[q > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.2, 0.5, 16]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
            <Html position={[0, 0.2, q * 2.4]} center>
              <div className="text-amber-400 font-bold font-mono text-base bg-slate-900/80 px-2 py-0.5 rounded-lg border border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Fm
              </div>
            </Html>
          </group>

          {/* Arcs pour montrer le produit vectoriel */}
          <Line 
            points={(() => {
              const pts = [];
              for(let i=0; i<=16; i++) {
                const a = (i/16) * (Math.PI / 2);
                pts.push(new THREE.Vector3(1*Math.cos(a), 1*Math.sin(a), 0));
              }
              return pts;
            })()}
            color="#64748b"
            lineWidth={2}
          />
          <mesh position={[Math.cos(Math.PI/4), Math.sin(Math.PI/4), 0]} rotation={[0, 0, Math.PI/4]}>
             <coneGeometry args={[0.08, 0.2, 8]} />
             <meshBasicMaterial color="#64748b" />
          </mesh>

        </group>

        {/* Ground Shadow */}
        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.3} far={5} color="#0f172a" />
      </Canvas>
    </div>
  );
}
