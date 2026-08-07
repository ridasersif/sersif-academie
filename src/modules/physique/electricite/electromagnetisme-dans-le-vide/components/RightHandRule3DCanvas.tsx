"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Environment, ContactShadows, Box } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Hand, Eye, EyeOff } from "lucide-react";

interface ParticleSimProps {
  chargeType: "positive" | "negative";
  thetaDeg: number;
  vMagnitude: number;
  bMagnitude: number;
  isPlaying: boolean;
  resetTrigger: number;
}

function ParticleSimulation({ chargeType, thetaDeg, vMagnitude, bMagnitude, isPlaying, resetTrigger }: ParticleSimProps) {
  const q = chargeType === "positive" ? 1 : -1;
  const thetaRad = (thetaDeg * Math.PI) / 180;
  
  // v est sur l'axe X
  const vVec = new THREE.Vector3(vMagnitude, 0, 0);
  
  // B est dans le plan XY, à un angle theta de v
  const bVec = new THREE.Vector3(bMagnitude * Math.cos(thetaRad), bMagnitude * Math.sin(thetaRad), 0);
  
  // F = q (v x B)
  const fVec = new THREE.Vector3().crossVectors(vVec, bVec).multiplyScalar(q);

  return (
    <group position={[0, 1, 0]}>
       {/* Particule au centre */}
       <Sphere args={[0.3, 32, 32]}>
          <meshPhysicalMaterial 
            color={chargeType === "positive" ? "#ef4444" : "#3b82f6"} 
            emissive={chargeType === "positive" ? "#b91c1c" : "#1d4ed8"} 
            emissiveIntensity={0.8} 
          />
          <Html position={[0.4, 0.4, 0]} center>
            <div className={`font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap ${chargeType === "positive" ? "text-red-100 bg-red-600/90 border border-red-400" : "text-blue-100 bg-blue-600/90 border border-blue-400"}`}>
              {chargeType === "positive" ? "+q" : "-e"}
            </div>
          </Html>
       </Sphere>

       {/* Plan formé par v et B (pour montrer que F y est perpendiculaire) */}
       <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]}>
         <planeGeometry args={[10, 10]} />
         <meshBasicMaterial color="#334155" transparent opacity={0.2} side={THREE.DoubleSide} />
       </mesh>
       <Html position={[-3, 0.1, -3]} center>
          <div className="text-slate-400/80 font-serif text-[10px] italic whitespace-nowrap">Plan (v, B)</div>
       </Html>

       {/* Vecteur Vitesse v */}
       <group>
         <Line points={[[0, 0, 0], vVec.toArray()]} color="#a855f7" lineWidth={5} />
         <mesh position={vVec.toArray()} rotation={[0, 0, -Math.PI/2]}>
           <coneGeometry args={[0.12, 0.4, 16]} />
           <meshBasicMaterial color="#a855f7" toneMapped={false} />
         </mesh>
         <Html position={[vVec.x + 0.4, vVec.y, vVec.z]} center>
           <div className="text-purple-100 bg-purple-600/90 px-2 py-0.5 rounded-full border border-purple-400 font-bold font-mono text-[10px] drop-shadow-md whitespace-nowrap">v</div>
         </Html>
       </group>

       {/* Vecteur Champ B */}
       <group>
         <Line points={[[0, 0, 0], bVec.toArray()]} color="#10b981" lineWidth={5} />
         {bMagnitude > 0 && (
           <mesh position={bVec.toArray()} rotation={[0, 0, thetaRad - Math.PI/2]}>
             <coneGeometry args={[0.12, 0.4, 16]} />
             <meshBasicMaterial color="#10b981" toneMapped={false} />
           </mesh>
         )}
         <Html position={[bVec.x + 0.4 * Math.cos(thetaRad), bVec.y + 0.4 * Math.sin(thetaRad), bVec.z]} center>
           <div className="text-emerald-100 bg-emerald-600/90 px-2 py-0.5 rounded-full border border-emerald-400 font-bold font-mono text-[10px] drop-shadow-md whitespace-nowrap">B</div>
         </Html>
       </group>

       {/* Vecteur Force Fm */}
       <group>
         <Line points={[[0, 0, 0], fVec.toArray()]} color="#f59e0b" lineWidth={6} />
         {fVec.lengthSq() > 0.01 && (
           <mesh position={fVec.toArray()} rotation={[fVec.z > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
             <coneGeometry args={[0.15, 0.5, 16]} />
             <meshBasicMaterial color="#f59e0b" toneMapped={false} />
           </mesh>
         )}
         {fVec.lengthSq() > 0.01 && (
           <Html position={[fVec.x, fVec.y, fVec.z + (fVec.z > 0 ? 0.6 : -0.6)]} center>
             <div className="text-amber-100 font-bold font-mono text-[10px] bg-amber-600/90 px-2 py-0.5 rounded-full border border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)] whitespace-nowrap">
               Fm
             </div>
           </Html>
         )}
       </group>
       
       {/* Indicateur d'angle si non nul et non plat */}
       {thetaDeg > 0 && thetaDeg < 180 && (
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.8, 0.85, 32, 1, 0, thetaRad]} />
            <meshBasicMaterial color="#94a3b8" side={THREE.DoubleSide} />
            <Html position={[1.1 * Math.cos(thetaRad/2), 1.1 * Math.sin(thetaRad/2), 0]} center>
              <div className="text-slate-300 text-xs font-serif">θ</div>
            </Html>
          </mesh>
       )}
    </group>
  );
}

export default function RightHandRule3DCanvas() {
  const [chargeType, setChargeType] = useState<"positive" | "negative">("positive");
  const [thetaDeg, setThetaDeg] = useState(90);
  const [vMagnitude, setVMagnitude] = useState(2.0);
  const [bMagnitude, setBMagnitude] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showHUD, setShowHUD] = useState(false);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div className="w-full h-[280px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* HUD Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 px-3 rounded-lg shadow-xl cursor-pointer hover:bg-slate-800/80 transition-colors" onClick={() => setShowHUD(!showHUD)}>
            <h4 className="text-slate-200 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Hand className="w-3 h-3 text-slate-400" /> Main Droite
            </h4>
            {showHUD ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
          </div>

          {showHUD && (
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-xl shadow-xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                <span className="text-slate-300">Pouce :</span>
                <span className="text-purple-400 font-mono font-bold">v (Vitesse)</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-300">Index :</span>
                <span className="text-emerald-400 font-mono font-bold">B (Champ)</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                <span className="text-slate-300">Majeur :</span>
                <span className="text-amber-400 font-mono font-bold">Fm (Force)</span>
              </div>
            </div>
          )}
        </div>

        {/* Caméra plongeante zoomée */}
        <Canvas camera={{ position: [3, 5, 7], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 15, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} target={[1, 0, 0]} autoRotate={!isPlaying} autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -0.01, 0]} />

          <ParticleSimulation 
            chargeType={chargeType}
            thetaDeg={thetaDeg}
            vMagnitude={vMagnitude}
            bMagnitude={bMagnitude}
            isPlaying={isPlaying}
            resetTrigger={resetTrigger}
          />

          <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.4} far={5} color="#0f172a" />
        </Canvas>
      </div>

      {/* Control Panel: All in ONE line horizontally */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-b-2xl shadow-xl flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
         
         {/* Charge */}
         <div className="flex flex-col gap-1.5 shrink-0 w-24">
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider text-center">Charge</span>
           <div className="flex flex-row gap-1 h-6">
             <button 
               onClick={() => setChargeType("positive")}
               className={`flex-1 text-[9px] font-bold rounded transition-all border ${chargeType === "positive" ? "bg-red-600/90 border-red-400 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "bg-slate-800/80 border-red-900/50 text-red-400 hover:bg-red-900/30"}`}
             >
               +q
             </button>
             <button 
               onClick={() => setChargeType("negative")}
               className={`flex-1 text-[9px] font-bold rounded transition-all border ${chargeType === "negative" ? "bg-blue-600/90 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-slate-800/80 border-blue-900/50 text-blue-400 hover:bg-blue-900/30"}`}
             >
               -e
             </button>
           </div>
         </div>
         
         {/* Angle */}
         <div className="flex flex-col gap-1.5 shrink-0 w-32">
           <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
             <span>Angle θ</span>
             <span className="text-slate-400">{thetaDeg}°</span>
           </div>
           <input 
             type="range" min="0" max="180" value={thetaDeg} 
             onChange={(e) => setThetaDeg(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-slate-400 cursor-pointer" 
           />
         </div>

         {/* Vitesse */}
         <div className="flex flex-col gap-1.5 shrink-0 w-28">
           <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
             <span>Vitesse v</span>
             <span className="text-purple-400">{vMagnitude.toFixed(1)}</span>
           </div>
           <input 
             type="range" min="1" max="5" step="0.5" value={vMagnitude} 
             onChange={(e) => setVMagnitude(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-purple-500 cursor-pointer" 
           />
         </div>
         
         {/* Champ */}
         <div className="flex flex-col gap-1.5 shrink-0 w-28">
           <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
             <span>Champ B</span>
             <span className="text-emerald-400">{bMagnitude.toFixed(1)}</span>
           </div>
           <input 
             type="range" min="0" max="5" step="0.5" value={bMagnitude} 
             onChange={(e) => setBMagnitude(Number(e.target.value))} 
             className="w-full h-1.5 mt-1.5 accent-emerald-500 cursor-pointer" 
           />
         </div>

         {/* Reset Button */}
         <div className="shrink-0 border-l border-slate-700/50 pl-4 sm:pl-6 ml-auto">
           <button 
              onClick={() => {
                setThetaDeg(90);
                setVMagnitude(2.0);
                setBMagnitude(2.0);
                setChargeType("positive");
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
