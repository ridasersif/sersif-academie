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
  const particleRef = useRef<THREE.Group>(null);
  const vArrowRef = useRef<THREE.Group>(null);
  const fArrowRef = useRef<THREE.Group>(null);
  
  const q = chargeType === "positive" ? 1 : -1;
  const m = 1.0; 
  
  const START_X = -4;
  const FIELD_START = 0;
  const FIELD_END = 4;

  // Pré-calcul de la trajectoire exacte pour éviter le "triangle brisé" (Courbe parfaitement fluide)
  const { trajectory, velocities, forces } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const vels: THREE.Vector3[] = [];
    const frcs: THREE.Vector3[] = [];
    
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const currentB = new THREE.Vector3(bMagnitude * Math.cos(thetaRad), bMagnitude * Math.sin(thetaRad), 0);
    
    let pos = new THREE.Vector3(START_X, 0, 0);
    let vel = new THREE.Vector3(vMagnitude, 0, 0);
    
    const dt = 0.01;
    pts.push(pos.clone());
    vels.push(vel.clone());
    frcs.push(new THREE.Vector3(0,0,0));
    
    for (let i = 0; i < 3000; i++) {
        const inField = pos.x >= FIELD_START && pos.x <= FIELD_END && Math.abs(pos.y) < 10 && Math.abs(pos.z) < 10;
        const force = new THREE.Vector3();
        
        if (inField) {
           force.crossVectors(vel, currentB).multiplyScalar(q);
        }
        
        // Intégration fine pour une courbe analytiquement parfaite
        vel.add(force.clone().multiplyScalar(dt / m));
        pos.add(vel.clone().multiplyScalar(dt));
        
        pts.push(pos.clone());
        vels.push(vel.clone());
        frcs.push(force.clone());
        
        if (pos.x > 12 || pos.x < -6 || pos.lengthSq() > 400) break;
    }
    return { trajectory: pts, velocities: vels, forces: frcs };
  }, [thetaDeg, vMagnitude, bMagnitude, chargeType]);

  const tRef = useRef(0);

  useEffect(() => {
    tRef.current = 0; // Reset animation au changement de paramètre
  }, [trajectory, resetTrigger]);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    
    tRef.current += delta * 60; // Vitesse de lecture
    if (tRef.current >= trajectory.length - 1) {
       tRef.current = 0; // Boucle de l'animation
    }
    
    const index = Math.floor(tRef.current);
    const pos = trajectory[index];
    const vel = velocities[index];
    const force = forces[index];
    
    if (particleRef.current) {
        particleRef.current.position.copy(pos);
    }

    // Le vecteur Vitesse est STRICTEMENT TANGENT
    if (vArrowRef.current && vel.lengthSq() > 0.001) {
        const dir = vel.clone().normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
        vArrowRef.current.quaternion.copy(quaternion);
    }
    
    // Le vecteur Force est STRICTEMENT CENTRIPÈTE
    if (fArrowRef.current) {
        if (force.lengthSq() > 0.001) {
            fArrowRef.current.visible = true;
            const dir = force.clone().normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
            fArrowRef.current.quaternion.copy(quaternion);
            const scale = Math.min(Math.max(force.length() * 0.15, 0.5), 1.5);
            fArrowRef.current.scale.set(scale, scale, scale);
        } else {
            fArrowRef.current.visible = false;
        }
    }
  });

  return (
    <group>
       {/* Zone du Champ Magnétique englobant la rotation */}
       <group position={[2, 0, 0]}>
         <Box args={[4, 4, 8]}>
            <meshPhysicalMaterial color="#10b981" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} />
         </Box>
         <Html position={[0, 2.2, 0]} center>
            <div className="text-emerald-500/80 font-bold text-[10px] tracking-widest border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-900/20 backdrop-blur-sm whitespace-nowrap">
              ZONE CHAMP MAGNÉTIQUE B
            </div>
         </Html>
       </group>

       {/* Trajectoire (Ligne Lisse) - Résout le problème du "Triangle Brisé" */}
       <Line 
          points={trajectory} 
          color={chargeType === "positive" ? "#ef4444" : "#3b82f6"} 
          lineWidth={3} 
          transparent 
          opacity={0.6} 
       />

       {/* Particule et Vecteurs */}
       <group ref={particleRef}>
          <Sphere args={[0.2, 32, 32]}>
             <meshPhysicalMaterial 
               color={chargeType === "positive" ? "#ef4444" : "#3b82f6"} 
               emissive={chargeType === "positive" ? "#b91c1c" : "#1d4ed8"} 
               emissiveIntensity={0.8} 
             />
             <Html position={[0.3, 0.3, 0]} center>
               <div className={`font-bold font-mono text-xs px-1.5 py-0.5 rounded ${chargeType === "positive" ? "text-red-300 bg-red-900/80 border border-red-500/50" : "text-blue-300 bg-blue-900/80 border border-blue-500/50"}`}>
                 {chargeType === "positive" ? "+q" : "-e"}
               </div>
             </Html>
          </Sphere>

          {/* Vecteur Vitesse v (Tangent) */}
          <group ref={vArrowRef}>
            <Line points={[[0, 0, 0], [1.5, 0, 0]]} color="#a855f7" lineWidth={4} />
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <meshBasicMaterial color="#a855f7" toneMapped={false} />
            </mesh>
            <Html position={[1.8, 0, 0]} center>
              <div className="text-purple-400 font-bold font-mono text-sm drop-shadow-md">v</div>
            </Html>
          </group>

          {/* Vecteur Force Fm (Centripète) */}
          <group ref={fArrowRef}>
            <Line points={[[0, 0, 0], [1.5, 0, 0]]} color="#f59e0b" lineWidth={5} />
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color="#f59e0b" toneMapped={false} />
            </mesh>
            <Html position={[1.8, 0, 0]} center>
              <div className="text-amber-400 font-bold font-mono text-sm bg-slate-900/80 px-2 py-0.5 rounded-lg border border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Fm
              </div>
            </Html>
          </group>

          {/* Vecteur Champ B (Incliné par theta) */}
          <group rotation={[0, 0, (thetaDeg * Math.PI) / 180]}>
            <Line points={[[0, 0, 0], [1.5, 0, 0]]} color="#10b981" lineWidth={4} />
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
              <coneGeometry args={[0.12, 0.3, 16]} />
              <meshBasicMaterial color="#10b981" toneMapped={false} />
            </mesh>
            <Html position={[1.8, 0, 0]} center>
              <div className="text-emerald-400 font-bold font-mono text-sm drop-shadow-md">B</div>
            </Html>
          </group>
       </group>
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

      {/* Control Panel */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-b-2xl flex flex-col gap-4">
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-col gap-1.5 sm:w-1/3">
                <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                  <span>Charge</span>
                </div>
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

              <div className="flex flex-col gap-1.5 sm:w-2/3">
                <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                  <span>Angle (v, B) θ</span>
                  <span className="text-slate-400">{thetaDeg}°</span>
                </div>
                <input 
                  type="range" min="0" max="180" value={thetaDeg} 
                  onChange={(e) => setThetaDeg(Number(e.target.value))} 
                  className="w-full h-1.5 mt-2 accent-slate-400" 
                />
              </div>
            </div>
             
            <div className="flex flex-col sm:flex-row gap-4 w-full">
               <div className="flex-1 flex flex-col gap-1.5">
                 <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                   <span>Vitesse (v)</span>
                   <span className="text-purple-400">{vMagnitude.toFixed(1)}</span>
                 </div>
                 <input 
                   type="range" min="1" max="5" step="0.5" value={vMagnitude} 
                   onChange={(e) => setVMagnitude(Number(e.target.value))} 
                   className="w-full h-1.5 mt-2 accent-purple-500" 
                 />
               </div>
               
               <div className="flex-1 flex flex-col gap-1.5">
                 <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                   <span>Champ (B)</span>
                   <span className="text-emerald-400">{bMagnitude.toFixed(1)}</span>
                 </div>
                 <input 
                   type="range" min="0" max="5" step="0.5" value={bMagnitude} 
                   onChange={(e) => setBMagnitude(Number(e.target.value))} 
                   className="w-full h-1.5 mt-2 accent-emerald-500" 
                 />
               </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0 items-center justify-center border-t md:border-t-0 md:border-l border-slate-700/50 pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
             <button 
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Mettre en Pause" : "Démarrer"}
                className="flex flex-1 md:flex-none w-full md:w-auto items-center justify-center gap-1.5 p-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 text-[10px] font-bold uppercase tracking-wider"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? "Pause" : "Play"}
             </button>
             <button 
                onClick={() => {
                  setThetaDeg(90);
                  setVMagnitude(2.0);
                  setBMagnitude(2.0);
                  setChargeType("positive");
                  setResetTrigger(prev => prev + 1);
                }}
                title="Réinitialiser"
                className="flex flex-1 md:flex-none w-full md:w-auto items-center justify-center gap-1.5 p-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 text-[10px] font-bold uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
