"use client";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

const FluxVisualization = ({ angle }: { angle: number }) => {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const normalRef = useRef<THREE.Group>(null);
  const fieldGroupRef = useRef<THREE.Group>(null);
  
  // Create moving field particles/arrows
  const numParticles = 40;
  const particles = useMemo(() => {
    const arr = [];
    for(let i = 0; i < numParticles; i++) {
      // distribute inside a cylinder of radius 1.5
      const r = Math.sqrt(Math.random()) * 1.4;
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * 6; // range from -3 to 3
      arr.push({ x, y, z, speed: 1.5 + Math.random() * 1.5 });
    }
    return arr;
  }, []);

  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    // Rotate surface
    if (surfaceRef.current && normalRef.current) {
      const rad = (angle * Math.PI) / 180;
      surfaceRef.current.rotation.x = rad;
      normalRef.current.rotation.x = rad;
    }

    // Move field lines/particles upwards
    if (particlesRef.current) {
      particles.forEach((p, i) => {
        p.y += p.speed * delta;
        if (p.y > 3) p.y = -3; // wrap around
        
        dummy.position.set(p.x, p.y, p.z);
        // Make arrows point up
        dummy.rotation.set(0, 0, 0); 
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        if (particlesRef.current && typeof particlesRef.current.setMatrixAt === 'function') {
          particlesRef.current.setMatrixAt(i, dummy.matrix);
        }
      });
      if (particlesRef.current && particlesRef.current.instanceMatrix) {
        particlesRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Moving Magnetic Field */}
      <group ref={fieldGroupRef}>
        {/* Transparent cylinder representing the bounds of the field */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 6, 32, 1, true]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
        
        <instancedMesh ref={particlesRef} args={[null, null, numParticles] as any}>
          {/* Create an arrow-like shape for the field */}
          <coneGeometry args={[0.06, 0.4, 8]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
        </instancedMesh>
        
        <Html position={[1.8, 1.5, 0]} center>
          <div className="text-blue-400 font-bold drop-shadow-md bg-slate-900/50 px-1 rounded">
            <LatexMath math="\vec{B}" />
          </div>
        </Html>
      </group>

      {/* Surface S (Disque 3D) */}
      <mesh ref={surfaceRef} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.02, 64]} />
        <meshPhysicalMaterial 
          color="#f59e0b" 
          transparent 
          opacity={0.5} 
          metalness={0.3}
          roughness={0.2}
        />
        {/* Border of the disk */}
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(1.5, 1.5, 0.02, 64)]} />
          <lineBasicMaterial color="#d97706" linewidth={2} />
        </lineSegments>
      </mesh>

      {/* Normal vector n */}
      <group ref={normalRef}>
        <Line points={[[0, 0, 0], [0, 1.5, 0]]} color="#ef4444" lineWidth={3} />
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.08, 0.2, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 1.7, 0]} center>
          <div className="text-red-400 font-bold drop-shadow-md bg-slate-900/50 px-1 rounded">
            <LatexMath math="\vec{n}" />
          </div>
        </Html>
      </group>
    </group>
  );
};

export default function MagneticFlux3DCanvas() {
  const [angle, setAngle] = useState(0); // Angle in degrees between n and B

  const fluxPercentage = Math.abs(Math.cos((angle * Math.PI) / 180) * 100).toFixed(0);
  const fluxSign = Math.cos((angle * Math.PI) / 180) >= 0 ? "+" : "-";

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[500px] mx-auto">
      <div className="w-full h-[220px] sm:h-[260px] bg-slate-950 rounded-xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-auto bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 p-2 rounded-lg shadow-md">
          <div className="text-[9px] sm:text-[10px] text-slate-300 mb-0.5">
            Angle <LatexMath math="\alpha" /> : <span className="font-bold text-white">{angle}°</span>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-400">
            Flux <LatexMath math="\Phi" /> ≈ {fluxSign}{fluxPercentage}% du max
          </div>
        </div>

        <Canvas camera={{ position: [3, 2, 4], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 5, 5]} intensity={1} penumbra={1} castShadow />
          <Environment preset="city" />
          
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.5} />
          
          <group position={[0, 0, 0]}>
            <FluxVisualization angle={angle} />
          </group>

          <ContactShadows resolution={256} scale={10} blur={2} opacity={0.4} far={5} color="#000000" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="w-full bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex flex-col gap-2">
        <label className="text-[10px] sm:text-xs text-slate-300 font-medium flex justify-between">
          <span>Rotation du disque (Angle <LatexMath math="\alpha" />)</span>
          <span className="text-cyan-400 font-mono">{angle}°</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="180" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full accent-cyan-500 h-1 sm:h-1.5"
        />
      </div>
    </div>
  );
}
