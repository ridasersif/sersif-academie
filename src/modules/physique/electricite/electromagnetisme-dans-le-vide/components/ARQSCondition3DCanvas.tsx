"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, ContactShadows, Box, Cylinder, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity, Box as BoxIcon, Radio, Zap } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── PRESETS DES CAS CONCRETS ──
const PRESETS = [
  { id: 1, label: "50 Hz", fullLabel: "50 Hz (Réseau EDF)", lambda: "6000 km", k: 0.05, isARQS: true, status: "ARQS Parfait (Onde quasi-plate sur le câble)" },
  { id: 2, label: "20 kHz", fullLabel: "20 kHz (Audio Hi-Fi)", lambda: "15 km", k: 0.25, isARQS: true, status: "ARQS Valide (L ≪ λ)" },
  { id: 3, label: "10 MHz", fullLabel: "10 MHz (Radio HF)", lambda: "30 m", k: 1.0, isARQS: true, status: "ARQS Limite (Légère courbure visible)" },
  { id: 4, label: "100 MHz", fullLabel: "100 MHz (Radio FM)", lambda: "3 m", k: 2.8, isARQS: false, status: "Propagation (1 onde complète sur le câble)" },
  { id: 5, label: "3 GHz", fullLabel: "3 GHz (Processeur PC / Wi-Fi)", lambda: "10 cm", k: 6.5, isARQS: false, status: "ARQS Invalide (Multiples oscillations serrées)" },
];

// ── ONDE ÉLECTROMAGNÉTIQUE 3D GÉANTE & CONDUCTEUR CONNECTÉ ──
const WaveConductorSystem = ({ 
  freqLevel,
  isPlaying, 
  showRadiation 
}: { 
  freqLevel: number;
  isPlaying: boolean; 
  showRadiation: boolean;
}) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.8);
  });

  const currentPreset = PRESETS.find(p => p.id === freqLevel) || PRESETS[0];
  const isARQS = currentPreset.isARQS;
  const k = currentPreset.k;

  const wireLength = 5.6;
  const numPoints = 120;
  const startX = -wireLength / 2;
  const endX = wireLength / 2;

  // Calcul des points de la grande onde sinusoïdale 3D et de la couleur du câble
  const { wavePoints, cableSegments, particles } = useMemo(() => {
    const wavePts: THREE.Vector3[] = [];
    const cableSegs = [];
    const step = wireLength / numPoints;
    const amplitude = 0.85;

    for (let i = 0; i <= numPoints; i++) {
      const x = startX + i * step;
      const alpha = i / numPoints;

      // Équation de l'onde progressive : y(x, t) = A * sin(k*x - omega*t)
      // À 50 Hz (k très petit) : y(x, t) ≈ A * sin(-omega*t) (pulsation synchrone partout)
      // À 3 GHz (k grand) : multiples crêtes et creux
      const phase = k * (x - startX) - time;
      const vVal = Math.sin(phase);
      const waveY = 0.9 + vVal * amplitude;

      wavePts.push(new THREE.Vector3(x, waveY, 0));

      // Couleur locale du câble selon la tension v(x, t)
      const redCol = new THREE.Color("#ef4444"); // Crête positive +V
      const blueCol = new THREE.Color("#0284c7"); // Creux négatif -V
      const goldCol = new THREE.Color("#f59e0b"); // ARQS synchrone
      
      let segColorHex = "#f59e0b";
      let intensity = 1;

      if (isARQS) {
        const vSync = Math.sin(-time);
        intensity = 0.6 + 0.4 * Math.abs(vSync);
        segColorHex = vSync >= 0 ? "#f59e0b" : "#38bdf8";
      } else {
        const blendCol = vVal >= 0 
          ? new THREE.Color("#1e293b").lerp(redCol, Math.abs(vVal))
          : new THREE.Color("#1e293b").lerp(blueCol, Math.abs(vVal));
        segColorHex = `#${blendCol.getHexString()}`;
        intensity = 0.4 + 0.6 * Math.abs(vVal);
      }

      if (i < numPoints) {
        cableSegs.push({
          position: [x + step / 2, 0, 0] as [number, number, number],
          length: step * 1.05,
          color: segColorHex,
          intensity
        });
      }
    }

    // Particules de flux d'énergie circulant de gauche à droite
    const parts = [];
    const numParts = 6;
    for (let p = 0; p < numParts; p++) {
      const pAlpha = ((time * 0.4 + p / numParts) % 1);
      const pX = startX + pAlpha * wireLength;
      const pPhase = k * (pX - startX) - time;
      const pY = 0.9 + Math.sin(pPhase) * amplitude;
      parts.push({ x: pX, y: pY });
    }

    return { wavePoints: wavePts, cableSegments: cableSegs, particles: parts };
  }, [freqLevel, time, k, isARQS, startX, wireLength]);

  // Calcul de la distance entre deux crêtes lambda
  const lambdaVisual = (2 * Math.PI) / k;

  return (
    <group position={[0, -0.2, 0]}>
      
      {/* ── GÉNÉRATEUR (SOURCE) À GAUCHE (x = -3.1) ── */}
      <group position={[-3.1, 0, 0]}>
        <Box args={[0.6, 0.6, 0.6]}>
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </Box>
        <Sphere args={[0.1, 16, 16]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="#38bdf8" />
        </Sphere>
      </group>

      {/* ── RÉCEPTEUR (CHARGE) À DROITE (x = +3.1) ── */}
      <group position={[3.1, 0, 0]}>
        <Box args={[0.6, 0.6, 0.6]}>
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </Box>
        <Sphere args={[0.1, 16, 16]} position={[0, 0.4, 0]}>
          <meshBasicMaterial color="#f59e0b" />
        </Sphere>
      </group>

      {/* ── 1. GRANDE ONDE PROGRESSIVE LUMINEUSE 3D ── */}
      <group>
        {/* Ligne d'axe neutre (0 Volt) */}
        <Line 
          points={[[-startX, 0.9, 0], [startX, 0.9, 0]]} 
          color="#334155" 
          lineWidth={1.5} 
          dashed 
          dashSize={0.2} 
          gapSize={0.15} 
        />

        {/* Tracé sinusoïdal de l'onde */}
        <Line 
          points={wavePoints} 
          color={isARQS ? "#38bdf8" : "#f43f5e"} 
          lineWidth={4} 
        />

        {/* Particules lumineuses qui voyagent de gauche à droite sur l'onde */}
        {particles.map((pt, idx) => (
          <Sphere key={idx} args={[0.08, 16, 16]} position={[pt.x, pt.y, 0]}>
            <meshBasicMaterial color="#ffffff" />
          </Sphere>
        ))}

        {/* Flèche indiquant la longueur d'onde λ si visible */}
        {!isARQS && lambdaVisual < wireLength && (
          <group position={[startX + lambdaVisual / 2, 2.1, 0]}>
            <Line points={[[-lambdaVisual / 2, 0, 0], [lambdaVisual / 2, 0, 0]]} color="#38bdf8" lineWidth={2} />
            <mesh position={[-lambdaVisual / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[lambdaVisual / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.14, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        )}
      </group>

      {/* ── 2. CÂBLE CYLINDRIQUE EN CUIVRE EN DESSOUS (COULEUR SYNCHRO AVEC L'ONDE) ── */}
      <group>
        {cableSegments.map((seg, i) => (
          <Cylinder
            key={i}
            args={[0.08, 0.08, seg.length, 16]}
            position={seg.position}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial 
              color={seg.color} 
              metalness={0.7} 
              roughness={0.2} 
              emissive={seg.color}
              emissiveIntensity={seg.intensity * 0.6}
            />
          </Cylinder>
        ))}
      </group>

      {/* ── 3. SONDES A, B, C RELIÉES ENTRE LE CÂBLE ET L'ONDE ── */}
      {/* Sonde A (Entrée) */}
      <group position={[-2.4, 0, 0]}>
        <Sphere args={[0.09, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </Sphere>
        <Line points={[[0, 0, 0], [0, 0.9, 0]]} color="#38bdf8" lineWidth={1.5} dashed dashSize={0.1} />
      </group>

      {/* Sonde B (Milieu) */}
      <group position={[0, 0, 0]}>
        <Sphere args={[0.09, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
        </Sphere>
        <Line points={[[0, 0, 0], [0, 0.9, 0]]} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.1} />
      </group>

      {/* Sonde C (Sortie) */}
      <group position={[2.4, 0, 0]}>
        <Sphere args={[0.09, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
        </Sphere>
        <Line points={[[0, 0, 0], [0, 0.9, 0]]} color="#ec4899" lineWidth={1.5} dashed dashSize={0.1} />
      </group>

      {/* Ligne indiquant la longueur du câble L */}
      <group position={[0, -0.4, 0]}>
        <Line points={[[-2.8, 0, 0], [2.8, 0, 0]]} color="#64748b" lineWidth={1.5} />
        <mesh position={[-2.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.04, 0.1, 8]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <mesh position={[2.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.04, 0.1, 8]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
      </group>
    </group>
  );
};

// ── GRAPHIQUE TEMPOREL MULTI-SONDES vA(t), vB(t), vC(t) ──
const VoltageMultiProbeGraph = ({ isARQS, freqLevel }: { isARQS: boolean; freqLevel: number }) => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setT(prev => prev + 0.06);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const width = 460;
  const height = 130;
  const pointsA: string[] = [];
  const pointsB: string[] = [];
  const pointsC: string[] = [];

  const phaseB = isARQS ? 0 : (freqLevel >= 5 ? Math.PI * 0.8 : Math.PI * 0.4);
  const phaseC = isARQS ? 0 : (freqLevel >= 5 ? Math.PI * 1.6 : Math.PI * 0.8);

  for (let x = 0; x <= width; x += 5) {
    const angle = (x / 45) - t;
    const yA = height / 2 - Math.sin(angle) * 40;
    const yB = height / 2 - Math.sin(angle - phaseB) * 40;
    const yC = height / 2 - Math.sin(angle - phaseC) * 40;
    pointsA.push(`${x},${yA}`);
    pointsB.push(`${x},${yB}`);
    pointsC.push(`${x},${yC}`);
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950 rounded-2xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <LatexMath math="v_A(t)" /> (Entrée)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <LatexMath math="v_B(t)" /> (Milieu)
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <LatexMath math="v_C(t)" /> (Sortie)
          </span>
        </div>

        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
          isARQS 
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
        }`}>
          {isARQS ? "v_A = v_B = v_C (Synchrone)" : "Déphasage Spatial Actif (Δφ ≠ 0)"}
        </span>
      </div>

      <svg className="w-full h-24 my-1 bg-slate-900/70 rounded-xl border border-slate-800" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={pointsA.join(" ")} />
        <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray={isARQS ? "none" : "5 3"} points={pointsB.join(" ")} />
        <polyline fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray={isARQS ? "none" : "3 3"} points={pointsC.join(" ")} />
      </svg>

      <p className="text-[10px] text-slate-400 text-center leading-tight">
        {isARQS 
          ? "En régime ARQS, l'onde est quasi-infinie devant le fil : les 3 sondes oscillent à l'unisson sans retard."
          : "Hors ARQS (Hautes Fréquences), l'onde voyage le long du fil : la sonde C reçoit le signal avec un retard par rapport à la sonde A."
        }
      </p>
    </div>
  );
};

export default function ARQSCondition3DCanvas() {
  const [freqLevel, setFreqLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"3d" | "graph">("3d");
  const [showRadiation, setShowRadiation] = useState<boolean>(true);

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
        <div className="flex flex-wrap items-center gap-1 flex-1">
          <span className="text-[11px] font-bold text-muted-foreground px-1 hidden sm:inline">
            Fréquence :
          </span>
          {PRESETS.map((p) => {
            const isSelected = p.id === freqLevel;
            return (
              <button
                key={p.id}
                onClick={() => setFreqLevel(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? p.isARQS
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-xs"
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
            title="Vue 3D Onde & Câble"
          >
            <BoxIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Onde 3D</span>
          </button>
          <button
            onClick={() => setActiveView("graph")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "graph" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Graphique Sondes A, B, C"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sondes v(t)</span>
          </button>
        </div>
      </div>

      {/* ── ZONE DE RENDU 3D (ONDE GÉANTE & CONDUCTEUR LISIBLE) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[230px] sm:h-[250px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {activeView === "3d" ? (
          <>
            {/* Badge d'état minimaliste en haut à gauche */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isARQS ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span className="text-[10.5px] text-white font-bold">{currentPreset.fullLabel}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isARQS ? "text-emerald-400 bg-emerald-500/15" : "text-rose-400 bg-rose-500/15"
                }`}>
                  {isARQS ? "ARQS Valide" : "Non Valide"}
                </span>
              </div>
            </div>

            <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 1.4, 6.2], fov: 36 }} className="w-full h-full">
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.7} />
              <spotLight position={[0, 8, 4]} intensity={1.6} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
              
              <WaveConductorSystem 
                freqLevel={freqLevel}
                isPlaying={isPlaying} 
                showRadiation={showRadiation}
              />
              
              <ContactShadows resolution={256} scale={10} blur={2} opacity={0.35} far={4} color="#0f172a" position={[0, -0.7, 0]} />
            </Canvas>
          </>
        ) : (
          <VoltageMultiProbeGraph isARQS={isARQS} freqLevel={freqLevel} />
        )}
      </div>

      {/* ── LÉGENDE EXPLICATIVE SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px]">
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-sky-600" />
            <span>Générateur (Entrée)</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Sonde A</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Sonde B</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Sonde C</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-amber-600" />
            <span>Récepteur (Sortie)</span>
          </span>
        </div>

        <span className="text-[10.5px] font-mono text-slate-400">
          Longueur d&apos;onde λ = <strong className="text-sky-400">{currentPreset.lambda}</strong>
        </span>
      </div>

      {/* ── BARRE DE CONTRÔLE AVEC SLIDER ── */}
      <div className="w-full bg-card/80 border border-border/80 p-2 rounded-xl flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex-1 min-w-[180px] flex flex-col gap-0.5">
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
