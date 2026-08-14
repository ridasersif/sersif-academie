"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";

export default function VectorPotentialCurves() {
  const [R, setR] = useState(2);
  const [j0, setJ0] = useState(1);
  
  // Dimensions for SVG
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  
  const maxRho = 6;
  const numPoints = 100;
  const A0 = 5; // Base value for A

  // Calculate points
  const pointsB = [];
  const pointsA = [];
  
  let maxB = 0;
  let maxA = A0;
  let minA = 0; // It goes negative
  
  for (let i = 0; i <= numPoints; i++) {
    const rho = (i / numPoints) * maxRho;
    
    // B calculation
    const bVal = rho <= R ? (j0 * rho) / 2 : (j0 * R * R) / (2 * rho);
    if (bVal > maxB) maxB = bVal;
    
    // A calculation
    let aVal = 0;
    if (rho <= R) {
      aVal = A0 - (j0 * rho * rho) / 4;
    } else {
      aVal = A0 - (j0 * R * R) / 4 - (j0 * R * R / 2) * Math.log(rho / R);
    }
    if (aVal < minA) minA = aVal;
    
    pointsB.push({ rho, val: bVal });
    pointsA.push({ rho, val: aVal });
  }

  // Scaling functions
  const scaleX = (rho: number) => padding.left + (rho / maxRho) * graphWidth;
  
  // We use separate Y scales for B and A, or a unified one.
  // A unified one is better to see relative scales, but they have different units.
  // Let's use separate scales visually mapped to the same box, or normalized.
  // To avoid confusion, we map them independently to the height.
  const scaleY_B = (b: number) => padding.top + graphHeight - (b / (maxB * 1.2 || 1)) * graphHeight;
  const scaleY_A = (a: number) => {
    const totalRange = maxA - Math.min(-2, minA);
    return padding.top + graphHeight - ((a - Math.min(-2, minA)) / totalRange) * graphHeight;
  };

  // Generate SVG path strings
  const pathB = pointsB.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.rho)} ${scaleY_B(p.val)}`).join(" ");
  const pathA = pointsA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.rho)} ${scaleY_A(p.val)}`).join(" ");

  return (
    <div className="flex flex-col gap-6 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-3xl mx-auto shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          Courbes de <LatexMath math="B(\rho)" /> et <LatexMath math="A(\rho)" />
        </h3>
        <div className="flex gap-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
          <div className="flex flex-col gap-1 w-24">
            <label className="text-[10px] text-slate-400 font-bold">Rayon <LatexMath math="R" /></label>
            <input type="range" min="0.5" max="4" step="0.1" value={R} onChange={(e) => setR(parseFloat(e.target.value))} className="accent-slate-400 h-1.5" />
          </div>
          <div className="flex flex-col gap-1 w-24">
            <label className="text-[10px] text-slate-400 font-bold">Courant <LatexMath math="j_0" /></label>
            <input type="range" min="0.5" max="3" step="0.1" value={j0} onChange={(e) => setJ0(parseFloat(e.target.value))} className="accent-red-500 h-1.5" />
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-slate-700">
        <svg width={width} height={height} className="min-w-[500px]">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line key={`h-${ratio}`} x1={padding.left} y1={padding.top + ratio * graphHeight} x2={width - padding.right} y2={padding.top + ratio * graphHeight} stroke="#1e293b" strokeWidth="1" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <g key={`v-${r}`}>
              <line x1={scaleX(r)} y1={padding.top} x2={scaleX(r)} y2={height - padding.bottom} stroke="#1e293b" strokeWidth="1" />
              <text x={scaleX(r)} y={height - 20} fill="#64748b" fontSize="10" textAnchor="middle">{r}</text>
            </g>
          ))}
          
          {/* Axes */}
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#94a3b8" strokeWidth="2" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right + 10} y2={height - padding.bottom} stroke="#94a3b8" strokeWidth="2" />
          
          <text x={width - 5} y={height - 25} fill="#94a3b8" fontSize="12" fontStyle="italic">ρ</text>

          {/* R boundary line */}
          <line x1={scaleX(R)} y1={padding.top} x2={scaleX(R)} y2={height - padding.bottom} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x={scaleX(R) + 5} y={padding.top + 10} fill="#64748b" fontSize="11" fontWeight="bold">ρ = R</text>
          
          {/* Curve A */}
          <path d={pathA} fill="none" stroke="#22c55e" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          
          {/* Curve B */}
          <path d={pathB} fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />

          {/* Legend */}
          <g transform={`translate(${width - 100}, ${padding.top})`}>
            <rect x="0" y="0" width="80" height="50" fill="#020617" stroke="#334155" rx="4" />
            <line x1="10" y1="15" x2="30" y2="15" stroke="#3b82f6" strokeWidth="3" />
            <text x="35" y="19" fill="#3b82f6" fontSize="12" fontWeight="bold" fontStyle="italic">B(ρ)</text>
            <line x1="10" y1="35" x2="30" y2="35" stroke="#22c55e" strokeWidth="3" />
            <text x="35" y="39" fill="#22c55e" fontSize="12" fontWeight="bold" fontStyle="italic">A(ρ)</text>
          </g>
        </svg>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-blue-200">
          <p className="font-bold mb-1 text-blue-400">Champ Magnétique B</p>
          <ul className="list-disc list-inside opacity-80 text-xs space-y-1">
            <li>Linéaire (augmente) à l'intérieur.</li>
            <li>En <LatexMath math="1/\rho" /> (décroît) à l'extérieur.</li>
            <li>Maximum à la surface <LatexMath math="\rho = R" />.</li>
          </ul>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-green-200">
          <p className="font-bold mb-1 text-green-400">Potentiel Vecteur A</p>
          <ul className="list-disc list-inside opacity-80 text-xs space-y-1">
            <li>Parabole inversée à l'intérieur.</li>
            <li>Logarithmique (décroît lentement) à l'extérieur.</li>
            <li>La dérivée de A donne l'allure de B.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
