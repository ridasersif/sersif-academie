"use client";

import React, { useState, useMemo } from "react";
import LatexMath from "@/components/ui/LatexMath";
import { Gauge, Sparkles, BatteryCharging, AlertCircle, ArrowRight } from "lucide-react";

export default function MaxPowerTransferCanvas() {
  const [eTh, setETh] = useState(12); // Thévenin Voltage E0 (V)
  const [rTh, setRTh] = useState(4); // Internal resistance r (Ohm)
  const [rLoad, setRLoad] = useState(4); // Load resistance R (Ohm)

  // Calculations
  const current = eTh / (rTh + rLoad); // I = E / (r + R)
  const vLoad = current * rLoad; // U_load = R * I
  const pUseful = vLoad * current; // P_u = R * I^2
  const pLoss = rTh * current * current; // P_perte = r * I^2
  const pTotal = eTh * current; // P_tot = E * I
  const efficiency = pTotal > 0 ? (pUseful / pTotal) * 100 : 0; // %
  const pMax = (eTh * eTh) / (4 * rTh); // P_max at R = r

  // SVG Curve generation for P_useful as a function of R_load
  const points = useMemo(() => {
    const pts: { x: number; y: number; r: number; p: number }[] = [];
    const maxR = Math.max(20, rTh * 4);
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * maxR;
      if (r === 0) {
        pts.push({ x: 0, y: 180, r: 0, p: 0 });
        continue;
      }
      const cur = eTh / (rTh + r);
      const p = r * cur * cur;
      // Map to SVG coordinates: width 360, height 180, padding 20
      const svgX = 30 + (r / maxR) * 310;
      const svgY = 160 - (p / (pMax * 1.25 || 1)) * 140;
      pts.push({ x: svgX, y: svgY, r, p });
    }
    return pts;
  }, [eTh, rTh, pMax]);

  const pathData = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");
  }, [points]);

  // Current operating point on curve
  const currentPoint = useMemo(() => {
    const maxR = Math.max(20, rTh * 4);
    const svgX = 30 + (rLoad / maxR) * 310;
    const svgY = 160 - (pUseful / (pMax * 1.25 || 1)) * 140;
    return { x: svgX, y: svgY };
  }, [rLoad, rTh, pUseful, pMax]);

  const isMatched = Math.abs(rLoad - rTh) < 0.1;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-b from-card/95 to-card/75 overflow-hidden shadow-xl p-4 sm:p-6 md:p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Simulateur d&apos;Adaptation d&apos;Impédance & Transfert Maximal
            </h3>
            <p className="text-xs text-muted-foreground">
              Vérification expérimentale du théorème : <LatexMath math="P_{u,\max} \iff R_{\text{charge}} = r_s" />
            </p>
          </div>
        </div>

        {/* Matched Badge */}
        {isMatched ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptation Parfaite (<LatexMath math="R = r_s" />)
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Désadapté ({rLoad > rTh ? "R > r (Haut rendement)" : "R < r (Fortes pertes)"})
          </div>
        )}
      </div>

      {/* ── Main Layout: Controls & Graph ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sliders & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* E0 Slider */}
          <div className="p-3.5 rounded-xl bg-card/70 border border-border/60 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">f.é.m à vide <LatexMath math="E_0" /></span>
              <span className="text-indigo-400 font-mono">{eTh} V</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="1"
              value={eTh}
              onChange={(e) => setETh(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          {/* r_s Internal Resistance */}
          <div className="p-3.5 rounded-xl bg-card/70 border border-border/60 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Résistance interne <LatexMath math="r_s" /></span>
              <span className="text-rose-400 font-mono">{rTh} Ω</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={rTh}
              onChange={(e) => setRTh(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          {/* R_load Load Resistance */}
          <div className="p-3.5 rounded-xl bg-card/70 border border-border/60 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Résistance de charge <LatexMath math="R_{\text{ch}}" /></span>
              <span className="text-emerald-400 font-mono">{rLoad.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="0.5"
              max={Math.max(20, rTh * 4)}
              step="0.5"
              value={rLoad}
              onChange={(e) => setRLoad(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setRLoad(rTh)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
              >
                Ajuster automatiquement à <LatexMath math={`R = ${rTh}\\;\\Omega`} />
              </button>
            </div>
          </div>

          {/* Real-time metrics grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400">Puissance Utile <LatexMath math="P_u" /></div>
              <div className="text-lg font-black text-emerald-300 font-mono">{pUseful.toFixed(2)} W</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="text-[10px] uppercase font-bold text-rose-400">Pertes Joule <LatexMath math="P_{\text{Joule}}" /></div>
              <div className="text-lg font-black text-rose-300 font-mono">{pLoss.toFixed(2)} W</div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <div className="text-[10px] uppercase font-bold text-cyan-400">Courant Débité <LatexMath math="I" /></div>
              <div className="text-lg font-black text-cyan-300 font-mono">{current.toFixed(2)} A</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400">Rendement <LatexMath math="\eta" /></div>
              <div className="text-lg font-black text-amber-300 font-mono">{efficiency.toFixed(1)} %</div>
            </div>
          </div>
        </div>

        {/* Dynamic Curve Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Courbe <LatexMath math="P_u = f(R_{\text{ch}})" />
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Pic théorique : <LatexMath math={`P_{u,\\max} = ${pMax.toFixed(2)}\\text{ W}`} />
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full aspect-[16/9] sm:h-[220px] relative">
            <svg viewBox="0 0 360 180" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="30" y2="160" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="160" x2="350" y2="160" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="90" x2="350" y2="90" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Peak Marker Vertical Line */}
              {(() => {
                const maxR = Math.max(20, rTh * 4);
                const peakX = 30 + (rTh / maxR) * 310;
                return (
                  <line
                    x1={peakX}
                    y1="20"
                    x2={peakX}
                    y2="160"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                );
              })()}

              {/* Curve Line */}
              <path
                d={pathData}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Dynamic Operating Dot */}
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="6"
                fill={isMatched ? "#f59e0b" : "#38bdf8"}
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />

              {/* Axis Labels */}
              <text x="350" y="175" fill="#94a3b8" fontSize="10" textAnchor="end">
                R (Ω)
              </text>
              <text x="15" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle">
                P (W)
              </text>
            </svg>
          </div>

          {/* Physics takeaway note */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            💡 <strong>Règle d&apos;or :</strong> Quand <LatexMath math="R_{\text{ch}} = r_s" />, la puissance fournie à la charge est <strong>maximale</strong>, mais le rendement est exactement de <LatexMath math="\eta = 50\%" /> (50% de l&apos;énergie est gaspillée dans la source en chaleur).
          </div>
        </div>
      </div>
    </div>
  );
}
