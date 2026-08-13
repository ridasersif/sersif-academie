"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Le courant de conduction J dans les fils (particules)
const ConductionCurrent = ({ isPlaying }: { isPlaying: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numParticles = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [positions, setPositions] = useState(() => 
    Array.from({ length: numParticles }).map(() => ({
      y: (Math.random() - 0.5) * 6,
      side: Math.random() > 0.5 ? 1 : -1 // 1 = fil du haut, -1 = fil du bas
    }))
  );

  useFrame((_, delta) => {
    if (!isPlaying || !meshRef.current) return;
    
    setPositions(prev => prev.map(p => {
      // Courant circule de haut (+Y) vers le bas (-Y) : le condensateur se charge
      let newY = p.y - delta * 3;
      if (newY < -3) newY = 3;
      return { ...p, y: newY };
    }));

    positions.forEach((p, i) => {
      // Filtre : Ne pas afficher de particules de conduction ENTRE les plaques (-1 < Y < 1)
      if (p.y > -1 && p.y < 1) {
        dummy.scale.setScalar(0);
      } else {
        dummy.scale.setScalar(1);
        dummy.position.set(0, p.y, 0);
      }
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={meshRef} args={[null, null, numParticles] as any}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color="#3b82f6" />
    </instancedMesh>
  );
};

// Le courant de déplacement J_D entre les plaques (flèches pulsantes)
const DisplacementCurrent = ({ isPlaying }: { isPlaying: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numArrows = 20;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime(t => t + delta * 5);
    if (!meshRef.current) return;

    for (let i = 0; i < numArrows; i++) {
      // Distribuer sur un cercle
      const r = Math.sqrt(Math.random()) * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Animation de pulsation/déplacement de haut en bas
      const yOffset = (Math.sin(time + i) * 0.2); 
      
      dummy.position.set(x, yOffset, z);
      dummy.scale.set(0.04, 0.4, 0.04);
      dummy.rotation.set(Math.PI, 0, 0); // Vers le bas
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={meshRef} args={[null, null, numArrows] as any}>
      <cylinderGeometry args={[1, 0, 1, 8]} /> {/* Flèche */}
      <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export default function DisplacementCurrent3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);

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
        
        {/* HUD Info */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Conservation de la charge</span>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-blue-500 rounded-full" />
                <span className="text-blue-400 font-bold text-xs"><LatexMath math="\vec{j}" /> (Conduction)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-purple-500 rounded-full" />
                <span className="text-purple-400 font-bold text-xs"><LatexMath math="\vec{j}_D" /> (Déplacement)</span>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-center">
              <span className="text-white text-xs font-mono bg-slate-800 px-2 py-1 rounded">
                <LatexMath math="\text{div}(\vec{j} + \vec{j}_D) = 0" />
              </span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 2, 5], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, 0, 0]}>
            {/* Fils */}
            <Cylinder args={[0.05, 0.05, 4]} position={[0, 3, 0]}>
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 4]} position={[0, -3, 0]}>
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </Cylinder>

            {/* Plaques du condensateur */}
            <Cylinder args={[2, 2, 0.1, 32]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </Cylinder>
            <Cylinder args={[2, 2, 0.1, 32]} position={[0, -1, 0]}>
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </Cylinder>

            <ConductionCurrent isPlaying={isPlaying} />
            <DisplacementCurrent isPlaying={isPlaying} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -4, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-center gap-4 flex-wrap">
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
