/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Box, Cylinder, Sphere, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Zap, Activity, CheckCircle2, LineChart, Sliders, RefreshCw, Cpu, Gauge, Sparkles, BookOpen } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type ViewMode = "full" | "thevenin" | "norton";

/* ── Real 3D Solid Cylindrical Wire Segment ── */
function Wire3D({
  from,
  to,
  color = "#38bdf8",
  radius = 0.045,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  radius?: number;
}) {
  const vFrom = useMemo(() => new THREE.Vector3(...from), [from]);
  const vTo = useMemo(() => new THREE.Vector3(...to), [to]);
  const distance = useMemo(() => vFrom.distanceTo(vTo), [vFrom, vTo]);
  const mid = useMemo(() => new THREE.Vector3().addVectors(vFrom, vTo).multiplyScalar(0.5), [vFrom, vTo]);

  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3().subVectors(vTo, vFrom).normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, dir);
  }, [vFrom, vTo]);

  if (distance < 0.001) return null;

  return (
    <group position={[mid.x, mid.y, mid.z]} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[radius, radius, distance, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

/* ── 3D Wire Solder Node / Junction ── */
function WireJunction({
  position,
  color = "#f59e0b",
  radius = 0.07,
}: {
  position: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

/* ── SMD Gold/Silver Solder Pad on Green PCB ── */
function SolderPad({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <Box args={[0.24, 0.02, 0.24]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </Box>
      <Sphere args={[0.065, 16, 16]} position={[0, 0.035, 0]}>
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.05} />
      </Sphere>
    </group>
  );
}

/* ── 3D Resistor Component (Clean, No Floating Badges) ── */
function Resistor3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  highlight = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  highlight?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Solder Pads on PCB */}
      <SolderPad position={[-0.65, -0.15, 0]} />
      <SolderPad position={[0.65, -0.15, 0]} />

      {/* Resistor Ceramic Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.95, 32]} />
        <meshStandardMaterial
          color={highlight ? "#0284c7" : "#d97706"}
          roughness={0.2}
          metalness={0.15}
          emissive={highlight ? "#38bdf8" : "#ea580c"}
          emissiveIntensity={highlight ? 0.45 : 0.15}
        />
      </mesh>

      {/* Color Code Bands */}
      {[-0.28, -0.1, 0.1, 0.28].map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.205, 0.205, 0.065, 32]} />
          <meshStandardMaterial color={["#991b1b", "#000000", "#d97706", "#eab308"][i]} />
        </mesh>
      ))}

      {/* Bent Metallic Leads */}
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-0.65, -0.075, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.15, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>

      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.65, -0.075, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.15, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ── 3D Voltage Generator (Vibrant Laboratory Power Module) ── */
function VoltageSource3D({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Solder Pads on PCB */}
      <SolderPad position={[0.6, -0.15, 0]} />
      <SolderPad position={[-0.6, -0.15, 0]} />

      {/* Vibrant High-Tech Brushed Blue/Silver Power Module */}
      <RoundedBox args={[1.25, 0.65, 0.95]} radius={0.08} smoothness={4} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#1d4ed8" metalness={0.7} roughness={0.2} emissive="#1e40af" emissiveIntensity={0.35} />
      </RoundedBox>

      {/* Metallic Top Plate */}
      <Box args={[1.1, 0.04, 0.8]} position={[0, 0.52, 0]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </Box>

      {/* Heat Sink Aluminum Fins */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <Box key={i} args={[0.05, 0.07, 0.65]} position={[x, 0.57, 0]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </Box>
      ))}

      {/* Illuminated Power LED */}
      <Sphere args={[0.065, 16, 16]} position={[-0.45, 0.55, 0.3]}>
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.0} />
      </Sphere>

      {/* Red (+) Output Binding Post Terminal */}
      <mesh position={[0.6, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.15} emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>

      {/* Blue (-) Ground Binding Post Terminal */}
      <mesh position={[-0.6, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.15} emissive="#2563eb" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ── 3D Norton Current Generator Module ── */
function CurrentSource3D({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Solder Pads on PCB */}
      <SolderPad position={[0, -0.15, -0.5]} />
      <SolderPad position={[0, -0.15, 0.5]} />

      {/* Vibrant Purple/Indigo IC Power Module */}
      <RoundedBox args={[1.05, 0.65, 1.05]} radius={0.08} smoothness={4} position={[0, 0.18, 0]}>
        <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.25} emissive="#4338ca" emissiveIntensity={0.35} />
      </RoundedBox>

      {/* Metallic Top Plate */}
      <Box args={[0.9, 0.04, 0.9]} position={[0, 0.52, 0]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </Box>

      {/* Glowing Gold Current Ring Logo */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.28, 32]} />
        <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
      </mesh>

      {/* Top (+) Terminal Post */}
      <mesh position={[0, 0.18, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.15} emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>

      {/* Bottom (-) Terminal Post */}
      <mesh position={[0, 0.18, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.15} emissive="#2563eb" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ── 3D Test Point Header Terminal (A / B) ── */
function TestPoint3D({ position = [0, 0, 0], label = "A", color = "#f43f5e" }: { position?: [number, number, number]; label?: string; color?: string }) {
  return (
    <group position={position}>
      {/* Test Pin Post */}
      <Cylinder args={[0.05, 0.05, 0.35, 16]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.05} />
      </Cylinder>
      {/* Glowing Terminal Ball */}
      <Sphere args={[0.1, 16, 16]} position={[0, 0.32, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </Sphere>
      {/* Clean Minimal Terminal Badge */}
      <Html position={[0, 0.55, 0]} center className="pointer-events-none">
        <span className="text-[12px] font-black font-mono text-white bg-black/90 px-2 py-0.5 rounded-full border border-white/40 shadow-lg">
          {label}
        </span>
      </Html>
    </group>
  );
}

/* ── 2D Power Transfer & Adaptation Curve (SVG Graph) ── */
function PowerTransferGraph({
  Eth,
  Rth,
  Rc,
  currentRc,
  voltageRc,
  powerRc,
}: {
  Eth: number;
  Rth: number;
  Rc: number;
  currentRc: number;
  voltageRc: number;
  powerRc: number;
}) {
  const width = 300;
  const height = 185;
  const padL = 36;
  const padR = 24;
  const padT = 18;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const pointsCount = 45;
  const maxRcAxis = Math.max(Rth * 3, 20);
  const maxPowerPossible = (Eth * Eth) / (4 * Rth);
  const maxPowerAxis = maxPowerPossible > 0 ? maxPowerPossible * 1.25 : 10;

  // Generate P(Rc) curve
  const pts: string[] = [];
  for (let i = 0; i <= pointsCount; i++) {
    const rcVal = (i / pointsCount) * maxRcAxis;
    const pVal = rcVal === 0 ? 0 : (Eth * Eth * rcVal) / Math.pow(Rth + rcVal, 2);
    const x = padL + (i / pointsCount) * plotW;
    const yFrac = Math.min(pVal / maxPowerAxis, 1.0);
    const y = padT + (1 - yFrac) * plotH;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const curvePoints = pts.join(" ");
  const areaPoints = `${padL},${padT + plotH} ${curvePoints} ${padL + plotW},${padT + plotH}`;

  // Current Operating Point (Rc, P(Rc))
  const operX = padL + Math.min(Rc / maxRcAxis, 1.0) * plotW;
  const operY = padT + (1 - Math.min(powerRc / maxPowerAxis, 1.0)) * plotH;

  // Maximum Power Point (Rth, Pmax)
  const maxPtX = padL + Math.min(Rth / maxRcAxis, 1.0) * plotW;
  const maxPtY = padT + (1 - Math.min(maxPowerPossible / maxPowerAxis, 1.0)) * plotH;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 gap-1">
        <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-200 flex items-center gap-1 uppercase tracking-tight whitespace-nowrap">
          <LineChart className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Transfert de Puissance P = f(Rc)</span>
        </span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold whitespace-nowrap">
          Adaptation : Rc = Rth
        </span>
      </div>

      {/* SVG Plot */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] h-auto overflow-visible font-sans">
          <defs>
            <linearGradient id="powerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Filled Area */}
          <polygon fill="url(#powerGrad)" points={areaPoints} />

          {/* Axes */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW + 12} y2={padT + plotH} stroke="#64748b" strokeWidth="1.4" />
          <line x1={padL} y1={padT + plotH} x2={padL} y2={padT - 10} stroke="#64748b" strokeWidth="1.4" />

          {/* Arrow heads */}
          <polygon points={`${padL + plotW + 14},${padT + plotH} ${padL + plotW + 8},${padT + plotH - 3} ${padL + plotW + 8},${padT + plotH + 3}`} fill="#64748b" />
          <polygon points={`${padL},${padT - 12} ${padL - 3},${padT - 6} ${padL + 3},${padT - 6}`} fill="#64748b" />

          {/* Axis Labels */}
          <text x={padL + plotW + 16} y={padT + plotH + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">
            Rc
          </text>
          <text x={padL - 6} y={padT - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">
            P (W)
          </text>

          {/* Axis Ticks */}
          <text x={padL - 8} y={padT + plotH + 12} fill="#64748b" fontSize="8.5" textAnchor="middle">0</text>
          <text x={maxPtX} y={padT + plotH + 12} fill="#10b981" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            Rth
          </text>

          {/* Peak Max Line Dotted */}
          <line x1={maxPtX} y1={padT + plotH} x2={maxPtX} y2={maxPtY} stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" />
          <line x1={padL} y1={maxPtY} x2={maxPtX} y2={maxPtY} stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" />

          {/* Power Curve */}
          <polyline fill="none" stroke="#10b981" strokeWidth="2.4" points={curvePoints} strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak Max Marker */}
          <circle cx={maxPtX} cy={maxPtY} r="3.5" fill="#10b981" stroke="#022c22" strokeWidth="1.5" />

          {/* Current Operating Point Marker */}
          <g>
            <line x1={operX} y1={padT + plotH} x2={operX} y2={operY} stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="1" />
            <circle cx={operX} cy={operY} r="4.5" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Legend & Status Pill */}
      <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10.5px] font-mono px-1 whitespace-nowrap gap-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-amber-400 shrink-0"></span>
            <LatexMath math={`P(R_c) = ${powerRc.toFixed(2)}\\text{ W}`} />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-emerald-400 shrink-0"></span>
            <LatexMath math={`P_{\\max} = ${maxPowerPossible.toFixed(2)}\\text{ W}`} />
          </div>
        </div>

        <div className="text-[9.5px] text-cyan-300 font-mono text-center bg-slate-900/90 py-1 px-2 rounded-xl border border-cyan-500/20 shadow-sm whitespace-nowrap overflow-x-auto font-bold">
          <LatexMath math={`\\text{Rendement : } \\eta = \\frac{R_c}{R_{th} + R_c} = ${( (Rc / (Rth + Rc)) * 100 ).toFixed(1)}\\%`} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Exported 3D Component: Network & Thévenin/Norton Lab ── */
export default function NetworkThevenin3DCanvas() {
  const [viewMode, setViewMode] = useState<ViewMode>("full");

  // Generator & Circuit parameters
  const [E, setE] = useState(12.0); // Source voltage (V)
  const [R1, setR1] = useState(4.0); // Resistor 1 (Ohms)
  const [R2, setR2] = useState(6.0); // Resistor 2 (Ohms)
  const [Rc, setRc] = useState(2.4); // Load Resistor Rc (Ohms)

  // Thévenin Equivalents calculation:
  // For a voltage divider: Eth = E * (R2 / (R1 + R2)), Rth = (R1 * R2) / (R1 + R2)
  const Eth = useMemo(() => (E * R2) / (R1 + R2), [E, R1, R2]);
  const Rth = useMemo(() => (R1 * R2) / (R1 + R2), [R1, R2]);
  const etaN = useMemo(() => (Rth > 0 ? Eth / Rth : 0), [Eth, Rth]); // Norton Current

  // Circuit connected to load Rc:
  // Current in load: I_c = Eth / (Rth + Rc)
  // Voltage across load: U_c = Rc * I_c
  // Power delivered to load: P_c = U_c * I_c = Rc * I_c^2
  const currentRc = useMemo(() => Eth / (Rth + Rc), [Eth, Rth, Rc]);
  const voltageRc = useMemo(() => Rc * currentRc, [Rc, currentRc]);
  const powerRc = useMemo(() => voltageRc * currentRc, [voltageRc, currentRc]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 font-sans">
      {/* ── TOP BAR: VIEW MODE SELECTOR (Réseau Complet vs Thévenin vs Norton) ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
            Laboratoire Virtuel 3D • Équivalences des Réseaux Linéaires
          </h3>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode("full")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === "full"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1. Réseau Réel Complet
          </button>
          <button
            onClick={() => setViewMode("thevenin")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === "thevenin"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2. Équivalent de Thévenin
          </button>
          <button
            onClick={() => setViewMode("norton")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === "norton"
                ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            3. Équivalent de Norton
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN VIEW (LEFT 3D CANVAS + RIGHT 2D GRAPH) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: 3D THREE.JS CANVAS (7 COLS) */}
        <div className="lg:col-span-7 h-[340px] lg:h-[380px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 flex flex-col justify-between">
          <Canvas camera={{ position: [0, 5.0, 5.5], fov: 38 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={1.1} />
              <directionalLight position={[5, 10, 5]} intensity={2.0} />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.15} autoRotate={false} />

              <group position={[0, -0.1, 0]}>
                
                {/* ── AUTHENTIC GREEN ELECTRONIC PCB BOARD (Carte Verte Classique) ── */}
                <RoundedBox args={[6.8, 0.16, 3.8]} radius={0.12} smoothness={4} position={[0, -0.08, 0]}>
                  <meshStandardMaterial
                    color="#047857"
                    metalness={0.3}
                    roughness={0.35}
                    emissive="#064e3b"
                    emissiveIntensity={0.25}
                  />
                </RoundedBox>

                {/* Decorative Gold Border Trace on PCB */}
                <Box args={[6.5, 0.02, 0.03]} position={[0, 0.01, -1.75]}>
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </Box>
                <Box args={[6.5, 0.02, 0.03]} position={[0, 0.01, 1.75]}>
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </Box>
                <Box args={[0.03, 0.02, 3.5]} position={[-3.25, 0.01, 0]}>
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </Box>
                <Box args={[0.03, 0.02, 3.5]} position={[3.25, 0.01, 0]}>
                  <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                </Box>

                {/* ── SCENE 1: FULL CIRCUIT ON GREEN PCB ── */}
                {viewMode === "full" && (
                  <group>
                    {/* Source E Module */}
                    <VoltageSource3D position={[-2.2, 0.15, 0]} />

                    {/* Resistor R1 (Series, horizontal along X) */}
                    <Resistor3D position={[-0.4, 0.15, 0]} />

                    {/* Resistor R2 (Parallel, vertical along Z) */}
                    <Resistor3D position={[1.1, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} />

                    {/* Load Resistor Rc (Parallel, vertical along Z) */}
                    <Resistor3D position={[2.4, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} highlight={true} />

                    {/* Test Points TP-A and TP-B */}
                    <TestPoint3D position={[1.1, 0.15, -1.2]} label="A" color="#f43f5e" />
                    <TestPoint3D position={[1.1, 0.15, 1.2]} label="B" color="#38bdf8" />

                    {/* ── 3D SOLID CONNECTING WIRES ── */}
                    {/* Wire 1: From Generator (+) [+0.6] to R1 left [-1.05] */}
                    <Wire3D from={[-1.6, 0.15, 0]} to={[-1.05, 0.15, 0]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[-1.6, 0.15, 0]} color="#f43f5e" />
                    <WireJunction position={[-1.05, 0.15, 0]} color="#f43f5e" />

                    {/* Wire 2: From R1 right [0.25] to junction [1.1, 0] */}
                    <Wire3D from={[0.25, 0.15, 0]} to={[1.1, 0.15, 0]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[0.25, 0.15, 0]} color="#f43f5e" />
                    <WireJunction position={[1.1, 0.15, 0]} color="#f43f5e" />

                    {/* Wire 3: From junction [1.1, 0] to R2 top lead [1.1, -0.65] and Node A [1.1, -1.2] */}
                    <Wire3D from={[1.1, 0.15, 0]} to={[1.1, 0.15, -0.65]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[1.1, 0.15, -0.65]} to={[1.1, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[1.1, 0.15, -0.65]} color="#f43f5e" />

                    {/* Wire 4: From Node A [1.1, -1.2] across to Rc top [2.4, -1.2] and down to Rc lead [2.4, -0.65] */}
                    <Wire3D from={[1.1, 0.15, -1.2]} to={[2.4, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[2.4, 0.15, -1.2]} to={[2.4, 0.15, -0.65]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[2.4, 0.15, -1.2]} color="#f43f5e" />
                    <WireJunction position={[2.4, 0.15, -0.65]} color="#f43f5e" />

                    {/* Wire 5 (Ground Return): From Rc bottom [2.4, 0.65] to [2.4, 1.2] to Node B [1.1, 1.2] and R2 bottom [1.1, 0.65] */}
                    <Wire3D from={[2.4, 0.15, 0.65]} to={[2.4, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[2.4, 0.15, 1.2]} to={[1.1, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[1.1, 0.15, 1.2]} to={[1.1, 0.15, 0.65]} color="#38bdf8" radius={0.045} />
                    <WireJunction position={[2.4, 0.15, 0.65]} color="#38bdf8" />
                    <WireJunction position={[2.4, 0.15, 1.2]} color="#38bdf8" />
                    <WireJunction position={[1.1, 0.15, 0.65]} color="#38bdf8" />

                    {/* Wire 6 (Back to Generator (-)): From Node B [1.1, 1.2] to [-2.8, 1.2] and up to Generator (-) [-2.8, 0] */}
                    <Wire3D from={[1.1, 0.15, 1.2]} to={[-2.8, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[-2.8, 0.15, 1.2]} to={[-2.8, 0.15, 0]} color="#38bdf8" radius={0.045} />
                    <WireJunction position={[-2.8, 0.15, 1.2]} color="#38bdf8" />
                    <WireJunction position={[-2.8, 0.15, 0]} color="#38bdf8" />
                  </group>
                )}

                {/* ── SCENE 2: THÉVENIN EQUIVALENT ON GREEN PCB ── */}
                {viewMode === "thevenin" && (
                  <group>
                    {/* Thévenin Voltage Source Eth */}
                    <VoltageSource3D position={[-1.8, 0.15, 0]} />

                    {/* Thévenin Resistance Rth (Series) */}
                    <Resistor3D position={[0.0, 0.15, 0]} />

                    {/* Load Resistor Rc */}
                    <Resistor3D position={[2.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} highlight={true} />

                    {/* Test Points TP-A and TP-B */}
                    <TestPoint3D position={[2.2, 0.15, -1.2]} label="A" color="#f43f5e" />
                    <TestPoint3D position={[2.2, 0.15, 1.2]} label="B" color="#38bdf8" />

                    {/* ── 3D SOLID CONNECTING WIRES (CLEAN TOP ROUTE) ── */}
                    {/* Wire 1: From Eth (+) [-1.2, 0] to Rth left [-0.65, 0] */}
                    <Wire3D from={[-1.2, 0.15, 0]} to={[-0.65, 0.15, 0]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[-1.2, 0.15, 0]} color="#f43f5e" />
                    <WireJunction position={[-0.65, 0.15, 0]} color="#f43f5e" />

                    {/* Wire 2: From Rth right [0.65, 0] -> [1.3, 0] -> [1.3, -1.2] -> Node A [2.2, -1.2] -> Rc top lead [2.2, -0.65] */}
                    <Wire3D from={[0.65, 0.15, 0]} to={[1.3, 0.15, 0]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[1.3, 0.15, 0]} to={[1.3, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[1.3, 0.15, -1.2]} to={[2.2, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[2.2, 0.15, -1.2]} to={[2.2, 0.15, -0.65]} color="#f43f5e" radius={0.045} />
                    
                    <WireJunction position={[0.65, 0.15, 0]} color="#f43f5e" />
                    <WireJunction position={[1.3, 0.15, 0]} color="#f43f5e" />
                    <WireJunction position={[1.3, 0.15, -1.2]} color="#f43f5e" />
                    <WireJunction position={[2.2, 0.15, -1.2]} color="#f43f5e" />
                    <WireJunction position={[2.2, 0.15, -0.65]} color="#f43f5e" />

                    {/* Wire 3: From Rc bottom lead [2.2, 0.65] to Node B [2.2, 1.2] and back to Eth (-) [-2.4, 0] */}
                    <Wire3D from={[2.2, 0.15, 0.65]} to={[2.2, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[2.2, 0.15, 1.2]} to={[-2.4, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[-2.4, 0.15, 1.2]} to={[-2.4, 0.15, 0]} color="#38bdf8" radius={0.045} />
                    
                    <WireJunction position={[2.2, 0.15, 0.65]} color="#38bdf8" />
                    <WireJunction position={[2.2, 0.15, 1.2]} color="#38bdf8" />
                    <WireJunction position={[-2.4, 0.15, 1.2]} color="#38bdf8" />
                    <WireJunction position={[-2.4, 0.15, 0]} color="#38bdf8" />
                  </group>
                )}

                {/* ── SCENE 3: NORTON EQUIVALENT ON GREEN PCB ── */}
                {viewMode === "norton" && (
                  <group>
                    {/* Norton Current Source IN */}
                    <CurrentSource3D position={[-1.6, 0.15, 0]} />

                    {/* Norton Resistance RN = Rth (Parallel) */}
                    <Resistor3D position={[0.3, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} />

                    {/* Load Resistor Rc */}
                    <Resistor3D position={[2.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} highlight={true} />

                    {/* Test Points TP-A and TP-B */}
                    <TestPoint3D position={[2.2, 0.15, -1.2]} label="A" color="#f43f5e" />
                    <TestPoint3D position={[2.2, 0.15, 1.2]} label="B" color="#38bdf8" />

                    {/* ── 3D SOLID CONNECTING WIRES ── */}
                    {/* Top Bus Rail Trace (Connecting IN top, RN top, TP-A, and Rc top) */}
                    <Wire3D from={[-1.6, 0.15, -0.5]} to={[-1.6, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[-1.6, 0.15, -1.2]} to={[2.2, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[0.3, 0.15, -0.65]} to={[0.3, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <Wire3D from={[2.2, 0.15, -0.65]} to={[2.2, 0.15, -1.2]} color="#f43f5e" radius={0.045} />
                    <WireJunction position={[-1.6, 0.15, -0.5]} color="#f43f5e" />
                    <WireJunction position={[-1.6, 0.15, -1.2]} color="#f43f5e" />
                    <WireJunction position={[0.3, 0.15, -0.65]} color="#f43f5e" />
                    <WireJunction position={[2.2, 0.15, -0.65]} color="#f43f5e" />

                    {/* Bottom Bus Rail Trace (Connecting IN bottom, RN bottom, TP-B, and Rc bottom) */}
                    <Wire3D from={[-1.6, 0.15, 0.5]} to={[-1.6, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[-1.6, 0.15, 1.2]} to={[2.2, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[0.3, 0.15, 0.65]} to={[0.3, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <Wire3D from={[2.2, 0.15, 0.65]} to={[2.2, 0.15, 1.2]} color="#38bdf8" radius={0.045} />
                    <WireJunction position={[-1.6, 0.15, 0.5]} color="#38bdf8" />
                    <WireJunction position={[-1.6, 0.15, 1.2]} color="#38bdf8" />
                    <WireJunction position={[0.3, 0.15, 0.65]} color="#38bdf8" />
                    <WireJunction position={[2.2, 0.15, 0.65]} color="#38bdf8" />
                  </group>
                )}
              </group>

              <ContactShadows position={[0, -0.4, 0]} opacity={0.6} scale={8} blur={2.2} />
            </Suspense>
          </Canvas>

          {/* Sleek On-Screen Multimeter Measurement Dock */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 p-2 rounded-xl bg-black/85 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Voltmeter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 whitespace-nowrap">
                <span className="text-[9px] text-cyan-400 font-bold uppercase">Voltmètre U :</span>
                <span className="text-xs font-mono font-black text-cyan-300">{voltageRc.toFixed(2)} V</span>
              </div>

              {/* Ammeter */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 whitespace-nowrap">
                <span className="text-[9px] text-amber-400 font-bold uppercase">Ampèremètre I :</span>
                <span className="text-xs font-mono font-black text-amber-300">{currentRc.toFixed(2)} A</span>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-mono hidden sm:block">
              🖱️ 3D Interactif • Tourner / Zoomer
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 2D DYNAMIC RESPONSE GRAPH (5 COLS) */}
        <div className="lg:col-span-5 h-[340px] lg:h-[380px]">
          <PowerTransferGraph
            Eth={Eth}
            Rth={Rth}
            Rc={Rc}
            currentRc={currentRc}
            voltageRc={voltageRc}
            powerRc={powerRc}
          />
        </div>

      </div>

      {/* ── BOTTOM PANEL: SLIDERS & PARAMETER CONTROLS ── */}
      <div className="w-full bg-slate-900/80 border border-slate-800 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3.5 shadow-lg">
        
        {/* Slider E */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Tension E</span>
            <span className="text-cyan-400 font-mono font-bold">{E.toFixed(1)} V</span>
          </label>
          <input
            type="range"
            min="4"
            max="24"
            step="1"
            value={E}
            onChange={(e) => setE(parseFloat(e.target.value))}
            className="accent-cyan-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider R1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R1</span>
            <span className="text-amber-400 font-mono font-bold">{R1.toFixed(1)} Ω</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={R1}
            onChange={(e) => setR1(parseFloat(e.target.value))}
            className="accent-amber-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider R2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R2</span>
            <span className="text-amber-400 font-mono font-bold">{R2.toFixed(1)} Ω</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={R2}
            onChange={(e) => setR2(parseFloat(e.target.value))}
            className="accent-amber-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider Load Rc */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Charge Rc</span>
            <span className="text-emerald-400 font-mono font-black">{Rc.toFixed(1)} Ω</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.1"
            value={Rc}
            onChange={(e) => setRc(parseFloat(e.target.value))}
            className="accent-emerald-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

      </div>

      {/* ── THEORETICAL VALUES SUMMARY BAR ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1 text-cyan-300">
          <LatexMath math={`E_{th} = \\frac{R_2}{R_1+R_2} E = ${Eth.toFixed(2)}\\text{ V}`} />
        </div>
        <div className="flex items-center gap-1 text-amber-300">
          <LatexMath math={`R_{th} = \\frac{R_1 R_2}{R_1+R_2} = ${Rth.toFixed(2)}\\text{ }\\Omega`} />
        </div>
        <div className="flex items-center gap-1 text-indigo-300">
          <LatexMath math={`I_N = \\frac{E_{th}}{R_{th}} = ${etaN.toFixed(2)}\\text{ A}`} />
        </div>
        <div className="flex items-center gap-1 text-emerald-300 font-bold">
          <LatexMath math={`P_{\\max}(R_c=R_{th}) = ${((Eth * Eth) / (4 * Rth)).toFixed(2)}\\text{ W}`} />
        </div>
      </div>

      {/* ── PEDAGOGICAL EXPLANATION BOX ── */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guide Pédagogique & Équivalences :</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          <div className="p-2 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="text-cyan-300 font-bold block">1. Réseau Réel (Pont) :</span>
            <p className="text-slate-400">
              La source <LatexMath math="E" /> alimente le pont <LatexMath math="R_1, R_2" />. La charge <LatexMath math="R_c" /> prélève la tension aux bornes de <LatexMath math="R_2" />.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="text-amber-300 font-bold block">2. Modèle de Thévenin :</span>
            <p className="text-slate-400">
              Tout le réseau est remplacé par <LatexMath math="(E_{th}, R_{th})" /> en série. La tension et le courant sur <LatexMath math="R_c" /> sont rigoureusement identiques.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-slate-800 space-y-1">
            <span className="text-indigo-300 font-bold block">3. Modèle de Norton :</span>
            <p className="text-slate-400">
              Réseau équivalent à une source de courant <LatexMath math="I_N" /> en parallèle avec <LatexMath math="R_N" />. Même comportement sur la charge <LatexMath math="R_c" />.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
