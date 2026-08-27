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
  Flame,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface SavedTraceRL {
  id: string;
  R: number;
  L_mH: number;
  E: number;
  tauPhysMs: number;
  switchPos: "etablissement" | "rupture";
}

export default function RLCircuitVirtualLab() {
  // ── 1. REAL-TIME PHYSICAL PARAMETERS (SLIDERS) ──
  const [E, setE] = useState<number>(10); // V (2 to 20)
  const [R, setR] = useState<number>(100); // Ohm (20 to 500)
  const [L_mH, setL_mH] = useState<number>(200); // mH (20 to 1000)

  // Switch Position: "etablissement" (Pos 1) | "rupture" (Pos 2)
  const [switchPos, setSwitchPos] = useState<"etablissement" | "rupture">("etablissement");

  // Advanced Pedagogical Toggles
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [savedTraces, setSavedTraces] = useState<SavedTraceRL[]>([]);

  // Simulation Controls: 8.0s for the full 5 Tau regime
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [elapsedSimSec, setElapsedSimSec] = useState<number>(0); // 0 to 8.0s

  // Physical calculations
  const L_H = useMemo(() => L_mH * 1e-3, [L_mH]);
  const tauPhysMs = useMemo(() => L_mH / R, [L_mH, R]); // ms: L (mH) / R (Ohm)
  const I0_mA = useMemo(() => (E / R) * 1000, [E, R]); // mA: E / R
  const I0_A = useMemo(() => E / R, [E, R]);
  const maxEnergyMag_mJ = useMemo(() => 0.5 * L_H * I0_A * I0_A * 1000, [L_H, I0_A]);

  // Initial current at moment of switch toggle
  const [initialCurrent, setInitialCurrent] = useState<number>(0);

  // Dynamic Full Scale Window: Strictly covers 5 * tauPhysMs so the full curve is always 100% visible!
  const T_WINDOW_MS = useMemo(() => 5 * tauPhysMs, [tauPhysMs]);
  const TOTAL_SIM_SEC = 8.0; // Observable human duration

  // Instantaneous physical time t (ms)
  const currentPhysTimeMs = useMemo(() => {
    return Math.min((elapsedSimSec / TOTAL_SIM_SEC) * T_WINDOW_MS, T_WINDOW_MS);
  }, [elapsedSimSec, TOTAL_SIM_SEC, T_WINDOW_MS]);

  // Dimensionless parameter theta = t / tau in [0, 5]
  const currentTheta = useMemo(() => {
    return Math.min((elapsedSimSec / TOTAL_SIM_SEC) * 5.0, 5.0);
  }, [elapsedSimSec, TOTAL_SIM_SEC]);

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

  // ── 3. INSTANTANEOUS PHYSICAL VALUES & JOULE POWER ──
  const { i_t_mA, uL_t, uR_t, energyMag_mJ, joulePower_mW, currentPercentage, magneticFieldIntensity } = useMemo(() => {
    const theta = currentTheta;
    let i_mA = 0;
    let u_L = 0;

    if (switchPos === "etablissement") {
      // i(t) = I0 - (I0 - i0) * e^(-theta)
      i_mA = I0_mA - (I0_mA - initialCurrent) * Math.exp(-theta);
      // uL(t) = L di/dt = (E - R*i0) * e^(-theta)
      u_L = (E - (R * initialCurrent) / 1000) * Math.exp(-theta);
    } else {
      // In rupture, starting from initialCurrent (or full I0)
      const startCurrent = initialCurrent > 0 ? initialCurrent : I0_mA;
      i_mA = startCurrent * Math.exp(-theta);
      // uL(t) = -R*i(t) (strictly negative in rupture)
      u_L = -((R * startCurrent) / 1000) * Math.exp(-theta);
    }

    // Clean numerical bounds at 5 tau
    if (switchPos === "rupture" && theta >= 4.95) {
      if (i_mA < 0.1) i_mA = 0.0;
      if (Math.abs(u_L) < 0.05) u_L = 0.0;
    }

    const u_R = (R * i_mA) / 1000; // V
    const i_A = i_mA / 1000;
    const ene = 0.5 * L_H * i_A * i_A * 1000; // mJ
    const p_joule = R * i_A * i_A * 1000; // mW
    const pct = Math.min(Math.max((i_mA / (I0_mA || 1)) * 100, 0), 100);
    const magIntensity = maxEnergyMag_mJ > 0 ? Math.min(ene / maxEnergyMag_mJ, 1.0) : 0;

    return {
      i_t_mA: i_mA,
      uL_t: u_L,
      uR_t: u_R,
      energyMag_mJ: ene,
      joulePower_mW: p_joule,
      currentPercentage: pct,
      magneticFieldIntensity: magIntensity,
    };
  }, [currentTheta, switchPos, I0_mA, initialCurrent, E, R, L_H, maxEnergyMag_mJ]);

  // Switch Toggle Handler
  const handleToggleSwitch = (newPos: "etablissement" | "rupture") => {
    if (newPos === switchPos) return;
    if (newPos === "rupture") {
      const cur = i_t_mA > 1 ? i_t_mA : I0_mA;
      setInitialCurrent(cur);
    } else {
      setInitialCurrent(i_t_mA < I0_mA * 0.95 ? i_t_mA : 0);
    }
    setSwitchPos(newPos);
    setElapsedSimSec(0);
    setIsRunning(true);
  };

  // Reset Button Handler
  const handleReset = () => {
    setIsRunning(false);
    setElapsedSimSec(0);
    setInitialCurrent(switchPos === "etablissement" ? 0 : I0_mA);
  };

  // ── 4. OSCILLOSCOPE TRACING (CH1: i(t) Emerald, CH2: uL(t) Rose) ──
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

  // Real-time active drawn path up to currentTheta
  const { activePath_i, activePath_uL, curX, curY_i, curY_uL } = useMemo(() => {
    const totalSteps = 120;
    const pts_i: string[] = [];
    const pts_uL: string[] = [];

    const effectiveTheta = Math.max(currentTheta, 0.01);
    const dt = effectiveTheta / totalSteps;
    const startCurrent = switchPos === "rupture" && initialCurrent === 0 ? I0_mA : initialCurrent;

    for (let s = 0; s <= totalSteps; s++) {
      const th = s * dt; // in [0, 5]
      const x = padL + (th / 5.0) * plotW;

      let cur_mA = 0;
      let u_L = 0;
      if (switchPos === "etablissement") {
        cur_mA = I0_mA - (I0_mA - startCurrent) * Math.exp(-th);
        u_L = (E - (R * startCurrent) / 1000) * Math.exp(-th);
      } else {
        cur_mA = startCurrent * Math.exp(-th);
        u_L = -((R * startCurrent) / 1000) * Math.exp(-th);
      }

      // Map i(t) (0 to I0) -> (baseY to padT)
      const y_i = baseY - (cur_mA / (I0_mA || 1)) * plotH;
      pts_i.push(`${x.toFixed(1)},${y_i.toFixed(1)}`);

      // Map uL(t) (-E to +E) -> center is midY (0V)
      const y_uL = midY - (u_L / (E || 1)) * (plotH / 2);
      pts_uL.push(`${x.toFixed(1)},${y_uL.toFixed(1)}`);
    }

    const currentX = padL + (currentTheta / 5.0) * plotW;
    const currentY_i = baseY - (i_t_mA / (I0_mA || 1)) * plotH;
    const currentY_uL = midY - (uL_t / (E || 1)) * (plotH / 2);

    return {
      activePath_i: pts_i.length > 1 ? `M ${pts_i.join(" L ")}` : "",
      activePath_uL: pts_uL.length > 1 ? `M ${pts_uL.join(" L ")}` : "",
      curX: currentX,
      curY_i: currentY_i,
      curY_uL: currentY_uL,
    };
  }, [currentTheta, plotW, padL, switchPos, I0_mA, initialCurrent, E, R, baseY, plotH, midY, i_t_mA, uL_t]);

  // Tangent at t=0 coordinates: precisely cuts at the 1tau line (1/5th of plot width)
  const tangentX_tau = padL + (1 / 5) * plotW;
  const shouldShowTangent = showTangent && (currentTheta >= 1.0 || (!isRunning && elapsedSimSec > 0.2));

  // Dynamic Superposition Comparison Paths
  const renderedSavedTraces = useMemo(() => {
    return savedTraces.map((trace) => {
      const steps = 100;
      const pts_i: string[] = [];

      for (let s = 0; s <= steps; s++) {
        const tMs = (s / steps) * T_WINDOW_MS;
        const thSaved = tMs / trace.tauPhysMs;
        const x = padL + (s / steps) * plotW;

        const max_i = (trace.E / trace.R) * 1000;
        let cur = 0;
        if (trace.switchPos === "etablissement") {
          cur = max_i * (1 - Math.exp(-thSaved));
        } else {
          cur = max_i * Math.exp(-thSaved);
        }

        const y_i = baseY - (cur / (I0_mA || 1)) * plotH;
        pts_i.push(`${x.toFixed(1)},${y_i.toFixed(1)}`);
      }

      return {
        id: trace.id,
        path_i: `M ${pts_i.join(" L ")}`,
        tauPhysMs: trace.tauPhysMs,
      };
    });
  }, [savedTraces, T_WINDOW_MS, padL, plotW, baseY, I0_mA, plotH]);

  // Save current curve for superposition comparison
  const handleSaveTrace = () => {
    const newTrace: SavedTraceRL = {
      id: String(Date.now()),
      R,
      L_mH,
      E,
      tauPhysMs,
      switchPos,
    };
    setSavedTraces((prev) => [...prev, newTrace]);
  };

  const handleClearSavedTraces = () => {
    setSavedTraces([]);
  };

  // Flowing electron particles speed in wire proportional to i(t)
  const currentFraction = Math.abs(i_t_mA) / (I0_mA || 1);
  const isCurrentMoving = isRunning && currentFraction > 0.015;
  const particleSpeedDuration = currentFraction > 0.015 ? `${Math.max(1.0 / currentFraction, 0.8).toFixed(2)}s` : "0s";

  return (
    <div className="rounded-3xl bg-slate-950 border border-emerald-500/30 p-3 sm:p-4 space-y-3 shadow-2xl shadow-emerald-950/20">
      {/* ── 1. SLEEK COMPACT SINGLE-ROW HEADER & TOOLBAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        {/* Title */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="p-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
            Lab Circuit RL (Rupture & Roue Libre)
          </h3>
        </div>

        {/* Compact Single-Row Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Position Selector (Établissement / Rupture) */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
            <button
              onClick={() => handleToggleSwitch("etablissement")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "etablissement"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>(1) Établissement</span>
            </button>
            <button
              onClick={() => handleToggleSwitch("rupture")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "rupture"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>(2) Rupture</span>
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
            title="Réinitialiser"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Superposition Compare Button */}
          <button
            onClick={handleSaveTrace}
            disabled={!activePath_i}
            className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activePath_i
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25"
                : "opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500"
            }`}
            title="Mémoriser cette courbe pour comparer"
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

      {/* ── 2. REAL-TIME SLIDERS (E, R, L) & TANGENT TOGGLE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-[11px]">
        {/* Slider E */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Générateur</span>
              <LatexMath math="E" /> :
            </span>
            <span className="text-emerald-300 font-mono">{E} V</span>
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
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Slider R */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Résistance</span>
              <LatexMath math="R" /> :
            </span>
            <span className="text-indigo-300 font-mono">{R} Ω</span>
          </div>
          <input
            type="range"
            min="20"
            max="500"
            step="10"
            value={R}
            onChange={(e) => {
              setR(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>

        {/* Slider L */}
        <div className="sm:col-span-3 space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Inductance</span>
              <LatexMath math="L" /> :
            </span>
            <span className="text-amber-300 font-mono">{L_mH} mH</span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="20"
            value={L_mH}
            onChange={(e) => {
              setL_mH(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
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
          <div className="text-[10px] font-mono text-emerald-300 flex items-center justify-between">
            <span>τ = L/R =</span>
            <span className="font-bold text-amber-300">{tauPhysMs.toFixed(1)} ms</span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN PANELS: CIRCUIT + DYNAMIC MAGNETIC COIL + OSCILLOSCOPE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* ── LEFT PANEL (6 COLS): CIRCUIT SCHEMATIC & MAGNETIC INDUCTION ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  switchPos === "etablissement" ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-pulse"
                }`}
              />
              <span>Circuit & Bobine Inductive</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {currentPercentage < 1 ? "Courant Éteint (i=0)" : currentPercentage > 99 ? "Régime Permanent Établi" : switchPos === "etablissement" ? "Établissement du courant..." : "Décharge / Extinction..."}
            </span>
          </div>

          {/* Circuit Graphic with Magnetic Inductor */}
          <div className="relative">
            <svg
              viewBox="0 0 340 240"
              className="w-full h-auto max-w-[320px] mx-auto select-none"
              style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}
            >
              <defs>
                <filter id="glow-coil" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
                </filter>
                <marker id="arr-emerald" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#10b981" />
                </marker>
                <marker id="arr-rose-rl" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#f43f5e" />
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
                stroke={switchPos === "etablissement" ? "#10b981" : "#334155"}
                strokeWidth={switchPos === "etablissement" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "etablissement" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Battery Symbol */}
              <line x1="42" y1="122" x2="78" y2="122" stroke={switchPos === "etablissement" ? "#10b981" : "#475569"} strokeWidth="2.8" strokeLinecap="round" />
              <line x1="50" y1="132" x2="70" y2="132" stroke={switchPos === "etablissement" ? "#10b981" : "#475569"} strokeWidth="4.5" strokeLinecap="round" />
              <text x="32" y="119" fill={switchPos === "etablissement" ? "#34d399" : "#475569"} fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
              <text x="34" y="141" fill={switchPos === "etablissement" ? "#34d399" : "#475569"} fontSize="15" fontWeight="bold" textAnchor="middle">−</text>
              <text x="90" y="130" fill={switchPos === "etablissement" ? "#34d399" : "#64748b"} fontSize="12" fontStyle="italic" fontWeight="bold">E</text>

              {/* ── 2. FREEWHEELING DIODE / RUPTURE BYPASS (RIGHT) ── */}
              <path
                d="M 200 35 L 280 35 L 280 205 L 170 205"
                fill="none"
                stroke={switchPos === "rupture" ? "#f43f5e" : "#334155"}
                strokeWidth={switchPos === "rupture" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "rupture" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Diode Symbol on Right Branch (Anode Bottom, Cathode Top - Conducting in Rupture) */}
              <g transform="translate(280, 120)">
                <polygon points="0,-8 -8,8 8,8" fill={switchPos === "rupture" ? "#f43f5e" : "#475569"} />
                <line x1="-8" y1="-8" x2="8" y2="-8" stroke={switchPos === "rupture" ? "#f43f5e" : "#475569"} strokeWidth="1.8" />
                <text x="14" y="4" fill={switchPos === "rupture" ? "#f43f5e" : "#64748b"} fontSize="9" fontStyle="italic" fontWeight="bold">
                  {switchPos === "rupture" ? "Passante" : "Bloquée"}
                </text>
              </g>

              {/* ── 3. CENTRAL RL BRANCH ── */}
              <path
                d="M 170 52 L 170 68 M 170 108 L 170 130 M 170 178 L 170 205"
                fill="none"
                stroke={switchPos === "etablissement" ? "#10b981" : "#f43f5e"}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Direction Arrows on wires */}
              {switchPos === "etablissement" ? (
                <g>
                  {/* Top wire going right */}
                  <line x1="90" y1="35" x2="105" y2="35" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald)" />
                  {/* Center wire going down */}
                  <line x1="170" y1="114" x2="170" y2="126" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald)" />
                  {/* Bottom wire going left */}
                  <line x1="125" y1="205" x2="110" y2="205" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald)" />
                  {/* Left wire going up */}
                  <line x1="60" y1="90" x2="60" y2="75" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald)" />
                </g>
              ) : (
                <g>
                  {/* Center wire continues going DOWN through R & L (continuity of i) */}
                  <line x1="170" y1="114" x2="170" y2="126" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-rl)" />
                  {/* Bottom wire going RIGHT towards diode */}
                  <line x1="210" y1="205" x2="230" y2="205" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-rl)" />
                  {/* Right wire going UP through diode */}
                  <line x1="280" y1="145" x2="280" y2="130" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-rl)" />
                  {/* Top wire going LEFT through switch K */}
                  <line x1="250" y1="35" x2="230" y2="35" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-rl)" />
                </g>
              )}

              {/* Switch K terminals & Blade */}
              <circle cx="140" cy="35" r="3.5" fill={switchPos === "etablissement" ? "#10b981" : "#334155"} />
              <text x="135" y="24" fill={switchPos === "etablissement" ? "#10b981" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(1)</text>

              <circle cx="200" cy="35" r="3.5" fill={switchPos === "rupture" ? "#f43f5e" : "#334155"} />
              <text x="205" y="24" fill={switchPos === "rupture" ? "#f43f5e" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(2)</text>

              <circle cx="170" cy="52" r="3.5" fill="#f8fafc" />
              <text x="170" y="42" fill="#f8fafc" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="middle">K</text>

              {/* Switch Blade */}
              <line
                x1="170"
                y1="52"
                x2={switchPos === "etablissement" ? 140 : 200}
                y2="35"
                stroke={switchPos === "etablissement" ? "#10b981" : "#f43f5e"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Resistor R */}
              <rect
                x="154"
                y="68"
                width="32"
                height="40"
                rx="4"
                fill="#1e1b4b"
                stroke={switchPos === "etablissement" ? "#818cf8" : "#f43f5e"}
                strokeWidth="1.8"
              />
              <text x="170" y="93" fill="#c7d2fe" fontSize="13" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

              {/* ── 4. INDUCTOR BOBINE (L, r) WITH DYNAMIC MAGNETIC GLOW & FIELD LINES B ── */}
              <g transform="translate(170, 130)">
                {/* Magnetic Field Box with Glow */}
                <rect
                  x="-32"
                  y="-2"
                  width="64"
                  height="52"
                  rx="6"
                  fill="#030712"
                  stroke={magneticFieldIntensity > 0.1 ? "#f59e0b" : "#1e293b"}
                  strokeWidth={magneticFieldIntensity > 0.1 ? 1.2 : 0.8}
                  filter={magneticFieldIntensity > 0.2 ? "url(#glow-coil)" : undefined}
                />

                {/* Animated Magnetic Field Lines B proportional to magnetic energy */}
                {magneticFieldIntensity > 0.02 && (
                  <g opacity={magneticFieldIntensity}>
                    <ellipse cx="0" cy="24" rx="26" ry="20" fill="none" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
                    <ellipse cx="0" cy="24" rx="18" ry="14" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" opacity="0.8" />
                    <ellipse cx="0" cy="24" rx="10" ry="8" fill="none" stroke="#fde047" strokeWidth="1.2" opacity="0.9" />
                    <text x="25" y="27" fill="#fbbf24" fontSize="8" fontStyle="italic" fontWeight="bold">B⃗</text>
                  </g>
                )}

                {/* Inductor Coils (3 Loops) */}
                <path
                  d="M 0 0 C 18 3, 18 15, 0 16 C 18 19, 18 31, 0 32 C 18 35, 18 47, 0 48"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                <text x="-36" y="28" fill="#fbbf24" fontSize="13" fontStyle="italic" fontWeight="bold" textAnchor="end">L</text>
              </g>

              {/* Flowing Electrons */}
              {isCurrentMoving && (
                <>
                  {switchPos === "etablissement" ? (
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
                          path="M 170 52 L 170 205 L 280 205 L 280 35 L 200 35 Z"
                        />
                      </circle>
                    ))
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Magnetic Energy Progress Gauge */}
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-amber-400" />
                <span>{switchPos === "etablissement" ? "Établissement du Courant :" : "Extinction du Courant :"}</span>
              </span>
              <span className="text-emerald-300 font-mono text-xs">{currentPercentage.toFixed(1)} %</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-none ${
                  switchPos === "etablissement"
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"
                    : "bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400"
                }`}
                style={{ width: `${currentPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (6 COLS): SYNCHRONIZED OSCILLOSCOPE (RL CH1: i(t), CH2: uL(t)) ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span>CH1: <LatexMath math="i(t)" /></span>
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
                <span>CH2: <LatexMath math="u_L(t)" /></span>
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              t = {currentPhysTimeMs.toFixed(1)} ms / {T_WINDOW_MS.toFixed(1)} ms ({currentTheta.toFixed(1)}τ)
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
                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#10b981" />
                </filter>
                <filter id="glow-rose-rl" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fb7185" />
                </filter>
              </defs>

              {/* Screen Background & Grid */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="#020817" stroke="#1e293b" strokeWidth="1" />
              
              {/* Horizontal Center line (uL = 0V, midY) */}
              <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padL - 4} y={midY + 3} fill="#64748b" fontSize="8.5" fontStyle="italic" textAnchor="end">0V</text>

              {/* 5 Calibrated Time Divisions: 1tau to 5tau */}
              {[1, 2, 3, 4, 5].map((div) => {
                const posX = padL + (div / 5) * plotW;
                const timeMsLabel = (div * tauPhysMs).toFixed(0);
                return (
                  <g key={div}>
                    <line x1={posX} y1={padT} x2={posX} y2={baseY} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x={posX} y={baseY + 13} fill={div === 1 ? "#fbbf24" : "#64748b"} fontSize="8.5" fontStyle="italic" textAnchor="middle">
                      {div}τ <tspan fontSize="7.5" fill="#475569">({timeMsLabel}ms)</tspan>
                    </text>
                  </g>
                );
              })}

              {/* Top line labels: I0 & +E */}
              <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
              <text x={padL - 4} y={padT + 4} fill="#10b981" fontSize="9" fontStyle="italic" fontWeight="bold" textAnchor="end">I₀ / +E</text>

              {/* Bottom line labels: 0(i) & -E(uL) */}
              <line x1={padL} y1={baseY} x2={padL + plotW} y2={baseY} stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
              <text x={padL - 4} y={baseY + 3} fill="#f43f5e" fontSize="8.5" fontStyle="italic" textAnchor="end">0 / −E</text>

              {/* ── SAVED SUPERPOSITION COMPARISON TRACES (DIMMED GHOST TRACES) ── */}
              {renderedSavedTraces.map((trace, idx) => (
                <g key={trace.id} opacity={0.45}>
                  <path
                    d={trace.path_i}
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

              {/* ── TANGENT AT ORIGIN FOR CURRENT i(t) & uL(t) ── */}
              {shouldShowTangent && (
                <g>
                  {switchPos === "etablissement" ? (
                    <>
                      {/* Tangent line for i(t) from (0,0) to (1tau, I0) */}
                      <line
                        x1={padL}
                        y1={baseY}
                        x2={tangentX_tau}
                        y2={padT}
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        strokeDasharray="3 2"
                      />
                      {/* Vertical dotted line from (1tau, I0) to 1tau on axis */}
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
                      <circle cx={tangentX_tau} cy={padT} r="3.5" fill="#f59e0b" />
                      <text x={tangentX_tau} y={padT - 5} fill="#f59e0b" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">
                        (τ, I₀)
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Tangent line for i(t) in Rupture from (0,I0) to (1tau, 0) */}
                      <line
                        x1={padL}
                        y1={padT}
                        x2={tangentX_tau}
                        y2={baseY}
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        strokeDasharray="3 2"
                      />
                      {/* Tangent line for uL(t) in Rupture from (0,-E) to (1tau, 0V) */}
                      <line
                        x1={padL}
                        y1={baseY}
                        x2={tangentX_tau}
                        y2={midY}
                        stroke="#fb7185"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        opacity={0.8}
                      />
                      <circle cx={tangentX_tau} cy={baseY} r="3.5" fill="#f59e0b" />
                      <text x={tangentX_tau} y={baseY - 5} fill="#f59e0b" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">
                        t = τ
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH1: i(t) (GLOWING EMERALD) ── */}
              {activePath_i && (
                <path d={activePath_i} fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" filter="url(#glow-emerald)" />
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH2: uL(t) (GLOWING ROSE) ── */}
              {activePath_uL && (
                <path d={activePath_uL} fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" filter="url(#glow-rose-rl)" />
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
                  <circle cx={curX} cy={curY_i} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx={curX} cy={curY_uL} r="4" fill="#fb7185" stroke="#ffffff" strokeWidth="1.2" />
                </>
              )}
            </svg>
          </div>

          {/* ── STYLIZED COMPACT INSTANTANEOUS PHYSICAL METRICS & JOULE POWER ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Courant <LatexMath math="i(t)" /></span>
              <span className="text-emerald-300 font-bold font-mono text-xs">{i_t_mA.toFixed(1)} mA</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-rose-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Tension <LatexMath math="u_L(t)" /></span>
              <span className={`font-bold font-mono text-xs ${uL_t < 0 ? "text-rose-400" : "text-rose-300"}`}>
                {uL_t.toFixed(2)} V
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-amber-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Énergie <LatexMath math="\mathcal{E}_L(t)" /></span>
              <span className="text-amber-300 font-bold font-mono text-xs">{energyMag_mJ.toFixed(2)} mJ</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-orange-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 flex items-center justify-center gap-0.5 font-sans">
                <Flame className="w-2.5 h-2.5 text-orange-400" />
                <span>Effet Joule <LatexMath math="P_J" /></span>
              </span>
              <span className="text-orange-300 font-bold font-mono text-xs">{joulePower_mW.toFixed(1)} mW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
