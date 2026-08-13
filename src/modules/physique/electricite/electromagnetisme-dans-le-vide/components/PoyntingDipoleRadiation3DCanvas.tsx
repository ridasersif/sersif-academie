"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

const RadiatingWaves = ({ isPlaying, speed }: { isPlaying: boolean; speed: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numSpheres = 10;
  const maxRadius = 15;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [radii, setRadii] = useState(() => Array.from({ length: numSpheres }).map((_, i) => (i / numSpheres) * maxRadius));

  useFrame((_, delta) => {
    if (!isPlaying || !meshRef.current) return;
    
    setRadii((prev) => 
      prev.map((r) => {
        let newR = r + delta * speed * 3;
        if (newR > maxRadius) newR = 0;
        return newR;
      })
    );

    radii.forEach((r, i) => {
      dummy.scale.setScalar(r);
      // L'intensité lumineuse diminue avec r^2 (donc l'opacité diminue avec r)
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Modifier la couleur/opacité par instance n'est pas trivial avec instanceMesh basique
      // Mais on donne l'illusion de propagation.
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Antenne centrale (Dipôle oscillant) */}
      <Line points={[[0, -1, 0], [0, 1, 0]]} color="#fbbf24" lineWidth={5} />
      
      {/* Ondes sphériques */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshRef} args={[null, null, numSpheres] as any}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.1} wireframe={true} />
      </instancedMesh>
    </group>
  );
};

export default function PoyntingDipoleRadiation3DCanvas() {
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
        
        {/* HUD */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[170px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Rayonnement Dipolaire</span>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400">Vecteur de Poynting (moyen) :</span>
              <span className="text-purple-400 font-bold text-xs"><LatexMath math="\langle \vec{\Pi} \rangle \propto \frac{\sin^2\theta}{r^2} \vec{u}_r" /></span>
            </div>
            <div className="flex flex-col gap-1 mt-1 border-t border-slate-700/50 pt-2">
              <span className="text-[10px] text-slate-400">Puissance Rayonnée (Larmor) :</span>
              <span className="text-yellow-400 font-bold text-xs"><LatexMath math="\mathcal{P} = \frac{\mu_0 p_0^2 \omega^4}{12\pi c}" /></span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [10, 5, 10], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, 0, 0]}>
            <RadiatingWaves isPlaying={isPlaying} speed={speed} />
          </group>
          
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Fréquence (ω)</span>
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
