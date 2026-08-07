"use client";

import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Environment, ContactShadows, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

// Flow of current dots
function FlowDots({ currentI }: { currentI: number }) {
  const groupRef = React.useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y += currentI * 2 * delta;
      if (groupRef.current.position.y > 1) groupRef.current.position.y -= 1;
      if (groupRef.current.position.y < -1) groupRef.current.position.y += 1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -10 + i, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      ))}
    </group>
  );
}

export default function BiotSavart3DCanvas() {
  const [distanceR, setDistanceR] = useState(3.0);
  const [angleTheta, setAngleTheta] = useState(90); // 0 to 180
  const [currentI, setCurrentI] = useState(1); // 1 or -1

  const thetaRad = (angleTheta * Math.PI) / 180;
  
  // Position of M
  const mPos = new THREE.Vector3(distanceR * Math.sin(thetaRad), distanceR * Math.cos(thetaRad), 0);
  
  // u vector (unit vector towards M)
  const uVec = mPos.clone().normalize();
  
  // dB vector = dl x u
  const dbMagDisplay = (currentI * Math.sin(thetaRad) * 10) / (distanceR * distanceR);
  const dbVec = new THREE.Vector3(0, 0, -dbMagDisplay);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* HUD Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-auto">
           <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-xl shadow-xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
             <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
               <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
               <span className="text-slate-300">Élément :</span>
               <span className="text-blue-400 font-mono font-bold">I·dl</span>
             </div>
             <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
               <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
               <span className="text-slate-300">Vecteur unitaire :</span>
               <span className="text-emerald-400 font-mono font-bold">u</span>
             </div>
             <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
               <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
               <span className="text-slate-300">Champ :</span>
               <span className="text-amber-400 font-mono font-bold">dB</span>
             </div>
           </div>
        </div>

        {/* Formule HUD Bottom Left (Inside 3D View) */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
           <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
              <span className="text-amber-400 font-serif italic font-bold text-sm">dB</span>
              <span className="text-slate-400">=</span>
              <span className="text-slate-300 font-serif italic text-xs">k</span>
              <span className="text-slate-400">·</span>
              <div className="flex flex-col items-center">
                 <span className="text-emerald-300 font-serif italic text-xs border-b border-slate-600 pb-0.5">I·dl ∧ u</span>
                 <span className="text-purple-300 font-serif italic text-xs pt-0.5">r²</span>
              </div>
           </div>
        </div>

        <Canvas camera={{ position: [5, 4, 8], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 15, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} target={[0, 1, 0]} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -2.5, 0]} />

          <group position={[0, 0, 0]}>
             {/* Fil conducteur infini */}
             <Cylinder args={[0.03, 0.03, 15, 16]} position={[0, 0, 0]}>
                <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.2} transparent opacity={0.5} />
             </Cylinder>

             {/* Courant animé */}
             <FlowDots currentI={currentI} />

             {/* Élément dl */}
             <group position={[0, 0, 0]}>
                <Cylinder args={[0.05, 0.05, 0.6, 16]}>
                   <meshBasicMaterial color="#3b82f6" />
                </Cylinder>
                {/* Flèche I dl */}
                <mesh position={[0, currentI > 0 ? 0.3 : -0.3, 0]} rotation={[currentI > 0 ? 0 : Math.PI, 0, 0]}>
                   <coneGeometry args={[0.09, 0.25, 16]} />
                   <meshBasicMaterial color="#3b82f6" />
                </mesh>
                <Html position={[0.4, 0, 0]} center>
                   <div className="text-blue-400 font-bold font-mono text-xs whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                     I·dl
                   </div>
                </Html>
             </group>

             {/* Distance r (Ligne pointillée vers M) */}
             <Line 
               points={[[0,0,0], mPos.toArray()]} 
               color="#a855f7" 
               lineWidth={2} 
               transparent opacity={0.5} 
               dashed dashSize={0.2} gapSize={0.1} 
             />
             <Html position={[mPos.x/2 - 0.2, mPos.y/2, 0]} center>
               <div className="text-purple-300 font-serif italic text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">r</div>
             </Html>

             {/* Vecteur u */}
             <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [uVec.x * 1.5, uVec.y * 1.5, uVec.z * 1.5]]} color="#10b981" lineWidth={2} />
                <mesh position={[uVec.x * 1.5, uVec.y * 1.5, uVec.z * 1.5]} rotation={[0, 0, -thetaRad]}>
                   <coneGeometry args={[0.08, 0.3, 16]} />
                   <meshBasicMaterial color="#10b981" toneMapped={false} />
                </mesh>
                <Html position={[uVec.x * 1.8, uVec.y * 1.8, uVec.z * 1.8]} center>
                   <div className="text-emerald-400 font-bold font-mono text-xs whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                     u
                   </div>
                </Html>
             </group>

             {/* Point M et vecteur dB */}
             <group position={mPos.toArray()}>
                {/* Point M */}
                <Sphere args={[0.15, 32, 32]}>
                  <meshPhysicalMaterial color="#f8fafc" emissive="#cbd5e1" emissiveIntensity={0.5} />
                  <Html position={[0.3, 0.3, 0]} center>
                    <div className="text-white font-bold text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">M</div>
                  </Html>
                </Sphere>

                {/* Vecteur dB (s'il n'est pas nul) */}
                {Math.abs(dbMagDisplay) > 0.05 && (
                  <group>
                     <Line points={[[0, 0, 0], dbVec.toArray()]} color="#f59e0b" lineWidth={3} />
                     <mesh position={dbVec.toArray()} rotation={[dbVec.z > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
                        <coneGeometry args={[0.09, 0.3, 16]} />
                        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                     </mesh>
                     <Html position={[dbVec.x, dbVec.y, dbVec.z + (dbVec.z > 0 ? 0.5 : -0.5)]} center>
                       <div className="text-amber-400 font-bold font-mono text-xs whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                         dB
                       </div>
                     </Html>
                  </group>
                )}
             </group>
             
             {/* Arc pour l'angle theta */}
             {angleTheta > 0 && angleTheta < 180 && (
                <mesh position={[0,0,0]}>
                  <ringGeometry args={[0.8, 0.85, 32, 1, Math.PI/2 - thetaRad, thetaRad]} />
                  <meshBasicMaterial color="#94a3b8" side={THREE.DoubleSide} />
                  <Html position={[1.2 * Math.sin(thetaRad/2), 1.2 * Math.cos(thetaRad/2), 0]} center>
                    <div className="text-slate-300 text-xs font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">θ</div>
                  </Html>
                </mesh>
             )}
          </group>

          <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.4} far={10} color="#0f172a" position={[0, -2.4, 0]} />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="w-full bg-card border border-border border-t-0 p-4 sm:p-5 rounded-b-2xl flex flex-wrap items-center justify-center gap-6 sm:gap-8">
         
         {/* Courant */}
         <div className="flex flex-col gap-2 shrink-0">
           <span className="text-[10px] font-bold text-foreground/80 dark:text-slate-300 uppercase tracking-wider text-center">Courant I</span>
           <div className="flex flex-row gap-1 h-7">
             <button 
               onClick={() => setCurrentI(1)}
               className={`flex-1 px-4 text-xs font-bold rounded transition-all border ${currentI === 1 ? "bg-blue-500/20 dark:bg-blue-600/90 border-blue-400 text-blue-600 dark:text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-muted border-border text-muted-foreground hover:bg-muted/80"}`}
             >
               ↑
             </button>
             <button 
               onClick={() => setCurrentI(-1)}
               className={`flex-1 px-4 text-xs font-bold rounded transition-all border ${currentI === -1 ? "bg-red-500/20 dark:bg-red-600/90 border-red-400 text-red-600 dark:text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "bg-muted border-border text-muted-foreground hover:bg-muted/80"}`}
             >
               ↓
             </button>
           </div>
         </div>
         
         {/* Angle */}
         <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-40">
           <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
             <span>Angle θ</span>
             <span className="text-slate-600 dark:text-slate-400">{angleTheta}°</span>
           </div>
           <input 
             type="range" min="0" max="180" value={angleTheta} 
             onChange={(e) => setAngleTheta(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-slate-500 dark:accent-slate-400 cursor-pointer bg-muted" 
           />
         </div>

         {/* Distance r */}
         <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-40">
           <div className="flex justify-between text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
             <span>Distance r</span>
             <span className="text-purple-700 dark:text-purple-400">{distanceR.toFixed(1)}</span>
           </div>
           <input 
             type="range" min="1.5" max="6" step="0.1" value={distanceR} 
             onChange={(e) => setDistanceR(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-purple-600 dark:accent-purple-500 cursor-pointer bg-muted" 
           />
         </div>

         {/* Reset Button */}
         <div className="shrink-0 flex items-center justify-center mt-2 sm:mt-0">
           <button 
              onClick={() => {
                setAngleTheta(90);
                setDistanceR(3.0);
                setCurrentI(1);
              }}
              title="Réinitialiser"
              className="flex items-center justify-center gap-1.5 p-2 px-4 bg-muted hover:bg-muted/80 text-foreground/80 rounded-lg transition-colors border border-border text-[10px] font-bold uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
           </button>
         </div>

      </div>
    </div>
  );
}
