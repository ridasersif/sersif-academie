/* eslint-disable react-hooks/purity */
"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  Zap,
  Sliders,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Layers,
  Flame,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type CircuitTab = "rc_charge" | "rc_decharge" | "rl_etablissement" | "rlc_libre" | "rl_sinus";

export default function RegimesTransitoiresSimulator() {
  const [tab, setTab] = useState<CircuitTab>("rc_charge");

  // Parameters
  const [E, setE] = useState(10.0); // V
  const [R, setR] = useState(100.0); // Ohms
  const [C, setC] = useState(50.0); // µF
  const [L, setL] = useState(200.0); // mH
  const [freq, setFreq] = useState(1.5); // Hz (for RL sinusoidal)

  // Calculations
  const tauRC = useMemo(() => (R * C) / 1000, [R, C]); // in ms: R (Ohm) * C (uF) / 1000 = ms
  const tauRL = useMemo(() => (L / R), [L, R]); // in ms: L (mH) / R (Ohm) = ms

  // RLC Calculations
  // omega0 = 1 / sqrt(L * C) where L in H, C in F
  const { omega0, Q, lambda, regimeType, R_critique, T_pseudo } = useMemo(() => {
    const L_SI = L * 1e-3; // H
    const C_SI = C * 1e-6; // F
    const R_SI = R; // Ohm

    const w0 = 1 / Math.sqrt(L_SI * C_SI);
    const Rc = 2 * Math.sqrt(L_SI / C_SI);
    const qFactor = (1 / R_SI) * Math.sqrt(L_SI / C_SI);
    const lamb = R_SI / (2 * L_SI);

    let reg = "Pseudo-Périodique (Oscillant Amorti)";
    let T_ps = 0;

    if (Math.abs(R_SI - Rc) < 1.0) {
      reg = "Régime Critique (Amortissement Optimal)";
    } else if (qFactor > 0.5) {
      reg = "Régime Pseudo-Périodique (Oscillant Amorti)";
      const w_ps = Math.sqrt(w0 * w0 - lamb * lamb);
      T_ps = (2 * Math.PI) / w_ps;
    } else {
      reg = "Régime Apériodique (Fort Amortissement)";
    }

    return {
      omega0: w0,
      Q: qFactor,
      lambda: lamb,
      regimeType: reg,
      R_critique: Rc,
      T_pseudo: T_ps,
    };
  }, [L, C, R]);

  // Curve Generation
  const svgW = 560;
  const svgH = 220;
  const padL = 40;
  const padR = 25;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const midY = padT + plotH / 2;
  const baseY = padT + plotH;

  const pointsCount = 100;

  const { curvePoints1, curvePoints2, label1, label2, color1, color2, tMaxMs, tauDisplay } =
    useMemo(() => {
      const pts1: string[] = [];
      const pts2: string[] = [];
      let l1 = "u_C(t)";
      let l2 = "i(t)";
      let c1 = "#00f0ff"; // Cyan
      let c2 = "#ff007f"; // Magenta
      let tMax = 5 * tauRC; // ms
      let tauVal = tauRC;

      if (tab === "rc_charge") {
        tMax = Math.max(5 * tauRC, 1);
        tauVal = tauRC;
        l1 = "u_C(t) \\text{ [V]}";
        l2 = "i(t) \\text{ [mA]}";
        c1 = "#00f0ff";
        c2 = "#ff007f";

        for (let i = 0; i <= pointsCount; i++) {
          const t = (i / pointsCount) * tMax;
          const uC = E * (1 - Math.exp(-t / tauRC));
          const iC = (E / R) * Math.exp(-t / tauRC) * 1000; // in mA

          const x = padL + (t / tMax) * plotW;
          const y1 = baseY - (uC / E) * (plotH * 0.85);
          const y2 = baseY - (iC / ((E / R) * 1000)) * (plotH * 0.85);

          pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
          pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
        }
      } else if (tab === "rc_decharge") {
        tMax = Math.max(5 * tauRC, 1);
        tauVal = tauRC;
        l1 = "u_C(t) \\text{ [V]}";
        l2 = "i(t) \\text{ [mA]}";
        c1 = "#00f0ff";
        c2 = "#ff007f";

        for (let i = 0; i <= pointsCount; i++) {
          const t = (i / pointsCount) * tMax;
          const uC = E * Math.exp(-t / tauRC);
          const iC = -(E / R) * Math.exp(-t / tauRC) * 1000; // in mA

          const x = padL + (t / tMax) * plotW;
          const y1 = baseY - (uC / E) * (plotH * 0.85);
          const y2 = midY - (iC / ((E / R) * 1000)) * (plotH * 0.4);

          pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
          pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
        }
      } else if (tab === "rl_etablissement") {
        tMax = Math.max(5 * tauRL, 0.1);
        tauVal = tauRL;
        l1 = "i(t) \\text{ [mA]}";
        l2 = "u_L(t) \\text{ [V]}";
        c1 = "#10b981"; // Emerald Green
        c2 = "#fbbf24"; // Amber

        const I0_mA = (E / R) * 1000;

        for (let i = 0; i <= pointsCount; i++) {
          const t = (i / pointsCount) * tMax;
          const iL = I0_mA * (1 - Math.exp(-t / tauRL));
          const uL = E * Math.exp(-t / tauRL);

          const x = padL + (t / tMax) * plotW;
          const y1 = baseY - (iL / I0_mA) * (plotH * 0.85);
          const y2 = baseY - (uL / E) * (plotH * 0.85);

          pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
          pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
        }
      } else if (tab === "rlc_libre") {
        const L_SI = L * 1e-3;
        const C_SI = C * 1e-6;
        const R_SI = R;
        const w0 = 1 / Math.sqrt(L_SI * C_SI);
        const lamb = R_SI / (2 * L_SI);
        const delta = lamb * lamb - w0 * w0;

        tMax = (5 / lamb) * 1000; // in ms
        tMax = Math.min(Math.max(tMax, 2), 50); // clamp for clean display

        l1 = "u_C(t) \\text{ [V]}";
        l2 = "i(t) \\text{ [A]}";
        c1 = "#00f0ff";
        c2 = "#f43f5e";

        for (let i = 0; i <= pointsCount; i++) {
          const t_ms = (i / pointsCount) * tMax;
          const t_s = t_ms * 1e-3;
          let uC = 0;
          let iL = 0;

          if (delta < 0) {
            // Pseudo-périodique
            const w = Math.sqrt(w0 * w0 - lamb * lamb);
            const env = Math.exp(-lamb * t_s);
            uC = E * env * (Math.cos(w * t_s) + (lamb / w) * Math.sin(w * t_s));
            iL = (C_SI * E * (w0 * w0 / w)) * env * Math.sin(w * t_s);
          } else if (Math.abs(delta) < 1e-5) {
            // Critique
            const env = Math.exp(-lamb * t_s);
            uC = E * env * (1 + lamb * t_s);
            iL = C_SI * E * lamb * lamb * t_s * env;
          } else {
            // Apériodique
            const s = Math.sqrt(delta);
            const r1 = -lamb + s;
            const r2 = -lamb - s;
            const A1 = (E * r2) / (r2 - r1);
            const A2 = (-E * r1) / (r2 - r1);
            uC = A1 * Math.exp(r1 * t_s) + A2 * Math.exp(r2 * t_s);
            iL = -C_SI * (A1 * r1 * Math.exp(r1 * t_s) + A2 * r2 * Math.exp(r2 * t_s));
          }

          const x = padL + (t_ms / tMax) * plotW;
          const y1 = midY - (uC / E) * (plotH * 0.42);
          const y2 = midY - (iL / (E / R_SI)) * (plotH * 0.40);

          pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
          pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
        }
      } else {
        // RL Sinusoidal (Exercice de Synthèse !)
        const L_SI = L * 1e-3;
        const R_SI = R;
        const tau = L_SI / R_SI;
        const w = 2 * Math.PI * freq;
        const Z = Math.sqrt(R_SI * R_SI + L_SI * L_SI * w * w);
        const Im = E / Z;
        const phi = Math.atan2(L_SI * w, R_SI);

        tMax = Math.max(5 * tau * 1000, 3000); // 5 tau or 3 periods in ms

        l1 = "i(t) \\text{ [A]} \\text{ (Total)}";
        l2 = "i_p(t) \\text{ [A]} \\text{ (Permanent RSF)}";
        c1 = "#00f0ff";
        c2 = "#a855f7"; // Purple

        for (let i = 0; i <= pointsCount; i++) {
          const t_ms = (i / pointsCount) * tMax;
          const t_s = t_ms * 1e-3;
          // i(t) = Im * [cos(wt - phi) - cos(phi)*exp(-t/tau)]
          const ip = Im * Math.cos(w * t_s - phi);
          const ih = -Im * Math.cos(phi) * Math.exp(-t_s / tau);
          const iTotal = ip + ih;

          const x = padL + (t_ms / tMax) * plotW;
          const y1 = midY - (iTotal / Im) * (plotH * 0.40);
          const y2 = midY - (ip / Im) * (plotH * 0.40);

          pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
          pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
        }
      }

      return {
        curvePoints1: pts1.join(" "),
        curvePoints2: pts2.join(" "),
        label1: l1,
        label2: l2,
        color1: c1,
        color2: c2,
        tMaxMs: tMax,
        tauDisplay: tauVal,
      };
    }, [tab, E, R, C, L, freq, tauRC, tauRL]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 font-sans">
      {/* ── TOP BAR: TITLE & CIRCUIT SWITCHER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Simulateur des Régimes Transitoires (Domaine Temporel)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
              {tab === "rlc_libre" ? regimeType : "Réponse Indicielle à un Échelon E"}
            </span>
          </div>
        </div>

        {/* Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner flex-wrap">
          <button
            onClick={() => setTab("rc_charge")}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "rc_charge"
                ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RC (Charge)
          </button>
          <button
            onClick={() => setTab("rc_decharge")}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "rc_decharge"
                ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RC (Décharge)
          </button>
          <button
            onClick={() => setTab("rl_etablissement")}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "rl_etablissement"
                ? "bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RL (Établissement)
          </button>
          <button
            onClick={() => setTab("rlc_libre")}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "rlc_libre"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RLC Libre (2nd Ordre)
          </button>
          <button
            onClick={() => setTab("rl_sinus")}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === "rl_sinus"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            RL Sinusoïdal (Synthèse)
          </button>
        </div>
      </div>

      {/* ── SVG OSCILLOSCOPE GRAPH ── */}
      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[500px] max-w-[650px] h-auto mx-auto font-sans overflow-visible">
          {/* Bezel */}
          <rect x={padL - 10} y={padT - 8} width={plotW + 20} height={plotH + 16} rx={8} fill="#030d17" stroke="#0e3a4f" strokeWidth="1.2" />

          {/* Grid Lines */}
          {Array.from({ length: 9 }).map((_, idx) => {
            const x = padL + (idx * plotW) / 8;
            return (
              <line key={`grid-x-${idx}`} x1={x} y1={padT - 8} x2={x} y2={baseY + 8} stroke="#082a3d" strokeWidth="0.8" strokeDasharray="2 3" />
            );
          })}
          {Array.from({ length: 7 }).map((_, idx) => {
            const y = padT + (idx * plotH) / 6;
            const isCenter = idx === 3 && (tab === "rlc_libre" || tab === "rl_sinus" || tab === "rc_decharge");
            return (
              <line key={`grid-y-${idx}`} x1={padL - 10} y1={y} x2={padL + plotW + 10} y2={y} stroke={isCenter ? "#0e5a77" : "#082a3d"} strokeWidth={isCenter ? 1.2 : 0.8} strokeDasharray={isCenter ? undefined : "2 3"} />
            );
          })}

          {/* Axes */}
          <line x1={padL - 10} y1={tab === "rlc_libre" || tab === "rl_sinus" || tab === "rc_decharge" ? midY : baseY} x2={padL + plotW + 15} y2={tab === "rlc_libre" || tab === "rl_sinus" || tab === "rc_decharge" ? midY : baseY} stroke="#475569" strokeWidth="1.4" />
          <line x1={padL} y1={baseY + 8} x2={padL} y2={padT - 10} stroke="#475569" strokeWidth="1.4" />

          {/* Axis Labels */}
          <text x={padL + plotW + 18} y={tab === "rlc_libre" || tab === "rl_sinus" || tab === "rc_decharge" ? midY + 3.5 : baseY + 3.5} fill="#94a3b8" fontSize="9" fontWeight="bold">t [ms]</text>
          <text x={padL - 4} y={padT - 10} fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="end">u, i</text>

          {/* Time markers on X axis */}
          <text x={padL} y={baseY + 16} fill="#64748b" fontSize="8" textAnchor="middle">0</text>
          <text x={padL + plotW * 0.5} y={baseY + 16} fill="#64748b" fontSize="8" textAnchor="middle">{(tMaxMs * 0.5).toFixed(1)} ms</text>
          <text x={padL + plotW} y={baseY + 16} fill="#64748b" fontSize="8" textAnchor="middle">{tMaxMs.toFixed(1)} ms</text>

          {/* Curve 1 */}
          <polyline fill="none" stroke={color1} strokeWidth="2.5" points={curvePoints1} strokeLinecap="round" strokeLinejoin="round" />

          {/* Curve 2 */}
          <polyline fill="none" stroke={color2} strokeWidth="2.0" strokeDasharray="4 2" points={curvePoints2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Tangent at Origin for 1st order RC/RL */}
          {(tab === "rc_charge" || tab === "rl_etablissement") && (
            <line
              x1={padL}
              y1={baseY}
              x2={padL + (tauDisplay / tMaxMs) * plotW}
              y2={baseY - plotH * 0.85}
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity={0.8}
            />
          )}

          {/* HUD Badge */}
          <rect x={padL + plotW - 190} y={padT - 4} width="185" height="34" rx="5" fill="#01070e" fillOpacity="0.9" stroke="#0e3a4f" strokeWidth="0.8" />
          <text x={padL + plotW - 10} y={padT + 9} fill={color1} fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">
            Trace 1 : {tab === "rl_sinus" ? "i(t) Total" : tab === "rl_etablissement" ? "i(t) Courant" : "uC(t) Tension"}
          </text>
          <text x={padL + plotW - 10} y={padT + 22} fill={color2} fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end">
            Trace 2 : {tab === "rl_sinus" ? "ip(t) Régime RSF" : tab === "rl_etablissement" ? "uL(t) Tension" : "i(t) Courant"}
          </text>
        </svg>
      </div>

      {/* ── SLIDERS & PARAMETER CONTROLS ── */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/90 space-y-3 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/60 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Paramètres du Circuit</span>
          </div>

          {/* Special Action: Set Critical Resistance for RLC */}
          {tab === "rlc_libre" && (
            <button
              onClick={() => setR(parseFloat(R_critique.toFixed(1)))}
              className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Régler sur Résistance Critique (Rc = {R_critique.toFixed(1)} Ω)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Voltage E */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Tension Échelon E</span>
              <span className="text-cyan-400 font-mono font-bold">{E.toFixed(0)} V</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="1"
              value={E}
              onChange={(e) => setE(parseFloat(e.target.value))}
              className="accent-cyan-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Resistance R */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Résistance R</span>
              <span className="text-rose-400 font-mono font-bold">{R.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={R}
              onChange={(e) => setR(parseFloat(e.target.value))}
              className="accent-rose-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Capacitance C (if RC or RLC) */}
          {(tab.startsWith("rc") || tab === "rlc_libre") && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Capacité C</span>
                <span className="text-cyan-400 font-mono font-bold">{C.toFixed(0)} µF</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={C}
                onChange={(e) => setC(parseFloat(e.target.value))}
                className="accent-cyan-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          )}

          {/* Inductance L (if RL or RLC) */}
          {(tab.startsWith("rl") || tab === "rlc_libre") && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inductance L</span>
                <span className="text-amber-400 font-mono font-bold">{L.toFixed(0)} mH</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={L}
                onChange={(e) => setL(parseFloat(e.target.value))}
                className="accent-amber-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          )}

          {/* Frequency f (if RL sinusoidal) */}
          {tab === "rl_sinus" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Fréquence f</span>
                <span className="text-purple-400 font-mono font-bold">{freq.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={freq}
                onChange={(e) => setFreq(parseFloat(e.target.value))}
                className="accent-purple-500 cursor-pointer w-full h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── THEORETICAL SUMMARY BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">
            {tab.startsWith("rc") ? "Constante τ = RC" : tab.startsWith("rl") ? "Constante τ = L/R" : "Pulsation propre ω₀"}
          </span>
          <div className="text-cyan-300 font-bold mt-0.5">
            <LatexMath
              math={
                tab.startsWith("rc")
                  ? `\\tau = ${tauRC.toFixed(2)}\\text{ ms}`
                  : tab.startsWith("rl")
                  ? `\\tau = ${tauRL.toFixed(2)}\\text{ ms}`
                  : `\\omega_0 = ${omega0.toFixed(0)}\\text{ rad/s}`
              }
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">
            {tab === "rlc_libre" ? "Facteur de Qualité Q" : "Temps de Réponse à 95%"}
          </span>
          <div className="text-rose-400 font-bold mt-0.5">
            <LatexMath
              math={
                tab === "rlc_libre"
                  ? `Q = ${Q.toFixed(2)}`
                  : `t_{95\\%} = 3\\tau = ${(3 * tauDisplay).toFixed(1)}\\text{ ms}`
              }
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">
            {tab === "rlc_libre" ? "Résistance Critique Rc" : "Régime Permanent (t → ∞)"}
          </span>
          <div className="text-emerald-300 font-bold mt-0.5">
            <LatexMath
              math={
                tab === "rlc_libre"
                  ? `R_c = ${R_critique.toFixed(1)}\\text{ }\\Omega`
                  : tab === "rc_charge"
                  ? `u_C(\\infty) = ${E.toFixed(0)}\\text{ V}`
                  : tab === "rc_decharge"
                  ? `u_C(\\infty) = 0\\text{ V}`
                  : `I_0 = ${(E / R * 1000).toFixed(0)}\\text{ mA}`
              }
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-sans">
            {tab === "rlc_libre" && Q > 0.5 ? "Pseudo-Période T" : "Énergie Stockée"}
          </span>
          <div className="text-amber-300 font-bold mt-0.5">
            <LatexMath
              math={
                tab === "rlc_libre" && Q > 0.5
                  ? `T = ${(T_pseudo * 1000).toFixed(1)}\\text{ ms}`
                  : tab.startsWith("rc")
                  ? `E_C = ${(0.5 * C * 1e-6 * E * E * 1000).toFixed(2)}\\text{ mJ}`
                  : `E_L = ${(0.5 * L * 1e-3 * Math.pow(E / R, 2) * 1000).toFixed(2)}\\text{ mJ}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
