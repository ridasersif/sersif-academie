"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Settings, Eye, EyeOff, Navigation, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow component reused for vectors
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0] }: { start: THREE.Vector3, dir: THREE.Vector3, length: number, color: string, thickness?: number, label?: string, labelOffset?: [number, number, number] }) {
  const normalizedDir = dir.clone().normalize();
  // Handle edge case where direction is exactly parallel to up vector
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
        {/* Cylinder (shaft) */}
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        {/* Cone (head) */}
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 4, 8]} />
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

// B Field Circle
function BFieldCircle({ radius, yPos, color, direction }: { radius: number, yPos: number, color: string, direction: number }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * radius, yPos, Math.sin(t) * radius));
    }
    return pts;
  }, [radius, yPos]);

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.4} />
      {/* Little arrow head to show direction */}
      <Arrow start={new THREE.Vector3(radius, yPos, 0)} dir={new THREE.Vector3(0, 0, -direction)} length={0.4} color={color} thickness={0.03} />
      <Arrow start={new THREE.Vector3(-radius, yPos, 0)} dir={new THREE.Vector3(0, 0, direction)} length={0.4} color={color} thickness={0.03} />
      <Arrow start={new THREE.Vector3(0, yPos, radius)} dir={new THREE.Vector3(direction, 0, 0)} length={0.4} color={color} thickness={0.03} />
      <Arrow start={new THREE.Vector3(0, yPos, -radius)} dir={new THREE.Vector3(-direction, 0, 0)} length={0.4} color={color} thickness={0.03} />
    </group>
  );
}

// Animated Current Density (J)
function AnimatedJField({ radius, direction, magnitude }: { radius: number, direction: number, magnitude: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const vecs = [];
    for (let r = 0.2; r < radius; r += 0.5) {
      const count = Math.floor(r * 5);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        vecs.push({ x, z, yOffset: -2 });
        vecs.push({ x, z, yOffset: 0 });
        vecs.push({ x, z, yOffset: 2 });
      }
    }
    // Add one in the center
    vecs.push({ x: 0, z: 0, yOffset: -2 });
    vecs.push({ x: 0, z: 0, yOffset: 0 });
    vecs.push({ x: 0, z: 0, yOffset: 2 });
    return vecs;
  }, [radius]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const speed = 3 * magnitude * direction;
      groupRef.current.children.forEach((child) => {
        child.position.y += speed * delta;
        if (direction > 0 && child.position.y > 3) child.position.y -= 6;
        if (direction < 0 && child.position.y < -3) child.position.y += 6;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Arrow 
          key={i} 
          start={new THREE.Vector3(item.x, item.yOffset, item.z)} 
          dir={new THREE.Vector3(0, direction, 0)} 
          length={0.8} 
          color="#ef4444" 
          thickness={0.03 * magnitude} 
        />
      ))}
    </group>
  );
}

// Point M and its vectors
function PointM({ rM, jDirection, jMagnitude, R }: { rM: number, jDirection: number, jMagnitude: number, R: number }) {
  // Physics formulas
  const B_mag = rM <= R ? (jMagnitude * rM) / 2 : (jMagnitude * R * R) / (2 * rM);
  
  const A0 = 2.5;
  let A_mag = 0;
  if (rM <= R) {
    A_mag = A0 - (jMagnitude * rM * rM) / 4;
  } else {
    A_mag = A0 - (jMagnitude * R * R) / 4 - (jMagnitude * R * R / 2) * Math.log(rM / R);
  }
  
  const mPos = new THREE.Vector3(rM, 0, 0);
  
  return (
    <group>
      {/* Point M */}
      <mesh position={mPos}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html position={[rM + 0.2, 0.2, 0]}>
        <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">M</div>
      </Html>
      
      {/* Basis Vectors at M */}
      <Arrow start={mPos} dir={new THREE.Vector3(1,0,0)} length={1} color="#94a3b8" thickness={0.015} label="\vec{e}_r" labelOffset={[0.2, 0, 0]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,0,-1)} length={1} color="#94a3b8" thickness={0.015} label="\vec{e}_\theta" labelOffset={[0, 0, -0.2]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,1,0)} length={1} color="#94a3b8" thickness={0.015} label="\vec{e}_z" labelOffset={[0, 0.2, 0]} />

      {/* Vector B at M */}
      {B_mag > 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0,0, -jDirection)} 
          length={B_mag * 1.5} 
          color="#3b82f6" 
          thickness={0.05} 
          label="\vec{B}(M)"
          labelOffset={[0, -0.3, -jDirection * 0.2]}
        />
      )}

      {/* Vector A at M */}
      {A_mag !== 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0, Math.sign(A_mag) * jDirection, 0)} 
          length={Math.abs(A_mag)} 
          color="#22c55e" 
          thickness={0.05} 
          label="\vec{A}(M)"
          labelOffset={[0.2, Math.sign(A_mag) * jDirection * 0.2, 0]}
        />
      )}
      
      {/* Dashed line from origin to M */}
      <Line points={[new THREE.Vector3(0,0,0), mPos]} color="#ffffff" transparent opacity={0.3} dashed dashScale={10} dashSize={0.2} gapSize={0.1} />
    </group>
  );
}


// Main visualization component
export default function VectorPotentialExercise3DCanvas() {
  // Controls state
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

  // Background A vectors calculation (everywhere)
  const aVectors = useMemo(() => {
    const vecs = [];
    const maxR = 4;
    for (let r = 0.5; r <= maxR; r += 1.0) {
      const count = Math.floor(r * 3);
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        
        const A0 = 2.5;
        let magnitude = 0;
        if (r <= cylinderRadius) {
          magnitude = A0 - (jMagnitude * r * r) / 4;
        } else {
          magnitude = A0 - (jMagnitude * cylinderRadius * cylinderRadius) / 4 - (jMagnitude * cylinderRadius * cylinderRadius / 2) * Math.log(r / cylinderRadius);
        }
        
        magnitude = Math.max(0.1, magnitude);
        vecs.push({ pos: new THREE.Vector3(x, 0, z), length: magnitude });
      }
    }
    return vecs;
  }, [cylinderRadius, jMagnitude]);

  const topCapPoints = useMemo(() => {
    const pts = [];
    for(let i=0; i<=32; i++) {
      const t = (i/32)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(t)*cylinderRadius, 3, Math.sin(t)*cylinderRadius));
    }
    return pts;
  }, [cylinderRadius]);

  const bottomCapPoints = useMemo(() => {
    const pts = [];
    for(let i=0; i<=32; i++) {
      const t = (i/32)*Math.PI*2;
      pts.push(new THREE.Vector3(Math.cos(t)*cylinderRadius, -3, Math.sin(t)*cylinderRadius));
    }
    return pts;
  }, [cylinderRadius]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800" ref={canvasContainerRef}>
      
      {/* Controls Overlay */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 max-w-[220px]">
        <h3 className="text-white text-xs font-bold mb-1 flex items-center gap-1"><Settings className="w-3 h-3"/> Paramètres</h3>
        
        {/* Toggles */}
        <div className="grid grid-cols-3 gap-1 mb-2 border-b border-white/10 pb-2">
          <button onClick={() => setShowJ(!showJ)} className={`p-1.5 rounded flex justify-center ${showJ ? 'bg-red-500/20' : 'hover:bg-white/10'}`}>
            <span className={`text-[10px] font-bold ${showJ ? 'text-red-400' : 'text-slate-500'}`}>J</span>
          </button>
          <button onClick={() => setShowB(!showB)} className={`p-1.5 rounded flex justify-center ${showB ? 'bg-blue-500/20' : 'hover:bg-white/10'}`}>
            <span className={`text-[10px] font-bold ${showB ? 'text-blue-400' : 'text-slate-500'}`}>B</span>
          </button>
          <button onClick={() => setShowA(!showA)} className={`p-1.5 rounded flex justify-center ${showA ? 'bg-green-500/20' : 'hover:bg-white/10'}`}>
            <span className={`text-[10px] font-bold ${showA ? 'text-green-400' : 'text-slate-500'}`}>A</span>
          </button>
        </div>

        {/* J Direction */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-300 flex items-center gap-1"><Navigation className="w-3 h-3"/> Sens de J</label>
          <button onClick={() => setJDirection(d => d === 1 ? -1 : 1)} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-slate-700">
            {jDirection === 1 ? "Haut ↑" : "Bas ↓"}
          </button>
        </div>
        
        {/* J Magnitude */}
        <div>
          <label className="text-[10px] text-slate-400 mb-1 flex justify-between">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3"/> Intensité J</span>
            <span>{jMagnitude.toFixed(1)}</span>
          </label>
          <input type="range" min="0.5" max="2" step="0.1" value={jMagnitude} onChange={(e) => setJMagnitude(parseFloat(e.target.value))} className="w-full accent-red-500 h-1.5" />
        </div>

        {/* Cylinder Radius */}
        <div>
          <label className="text-[10px] text-slate-400 mb-1 flex justify-between">
            <span>Rayon Cylindre (R)</span>
            <span>{cylinderRadius.toFixed(1)}</span>
          </label>
          <input type="range" min="0.5" max="3" step="0.1" value={cylinderRadius} onChange={(e) => setCylinderRadius(parseFloat(e.target.value))} className="w-full accent-slate-400 h-1.5" />
        </div>

        {/* Point M Position */}
        <div className="bg-blue-900/20 p-2 rounded border border-blue-500/20 mt-1">
          <label className="text-[10px] text-blue-300 mb-1 flex justify-between font-bold">
            <span>Position Point M (r)</span>
            <span>{rM.toFixed(1)}</span>
          </label>
          <input type="range" min="0.1" max="5" step="0.1" value={rM} onChange={(e) => setRM(parseFloat(e.target.value))} className="w-full accent-blue-400 h-1.5" />
        </div>
      </div>

      <div className="flex-1 w-full h-full">
        {inView && (
          <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
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
                <cylinderGeometry args={[cylinderRadius, cylinderRadius, 6, 32]} />
                <meshPhysicalMaterial 
                  color="#94a3b8" 
                  transparent 
                  opacity={0.15} 
                  roughness={0.1} 
                  transmission={0.9} 
                  thickness={0.1} 
                />
              </mesh>
              {/* Top/Bottom caps */}
              <Line points={topCapPoints} color="#64748b" />
              <Line points={bottomCapPoints} color="#64748b" />

              {/* Animated J Field */}
              {showJ && <AnimatedJField radius={cylinderRadius} direction={jDirection} magnitude={jMagnitude} />}

              {/* B Field Lines (Background context) */}
              {showB && (
                <>
                  <BFieldCircle radius={cylinderRadius * 0.5} yPos={-2} color="#3b82f6" direction={jDirection} />
                  <BFieldCircle radius={cylinderRadius} yPos={-1} color="#3b82f6" direction={jDirection} />
                  <BFieldCircle radius={cylinderRadius * 1.5} yPos={1} color="#3b82f6" direction={jDirection} />
                  <BFieldCircle radius={cylinderRadius * 2.0} yPos={2} color="#3b82f6" direction={jDirection} />
                </>
              )}

              {/* A Vectors (Background context) */}
              {showA && aVectors.map((data, i) => (
                <Arrow 
                  key={`a-${i}`} 
                  start={new THREE.Vector3(data.pos.x, -data.length/2 * jDirection, data.pos.z)} 
                  dir={new THREE.Vector3(0, jDirection, 0)} 
                  length={data.length} 
                  color="#22c55e" 
                  thickness={0.015} 
                />
              ))}

              {/* Point M and its specific vectors */}
              <PointM rM={rM} jDirection={jDirection} jMagnitude={jMagnitude} R={cylinderRadius} />

            </group>
            
            <Environment preset="city" />
          </Canvas>
        )}
      </div>
      
      {/* Footer Instructions */}
      <div className="bg-slate-900/80 p-2 text-center text-[10px] sm:text-xs text-slate-400 border-t border-slate-800">
        Modifiez les paramètres pour voir l'impact sur le point M • Glissez pour tourner la caméra
      </div>
    </div>
  );
}
