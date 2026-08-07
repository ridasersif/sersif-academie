"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Environment, ContactShadows, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Crosshair } from "lucide-react";

export default function BiotSavart3DCanvas() {
  const [distanceR, setDistanceR] = useState(3.0);
  const [angleTheta, setAngleTheta] = useState(90); // 0 to 180
  const [currentI, setCurrentI] = useState(1); // 1 or -1

  const thetaRad = (angleTheta * Math.PI) / 180;
  
  // Position of M
  const mPos = new THREE.Vector3(distanceR * Math.sin(thetaRad), distanceR * Math.cos(thetaRad), 0);
  
  // dl vector (along Y axis)
  const dlVec = new THREE.Vector3(0, 1, 0);
  
  // u vector (unit vector towards M)
  const uVec = mPos.clone().normalize();
  
  // dB vector = dl x u
  // (0,1,0) x (sin, cos, 0) = (0, 0, -sin)
  // Scale for visual purposes: 
  // Formula: dB = (I * sin(theta)) / r^2
  const dbMagDisplay = (currentI * Math.sin(thetaRad) * 10) / (distanceR * distanceR);
  const dbVec = new THREE.Vector3(0, 0, -dbMagDisplay);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div className="w-full h-[260px] sm:h-[350px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
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
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
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

        {/* Caméra plongeante zoomée */}
        <Canvas camera={{ position: [5, 4, 8], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 15, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} target={[0, 1, 0]} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -2.5, 0]} />

          <group position={[0, 0, 0]}>
             {/* Fil conducteur infini */}
             <Cylinder args={[0.05, 0.05, 15, 16]} position={[0, 0, 0]}>
                <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
             </Cylinder>

             {/* Élément dl */}
             <group position={[0, 0, 0]}>
                <Cylinder args={[0.07, 0.07, 0.6, 16]}>
                   <meshBasicMaterial color="#3b82f6" />
                </Cylinder>
                {/* Flèche I dl */}
                <mesh position={[0, currentI > 0 ? 0.3 : -0.3, 0]} rotation={[currentI > 0 ? 0 : Math.PI, 0, 0]}>
                   <coneGeometry args={[0.15, 0.3, 16]} />
                   <meshBasicMaterial color="#3b82f6" />
                </mesh>
                <Html position={[0.3, 0, 0]} center>
                   <div className="text-blue-200 bg-blue-600/90 px-2 py-0.5 rounded-full border border-blue-400 font-bold font-mono text-[10px] whitespace-nowrap drop-shadow-md">
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
               <div className="text-purple-300 font-serif italic text-xs font-bold drop-shadow-md">r</div>
             </Html>

             {/* Vecteur u */}
             <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [uVec.x * 1.5, uVec.y * 1.5, uVec.z * 1.5]]} color="#10b981" lineWidth={4} />
                <mesh position={[uVec.x * 1.5, uVec.y * 1.5, uVec.z * 1.5]} rotation={[0, 0, -thetaRad]}>
                   <coneGeometry args={[0.12, 0.4, 16]} />
                   <meshBasicMaterial color="#10b981" toneMapped={false} />
                </mesh>
                <Html position={[uVec.x * 2, uVec.y * 2, uVec.z * 2]} center>
                   <div className="text-emerald-100 bg-emerald-600/90 px-2 py-0.5 rounded-full border border-emerald-400 font-bold font-mono text-[10px] whitespace-nowrap drop-shadow-md">
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
                    <div className="text-white font-bold text-[10px] drop-shadow-md">M</div>
                  </Html>
                </Sphere>

                {/* Vecteur dB (s'il n'est pas nul) */}
                {Math.abs(dbMagDisplay) > 0.05 && (
                  <group>
                     <Line points={[[0, 0, 0], dbVec.toArray()]} color="#f59e0b" lineWidth={6} />
                     <mesh position={dbVec.toArray()} rotation={[dbVec.z > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
                        <coneGeometry args={[0.15, 0.4, 16]} />
                        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                     </mesh>
                     <Html position={[dbVec.x, dbVec.y, dbVec.z + (dbVec.z > 0 ? 0.5 : -0.5)]} center>
                       <div className="text-amber-100 font-bold font-mono text-[10px] bg-amber-600/90 px-2 py-0.5 rounded-full border border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)] whitespace-nowrap">
                         dB
                       </div>
                     </Html>
                  </group>
                )}
             </group>
             
             {/* Arc pour l'angle theta */}
             {angleTheta > 0 && angleTheta < 180 && (
                <mesh position={[0,0,0]} rotation={[0, 0, -Math.PI/2]}>
                  <ringGeometry args={[0.8, 0.85, 32, 1, 0, thetaRad]} />
                  <meshBasicMaterial color="#94a3b8" side={THREE.DoubleSide} />
                  <Html position={[1.2 * Math.cos(thetaRad/2), 1.2 * Math.sin(thetaRad/2), 0]} center>
                    <div className="text-slate-300 text-xs font-serif">θ</div>
                  </Html>
                </mesh>
             )}
          </group>

          <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.4} far={10} color="#0f172a" position={[0, -2.4, 0]} />
        </Canvas>
      </div>

      {/* Control Panel: All in ONE line horizontally */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-b-2xl shadow-xl flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
         
         {/* Courant */}
         <div className="flex flex-col gap-1.5 shrink-0 w-24">
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider text-center">Courant I</span>
           <div className="flex flex-row gap-1 h-6">
             <button 
               onClick={() => setCurrentI(1)}
               className={`flex-1 text-[10px] font-bold rounded transition-all border ${currentI === 1 ? "bg-blue-600/90 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-slate-800/80 border-blue-900/50 text-blue-400 hover:bg-blue-900/30"}`}
             >
               ↑
             </button>
             <button 
               onClick={() => setCurrentI(-1)}
               className={`flex-1 text-[10px] font-bold rounded transition-all border ${currentI === -1 ? "bg-red-600/90 border-red-400 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "bg-slate-800/80 border-red-900/50 text-red-400 hover:bg-red-900/30"}`}
             >
               ↓
             </button>
           </div>
         </div>
         
         {/* Angle */}
         <div className="flex flex-col gap-1.5 shrink-0 w-32">
           <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
             <span>Angle θ</span>
             <span className="text-slate-400">{angleTheta}°</span>
           </div>
           <input 
             type="range" min="0" max="180" value={angleTheta} 
             onChange={(e) => setAngleTheta(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-slate-400 cursor-pointer" 
           />
         </div>

         {/* Distance r */}
         <div className="flex flex-col gap-1.5 shrink-0 w-32">
           <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
             <span>Distance r</span>
             <span className="text-purple-400">{distanceR.toFixed(1)}</span>
           </div>
           <input 
             type="range" min="1.5" max="6" step="0.1" value={distanceR} 
             onChange={(e) => setDistanceR(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-purple-500 cursor-pointer" 
           />
         </div>

         {/* Reset Button */}
         <div className="shrink-0 border-l border-slate-700/50 pl-4 sm:pl-6 ml-auto">
           <button 
              onClick={() => {
                setAngleTheta(90);
                setDistanceR(3.0);
                setCurrentI(1);
              }}
              title="Réinitialiser"
              className="flex items-center justify-center gap-1.5 p-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 text-[9px] font-bold uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
           </button>
         </div>

      </div>
    </div>
  );
}
