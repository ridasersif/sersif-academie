"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Plus, Minus, Info, Settings2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// 3D Precipitation Simulation
const PrecipitationSystem = ({ 
  agCount, 
  clCount, 
  precipitatedCount 
}: { 
  agCount: number; 
  clCount: number; 
  precipitatedCount: number;
}) => {
  const meshAg = useRef<THREE.InstancedMesh>(null);
  const meshCl = useRef<THREE.InstancedMesh>(null);
  const meshSolidAg = useRef<THREE.InstancedMesh>(null);
  const meshSolidCl = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate random positions for free ions (Brownian motion)
  const maxFree = 300;
  const freePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < maxFree; i++) {
      const radius = Math.random() * 1.5;
      const theta = Math.random() * 2 * Math.PI;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = (Math.random() - 0.5) * 2;
      pos.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() });
    }
    return pos;
  }, []);

  // Pre-generate grid positions for the solid precipitate at the bottom
  const maxSolid = 300;
  const solidPositions = useMemo(() => {
    const pos = [];
    const spacing = 0.2;
    let yLayer = -1.4;
    for (let l = 0; l < 5; l++) {
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          const r = Math.sqrt((x*spacing)**2 + (z*spacing)**2);
          if (r < 1.4 && pos.length < maxSolid) {
            // Alternate Ag and Cl in the lattice
            const isAg = (Math.abs(x) + Math.abs(z) + l) % 2 === 0;
            pos.push({ 
              x: x * spacing, 
              y: yLayer, 
              z: z * spacing, 
              type: isAg ? 'Ag' : 'Cl' 
            });
          }
        }
      }
      yLayer += spacing;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!meshAg.current || !meshCl.current || !meshSolidAg.current || !meshSolidCl.current) return;

    // --- 1. Free Ag+ Ions ---
    for (let i = 0; i < maxFree; i++) {
      if (i < agCount) {
        const p = freePositions[i];
        p.x += Math.sin(state.clock.elapsedTime * p.speed + p.phase) * delta * 0.3;
        p.y += Math.cos(state.clock.elapsedTime * p.speed * 0.8 + p.phase) * delta * 0.2;
        p.z += Math.sin(state.clock.elapsedTime * p.speed * 1.2 + p.phase) * delta * 0.3;
        
        // Boundaries
        const r = Math.sqrt(p.x * p.x + p.z * p.z);
        if (r > 1.5) { p.x *= 1.4 / r; p.z *= 1.4 / r; }
        if (p.y > 1.2) p.y = 1.2;
        if (p.y < -1.0) p.y = -1.0;

        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(1);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      meshAg.current.setMatrixAt(i, dummy.matrix);
    }
    meshAg.current.instanceMatrix.needsUpdate = true;

    // --- 2. Free Cl- Ions ---
    for (let i = 0; i < maxFree; i++) {
      if (i < clCount) {
        const p = freePositions[maxFree - 1 - i]; // use the other end of the array
        p.x += Math.cos(state.clock.elapsedTime * p.speed + p.phase) * delta * 0.3;
        p.y += Math.sin(state.clock.elapsedTime * p.speed * 0.8 + p.phase) * delta * 0.2;
        p.z += Math.cos(state.clock.elapsedTime * p.speed * 1.2 + p.phase) * delta * 0.3;
        
        const r = Math.sqrt(p.x * p.x + p.z * p.z);
        if (r > 1.5) { p.x *= 1.4 / r; p.z *= 1.4 / r; }
        if (p.y > 1.2) p.y = 1.2;
        if (p.y < -1.0) p.y = -1.0;

        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(1);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      meshCl.current.setMatrixAt(i, dummy.matrix);
    }
    meshCl.current.instanceMatrix.needsUpdate = true;

    // --- 3. Solid Precipitate (AgCl) ---
    let solidAgIdx = 0;
    let solidClIdx = 0;
    
    // Animate the solid forming (growing lattice)
    for (let i = 0; i < maxSolid; i++) {
      const p = solidPositions[i];
      if (i < precipitatedCount * 2) {
        // Slight jiggle for solid
        const jiggle = Math.sin(state.clock.elapsedTime * 2 + p.x) * 0.01;
        dummy.position.set(p.x, p.y + jiggle, p.z);
        dummy.scale.setScalar(1);
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      
      if (p.type === 'Ag') {
        meshSolidAg.current.setMatrixAt(solidAgIdx++, dummy.matrix);
      } else {
        meshSolidCl.current.setMatrixAt(solidClIdx++, dummy.matrix);
      }
    }
    
    // Hide unused solid instances
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = solidAgIdx; i < maxSolid; i++) meshSolidAg.current.setMatrixAt(i, dummy.matrix);
    for (let i = solidClIdx; i < maxSolid; i++) meshSolidCl.current.setMatrixAt(i, dummy.matrix);

    meshSolidAg.current.instanceMatrix.needsUpdate = true;
    meshSolidCl.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Free Ag+ (Silver/Grey) */}
      <instancedMesh ref={meshAg} args={[undefined, undefined, maxFree]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </instancedMesh>

      {/* Free Cl- (Green) */}
      <instancedMesh ref={meshCl} args={[undefined, undefined, maxFree]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#22c55e" metalness={0.2} roughness={0.4} />
      </instancedMesh>

      {/* Solid Ag+ */}
      <instancedMesh ref={meshSolidAg} args={[undefined, undefined, maxSolid]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </instancedMesh>

      {/* Solid Cl- */}
      <instancedMesh ref={meshSolidCl} args={[undefined, undefined, maxSolid]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#4ade80" metalness={0.2} roughness={0.5} />
      </instancedMesh>

      {/* Beaker */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 3, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.3} transparent roughness={0.05} ior={1.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Water volume */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.65, 1.65, 2.7, 32]} />
        <meshPhysicalMaterial color="#0ea5e9" transmission={0.8} opacity={0.1} transparent roughness={0.1} />
      </mesh>
    </group>
  );
};

export default function Precipitation3DCanvas() {
  const Ks = 100; // Simulated Ks for visual purposes (arbitrary scale)
  
  // Concentrations (represented as number of particles added)
  const [totalAg, setTotalAg] = useState(5);
  const [totalCl, setTotalCl] = useState(5);

  // Reaction logic: Ag+ + Cl- <=> AgCl(s)
  const Q = totalAg * totalCl;
  let precipitated = 0;
  let freeAg = totalAg;
  let freeCl = totalCl;

  if (Q > Ks) {
    // Precipitate forms until Q = Ks
    // (freeAg - x)*(freeCl - x) = Ks
    // x^2 - (totalAg + totalCl)x + (totalAg*totalCl - Ks) = 0
    const b = -(totalAg + totalCl);
    const c = totalAg * totalCl - Ks;
    const delta = b * b - 4 * c;
    if (delta >= 0) {
      precipitated = Math.floor((-b - Math.sqrt(delta)) / 2);
      if (precipitated < 0) precipitated = 0;
      freeAg = totalAg - precipitated;
      freeCl = totalCl - precipitated;
    }
  }

  const isPrecipitating = Q > Ks;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col md:flex-row h-[600px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full md:w-[55%] h-1/2 md:h-full border-b md:border-b-0 md:border-r border-border/50 bg-gradient-to-t from-slate-950 to-slate-900">
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#ffffff" />
          
          <PrecipitationSystem 
            agCount={freeAg} 
            clCount={freeCl} 
            precipitatedCount={precipitated} 
          />
          
          <OrbitControls enableZoom={true} minDistance={3} maxDistance={12} target={[0, -0.5, 0]} />
        </Canvas>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>État de la solution</span>
          </div>
          {isPrecipitating ? (
            <div className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider text-center">
              Sursaturée (Précipitation)
            </div>
          ) : (
            <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider text-center">
              Insaturée (Limpide)
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex-1 flex flex-col bg-slate-900/40 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
            Contrôle du Produit Ionique
          </h3>
        </div>

        {/* Add Ions Controls */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Ag+ Control */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/40 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-400 mx-auto mb-2 shadow-[0_0_10px_rgba(148,163,184,0.5)]"></div>
            <h4 className="text-[11px] font-bold text-foreground mb-1">Ions Argent (Ag⁺)</h4>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button 
                onClick={() => setTotalAg(Math.max(0, totalAg - 5))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-lg font-bold text-slate-300 w-8">{totalAg}</span>
              <button 
                onClick={() => setTotalAg(Math.min(100, totalAg + 5))}
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cl- Control */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/40 text-center">
            <div className="w-8 h-8 rounded-full bg-green-500 mx-auto mb-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <h4 className="text-[11px] font-bold text-foreground mb-1">Ions Chlorure (Cl⁻)</h4>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button 
                onClick={() => setTotalCl(Math.max(0, totalCl - 5))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-lg font-bold text-green-400 w-8">{totalCl}</span>
              <button 
                onClick={() => setTotalCl(Math.min(100, totalCl + 5))}
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calculations display */}
        <div className="space-y-4">
          <div className="bg-black/40 p-4 rounded-xl border border-border/40">
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Quotient Réactionnel (Q)</h4>
            <div className="text-center font-mono text-lg text-amber-400 mb-1">
              Q = [Ag⁺][Cl⁻] = {Q}
            </div>
            <div className="text-center text-[10px] text-muted-foreground">
              Limite de Solubilité (Ks) = {Ks}
            </div>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-border/40">
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Bilan de Matière (Simulé)</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex justify-between">
                <span className="text-slate-400">Ag⁺ Libres :</span>
                <span className="text-foreground">{freeAg}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-green-400">Cl⁻ Libres :</span>
                <span className="text-foreground">{freeCl}</span>
              </li>
              <li className="flex justify-between pt-2 border-t border-border/30">
                <span className="text-slate-300 font-bold">AgCl Solide (Précipité) :</span>
                <span className="text-foreground font-bold">{precipitated}</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
