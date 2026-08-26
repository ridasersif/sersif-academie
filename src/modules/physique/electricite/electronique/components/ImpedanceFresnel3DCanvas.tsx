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
        badge = "\\text{Purement Résistif} \\cdot \\phi = 0^\\circ \\text{ (En phase)}";
        color = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
      } else if (tab === "inductor") {
        // Pure Inductance: Z = L*omega, phi = +PI/2 (+90°) strictly
        res = 0;
        X = L * omega;
        mag = X;
        phi = Math.PI / 2; // +90° strictly
        badge = "\\text{Bobine Idéale} \\cdot \\phi = +90^\\circ \\text{ (Tension en avance)}";
        color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
      } else if (tab === "capacitor") {
        // Pure Capacitance: Z = 1/(C*omega), phi = -PI/2 (-90°) strictly
        res = 0;
        X = -1 / (C * omega);
        mag = Math.abs(X);
        phi = -Math.PI / 2; // -90° strictly
        badge = "\\text{Condensateur Idéal} \\cdot \\phi = -90^\\circ \\text{ (Tension en retard)}";
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
          badge = "\\text{🎯 Résonance (} f = f_0, \\ Z = R, \\ I_{\\max} \\text{)}";
          color = "text-purple-300 bg-purple-500/15 border-purple-500/40";
        } else if (X > 0) {
          badge = `\\text{Comportement Inductif} \\cdot \\phi = +${deg}^\\circ \\text{ (Avance)}`;
          color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
        } else {
          badge = `\\text{Comportement Capacitif} \\cdot \\phi = ${deg}^\\circ \\text{ (Retard)}`;
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
        setTimeAngle((prev) => (prev + omega * dt * 0.45 * speedMultiplier) % (2 * Math.PI));
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, omega, speedMultiplier]);

  // Trigonometric angles of vectors (counter-clockwise rotation)
  // Voltage vector: angle = timeAngle
  // Current vector: angle = timeAngle - phaseAngle
  const uAngle = timeAngle;
  const iAngle = timeAngle - phaseAngle;

  // Geometry dimensions in Unified SVG viewBox (660 x 220)
  const circleCX = 100;
  const circleCY = 110;
  const maxCircleR = 75;

  // Normalised vector lengths
  const lenU = Math.min(Math.max((voltageAmp / 24) * maxCircleR, 42), maxCircleR);
  const lenI = Math.min(Math.max((currentAmp / 5) * (maxCircleR * 0.88), 32), maxCircleR * 0.88);

  // Vector Tips coordinates on Circle
  const uTipX = circleCX + Math.cos(uAngle) * lenU;
  const uTipY = circleCY - Math.sin(uAngle) * lenU; // SVG Y is down
  const iTipX = circleCX + Math.cos(iAngle) * lenI;
  const iTipY = circleCY - Math.sin(iAngle) * lenI;

  // Oscilloscope parameters (Right side: x = 230 to 630)
  const oscXStart = 240;
  const oscWidth = 390;
  const oscMidY = circleCY; // Exactly aligned with the circle center!
  const oscAmpU = Math.min((voltageAmp / 24) * maxCircleR, maxCircleR);
  const oscAmpI = Math.min((currentAmp / 5) * (maxCircleR * 0.88), maxCircleR * 0.88);

  // Oscilloscope Traveling Wave Points (Generating moving wave in real-time)
  const wavePoints = 80;
  const ptsU: string[] = [];
  const ptsI: string[] = [];

  for (let i = 0; i <= wavePoints; i++) {
    const frac = i / wavePoints;
    const x = oscXStart + frac * oscWidth;
    // Phase shift along the x axis: theta(x, t) = timeAngle - frac * (3 * 2 * PI)
    const thetaSpatial = timeAngle - frac * 4 * Math.PI;
    const yU = oscMidY - Math.sin(thetaSpatial) * oscAmpU;
    const yI = oscMidY - Math.sin(thetaSpatial - phaseAngle) * oscAmpI;

    ptsU.push(`${x.toFixed(1)},${yU.toFixed(1)}`);
    ptsI.push(`${x.toFixed(1)},${yI.toFixed(1)}`);
  }

  // Live Pen coordinates at the entrance of the oscilloscope (x = oscXStart)
  const livePenUX = oscXStart;
  const livePenUY = uTipY;
  const livePenIX = oscXStart;
  const livePenIY = iTipY;

  // Instantaneous voltage and current
  const uInstant = voltageAmp * Math.sin(uAngle);
  const iInstant = currentAmp * Math.sin(iAngle);

  return (
    <div className="w-full bg-slate-950 border border-slate-800/90 rounded-3xl p-3 sm:p-5 shadow-2xl space-y-3 font-sans">
      {/* ── TOP BAR : TITLE & STATE BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/70 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
            Génération des Formes d&apos;Onde par Vecteurs de Fresnel
          </h3>
        </div>

        {/* State Badge */}
        <span className={`text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border self-start sm:self-auto shadow-sm ${badgeColor}`}>
          <LatexMath math={stateBadge} />
        </span>
      </div>

      {/* ── DIPOLE BUTTONS (ALL ON A SINGLE ROW) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <button
          onClick={() => setTab("resistor")}
          className={`py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center whitespace-nowrap ${
            tab === "resistor"
              ? "bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <span>Résistance (R)</span>
        </button>

        <button
          onClick={() => setTab("inductor")}
          className={`py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center whitespace-nowrap ${
            tab === "inductor"
              ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <span>Bobine Idéale (L)</span>
        </button>

        <button
          onClick={() => setTab("capacitor")}
          className={`py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center whitespace-nowrap ${
            tab === "capacitor"
              ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <span>Condensateur (C)</span>
        </button>

        <button
          onClick={() => setTab("rlc")}
          className={`py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center whitespace-nowrap ${
            tab === "rlc"
              ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <span>Circuit RLC Série</span>
        </button>
      </div>

      {/* ── UNIFIED FRESNEL-TO-OSCILLOSCOPE CANVAS (SVG) ── */}
      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto">
        <svg
          viewBox="0 0 660 220"
          className="w-full min-w-[580px] max-w-[700px] h-auto mx-auto font-sans overflow-visible"
        >
          {/* ════ LEFT SECTION: FRESNEL ROTATING CIRCLE (x=0 to 220) ════ */}
          <g>
            {/* Polar Concentric Circles */}
            <circle cx={circleCX} cy={circleCY} r={32} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={circleCX} cy={circleCY} r={55} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={circleCX} cy={circleCY} r={maxCircleR} fill="none" stroke="#334155" strokeWidth="1.2" />

            {/* Axes */}
            <line x1={circleCX - maxCircleR - 10} y1={circleCY} x2={circleCX + maxCircleR + 10} y2={circleCY} stroke="#475569" strokeWidth="1.4" />
            <line x1={circleCX} y1={circleCY - maxCircleR - 10} x2={circleCX} y2={circleCY + maxCircleR + 10} stroke="#475569" strokeWidth="1.4" />

            {/* Axis Labels */}
            <text x={circleCX + maxCircleR + 14} y={circleCY + 3.5} fill="#94a3b8" fontSize="8.5" fontWeight="bold">Re</text>
            <text x={circleCX} y={circleCY - maxCircleR - 14} fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">+j</text>

            {/* Phase Arc Between Vectors */}
            {Math.abs(phaseAngle) > 0.05 && (
              <path
                d={`M ${circleCX + Math.cos(iAngle) * 26} ${circleCY - Math.sin(iAngle) * 26} A 26 26 0 0 ${phaseAngle > 0 ? 0 : 1} ${circleCX + Math.cos(uAngle) * 26} ${circleCY - Math.sin(uAngle) * 26}`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            )}

            {/* Voltage Vector U (Neon Cyan Arrow) */}
            <line x1={circleCX} y1={circleCY} x2={uTipX} y2={uTipY} stroke="#06b6d4" strokeWidth="3.2" strokeLinecap="round" />
            <polygon
              points={`${uTipX},${uTipY} ${uTipX - Math.cos(uAngle - 0.3) * 11},${uTipY + Math.sin(uAngle - 0.3) * 11} ${uTipX - Math.cos(uAngle + 0.3) * 11},${uTipY + Math.sin(uAngle + 0.3) * 11}`}
              fill="#06b6d4"
            />
            {/* Label Um */}
            <text
              x={circleCX + Math.cos(uAngle) * (lenU + 14)}
              y={circleCY - Math.sin(uAngle) * (lenU + 14) + 3}
              fill="#67e8f9"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Um
            </text>

            {/* Current Vector I (Neon Rose/Pink Arrow) */}
            <line x1={circleCX} y1={circleCY} x2={iTipX} y2={iTipY} stroke="#f43f5e" strokeWidth="2.6" strokeLinecap="round" />
            <polygon
              points={`${iTipX},${iTipY} ${iTipX - Math.cos(iAngle - 0.35) * 9},${iTipY + Math.sin(iAngle - 0.35) * 9} ${iTipX - Math.cos(iAngle + 0.35) * 9},${iTipY + Math.sin(iAngle + 0.35) * 9}`}
              fill="#f43f5e"
            />
            {/* Label Im */}
            <text
              x={circleCX + Math.cos(iAngle) * (lenI + 13)}
              y={circleCY - Math.sin(iAngle) * (lenI + 13) + 3}
              fill="#fda4af"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Im
            </text>

            {/* Center Origin Pivot */}
            <circle cx={circleCX} cy={circleCY} r={4} fill="#38bdf8" />
          </g>

          {/* ════ PROJECTION LASER LINES CONNECTING VECTOR TIPS TO WAVE GENERATOR ════ */}
          <g>
            {/* Cyan Laser Line from Vector U Tip to Live Pen U */}
            <line
              x1={uTipX}
              y1={uTipY}
              x2={livePenUX}
              y2={livePenUY}
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity={0.85}
            />
            {/* Glowing Pen Head U */}
            <circle cx={livePenUX} cy={livePenUY} r={4.5} fill="#06b6d4" />
            <circle cx={livePenUX} cy={livePenUY} r={8} fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity={0.6} />

            {/* Rose Laser Line from Vector I Tip to Live Pen I */}
            <line
              x1={iTipX}
              y1={iTipY}
              x2={livePenIX}
              y2={livePenIY}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity={0.85}
            />
            {/* Glowing Pen Head I */}
            <circle cx={livePenIX} cy={livePenIY} r={4} fill="#f43f5e" />
            <circle cx={livePenIX} cy={livePenIY} r={7} fill="none" stroke="#f43f5e" strokeWidth="1.2" opacity={0.6} />
          </g>

          {/* ════ RIGHT SECTION: SYNCHRONIZED TRAVELING WAVE OSCILLOSCOPE (x=240 to 630) ════ */}
          <g>
            {/* Oscilloscope Grid */}
            <line x1={oscXStart} y1={oscMidY - maxCircleR} x2={oscXStart + oscWidth} y2={oscMidY - maxCircleR} stroke="#0f343a" strokeWidth="0.8" />
            <line x1={oscXStart} y1={oscMidY - maxCircleR / 2} x2={oscXStart + oscWidth} y2={oscMidY - maxCircleR / 2} stroke="#0f343a" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1={oscXStart} y1={oscMidY} x2={oscXStart + oscWidth} y2={oscMidY} stroke="#134e56" strokeWidth="1.2" />
            <line x1={oscXStart} y1={oscMidY + maxCircleR / 2} x2={oscXStart + oscWidth} y2={oscMidY + maxCircleR / 2} stroke="#0f343a" strokeDasharray="3 3" strokeWidth="0.8" />
            <line x1={oscXStart} y1={oscMidY + maxCircleR} x2={oscXStart + oscWidth} y2={oscMidY + maxCircleR} stroke="#0f343a" strokeWidth="0.8" />

            {/* Period Divisions (T, 2T) */}
            <line x1={oscXStart + oscWidth * 0.5} y1={oscMidY - maxCircleR} x2={oscXStart + oscWidth * 0.5} y2={oscMidY + maxCircleR} stroke="#134e56" strokeWidth="1.2" />
            <line x1={oscXStart + oscWidth} y1={oscMidY - maxCircleR} x2={oscXStart + oscWidth} y2={oscMidY + maxCircleR} stroke="#0f343a" strokeWidth="0.8" />

            {/* Axes */}
            <line x1={oscXStart} y1={oscMidY} x2={oscXStart + oscWidth + 12} y2={oscMidY} stroke="#475569" strokeWidth="1.4" />
            <line x1={oscXStart} y1={oscMidY + maxCircleR} x2={oscXStart} y2={oscMidY - maxCircleR - 8} stroke="#475569" strokeWidth="1.4" />

            {/* Axis Labels */}
            <text x={oscXStart + oscWidth + 15} y={oscMidY + 3.5} fill="#94a3b8" fontSize="9" fontWeight="bold">t</text>
            <text x={oscXStart - 5} y={oscMidY - maxCircleR - 8} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">u, i</text>

            <text x={oscXStart + oscWidth * 0.5} y={oscMidY + maxCircleR + 12} fill="#64748b" fontSize="8" textAnchor="middle">T</text>
            <text x={oscXStart + oscWidth} y={oscMidY + maxCircleR + 12} fill="#64748b" fontSize="8" textAnchor="middle">2T</text>

            {/* Traveling Wave u(t) (Cyan with Neon Glow) */}
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.4"
              points={ptsU.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Traveling Wave i(t) (Rose with Dashed Glow) */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.0"
              strokeDasharray="4 2"
              points={ptsI.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Wave Legend Badges on Screen (Top Right) */}
            <rect x={oscXStart + oscWidth - 150} y={oscMidY - maxCircleR - 2} width="150" height="34" rx="6" fill="#020617" fillOpacity="0.8" stroke="#1e293b" strokeWidth="0.8" />
            <text x={oscXStart + oscWidth - 10} y={oscMidY - maxCircleR + 12} fill="#22d3ee" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              u(t) = Um·sin(ωt)
            </text>
            <text x={oscXStart + oscWidth - 10} y={oscMidY - maxCircleR + 25} fill="#fb7185" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              i(t) = Im·sin(ωt - φ)
            </text>
          </g>
        </svg>
      </div>

      {/* ── PLAYBACK BAR & INSTANTANEOUS VALUES ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center gap-1.5 font-bold"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Lecture"}</span>
          </button>
          <button
            onClick={() => setTimeAngle(0)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="Remise à t=0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 0.5 : speedMultiplier === 0.5 ? 2 : 1)}
            className="px-2 py-1 font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            {speedMultiplier}x
          </button>
        </div>

        {/* Live Values */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span><LatexMath math={`u(t) = ${uInstant.toFixed(1)}\\text{ V}`} /></span>
          </div>
          <div className="flex items-center gap-1 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span><LatexMath math={`i(t) = ${iInstant.toFixed(2)}\\text{ A}`} /></span>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE PARAMETERS SLIDERS ── */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/90 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-300">
          <span>Paramètres Électriques Réglables :</span>
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
              <span className="text-cyan-400 font-mono font-bold"><LatexMath math={`${voltageAmp.toFixed(0)}\\text{ V}`} /></span>
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
              <span className="text-indigo-400 font-mono font-bold"><LatexMath math={`${frequency.toFixed(2)}\\text{ Hz}`} /></span>
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
                {tab === "inductor" || tab === "capacitor" ? "0 Ω (Idéale)" : <LatexMath math={`${R.toFixed(1)}\\text{ }\\Omega`} />}
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
                {tab === "resistor" ? "—" : tab === "capacitor" ? <LatexMath math={`${(C * 100).toFixed(0)}\\text{ mF}`} /> : <LatexMath math={`${(L * 100).toFixed(0)}\\text{ mH}`} />}
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

      {/* ── THEORETICAL VALUES & POWER TELEMETRY HUD ── */}
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
