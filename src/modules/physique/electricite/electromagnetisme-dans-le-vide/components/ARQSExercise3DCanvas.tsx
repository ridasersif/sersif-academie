"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Cylinder, Environment, Sphere, Box, Line } from "@react-three/drei";
import * as THREE from "three";
import { Train, Cpu, Activity, Play, Pause, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── 1. SCÈNE 3D POUR LA QUESTION 1 : LIGNE TGV (50 Hz, L = 40 km) ──
const TGVLineScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 2.5);
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* Rails de train */}
      <Line points={[[-3.5, -0.5, 0.4], [3.5, -0.5, 0.4]]} color="#64748b" lineWidth={2} />
      <Line points={[[-3.5, -0.5, -0.4], [3.5, -0.5, -0.4]]} color="#64748b" lineWidth={2} />

      {/* Traverses de rail */}
      {[-3, -2, -1, 0, 1, 2, 3].map((x, i) => (
        <Box key={i} args={[0.2, 0.08, 1.2]} position={[x, -0.52, 0]}>
          <meshStandardMaterial color="#334155" />
        </Box>
      ))}

      {/* Caténaire d'alimentation au-dessus */}
      <Line points={[[-3.5, 1.4, 0], [3.5, 1.4, 0]]} color="#f59e0b" lineWidth={3} />

      {/* Poteaux caténaires */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, -0.8]}>
          <Cylinder args={[0.06, 0.06, 2.0, 12]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#475569" />
          </Cylinder>
          <Line points={[[0, 1.4, 0], [0, 1.4, 0.8]]} color="#475569" lineWidth={2} />
        </group>
      ))}

      {/* Train TGV */}
      <group position={[0.5, -0.15, 0]}>
        <Box args={[2.4, 0.6, 0.7]}>
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </Box>
        {/* Nez profilé TGV */}
        <Box args={[0.6, 0.4, 0.65]} position={[1.4, -0.08, 0]}>
          <meshStandardMaterial color="#0369a1" />
        </Box>
        {/* Pantographe connecté à la caténaire */}
        <Line points={[[0.2, 0.3, 0], [0.5, 1.4, 0]]} color="#e2e8f0" lineWidth={2.5} />
      </group>

      {/* Onde de 50 Hz quasi-plate (λ = 6000 km >> 40 km) */}
      <Line 
        points={Array.from({ length: 60 }).map((_, i) => {
          const x = -3.5 + (i / 59) * 7.0;
          const y = 1.4 + Math.sin(-time) * 0.08; // Presque aucune variation spatiale
          return new THREE.Vector3(x, y, 0);
        })} 
        color="#38bdf8" 
        lineWidth={3.5} 
      />
    </group>
  );
};

// ── 2. SCÈNE 3D POUR LA QUESTION 2 : CARTE MÈRE PC (4 GHz, L = 20 cm) ──
const MotherboardScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 4.0);
  });

  const wireLength = 5.2;
  const k = 4.2; // Onde courte (λ = 7.5 cm < L = 20 cm)

  const wavePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const x = -wireLength / 2 + (i / 80) * wireLength;
      const y = 0.5 + Math.sin(k * (x + wireLength / 2) - time) * 0.45;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [time]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* Plaque Carte Mère */}
      <Box args={[6.0, 0.12, 2.8]} position={[0, -0.4, 0]}>
        <meshStandardMaterial color="#064e3b" metalness={0.6} roughness={0.4} />
      </Box>

      {/* Processeur CPU (Source Horloge 4 GHz) */}
      <group position={[-2.2, -0.15, 0]}>
        <Box args={[1.0, 0.25, 1.0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Box>
        <Sphere args={[0.08, 12, 12]} position={[0, 0.2, 0]}>
          <meshBasicMaterial color="#38bdf8" />
        </Sphere>
      </group>

      {/* Puce Mémoire RAM (Récepteur) */}
      <group position={[2.2, -0.15, 0]}>
        <Box args={[0.9, 0.2, 0.9]}>
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </Box>
      </group>

      {/* Piste de cuivre sur la carte */}
      <Line points={[[-2.2, -0.3, 0], [2.2, -0.3, 0]]} color="#f59e0b" lineWidth={4} />

      {/* Onde spatiale serrée en propagation au-dessus de la piste */}
      <Line points={wavePoints} color="#f43f5e" lineWidth={3.5} />
    </group>
  );
};

// ── 3. SCÈNE 3D POUR LA QUESTION 3 : EFFET DE PEAU DANS LE FIL DE CUIVRE ──
const SkinEffectComparisonScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.0);
  });

  const R = 1.3;
  const wireLen = 2.8;

  return (
    <group position={[0, 0, 0]}>
      {/* ── CAS A : 50 Hz (GAUCHE) ── */}
      <group position={[-1.9, 0, 0]}>
        <Cylinder args={[R, R, wireLen, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
        </Cylinder>
        {/* Face avant 100% active (or) */}
        <mesh position={[0, 0, wireLen / 2 + 0.01]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#f59e0b" 
            emissiveIntensity={0.8 + 0.2 * Math.sin(time * 2)} 
          />
        </mesh>
      </group>

      {/* ── CAS B : 10 MHz (DROITE) ── */}
      <group position={[1.9, 0, 0]}>
        <Cylinder args={[R, R, wireLen, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
        </Cylinder>
        {/* Cœur inactif sombre */}
        <mesh position={[0, 0, wireLen / 2 + 0.01]}>
          <circleGeometry args={[R * 0.88, 32]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
        {/* Fine couche périphérique active */}
        <mesh position={[0, 0, wireLen / 2 + 0.02]}>
          <ringGeometry args={[R * 0.88, R, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#f59e0b" 
            emissiveIntensity={0.9 + 0.3 * Math.sin(time * 2)} 
          />
        </mesh>
      </group>
    </group>
  );
};

export default function ARQSExercise3DCanvas() {
  const [activeQuestion, setActiveQuestion] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── SÉLECTEUR DE QUESTIONS DE L'EXERCICE ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          <button
            onClick={() => setActiveQuestion(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border flex-1 justify-center ${
              activeQuestion === 1
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs"
                : "bg-background hover:bg-muted text-muted-foreground border-border/60"
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Q1 : Ligne TGV (50 Hz)</span>
          </button>

          <button
            onClick={() => setActiveQuestion(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border flex-1 justify-center ${
              activeQuestion === 2
                ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-xs"
                : "bg-background hover:bg-muted text-muted-foreground border-border/60"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Q2 : Carte Mère PC (4 GHz)</span>
          </button>

          <button
            onClick={() => setActiveQuestion(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border flex-1 justify-center ${
              activeQuestion === 3
                ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-xs"
                : "bg-background hover:bg-muted text-muted-foreground border-border/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Q3 : Effet de Peau (50 Hz vs 10 MHz)</span>
          </button>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors shrink-0"
          title={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ── ZONE DE RENDU 3D DÉDIÉE À L'EXERCICE (HAUTEUR COMPACTE 230px - 250px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[230px] sm:h-[250px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {/* Badge Info Contextuel */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none max-w-[260px]">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1 text-[10.5px]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {activeQuestion === 1 && "Ligne TGV 50 Hz"}
                {activeQuestion === 2 && "Bus PC 4 GHz"}
                {activeQuestion === 3 && "Effet de Peau dans le Cuivre"}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                activeQuestion === 1 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : activeQuestion === 2 
                    ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}>
                {activeQuestion === 1 && "ARQS Parfaitement Valide"}
                {activeQuestion === 2 && "ARQS Invalide (Propagation)"}
                {activeQuestion === 3 && "δ50Hz = 9.3mm vs δ10MHz = 21µm"}
              </span>
            </div>

            <div className="text-white font-bold">
              {activeQuestion === 1 && "λ = 6 000 km ≫ L = 40 km"}
              {activeQuestion === 2 && "λ = 7.5 cm < L = 20 cm"}
              {activeQuestion === 3 && "Cœur inactif à 10 MHz (Résistance ×50)"}
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 2.2, 5.0], fov: 38 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.8} />
          <spotLight position={[0, 8, 4]} intensity={1.8} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
          
          {activeQuestion === 1 && <TGVLineScene isPlaying={isPlaying} />}
          {activeQuestion === 2 && <MotherboardScene isPlaying={isPlaying} />}
          {activeQuestion === 3 && <SkinEffectComparisonScene isPlaying={isPlaying} />}
          
          <ContactShadows resolution={256} scale={8} blur={2} opacity={0.35} far={4} color="#0f172a" position={[0, -1.2, 0]} />
        </Canvas>
      </div>

      {/* ── LÉGENDE DE L'EXERCICE SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        {activeQuestion === 1 && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Onde EDF 50 Hz (<LatexMath math="\lambda = 6\,000\text{ km}" />)</span>
            </span>
            <span className="text-emerald-400 font-bold">
              <LatexMath math="L/\lambda = 40 / 6000 \approx 0{,}0067 \ll 1" />
            </span>
          </div>
        )}

        {activeQuestion === 2 && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Onde d&apos;horloge 4 GHz (<LatexMath math="\lambda = 7{,}5\text{ cm}" />)</span>
            </span>
            <span className="text-rose-400 font-bold">
              <LatexMath math="L = 20\text{ cm} > \lambda = 7{,}5\text{ cm}" />
            </span>
          </div>
        )}

        {activeQuestion === 3 && (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>50 Hz : <LatexMath math="\delta = 9{,}3\text{ mm} > R" /> (100% Utile)</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>10 MHz : <LatexMath math="\delta = 21\,\mu\text{m} \ll R" /> (Pelliculaire)</span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
