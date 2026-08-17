"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Cylinder, Ring, Environment, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity, Layers, Zap, Info } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── PRESETS RÉELS DE FRÉQUENCES ──
const FREQ_PRESETS = [
  { id: 1, label: "50 Hz (Réseau)", fStr: "50 Hz", deltaStr: "9.3 mm", deltaRatio: 1.0, isTotal: true, desc: "Courant uniforme dans toute la section (δ > R)" },
  { id: 2, label: "10 kHz (Audio)", fStr: "10 kHz", deltaStr: "660 µm", deltaRatio: 0.55, isTotal: false, desc: "Le centre commence à faiblir (δ ≈ R/2)" },
  { id: 3, label: "1 MHz (Radio AM)", fStr: "1 MHz", deltaStr: "66 µm", deltaRatio: 0.28, isTotal: false, desc: "Courant concentré sur l'anneau extérieur (δ ≈ R/4)" },
  { id: 4, label: "100 MHz (FM / GHz)", fStr: "100 MHz", deltaStr: "6.6 µm", deltaRatio: 0.12, isTotal: false, desc: "Effet pelliculaire total : cœur inactif (δ ≪ R)" },
];

// ── 1. MODÈLE 3D : COUPE DU CONDUCTEUR AVEC ÉPAISSEUR DE PEAU δ ──
const ConductorCrossSection3D = ({ 
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
    if (isPlaying) setTime((t) => t + delta * 3.5);
  });

  const R = 2.0; // Rayon du conducteur
  const wireLength = 4.2;
  const innerR = isTotal ? 0 : R * (1 - deltaRatio);

  // Particules de courant circulant uniquement dans la zone active (entre innerR et R)
  const numParticles = 40;
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < numParticles; i++) {
      const theta = (i / numParticles) * Math.PI * 2 + (i % 3) * 0.4;
      // Rayon aléatoire entre innerR et R
      const rVal = isTotal 
        ? Math.sqrt(Math.random()) * R 
        : innerR + Math.random() * (R - innerR);
      
      pts.push({ r: rVal, theta, speed: 0.8 + Math.random() * 0.4, offsetZ: (i / numParticles) * wireLength });
    }
    return pts;
  }, [deltaRatio, isTotal, innerR, R, wireLength]);

  return (
    <group position={[0, -0.1, 0]}>
      
      {/* ── CÂBLE CYLINDRIQUE EN COUPE TRANSVERSALE ── */}
      {/* Corps du câble en cuivre */}
      <Cylinder args={[R, R, wireLength, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.7} 
          roughness={0.4} 
          transparent 
          opacity={0.35} 
        />
      </Cylinder>

      {/* Disque de coupe avant : Face d'entrée avec zone active dorée et centre inactif */}
      <group position={[0, 0, wireLength / 2 + 0.01]}>
        {/* Zone centrale sombre (inactive si haute fréquence) */}
        {!isTotal && (
          <mesh>
            <circleGeometry args={[innerR, 32]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        )}

        {/* Anneau actif lumineux de conduction (Épaisseur de peau δ) */}
        <mesh>
          <ringGeometry args={[isTotal ? 0 : innerR, R, 32]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            emissive="#f59e0b" 
            emissiveIntensity={0.6 + 0.3 * Math.sin(time)} 
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ── PARTICULES DE FLUX DE COURANT (FLÈCHES LUMINEUSES) ── */}
      {particles.map((p, idx) => {
        const zPos = -wireLength / 2 + ((p.offsetZ + time * p.speed) % wireLength);
        const xPos = p.r * Math.cos(p.theta);
        const yPos = p.r * Math.sin(p.theta);

        return (
          <Sphere key={idx} args={[0.05, 10, 10]} position={[xPos, yPos, zPos]}>
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.9} />
          </Sphere>
        );
      })}

      {/* ── COTE DE L'ÉPAISSEUR DE PEAU δ SUR LA FACE AVANT ── */}
      {!isTotal && (
        <group position={[0, 0, wireLength / 2 + 0.05]}>
          {/* Ligne repère pour l'épaisseur delta */}
          <mesh position={[innerR + (R - innerR) / 2, 0, 0]}>
            <boxGeometry args={[R - innerR, 0.04, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ── 2. GRAPHIQUE 2D DU PROFIL DE DENSITÉ RADIALE j(r) ──
const RadialDensityProfileGraph = ({ deltaRatio, isTotal }: { deltaRatio: number; isTotal: boolean }) => {
  const width = 440;
  const height = 130;
  const points: string[] = [];

  // j(r) = j0 * exp(-(R - r)/delta)
  const R_pixels = 160;
  const startX = 60; // Axe r=0 au centre du fil
  const endX = startX + R_pixels; // Bord du fil r=R

  const delta_pixels = isTotal ? R_pixels * 5 : R_pixels * deltaRatio;

  for (let x = startX; x <= endX; x += 3) {
    const r = x - startX;
    const distFromSurface = R_pixels - r;
    const jNorm = Math.exp(-distFromSurface / delta_pixels);
    const y = height - 20 - jNorm * 85;
    points.push(`${x},${y}`);
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between text-[10.5px]">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Profil Radial de Densité : <LatexMath math="j(r) = j_0 \, e^{-(R-r)/\delta}" /></span>
        </span>

        <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
          {isTotal ? "j(r) ≈ Constante (Uniforme)" : "Atténuation Exponentielle"}
        </span>
      </div>

      <svg className="w-full h-24 my-1 bg-slate-900/70 rounded-xl border border-slate-800" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Axes */}
        <line x1={startX} y1={height - 20} x2={endX + 30} y2={height - 20} stroke="#475569" strokeWidth="1.5" />
        <line x1={startX} y1={height - 20} x2={startX} y2={15} stroke="#475569" strokeWidth="1.5" />

        {/* Labels Axes */}
        <text x={startX - 15} y={height - 18} fill="#94a3b8" fontSize="9" fontWeight="bold">r=0</text>
        <text x={endX - 8} y={height - 8} fill="#f59e0b" fontSize="9" fontWeight="bold">r=R (Bord)</text>
        <text x={startX - 35} y={25} fill="#38bdf8" fontSize="9" fontWeight="bold">j(r)</text>

        {/* Zone sous la courbe */}
        <polygon 
          points={`${startX},${height-20} ${points.join(" ")} ${endX},${height-20}`} 
          fill="rgba(245, 158, 11, 0.18)" 
        />

        {/* Tracé de la courbe j(r) */}
        <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points={points.join(" ")} />
      </svg>

      <p className="text-[10px] text-slate-400 text-center leading-tight">
        {isTotal 
          ? "À 50 Hz, le courant remplit tout le conducteur de manière homogène (j constant de r=0 à r=R)."
          : "À haute fréquence, le courant au cœur (r=0) est presque NUL. Toute l'énergie passe par la peau périphérique (r ≈ R)."
        }
      </p>
    </div>
  );
};

export default function SkinEffect3DCanvas() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"3d" | "graph">("3d");

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentPreset = FREQ_PRESETS.find(p => p.id === selectedId) || FREQ_PRESETS[0];

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── ONGLETS DE SÉLECTION DE FRÉQUENCE ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          <span className="text-[11px] font-bold text-muted-foreground px-1 hidden sm:inline">
            Fréquence :
          </span>
          {FREQ_PRESETS.map((p) => {
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
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

        {/* Boutons de bascule Vue 3D vs Profil Graphique */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            onClick={() => setActiveView("3d")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "3d" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Vue 3D Coupe du Conducteur"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Coupe 3D</span>
          </button>
          <button
            onClick={() => setActiveView("graph")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "graph" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Graphique Profil de Densité j(r)"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Profil j(r)</span>
          </button>
        </div>
      </div>

      {/* ── ZONE DE RENDU COMPACTE (HAUTEUR 230px - 250px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[230px] sm:h-[250px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {activeView === "3d" ? (
          <>
            {/* Badge Info Compact */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none max-w-[240px]">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Épaisseur de Peau</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    δ = {currentPreset.deltaStr}
                  </span>
                </div>
                <div className="text-white font-bold">{currentPreset.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{currentPreset.desc}</div>
              </div>
            </div>

            <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [2.8, 2.5, 4.8], fov: 38 }} className="w-full h-full">
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.7} />
              <spotLight position={[5, 8, 5]} intensity={1.8} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
              
              <ConductorCrossSection3D 
                deltaRatio={currentPreset.deltaRatio} 
                isPlaying={isPlaying} 
                isTotal={currentPreset.isTotal} 
              />
              
              <ContactShadows resolution={256} scale={10} blur={2} opacity={0.35} far={4} color="#0f172a" position={[0, -1.8, 0]} />
            </Canvas>
          </>
        ) : (
          <RadialDensityProfileGraph 
            deltaRatio={currentPreset.deltaRatio} 
            isTotal={currentPreset.isTotal} 
          />
        )}
      </div>

      {/* ── LÉGENDE DU SCHÉMA SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Zone de Conduction Active (Épaisseur <LatexMath math="\delta" />)</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <span>Cœur Inactif (Courant Nul)</span>
          </span>
        </div>

        <span className="text-[10.5px] font-mono text-amber-400 font-bold">
          <LatexMath math="\delta = \sqrt{2/(\mu_0 \gamma \omega)}" />
        </span>
      </div>

      {/* ── CONTRÔLE LECTURE ── */}
      {activeView === "3d" && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-1.5 bg-card hover:bg-muted text-foreground rounded-lg border border-border/80 transition-colors text-xs flex items-center gap-1.5"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? "Pause" : "Lancer le flux"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
