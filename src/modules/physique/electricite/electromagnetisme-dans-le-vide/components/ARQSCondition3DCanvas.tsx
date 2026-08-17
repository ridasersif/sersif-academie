"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity, Box as BoxIcon, Info } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── PRESETS DES CAS CONCRETS ──
const PRESETS = [
  { id: 1, label: "50 Hz", fullLabel: "50 Hz (Réseau EDF)", lambda: "6000 km", isARQS: true, status: "ARQS Parfait (L ≪ λ)" },
  { id: 2, label: "20 kHz", fullLabel: "20 kHz (Audio Hi-Fi)", lambda: "15 km", isARQS: true, status: "ARQS Valide (L ≪ λ)" },
  { id: 3, label: "10 MHz", fullLabel: "10 MHz (Radio HF)", lambda: "30 m", isARQS: true, status: "ARQS Limite (L ≤ λ/100)" },
  { id: 4, label: "100 MHz", fullLabel: "100 MHz (Radio FM)", lambda: "3 m", isARQS: false, status: "Propagation (L ~ λ)" },
  { id: 5, label: "3 GHz", fullLabel: "3 GHz (Processeur PC / Wi-Fi)", lambda: "10 cm", isARQS: false, status: "ARQS Faux (L > λ)" },
];

// Circuit Board 3D Compact
const CircuitBoard = ({ isARQS, isPlaying }: { isARQS: boolean; isPlaying: boolean }) => {
  const [traceTime, setTraceTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTraceTime((t) => t + delta * 6);
  });

  const p1 = [-1.4, 0.1, 0];
  const p2 = [1.3, 0.1, 0.7];
  
  const numTracePoints = 25;
  const traceSegments = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    
    for (let i = 0; i <= numTracePoints; i++) {
      const alpha = i / numTracePoints;
      const x = p1[0] + (p2[0] - p1[0]) * alpha;
      const y = p1[1] + (p2[1] - p1[1]) * alpha;
      const z = p1[2] + (p2[2] - p1[2]) * alpha;
      pts.push(new THREE.Vector3(x, y, z));
      
      if (isARQS) {
        colors.push(new THREE.Color("#f59e0b")); // Jaune uniforme
      } else {
        const phase = alpha * Math.PI * 4 - traceTime;
        const val = Math.sin(phase);
        const col = val > 0 
          ? new THREE.Color("#38bdf8").lerp(new THREE.Color("#ffffff"), val * 0.4) 
          : new THREE.Color("#ef4444").lerp(new THREE.Color("#ffffff"), -val * 0.4);
        colors.push(col);
      }
    }
    return { pts, colors };
  }, [isARQS, traceTime]);

  return (
    <group position={[0, -0.4, 0]}>
      <Box args={[4.6, 0.15, 2.6]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.6} />
      </Box>
      <Box args={[1.0, 0.3, 1.0]} position={[-1.4, 0.2, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </Box>
      <Box args={[0.8, 0.22, 0.8]} position={[1.3, 0.16, 0.7]}>
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </Box>

      {isARQS ? (
        <Line points={[[p1[0], p1[1], p1[2]], [p2[0], p2[1], p2[2]]]} color="#f59e0b" lineWidth={3.5} />
      ) : (
        <Line points={traceSegments.pts} vertexColors={traceSegments.colors.map(c => [c.r, c.g, c.b])} lineWidth={4} />
      )}
      
      <group position={[0, -0.25, 1.7]}>
        <Line points={[[-2.3, 0, 0], [2.3, 0, 0]]} color="#ef4444" lineWidth={2.5} />
        <mesh position={[-2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.15, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[2.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.15, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, -0.3, 0]} center distanceFactor={14}>
          <div className="bg-slate-900/95 px-2 py-0.5 rounded text-[10px] text-red-400 font-bold border border-red-500/40 shadow-xs pointer-events-none whitespace-nowrap">
            Taille du Circuit <LatexMath math="L" />
          </div>
        </Html>
      </group>
    </group>
  );
};

// Onde EM 3D
const ElectromagneticWave = ({ freqLevel, isPlaying }: { freqLevel: number; isPlaying: boolean }) => {
  const [time, setTime] = useState(0);
  
  const k = Math.pow(2, freqLevel - 2);
  const lambda = (2 * Math.PI) / k;
  
  const numPoints = 80;
  const extent = 6;

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.5);
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * extent * 2 - extent;
      const y = Math.cos(k * x - time) * 0.75;
      pts.push(new THREE.Vector3(x, y + 1.8, 0));
    }
    return pts;
  }, [k, time]);

  return (
    <group>
      <Line points={[[-extent, 1.8, 0], [extent, 1.8, 0]]} color="#475569" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
      <Line points={points} color="#38bdf8" lineWidth={3} />

      <group position={[0, 2.9, 0]}>
        <Line points={[[-Math.min(lambda/2, extent), 0, 0], [Math.min(lambda/2, extent), 0, 0]]} color="#38bdf8" lineWidth={2} />
        <mesh position={[-Math.min(lambda/2, extent), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.14, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[Math.min(lambda/2, extent), 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.14, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <Html position={[0, 0.28, 0]} center distanceFactor={14}>
          <div className="bg-slate-900/95 px-2 py-0.5 rounded text-[10px] text-sky-400 font-bold border border-sky-500/40 shadow-xs pointer-events-none whitespace-nowrap">
            Longueur d&apos;onde <LatexMath math="\lambda" />
          </div>
        </Html>
      </group>
    </group>
  );
};

// ── COMPOSANT GRAPHIQUE 2D : COMPARAISON DE TENSION VA(t) vs VB(t) ──
const VoltageComparisonGraph = ({ isARQS }: { isARQS: boolean }) => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setT(prev => prev + 0.05);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const width = 460;
  const height = 150;
  const pointsA: string[] = [];
  const pointsB: string[] = [];

  const phaseShift = isARQS ? 0 : Math.PI * 0.75; // Pas de déphasage en ARQS, grand déphasage hors ARQS

  for (let x = 0; x <= width; x += 6) {
    const angle = (x / 50) - t;
    const yA = height / 2 - Math.sin(angle) * 45;
    const yB = height / 2 - Math.sin(angle - phaseShift) * 45;
    pointsA.push(`${x},${yA}`);
    pointsB.push(`${x},${yB}`);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between w-full mb-1 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            Tension en A : <LatexMath math="v_A(t)" />
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Tension en B : <LatexMath math="v_B(t)" />
          </span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
          isARQS ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
        }`}>
          {isARQS ? "vA(t) = vB(t) (Synchrone / Pas de Déphasage)" : "vA(t) ≠ vB(t) (Déphasage Spatial Visible)"}
        </span>
      </div>

      <svg className="w-full h-32 overflow-hidden bg-slate-900/60 rounded-xl border border-slate-800" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Axe central 0V */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
        
        {/* Courbe A (Entrée) */}
        <polyline fill="none" stroke="#38bdf8" strokeWidth="3" points={pointsA.join(" ")} />
        
        {/* Courbe B (Sortie) */}
        <polyline fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={isARQS ? "none" : "6 4"} points={pointsB.join(" ")} />
      </svg>

      <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
        {isARQS 
          ? "En régime ARQS, le signal arrive instantanément : la tension en entrée (A) et en sortie (B) du circuit est strictement identique."
          : "Hors ARQS (Haute Fréquence), le signal met du temps à se propager : il y a un retard temporel (déphasage spatial) le long du fil."
        }
      </p>
    </div>
  );
};

export default function ARQSCondition3DCanvas() {
  const [freqLevel, setFreqLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"3d" | "graph">("3d");

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentPreset = PRESETS.find(p => p.id === freqLevel) || PRESETS[0];
  const isARQS = currentPreset.isARQS;

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── SÉLECTEUR DE CAS INTERACTIFS (BOUTONS PRESETS DIRECTS) ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <span className="text-[11px] font-bold text-muted-foreground px-1 hidden sm:inline">
          Choisir un Cas :
        </span>
        
        <div className="flex flex-wrap items-center gap-1 flex-1">
          {PRESETS.map((p) => {
            const isSelected = p.id === freqLevel;
            return (
              <button
                key={p.id}
                onClick={() => setFreqLevel(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? p.isARQS
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs scale-100"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-xs scale-100"
                    : "bg-background hover:bg-muted text-muted-foreground border-border/60"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.isARQS ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bouton pour basculer Vue 3D vs Graphique */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            onClick={() => setActiveView("3d")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "3d" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Vue 3D Circuit & Onde"
          >
            <BoxIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Vue 3D</span>
          </button>
          <button
            onClick={() => setActiveView("graph")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "graph" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Comparaison Graphique de Tension"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Graphique v(t)</span>
          </button>
        </div>
      </div>

      {/* ── ZONE DE CONTENU (HAUTEUR COMPACTE 260px - 300px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[260px] sm:h-[300px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {activeView === "3d" ? (
          <>
            {/* HUD Info Compact & Non-bloquant */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none max-w-[210px] sm:max-w-[240px]">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">État</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                    isARQS ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" : "text-rose-400 bg-rose-500/15 border-rose-500/30"
                  }`}>
                    {isARQS ? "ARQS Valide" : "Non Valide"}
                  </span>
                </div>
                
                <div className="text-[10.5px] text-white font-bold truncate">
                  {currentPreset.fullLabel}
                </div>

                <div className="text-[10px] text-sky-400 font-mono">
                  Longueur d&apos;onde λ = {currentPreset.lambda}
                </div>
              </div>
            </div>

            <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 4.5, 9.5], fov: 36 }} className="w-full h-full">
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.6} />
              <spotLight position={[0, 10, 5]} intensity={1.8} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
              
              <group position={[0, -0.3, 0]}>
                <CircuitBoard isARQS={isARQS} isPlaying={isPlaying} />
                <ElectromagneticWave freqLevel={freqLevel} isPlaying={isPlaying} />
              </group>
              
              <ContactShadows resolution={256} scale={12} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -1.0, 0]} />
            </Canvas>
          </>
        ) : (
          <VoltageComparisonGraph isARQS={isARQS} />
        )}
      </div>

      {/* ── BARRE DE CONTRÔLE COMPACTE & RESPONSIVE ── */}
      <div className="w-full bg-card/80 border border-border/80 p-2.5 rounded-xl flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex-1 min-w-[180px] flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-foreground">{currentPreset.fullLabel}</span>
            <span className={isARQS ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {currentPreset.status}
            </span>
          </div>

          <div className="relative flex flex-col gap-0.5">
            <input 
              type="range" min="1" max="5" step="1" value={freqLevel} onChange={(e) => setFreqLevel(Number(e.target.value))}
              className="w-full accent-primary h-1.5 cursor-pointer z-10"
            />
            <div className="w-full h-1 rounded-full flex overflow-hidden opacity-50">
              <div className="w-[60%] bg-emerald-500" />
              <div className="w-[40%] bg-rose-500" />
            </div>
          </div>
        </div>

        {activeView === "3d" && (
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors shrink-0"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

    </div>
  );
}
