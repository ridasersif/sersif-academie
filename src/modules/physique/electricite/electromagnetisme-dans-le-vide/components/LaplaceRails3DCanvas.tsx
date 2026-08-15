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
    </group>
  );
}

// XYZ Axis Helper
function AxisHelper({ size = 2, position = [-4, -4, 0] }: { size?: number, position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* X Axis (Red) */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(1, 0, 0)} length={size} color="#ef4444" thickness={0.05} label="x" labelOffset={[0.2, 0, 0]} />
      {/* Y Axis (Green) */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(0, 1, 0)} length={size} color="#22c55e" thickness={0.05} label="y" labelOffset={[0, 0.2, 0]} />
      {/* Z Axis (Blue) */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(0, 0, 1)} length={size} color="#3b82f6" thickness={0.05} label="z" labelOffset={[0, 0, 0.2]} />
    </group>
  );
}

// Premium Magnetic Field (Array of Arrows instead of stars)
function PremiumMagneticField({ bMagnitude }: { bMagnitude: number }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Visual B field arrows pointing in +Y direction (UP) */}
      {[-3, -1, 1, 3].map((x) => 
        [-2, 0, 2].map((z) => (
          <Arrow 
            key={`${x}-${z}`} 
            start={new THREE.Vector3(x, -1.5, z)} 
            dir={new THREE.Vector3(0, 1, 0)} 
            length={1.0 + bMagnitude * 0.5} 
            color="#22c55e" // Green arrows as in sketch
            thickness={0.03}
          />
        ))
      )}
    </group>
  );
}

// Premium Resistor spanning the whole gap
function PremiumResistor({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 4, 32]} />
        <meshPhysicalMaterial color="#b45309" roughness={0.6} metalness={0.4} clearcoat={0.5} />
      </mesh>
      {/* Bands */}
      {[-0.6, -0.2, 0.2, 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.2, 32]} />
          <meshStandardMaterial color={['#ef4444', '#eab308', '#000', '#fbbf24'][i]} />
        </mesh>
      ))}
    </group>
  );
}

function SimulationScene({ isPlaying, bMagnitude, resistance, resetTrigger }: any) {
  const rodRef = useRef<THREE.Group>(null);
  
  // Physics constants
  const g = 2.0; // Reduced "gravity" or driving force so it moves slower
  const m = 0.05;
  const l = 4.0; // Distance between rails (along Z)
  
  const state = useRef({ x: -3.5, v: 0 }); // Moving along X

  useEffect(() => {
    state.current = { x: -3.5, v: 0 };
    if (rodRef.current) rodRef.current.position.x = -3.5;
  }, [resetTrigger]);

  const [physicsData, setPhysicsData] = useState({ v: 0, Fm: 0, P: m * g, I: 0 });

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const timeScale = 1.0; // Slowed down simulation
    const dt = 0.016 * timeScale; // Fixed delta for smoother, consistent physics
    
    // Avoid division by zero if B = 0
    const tau = bMagnitude === 0 ? Infinity : (m * resistance) / (bMagnitude * bMagnitude * l * l);
    // Driving force is "g" (gravity equivalent pulling it along +X)
    const dv_dt = tau === Infinity ? g : (g - state.current.v / tau);
    
    state.current.v += dv_dt * dt;
    state.current.x += state.current.v * dt;

    if (state.current.x > 3.5) {
      state.current.x = 3.5;
      state.current.v = 0;
    }

    if (rodRef.current) {
      rodRef.current.position.x = state.current.x;
    }

    const current_I = (bMagnitude * l * state.current.v) / resistance;
    const Fm = current_I * l * bMagnitude;

    setPhysicsData({
      v: state.current.v,
      Fm: Fm,
      P: m * g, // driving force
      I: current_I
    });
  });

  const pVec = new THREE.Vector3(1, 0, 0); // Moving +X
  const fmVec = new THREE.Vector3(-1, 0, 0); // Opposing -X
  const forceScale = 5.0; // scale up forces for better visual

  return (
    <group position={[0, 0, 0]}>
      {/* Premium Rails (along X) */}
      <mesh position={[0, 0, -l/2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 32]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={1} roughness={0.15} clearcoat={1} /> {/* Blue rails like sketch */}
      </mesh>
      <mesh position={[0, 0, l/2]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 32]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={1} roughness={0.15} clearcoat={1} /> {/* Blue rails like sketch */}
      </mesh>

      {/* Left connector */}
      <mesh position={[-4.5, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, l, 32]} />
        <meshPhysicalMaterial color="#475569" metalness={0.8} roughness={0.5} />
      </mesh>

      {/* Rail Labels */}
      <Html position={[-4.5, 0.5, -l/2]} className="text-sm font-bold text-slate-300 pointer-events-none">A</Html>
      <Html position={[-4.5, 0.5, l/2]} className="text-sm font-bold text-slate-300 pointer-events-none">A'</Html>
      <Html position={[4.5, 0.5, -l/2]} className="text-sm font-bold text-slate-300 pointer-events-none">A₁</Html>
      <Html position={[4.5, 0.5, l/2]} className="text-sm font-bold text-slate-300 pointer-events-none">A'₁</Html>

      {/* Resistor at the right end (x = 4.5) spans the whole gap */}
      <PremiumResistor position={[4.5, 0, 0]} rotation={[Math.PI/2, 0, 0]} />

      <PremiumMagneticField bMagnitude={bMagnitude} />

      {/* Moving Rod MN (Pink like sketch) */}
      <group ref={rodRef} position={[-3.5, 0.15, 0]}>
        {/* The Rod */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, l + 0.6, 64]} />
          <meshPhysicalMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} clearcoat={1} />
        </mesh>
        
        {/* End Caps for Premium Look */}
        <mesh position={[0, 0, -l/2 - 0.3]} rotation={[Math.PI/2, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, l/2 + 0.3]} rotation={[Math.PI/2, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>

        <Html position={[0, 0.4, -l/2 - 0.7]} className="text-sm font-bold text-slate-100 pointer-events-none">M</Html>
        <Html position={[0, 0.4, l/2 + 0.7]} className="text-sm font-bold text-slate-100 pointer-events-none">N</Html>
        
        {/* Dynamic Glowing Current Indicator */}
        {physicsData.I > 0.05 && (
          <Float speed={5} rotationIntensity={0} floatIntensity={0.2} position={[0, 0.3, 0]}>
            <Arrow 
              start={new THREE.Vector3(0, 0, l/3)} 
              dir={new THREE.Vector3(0, 0, -1)} 
              length={1.0 + physicsData.I * 0.2} 
              color="#fbbf24" 
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
        />

        {physicsData.Fm > 0.01 && (
          <Arrow 
            start={new THREE.Vector3(0, 0, 0)} 
            dir={fmVec} 
            length={physicsData.Fm * forceScale} 
            color="#10b981" 
          />
        )}
      </group>
      
      {/* Floor reflection shadow */}
      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} />

      {/* XYZ Coordinates Indicator positioned exactly at the start of the rails */}
      <AxisHelper position={[-4.5, 0, 0]} size={1.5} />
    </group>
  );
}

export default function LaplaceRails3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bMagnitude, setBMagnitude] = useState(0.5);
  const [resistance, setResistance] = useState(2.0);
  const [resetCounter, setResetCounter] = useState(0);

  const handleReset = () => {
    setIsPlaying(false);
    setResetCounter(prev => prev + 1);
  };

  return (
    <div className="w-full bg-slate-950 rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col my-8 relative">
      
      {/* 3D Viewport */}
      <div className="relative h-[280px] sm:h-[350px] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
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
            enablePan={true}
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
              min="0.0"
              max="1.0"
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
