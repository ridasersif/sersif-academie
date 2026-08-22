/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Cylinder, Environment, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity, Layers, Sparkles, RefreshCw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── PRESETS RÉELS DE FRÉQUENCES ──
const FREQ_PRESETS = [
  { id: 1, label: "50 Hz (Réseau)", deltaStr: "9.3 mm", deltaRatio: 1.0, isTotal: true, desc: "Basse fréquence : Le courant traverse 100% de la section du fil" },
  { id: 2, label: "10 kHz (Audio)", deltaStr: "660 µm", deltaRatio: 0.55, isTotal: false, desc: "Moyenne fréquence : Le courant commence à fuir le centre" },
  { id: 3, label: "1 MHz (Radio AM)", deltaStr: "66 µm", deltaRatio: 0.28, isTotal: false, desc: "Haute fréquence : Seul l'anneau extérieur conduit" },
  { id: 4, label: "100 MHz (FM / GHz)", deltaStr: "6.6 µm", deltaRatio: 0.10, isTotal: false, desc: "Hyperfréquence : Effet de peau total, cœur 100% inactif" },
];

// ── 1. MODÈLE 3D : CÂBLE TRANSPARENT + FLUX DE COURANT INTERNE ──
const SkinEffectWire3D = ({ 
  deltaRatio, 
  isPlaying, 
  isTotal 
}: { 
  deltaRatio: number; 
  isPlaying: boolean; 
  isTotal: boolean;
}) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.0);
  });

  const R = 1.35;
  const wireLength = 4.0;
  const innerR = isTotal ? 0 : R * (1 - deltaRatio);

  // 3 anneaux concentriques de flux de courant
  const streamRings = useMemo(() => {
    return [
      { r: R * 0.2, label: "Cœur" },
      { r: R * 0.55, label: "Milieu" },
      { r: R * 0.9, label: "Peau" },
    ];
  }, [R]);

  // Particules animées
  const numParticles = 45;
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < numParticles; i++) {
      const theta = (i / numParticles) * Math.PI * 2 + (i % 4) * 0.5;
      const rFraction = isTotal 
        ? Math.sqrt((i + 1) / numParticles) * R * 0.95
        : innerR + Math.random() * (R * 0.95 - innerR);

      pts.push({
        r: rFraction,
        theta,
        speed: 0.8 + Math.random() * 0.4,
        offsetZ: (i / numParticles) * wireLength,
      });
    }
    return pts;
  }, [isTotal, innerR, R, wireLength]);

  return (
    <group position={[0, 0, 0]}>
      
      {/* ── ENVELOPPE EXTÉRIEURE DU CONDUCTEUR EN CUIVRE TRANSPARENT ── */}
      <Cylinder args={[R, R, wireLength, 36]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color="#d97706" 
          metalness={0.7} 
          roughness={0.3} 
          transparent 
          opacity={0.3} 
        />
      </Cylinder>

      {/* Cercles de délimitation de la section d'entrée et de sortie */}
      {[-wireLength / 2, wireLength / 2].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Cercle extérieur */}
          <mesh>
            <ringGeometry args={[R - 0.02, R, 36]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          
          {/* Cercle intérieur d'épaisseur de peau delta */}
          {!isTotal && (
            <mesh>
              <ringGeometry args={[innerR - 0.02, innerR, 36]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          )}

          {/* Surface active qui brille */}
          <mesh>
            <ringGeometry args={[isTotal ? 0 : innerR, R, 36]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#f59e0b" 
              emissiveIntensity={0.6 + 0.3 * Math.sin(time * 2)} 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        </group>
      ))}

      {/* ── CŒUR INACTIF (CYLINDRE SOMBRE AU CENTRE QUAND HAUTE FRÉQUENCE) ── */}
      {!isTotal && innerR > 0.05 && (
        <Cylinder args={[innerR, innerR, wireLength * 0.98, 28]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial 
            color="#020617" 
            metalness={0.2} 
            roughness={0.9} 
            transparent 
            opacity={0.7} 
          />
        </Cylinder>
      )}

      {/* ── PARTICULES DE CHARGES EN MOUVEMENT DANS LA ZONE ACTIVE ── */}
      {particles.map((p, idx) => {
        const xPos = -wireLength / 2 + ((p.offsetZ + time * p.speed) % wireLength);
        const yPos = p.r * Math.cos(p.theta);
        const zPos = p.r * Math.sin(p.theta);

        return (
          <Sphere key={idx} args={[0.045, 10, 10]} position={[xPos, yPos, zPos]}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#fef08a" 
              emissiveIntensity={1.2} 
            />
          </Sphere>
        );
      })}

      {/* Lignes de repère des flux de courant */}
      {streamRings.map((ring, rIdx) => {
        const isActive = isTotal || ring.r >= innerR;
        return (
          <group key={rIdx}>
            <Line 
              points={[[-wireLength / 2, ring.r, 0], [wireLength / 2, ring.r, 0]]} 
              color={isActive ? "#fbbf24" : "#334155"} 
              lineWidth={isActive ? 2 : 1} 
              dashed={!isActive}
              dashSize={0.15}
              gapSize={0.15}
            />
          </group>
        );
      })}
    </group>
  );
};

// ── 2. VUE 2D COUPE TRANSVERSALE HAUTE PRÉCISION ──
const CrossSection2DView = ({ deltaRatio, isTotal, deltaStr }: { deltaRatio: number; isTotal: boolean; deltaStr: string }) => {
  const size = 180;
  const center = size / 2;
  const R_px = 75;
  const innerR_px = isTotal ? 0 : R_px * (1 - deltaRatio);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between w-full mb-1 text-[11px]">
        <span className="font-bold text-white flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Coupe Transversale du Câble</span>
        </span>
        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Épaisseur de peau δ = {deltaStr}
        </span>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="my-1">
        {/* Disque extérieur total (Cuivre) */}
        <circle cx={center} cy={center} r={R_px} fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />

        {/* Zone active (Épaisseur delta) */}
        <circle 
          cx={center} 
          cy={center} 
          r={R_px} 
          fill="rgba(245, 158, 11, 0.45)" 
        />

        {/* Cœur inactif sombre */}
        {!isTotal && innerR_px > 0 && (
          <circle 
            cx={center} 
            cy={center} 
            r={innerR_px} 
            fill="#090d16" 
            stroke="#38bdf8" 
            strokeWidth="1.5" 
            strokeDasharray="4 2" 
          />
        )}

        {/* Flèche de cote d'épaisseur delta */}
        {!isTotal && (
          <g>
            <line x1={center + innerR_px} y1={center} x2={center + R_px} y2={center} stroke="#38bdf8" strokeWidth="2" />
            <text x={center + innerR_px + (R_px - innerR_px) / 2} y={center - 6} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              δ
            </text>
          </g>
        )}

        {/* Rayon R */}
        <line x1={center} y1={center} x2={center} y2={center - R_px} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <text x={center + 6} y={center - R_px / 2} fill="#94a3b8" fontSize="9" fontWeight="bold">R</text>

        {/* Centre r=0 */}
        <circle cx={center} cy={center} r="2.5" fill="#ffffff" />
      </svg>

      <p className="text-[10px] text-slate-400 text-center leading-tight">
        {isTotal 
          ? "À 50 Hz : Le courant traverse uniformément toute la section (Surface totale S = πR²)."
          : `À haute fréquence : Le courant est confiné dans l'anneau d'épaisseur δ (Surface utile Seff ≈ 2πR·δ).`
        }
      </p>
    </div>
  );
};

export default function SkinEffect3DCanvas() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"3d" | "2d">("3d");
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Démo automatique animée qui balaye les 4 fréquences
  useEffect(() => {
    if (!isDemoPlaying) return;
    const interval = setInterval(() => {
      setSelectedId(prev => (prev % 4) + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, [isDemoPlaying]);

  const currentPreset = FREQ_PRESETS.find(p => p.id === selectedId) || FREQ_PRESETS[0];

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── ONGLETS DE SÉLECTION DE FRÉQUENCE & BOUTON DÉMO ANIMÉE ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          {FREQ_PRESETS.map((p) => {
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setIsDemoPlaying(false);
                  setSelectedId(p.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-xs"
                    : "bg-background hover:bg-muted text-muted-foreground border-border/60"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.isTotal ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bouton Démo Animée Automatique */}
        <button
          onClick={() => setIsDemoPlaying(!isDemoPlaying)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
            isDemoPlaying 
              ? "bg-primary text-primary-foreground border-primary shadow-xs animate-pulse" 
              : "bg-muted hover:bg-muted/80 text-foreground border-border"
          }`}
          title="Lancer une démonstration automatique 50 Hz ➔ 100 MHz"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isDemoPlaying ? "Démo Active..." : "Démo Animée"}</span>
        </button>

        {/* Bascule Vue 3D vs Vue 2D Coupe */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            onClick={() => setActiveView("3d")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "3d" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Vue 3D Câble & Flux de Courant"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Vue 3D</span>
          </button>
          <button
            onClick={() => setActiveView("2d")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "2d" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Vue 2D Coupe Transversale"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Coupe 2D</span>
          </button>
        </div>
      </div>

      {/* ── ZONE DE RENDU CENTRÉE & PARFAITEMENT ÉCLAIRÉE (HAUTEUR COMPACTE 220px - 240px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[220px] sm:h-[240px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {activeView === "3d" ? (
          <>
            {/* Badge Info Minimaliste */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentPreset.isTotal ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-[10.5px] text-white font-bold">{currentPreset.label}</span>
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  δ = {currentPreset.deltaStr}
                </span>
              </div>
            </div>

            <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 2.2, 4.2], fov: 38 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.8} />
              <spotLight position={[0, 8, 4]} intensity={1.8} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
              
              <SkinEffectWire3D 
                deltaRatio={currentPreset.deltaRatio} 
                isPlaying={isPlaying} 
                isTotal={currentPreset.isTotal} 
              />
              
              <ContactShadows resolution={256} scale={8} blur={2} opacity={0.4} far={4} color="#0f172a" position={[0, -1.5, 0]} />
                        </Suspense>
          </Canvas>
          </>
        ) : (
          <CrossSection2DView 
            deltaRatio={currentPreset.deltaRatio} 
            isTotal={currentPreset.isTotal} 
            deltaStr={currentPreset.deltaStr} 
          />
        )}
      </div>

      {/* ── LÉGENDE DU SCHÉMA SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Zone de conduction active (Épaisseur <LatexMath math="\delta" />)</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-600" />
            <span>Cœur inactif (Courant nul)</span>
          </span>
        </div>

        <span className="text-[10.5px] font-mono text-amber-400 font-bold">
          <LatexMath math="\delta = \sqrt{2/(\mu_0 \gamma \omega)}" />
        </span>
      </div>

      {/* ── CONTRÔLES LECTURE ── */}
      {activeView === "3d" && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-1.5 bg-card hover:bg-muted text-foreground rounded-lg border border-border/80 transition-colors text-xs flex items-center gap-1.5"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? "Pause" : "Reprendre le flux"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
