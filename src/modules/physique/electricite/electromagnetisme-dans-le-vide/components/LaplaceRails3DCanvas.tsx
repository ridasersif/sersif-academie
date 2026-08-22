"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Float, Sparkles, Line, Trail } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

// Premium Arrow component for physics vectors
function Arrow({ start, dir, length, color, thickness = 0.06 }: any) {
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
        <cylinderGeometry args={[thickness, thickness, length, 12]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} metalness={0.9} clearcoat={1} />
      </mesh>
      <mesh position={[0, length, 0]}>
        <coneGeometry args={[thickness * 2.2, thickness * 6, 32]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} metalness={0.9} clearcoat={1} />
      </mesh>
    </group>
  );
}

// Ultra-Premium Circular Dial Gauge (Compteur Rond Lumineux avec Aiguille Réaliste)
function ModernGauge({ 
  value, 
  max, 
  label, 
  unit, 
  color, 
  glowColor 
}: { 
  value: number; 
  max: number; 
  label: string; 
  unit: string; 
  color: string; 
  glowColor: string; 
}) {
  const percentage = Math.min(1, Math.max(0, value / max));
  const startAngle = -125;
  const sweepAngle = 250;
  const currentAngle = startAngle + percentage * sweepAngle;

  const size = 150;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (sweepAngle / 360) * circumference;
  const progressLength = percentage * arcLength;

  // Generate tick marks & graduations
  const totalTicks = 10;
  const ticks = Array.from({ length: totalTicks + 1 }, (_, i) => {
    const tickAngle = startAngle + (i / totalTicks) * sweepAngle;
    const rad = ((tickAngle - 90) * Math.PI) / 180;
    const isMajor = i % 2 === 0;
    const rIn = isMajor ? radius - 9 : radius - 5;
    const rOut = radius + 2;
    const val = (i / totalTicks) * max;

    return {
      x1: cx + rIn * Math.cos(rad),
      y1: cy + rIn * Math.sin(rad),
      x2: cx + rOut * Math.cos(rad),
      y2: cy + rOut * Math.sin(rad),
      isMajor,
      val: val < 10 ? val.toFixed(1) : Math.round(val),
      tx: cx + (radius - 17) * Math.cos(rad),
      ty: cy + (radius - 17) * Math.sin(rad),
    };
  });

  return (
    <div 
      className="relative flex flex-col items-center justify-center rounded-full select-none pointer-events-none"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        background: 'radial-gradient(circle at 35% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
        boxShadow: `0 0 30px rgba(0,0,0,0.9), 0 0 20px ${glowColor}, inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.9)`,
        border: '3px solid #334155'
      }}
    >
      {/* Outer Glow Ring */}
      <div 
        className="absolute inset-1 rounded-full border border-slate-700/50" 
        style={{ boxShadow: `inset 0 0 14px ${glowColor}` }} 
      />

      {/* SVG Dial */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id={`glow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="6"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
          strokeLinecap="round"
        />

        {/* Illuminated Progress Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#grad-${label})`}
          strokeWidth="6"
          strokeDasharray={`${progressLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          style={{ transition: 'stroke-dasharray 0.08s ease-out' }}
        />

        {/* Ticks & Numbers */}
        {ticks.map((t, idx) => (
          <g key={idx}>
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.isMajor ? '#cbd5e1' : '#475569'}
              strokeWidth={t.isMajor ? 2 : 1}
              strokeLinecap="round"
            />
            {t.isMajor && (
              <text
                x={t.tx}
                y={t.ty}
                fill="#94a3b8"
                fontSize="7"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="sans-serif"
              >
                {t.val}
              </text>
            )}
          </g>
        ))}

        {/* Dial Title / Label */}
        <text
          x={cx}
          y={cy - 20}
          fill="#f8fafc"
          fontSize="9"
          fontWeight="900"
          letterSpacing="1.5"
          textAnchor="middle"
          style={{ textShadow: `0 0 10px ${color}` }}
        >
          {label}
        </text>

        {/* Needle Line (Smooth Rotating Group) */}
        <g 
          style={{ 
            transform: `rotate(${currentAngle}deg)`, 
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1)' 
          }}
        >
          {/* Needle Shadow */}
          <polygon
            points={`${cx - 2.5},${cy + 8} ${cx + 2.5},${cy + 8} ${cx},${cy - radius + 4}`}
            fill="rgba(0,0,0,0.5)"
            transform="translate(2, 2)"
          />
          {/* Needle Body */}
          <polygon
            points={`${cx - 2},${cy + 6} ${cx + 2},${cy + 6} ${cx},${cy - radius + 4}`}
            fill="#ffffff"
          />
          {/* Needle Tip Glowing Color */}
          <polygon
            points={`${cx - 1.2},${cy - radius/2} ${cx + 1.2},${cy - radius/2} ${cx},${cy - radius + 4}`}
            fill={color}
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
          {/* Needle Counterweight Pin */}
          <circle cx={cx} cy={cy + 8} r="3" fill="#64748b" />
        </g>

        {/* Center Pivot Hub (Metallic Cap) */}
        <circle cx={cx} cy={cy} r="7" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="4" fill="#e2e8f0" />
        <circle cx={cx - 1} cy={cy - 1} r="1.5" fill="#ffffff" />
      </svg>

      {/* Digital Readout at the bottom */}
      <div 
        className="absolute bottom-4 flex items-baseline gap-1 px-2.5 py-0.5 rounded-md bg-slate-950/90 border border-slate-700/80 shadow-inner"
        style={{ boxShadow: `0 0 10px rgba(0,0,0,0.6), inset 0 0 6px ${glowColor}` }}
      >
        <span 
          className="text-base font-black tracking-tight" 
          style={{ color: '#ffffff', textShadow: `0 0 8px ${color}` }}
        >
          {value.toFixed(2)}
        </span>
        <span className="text-[10px] font-bold text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

// Axis Helper tailored for this exercise
function AxisHelper({ position = [-2, -4, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Horizontal Axis (Right) */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(1, 0, 0)} length={5} color="#ef4444" thickness={0.03} />
      
      {/* Vertical Axis (UP) - Labeled 'x' because the exercise uses distance x = MA1 */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(0, 1, 0)} length={9} color="#22c55e" thickness={0.03} />
      <Html position={[0, 9.5, 0]} center transform sprite scale={1.0} className="text-lg font-bold text-green-500 pointer-events-none drop-shadow-md">x</Html>
      
      {/* Z Axis (OUT) - For B field direction */}
      <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(0, 0, 1)} length={3} color="#3b82f6" thickness={0.03} />
      <Html position={[0, 0, 3.5]} center transform sprite scale={1.0} className="text-lg font-bold text-blue-500 pointer-events-none drop-shadow-md">z</Html>
    </group>
  );
}

// Premium Magnetic Field (Array of Arrows pointing OUT of the screen, +Z)
function PremiumMagneticField({ bMagnitude }: { bMagnitude: number }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Visual B field arrows pointing in +Z direction (Sortant) */}
      {[-3, -1, 1, 3].map((x) => 
        [-2, 0, 2, 4].map((y) => (
          <Arrow 
            key={`${x}-${y}`} 
            start={new THREE.Vector3(x, y, -1)} 
            dir={new THREE.Vector3(0, 0, 1)} 
            length={1.0 + bMagnitude * 0.5} 
            color="#22c55e" // Green arrows
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
      {/* Wire leads */}
      <mesh position={[0, -1.2, 0]}>
         <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
         <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={1} roughness={0.2} />
      </mesh>
      {/* Ceramic Body */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 12]} />
        <meshPhysicalMaterial color="#e5e7eb" roughness={0.9} metalness={0.1} clearcoat={0.1} />
      </mesh>
      {/* Bands */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 12]} />
          <meshStandardMaterial color={['#ef4444', '#eab308', '#000', '#fbbf24'][i]} />
        </mesh>
      ))}
    </group>
  );
}

// Generator Component (Lab Power Supply / Battery block)
function PremiumGenerator({ position, isPlaying, onToggle }: { position: [number, number, number], isPlaying: boolean, onToggle: () => void }) {
  return (
    <group position={position}>
      {/* Power Supply Box (Made Larger) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 1.5, 3.0]} />
        <meshPhysicalMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Front Panel details */}
      <mesh position={[1.26, 0.1, 0]}>
        <boxGeometry args={[0.05, 1.0, 2.4]} />
        <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.5} />
      </mesh>

      {/* Terminals */}
      {/* Positive Terminal (Red) */}
      <mesh position={[1.3, -0.2, -0.8]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 12]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Negative Terminal (Black) */}
      <mesh position={[1.3, -0.2, 0.8]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 12]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Terminal Labels (just + and -) */}
      <Html position={[1.5, -0.2, 0.8]} center className="pointer-events-none">
        <span className="text-xl font-black text-white">-</span>
      </Html>
      <Html position={[1.5, -0.2, -0.8]} center className="pointer-events-none">
        <span className="text-xl font-black text-red-500">+</span>
      </Html>

      {/* Interactive ON/OFF Button embedded exactly on the Generator Front */}
      <Html 
        position={[1.286, 0.1, 0]} 
        transform 
        rotation={[0, Math.PI/2, 0]} 
        scale={0.4} 
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent orbit controls from taking the click
            onToggle();
          }}
          className={`w-32 h-16 rounded-xl font-black text-2xl transition-all border-b-[6px] active:border-b-0 active:translate-y-1.5 flex items-center justify-center ${
            isPlaying 
              ? 'bg-red-500 text-white border-red-800 shadow-[0_0_20px_rgba(239,68,68,0.8)]' 
              : 'bg-green-500 text-white border-green-800 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
          }`}
        >
          {isPlaying ? 'OFF' : 'ON'}
        </button>
      </Html>
    </group>
  );
}

function SimulationScene({ isPlaying, setIsPlaying, bMagnitude, resistance, resetTrigger }: any) {
  const rodRef = useRef<THREE.Group>(null);
  
  // Physics constants
  const g = 9.81; // Real gravity
  const m = 0.05;
  const l = 4.0; // Distance between rails (along X)
  
  const state = useRef({ y: 3.5, v: 0 }); // Moving along Y (downwards)

  useEffect(() => {
    state.current = { y: 3.5, v: 0 };
    if (rodRef.current?.position) rodRef.current.position.y = 3.5;
  }, [resetTrigger]);

  const [physicsData, setPhysicsData] = useState({ v: 0, Fm: 0, I: 0 });

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const timeScale = 4.0; 
    const dt = 0.016 * timeScale; 
    
    // tau = m*R / (B*l)^2
    const tau = bMagnitude === 0 ? Infinity : (m * resistance) / (bMagnitude * bMagnitude * l * l);
    
    if (tau === Infinity) {
      // Free fall
      state.current.v += g * dt;
    } else {
      // Exact analytical solution to completely eliminate numerical instability
      const v_lim = g * tau;
      state.current.v = v_lim + (state.current.v - v_lim) * Math.exp(-dt / tau);
    }
    
    // Prevent negative velocity due to floating point rounding
    if (state.current.v < 0) state.current.v = 0;

    state.current.y -= state.current.v * dt;

    // Stop at the bottom (y = -3.5)
    if (state.current.y < -3.5) {
      state.current.y = -3.5;
      state.current.v = 0;
    }

    if (rodRef.current?.position) {
      rodRef.current.position.y = state.current.y;
    }

    // I = e/R = B*l*v / R
    const current_I = (bMagnitude * l * state.current.v) / resistance;
    // Fm = I*l*B
    const Fm = current_I * l * bMagnitude;

    setPhysicsData({
      v: state.current.v,
      Fm: Fm,
      I: current_I
    });
  });

  const pVec = new THREE.Vector3(0, -1, 0); // Gravity pushes down
  const fmVec = new THREE.Vector3(0, 1, 0); // Laplace force opposes (up)
  const forceScale = 5.0; 

  return (
    <group position={[0, 0, 0]}>
      {/* Vertical Rails */}
      <mesh position={[-l/2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={1} roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh position={[l/2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 9, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={1} roughness={0.15} clearcoat={1} />
      </mesh>

      {/* Rail Labels */}
      <Html position={[-l/2 - 0.5, 4.5, 0]} center transform sprite scale={1.0} className="text-lg font-bold text-slate-300 pointer-events-none drop-shadow-md">A</Html>
      <Html position={[l/2 + 0.5, 4.5, 0]} center transform sprite scale={1.0} className="text-lg font-bold text-slate-300 pointer-events-none drop-shadow-md">A'</Html>
      <Html position={[-l/2 - 0.5, -4.5, 0]} center transform sprite scale={1.0} className="text-lg font-bold text-slate-300 pointer-events-none drop-shadow-md">A₁</Html>
      <Html position={[l/2 + 0.5, -4.5, 0]} center transform sprite scale={1.0} className="text-lg font-bold text-slate-300 pointer-events-none drop-shadow-md">A'₁</Html>

      {/* Resistor at the bottom (y = -4) connecting A1 and A'1 */}
      <PremiumResistor position={[0, -4, 0]} rotation={[0, 0, Math.PI/2]} />
      <Html position={[0, -4.8, 0]} center transform sprite scale={1.0} className="pointer-events-none">
        <span className="text-lg font-bold text-white drop-shadow-md">R</span>
      </Html>

      <PremiumMagneticField bMagnitude={bMagnitude} />

      {/* Moving Rod MN (Horizontal, moving down Y) */}
      <group ref={rodRef} position={[0, 3.5, 0]}>
        {/* The Rod */}
        <mesh rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.15, 0.15, l + 0.6, 12]} />
          <meshPhysicalMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.2} metalness={0.8} roughness={0.2} clearcoat={1} />
        </mesh>
        
        {/* End Caps */}
        <mesh position={[-l/2 - 0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshPhysicalMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[l/2 + 0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshPhysicalMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>

        <Html position={[-l/2 - 0.4, 0.4, 0]} center transform sprite scale={1.0} className="text-lg font-black text-slate-100 pointer-events-none drop-shadow-md">M</Html>
        <Html position={[l/2 + 0.4, 0.4, 0]} center transform sprite scale={1.0} className="text-lg font-black text-slate-100 pointer-events-none drop-shadow-md">N</Html>
        
        {/* Dynamic Glowing Current Indicator */}
        {physicsData.I > 0.05 && (
          <Float speed={5} rotationIntensity={0} floatIntensity={0.2} position={[0, 0, 0.3]}>
            <Arrow 
              start={new THREE.Vector3(4/3, 0, 0)} 
              dir={new THREE.Vector3(-1, 0, 0)} 
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
          length={(0.1 * 9.81) * forceScale} 
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
      
      {/* Gravity field vector indicator far away from the shape (Top Left) */}
      <group position={[-5, 4, 0]}>
        <Arrow start={new THREE.Vector3(0, 0, 0)} dir={new THREE.Vector3(0, -1, 0)} length={2.5} color="#f59e0b" thickness={0.04} />
        <Html position={[0.4, -1.2, 0]} transform sprite scale={1.0} className="text-lg font-black text-amber-500 pointer-events-none drop-shadow-md">g</Html>
      </group>

      {/* Dashboards for Speed and Current (Responsive for Mobile) */}
      <Html position={[7.0, 3.2, 0]} center transform sprite scale={0.95}>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <ModernGauge value={physicsData.v} max={15.0} label="VITESSE" unit="m/s" color="#06b6d4" glowColor="rgba(6,182,212,0.6)" />
          <ModernGauge value={physicsData.I} max={1.5} label="COURANT" unit="A" color="#f59e0b" glowColor="rgba(245,158,11,0.6)" />
        </div>
      </Html>

      {/* Floor reflection shadow */}
      <ContactShadows position={[0, -5.5, 0]} opacity={0.4} scale={20} blur={2} far={10} />

      {/* XYZ Coordinates Indicator positioned exactly at A1 (x=-2, y=-4) */}
      <AxisHelper position={[-2, -4, 0]} />
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
      <div className="relative h-[250px] sm:h-[320px] w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
        <Canvas camera={{ position: [0, 0, 18], fov: 45 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
          <Environment preset="city" />
          
          <SimulationScene 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            bMagnitude={bMagnitude} 
            resistance={resistance} 
            resetTrigger={resetCounter}
          />
          
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={30} />
                    </Suspense>
          </Canvas>
      </div>

      {/* Controls and Sliders Panel (All in one row, Sleek and Compact) */}
      <div className="flex flex-col xl:flex-row items-center gap-4 p-4 bg-slate-900 border-t border-slate-800">
        
        {/* Play/Pause & Reset Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full xl:w-auto justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-sm border ${
              isPlaying 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/50 hover:bg-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Mettre en Pause" : "Lâcher la tige"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center p-2.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            title="Réinitialiser l'expérience"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow w-full">
          
          {/* Champ Magnétique B Slider */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs whitespace-nowrap">
                <div className="p-1 rounded bg-cyan-500/20 border border-cyan-500/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12M6 20h12M4 12h16M12 4v16"/></svg>
                </div>
                Champ Magnétique B (T)
              </div>
              <span className="font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded text-xs border border-cyan-800">{bMagnitude.toFixed(2)} T</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bMagnitude}
              onChange={(e) => setBMagnitude(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 hover:accent-cyan-400 transition-all cursor-pointer h-1.5"
            />
          </div>

          {/* Résistance R Slider */}
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs whitespace-nowrap">
                <div className="p-1 rounded bg-amber-500/20 border border-amber-500/30">
                  <Zap size={12} />
                </div>
                Résistance R (Ω)
              </div>
              <span className="font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded text-xs border border-amber-800">{resistance.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              className="w-full accent-amber-500 hover:accent-amber-400 transition-all cursor-pointer h-1.5"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
