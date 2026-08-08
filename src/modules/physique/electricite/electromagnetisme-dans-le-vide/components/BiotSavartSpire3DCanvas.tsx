"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Sphere, Cone, Tube, Html } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

// --- Vectors & Arrows Helper ---
interface ArrowProps {
  start: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  color: string;
  headSize?: number;
  thickness?: number;
  opacity?: number;
  dashed?: boolean;
}

const Arrow3D: React.FC<ArrowProps> = ({
  start,
  dir,
  length,
  color,
  headSize = 0.4,
  thickness = 2,
  opacity = 1,
  dashed = false,
}) => {
  const normDir = dir.clone().normalize();
  const end = start.clone().add(normDir.clone().multiplyScalar(length));
  
  const linePoints = [start, end];

  return (
    <group>
      <Line
        points={linePoints}
        color={color}
        lineWidth={thickness}
        transparent
        opacity={opacity}
        dashed={dashed}
        dashSize={0.2}
        gapSize={0.1}
      />
      <Cone
        args={[headSize * 0.4, headSize]}
        position={end}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          normDir
        )}
        material={new THREE.MeshBasicMaterial({ color, transparent: true, opacity })}
      />
    </group>
  );
};

const SpireScene = ({ radius, distance, currentDirection, planeMode, circuitShape }: { radius: number, distance: number, currentDirection: number, planeMode: "none" | "sym" | "antisym", circuitShape: "spire" | "bobine" | "solenoide" }) => {
  const [time, setTime] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    setTime(t => t + delta * 2);
    if (groupRef.current && groupRef.current.scale.x < 0.84) {
       groupRef.current.scale.lerp(new THREE.Vector3(0.85, 0.85, 0.85), delta * 8);
    }
  });

  // Geometry
  const pM = new THREE.Vector3(distance, -radius, 0); 
  const rDist = Math.sqrt(radius * radius + distance * distance);
  
  // Field calculation
  const sinAlpha = radius / rDist;
  const bMag = (Math.pow(sinAlpha, 3) / radius) * 8; 
  
  const pVec = new THREE.Vector3(0, radius, 0);
  const mVec = new THREE.Vector3(distance, 0, 0);
  const vecPM = new THREE.Vector3().subVectors(mVec, pVec);
  
  const dbDir = new THREE.Vector3(radius, distance, 0).normalize();
  if (currentDirection === -1) dbDir.negate();
  
  const dbMag = bMag * 1.5; 

  const endDb = mVec.clone().add(dbDir.clone().multiplyScalar(dbMag));
  const endB = mVec.clone().add(new THREE.Vector3(currentDirection, 0, 0).multiplyScalar(bMag));

  // Alpha angle
  const thetaStartAlpha = Math.atan2(radius, -distance);
  const thetaLengthAlpha = Math.PI - thetaStartAlpha;
  const midAlpha = thetaStartAlpha + thetaLengthAlpha / 2;
  const alphaLabelPos = new THREE.Vector3(distance + 1.2 * Math.cos(midAlpha), 1.2 * Math.sin(midAlpha), 0);

  // Theta angle
  const angleDb = Math.atan2(dbDir.y, dbDir.x);
  let thetaStartTheta = 0;
  let thetaLengthTheta = angleDb;
  if (angleDb < 0) {
     thetaStartTheta = angleDb;
     thetaLengthTheta = -angleDb;
  }
  const midTheta = thetaStartTheta + thetaLengthTheta / 2;
  const thetaLabelPos = new THREE.Vector3(distance + 1.2 * Math.cos(midTheta), 1.2 * Math.sin(midTheta), 0);

  return (
          <group ref={groupRef} scale={[0.01, 0.01, 0.01]}>
            {/* Grid and Axes */}
            <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -4, 0]} />
            <Arrow3D start={new THREE.Vector3(-8, 0, 0)} dir={new THREE.Vector3(1, 0, 0)} length={16} color="#334155" thickness={1} headSize={0.15} opacity={0.5} />
            
            <Arrow3D start={new THREE.Vector3(-8, 0, 0)} dir={new THREE.Vector3(1, 0, 0)} length={16} color="#334155" thickness={1} headSize={0.15} opacity={0.5} />
            
            {/* The Circuits */}
            {circuitShape === "spire" && (
              <group>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                  <torusGeometry args={[radius, 0.08, 64, 100]} />
                  <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.2} emissive="#c2410c" emissiveIntensity={0.5} />
                </mesh>
                {/* Highlight dl segment */}
                <mesh rotation={[0, Math.PI / 2, Math.PI/2 - 0.15]}>
                  <torusGeometry args={[radius, 0.082, 16, 32, 0.3]} />
                  <meshStandardMaterial color="#f472b6" emissive="#be185d" emissiveIntensity={0.8} />
                </mesh>
              </group>
            )}

            {circuitShape === "bobine" && (
              <group>
                {[...Array(5)].map((_, i) => (
                  <mesh key={`b-${i}`} rotation={[0, Math.PI / 2, 0]} position={[(i - 2) * 0.1, 0, 0]}>
                    <torusGeometry args={[radius, 0.06, 32, 64]} />
                    <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.2} emissive="#0891b2" emissiveIntensity={0.5} />
                  </mesh>
                ))}
                {/* Highlight dl segment on middle spire */}
                <mesh rotation={[0, Math.PI / 2, Math.PI/2 - 0.15]}>
                  <torusGeometry args={[radius, 0.065, 16, 32, 0.3]} />
                  <meshStandardMaterial color="#f472b6" emissive="#be185d" emissiveIntensity={0.8} />
                </mesh>
              </group>
            )}

            {circuitShape === "solenoide" && (() => {
              class HelixCurve extends THREE.Curve<THREE.Vector3> {
                constructor() { super(); }
                getPoint(t: number, optionalTarget = new THREE.Vector3()) {
                  const turns = 15;
                  const length = 6;
                  const x = (t - 0.5) * length;
                  const angle = t * Math.PI * 2 * turns;
                  return optionalTarget.set(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
                }
              }
              const helix = new HelixCurve();
              return (
                <group>
                  <mesh>
                    <tubeGeometry args={[helix, 300, 0.04, 8, false]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.2} emissive="#d97706" emissiveIntensity={0.5} />
                  </mesh>
                  {/* Fake highlight for dl */}
                  <mesh rotation={[0, Math.PI / 2, Math.PI/2 - 0.15]} position={[0, 0, 0]}>
                    <torusGeometry args={[radius, 0.06, 16, 32, 0.3]} />
                    <meshStandardMaterial color="#f472b6" emissive="#be185d" emissiveIntensity={0.8} />
                  </mesh>
                </group>
              );
            })()}

            {/* Current Direction representation (moving spheres) */}
            {circuitShape === "solenoide" 
              ? [...Array(45)].map((_, i) => {
                  const t = (i / 45 + (time * 0.1 * currentDirection)) % 1.0;
                  const normalizedT = t < 0 ? t + 1 : t;
                  const turns = 15;
                  const length = 6;
                  const x = (normalizedT - 0.5) * length;
                  const angle = normalizedT * Math.PI * 2 * turns;
                  const y = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;
                  
                  return (
                     <Sphere key={`curr-sol-${i}`} args={[0.08, 16, 16]} position={[x, y, z]}>
                       <meshBasicMaterial color="#fcd34d" />
                     </Sphere>
                  );
                })
              : (circuitShape === "bobine" ? [-0.2, -0.1, 0, 0.1, 0.2] : [0]).flatMap((xOffset, loopIdx) => 
                  [0, Math.PI/2, Math.PI, 3*Math.PI/2, Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4].map((angleOffset, i) => {
                    const angle = angleOffset + time * currentDirection;
                    const y = radius * Math.cos(angle);
                    const z = radius * Math.sin(angle);
                    return (
                       <Sphere key={`curr-${loopIdx}-${i}`} args={[0.08, 16, 16]} position={[xOffset, y, z]}>
                         <meshBasicMaterial color="#fcd34d" />
                       </Sphere>
                    );
                  })
                )
            }

            {/* Point M */}
            <Sphere args={[0.15, 16, 16]} position={mVec}>
              <meshBasicMaterial color="#34d399" />
            </Sphere>

            {/* Point O (Center) */}
            <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#94a3b8" />
            </Sphere>
            <Html position={[0, -0.4, 0]} center className="pointer-events-none">
              <span className="text-slate-400 font-bold italic text-sm">O</span>
            </Html>

            {/* Unit Vector i */}
            <Arrow3D 
              start={new THREE.Vector3(0, 0, 0)} 
              dir={new THREE.Vector3(1, 0, 0)} 
              length={1.5} 
              color="#e2e8f0" 
              thickness={1.5} 
              headSize={0.15} 
            />
            <Html position={[1.5, 0.3, 0]} center className="pointer-events-none">
              <span className="text-slate-200 font-black italic text-xs drop-shadow-md">i</span>
            </Html>

            {/* Point P (Top of spire) */}
            <Sphere args={[0.1, 16, 16]} position={pVec}>
              <meshBasicMaterial color="#f87171" />
            </Sphere>
            <Html position={[0, radius + 0.4, 0]} center className="pointer-events-none">
              <span className="text-red-400 font-bold italic text-sm drop-shadow-md">P</span>
            </Html>

            {/* Radius R */}
            <Line
              points={[new THREE.Vector3(0, 0, 0), pVec]}
              color="#fb923c"
              lineWidth={1.5}
              dashed
              dashSize={0.2}
              gapSize={0.1}
            />
            <Html position={[0, radius / 2, 0]} center className="pointer-events-none pr-4">
              <span className="text-orange-400 font-bold italic text-sm drop-shadow-md">R</span>
            </Html>

            {/* Vector PM (r) */}
            <Arrow3D 
              start={pVec} 
              dir={vecPM} 
              length={rDist} 
              color="#22d3ee" 
              thickness={1.5}
              headSize={0.2}
              dashed={true}
            />

            {/* Unit vector u at P */}
            <Arrow3D 
              start={pVec} 
              dir={vecPM.clone().normalize()} 
              length={1.0} 
              color="#ef4444" 
              thickness={1.5}
              headSize={0.2}
            />
            <Html position={pVec.clone().add(vecPM.clone().normalize().multiplyScalar(1.2))} center className="pointer-events-none mb-4">
              <span className="text-red-500 font-black italic text-xs drop-shadow-md">u</span>
            </Html>
            
            {/* Angle Alpha */}
            <mesh position={mVec}>
               <circleGeometry args={[0.8, 32, thetaStartAlpha, thetaLengthAlpha]} />
               <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
            <Line
              points={[...Array(33)].map((_, i) => new THREE.Vector3(distance + 0.8 * Math.cos(thetaStartAlpha + (i/32)*thetaLengthAlpha), 0.8 * Math.sin(thetaStartAlpha + (i/32)*thetaLengthAlpha), 0))}
              color="#a78bfa"
              lineWidth={2}
            />
            <Html position={alphaLabelPos} center className="pointer-events-none">
              <span className="text-purple-400 font-black italic text-sm drop-shadow-md">α</span>
            </Html>

            {/* Angle Theta */}
            <mesh position={mVec}>
               <circleGeometry args={[0.9, 32, thetaStartTheta, thetaLengthTheta]} />
               <meshBasicMaterial color="#f472b6" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
            <Line
              points={[...Array(33)].map((_, i) => new THREE.Vector3(distance + 0.9 * Math.cos(thetaStartTheta + (i/32)*thetaLengthTheta), 0.9 * Math.sin(thetaStartTheta + (i/32)*thetaLengthTheta), 0))}
              color="#f472b6"
              lineWidth={2}
            />
            <Html position={thetaLabelPos} center className="pointer-events-none">
              <span className="text-pink-400 font-black italic text-sm drop-shadow-md">θ</span>
            </Html>

            {/* dB vector at M */}
            <Arrow3D 
              start={mVec}
              dir={dbDir}
              length={dbMag}
              color="#fb7185"
              headSize={0.15}
              thickness={1.2}
            />
            <Html position={endDb} center className="pointer-events-none -mt-4">
              <span className="text-rose-400 font-black italic text-xs drop-shadow-md">dB</span>
            </Html>

            {/* Total B vector at M */}
            <Arrow3D 
              start={mVec}
              dir={new THREE.Vector3(currentDirection, 0, 0)}
              length={bMag}
              color="#10b981"
              thickness={1.5}
              headSize={0.2}
            />
            <Html position={endB} center className="pointer-events-none -mt-5">
              <span className="text-emerald-400 font-black italic text-sm drop-shadow-md">B</span>
            </Html>

            {/* dl vector at P */}
            <Arrow3D 
              start={pVec}
              dir={new THREE.Vector3(0, 0, currentDirection)}
              length={1.5}
              color="#f472b6"
              thickness={1.5}
              headSize={0.2}
            />
            <Html position={pVec.clone().add(new THREE.Vector3(0, 0, currentDirection * 1.5))} center className="pointer-events-none -mt-4">
              <span className="text-pink-400 font-black italic text-xs drop-shadow-md">dl</span>
            </Html>
            
            {/* Field line simple visualizer */}
            <Line
              points={[new THREE.Vector3(-8, 0, 0), new THREE.Vector3(8, 0, 0)]}
              color="#10b981"
              lineWidth={0.5}
              transparent
              opacity={0.3}
            />

            {/* Planes */}
            {planeMode === "sym" && (
               <group>
                 <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
                   <planeGeometry args={[8, 8]} />
                   <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
                 </mesh>
                 <Line
                   points={[new THREE.Vector3(0, -4, -4), new THREE.Vector3(0, 4, -4), new THREE.Vector3(0, 4, 4), new THREE.Vector3(0, -4, 4), new THREE.Vector3(0, -4, -4)]}
                   color="#60a5fa"
                   lineWidth={1}
                   dashed
                   dashSize={0.4}
                   gapSize={0.2}
                   transparent
                   opacity={0.5}
                 />
                 <Html position={[0, 4, 4]} center className="pointer-events-none">
                    <div className="bg-slate-900/90 border border-blue-500/30 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                       <span className="text-blue-400 font-bold text-[10px] leading-tight block text-center">Plan Π<br/>(Symétrie)</span>
                    </div>
                 </Html>
               </group>
            )}

            {planeMode === "antisym" && (
               <group>
                 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                   <planeGeometry args={[8, 8]} />
                   <meshBasicMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
                 </mesh>
                 <Line
                   points={[new THREE.Vector3(-4, 0, -4), new THREE.Vector3(4, 0, -4), new THREE.Vector3(4, 0, 4), new THREE.Vector3(-4, 0, 4), new THREE.Vector3(-4, 0, -4)]}
                   color="#34d399"
                   lineWidth={1}
                   dashed
                   dashSize={0.4}
                   gapSize={0.2}
                   transparent
                   opacity={0.5}
                 />
                 <Html position={[4, 0, 4]} center className="pointer-events-none">
                    <div className="bg-slate-900/90 border border-emerald-500/30 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                       <span className="text-emerald-400 font-bold text-[10px] leading-tight block text-center">Plan Π*<br/>(Antisymétrie)</span>
                    </div>
                 </Html>
               </group>
            )}
          </group>
  );
};

export default function BiotSavartSpire3DCanvas() {
  const [radius, setRadius] = useState(2.0); // Radius R of the loop
  const [distance, setDistance] = useState(3.0); // Distance x of point M on axis
  const [currentDirection, setCurrentDirection] = useState<1 | -1>(1); // Direction of I
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  const [circuitShape, setCircuitShape] = useState<"spire" | "bobine" | "solenoide">("spire");

  // Angle alpha between X axis and PM
  const rDist = Math.sqrt(radius * radius + distance * distance);
  const sinAlpha = radius / rDist;

  const percR = ((radius - 1) / (4 - 1)) * 100;
  const percX = ((distance - (-5)) / (5 - (-5))) * 100;

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col">
      {/* Choix du type de circuit */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3 justify-center w-full">
        <button 
          onClick={() => setCircuitShape("spire")} 
          className={`px-3 py-2 rounded-lg font-bold text-xs transition-all border flex items-center justify-center gap-2 ${
            circuitShape === "spire" 
              ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              : "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800"
          }`}
        >
          Spire Circulaire
        </button>
        <button 
          onClick={() => setCircuitShape("bobine")} 
          className={`px-3 py-2 rounded-lg font-bold text-xs transition-all border flex items-center justify-center gap-2 ${
            circuitShape === "bobine" 
              ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              : "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800"
          }`}
        >
          Bobine Plate
        </button>
        <button 
          onClick={() => setCircuitShape("solenoide")} 
          className={`px-3 py-2 rounded-lg font-bold text-xs transition-all border flex items-center justify-center gap-2 ${
            circuitShape === "solenoide" 
              ? "bg-amber-500 text-white border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              : "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800"
          }`}
        >
          Solénoïde
        </button>
      </div>

      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* HUD Légende */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 sm:p-3 rounded-xl shadow-xl flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              <span className="text-slate-300 font-medium">Spire (Courant I)</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="text-slate-300 font-medium">Champ Total B(M)</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span className="text-slate-300 font-medium">Champ élémentaire dB</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span className="text-slate-300 font-medium">Vecteur r = PM</span>
            </div>
          </div>
        </div>

        <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            makeDefault 
            minDistance={2} 
            maxDistance={20}
          />
          
          <SpireScene radius={radius} distance={distance} currentDirection={currentDirection} planeMode={planeMode} circuitShape={circuitShape} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
        
        {/* Row 1: Controls */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Group 1: Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
            {/* Toggle: Sens du courant */}
            <div className="flex items-center bg-slate-800/50 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setCurrentDirection(-1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentDirection === -1 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ↑
              </button>
              <button
                onClick={() => setCurrentDirection(1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentDirection === 1 
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                ↓
              </button>
            </div>

            {/* Toggle: Symetry */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPlaneMode(planeMode === "sym" ? "none" : "sym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "sym" 
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                }`}
              >
                Π
              </button>
              <button
                onClick={() => setPlaneMode(planeMode === "antisym" ? "none" : "antisym")}
                className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                  planeMode === "antisym" 
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                }`}
              >
                Π*
              </button>
            </div>
          </div>

          {/* Group 2: Sliders & Reset */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full lg:w-auto">
            {/* Slider: R */}
            <div className="flex items-center gap-2 w-full sm:w-48 md:w-64 shrink-0">
              <label className="text-[10px] font-bold text-orange-400 uppercase w-2">R</label>
              <input 
                type="range" min={1} max={4} step={0.1} value={radius} 
                onChange={(e) => setRadius(parseFloat(e.target.value))} 
                className="w-full h-2 rounded-full appearance-none cursor-pointer shadow-inner [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
                style={{ background: `linear-gradient(to right, #fb923c ${percR}%, #f1f5f9 ${percR}%)` }} 
              />
            </div>

            {/* Slider: x */}
            <div className="flex items-center gap-2 w-full sm:w-48 md:w-64 shrink-0">
              <label className="text-[10px] font-bold text-emerald-400 uppercase w-2">x</label>
              <input 
                type="range" min={-5} max={5} step={0.1} value={distance} 
                onChange={(e) => setDistance(parseFloat(e.target.value))} 
                className="w-full h-2 rounded-full appearance-none cursor-pointer shadow-inner [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md" 
                style={{ background: `linear-gradient(to right, #34d399 ${percX}%, #f1f5f9 ${percX}%)` }} 
              />
            </div>

            {/* Reset */}
            <button 
              onClick={() => { setRadius(2.0); setDistance(3.0); setCurrentDirection(1); setPlaneMode("none"); }}
              className="w-8 h-8 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0"
            >
              ⟲
            </button>
          </div>
        </div> {/* End Row 1 */}

        {/* Row 2: Result display */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 text-emerald-500 dark:text-emerald-400 overflow-x-auto py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner">
          <LatexMath 
             math={`\\vec{B}(M) = \\frac{\\mu_0 I R^2}{2(R^2+x^2)^{3/2}} \\vec{i}`} 
             block={false} 
             className="text-sm sm:text-base whitespace-nowrap font-bold"
          />
          <span className="hidden md:block text-slate-500">ou bien</span>
          <LatexMath 
             math={`\\vec{B}(M) = \\frac{\\mu_0 I}{2 R} \\sin^3(\\alpha) \\vec{i} \\approx ${ (currentDirection * Math.pow(sinAlpha, 3) / radius).toFixed(3) } \\frac{\\mu_0 I}{2} \\vec{i}`} 
             block={false} 
             className="text-[13px] sm:text-[15px] font-bold whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
}
