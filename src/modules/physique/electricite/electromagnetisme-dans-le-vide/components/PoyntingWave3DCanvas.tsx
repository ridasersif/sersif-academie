"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// L'Onde plane progressive harmonique (OPPH)
const EMWave = ({ isPlaying, speed }: { isPlaying: boolean; speed: number }) => {
  const numPoints = 60;
  const length = 10;
  
  const meshE = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshPoynting = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * speed * 2);
    
    if (!meshE.current || !meshB.current || !meshPoynting.current) return;

    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * length - length / 2;
      const k = 2; // nombre d'onde
      const phase = k * x - time;
      
      // Champ E (Polarisé selon Y)
      const ey = Math.cos(phase) * 1.5;
      dummy.position.set(x, ey / 2, 0);
      dummy.scale.set(0.02, Math.abs(ey), 0.02);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshE.current.setMatrixAt(i, dummy.matrix);

      // Champ B (Polarisé selon Z, en phase avec E pour une OPPH dans le vide)
      const bz = Math.cos(phase) * 1.5;
      dummy.position.set(x, 0, bz / 2);
      dummy.scale.set(0.02, Math.abs(bz), 0.02);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      meshB.current.setMatrixAt(i, dummy.matrix);

      // Vecteur de Poynting Pi (E x B, polarisé selon X)
      // Pi = E * B / mu0 proportionnel à cos^2(kx - wt)
      const poynting = ey * bz * 0.4; 
      dummy.position.set(x + poynting / 2, 0, 0);
      dummy.scale.set(Math.abs(poynting), 0.04, 0.04);
      dummy.rotation.set(0, 0, Math.PI / 2);
      dummy.updateMatrix();
      meshPoynting.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshE.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true;
    meshPoynting.current.instanceMatrix.needsUpdate = true;
  });

  // Axe de propagation X
  return (
    <group>
      <Line points={[[-6, 0, 0], [6, 0, 0]]} color="#475569" lineWidth={1} />
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshE} args={[null, null, numPoints] as any}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
      </instancedMesh>
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshB} args={[null, null, numPoints] as any}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
      </instancedMesh>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshPoynting} args={[null, null, numPoints] as any}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  );
};

export default function PoyntingWave3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[320px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Legend */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[150px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Onde Plane Progressive</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-500 rounded-full" />
              <span className="text-red-400 font-bold text-xs"><LatexMath math="\vec{E}" /> (Champ Électrique)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-emerald-500 rounded-full" />
              <span className="text-emerald-400 font-bold text-xs"><LatexMath math="\vec{B}" /> (Champ Magnétique)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-purple-500 rounded-full" />
              <span className="text-purple-400 font-bold text-xs"><LatexMath math="\vec{\Pi}" /> (Vecteur Poynting)</span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 4, 6], fov: 45 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} />
          
          <group position={[0, -0.5, 0]}>
            <EMWave isPlaying={isPlaying} speed={speed} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -2.5, 0]} />
                    </Suspense>
          </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Vitesse de l'onde (ω)</span>
            <span className="text-blue-400">x{speed}</span>
          </div>
          <input 
            type="range" min="0.5" max="5" step="0.5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5"
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
