/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Activity, Radio, Sparkles, RefreshCw, Zap, Compass } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type DipoleTab = "resistor" | "inductor" | "capacitor" | "rlc";

/* ── 3D Rotating Arrow for Fresnel Vector ── */
function FresnelVector3D({
  length,
  angle,
  color,
  label,
  thickness = 0.04,
}: {
  length: number;
  angle: number;
  color: string;
  label: string;
  thickness?: number;
}) {
  const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);

  return (
    <group position={[0, 0, 0]}>
      <group quaternion={quaternion}>
        {/* Shaft */}
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        {/* Cone Head */}
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.6, thickness * 4, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Tip Label */}
      <Html position={[Math.cos(angle) * (length + 0.35), Math.sin(angle) * (length + 0.35), 0]} center>
        <div
          className="font-mono font-black text-xs px-2 py-0.5 rounded-full border shadow-lg backdrop-blur whitespace-nowrap"
          style={{
            color,
            borderColor: color + "60",
            backgroundColor: "#020617ee",
            textShadow: `0px 0px 8px ${color}`,
          }}
        >
          <LatexMath math={label} />
        </div>
      </Html>
    </group>
  );
}

/* ── 3D Fresnel Complex Plane Scene ── */
function FresnelPlaneScene({
  phaseAngle,
  voltageAmp,
  currentAmp,
  frequency,
}: {
  phaseAngle: number;
  voltageAmp: number;
  currentAmp: number;
  frequency: number;
}) {
  const [timeAngle, setTimeAngle] = useState(0);

  // Rotate Fresnel vectors at angular velocity omega = 2 * PI * f
  useFrame((_, delta) => {
    setTimeAngle((prev) => (prev + 2 * Math.PI * frequency * delta * 0.4) % (2 * Math.PI));
  });

  const uAngle = timeAngle;
  const iAngle = timeAngle - phaseAngle;

  const uLength = Math.max((voltageAmp / 20) * 2.2, 0.8);
  const iLength = Math.max((currentAmp / 5) * 1.8, 0.6);

  return (
    <group position={[0, 0, 0]}>
      {/* Complex Plane Axes (Re, Im) */}
      <Line
        points={[new THREE.Vector3(-2.8, 0, 0), new THREE.Vector3(2.8, 0, 0)]}
        color="#475569"
        lineWidth={1.5}
      />
      <Line
        points={[new THREE.Vector3(0, -2.8, 0), new THREE.Vector3(0, 2.8, 0)]}
        color="#475569"
        lineWidth={1.5}
      />

      {/* Circle Guide */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[2.18, 2.22, 64]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Axis Labels */}
      <Html position={[2.9, 0, 0]} center>
        <span className="text-[10px] font-mono font-bold text-slate-400">Re (Axe réel)</span>
      </Html>
      <Html position={[0, 2.9, 0]} center>
        <span className="text-[10px] font-mono font-bold text-slate-400">Im (+j)</span>
      </Html>

      {/* Voltage Vector U (Cyan) */}
      <FresnelVector3D
        length={uLength}
        angle={uAngle}
        color="#06b6d4"
        label="\vec{U}_m"
        thickness={0.045}
      />

      {/* Current Vector I (Rose/Amber) */}
      <FresnelVector3D
        length={iLength}
        angle={iAngle}
        color="#f43f5e"
        label="\vec{I}_m"
        thickness={0.038}
      />

      {/* Origin Pivot Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/* ── 2D Real-Time Synchronized Waves (u(t) and i(t)) ── */
function SinusoidalWavesGraph({
  voltageAmp,
  currentAmp,
  phaseAngle,
  frequency,
}: {
  voltageAmp: number;
  currentAmp: number;
  phaseAngle: number;
  frequency: number;
}) {
  const width = 300;
  const height = 185;
  const padL = 34;
  const padR = 24;
  const padT = 18;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const midY = padT + plotH / 2;

  const pointsCount = 60;
  const ptsU: string[] = [];
  const ptsI: string[] = [];

  // Generate 2 full cycles (0 to 4*PI)
  for (let i = 0; i <= pointsCount; i++) {
    const tFrac = i / pointsCount;
    const theta = tFrac * 4 * Math.PI;
    const valU = Math.cos(theta);
    const valI = Math.cos(theta - phaseAngle);

    const x = padL + tFrac * plotW;
    const yU = midY - valU * (plotH * 0.42) * Math.min(voltageAmp / 15, 1.0);
    const yI = midY - valI * (plotH * 0.38) * Math.min(currentAmp / 4, 1.0);

    ptsU.push(`${x.toFixed(1)},${yU.toFixed(1)}`);
    ptsI.push(`${x.toFixed(1)},${yI.toFixed(1)}`);
  }

  const curveU = ptsU.join(" ");
  const curveI = ptsI.join(" ");

  // Phase text description
  const phaseDeg = ((phaseAngle * 180) / Math.PI).toFixed(0);
  let phaseDescription = "Tension et courant en phase";
  if (phaseAngle > 0.05) phaseDescription = `Tension en avance de ${phaseDeg}° sur le courant`;
  else if (phaseAngle < -0.05) phaseDescription = `Tension en retard de ${Math.abs(Number(phaseDeg))}° sur le courant`;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 gap-1">
        <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-200 flex items-center gap-1 uppercase tracking-tight whitespace-nowrap">
          <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Formes d&apos;Onde Temporelles u(t) & i(t)</span>
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
          f = {frequency.toFixed(1)} Hz
        </span>
      </div>

      {/* SVG Plot */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] h-auto overflow-visible font-sans">
          {/* Grid Lines */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke="#334155" strokeWidth="1" />
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Vertical Period Guides (T, 2T) */}
          <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.8" />

          {/* Axes */}
          <line x1={padL} y1={midY} x2={padL + plotW + 12} y2={midY} stroke="#64748b" strokeWidth="1.4" />
          <line x1={padL} y1={padT + plotH} x2={padL} y2={padT - 10} stroke="#64748b" strokeWidth="1.4" />

          {/* Arrows */}
          <polygon points={`${padL + plotW + 14},${midY} ${padL + plotW + 8},${midY - 3} ${padL + plotW + 8},${midY + 3}`} fill="#64748b" />
          <polygon points={`${padL},${padT - 12} ${padL - 3},${padT - 6} ${padL + 3},${padT - 6}`} fill="#64748b" />

          {/* Labels */}
          <text x={padL + plotW + 16} y={midY + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">t</text>
          <text x={padL - 6} y={padT - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">u, i</text>

          {/* Ticks */}
          <text x={padL + plotW / 2} y={midY + 12} fill="#64748b" fontSize="8.5" textAnchor="middle">T</text>
          <text x={padL + plotW} y={midY + 12} fill="#64748b" fontSize="8.5" textAnchor="middle">2T</text>

          {/* Voltage Curve u(t) (Cyan) */}
          <polyline fill="none" stroke="#06b6d4" strokeWidth="2.4" points={curveU} strokeLinecap="round" strokeLinejoin="round" />

          {/* Current Curve i(t) (Rose) */}
          <polyline fill="none" stroke="#f43f5e" strokeWidth="2.0" strokeDasharray="5 3" points={curveI} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Legend & Phase Shift Status */}
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono px-0.5 whitespace-nowrap gap-1">
          <div className="flex items-center gap-1 text-cyan-300">
            <span className="w-2.5 h-0.5 rounded-full bg-cyan-400 shrink-0"></span>
            <LatexMath math={`u(t) = ${voltageAmp.toFixed(1)}\\cos(\\omega t)`} />
          </div>
          <div className="flex items-center gap-1 text-rose-300">
            <span className="w-2.5 h-0.5 rounded-full border-b border-dashed border-rose-400 shrink-0"></span>
            <LatexMath math={`i(t) = ${currentAmp.toFixed(2)}\\cos(\\omega t - \\phi)`} />
          </div>
        </div>

        {/* Phase Pill */}
        <div className="text-[9px] sm:text-[9.5px] text-amber-300 font-mono text-center bg-slate-900/90 py-0.5 px-1.5 rounded-xl border border-amber-500/20 shadow-sm whitespace-nowrap overflow-x-auto">
          <LatexMath math={`\\text{Déphasage : } \\phi = \\phi_u - \\phi_i = ${phaseDeg}^\\circ \\quad \\iff \\quad ${phaseDescription}`} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Exported 3D Component: Impedance & Fresnel Lab ── */
export default function ImpedanceFresnel3DCanvas() {
  const [tab, setTab] = useState<DipoleTab>("rlc");

  // Controls parameters
  const [voltageAmp, setVoltageAmp] = useState(12.0); // V
  const [frequency, setFrequency] = useState(1.0); // Hz
  const [R, setR] = useState(6.0); // Ohms
  const [L, setL] = useState(0.8); // Henry (normalized)
  const [C, setC] = useState(0.25); // Farad (normalized)

  const omega = useMemo(() => 2 * Math.PI * frequency, [frequency]);

  // Complex Impedance Calculation:
  // Z = R + j*(L*omega - 1/(C*omega))
  const { Z_mag, phaseAngle, currentAmp, activePower, reactivePower, cosPhi } = useMemo(() => {
    let X = 0;
    let res = R;

    if (tab === "resistor") {
      X = 0;
      res = R;
    } else if (tab === "inductor") {
      res = 0.2; // small internal resistance
      X = L * omega;
    } else if (tab === "capacitor") {
      res = 0.2;
      X = -1 / (C * omega);
    } else {
      // RLC Série
      X = L * omega - 1 / (C * omega);
      res = R;
    }

    const mag = Math.sqrt(res * res + X * X);
    const phi = Math.atan2(X, res);
    const iAmp = mag > 0 ? voltageAmp / mag : 0;

    const uEff = voltageAmp / Math.sqrt(2);
    const iEff = iAmp / Math.sqrt(2);
    const pActive = uEff * iEff * Math.cos(phi);
    const pReactive = uEff * iEff * Math.sin(phi);

    return {
      Z_mag: mag,
      phaseAngle: phi,
      currentAmp: iAmp,
      activePower: pActive,
      reactivePower: pReactive,
      cosPhi: Math.cos(phi),
    };
  }, [tab, R, L, C, omega, voltageAmp]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      {/* ── TOP BAR: DIPOLE SELECTOR ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
            Visualiseur de Fresnel 3D & Impédances Complexes
          </h3>
        </div>

        {/* Dipole Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setTab("resistor")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "resistor"
                ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Résistance (R)
          </button>
          <button
            onClick={() => setTab("inductor")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "inductor"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Bobine (L)
          </button>
          <button
            onClick={() => setTab("capacitor")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "capacitor"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Condensateur (C)
          </button>
          <button
            onClick={() => setTab("rlc")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "rlc"
                ? "bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Circuit RLC Série
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN VIEW (LEFT 3D FRESNEL 60% + RIGHT 2D WAVES 40%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT COLUMN: 3D THREE.JS FRESNEL CANVAS (7 COLS) */}
        <div className="lg:col-span-7 h-[300px] lg:h-[340px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
          <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={1.0} />
              <OrbitControls enableZoom={true} enableRotate={true} />

              <FresnelPlaneScene
                phaseAngle={phaseAngle}
                voltageAmp={voltageAmp}
                currentAmp={currentAmp}
                frequency={frequency}
              />
            </Suspense>
          </Canvas>

          <div className="absolute top-2.5 left-2.5 pointer-events-none text-[9.5px] font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            Plan de Fresnel Tournant (ω = {omega.toFixed(1)} rad/s)
          </div>

          <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[9.5px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            🖱️ 3D Interactif • Tourner / Zoomer
          </div>
        </div>

        {/* RIGHT COLUMN: 2D SYNCHRONIZED WAVEFORMS (5 COLS) */}
        <div className="lg:col-span-5 h-[300px] lg:h-[340px]">
          <SinusoidalWavesGraph
            voltageAmp={voltageAmp}
            currentAmp={currentAmp}
            phaseAngle={phaseAngle}
            frequency={frequency}
          />
        </div>

      </div>

      {/* ── BOTTOM PANEL: SLIDERS & PARAMETER CONTROLS ── */}
      <div className="w-full bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-lg">
        
        {/* Slider Voltage Amp */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Tension Um</span>
            <span className="text-cyan-400 font-mono">{voltageAmp.toFixed(1)} V</span>
          </label>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={voltageAmp}
            onChange={(e) => setVoltageAmp(parseFloat(e.target.value))}
            className="accent-cyan-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider Frequency */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Fréquence f</span>
            <span className="text-indigo-400 font-mono">{frequency.toFixed(1)} Hz</span>
          </label>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="accent-indigo-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Slider R (if relevant) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>Résistance R</span>
            <span className="text-rose-400 font-mono">{R.toFixed(1)} Ω</span>
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={R}
            onChange={(e) => setR(parseFloat(e.target.value))}
            disabled={tab === "inductor" || tab === "capacitor"}
            className={`accent-rose-500 cursor-pointer w-full h-1.5 rounded-lg ${tab === "inductor" || tab === "capacitor" ? "opacity-30" : "opacity-100"}`}
          />
        </div>

        {/* Slider L or C */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold flex justify-between uppercase">
            <span>{tab === "capacitor" ? "Capacité C" : "Inductance L"}</span>
            <span className="text-amber-400 font-mono">
              {tab === "capacitor" ? `${(C * 10).toFixed(1)} µF` : `${(L * 10).toFixed(1)} mH`}
            </span>
          </label>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={tab === "capacitor" ? C : L}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (tab === "capacitor") setC(val);
              else setL(val);
            }}
            disabled={tab === "resistor"}
            className={`accent-amber-500 cursor-pointer w-full h-1.5 rounded-lg ${tab === "resistor" ? "opacity-30" : "opacity-100"}`}
          />
        </div>

      </div>

      {/* ── THEORETICAL VALUES SUMMARY BAR ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1 text-cyan-300">
          <LatexMath math={`|\\underline{Z}| = ${Z_mag.toFixed(2)}\\text{ }\\Omega`} />
        </div>
        <div className="flex items-center gap-1 text-amber-300">
          <LatexMath math={`I_m = ${currentAmp.toFixed(2)}\\text{ A}`} />
        </div>
        <div className="flex items-center gap-1 text-emerald-300">
          <LatexMath math={`P = U_{\\text{eff}} I_{\\text{eff}} \\cos\\phi = ${activePower.toFixed(2)}\\text{ W}`} />
        </div>
        <div className="flex items-center gap-1 text-indigo-300 font-bold">
          <LatexMath math={`\\cos\\phi = ${cosPhi.toFixed(2)} \\quad (Q = ${reactivePower.toFixed(2)}\\text{ VAR})`} />
        </div>
      </div>
    </div>
  );
}
