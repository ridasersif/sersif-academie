"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Power, ArrowUp, ArrowDown } from "lucide-react";

export default function AmpereTheorem3DCanvas() {
  const [i1Enabled, setI1Enabled] = useState(true);
  const [i1Dir, setI1Dir] = useState(1);
  
  const [i2Enabled, setI2Enabled] = useState(true);
  const [i2Dir, setI2Dir] = useState(-1);
  
  const [i3Enabled, setI3Enabled] = useState(true);
  const [i3Dir, setI3Dir] = useState(1);
  
  const [i4Enabled, setI4Enabled] = useState(true); 
  const [i4Dir, setI4Dir] = useState(1);
  
  const [i5Enabled, setI5Enabled] = useState(false); 
  const [i5Dir, setI5Dir] = useState(-1);

  // Courants (x, z) positions
  const wires = [
    { id: 'I1', label: 'I1', x: 1, z: 0.5, enabled: i1Enabled, dir: i1Dir, isInside: true, color: "#3b82f6", setE: setI1Enabled, setD: setI1Dir }, // Blue
    { id: 'I2', label: 'I2', x: -1.2, z: -1, enabled: i2Enabled, dir: i2Dir, isInside: true, color: "#ef4444", setE: setI2Enabled, setD: setI2Dir }, // Red
    { id: 'I3', label: 'I3', x: 0.5, z: -1.5, enabled: i3Enabled, dir: i3Dir, isInside: true, color: "#10b981", setE: setI3Enabled, setD: setI3Dir }, // Emerald
    { id: 'I4', label: 'I4', x: 3.5, z: 1.5, enabled: i4Enabled, dir: i4Dir, isInside: false, color: "#a855f7", setE: setI4Enabled, setD: setI4Dir }, // Purple
    { id: 'I5', label: 'I5', x: -3, z: 2.5, enabled: i5Enabled, dir: i5Dir, isInside: false, color: "#f59e0b", setE: setI5Enabled, setD: setI5Dir } // Amber
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
    <div className="w-full max-w-[900px] mx-auto flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
      <div className="w-full h-[280px] sm:h-[350px] bg-[#050b14] relative">
        
        {/* Top Right HUD */}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1 pointer-events-none">
           <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex flex-col gap-1.5 min-w-[100px] sm:min-w-[120px]">
             <div className="hidden sm:flex items-center gap-1.5 border-b border-slate-700/50 pb-1 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Bilan Enlacé
                </span>
             </div>
             
             <div className="hidden sm:flex flex-col gap-1.5">
               {wires.map(w => (
                 <div key={w.id} className={`flex items-center justify-between text-[10px] font-mono transition-opacity duration-300 ${w.enabled ? (w.isInside ? 'text-slate-200' : 'text-slate-500 opacity-60') : 'text-slate-700 opacity-40 line-through'}`}>
                   <div className="flex items-center gap-1.5">
                     <div className="w-1 h-1 rounded-full" style={{ backgroundColor: w.color }} />
                     <span>{w.id}</span>
                   </div>
                   <span className={w.enabled ? (w.dir > 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold") : "text-slate-700"}>
                     {w.enabled ? (w.dir > 0 ? "+I" : "-I") : "0"}
                   </span>
                 </div>
               ))}
             </div>
             
             <div className="flex items-center justify-between text-xs font-mono font-black sm:mt-1 sm:pt-1.5 sm:border-t border-slate-700/50 gap-2">
               <span className="text-amber-400 text-[10px] sm:text-[11px]">Σ I_enl =</span>
               <div className={`px-1.5 py-0.5 rounded text-black text-[10px] sm:text-[11px] ${iEnl > 0 ? "bg-emerald-400" : iEnl < 0 ? "bg-red-400" : "bg-slate-400"}`}>
                 {iEnl > 0 ? `+${iEnl}I` : iEnl < 0 ? `${iEnl}I` : "0"}
               </div>
             </div>
           </div>
        </div>

        {/* Formule HUD Bottom Left */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none hidden sm:flex">
           <div className="bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/50 shadow-lg flex items-center gap-2">
              <span className="text-amber-400 font-serif italic text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">∮</span>
              <div className="flex items-center gap-1">
                <span className="text-emerald-300 font-serif italic font-black text-sm">B</span>
                <span className="text-slate-400 font-bold text-xs">·</span>
                <span className="text-purple-300 font-serif italic text-sm font-bold">dl</span>
              </div>
              <span className="text-slate-500 font-black text-xs mx-0.5">=</span>
              <span className="text-amber-400 font-serif font-black text-sm drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">μ₀ I_enl</span>
           </div>
        </div>

        <Canvas camera={{ position: [7, 5, 7], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#050b14"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 15, 5]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#60a5fa" />
          
          <Environment preset="night" />
          <OrbitControls enableZoom={true} target={[0, 0, 0]} maxPolarAngle={Math.PI / 1.4} />
          
          <gridHelper args={[24, 24, 0x1e293b, 0x090f1e]} position={[0, -3, 0]} />

          <group position={[0, 0, 0]}>
             
             {/* Surface and Contour C */}
             <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]}>
                <circleGeometry args={[2.5, 64]} />
                <meshPhysicalMaterial color="#334155" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.1} metalness={0.8} />
             </mesh>
             
             {/* Contour glowing edge */}
             <Line points={contourPoints} color="#a855f7" lineWidth={3} dashed dashSize={0.3} gapSize={0.2} />

             {/* Orientation du contour (dl) */}
             <group position={[0, 0, 2.5]}>
                <Line points={[[0,0,0], [1, 0, 0]]} color="#c084fc" lineWidth={4} />
                <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
                  <coneGeometry args={[0.12, 0.3, 16]} />
                  <meshBasicMaterial color="#c084fc" toneMapped={false} />
                </mesh>
                <Html position={[1.2, 0.4, 0]} center zIndexRange={[100, 0]}>
                   <div className="text-purple-300 font-serif italic text-xs font-black drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] pointer-events-none">dl</div>
                </Html>
             </group>

             {/* Vecteur normal n (main droite) */}
             <group position={[0, 0, 0]}>
                <Line points={[[0,0,0], [0, 2, 0]]} color="#94a3b8" lineWidth={3} />
                <mesh position={[0, 2, 0]}>
                  <coneGeometry args={[0.1, 0.3, 16]} />
                  <meshBasicMaterial color="#94a3b8" toneMapped={false} />
                </mesh>
                <Html position={[0, 2.3, 0]} center zIndexRange={[100, 0]}>
                   <div className="text-slate-200 font-serif italic text-xs font-black drop-shadow-[0_0_5px_rgba(148,163,184,0.8)] pointer-events-none">n</div>
                </Html>
             </group>

             {/* Fils conducteurs */}
             {wires.map((w) => w.enabled && (
               <group key={w.id} position={[w.x, 0, w.z]}>
                  {/* Câble principal */}
                  <Cylinder args={[0.06, 0.06, 6, 16]}>
                     <meshPhysicalMaterial color={w.color} metalness={0.7} roughness={0.2} transparent opacity={w.isInside ? 0.9 : 0.3} clearcoat={1} clearcoatRoughness={0.1} />
                  </Cylinder>
                  
                  {/* Halo lumineux */}
                  <Cylinder args={[0.1, 0.1, 6, 16]}>
                     <meshBasicMaterial color={w.color} transparent opacity={w.isInside ? 0.2 : 0.05} />
                  </Cylinder>
                  
                  {/* Flèche Courant animée */}
                  <group position={[0, w.dir > 0 ? 1.5 : -1.5, 0]} rotation={[w.dir > 0 ? 0 : Math.PI, 0, 0]}>
                    <mesh>
                       <coneGeometry args={[0.2, 0.5, 16]} />
                       <meshStandardMaterial color={w.color} emissive={w.color} emissiveIntensity={w.isInside ? 0.8 : 0.2} transparent opacity={w.isInside ? 1 : 0.4} />
                    </mesh>
                  </group>
                  
                  {/* Label */}
                  <Html position={[0, w.dir > 0 ? 2.3 : -2.3, 0]} center zIndexRange={[100, 0]}>
                    <div className="font-black font-mono text-[9px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap backdrop-blur-md pointer-events-none" style={{ backgroundColor: `${w.color}20`, border: `1px solid ${w.color}`, color: w.color, opacity: w.isInside ? 1 : 0.6, textShadow: `0 0 5px ${w.color}` }}>
                      {w.id}
                    </div>
                  </Html>
               </group>
             ))}
             
          </group>

          <ContactShadows resolution={512} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -2.9, 0]} />
        </Canvas>
      </div>

      {/* Compact Control Panel */}
      <div className="w-full bg-[#0a1122] border-t border-slate-800 p-3 sm:p-4 flex flex-col gap-3">
         
         <div className="flex items-center justify-between border-b border-slate-800 pb-2">
           <h3 className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
             <Power className="w-3.5 h-3.5 text-emerald-400" />
             Contrôle
           </h3>
           <button 
              onClick={() => {
                setI1Enabled(true); setI1Dir(1);
                setI2Enabled(true); setI2Dir(-1);
                setI3Enabled(true); setI3Dir(1);
                setI4Enabled(true); setI4Dir(1);
                setI5Enabled(false); setI5Dir(-1);
              }}
              title="Réinitialiser"
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors border border-slate-700 text-[9px] font-black uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
           </button>
         </div>

         {/* Grid des contrôles plus compact */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
            {wires.map((w) => (
              <div key={w.id} className="flex flex-col gap-1 p-1.5 sm:p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 shadow-sm">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: w.color }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.enabled ? w.color : '#475569', boxShadow: w.enabled ? `0 0 5px ${w.color}` : 'none' }} />
                    {w.id}
                  </span>
                  <span className={`text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wider ${w.isInside ? 'bg-slate-800 text-slate-400' : 'bg-slate-800/50 border-dashed border border-slate-700 text-slate-500'}`}>
                    {w.isInside ? 'Int' : 'Ext'}
                  </span>
                </div>
                
                <div className="flex gap-1 h-5 sm:h-6 mt-0.5">
                  <button 
                    onClick={() => w.setE(!w.enabled)} 
                    className={`flex-1 flex items-center justify-center text-[8px] sm:text-[9px] font-black rounded transition-all ${w.enabled ? "text-white shadow-sm" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                    style={{ backgroundColor: w.enabled ? w.color : undefined }}
                  >
                    {w.enabled ? "ON" : "OFF"}
                  </button>
                  <button 
                    disabled={!w.enabled} 
                    onClick={() => w.setD(w.dir * -1)} 
                    className={`flex-none w-6 sm:w-8 flex items-center justify-center font-black rounded transition-all ${w.enabled ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700" : "bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800"}`}
                  >
                    {w.dir > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
         </div>

      </div>
    </div>
  );
}
