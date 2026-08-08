import React from 'react';
import LatexMath from './LatexMath';

export interface Point {
  x: number;
  y: number;
}

export interface LineData {
  points: Point[];
  color: string;
  dashed?: boolean;
}

export interface Tick {
  x: number;
  label: string; // can be LaTeX
}

interface ChartProps {
  lines: LineData[];
  domainX: [number, number];
  domainY: [number, number];
  xAxisLabel: string;
  yAxisLabel: string;
  ticks: Tick[];
  title?: string;
  themeColor?: "emerald" | "blue" | "pink" | "amber" | "purple" | "cyan";
}

const themeStyles: Record<string, { container: string, title: string }> = {
  emerald: { container: "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]", title: "text-emerald-400" },
  blue: { container: "bg-blue-950/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]", title: "text-blue-400" },
  pink: { container: "bg-pink-950/20 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.1)]", title: "text-pink-400" },
  amber: { container: "bg-amber-950/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]", title: "text-amber-400" },
  purple: { container: "bg-purple-950/20 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]", title: "text-purple-400" },
  cyan: { container: "bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]", title: "text-cyan-400" },
};

export default function MagneticFieldChart({ lines, domainX, domainY, xAxisLabel, yAxisLabel, ticks, title, themeColor = "emerald" }: ChartProps) {
  // SVG dimensions
  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scaleX = (x: number) => padding.left + ((x - domainX[0]) / (domainX[1] - domainX[0])) * innerWidth;
  const scaleY = (y: number) => padding.top + innerHeight - ((y - domainY[0]) / (domainY[1] - domainY[0])) * innerHeight;

  const styles = themeStyles[themeColor];

  return (
    <div className={`w-full rounded-2xl p-4 border flex flex-col ${styles.container}`}>
      {title && <h4 className={`text-center font-bold mb-4 text-sm ${styles.title}`}>{title}</h4>}
      
      <div className="relative w-full aspect-[2.5] md:aspect-[3.5] max-h-[250px] select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Ticks & Dashed Lines */}
          {ticks.map((tick, i) => (
            <g key={i}>
              <line x1={scaleX(tick.x)} y1={scaleY(0)} x2={scaleX(tick.x)} y2={scaleY(domainY[1])} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <foreignObject x={scaleX(tick.x) - 15} y={scaleY(0) + 5} width="30" height="30">
                <div className="w-full h-full flex justify-center items-start text-[11px] text-slate-300 font-bold">
                  <LatexMath math={tick.label} block={false} />
                </div>
              </foreignObject>
            </g>
          ))}

          {/* Axes */}
          <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(domainX[1])} y2={scaleY(0)} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(0)} y2={scaleY(domainY[1])} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Data Lines */}
          {lines.map((line, i) => {
            const pathData = line.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
            return (
              <path 
                key={i} 
                d={pathData} 
                stroke={line.color} 
                strokeWidth="3.5" 
                fill="none" 
                strokeDasharray={line.dashed ? "6 6" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
            );
          })}

          {/* Axis Labels */}
          <foreignObject x={scaleX(domainX[1]) + 5} y={scaleY(0) - 15} width="30" height="30">
            <div className="w-full h-full flex justify-start items-center text-xs text-slate-400 font-bold">
              <LatexMath math={xAxisLabel} block={false} />
            </div>
          </foreignObject>

          <foreignObject x={scaleX(0) - 35} y={scaleY(domainY[1]) - 25} width="35" height="30">
            <div className="w-full h-full flex justify-center items-center text-xs text-slate-400 font-bold">
              <LatexMath math={yAxisLabel} block={false} />
            </div>
          </foreignObject>

        </svg>
      </div>
    </div>
  );
}
