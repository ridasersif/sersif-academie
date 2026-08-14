"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, RotateCcw } from "lucide-react";

// Arrow component for rendering physics vectors
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0], opacity = 1 }: any) {
  if (length <= 0.001 || opacity <= 0) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  
  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }

  const endPoint = start.clone().add(normalizedDir.clone().multiplyScalar(length));

  return (
    <group position={start} quaternion={quaternion}>
      {/* Arrow shaft */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthTest={false} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[thickness * 2.5, thickness * 5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthTest={false} />
      </mesh>
      {label && (
        <Html
          position={[
            labelOffset[0],
            length + labelOffset[1],
            labelOffset[2]
          ]}
          center
          className="pointer-events-none"
          zIndexRange={[100, 0]}
        >
          <div
            className="px-2 py-1 rounded text-xs font-bold text-white shadow-sm border border-white/20 backdrop-blur-md"
            style={{ backgroundColor: `${color}dd` }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// B-Field Indicators (Dots indicating Out of screen)
function MagneticFieldGrid({ bMagnitude }: { bMagnitude: number }) {
  const dots = [];
  const spacing = 1.5;
  for (let x = -2; x <= 2; x += spacing) {
    for (let y = -2; y <= 3; y += spacing) {
      dots.push(
        <group key={`${x}-${y}`} position={[x, y, 0.2]}>
          <mesh>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.3 + bMagnitude * 0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      );
    }
  }
  return <group>{dots}</group>;
}

// Resistor Component
function Resistor({ position, value }: { position: [number, number, number], value: number }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <Html position={[0, -0.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-800/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-mono border border-slate-600">
          R = {value.toFixed(1)} Ω
        </div>
      </Html>
    </group>
  );
}

function SimulationScene({ isPlaying, bMagnitude, resistance, resetTrigger }: any) {
  const rodRef = useRef<THREE.Group>(null);
  
  // Physics constants
  const g = 9.81; // Gravity
  const m = 0.05; // Mass of rod (kg)
  const l = 2.0;  // Length between rails (m)
  
  // State variables for physics
  const state = useRef({
    y: 3, // Initial height
    v: 0, // Initial velocity
  });

  // Reset physics on resetTrigger
  useEffect(() => {
    state.current = { y: 3, v: 0 };
    if (rodRef.current && rodRef.current.position) {
      rodRef.current.position.y = 3;
    }
  }, [resetTrigger]);

  const [physicsData, setPhysicsData] = useState({ v: 0, Fm: 0, P: m * g, I: 0 });

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const dt = Math.min(delta, 0.05); // cap delta to prevent explosions
    
    // k = (m * R) / (B^2 * l^2)  -> wait, the diff eq is dv/dt + (B^2 l^2 / mR) v = g
    // So tau = mR / (B^2 l^2)
    const tau = (m * resistance) / (bMagnitude * bMagnitude * l * l);
    const v_lim = g * tau;
    
    // Euler integration step
    const dv_dt = g - state.current.v / tau;
    
    state.current.v += dv_dt * dt;
    state.current.y -= state.current.v * dt;

    // Stop at bottom
    if (state.current.y < -3) {
      state.current.y = -3;
      state.current.v = 0;
    }

    if (rodRef.current) {
      rodRef.current.position.y = state.current.y;
    }

    const current_I = (bMagnitude * l * state.current.v) / resistance;
    const Fm = current_I * l * bMagnitude; // Laplace force

    setPhysicsData({
      v: state.current.v,
      Fm: Fm,
      P: m * g,
      I: current_I
    });
  });

  // Vector representations
  const pVec = new THREE.Vector3(0, -1, 0);
  const fmVec = new THREE.Vector3(0, 1, 0);
  const vVec = new THREE.Vector3(0, -1, 0);

  // Scaling factors for visual arrows
  const forceScale = 2.0; // 1 N = 2 units
  const vScale = 0.5; // 1 m/s = 0.5 units

  return (
    <group position={[0, 0, 0]}>
      {/* Rails */}
      <mesh position={[-l/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[l/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top connector (A - A') just for structure, usually not closed circuit at top */}
      <Line points={[[-l/2, 3.8, 0], [l/2, 3.8, 0]]} color="#64748b" lineWidth={2} dashed dashSize={0.2} gapSize={0.2} />
      
      {/* Labels for Rails */}
      <Html position={[-l/2 - 0.3, 3.8, 0]} className="text-sm font-bold text-slate-300 pointer-events-none">A</Html>
      <Html position={[l/2 + 0.3, 3.8, 0]} className="text-sm font-bold text-slate-300 pointer-events-none">A'</Html>
      <Html position={[-l/2 - 0.3, -3.8, 0]} className="text-sm font-bold text-slate-300 pointer-events-none">A₁</Html>
      <Html position={[l/2 + 0.3, -3.8, 0]} className="text-sm font-bold text-slate-300 pointer-events-none">A'₁</Html>

      {/* Resistor at the bottom */}
      <mesh position={[-l/2, -3.8, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.03, 0.03, l/2, 16]} />
         <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[l/2, -3.8, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.03, 0.03, l/2, 16]} />
         <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <Resistor position={[0, -3.8, 0]} value={resistance} />

      {/* Magnetic Field Visual */}
      <MagneticFieldGrid bMagnitude={bMagnitude} />
      <Html position={[2.5, 3, 0.2]} center className="pointer-events-none">
        <div className="text-sky-400 font-bold flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded">
          <span className="w-3 h-3 rounded-full border-2 border-sky-400 flex items-center justify-center">
             <div className="w-1 h-1 bg-sky-400 rounded-full" />
          </span>
          B (Sortant)
        </div>
      </Html>

      {/* Sliding Rod MN */}
      <group ref={rodRef} position={[0, 3, 0]}>
        <mesh rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.08, 0.08, l + 0.4, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
        <Html position={[-l/2 - 0.4, 0.3, 0]} className="text-sm font-bold text-slate-100 pointer-events-none">M</Html>
        <Html position={[l/2 + 0.4, 0.3, 0]} className="text-sm font-bold text-slate-100 pointer-events-none">N</Html>
        
        {/* Current Arrow inside rod (N to M, so right to left) */}
        {physicsData.I > 0.01 && (
          <group position={[0, 0, 0.2]}>
            <Arrow 
              start={new THREE.Vector3(l/4, 0, 0)} 
              dir={new THREE.Vector3(-1, 0, 0)} 
              length={0.6 + physicsData.I * 0.1} 
              color="#eab308" 
              label={`I = ${physicsData.I.toFixed(2)} A`}
              labelOffset={[0, 0.2, 0]}
              thickness={0.03}
            />
          </group>
        )}

        {/* Gravity Force Arrow */}
        <Arrow 
          start={new THREE.Vector3(0, 0, 0)} 
          dir={pVec} 
          length={physicsData.P * forceScale} 
          color="#ef4444" 
          label="P"
          labelOffset={[0, -0.3, 0]}
        />

        {/* Laplace Force Arrow */}
        {physicsData.Fm > 0.01 && (
          <Arrow 
            start={new THREE.Vector3(0, 0, 0)} 
            dir={fmVec} 
            length={physicsData.Fm * forceScale} 
            color="#22c55e" 
            label={`Fm = ${physicsData.Fm.toFixed(2)} N`}
            labelOffset={[0, 0.2, 0]}
          />
        )}

        {/* Velocity Arrow */}
        {physicsData.v > 0.01 && (
          <Arrow 
            start={new THREE.Vector3(0.5, 0, 0)} 
            dir={vVec} 
            length={physicsData.v * vScale} 
            color="#a855f7" 
            label={`v = ${physicsData.v.toFixed(1)} m/s`}
            labelOffset={[0.4, -0.2, 0]}
            thickness={0.03}
          />
        )}
      </group>
    </group>
  );
}

export default function LaplaceRails3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bMagnitude, setBMagnitude] = useState(1.0);
  const [resistance, setResistance] = useState(2.0);
  const [resetCounter, setResetCounter] = useState(0);

  const handleReset = () => {
    setIsPlaying(false);
    setResetCounter(prev => prev + 1);
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col my-8">
      {/* 3D Viewport */}
      <div className="relative h-[500px] w-full bg-gradient-to-b from-slate-900 to-slate-800">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} />
          
          <SimulationScene 
            isPlaying={isPlaying} 
            bMagnitude={bMagnitude} 
            resistance={resistance} 
            resetTrigger={resetCounter}
          />
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>

        {/* Play/Reset Overlay Controls */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isPlaying 
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
            }`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause" : "Lâcher la tige"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all backdrop-blur-md"
            title="Réinitialiser"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Champ Magnétique B Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-sky-300 flex items-center gap-2">
                Champ Magnétique B (T)
              </label>
              <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-sky-400 border border-sky-900/50">
                {bMagnitude.toFixed(1)} T
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={bMagnitude}
              onChange={(e) => setBMagnitude(parseFloat(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Un champ magnétique plus fort augmentera la force de Laplace qui s'oppose à la chute.
            </p>
          </div>

          {/* Résistance R Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-amber-500 flex items-center gap-2">
                Résistance R (Ω)
              </label>
              <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-amber-500 border border-amber-900/50">
                {resistance.toFixed(1)} Ω
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Une résistance plus faible permet un courant plus fort, freinant davantage la tige.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
