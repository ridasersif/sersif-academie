"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity */

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Play, Pause, ZapOff, Zap, Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

const Lattice = () => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const gridSize = 4;
  const spacing = 1.0;
  const count = gridSize * gridSize * gridSize;

  useEffect(() => {
    if (!mesh.current) return;
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          dummy.position.set(
            (x - gridSize / 2 + 0.5) * spacing,
            (y - gridSize / 2 + 0.5) * spacing,
            (z - gridSize / 2 + 0.5) * spacing
          );
          dummy.updateMatrix();
          mesh.current.setMatrixAt(i++, dummy.matrix);
        }
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={mesh} args={[null, null, count] as any}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshPhysicalMaterial color="#334155" metalness={0.5} roughness={0.5} transparent opacity={0.6} />
    </instancedMesh>
  );
};

const Electrons = ({ hasField = false, isPlaying = true }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const count = 100;
  const electronsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        pos: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4),
        vel: new THREE.Vector3((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5),
      });
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    electronsData.forEach((e, i) => {
      if (isPlaying) {
        if (Math.random() < 0.05) {
          e.vel.set((Math.random()-0.5)*7, (Math.random()-0.5)*7, (Math.random()-0.5)*7);
        }
        e.pos.addScaledVector(e.vel, delta);
        if (hasField) {
          e.pos.z += 1.5 * delta;
        }

        if (e.pos.x > 2.2) e.pos.x = -2.2;
        if (e.pos.x < -2.2) e.pos.x = 2.2;
        if (e.pos.y > 2.2) e.pos.y = -2.2;
        if (e.pos.y < -2.2) e.pos.y = 2.2;
        if (e.pos.z > 2.2) e.pos.z = -2.2;
        if (e.pos.z < -2.2) e.pos.z = 2.2;
      }
      
      dummy.position.copy(e.pos);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={mesh} args={[null, null, count] as any}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshPhysicalMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
};

export default function DriftVelocity3DCanvas() {
  const [hasField, setHasField] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHUD, setShowHUD] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      
      {/* Zone 3D */}
      <div className="w-full max-w-[800px] mx-auto h-[280px] sm:h-[320px] md:h-[350px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD: Titre et Status */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 p-2 sm:p-3 rounded-xl shadow-md flex flex-col gap-1 items-start">
            <div className="flex justify-between items-center w-full gap-4">
              <h4 className="text-slate-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Modèle de Drude
              </h4>
              <button 
                onClick={() => setShowHUD(!showHUD)}
                title="Afficher/Masquer les détails"
                className="text-slate-400 hover:text-white transition-colors"
              >
                {showHUD ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {showHUD && (
              <div className="text-[9px] sm:text-[10px] font-mono mt-2 border-t border-slate-700/50 pt-2">
                {hasField ? (
                  <div className="text-emerald-400">
                    <span className="font-bold">E ≠ 0</span> : Mouvement ordonné
                    <br />
                    <span className="text-[8px] sm:text-[9px]">Vitesse de dérive vd &gt; 0</span>
                  </div>
                ) : (
                  <div className="text-red-400">
                    <span className="font-bold">E = 0</span> : Mouvement chaotique
                    <br />
                    <span className="text-[8px] sm:text-[9px]">Vitesse moyenne = 0</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Canvas camera={{ position: [8, 6, 8], fov: 40 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} intensity={1.5} penumbra={1} />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate={false} maxPolarAngle={Math.PI / 1.5} />
          
          <EffectComposer>
            <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>

          <group position={[0, 0, 0]}>
            <Lattice />
            <Electrons hasField={hasField} isPlaying={isPlaying} />
            
            {/* Vecteurs macroscopiques si E est activé */}
            {hasField && (
              <group position={[0, 2.5, 0]}>
                {/* Vecteur E pointant vers -Z */}
                <group position={[-1, 0, 0]}>
                  <Line points={[[0, 0, 1], [0, 0, -1]]} color="#f59e0b" lineWidth={3} />
                  <mesh position={[0, 0, -1]} rotation={[-Math.PI/2, 0, 0]}>
                    <coneGeometry args={[0.1, 0.25, 16]} />
                    <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                  </mesh>
                  <Html position={[0, 0.3, 0]} center>
                    <div className="text-amber-400 font-bold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      <LatexMath math="\vec{E}" />
                    </div>
                  </Html>
                </group>

                {/* Vecteur j pointant vers +Z (dérive des électrons) */}
                <group position={[1, 0, 0]}>
                  <Line points={[[0, 0, -1], [0, 0, 1]]} color="#10b981" lineWidth={3} />
                  <mesh position={[0, 0, 1]} rotation={[Math.PI/2, 0, 0]}>
                    <coneGeometry args={[0.1, 0.25, 16]} />
                    <meshBasicMaterial color="#10b981" toneMapped={false} />
                  </mesh>
                  <Html position={[0, 0.3, 0]} center>
                    <div className="text-emerald-400 font-bold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                      <LatexMath math="\vec{j}" />
                    </div>
                  </Html>
                </group>
              </group>
            )}
          </group>

          <ContactShadows resolution={256} scale={20} blur={2.5} opacity={0.4} far={5} color="#0f172a" />
        </Canvas>
      </div>

      {/* Boutons (Contrôle externe) */}
      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex-1 text-[10px] text-slate-400 hidden sm:block">
          Appliquez un champ électrique pour observer la vitesse de dérive.
        </div>

        <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button 
            onClick={() => setHasField(!hasField)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${hasField ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"}`}
          >
            {hasField ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
            {hasField ? "Désactiver E" : "Appliquer E"}
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
            className="flex items-center justify-center p-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
}
