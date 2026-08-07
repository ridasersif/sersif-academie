"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity */

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Play, Pause, ZapOff, Zap } from "lucide-react";

const Lattice = () => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const gridSize = 4;
  const spacing = 2;
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
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshPhysicalMaterial color="#334155" metalness={0.5} roughness={0.5} transparent opacity={0.6} />
    </instancedMesh>
  );
};

const Electrons = ({ hasField = false, isPlaying = true }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const count = 100;
  // Initialize electrons with random positions and velocities
  const electronsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        pos: new THREE.Vector3((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8),
        vel: new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10),
      });
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    electronsData.forEach((e, i) => {
      if (isPlaying) {
        // Random scatter (collision) every once in a while
        if (Math.random() < 0.05) {
          e.vel.set((Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*15);
        }

        // Apply velocities
        e.pos.addScaledVector(e.vel, delta);

        // If electric field is on, add drift velocity (electrons drift opposite to E, so +Z if E is -Z)
        if (hasField) {
          e.pos.z += 2 * delta; // Drift speed
        }

        // Bounding box (wrap around)
        if (e.pos.x > 4) e.pos.x = -4;
        if (e.pos.x < -4) e.pos.x = 4;
        if (e.pos.y > 4) e.pos.y = -4;
        if (e.pos.y < -4) e.pos.y = 4;
        if (e.pos.z > 4) e.pos.z = -4;
        if (e.pos.z < -4) e.pos.z = 4;
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
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshPhysicalMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
};

export default function DriftVelocity3DCanvas() {
  const [hasField, setHasField] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800 flex flex-col font-sans">
      
      {/* HUD: Titre et Status */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl flex flex-col gap-2">
          <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider border-b border-slate-700 pb-1">
            Modèle de Drude
          </h4>
          <div className="text-[11px] font-mono">
            {hasField ? (
              <div className="text-emerald-400">
                <span className="font-bold">E ≠ 0</span> : Mouvement ordonné
                <br />
                <span className="text-xs">Vitesse de dérive vd &gt; 0</span>
              </div>
            ) : (
              <div className="text-red-400">
                <span className="font-bold">E = 0</span> : Mouvement chaotique
                <br />
                <span className="text-xs">Vitesse moyenne = 0</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons (Overlay en bas) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-xl shadow-xl flex gap-2 sm:gap-4 pointer-events-auto">
        <button 
          onClick={() => setHasField(!hasField)}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border ${hasField ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"}`}
        >
          {hasField ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
          {hasField ? "Désactiver le champ E" : "Appliquer un champ E"}
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] sm:text-[11px] font-bold rounded-lg transition-colors border border-slate-600"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      <Canvas camera={{ position: [6, 4, 8], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
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
            <group position={[0, 5, 0]}>
              {/* Vecteur E pointant vers -Z */}
              <group position={[-2, 0, 0]}>
                <Line points={[[0, 0, 2], [0, 0, -2]]} color="#f59e0b" lineWidth={4} />
                <mesh position={[0, 0, -2]} rotation={[-Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.2, 0.6, 16]} />
                  <meshBasicMaterial color="#f59e0b" toneMapped={false} />
                </mesh>
                <Html position={[0, 0.5, 0]} center>
                  <div className="text-amber-400 font-bold font-mono text-sm bg-slate-900/50 px-1.5 rounded">E</div>
                </Html>
              </group>

              {/* Vecteur j pointant vers +Z (dérive des électrons) */}
              <group position={[2, 0, 0]}>
                <Line points={[[0, 0, -2], [0, 0, 2]]} color="#10b981" lineWidth={6} />
                <mesh position={[0, 0, 2]} rotation={[Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.25, 0.6, 16]} />
                  <meshBasicMaterial color="#10b981" toneMapped={false} />
                </mesh>
                <Html position={[0, 0.5, 0]} center>
                  <div className="text-emerald-400 font-bold font-mono text-base bg-emerald-900/50 px-1.5 rounded">j</div>
                </Html>
              </group>
            </group>
          )}
        </group>

        <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.4} far={5} color="#0f172a" />
      </Canvas>
    </div>
  );
}
