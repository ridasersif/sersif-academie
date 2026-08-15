"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Float, Sparkles, Line, Trail } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

// Premium Arrow component for physics vectors
function Arrow({ start, dir, length, color, thickness = 0.08, label, labelOffset = [0, 0, 0] }: any) {
  if (length <= 0.001) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  
  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }

  return (
    <group position={start} quaternion={quaternion}>
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness, length, 16]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[thickness * 2.5, thickness * 5, 16]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
      {label && (
        <Html position={[labelOffset[0], length + labelOffset[1], labelOffset[2]]} center className="pointer-events-none">
          <div className="px-2 py-1 rounded-md text-xs font-black text-white shadow-lg backdrop-blur-md border border-white/20"
               style={{ backgroundColor: `${color}dd`, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Glowing Magnetic Field Particles
function PremiumMagneticField({ bMagnitude }: { bMagnitude: number }) {
  return (
    <group position={[0, 0, -1]}>
      {/* Background glowing aura representing the field */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.05 * bMagnitude} depthWrite={false} />
      </mesh>
      <Sparkles count={100} scale={12} size={6 * bMagnitude} color="#38bdf8" speed={0.2} opacity={0.4} />
      
      {/* Visual B field indicators */}
      {[-3, -1, 1, 3].map((x) => 
        [-3, -1, 1, 3, 5].map((y) => (
          <Float key={`${x}-${y}`} speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[x, y, -0.5]}>
            <mesh>
              <circleGeometry args={[0.15, 32]} />
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2 + bMagnitude * 0.1} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial color="#7dd3fc" />
            </mesh>
          </Float>
        ))
      )}
    </group>
  );
}

// Premium Resistor
function PremiumResistor({ position, rotation, value }: { position: [number, number, number], rotation?: [number, number, number], value: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 1.5, 32]} />
        <meshPhysicalMaterial color="#b45309" roughness={0.6} metalness={0.4} clearcoat={0.5} />
      </mesh>
      {/* Bands */}
      {[-0.4, -0.15, 0.15, 0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
          <meshStandardMaterial color={['#ef4444', '#eab308', '#000', '#fbbf24'][i]} />
        </mesh>
      ))}
      <Html position={[0, -0.8, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-amber-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-amber-500/30 shadow-xl flex items-center gap-2">
          <Zap size={14} className="text-amber-500" />
          R = {value.toFixed(1)} Ω
        </div>
      </Html>
    </group>
  );
}

function SimulationScene({ isPlaying, bMagnitude, resistance, resetTrigger }: any) {
  const rodRef = useRef<THREE.Group>(null);
  
  // Physics constants
  const g = 9.81;
  const m = 0.05;
  const l = 3.0; // Distance between rails
  
  const state = useRef({ y: 4, v: 0 });

  useEffect(() => {
    state.current = { y: 4, v: 0 };
    if (rodRef.current) rodRef.current.position.y = 4;
  }, [resetTrigger]);

  const [physicsData, setPhysicsData] = useState({ v: 0, Fm: 0, P: m * g, I: 0 });

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const timeScale = 4.0; 
    const dt = 0.016 * timeScale; // Fixed delta for smoother, consistent physics
    
    const tau = (m * resistance) / (bMagnitude * bMagnitude * l * l);
    const dv_dt = g - state.current.v / tau;
    
    state.current.v += dv_dt * dt;
    state.current.y -= state.current.v * dt;

    if (state.current.y < -3) {
      state.current.y = -3;
      state.current.v = 0;
    }

    if (rodRef.current) {
      rodRef.current.position.y = state.current.y;
    }

    const current_I = (bMagnitude * l * state.current.v) / resistance;
    const Fm = current_I * l * bMagnitude;

    setPhysicsData({
      v: state.current.v,
      Fm: Fm,
      P: m * g,
      I: current_I
    });
  });

  const pVec = new THREE.Vector3(0, -1, 0);
  const fmVec = new THREE.Vector3(0, 1, 0);
  const forceScale = 5.0; // scale up forces for better visual

  return (
    <group position={[0, 0, 0]}>
      {/* Premium Rails */}
      <mesh position={[-l/2, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 32]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh position={[l/2, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 32]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.15} clearcoat={1} />
      </mesh>

      {/* Top connector & Bottom Connector */}
      <mesh position={[0, 4.8, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.08, 0.08, l, 32]} />
        <meshPhysicalMaterial color="#475569" metalness={0.8} roughness={0.5} />
      </mesh>

      {/* Rail Labels */}
      <Html position={[-l/2 - 0.5, 5, 0]} className="text-sm font-black text-white drop-shadow-md pointer-events-none">A</Html>
      <Html position={[l/2 + 0.5, 5, 0]} className="text-sm font-black text-white drop-shadow-md pointer-events-none">A'</Html>
      <Html position={[-l/2 - 0.5, -4, 0]} className="text-sm font-black text-white drop-shadow-md pointer-events-none">A₁</Html>
      <Html position={[l/2 + 0.5, -4, 0]} className="text-sm font-black text-white drop-shadow-md pointer-events-none">A'₁</Html>

      {/* Bottom Resistor System */}
      <mesh position={[-l/2 + 0.4, -4, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.08, 0.08, 0.8, 32]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[l/2 - 0.4, -4, 0]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[0.08, 0.08, 0.8, 32]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.2} />
      </mesh>
      <PremiumResistor position={[0, -4, 0]} rotation={[0, 0, Math.PI/2]} value={resistance} />

      <PremiumMagneticField bMagnitude={bMagnitude} />

      {/* Moving Rod MN */}
      <group ref={rodRef} position={[0, 4, 0.15]}>
        {/* The Rod */}
        <mesh rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.15, 0.15, l + 0.6, 64]} />
          <meshPhysicalMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.1} metalness={1} roughness={0.1} clearcoat={1} />
        </mesh>
        
        {/* End Caps for Premium Look */}
        <mesh position={[-l/2 - 0.3, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[l/2 + 0.3, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={1} roughness={0.1} />
        </mesh>

        <Html position={[-l/2 - 0.7, 0.4, 0]} className="text-sm font-black text-amber-400 drop-shadow-md pointer-events-none">M</Html>
        <Html position={[l/2 + 0.7, 0.4, 0]} className="text-sm font-black text-amber-400 drop-shadow-md pointer-events-none">N</Html>
        
        {/* Dynamic Glowing Current Indicator */}
        {physicsData.I > 0.05 && (
          <Float speed={5} rotationIntensity={0} floatIntensity={0.2} position={[0, 0, 0.3]}>
            <Arrow 
              start={new THREE.Vector3(l/3, 0, 0)} 
              dir={new THREE.Vector3(-1, 0, 0)} 
              length={1.0 + physicsData.I * 0.2} 
              color="#fbbf24" 
              label={`I = ${physicsData.I.toFixed(2)} A`}
              labelOffset={[0, 0.3, 0]}
              thickness={0.04}
            />
          </Float>
        )}

        {/* Physics Vectors */}
        <Arrow 
          start={new THREE.Vector3(0, 0, 0)} 
          dir={pVec} 
          length={physicsData.P * forceScale} 
          color="#ef4444" 
          label="Poids (P)"
          labelOffset={[0, -0.4, 0]}
        />

        {physicsData.Fm > 0.01 && (
          <Arrow 
            start={new THREE.Vector3(0, 0, 0)} 
            dir={fmVec} 
            length={physicsData.Fm * forceScale} 
            color="#10b981" 
            label={`Laplace (${physicsData.Fm.toFixed(2)} N)`}
            labelOffset={[0, 0.4, 0]}
          />
        )}
      </group>
      
      {/* Floor reflection shadow */}
      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} />
    </group>
  );
}

export default function LaplaceRails3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bMagnitude, setBMagnitude] = useState(1.5);
  const [resistance, setResistance] = useState(2.0);
  const [resetCounter, setResetCounter] = useState(0);

  const handleReset = () => {
    setIsPlaying(false);
    setResetCounter(prev => prev + 1);
  };

  return (
    <div className="w-full bg-slate-950 rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col my-8 relative">
      
      {/* 3D Viewport */}
      <div className="relative h-[280px] sm:h-[320px] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
          <Environment preset="city" />
          
          <SimulationScene 
            isPlaying={isPlaying} 
            bMagnitude={bMagnitude} 
            resistance={resistance} 
            resetTrigger={resetCounter}
          />
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>

        {/* Premium Control Overlay */}
        <div className="absolute top-4 left-4 flex gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg backdrop-blur-md border ${
              isPlaying 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20 hover:shadow-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20 hover:shadow-emerald-500/20"
            }`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Mettre en Pause" : "Lâcher la tige"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md shadow-lg"
            title="Réinitialiser la simulation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Premium Control Panel */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Champ Magnétique B Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <div className="p-1.5 bg-sky-500/20 rounded-md"><Play size={14} className="text-sky-400 rotate-90" /></div>
                Champ Magnétique B (T)
              </label>
              <span className="text-sm font-black bg-sky-950 px-3 py-1 rounded-md text-sky-300 border border-sky-800 shadow-inner">
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
              className="w-full accent-sky-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <p className="text-xs text-slate-400 font-medium">
              Contrôle l'intensité du champ magnétique (vecteurs bleus). Plus il est fort, plus la force de Laplace sera grande.
            </p>
          </div>

          {/* Résistance R Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-amber-500 flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 rounded-md"><Zap size={14} className="text-amber-500" /></div>
                Résistance R (Ω)
              </label>
              <span className="text-sm font-black bg-amber-950 px-3 py-1 rounded-md text-amber-400 border border-amber-800 shadow-inner">
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
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <p className="text-xs text-slate-400 font-medium">
              Contrôle la résistance du circuit. Une faible résistance génère un courant induit très puissant qui freine la tige.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
