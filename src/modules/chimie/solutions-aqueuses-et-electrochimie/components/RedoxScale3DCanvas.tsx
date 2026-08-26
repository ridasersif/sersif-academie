"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { Zap, AlertTriangle, ArrowRight, Activity } from "lucide-react";

// Standard Reduction Potentials (V)
const redoxCouples = [
  { ox: "F₂", red: "F⁻", e: 2.87, color: "#fef08a" },
  { ox: "MnO₄⁻", red: "Mn²⁺", e: 1.51, color: "#d946ef" },
  { ox: "Cl₂", red: "Cl⁻", e: 1.36, color: "#a3e635" },
  { ox: "O₂", red: "H₂O", e: 1.23, color: "#38bdf8" },
  { ox: "Ag⁺", red: "Ag", e: 0.80, color: "#cbd5e1" },
  { ox: "Fe³⁺", red: "Fe²⁺", e: 0.77, color: "#f97316" },
  { ox: "I₂", red: "I⁻", e: 0.54, color: "#9333ea" },
  { ox: "Cu²⁺", red: "Cu", e: 0.34, color: "#f59e0b" },
  { ox: "H⁺", red: "H₂", e: 0.00, color: "#ffffff" },
  { ox: "Pb²⁺", red: "Pb", e: -0.13, color: "#94a3b8" },
  { ox: "Ni²⁺", red: "Ni", e: -0.25, color: "#10b981" },
  { ox: "Fe²⁺", red: "Fe", e: -0.44, color: "#78716c" },
  { ox: "Zn²⁺", red: "Zn", e: -0.76, color: "#94a3b8" },
  { ox: "Al³⁺", red: "Al", e: -1.66, color: "#e2e8f0" },
  { ox: "Na⁺", red: "Na", e: -2.71, color: "#fbbf24" },
  { ox: "Li⁺", red: "Li", e: -3.04, color: "#f87171" }
];

const Scale3D = ({ 
  selectedOx, 
  selectedRed 
}: { 
  selectedOx: string | null; 
  selectedRed: string | null;
}) => {
  const yOffset = 0;
  const yScale = 2; // stretch the scale vertically

  const oxData = redoxCouples.find(c => c.ox === selectedOx);
  const redData = redoxCouples.find(c => c.red === selectedRed);

  return (
    <group position={[0, yOffset, 0]}>
      {/* Central Axis */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 14, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Labels for Axis (E° V) */}
      <Text position={[0, 7.5, 0]} fontSize={0.3} color="#94a3b8" anchorX="center" anchorY="bottom">
        E° (V)
      </Text>

      {/* Render all couples on the scale */}
      {redoxCouples.map((couple, i) => {
        const yPos = couple.e * yScale;
        const isSelectedOx = couple.ox === selectedOx;
        const isSelectedRed = couple.red === selectedRed;
        
        return (
          <group key={i} position={[0, yPos, 0]}>
            {/* Tick mark */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
              <meshBasicMaterial color={couple.color} />
            </mesh>

            {/* Oxidant Text (Left) */}
            <Text 
              position={[-1.2, 0, 0]} 
              fontSize={isSelectedOx ? 0.25 : 0.15} 
              color={isSelectedOx ? "#f43f5e" : "#cbd5e1"} 
              anchorX="right" 
              anchorY="middle"
              fontWeight={isSelectedOx ? "bold" : "normal"}
            >
              {couple.ox}
            </Text>
            
            {/* Reductant Text (Right) */}
            <Text 
              position={[1.2, 0, 0]} 
              fontSize={isSelectedRed ? 0.25 : 0.15} 
              color={isSelectedRed ? "#3b82f6" : "#cbd5e1"} 
              anchorX="left" 
              anchorY="middle"
              fontWeight={isSelectedRed ? "bold" : "normal"}
            >
              {couple.red}
            </Text>

            {/* E° Value */}
            <Text 
              position={[0, 0.2, 0]} 
              fontSize={0.12} 
              color="#64748b" 
              anchorX="center" 
              anchorY="bottom"
            >
              {couple.e > 0 ? `+${couple.e.toFixed(2)}` : couple.e.toFixed(2)} V
            </Text>
          </group>
        );
      })}

      {/* Gamma Rule Visualization */}
      {oxData && redData && (
        <GammaRule oxData={oxData} redData={redData} yScale={yScale} />
      )}
    </group>
  );
};

// Gamma Rule Animated SVG-like Line in 3D
const GammaRule = ({ oxData, redData, yScale }: { oxData: any, redData: any, yScale: number }) => {
  const lineRef = useRef<THREE.Line2>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    setProgress((p) => (p + delta * 1.5) % 2); // Loop animation
  });

  const oxY = oxData.e * yScale;
  const redY = redData.e * yScale;
  const isSpontaneous = oxY > redY; // E_ox > E_red
  
  // Gamma shape points
  // 1. Start at Oxidant
  // 2. Go to Reductant of same couple
  // 3. Go to Reductant of second couple
  // 4. Go to Oxidant of second couple
  
  const p1 = new THREE.Vector3(-1, oxY, 0.1); // Ox1
  const p2 = new THREE.Vector3(1, oxY, 0.1);  // Red1
  const p3 = new THREE.Vector3(1, redY, 0.1); // Red2
  const p4 = new THREE.Vector3(-1, redY, 0.1); // Ox2
  
  const points = [p1, p2, p3, p4];

  return (
    <group>
      {/* The base Gamma Rule Shape */}
      <Line
        points={points}
        color={isSpontaneous ? "#10b981" : "#ef4444"}
        lineWidth={3}
        dashed={!isSpontaneous}
        dashScale={2}
      />
      
      {/* Animated Electron Transfer particle */}
      {isSpontaneous && (
        <mesh position={new THREE.Vector3().lerpVectors(p1, p3, progress > 1 ? 1 : progress)}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#fcd34d" />
        </mesh>
      )}
    </group>
  );
};


export default function RedoxScale3DCanvas() {
  const [selectedOx, setSelectedOx] = useState<string>("Cu²⁺");
  const [selectedRed, setSelectedRed] = useState<string>("Zn");

  const oxData = redoxCouples.find(c => c.ox === selectedOx);
  const redData = redoxCouples.find(c => c.red === selectedRed);
  
  const isSpontaneous = oxData && redData && oxData.e > redData.e;
  const deltaE = oxData && redData ? (oxData.e - redData.e).toFixed(2) : "0.00";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col md:flex-row h-[700px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full md:w-[60%] h-1/2 md:h-full border-b md:border-b-0 md:border-r border-border/50 bg-gradient-to-t from-slate-950 to-[#0f172a]">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <Scale3D selectedOx={selectedOx} selectedRed={selectedRed} />
          <OrbitControls 
            enableZoom={true} 
            enableRotate={false} 
            enablePan={true}
            minDistance={4} 
            maxDistance={12} 
            target={[0, 0, 0]}
          />
        </Canvas>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Thermodynamique</span>
          </div>
          
          <div className="flex justify-between items-center gap-4 mt-2">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">ΔE° = E°(Ox) - E°(Red)</span>
              <div className={`text-lg font-mono font-black ${isSpontaneous ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Number(deltaE) > 0 ? '+' : ''}{deltaE} V
              </div>
            </div>
            {isSpontaneous ? (
              <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
                Réaction Spontanée
              </div>
            ) : (
              <div className="px-2 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold uppercase">
                Impossible
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex-1 flex flex-col bg-slate-900/40 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
            Prévision (Règle du Gamma)
          </h3>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Sélectionnez un oxydant et un réducteur pour vérifier si la réaction entre eux est thermodynamiquement possible. 
          L'oxydant le plus fort (en haut à gauche) réagit avec le réducteur le plus fort (en bas à droite).
        </p>

        <div className="space-y-6 flex-1">
          {/* Oxydant Selector */}
          <div className="space-y-2 p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
            <label className="text-xs font-bold text-rose-400 flex items-center gap-2">
              Choix de l'Oxydant (capte des e⁻) :
            </label>
            <select 
              className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500 transition-colors"
              value={selectedOx}
              onChange={(e) => setSelectedOx(e.target.value)}
            >
              {redoxCouples.map(c => (
                <option key={`ox-${c.ox}`} value={c.ox}>{c.ox} (E° = {c.e.toFixed(2)} V)</option>
              ))}
            </select>
          </div>

          {/* Reductant Selector */}
          <div className="space-y-2 p-4 bg-blue-950/20 border border-blue-500/20 rounded-2xl">
            <label className="text-xs font-bold text-blue-400 flex items-center gap-2">
              Choix du Réducteur (cède des e⁻) :
            </label>
            <select 
              className="w-full bg-slate-950 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500 transition-colors"
              value={selectedRed}
              onChange={(e) => setSelectedRed(e.target.value)}
            >
              {redoxCouples.map(c => (
                <option key={`red-${c.red}`} value={c.red}>{c.red} (E° = {c.e.toFixed(2)} V)</option>
              ))}
            </select>
          </div>

          {/* Equation Bilan */}
          <div className="mt-auto p-4 bg-black/40 border border-border/40 rounded-xl text-center">
            <h4 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
              Équation Bilan
            </h4>
            {isSpontaneous ? (
              <div className="text-sm font-mono text-foreground font-bold tracking-tight">
                {oxData?.ox} + {redData?.red} <span className="text-emerald-500 mx-2">→</span> {oxData?.red} + {redData?.ox}
              </div>
            ) : (
              <div className="text-xs text-rose-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pas de réaction (sens inverse)
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
