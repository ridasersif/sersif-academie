/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Zap, Activity, CheckCircle2, LineChart, Sliders, RefreshCw, Cpu } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type ViewMode = "full" | "thevenin" | "norton";

/* ── 3D Resistor Component ── */
function Resistor3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  resistanceValue,
  label = "R",
  highlight = false,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  resistanceValue: number;
  label?: string;
  highlight?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Resistor Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 1.4, 32]} />
        <meshStandardMaterial
          color={highlight ? "#38bdf8" : "#d97706"}
          roughness={0.3}
          metalness={0.2}
          emissive={highlight ? "#0284c7" : "#ea580c"}
          emissiveIntensity={highlight ? 0.4 : 0.15}
        />
      </mesh>

      {/* Color Rings */}
      {[-0.4, -0.15, 0.15, 0.4].map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.225, 0.225, 0.08, 32]} />
          <meshStandardMaterial color={["#991b1b", "#000000", "#d97706", "#eab308"][i]} />
        </mesh>
      ))}

      {/* Leads */}
      <mesh position={[-1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3D Label */}
      <Html position={[0, 0.45, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-amber-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 backdrop-blur whitespace-nowrap shadow">
          {label} = {resistanceValue.toFixed(1)} Ω
        </div>
      </Html>
    </group>
  );
}

/* ── 3D Voltage Source Component ── */
function VoltageSource3D({
  position = [0, 0, 0],
  voltage,
  label = "E",
}: {
  position?: [number, number, number];
  voltage: number;
  label?: string;
}) {
  return (
    <group position={position}>
      {/* Battery Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.2} emissive="#1d4ed8" emissiveIntensity={0.25} />
      </mesh>
      {/* Positive Terminal Cap */}
      <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3D Label */}
      <Html position={[0, 0.5, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-cyan-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-cyan-500/30 backdrop-blur whitespace-nowrap shadow">
          {label} = {voltage.toFixed(1)} V
        </div>
      </Html>
    </group>
  );
}

/* ── 3D Voltmeter & Ammeter Dual Instrument ── */
function DigitalMeters3D({
  voltage,
  current,
}: {
  voltage: number;
  current: number;
}) {
  return (
    <group position={[0, -1.2, 1.8]}>
      {/* Voltmeter Case */}
      <Box args={[1.6, 0.75, 0.8]} position={[-0.9, 0, 0]}>
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </Box>
      <Html position={[-0.9, 0.05, 0.42]} center transform>
        <div className="bg-black/90 p-1.5 rounded border border-cyan-500/40 text-center font-mono shadow-inner w-[95px]">
          <div className="text-[7.5px] text-slate-400 font-bold uppercase">Voltmètre U</div>
          <div className="text-xs font-black text-cyan-400">{voltage.toFixed(2)} V</div>
        </div>
      </Html>

      {/* Ammeter Case */}
      <Box args={[1.6, 0.75, 0.8]} position={[0.9, 0, 0]}>
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </Box>
      <Html position={[0.9, 0.05, 0.42]} center transform>
        <div className="bg-black/90 p-1.5 rounded border border-amber-500/40 text-center font-mono shadow-inner w-[95px]">
          <div className="text-[7.5px] text-slate-400 font-bold uppercase">Ampèremètre I</div>
          <div className="text-xs font-black text-amber-400">{current.toFixed(2)} A</div>
        </div>
      </Html>

      {/* Connecting Wires */}
      <Line
        points={[
          new THREE.Vector3(-0.9, 0.35, 0.3),
          new THREE.Vector3(-1.8, 0.8, 0.1),
          new THREE.Vector3(-2.2, 0.2, 0),
        ]}
        color="#ef4444"
        lineWidth={2.5}
      />
      <Line
        points={[
          new THREE.Vector3(0.9, 0.35, 0.3),
          new THREE.Vector3(1.8, 0.8, 0.1),
          new THREE.Vector3(2.2, 0.2, 0),
        ]}
        color="#3b82f6"
        lineWidth={2.5}
      />
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
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 gap-1">
        <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-200 flex items-center gap-1 uppercase tracking-tight whitespace-nowrap">
          <LineChart className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Transfert de Puissance P = f(Rc)</span>
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 whitespace-nowrap">
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
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono px-0.5 whitespace-nowrap gap-1">
          <div className="flex items-center gap-1 text-amber-300">
            <span className="w-2 h-0.5 rounded-full bg-amber-400 shrink-0"></span>
            <LatexMath math={`P(R_c) = ${powerRc.toFixed(2)}\\text{ W}`} />
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-0.5 rounded-full bg-emerald-400 shrink-0"></span>
            <LatexMath math={`P_{\\max} = ${maxPowerPossible.toFixed(2)}\\text{ W}`} />
          </div>
        </div>

        <div className="text-[9px] sm:text-[9.5px] text-cyan-300 font-mono text-center bg-slate-900/90 py-0.5 px-1.5 rounded-xl border border-cyan-500/20 shadow-sm whitespace-nowrap overflow-x-auto">
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
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
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

      {/* ── MAIN 2-COLUMN VIEW (LEFT 3D CANVAS 60% + RIGHT 2D GRAPH 40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: 3D THREE.JS CANVAS (7 COLS) */}
        <div className="lg:col-span-7 h-[300px] lg:h-[340px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
          <Canvas camera={{ position: [0, 4.5, 6.5], fov: 38 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.6} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} autoRotate={false} />

              <group position={[0, 0.2, 0]}>
                {/* ── SCENE: FULL CIRCUIT ── */}
                {viewMode === "full" && (
                  <group>
                    {/* Source E */}
                    <VoltageSource3D position={[-2.4, 0, -1.0]} voltage={E} label="E" />
                    {/* Resistor R1 (Series) */}
                    <Resistor3D position={[-0.8, 0, -1.0]} resistanceValue={R1} label="R1" />
                    {/* Resistor R2 (Parallel / Divider) */}
                    <Resistor3D position={[0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} resistanceValue={R2} label="R2" />
                    {/* Load Resistor Rc */}
                    <Resistor3D position={[2.4, 0, 0]} rotation={[0, Math.PI / 2, 0]} resistanceValue={Rc} label="Rc" highlight={true} />

                    {/* Circuit Board Base Box */}
                    <Box args={[6.2, 0.1, 3.2]} position={[0, -0.2, 0]}>
                      <meshStandardMaterial color="#091e3a" metalness={0.6} roughness={0.4} transparent opacity={0.3} />
                    </Box>
                  </group>
                )}

                {/* ── SCENE: THÉVENIN EQUIVALENT ── */}
                {viewMode === "thevenin" && (
                  <group>
                    {/* Thévenin Voltage Source Eth */}
                    <VoltageSource3D position={[-1.8, 0, 0]} voltage={Eth} label="Eth" />
                    {/* Thévenin Resistance Rth */}
                    <Resistor3D position={[0, 0, 0]} resistanceValue={Rth} label="Rth" />
                    {/* Load Resistor Rc */}
                    <Resistor3D position={[2.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} resistanceValue={Rc} label="Rc" highlight={true} />

                    <Html position={[0, 1.2, 0]} center className="pointer-events-none">
                      <div className="bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur whitespace-nowrap shadow">
                        Modèle de Thévenin : Dipôle (Eth, Rth) en série
                      </div>
                    </Html>
                  </group>
                )}

                {/* ── SCENE: NORTON EQUIVALENT ── */}
                {viewMode === "norton" && (
                  <group>
                    {/* Norton Current Source Icon Box */}
                    <group position={[-1.8, 0, 0]}>
                      <Box args={[0.8, 0.8, 0.8]}>
                        <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.3} />
                      </Box>
                      <Html position={[0, 0.65, 0]} center className="pointer-events-none">
                        <div className="bg-indigo-500/10 text-indigo-300 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/30 backdrop-blur whitespace-nowrap shadow">
                          ηN = {etaN.toFixed(2)} A
                        </div>
                      </Html>
                    </group>

                    {/* Norton Resistance RN = Rth (Parallel) */}
                    <Resistor3D position={[0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} resistanceValue={Rth} label="RN" />
                    {/* Load Resistor Rc (Parallel) */}
                    <Resistor3D position={[2.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} resistanceValue={Rc} label="Rc" highlight={true} />

                    <Html position={[0, 1.2, 0]} center className="pointer-events-none">
                      <div className="bg-indigo-500/10 text-indigo-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-500/30 backdrop-blur whitespace-nowrap shadow">
                        Modèle de Norton : Source de courant ηN en parallèle avec RN
                      </div>
                    </Html>
                  </group>
                )}

                {/* 3D Voltmeter & Ammeter Readout Instruments */}
                <DigitalMeters3D voltage={voltageRc} current={currentRc} />
              </group>

              <ContactShadows position={[0, -1.3, 0]} opacity={0.6} scale={7} blur={2.0} />
            </Suspense>
          </Canvas>

          <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[9.5px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            🖱️ 3D Interactif • Tourner / Zoomer
          </div>
        </div>

        {/* RIGHT COLUMN: 2D DYNAMIC RESPONSE GRAPH (5 COLS) */}
        <div className="lg:col-span-5 h-[300px] lg:h-[340px]">
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
      <div className="w-full bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-lg">
        
        {/* Slider E */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Tension E</span>
            <span className="text-cyan-400 font-mono">{E.toFixed(1)} V</span>
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
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R1</span>
            <span className="text-amber-400 font-mono">{R1.toFixed(1)} Ω</span>
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
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R2</span>
            <span className="text-amber-400 font-mono">{R2.toFixed(1)} Ω</span>
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
        <div className="flex flex-col gap-1">
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
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1 text-cyan-300">
          <LatexMath math={`E_{th} = \\frac{R_2}{R_1+R_2} E = ${Eth.toFixed(2)}\\text{ V}`} />
        </div>
        <div className="flex items-center gap-1 text-amber-300">
          <LatexMath math={`R_{th} = \\frac{R_1 R_2}{R_1+R_2} = ${Rth.toFixed(2)}\\text{ }\\Omega`} />
        </div>
        <div className="flex items-center gap-1 text-indigo-300">
          <LatexMath math={`\\eta_N = \\frac{E_{th}}{R_{th}} = ${etaN.toFixed(2)}\\text{ A}`} />
        </div>
        <div className="flex items-center gap-1 text-emerald-300 font-bold">
          <LatexMath math={`P_{\\max}(R_c=R_{th}) = ${((Eth * Eth) / (4 * Rth)).toFixed(2)}\\text{ W}`} />
        </div>
      </div>
    </div>
  );
}
