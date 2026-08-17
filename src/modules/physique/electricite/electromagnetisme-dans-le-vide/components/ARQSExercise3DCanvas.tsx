"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Cylinder, Environment, Sphere, Box, Line } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity, Sliders, CheckCircle2, AlertTriangle, Sparkles, Radio } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── EXPÉRIENCES DU BANC D'ESSAI ──
const EXPERIMENTS = [
  { 
    id: 1, 
    title: "Expérience 1 : Basse Fréquence (f = 100 kHz)",
    freqStr: "100 kHz",
    freqVal: 1e5,
    lambdaStr: "3 000 m",
    lambdaVal: 3000,
    L: 10,
    isARQS: true,
    deltaT: "33.3 ns",
    deltaPhi: "1.2° (Négligeable)",
    verdict: "ARQS 100% Valide : Signaux CH1 et CH2 parfaitement synchrones",
  },
  { 
    id: 2, 
    title: "Expérience 2 : Moyenne Fréquence (f = 5 MHz)",
    freqStr: "5 MHz",
    freqVal: 5e6,
    lambdaStr: "60 m",
    lambdaVal: 60,
    L: 10,
    isARQS: true,
    deltaT: "33.3 ns",
    deltaPhi: "60° (Limite ARQS)",
    verdict: "ARQS Limite : Léger déphasage visible sur l'oscilloscope",
  },
  { 
    id: 3, 
    title: "Expérience 3 : Haute Fréquence (f = 30 MHz)",
    freqStr: "30 MHz",
    freqVal: 3e7,
    lambdaStr: "10 m",
    lambdaVal: 10,
    L: 10,
    isARQS: false,
    deltaT: "33.3 ns",
    deltaPhi: "360° (1 cycle de retard)",
    verdict: "ARQS Brisé : L = λ, l'onde met une période entière à traverser",
  },
  { 
    id: 4, 
    title: "Expérience 4 : Hyperfréquence (f = 150 MHz)",
    freqStr: "150 MHz",
    freqVal: 1.5e8,
    lambdaStr: "2 m",
    lambdaVal: 2,
    L: 10,
    isARQS: false,
    deltaT: "33.3 ns",
    deltaPhi: "1800° (5 longueurs d'onde)",
    verdict: "ARQS Totalement Invalide : Ligne de propagation avec multiples nœuds",
  },
];

// ── 1. MODÈLE 3D DU BANC DE LABORATOIRE (GBF + LIGNE + CHARGE) ──
const LabBench3D = ({ 
  exp, 
  isPlaying 
}: { 
  exp: typeof EXPERIMENTS[0]; 
  isPlaying: boolean;
}) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.5);
  });

  const wireLength = 5.2;
  const startX = -wireLength / 2;
  const kSpatial = (2 * Math.PI * (exp.L / exp.lambdaVal)) / wireLength;

  // Points de l'onde se propageant le long de la ligne
  const wavePoints = useMemo(() => {
    const pts = [];
    const numPts = 90;
    for (let i = 0; i <= numPts; i++) {
      const x = startX + (i / numPts) * wireLength;
      const phase = kSpatial * (x - startX) - time;
      const y = 0.5 + Math.sin(phase) * (exp.isARQS ? 0.25 : 0.45);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [startX, wireLength, kSpatial, time, exp.isARQS]);

  // Particules d'énergie se déplaçant du GBF vers la charge
  const numParticles = 8;
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < numParticles; i++) {
      const progress = ((time * 0.4 + i / numParticles) % 1);
      const x = startX + progress * wireLength;
      const phase = kSpatial * (x - startX) - time;
      const y = 0.5 + Math.sin(phase) * (exp.isARQS ? 0.25 : 0.45);
      pts.push({ x, y });
    }
    return pts;
  }, [time, startX, wireLength, kSpatial, exp.isARQS]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* Table de laboratoire (Support) */}
      <Box args={[6.8, 0.12, 2.6]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
      </Box>

      {/* ── 1. GÉNÉRATEUR GBF (GAUCHE) ── */}
      <group position={[-3.0, 0, 0]}>
        <Box args={[0.9, 0.9, 0.9]}>
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Écran d'affichage du GBF */}
        <Box args={[0.6, 0.35, 0.02]} position={[0, 0.12, 0.46]}>
          <meshBasicMaterial color="#0f172a" />
        </Box>
        {/* Boutons du GBF */}
        <Cylinder args={[0.06, 0.06, 0.05, 12]} rotation={[Math.PI / 2, 0, 0]} position={[-0.2, -0.22, 0.46]}>
          <meshStandardMaterial color="#38bdf8" />
        </Cylinder>
        <Cylinder args={[0.06, 0.06, 0.05, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0.2, -0.22, 0.46]}>
          <meshStandardMaterial color="#f59e0b" />
        </Cylinder>
      </group>

      {/* ── 2. CHARGE / LAMPE TÉMOIN (DROITE) ── */}
      <group position={[3.0, 0, 0]}>
        <Box args={[0.8, 0.7, 0.8]}>
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </Box>
        {/* Lampe témoin qui brille */}
        <Sphere args={[0.22, 16, 16]} position={[0, 0.5, 0]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#f59e0b" 
            emissiveIntensity={exp.isARQS ? 1.0 : 0.5} 
          />
        </Sphere>
      </group>

      {/* ── 3. LIGNE BIFILAIRE / CÂBLE CONDUCTEUR ── */}
      {/* Fil aller */}
      <Cylinder args={[0.05, 0.05, wireLength, 24]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0.2]}>
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </Cylinder>
      {/* Fil retour */}
      <Cylinder args={[0.05, 0.05, wireLength, 24]} rotation={[0, 0, Math.PI / 2]} position={[0, -0.1, -0.2]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* ── 4. TRACÉ DE L'ONDE PROGRESSIVE ── */}
      <Line points={wavePoints} color={exp.isARQS ? "#38bdf8" : "#f43f5e"} lineWidth={3.5} />

      {/* Particules d'énergie circulant le long de l'onde */}
      {particles.map((pt, idx) => (
        <Sphere key={idx} args={[0.07, 10, 10]} position={[pt.x, pt.y, 0]}>
          <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={1.5} />
        </Sphere>
      ))}

      {/* ── 5. SONDES DE MESURE CH1 (ENTRÉE) & CH2 (SORTIE) ── */}
      {/* Sonde 1 (CH1 - Bleu Ciel à l'entrée x = 0) */}
      <group position={[startX + 0.2, 0.1, 0.2]}>
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </Sphere>
        <Line points={[[0, 0, 0], [0, 0.7, 0]]} color="#38bdf8" lineWidth={2} />
      </group>

      {/* Sonde 2 (CH2 - Ambre / Jaune à la sortie x = L) */}
      <group position={[-startX - 0.2, 0.1, 0.2]}>
        <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
        </Sphere>
        <Line points={[[0, 0, 0], [0, 0.7, 0]]} color="#f59e0b" lineWidth={2} />
      </group>

      {/* Cote de longueur de la ligne L */}
      <group position={[0, -0.4, 0]}>
        <Line points={[[-wireLength / 2, 0, 0], [wireLength / 2, 0, 0]]} color="#94a3b8" lineWidth={1.5} />
        <mesh position={[-wireLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.04, 0.1, 8]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[wireLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.04, 0.1, 8]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      </group>
    </group>
  );
};

// ── 2. ÉCRAN DE L'OSCILLOSCOPE TEMPS RÉEL CH1 (ENTRÉE) vs CH2 (SORTIE) ──
const LiveOscilloscopeScreen = ({ exp }: { exp: typeof EXPERIMENTS[0] }) => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setT(prev => prev + 0.08);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const width = 460;
  const height = 130;
  const pointsCH1: string[] = [];
  const pointsCH2: string[] = [];

  // Déphasage réel DeltaPhi = 2 * PI * (L / lambda)
  const phaseShift = (2 * Math.PI * (exp.L / exp.lambdaVal));

  for (let x = 0; x <= width; x += 4) {
    const angle = (x / 40) - t;
    const y1 = height / 2 - Math.sin(angle) * 45;
    const y2 = height / 2 - Math.sin(angle - phaseShift) * 45;
    pointsCH1.push(`${x},${y1}`);
    pointsCH2.push(`${x},${y2}`);
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950 rounded-2xl border border-slate-800">
      {/* Entête Oscilloscope */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sky-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Voie 1 (CH1) : Entrée <LatexMath math="v(0, t)" /></span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Voie 2 (CH2) : Sortie <LatexMath math="v(L, t)" /></span>
          </span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          exp.isARQS 
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
        }`}>
          Déphasage <LatexMath math="\Delta\varphi" /> = {exp.deltaPhi}
        </span>
      </div>

      {/* Écran SVG Grille d'Oscilloscope */}
      <svg className="w-full h-24 my-1 bg-[#021526] rounded-xl border border-emerald-500/30 shadow-inner" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grille millimétrée typique oscilloscope */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v-${i}`} x1={(width / 8) * i} y1={0} x2={(width / 8) * i} y2={height} stroke="#04385a" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={(height / 4) * i} x2={width} y2={(height / 4) * i} stroke="#04385a" strokeWidth="0.5" />
        ))}
        {/* Axe central 0V */}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />

        {/* Tracé Voie 1 CH1 (Bleu Ciel) */}
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={pointsCH1.join(" ")} />

        {/* Tracé Voie 2 CH2 (Jaune/Ambre) */}
        <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray={exp.isARQS ? "none" : "5 3"} points={pointsCH2.join(" ")} />
      </svg>

      {/* Mesures numériques de l'oscilloscope */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
        <span>Fréquence : <strong className="text-white">{exp.freqStr}</strong></span>
        <span>Retard de propagation : <strong className="text-sky-400">\tau = L/c = {exp.deltaT}</strong></span>
        <span>Rapport <LatexMath math="L/\lambda" /> = <strong className={exp.isARQS ? "text-emerald-400" : "text-rose-400"}>{(exp.L / exp.lambdaVal).toFixed(2)}</strong></span>
      </div>
    </div>
  );
};

export default function ARQSExercise3DCanvas() {
  const [selectedExpId, setSelectedExpId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"3d" | "scope">("3d");

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentExp = EXPERIMENTS.find(e => e.id === selectedExpId) || EXPERIMENTS[0];

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── SÉLECTEUR D'EXPÉRIENCES EN 1 CLIC ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          <span className="text-[11px] font-bold text-muted-foreground px-1 hidden sm:inline">
            Fréquence du GBF :
          </span>
          {EXPERIMENTS.map((e) => {
            const isSelected = e.id === selectedExpId;
            return (
              <button
                key={e.id}
                onClick={() => setSelectedExpId(e.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? e.isARQS
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-xs"
                    : "bg-background hover:bg-muted text-muted-foreground border-border/60"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${e.isARQS ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span>{e.freqStr}</span>
              </button>
            );
          })}
        </div>

        {/* Boutons de bascule Vue 3D Banc vs Vue Oscilloscope */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            onClick={() => setActiveView("3d")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "3d" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Vue 3D Banc de Laboratoire"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Banc 3D</span>
          </button>
          <button
            onClick={() => setActiveView("scope")}
            className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
              activeView === "scope" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
            title="Oscilloscope Voie 1 vs Voie 2"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Oscilloscope</span>
          </button>
        </div>
      </div>

      {/* ── ZONE DE RENDU COMPACTE (HAUTEUR 220px - 240px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[220px] sm:h-[240px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {activeView === "3d" ? (
          <>
            {/* Badge Info Contextuel */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none max-w-[280px]">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Banc d&apos;Essai L = 10 m</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    currentExp.isARQS 
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                      : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  }`}>
                    {currentExp.isARQS ? "ARQS Valide" : "ARQS Invalide"}
                  </span>
                </div>

                <div className="text-white font-bold">{currentExp.title}</div>
                <div className="text-[10px] text-sky-400 font-mono">
                  Longueur d&apos;onde λ = {currentExp.lambdaStr}
                </div>
              </div>
            </div>

            <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 2.0, 5.2], fov: 38 }} className="w-full h-full">
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.8} />
              <spotLight position={[0, 8, 4]} intensity={1.8} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
              
              <LabBench3D exp={currentExp} isPlaying={isPlaying} />
              
              <ContactShadows resolution={256} scale={8} blur={2} opacity={0.4} far={4} color="#0f172a" position={[0, -0.9, 0]} />
            </Canvas>
          </>
        ) : (
          <LiveOscilloscopeScreen exp={currentExp} />
        )}
      </div>

      {/* ── LÉGENDE PÉDAGOGIQUE DU BANC SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-sky-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Sonde CH1 : Entrée GBF</span>
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Sonde CH2 : Sortie Charge</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-sky-600" />
            <span>Générateur GBF</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-amber-500" />
            <span>Charge / Lampe</span>
          </span>
        </div>

        <span className="text-[10.5px] font-bold text-foreground">
          {currentExp.verdict}
        </span>
      </div>

      {/* ── BOUTON CONTRÔLE ANIMATION ── */}
      {activeView === "3d" && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="p-1.5 bg-card hover:bg-muted text-foreground rounded-lg border border-border/80 transition-colors text-xs flex items-center gap-1.5"
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? "Pause" : "Lancer l'onde"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
