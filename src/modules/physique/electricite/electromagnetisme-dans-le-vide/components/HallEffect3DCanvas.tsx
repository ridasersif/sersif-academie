"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Plaque conductrice
const Plate = () => (
  <Box args={[4, 0.2, 2]} position={[0, 0, 0]}>
    <meshPhysicalMaterial color="#94a3b8" transmission={0.9} thickness={0.5} roughness={0.1} metalness={0.1} transparent opacity={0.4} />
  </Box>
);

// Particules animées (Porteurs de charge)
const Carriers = ({ chargeSign, isPlaying }: { chargeSign: number, isPlaying: boolean }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Générer positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 60; i++) {
      // Les particules démarrent à gauche (si électrons, vitesse vers la droite ou gauche selon courant conventionnel)
      // Courant I vers +X.
      // Si q > 0, v vers +X. Si q < 0, v vers -X.
      const startX = (Math.random() - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 1.5;
      temp.push({ x: startX, y: 0, z: startZ, offset: Math.random() * 10 });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Vitesse de dérive v
    const speed = chargeSign > 0 ? 1.5 : -1.5; 
    // Déviation par force de Lorentz (v x B). B est vers +Y. 
    // q(v x B). Si q>0, v=+X, B=+Y -> F = +Z
    // Si q<0, v=-X, B=+Y -> F = (-)(-X x Y) = +Z
    // Donc les DEUX types de charges sont déviés vers +Z !
    const driftZ = 0.5; 
    
    particles.forEach((p, i) => {
      if (isPlaying) {
        p.x += speed * delta;
        // Mouvement vers le bord (+Z)
        if (p.z < 0.8) p.z += driftZ * delta;
        
        // Boucle
        if (chargeSign > 0 && p.x > 2.2) { p.x = -2.2; p.z = (Math.random() - 0.5) * 1.5; }
        if (chargeSign < 0 && p.x < -2.2) { p.x = 2.2; p.z = (Math.random() - 0.5) * 1.5; }
      }
      
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const color = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={mesh} args={[null, null, 60] as any}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
};

export default function HallEffect3DCanvas() {
  const [chargeSign, setChargeSign] = useState(-1); // -1: électrons, 1: trous
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
        
        {/* HUD */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[140px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tension de Hall</span>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300">Face Avant :</span>
              <span className={`text-xs font-bold ${chargeSign > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                {chargeSign > 0 ? '+' : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300">Face Arrière :</span>
              <span className={`text-xs font-bold ${chargeSign > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {chargeSign > 0 ? '-' : '+'}
              </span>
            </div>
            <div className="mt-1 pt-1 border-t border-slate-700/50 flex justify-center">
              <span className="text-yellow-400 font-bold text-xs"><LatexMath math="U_H = \frac{I B}{n q h}" /></span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 4, 6], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.2} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, 0, 0]}>
            <Plate />
            <Carriers chargeSign={chargeSign} isPlaying={isPlaying} />
            
            {/* Champ Magnétique B (vers le haut +Y) */}
            <group position={[0, -1, 0]}>
              <Line points={[[0, 0, 0], [0, 2, 0]]} color="#10b981" lineWidth={3} opacity={0.6} transparent />
              <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.1, 0.3, 16]} />
                <meshBasicMaterial color="#10b981" toneMapped={false} />
              </mesh>
              <Html position={[0.2, 2, 0]} center><div className="text-emerald-400 font-bold"><LatexMath math="\vec{B}" /></div></Html>
            </group>

            {/* Courant I (vers la droite +X) */}
            <group position={[-2.5, 0, 0]}>
              <Line points={[[0, 0, 0], [1, 0, 0]]} color="#facc15" lineWidth={4} />
              <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
                <coneGeometry args={[0.15, 0.4, 16]} />
                <meshBasicMaterial color="#facc15" toneMapped={false} />
              </mesh>
              <Html position={[0.5, 0.3, 0]} center><div className="text-yellow-400 font-bold"><LatexMath math="\vec{I}" /></div></Html>
            </group>

            {/* Champ de Hall E_H */}
            {/* Si q > 0, accumulation de + en avant (+Z). Donc E_H va de +Z vers -Z */}
            {/* Si q < 0, accumulation de - en avant (+Z). Donc E_H va de -Z vers +Z */}
            <group position={[0, 0.5, 0]}>
              <Line points={[[0, 0, chargeSign * 1], [0, 0, chargeSign * -1]]} color="#a855f7" lineWidth={3} dashed dashSize={0.1} gapSize={0.1} />
              <mesh position={[0, 0, chargeSign * -1]} rotation={[chargeSign > 0 ? -Math.PI/2 : Math.PI/2, 0, 0]}>
                <coneGeometry args={[0.1, 0.3, 16]} />
                <meshBasicMaterial color="#a855f7" toneMapped={false} />
              </mesh>
              <Html position={[0, 0.3, 0]} center><div className="text-purple-400 font-bold"><LatexMath math="\vec{E}_H" /></div></Html>
            </group>
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -1.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setChargeSign(-1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${chargeSign === -1 ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Électrons (<LatexMath math="q < 0" />)
          </button>
          <button 
            onClick={() => setChargeSign(1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${chargeSign === 1 ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Trous (<LatexMath math="q > 0" />)
          </button>
        </div>
        
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
