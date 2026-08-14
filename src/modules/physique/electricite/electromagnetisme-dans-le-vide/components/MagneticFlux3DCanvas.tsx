"use client";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

const FluxVisualization = ({ angle }: { angle: number }) => {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const normalRef = useRef<THREE.Group>(null);
  
  const rad = (angle * Math.PI) / 180;

  useFrame(() => {
    // Rotate surface and normal
    if (surfaceRef.current && normalRef.current) {
      surfaceRef.current.rotation.x = rad;
      normalRef.current.rotation.x = rad;
    }
  });

  // Calculate arc points for the angle
  const arcPoints = useMemo(() => {
    const points = [];
    const radius = 0.6; // Arc radius
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * rad;
      points.push(new THREE.Vector3(0, radius * Math.cos(theta), radius * Math.sin(theta)));
    }
    return points;
  }, [rad]);

  // Generate static field lines
  const fieldLines = useMemo(() => {
    const lines = [];
    const spacing = 0.8;
    for (let x = -1.5; x <= 1.5; x += spacing) {
      for (let z = -1.5; z <= 1.5; z += spacing) {
        // Skip the center to leave space for the main vectors
        if (Math.abs(x) < 0.5 && Math.abs(z) < 0.5) continue;
        // Only place lines within the circle radius ~1.5
        if (Math.sqrt(x*x + z*z) > 1.4) continue;
        
        lines.push({ x, z });
      }
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Magnetic Field B (Global) */}
      <group>
        {fieldLines.map((pos, i) => (
          <group key={i} position={[pos.x, 0, pos.z]}>
            {/* Field Line */}
            <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="#3b82f6" lineWidth={1} opacity={0.3} transparent />
            {/* Arrow Head */}
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[0.04, 0.15, 8]} />
              <meshBasicMaterial color="#3b82f6" opacity={0.4} transparent />
            </mesh>
          </group>
        ))}
      </group>

      {/* Main Central B Vector */}
      <group>
        <Line points={[[0, 0, 0], [0, 2, 0]]} color="#0ea5e9" lineWidth={4} />
        <mesh position={[0, 2, 0]}>
          <coneGeometry args={[0.08, 0.25, 16]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
        <Html position={[0, 2.3, 0]} center>
          <div className="text-cyan-400 font-bold drop-shadow-md text-sm">
            <LatexMath math="\vec{B}" />
          </div>
        </Html>
      </group>

      {/* Surface S (Disque 3D) */}
      <mesh ref={surfaceRef} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.04, 64]} />
        <meshPhysicalMaterial 
          color="#f59e0b" 
          transparent 
          opacity={0.6} 
          metalness={0.4}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={0.1}
        />
        {/* Border of the disk */}
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(1.5, 1.5, 0.04, 64)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={2} />
        </lineSegments>
      </mesh>

      {/* Normal vector n */}
      <group ref={normalRef}>
        <Line points={[[0, 0, 0], [0, 1.8, 0]]} color="#ef4444" lineWidth={4} />
        <mesh position={[0, 1.8, 0]}>
          <coneGeometry args={[0.08, 0.25, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 2.1, 0]} center>
          <div className="text-red-400 font-bold drop-shadow-md text-sm">
            <LatexMath math="\vec{n}" />
          </div>
        </Html>
      </group>

      {/* Angle Arc */}
      {angle > 0 && (
        <group>
          <Line points={arcPoints} color="#a855f7" lineWidth={3} />
          <Html position={[0, 0.7 * Math.cos(rad / 2), 0.7 * Math.sin(rad / 2)]} center>
            <div className="text-purple-400 font-bold text-xs bg-slate-900/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-purple-500/30">
              <LatexMath math="\alpha" />
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

export default function MagneticFlux3DCanvas() {
  const [angle, setAngle] = useState(0); // Angle in degrees between n and B

  const fluxPercentage = Math.abs(Math.cos((angle * Math.PI) / 180) * 100).toFixed(0);
  const fluxSign = Math.cos((angle * Math.PI) / 180) >= 0 ? "+" : "-";

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[500px] mx-auto">
      <div className="w-full h-[220px] sm:h-[260px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden relative shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-slate-800">
        
        {/* HUD */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-2.5 rounded-lg shadow-lg">
          <div className="text-[10px] sm:text-xs text-slate-300 mb-1 flex items-center gap-1.5">
            Angle <span className="text-purple-400 font-semibold"><LatexMath math="\alpha" /></span> : <span className="font-bold text-white">{angle}°</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
            Flux <LatexMath math="\Phi" /> ≈ {fluxSign}{fluxPercentage}%
          </div>
        </div>

        <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.7} />
          <spotLight position={[5, 8, 5]} intensity={1.5} penumbra={1} castShadow />
          <pointLight position={[-3, -3, -3]} intensity={0.5} color="#3b82f6" />
          <Environment preset="city" />
          
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} />
          
          <group position={[0, -0.5, 0]}>
            <FluxVisualization angle={angle} />
          </group>

          <ContactShadows resolution={256} scale={10} blur={2} opacity={0.5} far={5} color="#000000" position={[0, -3, 0]} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 rounded-xl flex flex-col gap-3 shadow-sm backdrop-blur-sm">
        <label className="text-[10px] sm:text-xs text-slate-300 font-medium flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            Inclinaison de la surface (Angle <span className="text-purple-400"><LatexMath math="\alpha" /></span>)
          </span>
          <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">{angle}°</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="180" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
