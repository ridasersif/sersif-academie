/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Eye, Navigation } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow component reused for vectors
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0] }: { start: THREE.Vector3, dir: THREE.Vector3, length: number, color: string, thickness?: number, label?: string, labelOffset?: [number, number, number] }) {
  if (length <= 0.001) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  
  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) {
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

// Solenoid Coils
function SolenoidCoils({ radius, length, turns }: { radius: number, length: number, turns: number }) {
  const points = useMemo(() => {
    const pts = [];
    const segmentsPerTurn = 64;
    const totalSegments = turns * segmentsPerTurn;
    for (let i = 0; i <= totalSegments; i++) {
      const t = i / segmentsPerTurn;
      const angle = t * Math.PI * 2;
      const y = (t / turns) * length - length / 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, length, turns]);

  return (
    <Line points={points} color="#ef4444" lineWidth={3} />
  );
}

// B Field inside Solenoid
function BFieldLines({ radius, length, direction, magnitude }: { radius: number, length: number, direction: number, magnitude: number }) {
  const linesCount = 5;
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < linesCount; i++) {
      const r = (radius * 0.7) * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      arr.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
    }
    // Center line
    arr.push(new THREE.Vector3(0, 0, 0));
    return arr;
  }, [radius]);

  const yStart = -length / 2;
  const B_len = length * 0.9;
  
  return (
    <group>
      {lines.map((pos, i) => (
        <Arrow key={i} start={new THREE.Vector3(pos.x, direction > 0 ? yStart : -yStart, pos.z)} dir={new THREE.Vector3(0, direction, 0)} length={B_len} color="#3b82f6" thickness={0.01} />
      ))}
      <Html position={[0, direction === 1 ? length / 2 + 0.5 : -length / 2 - 0.5, 0]} center>
        <div className="font-bold text-lg text-blue-500 drop-shadow-lg bg-black/40 px-2 rounded-full">
          <LatexMath math="\vec{B}_{int}" />
        </div>
      </Html>
    </group>
  );
}

// Point M and Vectors for Solenoid
function SolenoidPointM({ rM, iDirection, iMagnitude, R, showB, showA }: { rM: number, iDirection: number, iMagnitude: number, R: number, showB: boolean, showA: boolean }) {
  // A(r) = (mu0 n I r)/2 inside, (mu0 n I R^2)/(2r) outside
  // We'll scale magnitude for visual purposes: A_mag ~ r inside, ~ 1/r outside
  const B_mag = rM < R ? iMagnitude * 1.5 : 0;
  const A_mag = rM <= R ? (iMagnitude * rM) : (iMagnitude * R * R) / rM;
  
  const drawLengthB = B_mag; 
  const drawLengthA = A_mag;
  const mPos = new THREE.Vector3(rM, 0, 0);

  const circlePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * rM, 0, Math.sin(t) * rM));
    }
    return pts;
  }, [rM]);
  
  return (
    <group>
      <mesh position={mPos}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      <Arrow start={mPos} dir={new THREE.Vector3(1,0,0)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_r" labelOffset={[0.1, 0, 0]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,0,-1)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_\theta" labelOffset={[0, 0, -0.1]} />
      <Arrow start={mPos} dir={new THREE.Vector3(0,1,0)} length={0.8} color="#a855f7" thickness={0.015} label="\vec{e}_z" labelOffset={[0, 0.1, 0]} />

      {/* Vector B(M) */}
      {showB && B_mag > 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0, iDirection, 0)} 
          length={drawLengthB} 
          color="#3b82f6" 
          thickness={0.04} 
          label="\vec{B}(M)"
          labelOffset={[0, iDirection * 0.2, 0]}
        />
      )}
      {/* If B=0 outside, we can show a small dot or nothing, but since it's exactly 0, nothing is fine */}

      {/* Vector A(M) -> Always along e_theta (0,0,-1) multiplied by iDirection */}
      {showA && A_mag > 0 && (
        <Arrow 
          start={mPos} 
          dir={new THREE.Vector3(0, 0, -iDirection)} 
          length={drawLengthA} 
          color="#22c55e" 
          thickness={0.04} 
          label="\vec{A}(M)"
          labelOffset={[0, 0, -iDirection * 0.2]}
        />
      )}
      
      <Line points={[new THREE.Vector3(0,0,0), mPos]} color="#ffffff" transparent opacity={0.3} dashed dashScale={15} dashSize={0.15} gapSize={0.1} />
      
      {/* Circle of A(M) passing through M */}
      {showA && (
        <Line 
          points={circlePoints} 
          color="#22c55e" 
          lineWidth={2} 
          transparent opacity={0.4} dashed dashScale={10} dashSize={0.2} gapSize={0.2} 
        />
      )}
    </group>
  );
}

// Main visualization component
export default function SolenoidPotentialExercise3DCanvas() {
  const [showSolenoid, setShowSolenoid] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showA, setShowA] = useState(true);
  
  const [solenoidRadius, setSolenoidRadius] = useState(1.5);
  const [iDirection, setIDirection] = useState<1 | -1>(1);
  const [iMagnitude, setIMagnitude] = useState(1.5);
  const [rM, setRM] = useState(2.5);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl mt-4" ref={canvasContainerRef}>
      
      {/* 3D Canvas Area */}
      <div className="w-full h-[300px] sm:h-[350px] relative">
        {inView && (
          <Canvas camera={{ position: [7, 5, 10], fov: 45 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            
            <OrbitControls enableDamping makeDefault />
            
            <group position={[0, 0, 0]}>
              
              {/* Axes X, Y, Z */}
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(1,0,0)} length={5} color="#475569" thickness={0.015} label="\vec{e}_x" />
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,1,0)} length={5} color="#475569" thickness={0.015} label="\vec{e}_z" />
              <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,1)} length={5} color="#475569" thickness={0.015} label="\vec{e}_y" />

              {/* The Solenoid */}
              {showSolenoid && (
                <group>
                  <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[solenoidRadius, solenoidRadius, 6, 12, 1, true]} />
                    <meshStandardMaterial 
                      color="#64748b" 
                      transparent 
                      opacity={0.1} 
                      roughness={0.4} 
                      side={THREE.DoubleSide}
                      depthWrite={false}
                    />
                  </mesh>
                  <SolenoidCoils radius={solenoidRadius} length={6} turns={15} />
                </group>
              )}

              {/* B Field Lines */}
              {showB && showSolenoid && <BFieldLines radius={solenoidRadius} length={6} direction={iDirection} magnitude={iMagnitude} />}

              {/* Point M */}
              <SolenoidPointM rM={rM} iDirection={iDirection} iMagnitude={iMagnitude} R={solenoidRadius} showB={showB} showA={showA} />

            </group>
                      </Suspense>
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
              <button onClick={() => setShowSolenoid(!showSolenoid)} className={`flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border transition-all ${showSolenoid ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}>
                <span className="text-xs font-bold">Solénoïde</span>
              </button>
              <button onClick={() => setIDirection(d => d === 1 ? -1 : 1)} className="flex-1 xl:flex-none px-4 py-2 rounded-md flex justify-center items-center gap-1 border bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 transition-all shadow-sm">
                <span className="text-xs font-bold flex items-center gap-1">Sens {iDirection === 1 ? "↑" : "↓"}</span>
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
                <span>Courant nI</span>
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.5" max="3" step="0.1" value={iMagnitude} onChange={(e) => setIMagnitude(parseFloat(e.target.value))} className="flex-1 accent-orange-500 h-1.5" />
                <span className="text-xs text-slate-300 font-mono w-6 text-right shrink-0">{iMagnitude.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center h-5">
                <span>Rayon Solénoïde (R)</span>
              </label>
              <div className="flex items-center gap-3">
                <input type="range" min="0.5" max="3" step="0.1" value={solenoidRadius} onChange={(e) => setSolenoidRadius(parseFloat(e.target.value))} className="flex-1 accent-slate-400 h-1.5" />
                <span className="text-xs text-slate-300 font-mono w-6 text-right shrink-0">{solenoidRadius.toFixed(1)}</span>
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
