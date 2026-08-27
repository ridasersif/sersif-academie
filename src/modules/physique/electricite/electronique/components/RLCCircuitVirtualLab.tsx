/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Waves,
  BookmarkPlus,
  Trash2,
  Flame,
  Activity,
  Zap,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface SavedTraceRLC {
  id: string;
  R: number;
  L_mH: number;
  C_uF: number;
  E: number;
  regime: "pseudo" | "critique" | "aperiodique";
  Q: number;
}

export default function RLCCircuitVirtualLab() {
  // ── 1. REAL-TIME PHYSICAL PARAMETERS (SLIDERS) ──
  const [E, setE] = useState<number>(10); // V (2 to 20)
  const [R, setR] = useState<number>(40); // Ohm (5 to 500)
  const [L_mH, setL_mH] = useState<number>(200); // mH (20 to 1000)
  const [C_uF, setC_uF] = useState<number>(10); // uF (1 to 50)

  // Switch Position: "charge" (Pos 1) | "decharge_rlc" (Pos 2)
  const [switchPos, setSwitchPos] = useState<"charge" | "decharge_rlc">("decharge_rlc");

  // Advanced Pedagogical Toggles
  const [showEnveloppe, setShowEnveloppe] = useState<boolean>(true);
  const [showPseudoPeriod, setShowPseudoPeriod] = useState<boolean>(true);
  const [savedTraces, setSavedTraces] = useState<SavedTraceRLC[]>([]);

  // Simulation Controls: Human observable animation
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [elapsedSimSec, setElapsedSimSec] = useState<number>(0); // 0 to 8.0s

  // Physical units in SI
  const L_H = useMemo(() => L_mH * 1e-3, [L_mH]);
  const C_F = useMemo(() => C_uF * 1e-6, [C_uF]);
  const R_total = useMemo(() => Math.max(R, 0.1), [R]);

  // Characteristic parameters of RLC circuit
  const omega0 = useMemo(() => 1 / Math.sqrt(L_H * C_F), [L_H, C_F]); // rad/s
  const f0 = useMemo(() => omega0 / (2 * Math.PI), [omega0]); // Hz
  const T0_ms = useMemo(() => (1 / f0) * 1000, [f0]); // ms
  const lambda = useMemo(() => R_total / (2 * L_H), [R_total, L_H]); // s^-1
  const Rc = useMemo(() => 2 * Math.sqrt(L_H / C_F), [L_H, C_F]); // Critical resistance in Ohm
  const Q = useMemo(() => (1 / R_total) * Math.sqrt(L_H / C_F), [R_total, L_H, C_F]); // Quality factor

  // Detect Regime
  const regimeType = useMemo<"pseudo" | "critique" | "aperiodique">(() => {
    if (Math.abs(R_total - Rc) < 1.0 || Math.abs(Q - 0.5) < 0.02) return "critique";
    if (R_total < Rc) return "pseudo";
    return "aperiodique";
  }, [R_total, Rc, Q]);

  // Pseudo-pulsation and pseudo-period (if pseudo-periodic)
  const omega_pseudo = useMemo(() => {
    if (omega0 > lambda) {
      return Math.sqrt(omega0 * omega0 - lambda * lambda);
    }
    return 0;
  }, [omega0, lambda]);

  const T_pseudo_ms = useMemo(() => {
    if (omega_pseudo > 0) {
      return ((2 * Math.PI) / omega_pseudo) * 1000;
    }
    return T0_ms;
  }, [omega_pseudo, T0_ms]);

  // Time window: Perfectly scaled to display complete decay up to 5 tau or 5 periods
  const tau_amort_ms = useMemo(() => (1 / (lambda || 1)) * 1000, [lambda]);
  const tau_charge_ms = useMemo(() => R_total * C_F * 1000, [R_total, C_F]);

  const T_WINDOW_MS = useMemo(() => {
    if (switchPos === "charge") {
      return Math.max(5 * tau_charge_ms, 5.0);
    }
    if (regimeType === "pseudo") {
      return Math.max(5 * T_pseudo_ms, 5 * tau_amort_ms, 15);
    }
    if (regimeType === "critique") {
      return Math.max(6 * (1000 / omega0), 15);
    }
    // Aperiodique: root r1 = -lambda + sqrt(lambda^2 - omega0^2)
    const delta = Math.sqrt(Math.max(lambda * lambda - omega0 * omega0, 0));
    const r1 = Math.abs(-lambda + delta);
    return Math.max(6 * (1000 / (r1 || 1)), 25);
  }, [switchPos, regimeType, tau_charge_ms, T_pseudo_ms, tau_amort_ms, omega0, lambda]);

  const TOTAL_SIM_SEC = 8.0; // Observable human duration

  // Instantaneous physical time t (ms & s)
  const currentPhysTimeMs = useMemo(() => {
    return Math.min((elapsedSimSec / TOTAL_SIM_SEC) * T_WINDOW_MS, T_WINDOW_MS);
  }, [elapsedSimSec, TOTAL_SIM_SEC, T_WINDOW_MS]);

  const currentPhysTimeSec = useMemo(() => currentPhysTimeMs * 1e-3, [currentPhysTimeMs]);

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

  // ── 3. EXACT ANALYTICAL RLC SOLUTIONS AT INSTANT t ──
  const calculateRLCState = (tSec: number) => {
    if (switchPos === "charge") {
      // Steady charge from source E: uC(t) = E*(1 - e^(-t/tau_rc))
      const tau_rc = R_total * C_F;
      const th = tSec / (tau_rc || 1e-6);
      const expTerm = Math.exp(-th);
      const uC = E * (1 - expTerm);
      const i_A = (E / R_total) * expTerm;
      return { uC, i_A, envelope: E };
    }

    // Regime RLC Décharge Libre (condensateur initialement chargé sous E0 = E)
    const E0 = E;
    let uC = 0;
    let i_A = 0;
    let env = 0;

    if (regimeType === "pseudo") {
      // uC(t) = E0 * e^(-lambda*t) * [ cos(Omega*t) + (lambda/Omega)*sin(Omega*t) ]
      const expTerm = Math.exp(-lambda * tSec);
      const cosTerm = Math.cos(omega_pseudo * tSec);
      const sinTerm = Math.sin(omega_pseudo * tSec);
      const factor = lambda / (omega_pseudo || 1);

      uC = E0 * expTerm * (cosTerm + factor * sinTerm);
      // i(t) = C duC/dt = - (E0 / (L*Omega)) * e^(-lambda*t) * sin(Omega*t)
      i_A = -((E0 * C_F * (omega0 * omega0)) / (omega_pseudo || 1)) * expTerm * sinTerm;
      env = E0 * expTerm * Math.sqrt(1 + factor * factor);
    } else if (regimeType === "critique") {
      // uC(t) = E0 * (1 + omega0*t) * e^(-omega0*t)
      const expTerm = Math.exp(-omega0 * tSec);
      uC = E0 * (1 + omega0 * tSec) * expTerm;
      // i(t) = C duC/dt = - E0 * C * omega0^2 * t * e^(-omega0*t)
      i_A = -E0 * C_F * omega0 * omega0 * tSec * expTerm;
      env = uC;
    } else {
      // Apériodique: r1, r2 = -lambda +/- sqrt(lambda^2 - omega0^2)
      const delta = Math.sqrt(Math.max(lambda * lambda - omega0 * omega0, 0));
      const r1 = -lambda + delta;
      const r2 = -lambda - delta;
      // uC(t) = (E0 / (r2 - r1)) * [ r2 * e^(r1*t) - r1 * e^(r2*t) ]
      const c1 = (E0 * r2) / (r2 - r1 || 1e-6);
      const c2 = (-E0 * r1) / (r2 - r1 || 1e-6);
      uC = c1 * Math.exp(r1 * tSec) + c2 * Math.exp(r2 * tSec);
      // i(t) = C duC/dt
      i_A = C_F * (c1 * r1 * Math.exp(r1 * tSec) + c2 * r2 * Math.exp(r2 * tSec));
      env = uC;
    }

    return { uC, i_A, envelope: env };
  };

  // Instantaneous live metrics
  const { uC_t, i_t_A, envelope_t, energyElec_mJ, energyMag_mJ, energyTotal_mJ, joulePower_mW } = useMemo(() => {
    const { uC, i_A, envelope } = calculateRLCState(currentPhysTimeSec);
    const ee = 0.5 * C_F * uC * uC * 1000; // mJ
    const em = 0.5 * L_H * i_A * i_A * 1000; // mJ
    const etot = ee + em;
    const pj = R_total * i_A * i_A * 1000; // mW

    return {
      uC_t: uC,
      i_t_A: i_A,
      envelope_t: envelope,
      energyElec_mJ: ee,
      energyMag_mJ: em,
      energyTotal_mJ: etot,
      joulePower_mW: pj,
    };
  }, [currentPhysTimeSec, calculateRLCState, C_F, L_H, R_total]);

  // Switch Toggle Handler
  const handleToggleSwitch = (newPos: "charge" | "decharge_rlc") => {
    if (newPos === switchPos) return;
    setSwitchPos(newPos);
    setElapsedSimSec(0);
    setIsRunning(true);
  };

  // Reset Button Handler
  const handleReset = () => {
    setIsRunning(false);
    setElapsedSimSec(0);
  };

  // ── 4. OSCILLOSCOPE TRACING (CH1: uC(t) Cyan, CH2: i(t) Rose, Envelope Amber) ──
  const oscW = 480;
  const oscH = 210;
  const padL = 42;
  const padR = 20;
  const padT = 22;
  const padB = 25;
  const plotW = oscW - padL - padR;
  const plotH = oscH - padT - padB;
  const midY = padT + plotH / 2; // 0V / 0A line

  // Scale for current i(t) on CH2
  const I_scale_A = useMemo(() => {
    if (switchPos === "charge") {
      return Math.max(E / R_total, 0.05);
    }
    return Math.max(E * Math.sqrt(C_F / L_H), E / R_total, 0.05);
  }, [E, R_total, C_F, L_H, switchPos]);

  // Real-time active drawn path up to currentPhysTimeSec
  const { activePath_uC, activePath_i, activePath_envTop, activePath_envBot, curX, curY_uC, curY_i } = useMemo(() => {
    const totalSteps = 160;
    const pts_uC: string[] = [];
    const pts_i: string[] = [];
    const pts_envTop: string[] = [];
    const pts_envBot: string[] = [];

    const effectiveTimeSec = Math.max(currentPhysTimeSec, 0.0001);
    const dt = effectiveTimeSec / totalSteps;

    for (let s = 0; s <= totalSteps; s++) {
      const t = s * dt;
      const x = padL + (t / (T_WINDOW_MS * 1e-3)) * plotW;

      const { uC, i_A, envelope } = calculateRLCState(t);

      // Map uC(t) (-E to +E) -> (midY + plotH/2.2 to midY - plotH/2.2)
      const y_uC = midY - (uC / (E || 1)) * (plotH / 2.3);
      pts_uC.push(`${x.toFixed(1)},${y_uC.toFixed(1)}`);

      // Map i(t) (-I_scale to +I_scale)
      const y_i = midY - (i_A / (I_scale_A || 1)) * (plotH / 2.3);
      pts_i.push(`${x.toFixed(1)},${y_i.toFixed(1)}`);

      // Envelope (+/-)
      if (regimeType === "pseudo" && switchPos === "decharge_rlc") {
        const y_envT = midY - (envelope / (E || 1)) * (plotH / 2.3);
        const y_envB = midY + (envelope / (E || 1)) * (plotH / 2.3);
        pts_envTop.push(`${x.toFixed(1)},${y_envT.toFixed(1)}`);
        pts_envBot.push(`${x.toFixed(1)},${y_envB.toFixed(1)}`);
      }
    }

    const currentX = padL + (currentPhysTimeSec / (T_WINDOW_MS * 1e-3)) * plotW;
    const currentY_uC = midY - (uC_t / (E || 1)) * (plotH / 2.3);
    const currentY_i = midY - (i_t_A / (I_scale_A || 1)) * (plotH / 2.3);

    return {
      activePath_uC: pts_uC.length > 1 ? `M ${pts_uC.join(" L ")}` : "",
      activePath_i: pts_i.length > 1 ? `M ${pts_i.join(" L ")}` : "",
      activePath_envTop: pts_envTop.length > 1 ? `M ${pts_envTop.join(" L ")}` : "",
      activePath_envBot: pts_envBot.length > 1 ? `M ${pts_envBot.join(" L ")}` : "",
      curX: currentX,
      curY_uC: currentY_uC,
      curY_i: currentY_i,
    };
  }, [currentPhysTimeSec, calculateRLCState, T_WINDOW_MS, padL, plotW, midY, E, plotH, I_scale_A, regimeType, switchPos, uC_t, i_t_A]);

  // Saved traces comparison
  const handleSaveTrace = () => {
    const newTrace: SavedTraceRLC = {
      id: String(Date.now()),
      R,
      L_mH,
      C_uF,
      E,
      regime: regimeType,
      Q,
    };
    setSavedTraces((prev) => [...prev, newTrace]);
  };

  const handleClearSavedTraces = () => {
    setSavedTraces([]);
  };

  // Capacitor charge plates visualization
  const chargeFraction = Math.max(Math.min(uC_t / (E || 1), 1.0), -1.0);
  const isCapacitorCharged = Math.abs(chargeFraction) > 0.05;

  // Inductor magnetic field glow fraction
  const initialMaxEnergy = 0.5 * C_F * E * E * 1000;
  const magFieldFraction = initialMaxEnergy > 0 ? Math.min(energyMag_mJ / initialMaxEnergy, 1.0) : 0;

  // Flowing charge particles in wire proportional to i(t)
  const currentFraction = Math.abs(i_t_A) / (I_scale_A || 1);
  const isCurrentMoving = isRunning && currentFraction > 0.02;
  const particleSpeedDuration = currentFraction > 0.02 ? `${Math.max(0.8 / currentFraction, 0.4).toFixed(2)}s` : "0s";

  return (
    <div className="rounded-2xl bg-slate-950 border border-indigo-500/30 p-3 sm:p-4 space-y-3 shadow-2xl shadow-indigo-950/20">
      {/* ── 1. HEADER & COMPACT INTERACTIVE TOOLBAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
        {/* Title & Regime Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
            <Waves className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Lab Circuit RLC Série (Oscillateur Libre)
              </h3>
              <span
                className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  regimeType === "pseudo"
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                    : regimeType === "critique"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/40"
                }`}
              >
                {regimeType === "pseudo"
                  ? "Régime Pseudo-Périodique"
                  : regimeType === "critique"
                  ? "Régime Critique"
                  : "Régime Apériodique"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 pt-0.5">
              <LatexMath math={`R_c = ${Rc.toFixed(1)}\\,\\Omega`} /> • <LatexMath math={`Q = ${Q.toFixed(2)}`} />
            </div>
          </div>
        </div>

        {/* Sleek Compact Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Position Selector (Charge / Décharge RLC) */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10.5px]">
            <button
              onClick={() => handleToggleSwitch("charge")}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "charge"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>(1) Charge</span>
            </button>
            <button
              onClick={() => handleToggleSwitch("decharge_rlc")}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer font-semibold ${
                switchPos === "decharge_rlc"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>(2) Décharge RLC</span>
            </button>
          </div>

          {/* Start / Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
              isRunning
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30 shadow-sm"
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
                <span>{elapsedSimSec === 0 ? "Osciller" : "Reprendre"}</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Superposition Compare */}
          <button
            onClick={handleSaveTrace}
            disabled={!activePath_uC}
            className={`px-2 py-1 rounded-lg border text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              activePath_uC
                ? "bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25"
                : "opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500"
            }`}
            title="Mémoriser cette courbe"
          >
            <BookmarkPlus className="w-3 h-3" />
            <span>Garder</span>
          </button>

          {savedTraces.length > 0 && (
            <button
              onClick={handleClearSavedTraces}
              className="p-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
              title="Effacer les traces"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Speed */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[9.5px] font-mono">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  simSpeed === spd ? "bg-indigo-500/30 text-indigo-300 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. REAL-TIME 4 SLIDERS (E, R, L, C) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center text-[10.5px]">
        {/* Slider E */}
        <div className="space-y-0.5">
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
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Résistance</span>
              <LatexMath math="R" /> :
            </span>
            <span className="text-indigo-300 font-mono">{R} Ω</span>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={R}
            onChange={(e) => {
              setR(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>

        {/* Slider L */}
        <div className="space-y-0.5">
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

        {/* Slider C */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-slate-400 flex items-center gap-1">
              <span>Capacité</span>
              <LatexMath math="C" /> :
            </span>
            <span className="text-cyan-300 font-mono">{C_uF} μF</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={C_uF}
            onChange={(e) => {
              setC_uF(Number(e.target.value));
              if (!isRunning) handleReset();
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* ── 3. MAIN PANELS: INTERACTIVE CIRCUIT GRAPHIC + OSCILLOSCOPE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* ── LEFT PANEL (6 COLS): 3-BRANCH RLC CIRCUIT SCHEMATIC ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  switchPos === "charge" ? "bg-emerald-400 animate-pulse" : "bg-indigo-400 animate-pulse"
                }`}
              />
              <span>Montage Expérimental RLC Série</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {switchPos === "charge" ? "Position (1) : Charge Continue" : "Position (2) : Oscillations RLC"}
            </span>
          </div>

          {/* SVG Circuit Schematic */}
          <div className="relative">
            <svg
              viewBox="0 0 340 230"
              className="w-full h-auto max-w-[320px] mx-auto select-none font-sans"
            >
              <defs>
                <filter id="glow-rlc-b" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.8" />
                </filter>
                <marker id="arr-indig" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#818cf8" />
                </marker>
                <marker id="arr-emrld" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0,1 5,3 0,5" fill="#10b981" />
                </marker>
              </defs>

              {/* Background */}
              <rect x="2" y="2" width="336" height="226" rx="10" fill="#020817" stroke="#0e2a3a" strokeWidth="1" />

              {/* ── 1. GENERATOR BRANCH (LEFT) ── */}
              <path
                d="M 60 115 L 60 35 L 140 35 M 60 135 L 60 205 L 170 205"
                fill="none"
                stroke={switchPos === "charge" ? "#10b981" : "#334155"}
                strokeWidth={switchPos === "charge" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "charge" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Battery Symbol */}
              <line x1="44" y1="117" x2="76" y2="117" stroke={switchPos === "charge" ? "#10b981" : "#475569"} strokeWidth="2.8" strokeLinecap="round" />
              <line x1="50" y1="127" x2="70" y2="127" stroke={switchPos === "charge" ? "#10b981" : "#475569"} strokeWidth="4.5" strokeLinecap="round" />
              <text x="32" y="115" fill={switchPos === "charge" ? "#34d399" : "#475569"} fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
              <text x="34" y="136" fill={switchPos === "charge" ? "#34d399" : "#475569"} fontSize="14" fontWeight="bold" textAnchor="middle">−</text>
              <text x="88" y="125" fill={switchPos === "charge" ? "#34d399" : "#64748b"} fontSize="11" fontStyle="italic" fontWeight="bold">E</text>

              {/* Direction Arrows in Charge mode */}
              {switchPos === "charge" && isRunning && (
                <g>
                  <line x1="90" y1="35" x2="110" y2="35" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emrld)" />
                  <line x1="170" y1="115" x2="170" y2="130" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emrld)" />
                  <line x1="125" y1="205" x2="105" y2="205" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emrld)" />
                  <line x1="60" y1="90" x2="60" y2="70" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emrld)" />
                </g>
              )}

              {/* ── 2. RIGHT INDUCTOR BRANCH (L, r) ── */}
              <path
                d="M 200 35 L 280 35 L 280 90 M 280 145 L 280 205 L 170 205"
                fill="none"
                stroke={switchPos === "decharge_rlc" ? "#818cf8" : "#334155"}
                strokeWidth={switchPos === "decharge_rlc" ? 2.4 : 1.2}
                strokeDasharray={switchPos === "decharge_rlc" ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Coil on Right Branch with Magnetic Glow */}
              <g transform="translate(280, 90)">
                {magFieldFraction > 0.05 && (
                  <ellipse cx="0" cy="27" rx="18" ry="24" fill="none" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3 2" opacity={magFieldFraction} />
                )}
                <path
                  d="M 0 0 C 18 3, 18 15, 0 16 C 18 19, 18 31, 0 32 C 18 35, 18 47, 0 48"
                  fill="none"
                  stroke={switchPos === "decharge_rlc" ? "#fbbf24" : "#475569"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter={magFieldFraction > 0.15 ? "url(#glow-rlc-b)" : undefined}
                />
                <text x="22" y="28" fill={switchPos === "decharge_rlc" ? "#fbbf24" : "#475569"} fontSize="11" fontStyle="italic" fontWeight="bold">L, r</text>
              </g>

              {/* Direction Arrows in RLC discharge */}
              {switchPos === "decharge_rlc" && isCurrentMoving && (
                <g>
                  {i_t_A > 0 ? (
                    <>
                      <line x1="280" y1="170" x2="280" y2="185" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="230" y1="205" x2="210" y2="205" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="170" y1="125" x2="170" y2="110" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="235" y1="35" x2="255" y2="35" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                    </>
                  ) : (
                    <>
                      <line x1="245" y1="35" x2="225" y2="35" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="170" y1="110" x2="170" y2="125" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="210" y1="205" x2="230" y2="205" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                      <line x1="280" y1="185" x2="280" y2="170" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig)" />
                    </>
                  )}
                </g>
              )}

              {/* ── 3. CENTRAL BRANCH (R & C) ── */}
              <path
                d="M 170 52 L 170 65 M 170 102 L 170 140 M 170 156 L 170 205"
                fill="none"
                stroke={switchPos === "charge" ? "#10b981" : "#818cf8"}
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Switch K terminals & Blade */}
              <circle cx="140" cy="35" r="3.5" fill={switchPos === "charge" ? "#10b981" : "#334155"} />
              <text x="135" y="24" fill={switchPos === "charge" ? "#10b981" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(1)</text>

              <circle cx="200" cy="35" r="3.5" fill={switchPos === "decharge_rlc" ? "#818cf8" : "#334155"} />
              <text x="205" y="24" fill={switchPos === "decharge_rlc" ? "#818cf8" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">(2)</text>

              <circle cx="170" cy="52" r="3.5" fill="#f8fafc" />
              <text x="170" y="42" fill="#f8fafc" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">K</text>

              {/* Switch Blade */}
              <line
                x1="170"
                y1="52"
                x2={switchPos === "charge" ? 140 : 200}
                y2="35"
                stroke={switchPos === "charge" ? "#10b981" : "#818cf8"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Resistor R */}
              <rect
                x="154"
                y="65"
                width="32"
                height="37"
                rx="4"
                fill="#1e1b4b"
                stroke={switchPos === "charge" ? "#10b981" : "#818cf8"}
                strokeWidth="1.8"
              />
              <text x="170" y="88" fill="#c7d2fe" fontSize="12" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

              {/* Capacitor C */}
              <g transform="translate(170, 140)">
                <line x1="-20" y1="0" x2="20" y2="0" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
                <line x1="-20" y1="16" x2="20" y2="16" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />

                {/* Electric field lines */}
                {isCapacitorCharged && (
                  <g opacity={Math.abs(chargeFraction)}>
                    {[-10, -3, 3, 10].map((xOff) => (
                      <line
                        key={xOff}
                        x1={xOff}
                        y1={chargeFraction > 0 ? 2 : 14}
                        x2={xOff}
                        y2={chargeFraction > 0 ? 14 : 2}
                        stroke="#00f0ff"
                        strokeWidth="1"
                        strokeDasharray="2 1"
                      />
                    ))}
                  </g>
                )}

                <text x="26" y="11" fill="#00f0ff" fontSize="12" fontStyle="italic" fontWeight="bold">C</text>
                <text x="-24" y="2" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">{chargeFraction >= 0 ? "+q" : "-q"}</text>
                <text x="-24" y="18" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">{chargeFraction >= 0 ? "-q" : "+q"}</text>
              </g>

              {/* Flowing Electrons */}
              {isCurrentMoving && (
                <>
                  {[0, 0.25, 0.5, 0.75].map((phase, idx) => (
                    <circle key={idx} r="2.5" fill="#fde047" stroke="#ffffff" strokeWidth="0.5">
                      <animateMotion
                        dur={particleSpeedDuration}
                        begin={`${(phase * parseFloat(particleSpeedDuration)).toFixed(2)}s`}
                        repeatCount="indefinite"
                        path={
                          switchPos === "charge"
                            ? "M 60 115 L 60 35 L 140 35 L 170 52 L 170 205 L 60 205 Z"
                            : i_t_A > 0
                            ? "M 170 205 L 170 52 L 200 35 L 280 35 L 280 205 Z"
                            : "M 170 52 L 170 205 L 280 205 L 280 35 L 200 35 Z"
                        }
                      />
                    </circle>
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Energy Distribution Bar */}
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Transferts d&apos;Énergie :</span>
              </span>
              <span className="text-white font-mono text-[11px] flex items-center gap-2">
                <span className="text-cyan-300">⚡ Électrique : {energyElec_mJ.toFixed(2)} mJ</span>
                <span className="text-amber-300">🧲 Magnétique : {energyMag_mJ.toFixed(2)} mJ</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
              <div
                className="h-full bg-cyan-400 transition-none"
                style={{ width: `${(energyElec_mJ / (Math.max(energyTotal_mJ, 0.001))) * 100}%` }}
                title="Énergie Électrique dans C"
              />
              <div
                className="h-full bg-amber-400 transition-none"
                style={{ width: `${(energyMag_mJ / (Math.max(energyTotal_mJ, 0.001))) * 100}%` }}
                title="Énergie Magnétique dans L"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (6 COLS): SYNCHRONIZED RLC OSCILLOSCOPE ── */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2.5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2.5 text-[10.5px]">
              <span className="text-cyan-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                <span>CH1: <LatexMath math="u_C(t)" /></span>
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
                <span>CH2: <LatexMath math="i(t)" /></span>
              </span>
              {regimeType === "pseudo" && switchPos === "decharge_rlc" && (
                <label className="flex items-center gap-1 text-[10px] text-amber-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showEnveloppe}
                    onChange={(e) => setShowEnveloppe(e.target.checked)}
                    className="w-2.5 h-2.5 rounded bg-slate-900 border-slate-700 accent-amber-400"
                  />
                  <span>Enveloppe</span>
                </label>
              )}
            </div>
            <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              t = {currentPhysTimeMs.toFixed(1)} ms / {T_WINDOW_MS.toFixed(1)} ms
            </span>
          </div>

          {/* Oscilloscope Screen */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800/90 p-1">
            <svg
              viewBox={`0 0 ${oscW} ${oscH}`}
              className="w-full h-auto select-none font-sans"
            >
              <defs>
                <filter id="glow-cyan-rlc" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00f0ff" />
                </filter>
                <filter id="glow-rose-rlc" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fb7185" />
                </filter>
              </defs>

              {/* Screen Background & Grid */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="#020817" stroke="#1e293b" strokeWidth="1" />
              
              {/* Horizontal Center line (0V / 0A, midY) */}
              <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padL - 4} y={midY + 3} fill="#64748b" fontSize="8.5" fontStyle="italic" textAnchor="end">0V / 0A</text>

              {/* Top and Bottom voltage labels */}
              <line x1={padL} y1={padT + 4} x2={padL + plotW} y2={padT + 4} stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.25" />
              <text x={padL - 4} y={padT + 8} fill="#00f0ff" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="end">+{E}V</text>

              <line x1={padL} y1={padT + plotH - 4} x2={padL + plotW} y2={padT + plotH - 4} stroke="#00f0ff" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.25" />
              <text x={padL - 4} y={padT + plotH} fill="#00f0ff" fontSize="8.5" fontStyle="italic" fontWeight="bold" textAnchor="end">−{E}V</text>

              {/* Pseudo-Period T markers on graph ONLY during RLC discharge */}
              {switchPos === "decharge_rlc" && regimeType === "pseudo" && showPseudoPeriod && T_pseudo_ms < T_WINDOW_MS && (
                <g>
                  <line
                    x1={padL + (T_pseudo_ms / T_WINDOW_MS) * plotW}
                    y1={padT}
                    x2={padL + (T_pseudo_ms / T_WINDOW_MS) * plotW}
                    y2={padT + plotH}
                    stroke="#f59e0b"
                    strokeWidth="0.9"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padL + (T_pseudo_ms / T_WINDOW_MS) * plotW}
                    y={padT + 12}
                    fill="#f59e0b"
                    fontSize="8.5"
                    fontStyle="italic"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    T = {T_pseudo_ms.toFixed(1)}ms
                  </text>
                </g>
              )}

              {/* ── EXPONENTIAL ENVELOPE (AMBER DOTTED) ── */}
              {showEnveloppe && activePath_envTop && (
                <>
                  <path d={activePath_envTop} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" />
                  <path d={activePath_envBot} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" />
                </>
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH1: uC(t) (CYAN) ── */}
              {activePath_uC && (
                <path d={activePath_uC} fill="none" stroke="#00f0ff" strokeWidth="2.4" strokeLinecap="round" filter="url(#glow-cyan-rlc)" />
              )}

              {/* ── LIVE ACTIVE TRACED CURVE CH2: i(t) (ROSE) ── */}
              {activePath_i && (
                <path d={activePath_i} fill="none" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" filter="url(#glow-rose-rlc)" />
              )}

              {/* Animated Laser Beam Vertical Cursor */}
              <line
                x1={curX}
                y1={padT}
                x2={curX}
                y2={padT + plotH}
                stroke="#fde047"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Laser Head Points */}
              {elapsedSimSec > 0.05 && (
                <>
                  <circle cx={curX} cy={curY_uC} r="3.5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1" />
                  <circle cx={curX} cy={curY_i} r="3" fill="#fb7185" stroke="#ffffff" strokeWidth="1" />
                </>
              )}
            </svg>
          </div>

          {/* ── LIVE PHYSICAL METRIC CARDS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Tension <LatexMath math="u_C(t)" /></span>
              <span className="text-cyan-300 font-bold font-mono text-xs">{uC_t.toFixed(2)} V</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-rose-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Courant <LatexMath math="i(t)" /></span>
              <span className="text-rose-300 font-bold font-mono text-xs">{(i_t_A * 1000).toFixed(1)} mA</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-indigo-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 block font-sans">Énergie Totale <LatexMath math="\mathcal{E}_T" /></span>
              <span className="text-indigo-300 font-bold font-mono text-xs">{energyTotal_mJ.toFixed(2)} mJ</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-orange-500/30 space-y-0.5">
              <span className="text-[9.5px] text-slate-400 flex items-center justify-center gap-0.5 font-sans">
                <Flame className="w-2.5 h-2.5 text-orange-400" />
                <span>Dissipation Joule</span>
              </span>
              <span className="text-orange-300 font-bold font-mono text-xs">{joulePower_mW.toFixed(1)} mW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
