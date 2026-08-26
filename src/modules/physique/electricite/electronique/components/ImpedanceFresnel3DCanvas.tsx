/* eslint-disable react-hooks/purity */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Activity,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type DipoleTab = "resistor" | "inductor" | "capacitor" | "rlc";

export default function ImpedanceFresnel3DCanvas() {
  const [tab, setTab] = useState<DipoleTab>("rlc");

  // Simulation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  // Electrical Parameters
  const [voltageAmp, setVoltageAmp] = useState(12.0); // V
  const [frequency, setFrequency] = useState(1.0); // Hz
  const [R, setR] = useState(6.0); // Ohms
  const [L, setL] = useState(0.8); // Henry (normalized)
  const [C, setC] = useState(0.25); // Farad (normalized)

  const omega = useMemo(() => 2 * Math.PI * frequency, [frequency]);

  // Resonance Frequency in RLC Mode: f0 = 1 / (2*PI*sqrt(LC))
  const f0 = useMemo(() => {
    if (L > 0 && C > 0) {
      return 1 / (2 * Math.PI * Math.sqrt(L * C));
    }
    return 1.0;
  }, [L, C]);

  // Exact Resonance Action
  const setExactResonance = () => {
    setFrequency(parseFloat(f0.toFixed(2)));
  };

  /* ── 100% Strict Physical Calculations ── */
  const { Z_mag, phaseAngle, currentAmp, activePower, reactivePower, cosPhi, stateBadge, badgeColor } =
    useMemo(() => {
      let X = 0;
      let res = R;
      let phi = 0;
      let mag = 0;
      let badge = "En phase";
      let color = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";

      if (tab === "resistor") {
        // Pure Resistor: Z = R, phi = 0 strictly
        res = R;
        X = 0;
        mag = R;
        phi = 0;
        badge = "Purement Résistif • φ = 0° (En phase)";
        color = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
      } else if (tab === "inductor") {
        // Pure Inductance: Z = L*omega, phi = +PI/2 (+90°) strictly
        res = 0;
        X = L * omega;
        mag = X;
        phi = Math.PI / 2; // +90° strictly
        badge = "Bobine Idéale • φ = +90° (Tension en avance de quadrature)";
        color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
      } else if (tab === "capacitor") {
        // Pure Capacitance: Z = 1/(C*omega), phi = -PI/2 (-90°) strictly
        res = 0;
        X = -1 / (C * omega);
        mag = Math.abs(X);
        phi = -Math.PI / 2; // -90° strictly
        badge = "Condensateur Idéal • φ = -90° (Tension en retard de quadrature)";
        color = "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
      } else {
        // RLC Series Circuit
        res = R;
        X = L * omega - 1 / (C * omega);
        mag = Math.sqrt(res * res + X * X);
        phi = Math.atan2(X, res);

        const deg = Math.round((phi * 180) / Math.PI);
        const diffF = Math.abs(frequency - f0);
        if (diffF < 0.04) {
          badge = `🎯 Résonance d'Intensité (f = f₀ = ${f0.toFixed(2)} Hz, Z = R, I maximal)`;
          color = "text-purple-300 bg-purple-500/15 border-purple-500/40";
        } else if (X > 0) {
          badge = `Comportement Inductif • φ = +${deg}° (Tension en avance)`;
          color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
        } else {
          badge = `Comportement Capacitif • φ = ${deg}° (Tension en retard)`;
          color = "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
        }
      }

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
        stateBadge: badge,
        badgeColor: color,
      };
    }, [tab, R, L, C, omega, voltageAmp, frequency, f0]);

  // Real-time animation angle theta(t) = omega * t
  const [timeAngle, setTimeAngle] = useState(0);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isPlaying) {
        setTimeAngle((prev) => (prev + omega * dt * 0.35 * speedMultiplier) % (2 * Math.PI));
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, omega, speedMultiplier]);

  // Angles of vectors
  // theta_u = timeAngle
  // theta_i = timeAngle - phaseAngle
  const uAngle = timeAngle;
  const iAngle = timeAngle - phaseAngle;

  // Vector lengths on radar (normalized)
  const maxR = 90;
  const lenU = Math.min(Math.max((voltageAmp / 24) * maxR, 45), maxR);
  const lenI = Math.min(Math.max((currentAmp / 5) * (maxR * 0.85), 35), maxR * 0.85);

  const cx = 115;
  const cy = 110;
  const uX = cx + Math.cos(uAngle) * lenU;
  const uY = cy - Math.sin(uAngle) * lenU; // SVG Y is inverted
  const iX = cx + Math.cos(iAngle) * lenI;
  const iY = cy - Math.sin(iAngle) * lenI;

  // Real axis projections
  const projUX = uX;
  const projIX = iX;

  // Instantaneous values
  const uInstant = voltageAmp * Math.cos(uAngle);
  const iInstant = currentAmp * Math.cos(iAngle);

  // Oscilloscope curve points (2 full cycles)
  const oscW = 240;
  const oscH = 150;
  const oscPadL = 28;
  const oscPadT = 18;
  const oscMidY = oscPadT + oscH / 2;
  const pointsCount = 60;
  const ptsU: string[] = [];
  const ptsI: string[] = [];

  for (let i = 0; i <= pointsCount; i++) {
    const frac = i / pointsCount;
    const th = frac * 4 * Math.PI;
    const vu = Math.cos(th);
    const vi = Math.cos(th - phaseAngle);

    const x = oscPadL + frac * oscW;
    const yU = oscMidY - vu * (oscH * 0.40) * Math.min(voltageAmp / 16, 1.0);
    const yI = oscMidY - vi * (oscH * 0.36) * Math.min(currentAmp / 4.5, 1.0);

    ptsU.push(`${x.toFixed(1)},${yU.toFixed(1)}`);
    ptsI.push(`${x.toFixed(1)},${yI.toFixed(1)}`);
  }

  // Oscilloscope sweep cursor position
  const sweepFrac = (uAngle % (2 * Math.PI)) / (2 * Math.PI);
  const beamX = oscPadL + (sweepFrac * oscW) / 2; // on 1st period
  const beamX2 = oscPadL + oscW / 2 + (sweepFrac * oscW) / 2; // on 2nd period

  return (
    <div className="w-full bg-slate-950 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 font-sans">
      
      {/* ── HEADER : TABS & STATE BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Visualiseur de Fresnel & Oscilloscope Synchronisé
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border inline-block mt-0.5 ${badgeColor}`}>
              {stateBadge}
            </span>
          </div>
        </div>

        {/* Dipole Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setTab("resistor")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "resistor"
                ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Résistance (R)
          </button>
          <button
            onClick={() => setTab("inductor")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "inductor"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Bobine (L)
          </button>
          <button
            onClick={() => setTab("capacitor")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "capacitor"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Condensateur (C)
          </button>
          <button
            onClick={() => setTab("rlc")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "rlc"
                ? "bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Circuit RLC Série
          </button>
        </div>
      </div>

      {/* ── UNIFIED 2-PANEL LAB VIEW (COMPACT HEIGHT ~ 250px) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PANEL 1: FRESNEL VECTOR RADAR (SVG) */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Plan de Fresnel Tournant</span>
            </span>
            <span className="text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              <LatexMath math={`\\omega = ${omega.toFixed(1)}\\text{ rad/s}`} />
            </span>
          </div>

          {/* SVG Radar */}
          <div className="w-full flex items-center justify-center">
            <svg viewBox="0 0 230 220" className="w-full max-w-[230px] h-auto font-sans overflow-visible">
              {/* Polar Circles */}
              <circle cx={cx} cy={cy} r={35} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={cx} cy={cy} r={65} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={cx} cy={cy} r={maxR} fill="none" stroke="#334155" strokeWidth="1.2" />

              {/* Complex Axes */}
              <line x1={15} y1={cy} x2={215} y2={cy} stroke="#475569" strokeWidth="1.5" />
              <line x1={cx} y1={15} x2={cx} y2={205} stroke="#475569" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={220} y={cy + 3.5} fill="#94a3b8" fontSize="9" fontWeight="bold">Re</text>
              <text x={cx} y={10} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">+j</text>

              {/* Real Axis Projections (Dashed Lines) */}
              <line x1={uX} y1={uY} x2={uX} y2={cy} stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />
              <line x1={iX} y1={iY} x2={iX} y2={cy} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} />
              <circle cx={projUX} cy={cy} r={3} fill="#06b6d4" />
              <circle cx={projIX} cy={cy} r={3} fill="#f43f5e" />

              {/* Phase Angle Arc between I and U */}
              {Math.abs(phaseAngle) > 0.05 && (
                <path
                  d={`M ${cx + Math.cos(iAngle) * 30} ${cy - Math.sin(iAngle) * 30} A 30 30 0 0 ${phaseAngle > 0 ? 0 : 1} ${cx + Math.cos(uAngle) * 30} ${cy - Math.sin(uAngle) * 30}`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
              )}

              {/* Voltage Vector U (Neon Cyan) */}
              <line x1={cx} y1={cy} x2={uX} y2={uY} stroke="#06b6d4" strokeWidth="3.2" strokeLinecap="round" />
              <polygon
                points={`${uX},${uY} ${uX - Math.cos(uAngle - 0.3) * 10},${uY + Math.sin(uAngle - 0.3) * 10} ${uX - Math.cos(uAngle + 0.3) * 10},${uY + Math.sin(uAngle + 0.3) * 10}`}
                fill="#06b6d4"
              />
              <text
                x={cx + Math.cos(uAngle) * (lenU + 14)}
                y={cy - Math.sin(uAngle) * (lenU + 14) + 3}
                fill="#67e8f9"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="serif"
              >
                Um
              </text>

              {/* Current Vector I (Neon Rose) */}
              <line x1={cx} y1={cy} x2={iX} y2={iY} stroke="#f43f5e" strokeWidth="2.6" strokeLinecap="round" />
              <polygon
                points={`${iX},${iY} ${iX - Math.cos(iAngle - 0.35) * 8},${iY + Math.sin(iAngle - 0.35) * 8} ${iX - Math.cos(iAngle + 0.35) * 8},${iY + Math.sin(iAngle + 0.35) * 8}`}
                fill="#f43f5e"
              />
              <text
                x={cx + Math.cos(iAngle) * (lenI + 13)}
                y={cy - Math.sin(iAngle) * (lenI + 13) + 3}
                fill="#fda4af"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="serif"
              >
                Im
              </text>

              {/* Center Pivot */}
              <circle cx={cx} cy={cy} r={4} fill="#38bdf8" />
            </svg>
          </div>

          {/* Quick Playback Bar */}
          <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                title={isPlaying ? "Pause" : "Lecture"}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setTimeAngle(0)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                title="Remettre à t=0"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 0.5 : speedMultiplier === 0.5 ? 2 : 1)}
                className="px-2 py-0.5 font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                {speedMultiplier}x
              </button>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400 font-bold">u(t) = {uInstant.toFixed(1)} V</span> • <span className="text-rose-400 font-bold">i(t) = {iInstant.toFixed(2)} A</span>
            </div>
          </div>
        </div>

        {/* PANEL 2: SYNCHRONIZED OSCILLOSCOPE (SVG) */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Oscilloscope Temporel (2 Périodes)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                u(t)
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                i(t)
              </span>
            </div>
          </div>

          {/* Oscilloscope SVG Display */}
          <div className="w-full flex items-center justify-center">
            <svg viewBox={`0 0 ${oscPadL + oscW + 15} ${oscPadT + oscH + 15}`} className="w-full max-w-[290px] h-auto font-sans overflow-visible">
              {/* Graticule */}
              <line x1={oscPadL} y1={oscPadT} x2={oscPadL + oscW} y2={oscPadT} stroke="#0f343a" strokeWidth="0.8" />
              <line x1={oscPadL} y1={oscMidY} x2={oscPadL + oscW} y2={oscMidY} stroke="#134e56" strokeWidth="1.2" />
              <line x1={oscPadL} y1={oscPadT + oscH} x2={oscPadL + oscW} y2={oscPadT + oscH} stroke="#0f343a" strokeWidth="0.8" />
              <line x1={oscPadL + oscW / 2} y1={oscPadT} x2={oscPadL + oscW / 2} y2={oscPadT + oscH} stroke="#134e56" strokeWidth="1.2" />
              <line x1={oscPadL + oscW} y1={oscPadT} x2={oscPadL + oscW} y2={oscPadT + oscH} stroke="#0f343a" strokeWidth="0.8" />

              {/* Axes */}
              <line x1={oscPadL} y1={oscMidY} x2={oscPadL + oscW + 10} y2={oscMidY} stroke="#475569" strokeWidth="1.4" />
              <line x1={oscPadL} y1={oscPadT + oscH} x2={oscPadL} y2={oscPadT - 6} stroke="#475569" strokeWidth="1.4" />

              <text x={oscPadL + oscW + 12} y={oscMidY + 3.5} fill="#94a3b8" fontSize="8.5" fontWeight="bold">t</text>
              <text x={oscPadL - 4} y={oscPadT - 4} fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="end">u, i</text>

              <text x={oscPadL + oscW / 2} y={oscMidY + 11} fill="#64748b" fontSize="7.5" textAnchor="middle">T</text>
              <text x={oscPadL + oscW} y={oscMidY + 11} fill="#64748b" fontSize="7.5" textAnchor="middle">2T</text>

              {/* Wave u(t) (Cyan) */}
              <polyline fill="none" stroke="#06b6d4" strokeWidth="2.4" points={ptsU.join(" ")} strokeLinecap="round" strokeLinejoin="round" />

              {/* Wave i(t) (Rose) */}
              <polyline fill="none" stroke="#f43f5e" strokeWidth="2.0" strokeDasharray="4 2" points={ptsI.join(" ")} strokeLinecap="round" strokeLinejoin="round" />

              {/* Synchronized Sweep Beam Indicator */}
              <line x1={beamX} y1={oscPadT} x2={beamX} y2={oscPadT + oscH} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" opacity={0.8} />
              <line x1={beamX2} y1={oscPadT} x2={beamX2} y2={oscPadT + oscH} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" opacity={0.8} />
            </svg>
          </div>

          {/* Mathematical Form */}
          <div className="text-[9.5px] font-mono text-center bg-slate-950/80 py-1 px-2 rounded-lg border border-slate-800 text-slate-300">
            <LatexMath math={`u(t) = ${voltageAmp.toFixed(0)}\\cos(\\omega t) \\quad \\text{et} \\quad i(t) = ${currentAmp.toFixed(2)}\\cos(\\omega t - \\phi)`} />
          </div>
        </div>

      </div>

      {/* ── COMPACT CONTROLS RIBBON ── */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/90 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-300">
          <span>Paramètres Réglables :</span>
          {tab === "rlc" && (
            <button
              onClick={setExactResonance}
              className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Accorder à la Résonance (f₀ = {f0.toFixed(2)} Hz)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Voltage Um */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Tension Um</span>
              <span className="text-cyan-400 font-mono font-bold">{voltageAmp.toFixed(0)} V</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={voltageAmp}
              onChange={(e) => setVoltageAmp(parseFloat(e.target.value))}
              className="accent-cyan-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Frequency f */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Fréquence f</span>
              <span className="text-indigo-400 font-mono font-bold">{frequency.toFixed(2)} Hz</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="accent-indigo-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Resistance R */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Résistance R</span>
              <span className={`font-mono font-bold ${tab === "inductor" || tab === "capacitor" ? "text-slate-600" : "text-rose-400"}`}>
                {tab === "inductor" || tab === "capacitor" ? "0 Ω (Idéale)" : `${R.toFixed(1)} Ω`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={R}
              onChange={(e) => setR(parseFloat(e.target.value))}
              disabled={tab === "inductor" || tab === "capacitor"}
              className={`accent-rose-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg ${tab === "inductor" || tab === "capacitor" ? "opacity-25 cursor-not-allowed" : "opacity-100"}`}
            />
          </div>

          {/* Inductance L or Capacitance C */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">{tab === "capacitor" ? "Capacité C" : "Inductance L"}</span>
              <span className={`font-mono font-bold ${tab === "resistor" ? "text-slate-600" : "text-amber-400"}`}>
                {tab === "resistor" ? "—" : tab === "capacitor" ? `${(C * 100).toFixed(0)} mF` : `${(L * 100).toFixed(0)} mH`}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={tab === "capacitor" ? C : L}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (tab === "capacitor") setC(val);
                else setL(val);
              }}
              disabled={tab === "resistor"}
              className={`accent-amber-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg ${tab === "resistor" ? "opacity-25 cursor-not-allowed" : "opacity-100"}`}
            />
          </div>
        </div>
      </div>

      {/* ── COMPACT TELEMETRY HUD ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">Impédance |Z|</span>
          <div className="text-cyan-300 font-bold mt-0.5">
            <LatexMath math={`|\\underline{Z}| = ${Z_mag.toFixed(2)}\\text{ }\\Omega`} />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">Courant Crête</span>
          <div className="text-rose-300 font-bold mt-0.5">
            <LatexMath math={`I_m = ${currentAmp.toFixed(2)}\\text{ A}`} />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">Puissance Active (P)</span>
          <div className="text-emerald-300 font-bold mt-0.5">
            <LatexMath math={`P = ${activePower.toFixed(1)}\\text{ W}`} />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">Facteur de Puissance</span>
          <div className="text-amber-300 font-bold mt-0.5">
            <LatexMath math={`\\cos\\phi = ${cosPhi.toFixed(2)}`} />
          </div>
        </div>
      </div>

    </div>
  );
}
