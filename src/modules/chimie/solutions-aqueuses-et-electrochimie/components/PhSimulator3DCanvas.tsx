"use client";
/* eslint-disable react-hooks/purity, react-hooks/immutability */

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Sliders, Beaker, Play, Pause, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// --- 3D PARTICLE SYSTEM FOR ACID/BASE SPECIES ---
const AcidBaseParticles = ({ 
  alphaBase, 
  alphaAcid, 
  isPlaying 
}: { 
  alphaBase: number; 
  alphaAcid: number; 
  isPlaying: boolean 
}) => {
  const meshAcid = useRef<THREE.InstancedMesh>(null);
  const meshBase = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const totalParticles = 200;
  
  // Pre-generate random positions within a beaker-like cylinder
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < totalParticles; i++) {
      const radius = Math.random() * 1.8;
      const theta = Math.random() * 2 * Math.PI;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = (Math.random() - 0.5) * 3;
      pos.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() });
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!meshAcid.current || !meshBase.current) return;

    const numBase = Math.floor(alphaBase * totalParticles);
    const numAcid = totalParticles - numBase;

    let acidCount = 0;
    let baseCount = 0;

    for (let i = 0; i < totalParticles; i++) {
      const p = positions[i];

      // Brownian motion
      if (isPlaying) {
        p.x += Math.sin(state.clock.elapsedTime * p.speed + p.phase) * delta * 0.2;
        p.y += Math.cos(state.clock.elapsedTime * p.speed * 0.8 + p.phase) * delta * 0.15;
        p.z += Math.sin(state.clock.elapsedTime * p.speed * 1.2 + p.phase) * delta * 0.2;
        
        // Constrain to cylinder
        const r = Math.sqrt(p.x * p.x + p.z * p.z);
        if (r > 1.8) {
          p.x *= 1.7 / r;
          p.z *= 1.7 / r;
        }
        if (p.y > 1.5) p.y = 1.5;
        if (p.y < -1.5) p.y = -1.5;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();

      // Assign to acid or base mesh based on calculated ratios
      if (i < numAcid) {
        meshAcid.current.setMatrixAt(acidCount++, dummy.matrix);
      } else {
        meshBase.current.setMatrixAt(baseCount++, dummy.matrix);
      }
    }

    // Hide unused instances
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = acidCount; i < totalParticles; i++) meshAcid.current.setMatrixAt(i, dummy.matrix);
    for (let i = baseCount; i < totalParticles; i++) meshBase.current.setMatrixAt(i, dummy.matrix);

    meshAcid.current.instanceMatrix.needsUpdate = true;
    meshBase.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Acide AH (Red) */}
      <instancedMesh ref={meshAcid} args={[undefined, undefined, totalParticles]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </instancedMesh>

      {/* Base A- (Blue) */}
      <instancedMesh ref={meshBase} args={[undefined, undefined, totalParticles]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </instancedMesh>

      {/* Bécher (Glass Cylinder) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 3.5, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.1}
          ior={1.5}
          thickness={0.1}
        />
      </mesh>
      {/* Water volume */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.95, 1.95, 3.1, 32]} />
        <meshPhysicalMaterial 
          color="#0ea5e9"
          transmission={0.8}
          opacity={0.15}
          transparent
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};


export default function PhSimulator3DCanvas() {
  const [pH, setPh] = useState(7.0);
  const [pKa, setPka] = useState(4.76); // Acetic acid default
  const [isPlaying, setIsPlaying] = useState(true);

  // Calculate fractions
  const alphaBase = Math.pow(10, pH - pKa) / (1 + Math.pow(10, pH - pKa));
  const alphaAcid = 1 - alphaBase;
  
  // Calculate percentages
  const pctBase = (alphaBase * 100).toFixed(1);
  const pctAcid = (alphaAcid * 100).toFixed(1);

  // Determine dominant species
  let dominant = "Mélange";
  let dominantColor = "text-amber-400";
  if (pH < pKa - 1) { dominant = "AH (Acide)"; dominantColor = "text-rose-400"; }
  else if (pH > pKa + 1) { dominant = "A⁻ (Base)"; dominantColor = "text-blue-400"; }

  const coupleOptions = [
    { name: "Acide Éthanoïque / Ion Éthanoate", pka: 4.76, formula: "CH₃COOH / CH₃COO⁻" },
    { name: "Ion Ammonium / Ammoniac", pka: 9.20, formula: "NH₄⁺ / NH₃" },
    { name: "Acide Méthanoïque / Ion Méthanoate", pka: 3.75, formula: "HCOOH / HCOO⁻" },
    { name: "Acide Hypochloreux / Ion Hypochlorite", pka: 7.50, formula: "HClO / ClO⁻" },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col md:flex-row h-[550px]">
      
      {/* LEFT PANEL: 3D Visualization */}
      <div className="relative w-full md:w-1/2 h-[250px] md:h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b md:border-b-0 md:border-r border-border/50">
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#38bdf8" />
          
          <AcidBaseParticles 
            alphaBase={alphaBase} 
            alphaAcid={alphaAcid} 
            isPlaying={isPlaying} 
          />
          
          <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={10} />
        </Canvas>

        {/* Floating Label */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Beaker className="w-4 h-4 text-emerald-400" />
            <span>Simulation Macroscopique</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-muted-foreground">AH ({pctAcid}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-muted-foreground">A⁻ ({pctBase}%)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-4 left-4 p-2 rounded-xl bg-slate-900/80 border border-border/50 hover:bg-white/10 text-foreground transition-colors backdrop-blur-md"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* RIGHT PANEL: Controls & Diagrams */}
      <div className="flex-1 flex flex-col h-full bg-slate-900/40 p-4 sm:p-6 overflow-y-auto">
        
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
            Contrôle des Équilibres (Diagramme de Prédominance)
          </h3>
        </div>

        <div className="space-y-6 flex-1">
          {/* Couple Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">Choix du Couple Acide/Base :</label>
            <select 
              className="w-full bg-slate-950 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
              value={pKa}
              onChange={(e) => setPka(parseFloat(e.target.value))}
            >
              {coupleOptions.map(c => (
                <option key={c.name} value={c.pka}>{c.formula} (pKa = {c.pka})</option>
              ))}
            </select>
          </div>

          {/* pH Slider */}
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-border/40">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-muted-foreground">Potentiel Hydrogène (pH) :</label>
              <span className="text-xl font-black text-emerald-400 font-mono">{pH.toFixed(1)}</span>
            </div>
            <input 
              type="range" 
              min="0" max="14" step="0.1" 
              value={pH} 
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>0 (Acide)</span>
              <span>7 (Neutre)</span>
              <span>14 (Basique)</span>
            </div>
          </div>

          {/* Diagramme de distribution visuel */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-rose-400">Acide AH</span>
              <span className="text-blue-400">Base A⁻</span>
            </div>
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-950 border border-border/40">
              <div 
                className="h-full bg-rose-500 transition-all duration-300 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                style={{ width: `${pctAcid}%` }}
              >
                {alphaAcid > 0.1 && `${pctAcid}%`}
              </div>
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${pctBase}%` }}
              >
                {alphaBase > 0.1 && `${pctBase}%`}
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">Espèce prédominante : </span>
              <span className={`text-xs font-black ${dominantColor}`}>{dominant}</span>
            </div>
          </div>

          {/* Henderson Hasselbalch Equation */}
          <div className="mt-auto p-4 rounded-2xl bg-black/40 border border-border/40">
            <h4 className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Relation de Henderson-Hasselbalch
            </h4>
            <div className="text-center overflow-x-auto text-xs py-1">
              <LatexMath math={`pH = pK_a + \\log \\frac{[A^-]}{[AH]} = ${pKa} + \\log \\left( \\frac{${pctBase}}{${pctAcid}} \\right)`} />
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              Si <strong className="text-foreground">pH = pKa</strong>, alors <LatexMath math="[AH] = [A^-]" /> (Demi-équivalence).<br/>
              Si <strong className="text-foreground">pH &lt; pKa - 1</strong>, l&apos;acide prédomine.<br/>
              Si <strong className="text-foreground">pH &gt; pKa + 1</strong>, la base prédomine.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
