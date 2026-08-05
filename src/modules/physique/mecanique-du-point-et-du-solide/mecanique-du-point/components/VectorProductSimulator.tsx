"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import { Zap } from "lucide-react";

export default function VectorProductSimulator() {
  const [normU, setNormU] = useState(4.0);
  const [normV, setNormV] = useState(3.4);
  const [angleDeg, setAngleDeg] = useState(45);

  const angleRad = (angleDeg * Math.PI) / 180;
  
  // Produit Scalaire
  const dotProduct = normU * normV * Math.cos(angleRad);
  
  // Produit Vectoriel (Norme)
  const crossProductNorm = normU * normV * Math.sin(angleRad);

  // SVG Diagram Coordinates (Slender & Elegant)
  const scale = 18; // pixels per unit
  const originX = 50;
  const originY = 130;

  // Vector U along horizontal
  const ux = originX + normU * scale;
  const uy = originY;

  // Vector V rotated by angleDeg
  const vx = originX + normV * scale * Math.cos(angleRad);
  const vy = originY - normV * scale * Math.sin(angleRad);

  // Projection of V onto U
  const projX = originX + normV * scale * Math.cos(angleRad);
  const projY = originY;

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl my-6 w-full max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white leading-tight">
              Simulateur Vectoriel Interactif (Produit Scalaire & Vectoriel)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Faites varier les longueurs et l'angle θ pour observer les résultats en temps réel
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-cyan-400 font-mono font-bold self-start sm:self-auto">
          θ = {angleDeg}°
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* SVG Vector Interactive Diagram - Slender Vectors & Sharp Arrow Heads */}
        <div className="md:col-span-6 bg-slate-900/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
          <svg width="100%" height="180" viewBox="0 0 240 160" className="w-full max-w-[280px] overflow-visible">
            {/* Fine Grid Axes */}
            <line x1="10" y1={originY} x2="230" y2={originY} stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1={originX} y1="10" x2={originX} y2="150" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />

            {/* Projection Line */}
            <line x1={vx} y1={vy} x2={projX} y2={projY} stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />

            {/* Angle Arc */}
            <path
              d={`M ${originX + 22} ${originY} A 22 22 0 0 0 ${originX + 22 * Math.cos(angleRad)} ${originY - 22 * Math.sin(angleRad)}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <text x={originX + 28} y={originY - 8} fill="#f59e0b" fontSize="10" fontWeight="bold">θ</text>

            {/* Vector U (Cyan) - Slender line (strokeWidth=2) */}
            <line x1={originX} y1={originY} x2={ux} y2={uy} stroke="#38bdf8" strokeWidth="2" markerEnd="url(#sharpArrowU)" />
            <text x={ux + 5} y={uy + 4} fill="#38bdf8" fontSize="11" fontWeight="bold">u</text>

            {/* Vector V (Purple) - Slender line (strokeWidth=2) */}
            <line x1={originX} y1={originY} x2={vx} y2={vy} stroke="#c084fc" strokeWidth="2" markerEnd="url(#sharpArrowV)" />
            <text x={vx + (vx >= originX ? 5 : -12)} y={vy - 4} fill="#c084fc" fontSize="11" fontWeight="bold">v</text>

            {/* Vector Cross Product Result (Rose Upward) */}
            <line x1={originX} y1={originY} x2={originX} y2={Math.max(15, originY - crossProductNorm * 8)} stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3,2" markerEnd="url(#sharpArrowCross)" />
            <text x={originX + 6} y={Math.max(20, originY - crossProductNorm * 8 + 4)} fill="#f43f5e" fontSize="10" fontWeight="extrabold">u ∧ v</text>

            {/* Sharp, Slender Arrow Head Markers */}
            <defs>
              <marker id="sharpArrowU" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
              <marker id="sharpArrowV" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#c084fc" />
              </marker>
              <marker id="sharpArrowCross" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f43f5e" />
              </marker>
            </defs>
          </svg>
          <span className="text-[11px] text-slate-400 mt-2 font-mono text-center">
            {angleDeg === 90 ? "⚠️ Vectors Orthogonaux (u ⊥ v => u · v = 0)" : angleDeg === 0 || angleDeg === 180 ? "⚠️ Vectors Colinéaires (u // v => u ∧ v = 0)" : `Angle θ = ${angleDeg}°`}
          </span>
        </div>

        {/* Live Calculation Results */}
        <div className="md:col-span-6 space-y-3">
          
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-400">Produit Scalaire (u · v):</span>
              <span className="text-sm font-black font-mono text-cyan-300">{dotProduct.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              <LatexMath math={`\\vec{u} \\cdot \\vec{v} = ${normU} \\times ${normV} \\times \\cos(${angleDeg}^\\circ) = ${dotProduct.toFixed(2)}`} />
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-400">Norme du Produit Vectoriel (||u ∧ v||):</span>
              <span className="text-sm font-black font-mono text-rose-300">{crossProductNorm.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              <LatexMath math={`\\|\\vec{u} \\wedge \\vec{v}\\| = ${normU} \\times ${normV} \\times \\sin(${angleDeg}^\\circ) = ${crossProductNorm.toFixed(2)}`} />
            </p>
          </div>

        </div>

      </div>

      {/* Sliders Controls Panel - Slender H-1.5 Tracks */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1.5">
            <span>Longueur ||u||:</span>
            <span className="text-cyan-400 font-extrabold">{normU.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={normU}
            onChange={(e) => setNormU(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1.5">
            <span>Longueur ||v||:</span>
            <span className="text-purple-400 font-extrabold">{normV.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={normV}
            onChange={(e) => setNormV(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1.5">
            <span>Angle Entre Vectors (θ):</span>
            <span className="text-amber-400 font-extrabold">{angleDeg}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="180"
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

    </div>
  );
}
