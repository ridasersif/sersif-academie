"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Circuit représentant la taille caractéristique L
const CircuitBoard = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Plaque principale */}
      <Box args={[6, 0.2, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.7} />
      </Box>
      {/* Composants */}
      <Box args={[1.5, 0.4, 1.5]} position={[-1.5, 0.3, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[1, 0.3, 1]} position={[1.5, 0.25, 1]}>
        <meshStandardMaterial color="#475569" />
      </Box>
      {/* Pistes */}
      <Line points={[[-1.5, 0.15, 0], [1.5, 0.15, 1]]} color="#fbbf24" lineWidth={2} />
      
      {/* Flèche de taille L */}
      <Line points={[[-3, 0.5, 2.5], [3, 0.5, 2.5]]} color="#ef4444" lineWidth={3} />
      <mesh position={[-3, 0.5, 2.5]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[3, 0.5, 2.5]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <Html position={[0, 0.5, 2.5]} center>
        <div className="bg-red-500/20 px-2 py-0.5 rounded text-red-400 font-bold border border-red-500/50">Taille Circuit <LatexMath math="L" /></div>
      </Html>
    </group>
  );
};

// Onde EM (représente la longueur d'onde lambda)
const ElectromagneticWave = ({ freqLevel, isPlaying }: { freqLevel: number; isPlaying: boolean }) => {
  const [time, setTime] = useState(0);
  
  // freqLevel va de 1 (Basse fréq, lambda >> L) à 5 (Haute fréq, lambda ~ L)
  // La longueur d'onde varie inversement avec la fréquence.
  // Pour l'animation, on choisit des k arbitraires pour l'effet visuel.
  const k = Math.pow(2, freqLevel - 2); // 0.5, 1, 2, 4, 8
  const lambda = (2 * Math.PI) / k;
  
  const numPoints = 100;
  const extent = 8; // De -4 à 4

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 2);
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * extent * 2 - extent;
      const y = Math.cos(k * x - time) * 1.5;
      pts.push(new THREE.Vector3(x, y + 1.5, 0));
    }
    return pts;
  }, [k, time]);

  return (
    <group>
      {/* Axe de propagation */}
      <Line points={[[-extent, 1.5, 0], [extent, 1.5, 0]]} color="#64748b" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
      
      {/* Onde */}
      <Line points={points} color="#0ea5e9" lineWidth={4} />

      {/* Flèche de longueur d'onde Lambda */}
      {/* On cherche deux crêtes successives */}
      <group position={[0, 3.2, 0]}>
        <Line points={[[-lambda/2, 0, 0], [lambda/2, 0, 0]]} color="#0ea5e9" lineWidth={3} />
        <mesh position={[-lambda/2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
        <mesh position={[lambda/2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-sky-500/20 px-2 py-0.5 rounded text-sky-400 font-bold border border-sky-500/50 whitespace-nowrap">
            Longueur d'onde <LatexMath math="\lambda" />
          </div>
        </Html>
      </group>
    </group>
  );
};

export default function ARQSCondition3DCanvas() {
  const [freqLevel, setFreqLevel] = useState(1); // 1 = 50Hz, 5 = Wi-Fi
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Déterminer l'état
  const k = Math.pow(2, freqLevel - 2);
  const lambdaVisual = (2 * Math.PI) / k;
  const isARQS = lambdaVisual > 6; // L = 6 environ

  const getFreqLabel = (val: number) => {
    switch(val) {
      case 1: return "50 Hz (Réseau élec.)";
      case 2: return "10 kHz (Audio)";
      case 3: return "1 MHz (Radio AM)";
      case 4: return "100 MHz (Radio FM)";
      case 5: return "2.4 GHz (Wi-Fi)";
      default: return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[320px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Info */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Condition ARQS</span>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Fréquence :</span>
              <span className="text-white font-bold">{getFreqLabel(freqLevel)}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-slate-700/50">
              <span className="text-slate-300">Régime :</span>
              {isARQS ? (
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">ARQS Valide (<LatexMath math="L \ll \lambda" />)</span>
              ) : (
                <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">Propagation (<LatexMath math="L \sim \lambda" />)</span>
              )}
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 8, 12], fov: 40 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.2} />
          
          <group position={[0, -1, 0]}>
            <CircuitBoard />
            <ElectromagneticWave freqLevel={freqLevel} isPlaying={isPlaying} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -1.5, 0]} />
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
            <span>Basse (ARQS)</span>
            <span>Haute (Ondes)</span>
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
