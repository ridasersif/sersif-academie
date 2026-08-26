/* eslint-disable react-hooks/purity */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type DipoleTab = "resistor" | "inductor" | "capacitor" | "rlc";

export default function ImpedanceFresnel3DCanvas() {
  const [tab, setTab] = useState<DipoleTab>("rlc");

  // Simulation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  // Electrical Parameters (SI Units)
  const [voltageAmp, setVoltageAmp] = useState(12.0); // V
  const [frequency, setFrequency] = useState(1.0); // Hz
  const [R, setR] = useState(5.0); // Ohms
  const [L, setL] = useState(0.8); // Henry
  const [C, setC] = useState(0.025); // Farad (25 mF)

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

  /* ── 100% Strict Physical & Mathematical Calculations ── */
  const { Z_mag, phaseAngle, currentAmp, activePower, reactivePower, cosPhi, stateBadge, badgeColor, formulaI } =
    useMemo(() => {
      let X = 0;
      let res = R;
      let phi = 0;
      let mag = 0;
      let badge = "\\text{En phase}";
      let color = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
      let formI = "i(t) = I_m \\sin(\\omega t)";

      if (tab === "resistor") {
        // Pure Resistor: Z = R, phi = 0 strictly
        res = R;
        X = 0;
        mag = R;
        phi = 0;
        badge = "\\text{Purement Résistif} \\cdot \\phi = 0^\\circ \\text{ (En phase)}";
        color = "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
        formI = "i(t) = Im · sin(ωt)";
      } else if (tab === "inductor") {
        // Pure Inductance: Z = L*omega, phi = +PI/2 (+90°) strictly
        res = 0;
        X = L * omega;
        mag = X;
        phi = Math.PI / 2; // +90° strictly
        badge = "\\text{Bobine Idéale} \\cdot \\phi = +90^\\circ \\text{ (Tension en avance)}";
        color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
        formI = "i(t) = Im · sin(ωt - 90°)";
      } else if (tab === "capacitor") {
        // Pure Capacitance: Z = 1/(C*omega), phi = -PI/2 (-90°) strictly
        res = 0;
        X = -1 / (C * omega);
        mag = Math.abs(X);
        phi = -Math.PI / 2; // -90° strictly
        badge = "\\text{Condensateur Idéal} \\cdot \\phi = -90^\\circ \\text{ (Courant en avance)}";
        color = "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
        formI = "i(t) = Im · sin(ωt + 90°)";
      } else {
        // RLC Series Circuit: Z = R + j*(L*omega - 1/(C*omega))
        res = R;
        const XL = L * omega;
        const XC = 1 / (C * omega);
        X = XL - XC;
        mag = Math.sqrt(res * res + X * X);
        // phi is STRICTLY in (-pi/2, +pi/2) because res = R > 0
        phi = Math.atan2(X, res);

        const deg = Math.round((phi * 180) / Math.PI);
        const diffF = Math.abs(frequency - f0);
        if (diffF < 0.04) {
          badge = "\\text{🎯 Résonance (} f = f_0, \\ Z = R, \\ I_{\\max} \\text{)}";
          color = "text-purple-300 bg-purple-500/15 border-purple-500/40";
          formI = "i(t) = Im · sin(ωt)";
        } else if (X > 0) {
          badge = `\\text{Comportement Inductif} \\cdot \\phi = +${deg}^\\circ \\text{ (Tension en avance)}`;
          color = "text-amber-300 bg-amber-500/10 border-amber-500/30";
          formI = `i(t) = Im · sin(ωt - ${deg}°)`;
        } else {
          badge = `\\text{Comportement Capacitif} \\cdot \\phi = ${deg}^\\circ \\text{ (Courant en avance)}`;
          color = "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
          formI = `i(t) = Im · sin(ωt + ${Math.abs(deg)}°)`;
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
        formulaI: formI,
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
  // phi = phi_u - phi_i => theta_u = timeAngle, theta_i = timeAngle - phi
  const uAngle = timeAngle;
  const iAngle = timeAngle - phaseAngle;

  // Geometry dimensions in Unified SVG viewBox (660 x 220)
  const circleCX = 100;
  const circleCY = 110;
  const maxCircleR = 75;

  // Normalised vector lengths (visually proportional)
  const lenU = Math.min(Math.max((voltageAmp / 24) * maxCircleR, 44), maxCircleR);
  const lenI = Math.min(Math.max((currentAmp / 5) * (maxCircleR * 0.85), 32), maxCircleR * 0.85);

  // Vector Tips coordinates on Circle
  const uTipX = circleCX + Math.cos(uAngle) * lenU;
  const uTipY = circleCY - Math.sin(uAngle) * lenU; // SVG Y is down
  const iTipX = circleCX + Math.cos(iAngle) * lenI;
  const iTipY = circleCY - Math.sin(iAngle) * lenI;

  // Anti-collision label positioning: normal offsets perpendicular to vector
  const uLabelX = uTipX + Math.cos(uAngle) * 12 - Math.sin(uAngle) * 12;
  const uLabelY = uTipY - Math.sin(uAngle) * 12 - Math.cos(uAngle) * 12;

  const iLabelX = iTipX + Math.cos(iAngle) * 12 + Math.sin(iAngle) * 12;
  const iLabelY = iTipY - Math.sin(iAngle) * 12 + Math.cos(iAngle) * 12;

  // Oscilloscope parameters (Right side: x = 235 to 635)
  const oscXStart = 235;
  const oscWidth = 395;
  const oscMidY = circleCY; // Exactly aligned with circle center!
  const oscAmpU = lenU;
  const oscAmpI = lenI;

  // Oscilloscope Traveling Wave Points (Time t runs from 0 to 2T to the right)
  // u(t) = Um * sin(omega*t + timeAngle)
  // i(t) = Im * sin(omega*t - phi + timeAngle)
  const wavePoints = 90;
  const ptsU: string[] = [];
  const ptsI: string[] = [];

  for (let i = 0; i <= wavePoints; i++) {
    const frac = i / wavePoints;
    const x = oscXStart + frac * oscWidth;
    // thetaTime = frac * 4*PI + timeAngle
    const thetaTime = frac * 4 * Math.PI + timeAngle;
    const yU = oscMidY - Math.sin(thetaTime) * oscAmpU;
    const yI = oscMidY - Math.sin(thetaTime - phaseAngle) * oscAmpI;

    ptsU.push(`${x.toFixed(1)},${yU.toFixed(1)}`);
    ptsI.push(`${x.toFixed(1)},${yI.toFixed(1)}`);
  }

  // Live Pen coordinates at the entrance of the oscilloscope (x = oscXStart, t = 0)
  // At t=0: yU(0) = oscMidY - sin(timeAngle)*lenU === uTipY (PIXEL-PERFECT HORIZONTAL MATCH!)
  // At t=0: yI(0) = oscMidY - sin(timeAngle - phi)*lenI === iTipY (PIXEL-PERFECT HORIZONTAL MATCH!)
  const livePenUX = oscXStart;
  const livePenUY = uTipY;
  const livePenIX = oscXStart;
  const livePenIY = iTipY;

  // Instantaneous voltage and current values
  const uInstant = voltageAmp * Math.sin(uAngle);
  const iInstant = currentAmp * Math.sin(iAngle);

  // Oscilloscope grid divisions (8 columns x 6 rows)
  const gridCols = 8;
  const gridRows = 6;
  const colStep = oscWidth / gridCols;
  const rowStep = (maxCircleR * 2) / gridRows;

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
            <line x1={circleCX - maxCircleR - 15} y1={circleCY} x2={circleCX + maxCircleR + 15} y2={circleCY} stroke="#475569" strokeWidth="1.4" />
            <line x1={circleCX} y1={circleCY - maxCircleR - 15} x2={circleCX} y2={circleCY + maxCircleR + 15} stroke="#475569" strokeWidth="1.4" />

            {/* Vertical and Horizontal Axis Labels (Re & +j Im) */}
            <text x={circleCX + maxCircleR + 20} y={circleCY + 3.5} fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="serif">Re</text>
            <text x={circleCX} y={circleCY - maxCircleR - 18} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="serif">+j (Im)</text>

            {/* Vertical Projection to Imaginary Axis */}
            <line x1={uTipX} y1={uTipY} x2={circleCX} y2={uTipY} stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" opacity={0.5} />
            <line x1={iTipX} y1={iTipY} x2={circleCX} y2={iTipY} stroke="#ff007f" strokeWidth="1" strokeDasharray="2 2" opacity={0.5} />
            <circle cx={circleCX} cy={uTipY} r={2.5} fill="#00f0ff" />
            <circle cx={circleCX} cy={iTipY} r={2.5} fill="#ff007f" />

            {/* Phase Arc Between Vectors (Always minor acute angle <= 90 deg) */}
            {Math.abs(phaseAngle) > 0.05 && (
              <path
                d={`M ${circleCX + Math.cos(iAngle) * 26} ${circleCY - Math.sin(iAngle) * 26} A 26 26 0 0 ${phaseAngle > 0 ? 0 : 1} ${circleCX + Math.cos(uAngle) * 26} ${circleCY - Math.sin(uAngle) * 26}`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            )}

            {/* Voltage Vector U (Crisp Sharp Arrow) */}
            <line
              x1={circleCX}
              y1={circleCY}
              x2={uTipX - Math.cos(uAngle) * 8}
              y2={uTipY + Math.sin(uAngle) * 8}
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon
              points={`
                ${uTipX},${uTipY}
                ${uTipX - Math.cos(uAngle - 0.35) * 11},${uTipY + Math.sin(uAngle - 0.35) * 11}
                ${uTipX - Math.cos(uAngle) * 8},${uTipY + Math.sin(uAngle) * 8}
                ${uTipX - Math.cos(uAngle + 0.35) * 11},${uTipY + Math.sin(uAngle + 0.35) * 11}
              `}
              fill="#00f0ff"
            />
            {/* Label Um with Crisp Halo */}
            <text
              x={uLabelX}
              y={uLabelY + 3}
              fill="#00f0ff"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
              stroke="#020617"
              strokeWidth="3px"
              paintOrder="stroke fill"
            >
              Um
            </text>

            {/* Current Vector I (Crisp Sharp Arrow) */}
            <line
              x1={circleCX}
              y1={circleCY}
              x2={iTipX - Math.cos(iAngle) * 7.5}
              y2={iTipY + Math.sin(iAngle) * 7.5}
              stroke="#ff007f"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <polygon
              points={`
                ${iTipX},${iTipY}
                ${iTipX - Math.cos(iAngle - 0.38) * 10},${iTipY + Math.sin(iAngle - 0.38) * 10}
                ${iTipX - Math.cos(iAngle) * 7.5},${iTipY + Math.sin(iAngle) * 7.5}
                ${iTipX - Math.cos(iAngle + 0.38) * 10},${iTipY + Math.sin(iAngle + 0.38) * 10}
              `}
              fill="#ff007f"
            />
            {/* Label Im with Crisp Halo */}
            <text
              x={iLabelX}
              y={iLabelY + 3}
              fill="#ff007f"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
              stroke="#020617"
              strokeWidth="3px"
              paintOrder="stroke fill"
            >
              Im
            </text>

            {/* Center Origin Pivot */}
            <circle cx={circleCX} cy={circleCY} r={4} fill="#00f0ff" stroke="#020617" strokeWidth="1" />
          </g>

          {/* ════ PROJECTION LASER LINES CONNECTING VECTOR TIPS TO WAVE GENERATOR ════ */}
          <g>
            {/* Cyan Laser Line from Vector U Tip to Live Pen U */}
            <line
              x1={uTipX}
              y1={uTipY}
              x2={livePenUX}
              y2={livePenUY}
              stroke="#00f0ff"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              opacity={0.8}
            />
            {/* Glowing Pen Head U */}
            <circle cx={livePenUX} cy={livePenUY} r={4} fill="#00f0ff" />
            <circle cx={livePenUX} cy={livePenUY} r={6.5} fill="none" stroke="#00f0ff" strokeWidth="1" opacity={0.6} />

            {/* Magenta Laser Line from Vector I Tip to Live Pen I */}
            <line
              x1={iTipX}
              y1={iTipY}
              x2={livePenIX}
              y2={livePenIY}
              stroke="#ff007f"
              strokeWidth="1.4"
              strokeDasharray="3 3"
              opacity={0.8}
            />
            {/* Glowing Pen Head I */}
            <circle cx={livePenIX} cy={livePenIY} r={3.5} fill="#ff007f" />
            <circle cx={livePenIX} cy={livePenIY} r={6} fill="none" stroke="#ff007f" strokeWidth="1" opacity={0.6} />
          </g>

          {/* ════ RIGHT SECTION: REAL OSCILLOSCOPE SCREEN (x=235 to 630) ════ */}
          <g>
            {/* Oscilloscope Phosphor Screen Dark Bezel */}
            <rect
              x={oscXStart}
              y={oscMidY - maxCircleR - 8}
              width={oscWidth}
              height={maxCircleR * 2 + 16}
              rx={8}
              fill="#030d17"
              stroke="#0d3349"
              strokeWidth="1.5"
            />

            {/* Real Oscilloscope Full Graticule Grid (8 columns x 6 rows) */}
            {Array.from({ length: gridCols + 1 }).map((_, idx) => {
              const x = oscXStart + idx * colStep;
              const isCenter = idx === gridCols / 2;
              return (
                <line
                  key={`col-${idx}`}
                  x1={x}
                  y1={oscMidY - maxCircleR - 8}
                  x2={x}
                  y2={oscMidY + maxCircleR + 8}
                  stroke={isCenter ? "#0e5a77" : "#082a3d"}
                  strokeWidth={isCenter ? 1.2 : 0.8}
                  strokeDasharray={isCenter ? undefined : "2 3"}
                />
              );
            })}

            {Array.from({ length: gridRows + 1 }).map((_, idx) => {
              const y = oscMidY - maxCircleR + idx * rowStep;
              const isCenter = idx === gridRows / 2;
              return (
                <line
                  key={`row-${idx}`}
                  x1={oscXStart}
                  y1={y}
                  x2={oscXStart + oscWidth}
                  y2={y}
                  stroke={isCenter ? "#0e5a77" : "#082a3d"}
                  strokeWidth={isCenter ? 1.2 : 0.8}
                  strokeDasharray={isCenter ? undefined : "2 3"}
                />
              );
            })}

            {/* Center Crosshair Subdivisions (Millimeter Ticks) */}
            {Array.from({ length: 40 }).map((_, idx) => {
              const x = oscXStart + (idx * oscWidth) / 40;
              return (
                <line
                  key={`tick-x-${idx}`}
                  x1={x}
                  y1={oscMidY - (idx % 5 === 0 ? 3.5 : 1.5)}
                  x2={x}
                  y2={oscMidY + (idx % 5 === 0 ? 3.5 : 1.5)}
                  stroke="#0e5a77"
                  strokeWidth="1"
                />
              );
            })}

            {/* Period Division Markers T and 2T */}
            <text x={oscXStart + oscWidth * 0.5} y={oscMidY + maxCircleR + 20} fill="#64748b" fontSize="8.5" textAnchor="middle" fontWeight="bold">T</text>
            <text x={oscXStart + oscWidth} y={oscMidY + maxCircleR + 20} fill="#64748b" fontSize="8.5" textAnchor="middle" fontWeight="bold">2T</text>

            {/* Axes Labels */}
            <text x={oscXStart + oscWidth + 12} y={oscMidY + 3.5} fill="#94a3b8" fontSize="9" fontWeight="bold">t</text>
            <text x={oscXStart - 6} y={oscMidY - maxCircleR - 8} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">u, i</text>

            {/* Traveling Wave u(t) (Neon Cyan) */}
            <polyline
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              points={ptsU.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Traveling Wave i(t) (Neon Magenta Dashed) */}
            <polyline
              fill="none"
              stroke="#ff007f"
              strokeWidth="2.2"
              strokeDasharray="5 2.5"
              points={ptsI.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Oscilloscope Digital HUD (Top Right Screen Pill) */}
            <rect x={oscXStart + oscWidth - 170} y={oscMidY - maxCircleR - 4} width="165" height="32" rx="5" fill="#01070e" fillOpacity="0.9" stroke="#0e3a4f" strokeWidth="0.8" />
            <text x={oscXStart + oscWidth - 10} y={oscMidY - maxCircleR + 9} fill="#00f0ff" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              CH1: u(t) = Um·sin(ωt)
            </text>
            <text x={oscXStart + oscWidth - 10} y={oscMidY - maxCircleR + 22} fill="#ff007f" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              CH2: {formulaI}
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
          <div className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span><LatexMath math={`i(t) = ${iInstant.toFixed(2)}\\text{ A}`} /></span>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE PARAMETERS SLIDERS (ALL 5 CONTROLS VISIBLE IN RLC MODE) ── */}
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

        {/* Dynamic Sliders Grid */}
        <div className={`grid gap-3 text-xs ${tab === "rlc" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}>
          {/* Slider 1: Voltage Um */}
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

          {/* Slider 2: Frequency f */}
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

          {/* Slider 3: Resistance R */}
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

          {/* Slider 4: Inductance L */}
          {(tab === "rlc" || tab === "inductor" || tab === "resistor") && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inductance L</span>
                <span className={`font-mono font-bold ${tab === "resistor" ? "text-slate-600" : "text-amber-400"}`}>
                  {tab === "resistor" ? "—" : <LatexMath math={`${(L * 1000).toFixed(0)}\\text{ mH}`} />}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value))}
                disabled={tab === "resistor"}
                className={`accent-amber-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg ${tab === "resistor" ? "opacity-25 cursor-not-allowed" : "opacity-100"}`}
              />
            </div>
          )}

          {/* Slider 5: Capacitance C */}
          {(tab === "rlc" || tab === "capacitor") && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Capacité C</span>
                <span className="font-mono font-bold text-cyan-400">
                  <LatexMath math={`${(C * 1000).toFixed(0)}\\text{ mF}`} />
                </span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.100"
                step="0.005"
                value={C}
                onChange={(e) => setC(parseFloat(e.target.value))}
                className="accent-cyan-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg opacity-100"
              />
            </div>
          )}
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
          <div className="text-rose-400 font-bold mt-0.5">
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
