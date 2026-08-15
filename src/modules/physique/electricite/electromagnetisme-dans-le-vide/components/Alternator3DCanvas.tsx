"use client";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

const AlternatorVisualization = ({ speed }: { speed: number }) => {
  const coilGroupRef = useRef<THREE.Group>(null);
  const normalGroupRef = useRef<THREE.Group>(null);
  const [theta, setTheta] = useState(0);

  // Constants
  const width = 2; // Along Z
  const height = 1.5; // Along Y (when flat)
  const B = 1; // Field strength

  useFrame((state, delta) => {
    if (coilGroupRef.current && normalGroupRef.current) {
      // Rotate around Z axis (or X axis, let's say Z axis)
      // Actually let's rotate around Z, so the coil lies in XY plane initially.
      // Wait, if N is left (-X) and S is right (+X), B field is along +X.
      // Coil axis of rotation is Z.
      const newTheta = coilGroupRef.current.rotation.z + speed * delta;
      coilGroupRef.current.rotation.z = newTheta;
      normalGroupRef.current.rotation.z = newTheta;
      setTheta(newTheta);
    }
  });

  // Calculate induced emf for HUD
  const e = B * (width * height) * speed * Math.sin(theta);
  const eMax = B * (width * height) * speed;
  const ePercentage = eMax > 0 ? (e / eMax) * 100 : 0;

  // Frame lines
  const framePoints = useMemo(() => [
    new THREE.Vector3(-height/2, -width/2, 0),
    new THREE.Vector3(height/2, -width/2, 0),
    new THREE.Vector3(height/2, width/2, 0),
    new THREE.Vector3(-height/2, width/2, 0),
    new THREE.Vector3(-height/2, -width/2, 0)
  ], []);

  // B Field lines
  const bLines = useMemo(() => {
    const lines = [];
    for(let z = -1.5; z <= 1.5; z += 0.5) {
      for(let y = -1; y <= 1; y += 0.5) {
        lines.push({y, z});
      }
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Magnets */}
      <group position={[-2.5, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1, 3, 4]} />
          <meshStandardMaterial color="#ef4444" metalness={0.2} roughness={0.5} />
        </mesh>
        <Html position={[0.6, 1.6, 0]} center>
          <div className="text-red-500 font-bold text-2xl drop-shadow-md">N</div>
        </Html>
      </group>

      <group position={[2.5, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1, 3, 4]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.2} roughness={0.5} />
        </mesh>
        <Html position={[-0.6, 1.6, 0]} center>
          <div className="text-blue-500 font-bold text-2xl drop-shadow-md">S</div>
        </Html>
      </group>

      {/* B Field Lines */}
      {bLines.map((pos, i) => (
        <group key={i}>
          <Line points={[[-1.8, pos.y, pos.z], [1.8, pos.y, pos.z]]} color="#3b82f6" opacity={0.2} transparent lineWidth={1} />
          {/* Arrow */}
          {i % 2 === 0 && (
            <mesh position={[0, pos.y, pos.z]} rotation={[0, 0, -Math.PI/2]}>
              <coneGeometry args={[0.05, 0.2, 8]} />
              <meshBasicMaterial color="#3b82f6" opacity={0.4} transparent />
            </mesh>
          )}
        </group>
      ))}

      {/* Rotating Coil (Cadre) */}
      <group>
        {/* Axe de rotation */}
        <mesh rotation={[Math.PI/2, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.05, 0.05, 5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        <group ref={coilGroupRef}>
          {/* The rectangular wire */}
          <Line points={framePoints} color="#fbbf24" lineWidth={5} />
          {/* Transparent surface filling */}
          <mesh>
            <planeGeometry args={[height, width]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Normal Vector */}
        <group ref={normalGroupRef}>
          <Line points={[[0, 0, 0], [0, 0, 1.5]]} color="#ef4444" lineWidth={4} />
          <mesh position={[0, 0, 1.5]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.08, 0.25, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Html position={[0, 0, 1.7]} center>
            <div className="text-red-400 font-bold text-sm drop-shadow-md bg-slate-900/50 px-1 rounded">
              <LatexMath math="\vec{n}" />
            </div>
          </Html>
        </group>
      </group>

      {/* Global B Vector (for angle reference) */}
      <group>
        <Line points={[[0, 0, 0], [1.5, 0, 0]]} color="#0ea5e9" lineWidth={4} />
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.08, 0.25, 16]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
        <Html position={[1.7, 0, 0]} center>
          <div className="text-cyan-400 font-bold text-sm drop-shadow-md bg-slate-900/50 px-1 rounded">
            <LatexMath math="\vec{B}" />
          </div>
        </Html>
      </group>

      {/* HTML HUD for live e(t) */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl w-[200px] flex flex-col items-center pointer-events-none">
          <div className="text-xs text-slate-300 font-medium mb-1">
            f.é.m induite <LatexMath math="e(t)" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {e > 0 ? "+" : ""}{e.toFixed(2)} V
          </div>
          {/* Visual bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mt-2 relative overflow-hidden">
            <div 
              className={`absolute top-0 h-full transition-all duration-75 ${e >= 0 ? "bg-emerald-500 left-1/2" : "bg-rose-500 right-1/2"}`}
              style={{ width: `${Math.abs(ePercentage)/2}%` }}
            />
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-500 -translate-x-1/2" />
          </div>
        </div>
      </Html>
    </group>
  );
};

export default function Alternator3DCanvas() {
  const [speed, setSpeed] = useState(2); // omega

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[700px] mx-auto">
      <div className="w-full h-[350px] sm:h-[400px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden relative shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-slate-800">
        
        {/* HUD Controls Info */}
        <div className="absolute top-3 left-3 z-10 pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-lg">
          <div className="text-xs text-slate-300 mb-1 flex items-center gap-1.5">
            Vitesse <span className="text-purple-400 font-semibold"><LatexMath math="\omega" /></span>
          </div>
          <div className="font-mono text-purple-400 font-bold text-sm">
            {speed.toFixed(1)} rad/s
          </div>
        </div>

        <Canvas camera={{ position: [2, 3, 6], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 8, 5]} intensity={1.5} penumbra={1} castShadow />
          <pointLight position={[-3, -3, -3]} intensity={0.5} color="#3b82f6" />
          <Environment preset="city" />
          
          <OrbitControls enableZoom={true} />
          
          <group position={[0, -0.5, 0]}>
            <AlternatorVisualization speed={speed} />
          </group>

          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.5} far={5} color="#000000" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3 shadow-sm backdrop-blur-sm">
        <label className="text-xs text-slate-300 font-medium flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            Vitesse de rotation (<span className="text-purple-400"><LatexMath math="\omega" /></span>)
          </span>
          <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded text-[10px]">
            {speed === 0 ? "Arrêté" : `${speed.toFixed(1)} rad/s`}
          </span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="0.5"
          value={speed} 
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-[10px] text-muted-foreground italic text-center">
          Augmentez la vitesse de rotation pour voir l'amplitude de la f.é.m. induite <LatexMath math="e_0" /> augmenter.
        </div>
      </div>
    </div>
  );
}
