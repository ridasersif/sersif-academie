"use client";

import React, { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Text, Float, ContactShadows, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

/* ── COMPONENT TYPES ── */
type DipoleType = "resistor" | "diode" | "battery" | "wire" | "switch" | "zener" | "current_source";

/* ── 3D COMPONENT RENDERING ── */
function Resistor3D() {
  return (
    <group rotation={[0, 0, Math.PI / 2]} scale={1.5}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
        <meshStandardMaterial color="#d4b483" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.31, 0.31, 0.1, 32]} /><meshStandardMaterial color="#b91c1c" /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.31, 0.31, 0.1, 32]} /><meshStandardMaterial color="#000000" /></mesh>
      <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.31, 0.31, 0.1, 32]} /><meshStandardMaterial color="#ea580c" /></mesh>
      <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.31, 0.31, 0.05, 32]} /><meshStandardMaterial color="#eab308" metalness={0.8} /></mesh>
    </group>
  );
}

function Diode3D({ color = "#1f2937", bandColor = "#d1d5db", label = "1N4148" }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]} scale={1.5}>
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 1.0, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.15, 32]} />
        <meshStandardMaterial color={bandColor} metalness={0.8} />
      </mesh>
      <Text position={[0, 0, 0.3]} rotation={[0, 0, -Math.PI/2]} fontSize={0.2} color="white">
        {label}
      </Text>
    </group>
  );
}

function Battery3D() {
  return (
    <group rotation={[0, 0, Math.PI / 2]} scale={1.5}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>
      <Text position={[0, 0.3, 0.42]} rotation={[0, 0, -Math.PI/2]} fontSize={0.3} color="white">+</Text>
      <Text position={[0, -0.3, 0.42]} rotation={[0, 0, -Math.PI/2]} fontSize={0.3} color="white">-</Text>
    </group>
  );
}

function CurrentSource3D() {
  return (
    <group rotation={[0, 0, Math.PI / 2]} scale={1.5}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.41]}>
        {/* Arrow on surface */}
        <planeGeometry args={[0.4, 0.8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 0, 0.45]} rotation={[0, 0, -Math.PI/2]} fontSize={0.3} color="white">
        ↑ I0
      </Text>
    </group>
  );
}

function OpenSwitch3D() {
  return (
    <group scale={1.5}>
      {/* Left terminal */}
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Right terminal */}
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Switch lever (open) */}
      <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, -Math.PI/4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ── MAIN SCENE ── */
function CircuitScene({ dipoleType, voltage, current }: { dipoleType: DipoleType, voltage: number, current: number }) {
  const electronRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    electronRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (Math.abs(current) > 0.01) {
        const drift = current * delta * 2.0;
        el.position.x += drift;
        if (el.position.x > 4) el.position.x -= 8;
        if (el.position.x < -4) el.position.x += 8;
      } else {
        el.position.x += (Math.random() - 0.5) * 0.01;
        el.position.y += (Math.random() - 0.5) * 0.01;
        el.position.z += (Math.random() - 0.5) * 0.01;
        el.position.y += (0 - el.position.y) * 0.1;
        el.position.z += (0 - el.position.z) * 0.1;
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, 0, 0]}>
          {dipoleType === "resistor" && <Resistor3D />}
          {dipoleType === "diode" && <Diode3D />}
          {dipoleType === "zener" && <Diode3D color="#ea580c" bandColor="#000000" label="Zener" />}
          {dipoleType === "battery" && <Battery3D />}
          {dipoleType === "current_source" && <CurrentSource3D />}
          {dipoleType === "switch" && <OpenSwitch3D />}
          
          <Html position={[0, 1.5, 0]} center className="pointer-events-none">
            <div className="flex flex-col items-center gap-1 bg-slate-900/80 p-2 rounded-lg border border-slate-700 whitespace-nowrap">
              <span className="text-rose-400 font-bold text-xs"><LatexMath math={`U = ${voltage.toFixed(1)}\\text{ V}`} /></span>
              <span className="text-emerald-400 font-bold text-xs"><LatexMath math={`I = ${current.toFixed(2)}\\text{ A}`} /></span>
            </div>
          </Html>
        </group>
      </Float>

      {/* Wires */}
      <Cylinder args={[0.05, 0.05, 8, 16]} rotation={[0, 0, Math.PI/2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {Array.from({ length: 40 }).map((_, idx) => (
        <mesh
          key={idx}
          position={[-4 + (idx * 8) / 40, 0, 0]}
          ref={(el) => {
            if (el) electronRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>
      ))}

      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} />
      <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.5} />
    </>
  );
}

/* ── WRAPPER COMPONENT ── */
export default function DipoleCharacteristics3DCanvas() {
  const [dipole, setDipole] = useState<DipoleType>("resistor");
  const [voltage, setVoltage] = useState(0);

  // Compute Current based on dipole characteristic
  const current = useMemo(() => {
    switch (dipole) {
      case "resistor":
        return voltage / 5;
      case "diode":
        if (voltage < 0.6) return 0;
        return Math.pow(voltage - 0.6, 2) * 0.5;
      case "zener":
        if (voltage < -5) return (voltage + 5) * 2;
        if (voltage > 0.6) return Math.pow(voltage - 0.6, 2) * 0.5;
        return 0;
      case "battery":
        return (5 - voltage) / 2;
      case "current_source":
        return 2;
      case "wire":
        return voltage * 10; // Steeper slope for wire
      case "switch":
        return 0;
      default:
        return 0;
    }
  }, [dipole, voltage]);

  // Generate data points for the SVG Graph
  const graphPoints = useMemo(() => {
    const points = [];
    for (let u = -10; u <= 10; u += 0.5) {
      let i = 0;
      if (dipole === "resistor") i = u / 5;
      if (dipole === "diode") i = u < 0.6 ? 0 : Math.pow(u - 0.6, 2) * 0.5;
      if (dipole === "zener") {
        if (u < -5) i = (u + 5) * 2;
        else if (u > 0.6) i = Math.pow(u - 0.6, 2) * 0.5;
        else i = 0;
      }
      if (dipole === "battery") i = (5 - u) / 2;
      if (dipole === "current_source") i = 2;
      if (dipole === "wire") i = u * 10;
      if (dipole === "switch") i = 0;
      
      points.push({ u, i });
    }
    return points;
  }, [dipole]);

  // Map (U, I) to SVG coordinates
  const mapToSVG = (u: number, i: number) => {
    const x = ((u + 10) / 20) * 200;
    const y = 200 - ((i + 5) / 10) * 200;
    return { x, y };
  };

  const pathD = useMemo(() => {
    return graphPoints
      .map((p, idx) => {
        const { x, y } = mapToSVG(p.u, p.i);
        const clampedY = Math.max(-50, Math.min(250, y));
        return `${idx === 0 ? "M" : "L"} ${x} ${clampedY}`;
      })
      .join(" ");
  }, [graphPoints]);

  const currentPoint = mapToSVG(voltage, current);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {(["resistor", "diode", "zener", "battery", "current_source", "wire", "switch"] as DipoleType[]).map((type) => {
            const labels = {
              resistor: "Résistance",
              diode: "Diode",
              zener: "Zener",
              battery: "Pile",
              current_source: "Gén. Courant",
              wire: "Fil idéal",
              switch: "Interrupteur"
            };
            return (
              <button
                key={type}
                onClick={() => { setDipole(type); setVoltage(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dipole === type 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50" 
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-slate-400 text-xs font-mono w-8">U:</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <span className="text-indigo-400 font-bold text-xs font-mono w-12 text-right">
            {voltage.toFixed(1)}V
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[400px] md:h-[350px]">
        {/* 3D Canvas */}
        <div className="flex-1 relative rounded-xl overflow-hidden bg-[#030008] border border-slate-800">
          <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
            <Suspense fallback={null}>
              <CircuitScene dipoleType={dipole} voltage={voltage} current={current} />
            </Suspense>
          </Canvas>
          
          <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-800 backdrop-blur-sm pointer-events-none">
            {dipole === "resistor" && "Dipôle Passif • Linéaire"}
            {dipole === "diode" && "Dipôle Passif • Non-Linéaire"}
            {dipole === "zener" && "Dipôle Passif • Non-Linéaire (Effet d'avalanche)"}
            {dipole === "battery" && "Dipôle Actif • Linéaire (E=5V, r=2Ω)"}
            {dipole === "current_source" && "Dipôle Actif • Linéaire (I₀=2A)"}
            {dipole === "wire" && "Dipôle Passif • Linéaire (Court-circuit, R≈0)"}
            {dipole === "switch" && "Dipôle Passif • Linéaire (Circuit ouvert, R=∞)"}
          </div>
        </div>

        {/* 2D Graph Overlay */}
        <div className="w-full md:w-64 relative rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
          <h4 className="absolute top-2 left-2 text-xs font-bold text-slate-300">Courbe I = f(U)</h4>
          <svg viewBox="0 0 200 200" className="w-full h-full p-4">
            {/* Grid & Axes */}
            <line x1="0" y1="100" x2="200" y2="100" stroke="#334155" strokeWidth="1" /> {/* X Axis */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="#334155" strokeWidth="1" /> {/* Y Axis */}
            
            {/* Ticks */}
            {[0, 50, 150, 200].map(x => <line key={`x-${x}`} x1={x} y1="98" x2={x} y2="102" stroke="#475569" strokeWidth="1" />)}
            {[0, 50, 150, 200].map(y => <line key={`y-${y}`} x1="98" y1={y} x2="102" y2={y} stroke="#475569" strokeWidth="1" />)}
            
            <text x="185" y="95" fill="#94a3b8" fontSize="10">U</text>
            <text x="105" y="15" fill="#94a3b8" fontSize="10">I</text>

            {/* Characteristic Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Current Point Marker */}
            {currentPoint.y >= 0 && currentPoint.y <= 200 && (
              <>
                <line 
                  x1={currentPoint.x} y1="100" 
                  x2={currentPoint.x} y2={currentPoint.y} 
                  stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" 
                />
                <line 
                  x1="100" y1={currentPoint.y} 
                  x2={currentPoint.x} y2={currentPoint.y} 
                  stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" 
                />
                <circle cx={currentPoint.x} cy={currentPoint.y} r="4" fill="#6366f1" />
                <circle cx={currentPoint.x} cy={currentPoint.y} r="2" fill="white" />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
