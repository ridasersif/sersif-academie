/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Gauge,
  Trash2,
  BookmarkPlus,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface SavedTrace {
  id: string;
  path_uC: string;
  path_i: string;
  R: number;
  C_uF: number;
  E: number;
  tauPhysMs: number;
}

export default function RCCircuitVirtualLab() {
  // ── 1. REAL-TIME PHYSICAL PARAMETERS (SLIDERS) ──
  const [E, setE] = useState<number>(10); // V (2 to 20)
  const [R, setR] = useState<number>(200); // Ohm (50 to 500)
  const [C_uF, setC_uF] = useState<number>(100); // µF (20 to 400)

  // Switch Position: "charge" (Pos 1) | "decharge" (Pos 2)
  const [switchPos, setSwitchPos] = useState<"charge" | "decharge">("charge");

  // Advanced Pedagogical Toggles
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [savedTraces, setSavedTraces] = useState<SavedTrace[]>([]);

  // Simulation Controls: Visual observable duration 8.0 seconds for the full 200ms physical window
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [elapsedSimSec, setElapsedSimSec] = useState<number>(0); // 0 to 8.0s
  const [initialVoltage, setInitialVoltage] = useState<number>(0); // Voltage at switch flip moment

  // Physical calculations
  const C_F = useMemo(() => C_uF * 1e-6, [C_uF]);
  const tauPhysMs = useMemo(() => (R * C_uF) / 1000, [R, C_uF]); // ms: R (Ohm) * C (uF) / 1000
  const I0_mA = useMemo(() => (E / R) * 1000, [E, R]); // mA

  // ── FIXED LABORATORY OSCILLOSCOPE TIMEBASE (200 ms FULL SCREEN) ──
  const T_WINDOW_MS = 200.0; // Fixed physical time window on screen
  const TOTAL_SIM_SEC = 8.0; // Takes 8 seconds visually to scan the 200ms window

  // Instantaneous physical time t (in ms) mapped from elapsed simulation seconds
  const currentPhysTimeMs = useMemo(() => {
    return Math.min((elapsedSimSec / TOTAL_SIM_SEC) * T_WINDOW_MS, T_WINDOW_MS);
  }, [elapsedSimSec, TOTAL_SIM_SEC, T_WINDOW_MS]);

  // ── 2. REAL-TIME 60FPS ANIMATION LOOP ──
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;

    const loop = (timestamp: number) => {
      if (lastTimeRef.current !== null && isRunning) {
        const dtSec = ((timestamp - lastTimeRef.current) / 1000) * simSpeed;
        setElapsedSimSec((prev) => {
          const next = prev + dtSec;
          if (next >= TOTAL_SIM_SEC) {
            setIsRunning(false);
            return TOTAL_SIM_SEC;
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      if (isRunning) {
        animId = requestAnimationFrame(loop);
      }
    };

    if (isRunning) {
      lastTimeRef.current = null;
      animId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animId);
  }, [isRunning, simSpeed, TOTAL_SIM_SEC]);

  // ── 3. INSTANTANEOUS PHYSICAL VALUES ACCORDING TO PHYSICAL TIME t ──
  const { uC_t, i_t_mA, q_t_uC, energy_mJ, chargePercentage, activeChargesCount } = useMemo(() => {
    const tMs = currentPhysTimeMs;
    const tRatio = tauPhysMs > 0 ? tMs / tauPhysMs : 10; // t / tau

    let u = 0;
    let i = 0;

    if (switchPos === "charge") {
      // uC(t) = E - (E - u0) * e^(-t/tau)
      u = E - (E - initialVoltage) * Math.exp(-tRatio);
      i = ((E - initialVoltage) / R) * Math.exp(-tRatio) * 1000;
    } else {
      // uC(t) = u0 * e^(-t/tau)
      u = initialVoltage * Math.exp(-tRatio);
      i = -(initialVoltage / R) * Math.exp(-tRatio) * 1000;
    }

    if (switchPos === "decharge" && tRatio >= 5.0) {
      if (u < 0.05) u = 0.0;
      if (Math.abs(i) < 0.05) i = 0.0;
    }

    const q = C_uF * u; // µC
    const ene = 0.5 * C_F * u * u * 1000; // mJ
    const pct = Math.min(Math.max((u / (E || 1)) * 100, 0), 100);
    const numCharges = Math.min(Math.floor((pct / 100) * 10), 10);

    return {
      uC_t: u,
      i_t_mA: i,
      q_t_uC: q,
      energy_mJ: ene,
      chargePercentage: pct,
      activeChargesCount: numCharges,
    };
  }, [currentPhysTimeMs, tauPhysMs, switchPos, E, initialVoltage, R, C_uF, C_F]);

  // Switch Toggle Handler
  const handleToggleSwitch = (newPos: "charge" | "decharge") => {
    if (newPos === switchPos) return;
    setInitialVoltage(uC_t); // Continuity of charge uC(0+) = uC(0-)
    setSwitchPos(newPos);
    setElapsedSimSec(0);
    setIsRunning(true);
  };

  // Reset Button Handler
  const handleReset = () => {
    setIsRunning(false);
    setElapsedSimSec(0);
    setInitialVoltage(switchPos === "charge" ? 0 : E);
  };

  // ── 4. OSCILLOSCOPE TRACING (PHYSICAL TIME AXIS 0 to 200 ms) ──
  const oscW = 460;
  const oscH = 200;
  const padL = 38;
  const padR = 20;
  const padT = 20;
  const padB = 25;
  const plotW = oscW - padL - padR;
  const plotH = oscH - padT - padB;
  const midY = padT + plotH / 2;
  const baseY = padT + plotH;

  // Real-time active drawn path on the 200ms physical time grid
  const { activePath_uC, activePath_i, curX, curY_uC, curY_i } = useMemo(() => {
    const totalSteps = 120;
    const pts_uC: string[] = [];
    const pts_i: string[] = [];

    const effectiveTime = Math.max(currentPhysTimeMs, 0.1);
    const dt = effectiveTime / totalSteps;

    for (let s = 0; s <= totalSteps; s++) {
      const tMs = s * dt;
      const tRatio = tauPhysMs > 0 ? tMs / tauPhysMs : 10;
      const x = padL + (tMs / T_WINDOW_MS) * plotW;

      let u = 0;
      let cur = 0;
      if (switchPos === "charge") {
        u = E - (E - initialVoltage) * Math.exp(-tRatio);
        cur = ((E - initialVoltage) / R) * Math.exp(-tRatio) * 1000;
      } else {
        u = initialVoltage * Math.exp(-tRatio);
        cur = -(initialVoltage / R) * Math.exp(-tRatio) * 1000;
      }

      const y_uC = baseY - (u / (E || 1)) * plotH;
      pts_uC.push(`${x.toFixed(1)},${y_uC.toFixed(1)}`);

      const maxI = (E / R) * 1000 || 1;
      const y_i = midY - (cur / maxI) * (plotH / 2);
      pts_i.push(`${x.toFixed(1)},${y_i.toFixed(1)}`);
    }

    const currentX = padL + (currentPhysTimeMs / T_WINDOW_MS) * plotW;
    const currentY_uC = baseY - (uC_t / (E || 1)) * plotH;
    const currentY_i = midY - (i_t_mA / (I0_mA || 1)) * (plotH / 2);

    return {
      activePath_uC: pts_uC.length > 1 ? `M ${pts_uC.join(" L ")}` : "",
      activePath_i: pts_i.length > 1 ? `M ${pts_i.join(" L ")}` : "",
      curX: currentX,
      curY_uC: currentY_uC,
      curY_i: currentY_i,
    };
  }, [currentPhysTimeMs, T_WINDOW_MS, tauPhysMs, plotW, padL, switchPos, E, initialVoltage, R, baseY, plotH, midY, uC_t, i_t_mA, I0_mA]);

  // Tangent at t=0 coordinates: X position depends directly on tauPhysMs!
  // Slope = E / tau. At t = tau, u = E.
  const tangentX_tau = Math.min(padL + (tauPhysMs / T_WINDOW_MS) * plotW, padL + plotW);
  const shouldShowTangent = showTangent && (currentPhysTimeMs >= Math.min(tauPhysMs, T_WINDOW_MS) || (!isRunning && elapsedSimSec > 0.2));

  // Save current curve for superposition comparison (faded ghost color)
  const handleSaveTrace = () => {
    if (!activePath_uC) return;
    const newTrace: SavedTrace = {
      id: String(Date.now()),
      path_uC: activePath_uC,
      path_i: activePath_i,
      R,
      C_uF,
      E,
      tauPhysMs,
    };
    setSavedTraces((prev) => [...prev, newTrace]);
  };

  const handleClearSavedTraces = () => {
    setSavedTraces([]);
  };

  // Current animation speed
  const currentFraction = Math.abs(i_t_mA) / (I0_mA || 1);
  const isCurrentMoving = isRunning && currentFraction > 0.015;
  const particleSpeedDuration = currentFraction > 0.015 ? `${Math.max(1.0 / currentFraction, 0.8).toFixed(2)}s` : "0s";

  return (
    <div className="rounded-3xl bg-slate-950 border border-cyan-500/30 p-3 sm:p-4 space-y-3 shadow-2xl shadow-cyan-950/20">
      {/* ── 1. SLEEK COMPACT SINGLE-ROW HEADER & TOOLBAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        {/* Title */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
            Lab Circuit RC (Oscilloscope Calibré)
          </h3>
        </div>

        {/* Compact Single-Row Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Position Selector (Charge / Décharge) */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
            <button
              onClick={() => handleToggleSwitch("charge")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "charge"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Charge</span>
            </button>
            <button
              onClick={() => handleToggleSwitch("decharge")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "decharge"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Décharge</span>
            </button>
          </div>

          {/* Start / Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
              isRunning
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-sm shadow-emerald-500/10"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>{elapsedSimSec === 0 ? "Lancer" : "Reprendre"}</span>
              </>
            )}
          </button>

          {/* Reset / Empty Button */}
          <button
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Vider et réinitialiser"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Vider</span>
          </button>

          {/* Superposition Compare Button */}
          <button
            onClick={handleSaveTrace}
            disabled={!activePath_uC}
            className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activePath_uC
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                : "opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500"
            }`}
            title="Mémoriser cette courbe pour comparer avec une autre valeur de R ou C"
          >
            <BookmarkPlus className="w-3 h-3" />
            <span>Garder</span>
          </button>

          {/* Clear comparison traces */}
          {savedTraces.length > 0 && (
            <button
              onClick={handleClearSavedTraces}
              className="p-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
              title="Effacer les courbes mémorisées"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  simSpeed === spd
                    ? "bg-indigo-500/30 text-indigo-300 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. REAL-TIME SLIDERS (E, R, C) & TANGENT TOGGLE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-[11px]">
        {/* Slider E */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Générateur</span>
              <LatexMath math="E" /> :
            </span>
            <span className="text-cyan-300 font-mono">{E} V</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={E}
            onChange={(e) => {
              setE(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Slider R */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Résistance</span>
              <LatexMath math="R" /> :
            </span>
            <span className="text-rose-300 font-mono">{R} Ω</span>
          </div>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={R}
            onChange={(e) => {
              setR(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
        </div>

        {/* Slider C */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Capacité</span>
              <LatexMath math="C" /> :
            </span>
            <span className="text-purple-300 font-mono">{C_uF} µF</span>
          </div>
          <input
            type="range"
            min="20"
            max="400"
            step="20"
            value={C_uF}
            onChange={(e) => {
              setC_uF(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* Tangent Checkbox & Real Tau Info */}
        <div className="sm:col-span-3 flex flex-col justify-center space-y-1 pl-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-slate-800">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showTangent}
              onChange={(e) => setShowTangent(e.target.checked)}
              className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-amber-500 accent-amber-400 cursor-pointer"
            />
            <span className="text-[11px] font-semibold text-amber-300">Tangente à l&apos;origine</span>
          </label>
          <div className="text-[10px] font-mono text-cyan-300 flex items-center justify-between">
            <span>τ = RC =</span>
            <span className="font-bold text-amber-300">{tauPhysMs.toFixed(1)} ms</span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN PANELS: CIRCUIT + CAPACITOR TANK + OSCILLOSCOPE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* ── LEFT PANEL (6 COLS): CIRCUIT SCHEMATIC & CHARGE ACCUMULATION TANK ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  switchPos === "charge" ? "bg-cyan-400 animate-pulse" : "bg-purple-400 animate-pulse"
                }`}
              />
              <span>Circuit & Réservoir de Charge</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {chargePercentage < 1 ? "Condensateur Déchargé (0%)" : chargePercentage > 99 ? "Condensateur Chargé (100%)" : switchPos === "charge" ? "En cours de charge..." : "En cours de décharge..."}
            </span>
          </div>

          {/* Circuit Graphic with Real-Time Accumulation */}
          <div className="relative">
            <svg
              viewBox="0 0 340 240"
              className="w-full h-auto max-w-[320px] mx-auto select-none"
              style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}
            >
              <defs>
                <linearGradient id="dielectric-tank-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
                </linearGradient>
                <marker id="arr-cyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#00f0ff" />
                </marker>
                <marker id="arr-purple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#c084fc" />
                </marker>
              </defs>

              {/* Grid Background */}
              <rect x="2" y="2" width="336" height="236" rx="10" fill="#020817" stroke="#0e3a4f" strokeWidth="1" />
              <path d="M 15 50 H 325 M 15 120 H 325 M 15 190 H 325" stroke="#0e2a3a" strokeWidth="0.5" strokeDasharray="3 3" />
              <path d="M 60 20 V 220 M 170 20 V 220 M 280 20 V 220" stroke="#0e2a3a" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* ── 1. GENERATOR BRANCH (LEFT) ── */}
              <path
                d="M 60 120 L 60 35 L 140 35 M 60 140 L 60 205 L 170 205"
                fill="none"
                stroke={switchPos === "charge" ? "#00f0ff" : "#334155"}
                strokeWidth={switchPos === "charge" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "charge" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Battery Symbol */}
              <line x1="42" y1="122" x2="78" y2="122" stroke={switchPos === "charge" ? "#00f0ff" : "#475569"} strokeWidth="2.8" strokeLinecap="round" />
              <line x1="50" y1="132" x2="70" y2="132" stroke={switchPos === "charge" ? "#00f0ff" : "#475569"} strokeWidth="4.5" strokeLinecap="round" />
              <text x="32" y="119" fill={switchPos === "charge" ? "#38bdf8" : "#475569"} fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
              <text x="34" y="141" fill={switchPos === "charge" ? "#38bdf8" : "#475569"} fontSize="15" fontWeight="bold" textAnchor="middle">−</text>
              <text x="90" y="130" fill={switchPos === "charge" ? "#38bdf8" : "#64748b"} fontSize="12" fontStyle="italic" fontWeight="bold">E</text>

              {/* ── 2. DISCHARGE BYPASS BRANCH (RIGHT) ── */}
              <path
                d="M 200 35 L 280 35 L 280 205 L 170 205"
                fill="none"
                stroke={switchPos === "decharge" ? "#c084fc" : "#334155"}
                strokeWidth={switchPos === "decharge" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "decharge" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ── 3. CENTRAL RC BRANCH ── */}
              <path
                d="M 170 52 L 170 68 M 170 108 L 170 135 M 170 175 L 170 205"
                fill="none"
                stroke={switchPos === "charge" ? "#00f0ff" : "#c084fc"}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Direction Arrows on wires */}
              {switchPos === "charge" ? (
                <g>
                  <line x1="90" y1="35" x2="105" y2="35" stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arr-cyan)" />
                  <line x1="170" y1="116" x2="170" y2="128" stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arr-cyan)" />
                  <line x1="125" y1="205" x2="110" y2="205" stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arr-cyan)" />
                  <line x1="60" y1="90" x2="60" y2="75" stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arr-cyan)" />
                </g>
              ) : (
                <g>
                  <line x1="170" y1="128" x2="170" y2="116" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arr-purple)" />
                  <line x1="230" y1="35" x2="245" y2="35" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arr-purple)" />
                  <line x1="280" y1="110" x2="280" y2="125" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arr-purple)" />
                  <line x1="235" y1="205" x2="220" y2="205" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arr-purple)" />
                </g>
              )}

              {/* Switch K terminals & Blade */}
              <circle cx="140" cy="35" r="3.5" fill={switchPos === "charge" ? "#00f0ff" : "#334155"} />
              <text x="135" y="24" fill={switchPos === "charge" ? "#00f0ff" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(1)</text>

              <circle cx="200" cy="35" r="3.5" fill={switchPos === "decharge" ? "#c084fc" : "#334155"} />
              <text x="205" y="24" fill={switchPos === "decharge" ? "#c084fc" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(2)</text>

              <circle cx="170" cy="52" r="3.5" fill="#f8fafc" />
              <text x="170" y="42" fill="#f8fafc" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="middle">K</text>

              {/* Switch Blade */}
              <line
                x1="170"
                y1="52"
                x2={switchPos === "charge" ? 140 : 200}
                y2="35"
                stroke={switchPos === "charge" ? "#00f0ff" : "#c084fc"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Resistor R (Central) */}
              <rect
                x="154"
                y="68"
                width="32"
                height="40"
                rx="4"
                fill="#082f49"
                stroke={switchPos === "charge" ? "#38bdf8" : "#c084fc"}
                strokeWidth="1.8"
              />
              <text x="170" y="93" fill="#e0f2fe" fontSize="13" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

              {/* ── 4. CAPACITOR CHARGE TANK (RESERVOIR & PLATES) ── */}
              <rect
                x="142"
                y="135"
                width="56"
                height="40"
                rx="3"
                fill="#030712"
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Liquid Charge filling height */}
              <rect
                x="143"
                y={174 - (38 * chargePercentage) / 100}
                width="54"
                height={(38 * chargePercentage) / 100}
                rx="2"
                fill="url(#dielectric-tank-grad)"
                opacity={0.8}
              />

              {/* Top Armature Plate (+q) */}
              <rect x="138" y="135" width="64" height="4" rx="2" fill="#00f0ff" stroke="#38bdf8" strokeWidth="0.8" />
              {/* Bottom Armature Plate (-q) */}
              <rect x="138" y="172" width="64" height="4" rx="2" fill="#00f0ff" stroke="#38bdf8" strokeWidth="0.8" />

              {/* Stacked Charges (+) and (-) */}
              {Array.from({ length: activeChargesCount }).map((_, idx) => {
                const posX = 144 + idx * 5.6;
                return (
                  <g key={idx}>
                    <circle cx={posX} cy="129" r="2.2" fill="#38bdf8" />
                    <text x={posX} y="130.5" fill="#020817" fontSize="5" fontWeight="bold" textAnchor="middle">+</text>

                    <circle cx={posX} cy="184" r="2.2" fill="#f43f5e" />
                    <text x={posX} y="185" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">−</text>
                  </g>
                );
              })}

              <text x="210" y="139" fill="#38bdf8" fontSize="11" fontStyle="italic" fontWeight="bold">+q</text>
              <text x="210" y="177" fill="#38bdf8" fontSize="11" fontStyle="italic" fontWeight="bold">−q</text>
              <text x="130" y="158" fill="#00f0ff" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="end">C</text>

              {/* Flowing Electrons */}
              {isCurrentMoving && (
                <>
                  {switchPos === "charge" ? (
                    [0, 0.2, 0.4, 0.6, 0.8, 1.0].map((phase, idx) => (
                      <circle key={idx} r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                        <animateMotion
                          dur={particleSpeedDuration}
                          begin={`${(phase * parseFloat(particleSpeedDuration)).toFixed(2)}s`}
                          repeatCount="indefinite"
                          path="M 60 120 L 60 35 L 140 35 L 170 52 L 170 205 L 60 205 Z"
                        />
                      </circle>
                    ))
                  ) : (
                    [0, 0.2, 0.4, 0.6, 0.8, 1.0].map((phase, idx) => (
                      <circle key={idx} r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                        <animateMotion
                          dur={particleSpeedDuration}
                          begin={`${(phase * parseFloat(particleSpeedDuration)).toFixed(2)}s`}
                          repeatCount="indefinite"
                          path="M 170 205 L 170 52 L 200 35 L 280 35 L 280 205 Z"
                        />
                      </circle>
                    ))
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Stylized Progress Gauge */}
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>Remplissage Condensateur :</span>
              </span>
              <span className="text-cyan-300 font-mono text-xs">{chargePercentage.toFixed(1)} %</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full"
                style={{ width: `${chargePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (6 COLS): SYNCHRONIZED OSCILLOSCOPE (CALIBRATED 0 to 200 ms) ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="text-cyan-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                <span>CH1: <LatexMath math="u_C(t)" /></span>
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
                <span>CH2: <LatexMath math="i(t)" /></span>
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              t = {currentPhysTimeMs.toFixed(1)} ms / {T_WINDOW_MS} ms
            </span>
          </div>

          {/* Oscilloscope Screen */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800/90 p-1">
            <svg
              viewBox={`0 0 ${oscW} ${oscH}`}
              className="w-full h-auto select-none"
              style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}
            >
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00f0ff" />
                </filter>
                <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fb7185" />
                </filter>
              </defs>

              {/* Screen Background & Grid */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="#020817" stroke="#1e293b" strokeWidth="1" />
              
              {/* Horizontal Center line i=0 */}
              <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padL - 4} y={midY + 3} fill="#64748b" fontSize="8.5" fontStyle="italic" textAnchor="end">0 mA</text>

              {/* 5 Calibrated Time Divisions: 40ms, 80ms, 120ms, 160ms, 200ms */}
              {[1, 2, 3, 4, 5].map((div) => {
                const posX = padL + (div / 5) * plotW;
                const timeLabel = (div * (T_WINDOW_MS / 5)).toFixed(0);
                return (
                  <g key={div}>
                    <line x1={posX} y1={padT} x2={posX} y2={baseY} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x={posX} y={baseY + 14} fill="#64748b" fontSize="9" fontStyle="italic" textAnchor="middle">
                      {timeLabel} ms
                    </text>
                  </g>
                );
              })}

              {/* Dynamic Tau Position Line & Label on Time Axis */}
              {tauPhysMs <= T_WINDOW_MS && (
                <g>
                  <line
                    x1={tangentX_tau}
                    y1={baseY - 6}
                    x2={tangentX_tau}
                    y2={baseY + 6}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tangentX_tau}
                    y={baseY + 22}
                    fill="#fbbf24"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    τ={tauPhysMs.toFixed(0)}ms
                  </text>
                </g>
              )}

              {/* Voltage Asymptote E (10V) */}
              <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
              <text x={padL - 4} y={padT + 4} fill="#00f0ff" fontSize="9.5" fontStyle="italic" fontWeight="bold" textAnchor="end">{E}V</text>
              <text x={padL - 4} y={baseY + 3} fill="#64748b" fontSize="8.5" fontStyle="italic" textAnchor="end">0V</text>

              {/* ── SAVED SUPERPOSITION COMPARISON TRACES (DIMMED GHOST TRACES) ── */}
              {savedTraces.map((trace, idx) => (
                <g key={trace.id} opacity={0.45}>
                  <path
                    d={trace.path_uC}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={padL + plotW - 75}
                    y={padT + 12 + idx * 11}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    τ={trace.tauPhysMs.toFixed(1)}ms
                  </text>
                </g>
              ))}

              {/* ── TANGENT AT ORIGIN (SLOPE DEPENDS ON TAU) ── */}
              {shouldShowTangent && (
                <g>
                  {switchPos === "charge" ? (
                    <>
                      {/* Tangent line from (0,0) to (tau, E) */}
                      <line
                        x1={padL}
                        y1={baseY}
                        x2={tangentX_tau}
                        y2={padT}
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        strokeDasharray="3 2"
                      />
                      {/* Vertical dotted line from (tau, E) to tau on axis */}
                      <line
                        x1={tangentX_tau}
                        y1={padT}
                        x2={tangentX_tau}
                        y2={baseY}
                        stroke="#f59e0b"
                        strokeWidth="0.9"
                        strokeDasharray="2 2"
                        opacity={0.8}
                      />
                      {/* Intersection Point at (tau, E) */}
                      <circle cx={tangentX_tau} cy={padT} r="3.5" fill="#f59e0b" />
                      <text x={tangentX_tau} y={padT - 5} fill="#f59e0b" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">
                        (τ, E)
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Tangent line in Decharge from (0,E) to (tau, 0V) */}
                      <line
                        x1={padL}
                        y1={padT}
                        x2={tangentX_tau}
                        y2={baseY}
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        strokeDasharray="3 2"
                      />
                      {/* Intersection Point on axis at (tau, 0V) */}
                      <circle cx={tangentX_tau} cy={baseY} r="3.5" fill="#f59e0b" />
                      <text x={tangentX_tau} y={baseY - 5} fill="#f59e0b" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">
                        t = τ
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH1: uC(t) (GLOWING CYAN) ── */}
              {activePath_uC && (
                <path d={activePath_uC} fill="none" stroke="#00f0ff" strokeWidth="2.4" strokeLinecap="round" filter="url(#glow-cyan)" />
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH2: i(t) (GLOWING ROSE) ── */}
              {activePath_i && (
                <path d={activePath_i} fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" filter="url(#glow-rose)" />
              )}

              {/* Animated Laser Beam Vertical Cursor */}
              <line
                x1={curX}
                y1={padT}
                x2={curX}
                y2={baseY}
                stroke="#fde047"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Laser Head Points */}
              {elapsedSimSec > 0.05 && (
                <>
                  <circle cx={curX} cy={curY_uC} r="4" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx={curX} cy={curY_i} r="4" fill="#fb7185" stroke="#ffffff" strokeWidth="1.2" />
                </>
              )}
            </svg>
          </div>

          {/* ── STYLIZED COMPACT INSTANTANEOUS PHYSICAL METRICS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Tension <LatexMath math="u_C(t)" /></span>
              <span className="text-cyan-300 font-bold font-mono text-xs">{uC_t.toFixed(2)} V</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-rose-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Courant <LatexMath math="i(t)" /></span>
              <span className="text-rose-300 font-bold font-mono text-xs">{i_t_mA.toFixed(1)} mA</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-purple-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Charge <LatexMath math="q(t)" /></span>
              <span className="text-purple-300 font-bold font-mono text-xs">{q_t_uC.toFixed(1)} µC</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-amber-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Énergie <LatexMath math="\mathcal{E}_C" /></span>
              <span className="text-amber-300 font-bold font-mono text-xs">{energy_mJ.toFixed(2)} mJ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
