"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Cylinder, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Le courant (particules)
const CurrentParticles = ({ freqLevel, isPlaying }: { freqLevel: number; isPlaying: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numParticles = 400; // Beaucoup de particules pour bien voir la densité
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const wireRadius = 2;
  
  // L'épaisseur de peau (Skin depth) delta diminue quand la fréquence augmente.
  // freqLevel de 1 à 5.
  // 1 = continu (delta >> R), 5 = très haute fréq (delta << R)
  const getSkinDepth = (level: number) => {
    switch(level) {
      case 1: return 10; // Quasi-uniforme
      case 2: return 1.5;
      case 3: return 0.8;
      case 4: return 0.4;
      case 5: return 0.15; // Très fin à la surface
      default: return 10;
    }
  };

  const deltaSkin = getSkinDepth(freqLevel);

  const [particles, setParticles] = useState(() => 
    Array.from({ length: numParticles }).map(() => {
      return {
        rNormal: Math.random(), // 0 à 1 (position radiale normalisée)
        theta: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 6,
        speed: 1 + Math.random() * 0.5
      };
    })
  );

  useFrame((_, dt) => {
    if (!isPlaying || !meshRef.current) return;
    
    setParticles(prev => prev.map(p => {
      let newY = p.y + dt * p.speed * 4;
      if (newY > 3) newY = -3;
      return { ...p, y: newY };
    }));

    particles.forEach((p, i) => {
      // Calcul du rayon effectif basé sur la loi exponentielle de l'effet de peau :
      // La densité de probabilité (ou le courant) diminue exponentiellement depuis la surface
      // On map p.rNormal pour obtenir un r qui favorise la surface.
      
      // La distance depuis la surface est x. On veut une distribution ~ exp(-x/delta)
      // x = -delta * ln(1 - rNormal)
      // On limite x au rayon max.
      let distFromSurface = -deltaSkin * Math.log(1 - p.rNormal * 0.99); 
      if (distFromSurface > wireRadius) distFromSurface = Math.random() * wireRadius; // Fallback pour les particules "perdues"
      
      const r = wireRadius - distFromSurface;
      
      const x = r * Math.cos(p.theta);
      const z = r * Math.sin(p.theta);

      dummy.position.set(x, p.y, z);
      
      // Taille de particule plus petite en haute fréquence pour voir la surface
      const pScale = freqLevel > 3 ? 0.04 : 0.06;
      dummy.scale.setScalar(pScale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={meshRef} args={[null, null, numParticles] as any}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ef4444" />
    </instancedMesh>
  );
};

export default function SkinEffect3DCanvas() {
  const [freqLevel, setFreqLevel] = useState(1); // 1 = Continu/Basse, 5 = Haute
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const getFreqLabel = (val: number) => {
    switch(val) {
      case 1: return "50 Hz (Uniforme)";
      case 2: return "10 kHz";
      case 3: return "1 MHz";
      case 4: return "100 MHz";
      case 5: return "1 GHz (Pelliculaire)";
      default: return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[320px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Info */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Effet de Peau (Skin Effect)</span>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Fréquence <LatexMath math="f" /> :</span>
              <span className="text-white font-bold">{getFreqLabel(freqLevel)}</span>
            </div>
            
            <div className="mt-1 pt-1 border-t border-slate-700/50 flex flex-col gap-1 text-xs">
              <span className="text-slate-300">Épaisseur de peau <LatexMath math="\delta" /> :</span>
              <div className="flex justify-center mt-1">
                <span className="text-sky-400 font-mono font-bold bg-sky-500/10 px-2 py-0.5 rounded">
                  <LatexMath math="\delta = \sqrt{\frac{2}{\mu_0 \gamma \omega}}" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 4, 6], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, 0, 0]}>
            {/* Le Fil Conducteur (Transparent pour voir dedans) */}
            <Cylinder args={[2.05, 2.05, 6, 32]}>
              <meshPhysicalMaterial color="#94a3b8" transparent opacity={0.15} roughness={0.1} transmission={0.9} thickness={0.1} />
            </Cylinder>
            
            {/* Bordures pour délimiter */}
            <Line points={Array.from({length: 65}).map((_, i) => new THREE.Vector3(2.05 * Math.cos(i*Math.PI*2/64), 3, 2.05 * Math.sin(i*Math.PI*2/64)))} color="#64748b" />
            <Line points={Array.from({length: 65}).map((_, i) => new THREE.Vector3(2.05 * Math.cos(i*Math.PI*2/64), -3, 2.05 * Math.sin(i*Math.PI*2/64)))} color="#64748b" />
            
            <CurrentParticles freqLevel={freqLevel} isPlaying={isPlaying} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -3.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Augmenter la Fréquence</span>
          </div>
          <input 
            type="range" min="1" max="5" step="1" value={freqLevel} onChange={(e) => setFreqLevel(Number(e.target.value))}
            className="w-full accent-sky-500 h-1.5"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-1">
            <span>Uniforme</span>
            <span>Surface</span>
          </div>
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
