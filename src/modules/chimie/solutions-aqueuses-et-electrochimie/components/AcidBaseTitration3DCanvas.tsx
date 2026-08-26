"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Play, RotateCcw, Droplet, Activity, FlaskConical } from "lucide-react";

// The magnetic stirrer bar
const StirrerBar = ({ isStirring }: { isStirring: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (isStirring && ref.current) {
      ref.current.rotation.y += delta * 15; // Fast rotation
    }
  });

  return (
    <mesh ref={ref} position={[0, -1.3, 0]}>
      <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
      <meshStandardMaterial color="#ffffff" roughness={0.1} />
    </mesh>
  );
};

// The fluid inside the beaker that changes color
const TitrationFluid = ({ pH }: { pH: number }) => {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Phenolphthalein color logic
  useEffect(() => {
    if (!materialRef.current) return;
    const color = new THREE.Color();
    
    // Transparent / slight white below pH 8
    // Deep pink/fuchsia above pH 9
    if (pH < 8.2) {
      color.setHex(0xf8fafc); // slightly milky/clear
      materialRef.current.opacity = 0.1;
      materialRef.current.transmission = 0.9;
    } else if (pH > 9.8) {
      color.setHex(0xd946ef); // fuchsia
      materialRef.current.opacity = 0.6;
      materialRef.current.transmission = 0.2;
    } else {
      // Transition range
      const ratio = (pH - 8.2) / (9.8 - 8.2);
      color.setHex(0xf8fafc).lerp(new THREE.Color(0xd946ef), ratio);
      materialRef.current.opacity = 0.1 + (0.5 * ratio);
      materialRef.current.transmission = 0.9 - (0.7 * ratio);
    }
    
    materialRef.current.color = color;
  }, [pH]);

  return (
    <mesh position={[0, -0.6, 0]}>
      <cylinderGeometry args={[1.45, 1.45, 1.5, 32]} />
      <meshPhysicalMaterial 
        ref={materialRef}
        roughness={0.1}
        ior={1.33}
        transparent
      />
    </mesh>
  );
};

// Falling drops animation
const Drops = ({ isAdding, position }: { isAdding: boolean, position: [number, number, number] }) => {
  const dropRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isAdding) {
      setActive(true);
      const timer = setTimeout(() => setActive(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAdding]);

  useFrame((state, delta) => {
    if (active && dropRef.current) {
      dropRef.current.position.y -= delta * 5;
      if (dropRef.current.position.y < -0.2) {
        dropRef.current.position.y = position[1];
      }
    } else if (dropRef.current) {
      dropRef.current.position.y = position[1];
    }
  });

  return (
    <mesh ref={dropRef} position={position} visible={active}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={0.5} transparent />
    </mesh>
  );
};

// Full Lab Setup
const TitrationLab = ({ pH, isStirring, isAdding }: { pH: number, isStirring: boolean, isAdding: boolean }) => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Base / Magnetic Stirrer device */}
      <mesh position={[0, -1.6, 0]}>
        <boxGeometry args={[4, 0.4, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      
      {/* Beaker */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1.6, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.9} 
          opacity={0.3} 
          transparent 
          roughness={0.05} 
          ior={1.5} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      <TitrationFluid pH={pH} />
      <StirrerBar isStirring={isStirring} />
      
      {/* Burette Pipe */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.3} transparent />
      </mesh>

      {/* Burette Valve */}
      <mesh position={[0.3, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color={isAdding ? "#22c55e" : "#ef4444"} />
      </mesh>

      <Drops isAdding={isAdding} position={[0, 0.5, 0]} />
    </group>
  );
};

export default function AcidBaseTitration3DCanvas() {
  // Titration constants: Strong Acid (HCl) titrated with Strong Base (NaOH)
  const Ca = 0.1; // mol/L
  const Va = 20;  // mL
  const Cb = 0.1; // mol/L
  const Veq = (Ca * Va) / Cb; // 20 mL
  
  const [Vb, setVb] = useState(0);
  const [pH, setPh] = useState(1);
  const [isStirring, setIsStirring] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Calculate pH based on Vb (Strong Acid / Strong Base)
  useEffect(() => {
    let currentPh = 7;
    if (Vb < Veq) {
      // Before equivalence
      const h3o = (Ca * Va - Cb * Vb) / (Va + Vb);
      currentPh = -Math.log10(h3o);
    } else if (Math.abs(Vb - Veq) < 0.01) {
      // At equivalence
      currentPh = 7.0;
    } else {
      // After equivalence
      const oh = (Cb * Vb - Ca * Va) / (Va + Vb);
      currentPh = 14 + Math.log10(oh);
    }
    setPh(currentPh);
  }, [Vb, Ca, Va, Cb, Veq]);

  // Autoplay logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && Vb <= 40) {
      setIsAdding(true);
      interval = setInterval(() => {
        setVb((prev) => {
          if (prev >= 40) {
            setAutoPlay(false);
            setIsAdding(false);
            return prev;
          }
          // Slow down near equivalence point
          const step = Math.abs(prev - Veq) < 2 ? 0.2 : 0.5;
          return Math.min(40, prev + step);
        });
      }, 200);
    } else {
      setIsAdding(false);
    }
    return () => clearInterval(interval);
  }, [autoPlay, Vb, Veq]);

  const reset = () => {
    setVb(0);
    setAutoPlay(false);
    setIsAdding(false);
  };

  // Generate data points for the CSS curve
  const curvePoints = [];
  for (let v = 0; v <= 40; v += 0.5) {
    let y = 7;
    if (v < Veq) {
      const h = (Ca * Va - Cb * v) / (Va + v);
      y = -Math.log10(h);
    } else if (v === Veq) {
      y = 7;
    } else {
      const oh = (Cb * v - Ca * Va) / (Va + v);
      y = 14 + Math.log10(oh);
    }
    curvePoints.push({ v, y });
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col md:flex-row h-[600px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-border/50 bg-gradient-to-t from-slate-900 to-black">
        <Canvas camera={{ position: [0, 1, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#ffffff" />
          
          <TitrationLab pH={pH} isStirring={isStirring} isAdding={isAdding || autoPlay} />
          
          <OrbitControls enableZoom={true} minDistance={3} maxDistance={15} target={[0, -0.5, 0]} />
        </Canvas>

        {/* Floating Indicator Stats */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Indicateur : Phénolphtaléine</span>
          </div>
          <div className="text-[10px] text-muted-foreground">Zone de virage : pH 8.2 - 10.0</div>
          <div className="mt-2 h-2 w-full rounded-full bg-gradient-to-r from-slate-100 to-fuchsia-500 border border-border/50"></div>
        </div>
      </div>

      {/* CONTROLS & GRAPH */}
      <div className="flex-1 flex flex-col bg-slate-900/40 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
            Dosage Acide Fort / Base Forte
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-border/40 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Volume Versé (Vb)</span>
            <span className="text-2xl font-mono font-black text-blue-400">{Vb.toFixed(1)} <span className="text-sm">mL</span></span>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-border/40 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">pH Actuel</span>
            <span className={`text-2xl font-mono font-black transition-colors ${pH > 8.2 ? 'text-fuchsia-400' : 'text-emerald-400'}`}>
              {pH.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-8">
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${autoPlay ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'}`}
          >
            <Play className={`w-4 h-4 ${autoPlay ? 'hidden' : 'block'}`} />
            {autoPlay ? "Arrêter le dosage" : "Démarrer (Goutte à goutte)"}
          </button>
          
          <button 
            onClick={() => { setVb(Math.min(40, Vb + 0.5)); setIsAdding(true); setTimeout(() => setIsAdding(false), 200); }}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-foreground rounded-xl border border-border/50 transition-colors flex items-center justify-center"
            title="Ajouter 0.5 mL"
          >
            <Droplet className="w-4 h-4 text-blue-400" />
          </button>

          <button 
            onClick={reset}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-foreground rounded-xl border border-border/50 transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* The Graph (SVG implementation) */}
        <div className="mt-auto bg-slate-950 border border-border/50 rounded-2xl p-4 relative">
          <h4 className="text-[10px] font-bold text-muted-foreground text-center mb-2 uppercase tracking-widest">
            Courbe de Titrage pH = f(Vb)
          </h4>
          
          <div className="relative w-full h-[200px] border-l border-b border-border/60">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 40 14">
              
              {/* Grid Lines */}
              <line x1="0" y1="7" x2="40" y2="7" stroke="rgba(255,255,255,0.1)" strokeWidth="0.1" strokeDasharray="0.5" />
              <line x1="20" y1="0" x2="20" y2="14" stroke="rgba(255,255,255,0.1)" strokeWidth="0.1" strokeDasharray="0.5" />

              {/* The full theoretical curve (faded) */}
              <polyline 
                points={curvePoints.map(p => `${p.v},${14 - p.y}`).join(" ")}
                fill="none" 
                stroke="rgba(16, 185, 129, 0.2)" 
                strokeWidth="0.2"
              />

              {/* The filled curve (up to current Vb) */}
              <polyline 
                points={curvePoints.filter(p => p.v <= Vb).map(p => `${p.v},${14 - p.y}`).join(" ")}
                fill="none" 
                stroke="#10b981" 
                strokeWidth="0.4"
                strokeLinecap="round"
              />

              {/* Current Point Marker */}
              <circle 
                cx={Vb} 
                cy={14 - pH} 
                r="0.8" 
                fill="#38bdf8" 
                className="transition-all duration-300"
              />
            </svg>

            {/* Labels */}
            <div className="absolute -left-6 bottom-0 text-[9px] text-muted-foreground">0</div>
            <div className="absolute -left-6 top-0 text-[9px] text-muted-foreground">14</div>
            <div className="absolute -left-6 top-[50%] -translate-y-1/2 text-[9px] text-emerald-400">7</div>
            <div className="absolute right-0 -bottom-5 text-[9px] text-muted-foreground">40 mL</div>
            <div className="absolute left-[50%] -translate-x-1/2 -bottom-5 text-[9px] text-emerald-400 font-bold">Veq (20)</div>
          </div>
        </div>

      </div>
    </div>
  );
}
