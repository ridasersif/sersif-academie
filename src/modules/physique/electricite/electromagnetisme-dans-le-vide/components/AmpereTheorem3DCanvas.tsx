"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Cylinder, Torus } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

export default function AmpereTheorem3DCanvas() {
  const [i1Enabled, setI1Enabled] = useState(true);
  const [i1Dir, setI1Dir] = useState(1);
  
  const [i2Enabled, setI2Enabled] = useState(true);
  const [i2Dir, setI2Dir] = useState(-1);
  
  const [i3Enabled, setI3Enabled] = useState(true); // Extérieur
  const [i3Dir, setI3Dir] = useState(1);

  // Courants (x, z) positions
  const wires = [
    { id: 'I1', x: 1, z: 0.5, enabled: i1Enabled, dir: i1Dir, isInside: true, color: "#3b82f6" },
    { id: 'I2', x: -1, z: -0.5, enabled: i2Enabled, dir: i2Dir, isInside: true, color: "#ef4444" },
    { id: 'I3', x: 4, z: 2, enabled: i3Enabled, dir: i3Dir, isInside: false, color: "#a855f7" }
  ];

  const iEnl = wires
    .filter(w => w.enabled && w.isInside)
    .reduce((sum, w) => sum + w.dir, 0);

  // Points for contour C (circle radius 2.5)
  const contourPoints = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    contourPoints.push(new THREE.Vector3(2.5 * Math.cos(angle), 0, 2.5 * Math.sin(angle)));
  }

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      <div className="w-full h-[260px] sm:h-[350px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* Top Right HUD */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1 pointer-events-auto">
           <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 sm:p-4 rounded-xl shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 min-w-[140px]">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-1 mb-1">
               Bilan Courants
             </span>
             {wires.map(w => (
               <div key={w.id} className={`flex items-center justify-between text-[11px] font-mono ${w.enabled ? (w.isInside ? 'text-slate-200' : 'text-slate-500 line-through opacity-70') : 'text-slate-700'}`}>
                 <span>{w.id} :</span>
                 <span className={w.enabled ? (w.dir > 0 ? "text-emerald-400" : "text-red-400") : "text-slate-700"}>
                   {w.enabled ? (w.dir > 0 ? "+I" : "-I") : "0"}
                 </span>
               </div>
             ))}
             <div className="flex items-center justify-between text-xs font-mono font-bold mt-1 pt-2 border-t border-slate-700/50">
               <span className="text-amber-400">Σ I_enl =</span>
               <span className={iEnl > 0 ? "text-emerald-400" : iEnl < 0 ? "text-red-400" : "text-slate-400"}>
                 {iEnl > 0 ? `+${iEnl}I` : iEnl < 0 ? `${iEnl}I` : "0"}
               </span>
             </div>
           </div>
        </div>

        {/* Formule HUD Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
           <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
              <span className="text-amber-400 font-serif italic text-lg">∮</span>
              <span className="text-emerald-300 font-serif italic font-bold text-sm">B</span>
              <span className="text-slate-400">·</span>
              <span className="text-purple-300 font-serif italic text-sm">dl</span>
              <span className="text-slate-400 ml-1">=</span>
              <span className="text-amber-400 font-serif font-bold text-sm ml-1">μ₀ I_enl</span>
           </div>
        </div>

        <Canvas camera={{ position: [6, 4, 6], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 15, 5]} angle={0.3} penumbra={1} intensity={1.5} />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} target={[0, 0, 0]} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -3, 0]} />

          <group position={[0, 0, 0]}>
             
             {/* Surface and Contour C */}
             <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
                <circleGeometry args={[2.5, 64]} />
                <meshBasicMaterial color="#334155" transparent opacity={0.1} side={THREE.DoubleSide} />
             </mesh>
             <Line points={contourPoints} color="#a855f7" lineWidth={3} dashed dashSize={0.2} gapSize={0.2} />
             <Html position={[2.5, 0.2, 0]} center>
               <div className="text-purple-300 font-serif italic text-sm font-bold bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-500/50 whitespace-nowrap drop-shadow-md">
                 Contour (C)
               </div>
             </Html>

             {/* Orientation du contour (dl) */}
             <group position={[0, 0, 2.5]}>
                <Line points={[[0,0,0], [0.8, 0, 0]]} color="#a855f7" lineWidth={4} />
                <mesh position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
                  <coneGeometry args={[0.1, 0.3, 16]} />
                  <meshBasicMaterial color="#a855f7" toneMapped={false} />
                </mesh>
                <Html position={[1, 0.3, 0]} center>
                   <div className="text-purple-300 font-serif italic text-xs font-bold drop-shadow-md">dl</div>
                </Html>
             </group>

             {/* Vecteur normal n (main droite) */}
             <group position={[0, 0, 0]}>
                <Line points={[[0,0,0], [0, 1.5, 0]]} color="#94a3b8" lineWidth={3} />
                <mesh position={[0, 1.5, 0]}>
                  <coneGeometry args={[0.08, 0.25, 16]} />
                  <meshBasicMaterial color="#94a3b8" toneMapped={false} />
                </mesh>
                <Html position={[0, 1.8, 0]} center>
                   <div className="text-slate-300 font-serif italic text-xs font-bold drop-shadow-md">n</div>
                </Html>
             </group>

             {/* Fils conducteurs */}
             {wires.map((w) => w.enabled && (
               <group key={w.id} position={[w.x, 0, w.z]}>
                  <Cylinder args={[0.06, 0.06, 6, 16]}>
                     <meshPhysicalMaterial color={w.color} metalness={0.5} roughness={0.2} transparent opacity={w.isInside ? 1 : 0.4} />
                  </Cylinder>
                  
                  {/* Flèche Courant */}
                  <mesh position={[0, w.dir > 0 ? 1 : -1, 0]} rotation={[w.dir > 0 ? 0 : Math.PI, 0, 0]}>
                     <coneGeometry args={[0.15, 0.4, 16]} />
                     <meshBasicMaterial color={w.color} transparent opacity={w.isInside ? 1 : 0.4} />
                  </mesh>
                  
                  <Html position={[0, w.dir > 0 ? 1.5 : -1.5, 0]} center>
                    <div className="font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap" style={{ backgroundColor: `${w.color}90`, border: `1px solid ${w.color}`, color: '#fff', opacity: w.isInside ? 1 : 0.5 }}>
                      {w.id}
                    </div>
                  </Html>
               </group>
             ))}
             
          </group>

          <ContactShadows resolution={1024} scale={25} blur={2.5} opacity={0.4} far={10} color="#0f172a" position={[0, -2.9, 0]} />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-b-2xl shadow-xl flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
         
         {/* Toggles pour I1 (Inside) */}
         <div className="flex flex-col gap-1.5 shrink-0 w-28">
           <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider text-center">Courant I1 (Intérieur)</span>
           <div className="flex gap-1 h-6">
             <button onClick={() => setI1Enabled(!i1Enabled)} className={`flex-1 text-[9px] font-bold rounded border transition-colors ${i1Enabled ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
               {i1Enabled ? "ON" : "OFF"}
             </button>
             <button disabled={!i1Enabled} onClick={() => setI1Dir(i1Dir * -1)} className={`flex-1 text-[10px] font-bold rounded border transition-colors ${i1Enabled ? "bg-slate-800 border-blue-900/50 text-blue-300 hover:bg-slate-700" : "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed"}`}>
               {i1Dir > 0 ? "↑" : "↓"}
             </button>
           </div>
         </div>

         {/* Toggles pour I2 (Inside) */}
         <div className="flex flex-col gap-1.5 shrink-0 w-28">
           <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider text-center">Courant I2 (Intérieur)</span>
           <div className="flex gap-1 h-6">
             <button onClick={() => setI2Enabled(!i2Enabled)} className={`flex-1 text-[9px] font-bold rounded border transition-colors ${i2Enabled ? "bg-red-600 border-red-400 text-white" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
               {i2Enabled ? "ON" : "OFF"}
             </button>
             <button disabled={!i2Enabled} onClick={() => setI2Dir(i2Dir * -1)} className={`flex-1 text-[10px] font-bold rounded border transition-colors ${i2Enabled ? "bg-slate-800 border-red-900/50 text-red-300 hover:bg-slate-700" : "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed"}`}>
               {i2Dir > 0 ? "↑" : "↓"}
             </button>
           </div>
         </div>

         {/* Toggles pour I3 (Outside) */}
         <div className="flex flex-col gap-1.5 shrink-0 w-28">
           <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider text-center">Courant I3 (Extérieur)</span>
           <div className="flex gap-1 h-6">
             <button onClick={() => setI3Enabled(!i3Enabled)} className={`flex-1 text-[9px] font-bold rounded border transition-colors ${i3Enabled ? "bg-purple-600 border-purple-400 text-white" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
               {i3Enabled ? "ON" : "OFF"}
             </button>
             <button disabled={!i3Enabled} onClick={() => setI3Dir(i3Dir * -1)} className={`flex-1 text-[10px] font-bold rounded border transition-colors ${i3Enabled ? "bg-slate-800 border-purple-900/50 text-purple-300 hover:bg-slate-700" : "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed"}`}>
               {i3Dir > 0 ? "↑" : "↓"}
             </button>
           </div>
         </div>

         {/* Reset Button */}
         <div className="shrink-0 border-l border-slate-700/50 pl-4 sm:pl-6 ml-auto">
           <button 
              onClick={() => {
                setI1Enabled(true); setI1Dir(1);
                setI2Enabled(true); setI2Dir(-1);
                setI3Enabled(true); setI3Dir(1);
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
