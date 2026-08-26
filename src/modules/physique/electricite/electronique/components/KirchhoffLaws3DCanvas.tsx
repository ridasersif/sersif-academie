"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { GitMerge, Layers, RefreshCw, Zap } from "lucide-react";

// --- LOI DES NŒUDS (KCL) ---
const KCLSystem = ({ isPlaying }: { isPlaying: boolean }) => {
  const electronIn = useRef<THREE.InstancedMesh>(null);
  const electronOut1 = useRef<THREE.InstancedMesh>(null);
  const electronOut2 = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  // Wires for KCL
  const wireIn = [new THREE.Vector3(-4, 0, 0), new THREE.Vector3(0, 0, 0)];
  const wireOut1 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 2, 0)];
  const wireOut2 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, -2, 0)];

  useFrame((state) => {
    if (!isPlaying) return;
    const time = state.clock.elapsedTime * 2;

    if (electronIn.current) {
      for (let i = 0; i < 10; i++) {
        const t = (time + i / 10) % 1;
        dummy.position.set(-4 + t * 4, 0, 0);
        dummy.updateMatrix();
        electronIn.current.setMatrixAt(i, dummy.matrix);
      }
      electronIn.current.instanceMatrix.needsUpdate = true;
    }

    if (electronOut1.current) {
      for (let i = 0; i < 6; i++) {
        const t = (time + i / 6) % 1;
        dummy.position.set(t * 3, t * 2, 0);
        dummy.updateMatrix();
        electronOut1.current.setMatrixAt(i, dummy.matrix);
      }
      electronOut1.current.instanceMatrix.needsUpdate = true;
    }

    if (electronOut2.current) {
      for (let i = 0; i < 4; i++) {
        const t = (time + i / 4) % 1;
        dummy.position.set(t * 3, -t * 2, 0);
        dummy.updateMatrix();
        electronOut2.current.setMatrixAt(i, dummy.matrix);
      }
      electronOut2.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Node A */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.8, 0]} center>
        <span className="text-cyan-400 font-bold font-mono text-xs whitespace-nowrap bg-slate-900/90 border border-slate-700/50 px-2 py-1 rounded shadow-lg">Nœud A</span>
      </Html>

      {/* Wires */}
      <Line points={wireIn} color="#64748b" lineWidth={5} />
      <Line points={wireOut1} color="#64748b" lineWidth={4} />
      <Line points={wireOut2} color="#64748b" lineWidth={3} />

      {/* Current Labels */}
      <Html position={[-2, 0.5, 0]} center>
        <span className="text-amber-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 border border-slate-700/50 px-2 py-1 rounded shadow-lg">I = 10 A</span>
      </Html>
      <Html position={[1.5, 1.5, 0]} center>
        <span className="text-rose-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 border border-slate-700/50 px-2 py-1 rounded shadow-lg">I₁ = 6 A</span>
      </Html>
      <Html position={[1.5, -1.5, 0]} center>
        <span className="text-emerald-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 border border-slate-700/50 px-2 py-1 rounded shadow-lg">I₂ = 4 A</span>
      </Html>

      {/* Particles */}
      <instancedMesh ref={electronIn} args={[undefined, undefined, 10]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#facc15" />
      </instancedMesh>
      <instancedMesh ref={electronOut1} args={[undefined, undefined, 6]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f43f5e" />
      </instancedMesh>
      <instancedMesh ref={electronOut2} args={[undefined, undefined, 4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </instancedMesh>
    </group>
  );
};

// --- LOI DES MAILLES (KVL) ---
const KVLSystem = ({ isPlaying }: { isPlaying: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);
  const arrowRef = useRef<THREE.Group>(null);
  const electrons = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  
  const loopPoints = [
    new THREE.Vector3(-2, 2, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(2, -2, 0),
    new THREE.Vector3(-2, -2, 0),
    new THREE.Vector3(-2, 2, 0),
  ];

  useFrame((state, delta) => {
    if (!isPlaying) return;
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.cos(time * 0.5) * 0.05;
    }

    if (arrowRef.current) {
      arrowRef.current.rotation.z -= delta * 2;
    }

    if (electrons.current) {
      const perimeter = 16;
      const numElectrons = 20;
      for (let i = 0; i < numElectrons; i++) {
        const t = (time * 0.5 + i / numElectrons) % 1; 
        const d = t * perimeter;
        let x = 0, y = 0;
        if (d < 4) {
          x = -2 + d; y = 2;
        } else if (d < 8) {
          x = 2; y = 2 - (d - 4);
        } else if (d < 12) {
          x = 2 - (d - 8); y = -2;
        } else {
          x = -2; y = -2 + (d - 12);
        }
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        electrons.current.setMatrixAt(i, dummy.matrix);
      }
      electrons.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={meshRef}>
      <Line points={loopPoints} color="#64748b" lineWidth={3} />
      
      {[loopPoints[0], loopPoints[1], loopPoints[2], loopPoints[3]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}

      {/* Generator E */}
      <mesh position={[-2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      <Html position={[-3.2, 0, 0]} center>
        <span className="text-amber-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded border border-amber-500/20 shadow-xl">E = 12V</span>
      </Html>

      {/* Resistor R1 */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#f43f5e" />
      </mesh>
      <Html position={[0, 2.8, 0]} center>
        <span className="text-rose-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded border border-rose-500/20 shadow-xl">U₁ = -4V</span>
      </Html>

      {/* Resistor R2 */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <Html position={[3.2, 0, 0]} center>
        <span className="text-emerald-400 font-bold font-mono text-[10px] whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded border border-emerald-500/20 shadow-xl">U₂ = -8V</span>
      </Html>

      {/* KVL Mesh Loop Arrow */}
      <group ref={arrowRef}>
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.7, 0.8, 32, 1, 0, Math.PI * 1.5]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.75, -0.75, 0]} rotation={[0, 0, Math.PI/4]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
      
      <Html position={[0, 0, 0]} center>
        <span className="text-cyan-400 font-bold font-mono text-sm whitespace-nowrap drop-shadow-md">Maille M</span>
      </Html>

      {/* Flowing Electrons */}
      <instancedMesh ref={electrons} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </instancedMesh>
    </group>
  );
};

export default function KirchhoffLaws3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<"KCL" | "KVL">("KCL");
  
  // Lazy loading observer
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden bg-slate-950/50 border border-slate-800 shadow-xl flex flex-col md:flex-row h-auto md:h-[400px]">
      {isVisible && (
        <>
          {/* GAUCHE : Observations & Contrôles */}
          <div className="w-full md:w-5/12 p-5 flex flex-col justify-between bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 z-10 relative">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("KCL")}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 flex-1 justify-center ${
                    activeTab === "KCL" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <GitMerge className="w-4 h-4" /> KCL
                </button>
                <button
                  onClick={() => setActiveTab("KVL")}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 flex-1 justify-center ${
                    activeTab === "KVL" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Layers className="w-4 h-4" /> KVL
                </button>
              </div>

              {activeTab === "KCL" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500">
                  <h3 className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Conservation de la Charge
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Observez le nœud central A. Les charges électriques ne peuvent ni s&apos;y accumuler ni y disparaître.
                  </p>
                  <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/20 shadow-inner">
                    <div className="text-center font-mono text-cyan-300 text-xs font-bold mb-1">I = I₁ + I₂</div>
                    <div className="text-center text-slate-400 text-[10px]">10A = 6A + 4A</div>
                  </div>
                  <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside mt-2">
                    <li><strong className="text-amber-400">Jaune:</strong> Courant entrant (I)</li>
                    <li><strong className="text-rose-400">Rouge:</strong> Courant sortant 1 (I₁)</li>
                    <li><strong className="text-emerald-400">Vert:</strong> Courant sortant 2 (I₂)</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500">
                  <h3 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Unicité du Potentiel
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    En parcourant la maille fermée M, le potentiel revient à sa valeur initiale. La somme des tensions est nulle.
                  </p>
                  <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/20 shadow-inner">
                    <div className="text-center font-mono text-amber-300 text-xs font-bold mb-1">E + U₁ + U₂ = 0</div>
                    <div className="text-center text-slate-400 text-[10px]">12V - 4V - 8V = 0V</div>
                  </div>
                  <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside mt-2">
                    <li><strong className="text-amber-400">E:</strong> Tension du générateur</li>
                    <li><strong className="text-rose-400">U₁:</strong> Chute de tension R1</li>
                    <li><strong className="text-emerald-400">U₂:</strong> Chute de tension R2</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors text-[10px] font-bold uppercase tracking-widest"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin-slow text-emerald-400" : ""}`} />
                {isPlaying ? "Mettre en pause" : "Relancer l'animation"}
              </button>
            </div>
          </div>

          {/* DROITE : Canvas 3D */}
          <div className="w-full md:w-7/12 relative h-[300px] md:h-full bg-gradient-to-br from-[#020617] to-slate-950 animate-in fade-in duration-700">
            <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
              <ambientLight intensity={1} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              {activeTab === "KCL" ? (
                <KCLSystem isPlaying={isPlaying} />
              ) : (
                <KVLSystem isPlaying={isPlaying} />
              )}
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
              />
            </Canvas>
          </div>
        </>
      )}
    </div>
  );
}
