"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Eye, Navigation } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow component reused for vectors
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0] }: { start: THREE.Vector3, dir: THREE.Vector3, length: number, color: string, thickness?: number, label?: string, labelOffset?: [number, number, number] }) {
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  if (Math.abs(normalizedDir.y) === 1) {
    if (normalizedDir.y === -1) {
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    }
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }
  
  return (
    <group position={start}>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 4, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      {label && (
        <Html position={[normalizedDir.x * (length + 0.1) + labelOffset[0], normalizedDir.y * (length + 0.1) + labelOffset[1], normalizedDir.z * (length + 0.1) + labelOffset[2]]} center>
          <div className="font-bold text-sm drop-shadow-md whitespace-nowrap" style={{ color }}>
            <LatexMath math={label} />
          </div>
        </Html>
      )}
    </group>
  );
}

// B Field Circle (Ampere Contour)
function BFieldCircle({ radius, yPos, color, direction }: { radius: number, yPos: number, color: string, direction: number }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * radius, yPos, Math.sin(t) * radius));
    }
    return pts;
  }, [radius, yPos]);

  if (radius <= 0.05) return null;

  return (
    <group>
      <Line points={points} color={color} lineWidth={2.5} transparent opacity={0.6} />
      <Arrow start={new THREE.Vector3(radius, yPos, 0)} dir={new THREE.Vector3(0, 0, -direction)} length={0.4} color={color} thickness={0.02} />
      <Arrow start={new THREE.Vector3(-radius, yPos, 0)} dir={new THREE.Vector3(0, 0, direction)} length={0.4} color={color} thickness={0.02} />
      <Arrow start={new THREE.Vector3(0, yPos, radius)} dir={new THREE.Vector3(direction, 0, 0)} length={0.4} color={color} thickness={0.02} />
      <Arrow start={new THREE.Vector3(0, yPos, -radius)} dir={new THREE.Vector3(-direction, 0, 0)} length={0.4} color={color} thickness={0.02} />
    </group>
  );
}

// Animated Current Density (J) - Refined Flow Effect
function AnimatedJField({ radius, direction, magnitude }: { radius: number, direction: number, magnitude: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const sparks = useMemo(() => {
    const items = [];
    const count = Math.max(30, Math.floor(radius * radius * 15)); // Optimal number of sparks
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * radius * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * 6; // random height between -3 and 3
      const speedOffset = 0.8 + Math.random() * 0.4;
      items.push({ x, y, z, speedOffset });
    }
    return items;
  }, [radius]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const baseSpeed = 3 * magnitude * direction;
      groupRef.current.children.forEach((child, i) => {
        // Skip the Html child
        if (child.type !== 'Mesh') return;
        
        const spark = sparks[i];
        if (!spark) return;

        child.position.y += baseSpeed * spark.speedOffset * delta;
        
        // Wrap around cleanly without mutating shared materials
        if (direction > 0 && child.position.y > 3) {
          child.position.y = -3;
        } else if (direction < 0 && child.position.y < -3) {
          child.position.y = 3;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {sparks.map((spark, i) => (
        <mesh key={i} position={[spark.x, spark.y, spark.z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      ))}
      <Html position={[0, direction === 1 ? 3.5 : -3.5, 0]} center>
        <div className="font-bold text-lg text-red-500 drop-shadow-lg bg-black/40 px-2 rounded-full">
          <LatexMath math="\vec{j}" />
        </div>
      </Html>
    </group>
  );
}

// Point M and its vectors
function PointM({ rM, jDirection, jMagnitude, R, showB, showA }: { rM: number, jDirection: number, jMagnitude: number, R: number, showB: boolean, showA: boolean }) {
  const B_mag = rM <= R ? (jMagnitude * rM) / 2 : (jMagnitude * R * R) / (2 * rM);
  const A0 = 2.0;
  let A_mag = 0;
  if (rM <= R) {
    A_mag = A0 - (jMagnitude * rM * rM) / 4;
  } else {
    A_mag = A0 - (jMagnitude * R * R) / 4 - (jMagnitude * R * R / 2) * Math.log(rM / R);
  }
  
  // Rescaled for better visibility
  const drawLengthB = B_mag * 1.5; 
  const drawLengthA = Math.abs(A_mag) * 1.5;
  const mPos = new THREE.Vector3(rM, 0, 0);
  
  return (
    <group>
      <mesh position={mPos}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      <Arrow start={mPos} dir={new THREE.Vector3(1,0,0)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_r" labelOffset={[0.1, 0, 0]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,0,-1)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_\theta" labelOffset={[0, 0, -0.1]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,1,0)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_z" labelOffset={[0, 0.1, 0]} />

      {showB && B_mag > 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0,0, -jDirection)} 
          length={drawLengthB} 
          color="#3b82f6" 
          thickness={0.035} 
          label="\vec{B}(M)"
          labelOffset={[0, -0.2, -jDirection * 0.1]}
        />
      )}

      {showA && A_mag !== 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0, Math.sign(A_mag) * jDirection, 0)} 
          length={drawLengthA} 
          color="#22c55e" 
          thickness={0.035} 
          label="\vec{A}(M)"
          labelOffset={[0.2, Math.sign(A_mag) * jDirection * 0.2, 0]}
        />
      )}
      
      <Line points={[new THREE.Vector3(0,0,0), mPos]} color="#ffffff" transparent opacity={0.3} dashed dashScale={15} dashSize={0.15} gapSize={0.1} />
    </group>
  );
}

// Main visualization component
export default function VectorPotentialExercise3DCanvas() {
  const [showJ, setShowJ] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showA, setShowA] = useState(true);
  
  const [cylinderRadius, setCylinderRadius] = useState(1.5);
  const [jDirection, setJDirection] = useState<1 | -1>(1);
  const [jMagnitude, setJMagnitude] = useState(1.0);
  const [rM, setRM] = useState(2.0);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const topCapPoints = useMemo(() => {
    const pts = [];
    for(let i=0; i<=48; i++) {
      const t = (i/48)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(t)*cylinderRadius, 3, Math.sin(t)*cylinderRadius));
    }
    return pts;
  }, [cylinderRadius]);

  const bottomCapPoints = useMemo(() => {
    const pts = [];
    for(let i=0; i<=48; i++) {
      const t = (i/48)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(t)*cylinderRadius, -3, Math.sin(t)*cylinderRadius));
    }
    return pts;
  }, [cylinderRadius]);

  return (
    <div className="w-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl" ref={canvasContainerRef}>
      
      {/* 3D Canvas Area */}
      <div className="w-full h-[300px] sm:h-[350px] relative">
        {inView && (
          <Canvas camera={{ position: [8, 6, 12], fov: 45 }}>
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            
            <OrbitControls enableDamping makeDefault />
            
            <group position={[0, 0, 0]}>
              
              {/* Axes X, Y, Z */}
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(1,0,0)} length={5} color="#475569" thickness={0.015} label="\vec{e}_x" />
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,1,0)} length={5} color="#475569" thickness={0.015} label="\vec{e}_z" />
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,1)} length={5} color="#475569" thickness={0.015} label="\vec{e}_y" />

              {/* The Conducting Cylinder */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[cylinderRadius, cylinderRadius, 6, 48]} />
                <meshStandardMaterial 
                  color="#64748b" 
                  transparent 
                  opacity={0.15} 
                  roughness={0.4} 
                  side={THREE.DoubleSide}
                />
              </mesh>
              <Line points={topCapPoints} color="#64748b" lineWidth={2} transparent opacity={0.6} />
              <Line points={bottomCapPoints} color="#64748b" lineWidth={2} transparent opacity={0.6} />

              {/* Animated J Field */}
              {showJ && <AnimatedJField radius={cylinderRadius} direction={jDirection} magnitude={jMagnitude} />}

              {/* B Field Line */}
              {showB && (
                <BFieldCircle radius={rM} yPos={0} color="#3b82f6" direction={jDirection} />
              )}

              {/* Point M */}
              <PointM rM={rM} jDirection={jDirection} jMagnitude={jMagnitude} R={cylinderRadius} showB={showB} showA={showA} />

            </group>
            
            <Environment preset="city" />
          </Canvas>
        )}
      </div>

      {/* Controls Panel */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
          
          {/* Toggles Group */}
          <div className="flex flex-col gap-1.5 w-full xl:w-auto shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3"/> Affichage & Sens
            </span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowJ(!showJ)} className={`flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border transition-all ${showJ ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                <span className="text-xs font-bold"><LatexMath math="\vec{j}"/></span>
              </button>
              <button onClick={() => setJDirection(d => d === 1 ? -1 : 1)} className="flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 transition-all shadow-sm">
                <span className="text-xs font-bold flex items-center gap-1">Sens {jDirection === 1 ? "↑" : "↓"}</span>
              </button>
              <button onClick={() => setShowB(!showB)} className={`flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border transition-all ${showB ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                <span className="text-xs font-bold"><LatexMath math="\vec{B}"/></span>
              </button>
              <button onClick={() => setShowA(!showA)} className={`flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border transition-all ${showA ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                <span className="text-xs font-bold"><LatexMath math="\vec{A}"/></span>
              </button>
            </div>
          </div>

          {/* Sliders Group */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center h-5">
                <span>Intensité J</span>
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.5" max="3" step="0.1" value={jMagnitude} onChange={(e) => setJMagnitude(parseFloat(e.target.value))} className="flex-1 accent-red-500 h-1.5" />
                <span className="text-xs text-slate-300 font-mono w-6 text-right shrink-0">{jMagnitude.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center h-5">
                <span>Rayon Cylindre (R)</span>
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.5" max="3" step="0.1" value={cylinderRadius} onChange={(e) => setCylinderRadius(parseFloat(e.target.value))} className="flex-1 accent-slate-400 h-1.5" />
                <span className="text-xs text-slate-300 font-mono w-6 text-right shrink-0">{cylinderRadius.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full bg-blue-500/5 p-2 rounded-lg border border-blue-500/10 -m-2">
              <label className="text-[10px] text-blue-300 font-bold uppercase tracking-wider flex justify-between items-center h-4">
                <span>Position Point M (r)</span>
              </label>
              <div className="flex items-center gap-3 mt-1">
                <input type="range" min="0.1" max="5" step="0.1" value={rM} onChange={(e) => setRM(parseFloat(e.target.value))} className="flex-1 accent-blue-400 h-1.5" />
                <span className="text-xs text-blue-300 font-mono w-6 text-right shrink-0">{rM.toFixed(1)}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
