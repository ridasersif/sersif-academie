"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Affiche les vecteurs E, B et Poynting à la surface du fil
const PoyntingVectors = ({ showE, showB, showP }: { showE: boolean, showB: boolean, showP: boolean }) => {
  const meshE = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshP = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const numAngles = 8;
  const zPositions = [-2, 0, 2];
  const radius = 1.05; // Juste à la surface du cylindre
  const total = numAngles * zPositions.length;

  useFrame(() => {
    if (!meshE.current || !meshB.current || !meshP.current) return;
    
    let index = 0;
    for (let z of zPositions) {
      for (let i = 0; i < numAngles; i++) {
        const theta = (i / numAngles) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        
        // E (Rouge, le long de Z)
        if (showE) {
          dummy.position.set(x, y, z + 0.4); // Décalé pour voir
          dummy.scale.set(0.04, 0.8, 0.04);
          dummy.rotation.set(Math.PI / 2, 0, 0); // Pointe vers +Z
          dummy.updateMatrix();
          meshE.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshE.current.setMatrixAt(index, dummy.matrix);
        }

        // B (Vert, orthoradial)
        if (showB) {
          const bx = -Math.sin(theta);
          const by = Math.cos(theta);
          dummy.position.set(x + bx * 0.4, y + by * 0.4, z);
          dummy.scale.set(0.04, 0.8, 0.04);
          // Rotation pour pointer tangentiellement
          dummy.rotation.set(0, 0, theta);
          dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix);
        }

        // Poynting (Violet, radial vers l'intérieur)
        if (showP) {
          dummy.position.set(x * 1.5, y * 1.5, z); // Commence à l'extérieur
          dummy.scale.set(0.06, 1, 0.06);
          // Rotation pour pointer vers le centre (0,0,z)
          // L'axe naturel d'un cylindre THREE.js est Y. Donc on le tourne vers -r
          dummy.rotation.set(0, 0, theta + Math.PI / 2);
          dummy.updateMatrix();
          meshP.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshP.current.setMatrixAt(index, dummy.matrix);
        }

        index++;
      }
    }
    meshE.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true;
    meshP.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshE} args={[null, null, total] as any}>
        <cylinderGeometry args={[1, 0, 1, 8]} /> {/* Forme de flèche */}
        <meshBasicMaterial color="#ef4444" />
      </instancedMesh>
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshB} args={[null, null, total] as any}>
        <cylinderGeometry args={[1, 0, 1, 8]} />
        <meshBasicMaterial color="#10b981" />
      </instancedMesh>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshP} args={[null, null, total] as any}>
        <cylinderGeometry args={[1, 0, 1, 8]} />
        <meshBasicMaterial color="#a855f7" />
      </instancedMesh>
    </group>
  );
};

export default function PoyntingWire3DCanvas() {
  const [showE, setShowE] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showP, setShowP] = useState(true);

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
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[170px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Effet Joule & Poynting</span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-red-500 rounded-full" />
                <span className="text-red-400 font-bold text-xs"><LatexMath math="\vec{E}" /></span>
              </div>
              <span className="text-[10px] text-slate-400">Courant</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span className="text-emerald-400 font-bold text-xs"><LatexMath math="\vec{B}" /></span>
              </div>
              <span className="text-[10px] text-slate-400">Champ Induit</span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-700/50 pt-2 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-purple-500 rounded-full" />
                <span className="text-purple-400 font-bold text-xs"><LatexMath math="\vec{\Pi}" /></span>
              </div>
              <span className="text-[10px] text-purple-300 font-bold">Énergie entrante</span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 3, 5], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} />
          
          <group position={[0, -0.5, 0]}>
            {/* Fil Conducteur Résistant */}
            <Cylinder args={[1, 1, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} transparent opacity={0.6} />
            </Cylinder>
            
            <PoyntingVectors showE={showE} showB={showB} showP={showP} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-center gap-4 flex-wrap">
        <button 
          onClick={() => setShowE(!showE)} 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showE ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
        >
          {showE ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} <LatexMath math="\vec{E}" />
        </button>
        <button 
          onClick={() => setShowB(!showB)} 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showB ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
        >
          {showB ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} <LatexMath math="\vec{B}" />
        </button>
        <button 
          onClick={() => setShowP(!showP)} 
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showP ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
        >
          {showP ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Poynting <LatexMath math="\vec{\Pi}" />
        </button>
      </div>
    </div>
  );
}
