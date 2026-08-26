/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Activity, Radio, Sparkles, RefreshCw, Zap, TrendingUp, Cpu, Gauge } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type ResonanceMode = "current" | "voltage_c" | "power";

/* ── 2D Dynamic Resonance Curve (SVG) ── */
function ResonanceGraph({
  mode,
  omega0,
  Q,
  omega,
  Em,
  R,
  L,
  C,
}: {
  mode: ResonanceMode;
  omega0: number;
  Q: number;
  omega: number;
  Em: number;
  R: number;
  L: number;
  C: number;
}) {
  const width = 300;
  const height = 185;
  const padL = 36;
  const padR = 24;
  const padT = 18;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const pointsCount = 60;
  const maxOmegaAxis = omega0 * 2.5;

  // Maximum and function values depending on mode
  let yAxisMax = 1;
  let currentOperatingVal = 0;
  let peakVal = 0;
  let peakOmega = omega0;

  if (mode === "current") {
    peakVal = Em / R;
    yAxisMax = peakVal * 1.25;
    const x = omega / omega0;
    currentOperatingVal = peakVal / Math.sqrt(1 + Q * Q * Math.pow(x - 1 / x, 2));
    peakOmega = omega0;
  } else if (mode === "voltage_c") {
    const hasRes = Q > 1 / Math.sqrt(2);
    peakOmega = hasRes ? omega0 * Math.sqrt(1 - 1 / (2 * Q * Q)) : 0;
    const xPeak = peakOmega / omega0;
    peakVal = hasRes
      ? Em / Math.sqrt(Math.pow(1 - xPeak * xPeak, 2) + Math.pow(xPeak / Q, 2))
      : Em;
    yAxisMax = Math.max(peakVal * 1.2, Em * 1.2);

    const x = omega / omega0;
    currentOperatingVal = Em / Math.sqrt(Math.pow(1 - x * x, 2) + Math.pow(x / Q, 2));
  } else {
    // Power mode
    peakVal = (Em * Em) / (2 * R);
    yAxisMax = peakVal * 1.25;
    const x = omega / omega0;
    currentOperatingVal = peakVal / (1 + Q * Q * Math.pow(x - 1 / x, 2));
    peakOmega = omega0;
  }

  // Generate curve points
  const pts: string[] = [];
  for (let i = 0; i <= pointsCount; i++) {
    const wVal = (i / pointsCount) * maxOmegaAxis;
    let yVal = 0;
    const x = wVal === 0 ? 0.001 : wVal / omega0;

    if (mode === "current") {
      yVal = (Em / R) / Math.sqrt(1 + Q * Q * Math.pow(x - 1 / x, 2));
    } else if (mode === "voltage_c") {
      yVal = Em / Math.sqrt(Math.pow(1 - x * x, 2) + Math.pow(x / Q, 2));
    } else {
      yVal = ((Em * Em) / (2 * R)) / (1 + Q * Q * Math.pow(x - 1 / x, 2));
    }

    const plotX = padL + (i / pointsCount) * plotW;
    const yFrac = Math.min(yVal / yAxisMax, 1.0);
    const plotY = padT + (1 - yFrac) * plotH;
    pts.push(`${plotX.toFixed(1)},${plotY.toFixed(1)}`);
  }
  const curvePoints = pts.join(" ");
  const areaPoints = `${padL},${padT + plotH} ${curvePoints} ${padL + plotW},${padT + plotH}`;

  // Current Operating Point
  const operX = padL + Math.min(omega / maxOmegaAxis, 1.0) * plotW;
  const operY = padT + (1 - Math.min(currentOperatingVal / yAxisMax, 1.0)) * plotH;

  // Peak Point
  const peakX = padL + Math.min(peakOmega / maxOmegaAxis, 1.0) * plotW;
  const peakY = padT + (1 - Math.min(peakVal / yAxisMax, 1.0)) * plotH;

  // Bandwidth Delta Omega = omega0 / Q
  const deltaOmega = omega0 / Q;
  const bandwLeftX = padL + Math.max((omega0 - deltaOmega / 2) / maxOmegaAxis, 0) * plotW;
  const bandwRightX = padL + Math.min((omega0 + deltaOmega / 2) / maxOmegaAxis, 1.0) * plotW;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 gap-1">
        <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-200 flex items-center gap-1 uppercase tracking-tight whitespace-nowrap">
          <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>
            {mode === "current" && "Résonance en Intensité I(ω)"}
            {mode === "voltage_c" && "Résonance en Tension Uc(ω)"}
            {mode === "power" && "Courbe de Puissance P(ω)"}
          </span>
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
          Q = {Q.toFixed(2)}
        </span>
      </div>

      {/* SVG Plot */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] h-auto overflow-visible font-sans">
          <defs>
            <linearGradient id="resGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Bandwidth Shaded Zone in current or power mode */}
          {mode !== "voltage_c" && (
            <rect
              x={bandwLeftX}
              y={padT}
              width={Math.max(bandwRightX - bandwLeftX, 2)}
              height={plotH}
              fill="#6366f1"
              opacity={0.12}
            />
          )}

          {/* Filled Area */}
          <polygon fill="url(#resGrad)" points={areaPoints} />

          {/* Axes */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW + 12} y2={padT + plotH} stroke="#64748b" strokeWidth="1.4" />
          <line x1={padL} y1={padT + plotH} x2={padL} y2={padT - 10} stroke="#64748b" strokeWidth="1.4" />

          {/* Arrows */}
          <polygon points={`${padL + plotW + 14},${padT + plotH} ${padL + plotW + 8},${padT + plotH - 3} ${padL + plotW + 8},${padT + plotH + 3}`} fill="#64748b" />
          <polygon points={`${padL},${padT - 12} ${padL - 3},${padT - 6} ${padL + 3},${padT - 6}`} fill="#64748b" />

          {/* Axis Labels */}
          <text x={padL + plotW + 16} y={padT + plotH + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">ω</text>
          <text x={padL - 6} y={padT - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">
            {mode === "current" ? "I (A)" : mode === "voltage_c" ? "Uc (V)" : "P (W)"}
          </text>

          {/* Ticks */}
          <text x={padL - 8} y={padT + plotH + 12} fill="#64748b" fontSize="8.5" textAnchor="middle">0</text>
          <text x={peakX} y={padT + plotH + 12} fill="#06b6d4" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            ω₀
          </text>

          {/* Peak Dotted Line */}
          <line x1={peakX} y1={padT + plotH} x2={peakX} y2={peakY} stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1" />
          <line x1={padL} y1={peakY} x2={peakX} y2={peakY} stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1" />

          {/* Resonance Curve */}
          <polyline fill="none" stroke="#06b6d4" strokeWidth="2.4" points={curvePoints} strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak Marker */}
          <circle cx={peakX} cy={peakY} r="3.5" fill="#06b6d4" stroke="#083344" strokeWidth="1.5" />

          {/* Current Operating Point Marker */}
          <g>
            <line x1={operX} y1={padT + plotH} x2={operX} y2={operY} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth="1" />
            <circle cx={operX} cy={operY} r="4.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Legend & Bandwidth Pill */}
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono px-0.5 whitespace-nowrap gap-1">
          <div className="flex items-center gap-1 text-amber-300">
            <span className="w-2 h-0.5 rounded-full bg-amber-400 shrink-0"></span>
            <LatexMath math={`\\text{Point actuel : } ${currentOperatingVal.toFixed(2)}`} />
          </div>
          <div className="flex items-center gap-1 text-cyan-300 font-bold">
            <span className="w-2 h-0.5 rounded-full bg-cyan-400 shrink-0"></span>
            <LatexMath math={`\\text{Max (Pic) : } ${peakVal.toFixed(2)}`} />
          </div>
        </div>

        <div className="text-[9px] sm:text-[9.5px] text-indigo-300 font-mono text-center bg-slate-900/90 py-0.5 px-1.5 rounded-xl border border-indigo-500/20 shadow-sm whitespace-nowrap overflow-x-auto">
          <LatexMath math={`\\text{Bande Passante } \\Delta\\omega = \\frac{\\omega_0}{Q} = ${deltaOmega.toFixed(2)}\\text{ rad/s} \\quad (\\text{Sélectivité } Q = ${Q.toFixed(2)})`} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Exported 3D Component: RLC Resonance Lab ── */
export default function RLCResonance3DCanvas() {
  const [mode, setMode] = useState<ResonanceMode>("current");

  // Circuit components parameters
  const [R, setR] = useState(3.0); // Ohms
  const [L, setL] = useState(0.5); // Henry
  const [C, setC] = useState(0.2); // Farad
  const [Em, setEm] = useState(10.0); // Voltage amplitude (V)
  const [omega, setOmega] = useState(3.16); // Frequency excitation (rad/s)

  // Canonical parameters
  // omega0 = 1 / sqrt(L*C)
  // Q = (1 / R) * sqrt(L / C)
  const { omega0, Q, deltaOmega, hasVoltageResonance, overvoltage } = useMemo(() => {
    const w0 = 1 / Math.sqrt(L * C);
    const qual = (1 / R) * Math.sqrt(L / C);
    const dW = qual > 0 ? w0 / qual : 0;
    const vRes = qual > 1 / Math.sqrt(2);
    const overVolt = qual * Em;

    return {
      omega0: w0,
      Q: qual,
      deltaOmega: dW,
      hasVoltageResonance: vRes,
      overvoltage: overVolt,
    };
  }, [R, L, C, Em]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* ── TOP BAR: MODE SELECTOR ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
            Simulateur 3D • Résonances du Circuit RLC Série
          </h3>
        </div>

        {/* Mode Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setMode("current")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "current"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1. Résonance en Courant I(ω)
          </button>
          <button
            onClick={() => setMode("voltage_c")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "voltage_c"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2. Résonance en Tension Uc(ω)
          </button>
          <button
            onClick={() => setMode("power")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "power"
                ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            3. Puissance Active P(ω)
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN VIEW (LEFT 3D CANVAS 60% + RIGHT 2D GRAPH 40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: 3D THREE.JS RLC BENCH (7 COLS) */}
        <div className="lg:col-span-7 h-[300px] lg:h-[340px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
          <Canvas camera={{ position: [0, 3.8, 6.0], fov: 38 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.6} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} autoRotate={false} />

              <group position={[0, 0.2, 0]}>
                {/* Generator Source */}
                <group position={[-2.4, 0, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 1.1, 32]} />
                    <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.3} metalness={0.8} />
                  </mesh>
                  <Html position={[0, 0.5, 0]} center>
                    <div className="bg-slate-900/90 text-cyan-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                      e(t) = {Em}V
                    </div>
                  </Html>
                </group>

                {/* Resistor R */}
                <group position={[-0.8, 0, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.2, 0.2, 1.2, 32]} />
                    <meshStandardMaterial color="#e11d48" emissive="#be123c" emissiveIntensity={0.2} />
                  </mesh>
                  <Html position={[0, 0.45, 0]} center>
                    <div className="bg-slate-900/90 text-rose-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-500/30 whitespace-nowrap">
                      R = {R} Ω
                    </div>
                  </Html>
                </group>

                {/* Inductor L */}
                <group position={[0.8, 0, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.24, 0.24, 1.2, 32]} />
                    <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.2} />
                  </mesh>
                  <Html position={[0, 0.45, 0]} center>
                    <div className="bg-slate-900/90 text-amber-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                      L = {L} H
                    </div>
                  </Html>
                </group>

                {/* Capacitor C */}
                <group position={[2.4, 0, 0]}>
                  <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.7, 0.8, 0.7]} />
                    <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.3} />
                  </mesh>
                  <Html position={[0, 0.6, 0]} center>
                    <div className="bg-slate-900/90 text-indigo-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-500/30 whitespace-nowrap">
                      C = {C} F
                    </div>
                  </Html>
                </group>

                {/* Circuit Board Base */}
                <Box args={[6.4, 0.1, 2.6]} position={[0, -0.25, 0]}>
                  <meshStandardMaterial color="#091e3a" metalness={0.6} roughness={0.4} transparent opacity={0.3} />
                </Box>
              </group>

              <ContactShadows position={[0, -1.3, 0]} opacity={0.6} scale={7} blur={2.0} />
            </Suspense>
          </Canvas>

          <div className="absolute top-2.5 left-2.5 pointer-events-none text-[9.5px] font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            Pulsation propre : ω₀ = {omega0.toFixed(2)} rad/s
          </div>

          <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[9.5px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            🖱️ 3D Interactif • Tourner / Zoomer
          </div>
        </div>

        {/* RIGHT COLUMN: 2D DYNAMIC RESONANCE GRAPH (5 COLS) */}
        <div className="lg:col-span-5 h-[300px] lg:h-[340px]">
          <ResonanceGraph
            mode={mode}
            omega0={omega0}
            Q={Q}
            omega={omega}
            Em={Em}
            R={R}
            L={L}
            C={C}
          />
        </div>

      </div>

      {/* ── BOTTOM PANEL: SLIDERS & PARAMETER CONTROLS ── */}
      <div className="w-full bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-lg">
        
        {/* Slider Pulsation omega */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Pulsation ω</span>
            <span className="text-cyan-400 font-mono font-black">{omega.toFixed(2)} rad/s</span>
          </label>
          <input
            type="range"
            min="0.5"
            max={omega0 * 2.2}
            step="0.05"
            value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="accent-cyan-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider R (Controls Q) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R</span>
            <span className="text-rose-400 font-mono">{R.toFixed(1)} Ω</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.2"
            value={R}
            onChange={(e) => setR(parseFloat(e.target.value))}
            className="accent-rose-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider L */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Inductance L</span>
            <span className="text-amber-400 font-mono">{L.toFixed(2)} H</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={L}
            onChange={(e) => setL(parseFloat(e.target.value))}
            className="accent-amber-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider C */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Capacité C</span>
            <span className="text-indigo-400 font-mono">{C.toFixed(2)} F</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.02"
            value={C}
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="accent-indigo-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

      </div>

      {/* ── THEORETICAL VALUES SUMMARY BAR ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1 text-cyan-300">
          <LatexMath math={`\\omega_0 = \\frac{1}{\\sqrt{LC}} = ${omega0.toFixed(2)}\\text{ rad/s}`} />
        </div>
        <div className="flex items-center gap-1 text-amber-300 font-bold">
          <LatexMath math={`Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = ${Q.toFixed(2)}`} />
        </div>
        <div className="flex items-center gap-1 text-indigo-300">
          <LatexMath math={`\\Delta\\omega = \\frac{\\omega_0}{Q} = ${deltaOmega.toFixed(2)}\\text{ rad/s}`} />
        </div>
        <div className="flex items-center gap-1 text-rose-300 font-bold">
          <LatexMath math={`\\text{Surtension : } Q \\cdot E_m = ${(Q * Em).toFixed(1)}\\text{ V}`} />
        </div>
      </div>
    </div>
  );
}
