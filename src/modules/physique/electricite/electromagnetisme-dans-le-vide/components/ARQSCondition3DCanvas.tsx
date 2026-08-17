"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, ZoomIn } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Circuit représentant la taille caractéristique L
const CircuitBoard = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Plaque principale */}
      <Box args={[5.5, 0.18, 3.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.6} />
      </Box>
      {/* Composants */}
      <Box args={[1.2, 0.35, 1.2]} position={[-1.6, 0.25, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </Box>
      <Box args={[0.9, 0.25, 0.9]} position={[1.5, 0.2, 0.8]}>
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </Box>
      {/* Pistes cuivrées */}
      <Line points={[[-1.6, 0.12, 0], [1.5, 0.12, 0.8]]} color="#f59e0b" lineWidth={2.5} />
      
      {/* Flèche de taille L sous le circuit pour éviter tout chevauchement */}
      <group position={[0, -0.3, 2.2]}>
        <Line points={[[-2.75, 0, 0], [2.75, 0, 0]]} color="#ef4444" lineWidth={3} />
        <mesh position={[-2.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[2.75, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, -0.35, 0]} center distanceFactor={15}>
          <div className="bg-slate-900/90 px-2 py-0.5 rounded text-[11px] text-red-400 font-bold border border-red-500/40 shadow-xs pointer-events-none whitespace-nowrap">
            Taille du Circuit <LatexMath math="L" />
          </div>
        </Html>
      </group>
    </group>
  );
};

// Onde EM (représente la longueur d'onde lambda)
const ElectromagneticWave = ({ freqLevel, isPlaying }: { freqLevel: number; isPlaying: boolean }) => {
  const [time, setTime] = useState(0);
  
  const k = Math.pow(2, freqLevel - 2); // 0.5, 1, 2, 4, 8
  const lambda = (2 * Math.PI) / k;
  
  const numPoints = 100;
  const extent = 7;

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 2.5);
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * extent * 2 - extent;
      const y = Math.cos(k * x - time) * 0.9;
      pts.push(new THREE.Vector3(x, y + 2.2, 0));
    }
    return pts;
  }, [k, time]);

  return (
    <group>
      {/* Axe de propagation */}
      <Line points={[[-extent, 2.2, 0], [extent, 2.2, 0]]} color="#475569" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
      
      {/* Onde */}
      <Line points={points} color="#38bdf8" lineWidth={3.5} />

      {/* Flèche de longueur d'onde Lambda */}
      <group position={[0, 3.6, 0]}>
        <Line points={[[-Math.min(lambda/2, extent), 0, 0], [Math.min(lambda/2, extent), 0, 0]]} color="#38bdf8" lineWidth={2.5} />
        <mesh position={[-Math.min(lambda/2, extent), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.16, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[Math.min(lambda/2, extent), 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.16, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <Html position={[0, 0.35, 0]} center distanceFactor={15}>
          <div className="bg-slate-900/90 px-2 py-0.5 rounded text-[11px] text-sky-400 font-bold border border-sky-500/40 shadow-xs pointer-events-none whitespace-nowrap">
            Longueur d&apos;onde <LatexMath math="\lambda" />
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

  const k = Math.pow(2, freqLevel - 2);
  const lambdaVisual = (2 * Math.PI) / k;
  const isARQS = lambdaVisual > 5.5;

  const getFreqData = (val: number) => {
    switch(val) {
      case 1: return { label: "50 Hz (Réseau EDF)", lambda: "6000 km", ratio: "L << λ (ARQS Parfait)" };
      case 2: return { label: "20 kHz (Signaux Audio)", lambda: "15 km", ratio: "L << λ (ARQS Valide)" };
      case 3: return { label: "1 MHz (Ondes Radio AM)", lambda: "300 m", ratio: "L < λ (ARQS Limite)" };
      case 4: return { label: "100 MHz (Radio FM)", lambda: "3 m", ratio: "L ~ λ (Propagation)" };
      case 5: return { label: "3 GHz (Processeur PC / Wi-Fi)", lambda: "10 cm", ratio: "L > λ (ARQS Faux)" };
      default: return { label: "", lambda: "", ratio: "" };
    }
  };

  const currentData = getFreqData(freqLevel);

  return (
    <div className="w-full flex flex-col gap-3 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-full h-[320px] sm:h-[360px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Info Positionné Proprement en Haut à Gauche */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl shadow-lg flex flex-col gap-1.5 min-w-[210px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">État ARQS</span>
              {isARQS ? (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  ARQS Valide
                </span>
              ) : (
                <span className="text-[10px] font-black text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 rounded">
                  ARQS Non Valide
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
              <span className="text-slate-400">Signal :</span>
              <span className="text-white font-bold">{currentData.label}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Longueur d&apos;onde λ :</span>
              <span className="text-sky-400 font-mono font-bold">{currentData.lambda}</span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 5, 11], fov: 38 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[0, 10, 5]} intensity={1.8} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
          
          <group position={[0, -0.5, 0]}>
            <CircuitBoard />
            <ElectromagneticWave freqLevel={freqLevel} isPlaying={isPlaying} />
          </group>
          
          <ContactShadows resolution={256} scale={14} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -1.2, 0]} />
        </Canvas>
      </div>

      {/* Barre de Contrôle Simplifiée */}
      <div className="w-full bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>Fréquence du signal : <strong className="text-sky-400">{currentData.label}</strong></span>
            <span className="text-slate-400 font-mono">{currentData.ratio}</span>
          </div>
          <input 
            type="range" min="1" max="5" step="1" value={freqLevel} onChange={(e) => setFreqLevel(Number(e.target.value))}
            className="w-full accent-sky-500 h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
            <span>50 Hz (Réseau)</span>
            <span>1 MHz (Radio)</span>
            <span>3 GHz (PC)</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors shrink-0"
          title={isPlaying ? "Mettre en pause" : "Lancer l'animation"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
