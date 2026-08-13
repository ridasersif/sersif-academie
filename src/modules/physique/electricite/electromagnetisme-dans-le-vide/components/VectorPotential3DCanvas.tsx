"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Animation du courant
const CurrentParticles = ({ direction }: { direction: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numParticles = 120; // Plus de particules pour la fluidité
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [positions, setPositions] = useState(() => 
    Array.from({ length: numParticles }).map(() => (Math.random() - 0.5) * 8)
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    setPositions(prev => prev.map(z => {
      // Vitesse plus douce
      let newZ = z + delta * 2.5 * direction;
      if (direction > 0 && newZ > 4) newZ = -4;
      if (direction < 0 && newZ < -4) newZ = 4;
      return newZ;
    }));

    positions.forEach((z, i) => {
      dummy.position.set(0, 0, z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={meshRef} args={[null, null, numParticles] as any}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
    </instancedMesh>
  );
};

// Le champ A est parallèle au courant
// B = rot(A) tourne autour du courant
const Vectors = ({ showA, showB, radius, direction }: { showA: boolean; showB: boolean; radius: number; direction: number }) => {
  const meshA = useRef<THREE.InstancedMesh>(null);
  const meshAArrow = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshBArrow = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const count = 12; // Nombre de vecteurs sur le cercle
  const zPositions = [-1.5, 0, 1.5]; // 3 hauteurs
  const total = count * zPositions.length;

  useFrame(() => {
    if (!meshA.current || !meshAArrow.current || !meshB.current || !meshBArrow.current) return;

    let index = 0;
    for (let z of zPositions) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        // Vecteur A : Parallèle au fil (direction Z)
        if (showA) {
          const scaleA = Math.max(0.2, 1.5 - 0.4 * radius);
          
          // Corps de la flèche A
          dummy.position.set(x, y, z + (scaleA * 0.4 * direction));
          dummy.scale.set(0.04, scaleA * 0.8, 0.04);
          dummy.rotation.set(Math.PI / 2, 0, 0); // Vers Z
          dummy.updateMatrix();
          meshA.current.setMatrixAt(index, dummy.matrix);
          
          // Pointe de la flèche A
          dummy.position.set(x, y, z + (scaleA * 0.8 * direction));
          dummy.scale.set(0.08, 0.16, 0.08); // Tête plus petite
          dummy.rotation.set(direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          meshAArrow.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshA.current.setMatrixAt(index, dummy.matrix);
          meshAArrow.current.setMatrixAt(index, dummy.matrix);
        }

        // Vecteur B : Tangentiel
        if (showB) {
          const bx = -Math.sin(angle) * direction;
          const by = Math.cos(angle) * direction;
          const scaleB = 1.2 / radius;
          
          // Corps de la flèche B
          dummy.position.set(x + bx * scaleB * 0.4, y + by * scaleB * 0.4, z);
          dummy.scale.set(0.04, scaleB * 0.8, 0.04);
          dummy.rotation.set(0, 0, angle + (direction > 0 ? 0 : Math.PI)); // Tangent
          dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix);
          
          // Pointe de la flèche B
          dummy.position.set(x + bx * scaleB * 0.8, y + by * scaleB * 0.8, z);
          dummy.scale.set(0.08, 0.16, 0.08); // Tête plus petite
          dummy.rotation.set(0, 0, angle + (direction > 0 ? 0 : Math.PI));
          dummy.updateMatrix();
          meshBArrow.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix);
          meshBArrow.current.setMatrixAt(index, dummy.matrix);
        }

        index++;
      }
    }
    
    meshA.current.instanceMatrix.needsUpdate = true;
    meshAArrow.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true;
    meshBArrow.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshA} args={[null, null, total] as any}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.7} />
      </instancedMesh>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshAArrow} args={[null, null, total] as any}>
        <coneGeometry args={[1, 1, 8]} />
        <meshBasicMaterial color="#a855f7" />
      </instancedMesh>
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshB} args={[null, null, total] as any}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
      </instancedMesh>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={meshBArrow} args={[null, null, total] as any}>
        <coneGeometry args={[1, 1, 8]} />
        <meshBasicMaterial color="#10b981" />
      </instancedMesh>
    </group>
  );
};

// Smooth Apparition
const AnimatedGroup = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current && groupRef.current.scale.x < 1) {
      const newScale = Math.min(1, groupRef.current.scale.x + delta * 2);
      groupRef.current.scale.setScalar(newScale);
    }
  });

  return <group ref={groupRef} scale={0.01}>{children}</group>;
};

export default function VectorPotential3DCanvas() {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [radius, setRadius] = useState(1.5);
  const [direction, setDirection] = useState(1); // 1 = +Z, -1 = -Z
  
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
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Légende</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-purple-500 rounded-full" />
              <span className="text-purple-400 font-bold text-xs"><LatexMath math="\vec{A}" /> (Potentiel)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-emerald-500 rounded-full" />
              <span className="text-emerald-400 font-bold text-xs"><LatexMath math="\vec{B}" /> (Champ)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-blue-500 rounded-full" />
              <span className="text-blue-400 font-bold text-xs"><LatexMath math="I" /> (Courant)</span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [4, 4, 4], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} />
          
          <AnimatedGroup>
            <group position={[0, -0.5, 0]}>
              {/* Fil Infini (le long de Z) */}
              <Cylinder args={[0.1, 0.1, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} transparent opacity={0.4} />
              </Cylinder>
              
              <CurrentParticles direction={direction} />

              {/* Cercle d'observation */}
              <Line 
                points={Array.from({ length: 65 }).map((_, i) => {
                  const a = (i / 64) * Math.PI * 2;
                  return new THREE.Vector3(radius * Math.cos(a), radius * Math.sin(a), 0);
                })} 
                color="#475569" 
                lineWidth={2} 
                transparent 
                opacity={0.8} 
              />

              <Vectors showA={showA} showB={showB} radius={radius} direction={direction} />
            </group>
          </AnimatedGroup>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Rayon (r)</span>
            <span className="text-cyan-400">{radius.toFixed(1)} m</span>
          </div>
          <input 
            type="range" min="0.5" max="3" step="0.1" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-cyan-500 h-1.5"
          />
        </div>
        
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          <button 
            onClick={() => setDirection(d => -d)} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Inverser Courant
          </button>
          <button 
            onClick={() => setShowA(!showA)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showA ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
          >
            {showA ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Potentiel <LatexMath math="\vec{A}" />
          </button>
          <button 
            onClick={() => setShowB(!showB)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showB ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
          >
            {showB ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Champ <LatexMath math="\vec{B}" />
          </button>
        </div>
      </div>
    </div>
  );
}
