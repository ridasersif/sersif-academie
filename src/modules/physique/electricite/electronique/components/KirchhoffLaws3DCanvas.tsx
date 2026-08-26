"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { GitMerge, Orbit, Workflow, Layers, RefreshCw } from "lucide-react";

// --- LOI DES NŒUDS (KCL) ---
const KCLSystem = ({ isPlaying }: { isPlaying: boolean }) => {
  const electronIn = useRef<THREE.InstancedMesh>(null);
  const electronOut1 = useRef<THREE.InstancedMesh>(null);
  const electronOut2 = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  // Wires for KCL: In(left to center), Out1(center to top-right), Out2(center to bottom-right)
  const wireIn = [new THREE.Vector3(-4, 0, 0), new THREE.Vector3(0, 0, 0)];
  const wireOut1 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 2, 0)];
  const wireOut2 = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, -2, 0)];

  useFrame((state) => {
    if (!isPlaying) return;
    const time = state.clock.elapsedTime * 2;

    // 10 particles entering (I = I1 + I2 -> 10 = 6 + 4)
    if (electronIn.current) {
      for (let i = 0; i < 10; i++) {
        const t = (time + i / 10) % 1;
        dummy.position.set(-4 + t * 4, 0, 0);
        dummy.updateMatrix();
        electronIn.current.setMatrixAt(i, dummy.matrix);
      }
      electronIn.current.instanceMatrix.needsUpdate = true;
    }

    // 6 particles out top (I1)
    if (electronOut1.current) {
      for (let i = 0; i < 6; i++) {
        const t = (time + i / 6) % 1;
        dummy.position.set(t * 3, t * 2, 0);
        dummy.updateMatrix();
        electronOut1.current.setMatrixAt(i, dummy.matrix);
      }
      electronOut1.current.instanceMatrix.needsUpdate = true;
    }

    // 4 particles out bottom (I2)
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
      <Text position={[0, 0.6, 0]} fontSize={0.4} color="#38bdf8" font="/fonts/Inter-Bold.ttf">Nœud A</Text>

      {/* Wires */}
      <Line points={wireIn} color="#64748b" lineWidth={5} />
      <Line points={wireOut1} color="#64748b" lineWidth={4} />
      <Line points={wireOut2} color="#64748b" lineWidth={3} />

      {/* Current Labels */}
      <Text position={[-2, 0.5, 0]} fontSize={0.3} color="#facc15">I = 10 A</Text>
      <Text position={[1.5, 1.5, 0]} fontSize={0.3} color="#f43f5e">I₁ = 6 A</Text>
      <Text position={[1.5, -1.5, 0]} fontSize={0.3} color="#10b981">I₂ = 4 A</Text>

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
  
  // A simple square loop: ( -2, 2 ) -> ( 2, 2 ) -> ( 2, -2 ) -> ( -2, -2 ) -> ( -2, 2 )
  const loopPoints = [
    new THREE.Vector3(-2, 2, 0),
    new THREE.Vector3(2, 2, 0),
    new THREE.Vector3(2, -2, 0),
    new THREE.Vector3(-2, -2, 0),
    new THREE.Vector3(-2, 2, 0),
  ];

  useFrame((state) => {
    if (!isPlaying) return;
    const time = state.clock.elapsedTime;
    // Rotate slightly for 3D effect
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Line points={loopPoints} color="#64748b" lineWidth={3} />
      
      {/* Node points */}
      {[loopPoints[0], loopPoints[1], loopPoints[2], loopPoints[3]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}

      {/* Components on branches */}
      {/* Generator E (left branch) */}
      <mesh position={[-2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      <Text position={[-2.8, 0, 0]} fontSize={0.3} color="#facc15">E = 12V</Text>

      {/* Resistor R1 (top branch) */}
      <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#f43f5e" />
      </mesh>
      <Text position={[0, 2.7, 0]} fontSize={0.3} color="#f43f5e">U₁ = -4V</Text>

      {/* Resistor R2 (right branch) */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <Text position={[2.8, 0, 0]} fontSize={0.3} color="#10b981">U₂ = -8V</Text>

      {/* Bottom branch is just a wire */}

      {/* KVL Mesh Loop Arrow (Circle) */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.8, 0.9, 32, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
      </mesh>
      {/* Arrow head for the loop */}
      <mesh position={[-0.85, -0.85, 0]} rotation={[0, 0, Math.PI/4]}>
        <coneGeometry args={[0.2, 0.4, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      
      <Text position={[0, 0, 0]} fontSize={0.4} color="#38bdf8" font="/fonts/Inter-Bold.ttf">Maille M</Text>
      
      {/* Floating KVL Equation */}
      <Html position={[0, -2.8, 0]} center transform>
        <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 text-cyan-300 font-mono text-xs font-bold whitespace-nowrap shadow-xl">
          E + U₁ + U₂ = 12 - 4 - 8 = 0 V
        </div>
      </Html>
    </group>
  );
};

export default function KirchhoffLaws3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<"KCL" | "KVL">("KCL");

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col h-[500px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full h-full bg-gradient-to-t from-slate-950 to-[#020617]">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
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

        {/* Top Controls Overlay */}
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl pointer-events-auto shadow-lg">
            <button
              onClick={() => setActiveTab("KCL")}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "KCL" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" /> Loi des Nœuds (KCL)
            </button>
            <button
              onClick={() => setActiveTab("KVL")}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "KVL" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Loi des Mailles (KVL)
            </button>
          </div>
        </div>

        {/* Bottom Left Status/Controls */}
        <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isPlaying ? "animate-spin-slow text-emerald-400" : ""}`} />
          </button>
          <div className="text-[10px] font-mono text-slate-400">
            {activeTab === "KCL" 
              ? "Conservation de la charge: I = I₁ + I₂" 
              : "Unicité du potentiel: ΣU = 0"}
          </div>
        </div>
      </div>
    </div>
  );
}
