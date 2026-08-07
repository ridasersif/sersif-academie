"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Cylinder, Sphere, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export default function MagneticSymmetry3DCanvas() {
  const [planeType, setPlaneType] = useState<"none" | "symmetry" | "antisymmetry">("none");

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800 flex flex-col">
      {/* Controls - Responsive */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 sm:p-3 rounded-xl pointer-events-auto shadow-xl">
        <h4 className="text-slate-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Visualiser les Plans</h4>
        
        <button 
          onClick={() => setPlaneType("none")}
          className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${planeType === "none" ? "bg-slate-700 border-slate-500 text-white shadow-lg shadow-slate-900/50" : "bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800"}`}
        >
          Cacher les plans
        </button>
        <button 
          onClick={() => setPlaneType("symmetry")}
          className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${planeType === "symmetry" ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent border-blue-900/50 text-blue-400 hover:bg-blue-900/30"}`}
        >
          Plan de Symétrie (Π)
        </button>
        <button 
          onClick={() => setPlaneType("antisymmetry")}
          className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${planeType === "antisymmetry" ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-transparent border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/30"}`}
        >
          Plan d&apos;Antisymétrie (Π*)
        </button>
      </div>

      {/* Info panel - Responsive */}
      <div className="absolute bottom-3 right-3 sm:top-4 sm:right-4 sm:bottom-auto z-10 w-[180px] sm:max-w-[220px] bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl pointer-events-none shadow-xl">
        {planeType === "none" && (
          <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed font-medium">Sélectionnez un plan pour voir son effet sur le vecteur champ magnétique <span className="text-emerald-400 font-bold">B</span> et la densité de courant <span className="text-blue-400 font-bold">j</span>.</p>
        )}
        {planeType === "symmetry" && (
          <div className="text-[10px] sm:text-[11px] leading-relaxed">
            <span className="text-blue-400 font-bold block mb-1">Plan Π (Symétrie)</span>
            <p className="text-slate-300 mb-2">Contient le fil. La distribution de courant <span className="text-blue-400 font-bold">j</span> appartient à ce plan.</p>
            <p className="text-emerald-400 font-bold bg-emerald-950/50 p-2 rounded border border-emerald-800/50">Le champ B est PERPENDICULAIRE au plan Π.</p>
          </div>
        )}
        {planeType === "antisymmetry" && (
          <div className="text-[10px] sm:text-[11px] leading-relaxed">
            <span className="text-emerald-400 font-bold block mb-1">Plan Π* (Antisymétrie)</span>
            <p className="text-slate-300 mb-2">Perpendiculaire au fil. Les courants traversent ce plan.</p>
            <p className="text-emerald-400 font-bold bg-emerald-950/50 p-2 rounded border border-emerald-800/50">Le champ B APPARTIENT au plan Π*.</p>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [5, 4, 6], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={true} autoRotate={false} maxPolarAngle={Math.PI / 1.5} />
        
        <group position={[0, 0.5, 0]}>
          {/* Wire (Cylinder) with realistic material */}
          <Cylinder args={[0.2, 0.2, 10, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial 
              color="#94a3b8" 
              metalness={0.9} 
              roughness={0.2} 
              clearcoat={1}
            />
          </Cylinder>
          
          {/* Current vector j with glow effect */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 0, 3]]} color="#3b82f6" lineWidth={6} />
            <mesh position={[0, 0, 3]} rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.2, 0.6, 16]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <Html position={[0, 0.3, 3]} center>
              <div className="text-blue-400 font-bold font-mono text-base drop-shadow-md">j</div>
            </Html>
          </group>

          {/* Magnetic Field B line (Circle) */}
          <Line 
            points={(() => {
              const pts = [];
              for(let i=0; i<=64; i++) {
                const a = (i/64) * Math.PI * 2;
                pts.push(new THREE.Vector3(3*Math.cos(a), 3*Math.sin(a), 0));
              }
              return pts;
            })()}
            color="#10b981"
            lineWidth={3}
          />
          
          {/* Point M */}
          <Sphere args={[0.15, 32, 32]} position={[3, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
            <Html position={[3.3, 0.2, 0]} center>
              <div className="text-amber-400 font-bold font-mono text-base drop-shadow-md">M</div>
            </Html>
          </Sphere>

          {/* Vector B at Point M */}
          <group position={[3, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 2.5, 0]]} color="#10b981" lineWidth={6} />
            <mesh position={[0, 2.5, 0]}>
              <coneGeometry args={[0.2, 0.6, 16]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <Html position={[0, 2.8, 0]} center>
              <div className="text-emerald-400 font-bold font-mono text-base drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">B</div>
            </Html>
          </group>

          {/* Symmetry Plane (Contains the wire and point M) */}
          {planeType === "symmetry" && (
            <mesh rotation={[Math.PI/2, 0, 0]} position={[1.5, 0, 0]}>
              <planeGeometry args={[7, 10]} />
              <meshPhysicalMaterial 
                color="#3b82f6" 
                transparent 
                opacity={0.15} 
                side={THREE.DoubleSide} 
                transmission={0.5}
                thickness={0.1}
                roughness={0.1}
              />
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(7, 10)]} />
                <lineBasicMaterial color="#3b82f6" linewidth={2} />
              </lineSegments>
              <Html position={[3, 4.5, 0]} center>
                <div className="text-blue-300 font-bold bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs border border-blue-500/50 shadow-lg">Plan Π</div>
              </Html>
            </mesh>
          )}

          {/* Antisymmetry Plane (Perpendicular to wire, contains M) */}
          {planeType === "antisymmetry" && (
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[8, 8]} />
              <meshPhysicalMaterial 
                color="#10b981" 
                transparent 
                opacity={0.15} 
                side={THREE.DoubleSide} 
                transmission={0.5}
                thickness={0.1}
                roughness={0.1}
              />
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(8, 8)]} />
                <lineBasicMaterial color="#10b981" linewidth={2} />
              </lineSegments>
              <Html position={[3.5, 3.5, 0]} center>
                <div className="text-emerald-300 font-bold bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs border border-emerald-500/50 shadow-lg">Plan Π*</div>
              </Html>
            </mesh>
          )}
        </group>

        {/* Ground Shadow */}
        <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.5} far={10} color="#0f172a" />
      </Canvas>
    </div>
  );
}
