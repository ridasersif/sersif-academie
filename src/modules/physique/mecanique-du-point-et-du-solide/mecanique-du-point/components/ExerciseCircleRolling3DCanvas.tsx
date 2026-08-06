"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Pause, RotateCcw, BookOpen, ChevronDown, ChevronUp, CheckCircle2, HelpCircle, FileText } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function ExerciseCircleRolling3DCanvas() {
  // Mode: "FIXED" (Tableau) vs "ANIMATED" (Mouvement 2D)
  const [mode, setMode] = useState<"FIXED" | "ANIMATED">("FIXED");
  const [omega, setOmega] = useState<number>(1.2); // Vitesse angulaire w (rad/s)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  
  // Solution hidden by default so students solve it first!
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Animation time state for 2D animated mode (60fps smooth loop)
  const [animTime, setAnimTime] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const omegaRef = useRef<number>(omega);
  const trail2DRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    omegaRef.current = omega;
  }, [omega]);

  // Ultra-Smooth 60 FPS Animation loop
  useEffect(() => {
    if (mode !== "ANIMATED") return;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (isPlayingRef.current) {
        timeRef.current += delta * omegaRef.current * 0.75;
        setAnimTime(timeRef.current);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  const handleReset = () => {
    timeRef.current = 0;
    setAnimTime(0);
    trail2DRef.current = [];
  };

  // --- 2D Animated Geometry Scale (Compact 460x270 ViewBox, ZERO wasted space!) ---
  const R_anim = 42;
  const thetaAnim = animTime;
  const O_anim = { x: 180, y: 135 }; // Centered tightly in viewBox 0 0 460 270

  const O1_anim = {
    x: O_anim.x + R_anim * Math.cos(thetaAnim),
    y: O_anim.y - R_anim * Math.sin(thetaAnim),
  };

  const A_anim = {
    x: O_anim.x + 2 * R_anim * Math.cos(thetaAnim),
    y: O_anim.y - 2 * R_anim * Math.sin(thetaAnim),
  };

  const ux1_anim = { x: Math.cos(thetaAnim), y: -Math.sin(thetaAnim) };
  const uy1_anim = { x: -Math.sin(thetaAnim), y: -Math.cos(thetaAnim) };

  const relAngleAnim = animTime;
  const M_anim = {
    x: O1_anim.x + R_anim * (ux1_anim.x * Math.cos(relAngleAnim) + uy1_anim.x * Math.sin(relAngleAnim)),
    y: O1_anim.y + R_anim * (ux1_anim.y * Math.cos(relAngleAnim) + uy1_anim.y * Math.sin(relAngleAnim)),
  };

  // Update 2D trail points for Cardioid dynamically behind M (with ZERO line jump artifacts!)
  useEffect(() => {
    if (mode === "ANIMATED" && isPlaying) {
      const trail = trail2DRef.current;
      if (trail.length === 0) {
        trail.push({ x: M_anim.x, y: M_anim.y });
      } else {
        const lastPt = trail[trail.length - 1];
        const dist = Math.hypot(lastPt.x - M_anim.x, lastPt.y - M_anim.y);
        
        if (dist > 12.0) {
          // Time wrapped or cycle reset -> Clear trail to prevent straight line artifacts!
          trail2DRef.current = [{ x: M_anim.x, y: M_anim.y }];
        } else if (dist > 1.8) {
          trail.push({ x: M_anim.x, y: M_anim.y });
          if (trail.length > 450) trail.shift();
        }
      }
    }
  }, [M_anim.x, M_anim.y, mode, isPlaying]);

  // Reset trail when mode switches to ANIMATED
  useEffect(() => {
    if (mode === "ANIMATED") {
      trail2DRef.current = [];
    }
  }, [mode]);

  // --- Fixed 2D Diagram Constants (Tight 440x260 ViewBox, Crisp & Large!) ---
  const R_fixed = 72; // Larger radius so diagram fills canvas tightly!
  const thetaFixed = (30 * Math.PI) / 180; // Angle 30 deg
  const O_fixed = { x: 75, y: 175 }; // Tight origin O near bottom-left

  const O1_fixed = {
    x: O_fixed.x + R_fixed * Math.cos(thetaFixed),
    y: O_fixed.y - R_fixed * Math.sin(thetaFixed),
  };
  const A_fixed = {
    x: O_fixed.x + 2 * R_fixed * Math.cos(thetaFixed),
    y: O_fixed.y - 2 * R_fixed * Math.sin(thetaFixed),
  };
  const ux1_fixed = { x: Math.cos(thetaFixed), y: -Math.sin(thetaFixed) };
  const uy1_fixed = { x: -Math.sin(thetaFixed), y: -Math.cos(thetaFixed) };

  const M_fixed = {
    x: O1_fixed.x + R_fixed * (ux1_fixed.x * Math.cos(thetaFixed) + uy1_fixed.x * Math.sin(thetaFixed)),
    y: O1_fixed.y + R_fixed * (ux1_fixed.y * Math.cos(thetaFixed) + uy1_fixed.y * Math.sin(thetaFixed)),
  };

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-2xl max-w-full overflow-hidden mb-5">
      
      {/* 1. TOP HEADER TITLE */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-lg font-black text-amber-400">
              Exercice 1
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400">
              Cinématique du Point • Composition des Vitesses & Accélérations
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
          Concours CPGE
        </span>
      </div>

      {/* 2. ÉNONCÉ DE L'EXERCICE (COMPACT & CLEAR AT THE TOP) */}
      <div className="mb-3 p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2 text-xs sm:text-sm font-sans shadow-md">
        <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-1.5 text-xs sm:text-sm">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>Énoncé de l'Exercice (Du Tableau) :</span>
        </div>
        
        <p className="text-slate-300 leading-normal font-mono text-[11px] sm:text-xs">
          Dans le plan <LatexMath math="(Oxy)" />, un cercle de diamètre <LatexMath math="OA = 2R" /> tourne à vitesse angulaire constante <LatexMath math="\omega" /> autour de <LatexMath math="O" />.<br />
          On lie à son centre mobile <LatexMath math="O_1" />, 2 axes <LatexMath math="(O_1 x_1)" /> et <LatexMath math="(O_1 y_1)" />. Un point <LatexMath math="M" />, initialement en <LatexMath math="A" />, parcourt le cercle à la même vitesse angulaire <LatexMath math="\omega" />.
        </p>

        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-200 font-mono text-[10.5px] sm:text-xs">
          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[9px] flex-shrink-0">1</span>
            <span>Exprimer <LatexMath math="\vec{OO}_1" /> et <LatexMath math="\vec{O_1 M}" /> dans <LatexMath math="(\vec{i}_1, \vec{j}_1)" />.</span>
          </div>

          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[9px] flex-shrink-0">2</span>
            <span>Déterminer <LatexMath math="\vec{V}_r(M)" /> et <LatexMath math="\vec{V}_e(M)" />.</span>
          </div>

          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-[9px] flex-shrink-0">3</span>
            <span>Calculer l'accélération de Coriolis <LatexMath math="\vec{\gamma}_c(M)" />.</span>
          </div>

          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[9px] flex-shrink-0">4</span>
            <span>Déterminer la trajectoire (Cardioïde).</span>
          </div>
        </div>
      </div>

      {/* 3. MODE SELECTOR BAR (RIGHT ABOVE THE 2D DIAGRAM) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Schéma & Animation :</span>
        </span>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setMode("FIXED");
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              mode === "FIXED"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2D Schéma Fixe (Tableau)
          </button>

          <button
            onClick={() => {
              setMode("ANIMATED");
              setIsPlaying(true);
              trail2DRef.current = [];
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              mode === "ANIMATED"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2D Mouvement Animé
          </button>
        </div>
      </div>

      {/* 4. TIGHT HIGH-DEFINITION 2D SVG CANVAS CONTAINER */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-1 shadow-inner">
        <svg
          viewBox={mode === "FIXED" ? "0 0 440 260" : "0 0 460 270"}
          className="w-full max-w-xl h-auto drop-shadow-md"
        >
          <defs>
            {/* Blueprint Grid Pattern */}
            <pattern id="blueprintGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>

            {/* Neon Glow Filters */}
            <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Sleek Vector Arrowheads */}
            <marker id="arrowBlue" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#3b82f6" />
            </marker>
            <marker id="arrowPurple" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#a855f7" />
            </marker>
            <marker id="arrowSmallGreen" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="2.8" markerHeight="2.8" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#10b981" />
            </marker>
            <marker id="arrowSmallAmber" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="2.8" markerHeight="2.8" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#f59e0b" />
            </marker>
            <marker id="arrowSmallCyan" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="2.8" markerHeight="2.8" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Background Blueprint Grid */}
          <rect width="100%" height="100%" fill="url(#blueprintGrid)" />

          {mode === "FIXED" ? (
            /* ========================================================= */
            /* === MODE 1: 2D SCHEMA FIXE (TIGHT 440x260 VIEWBOX) === */
            /* ========================================================= */
            <g>
              {/* Fixed Frame R0(O, x, y) */}
              <line x1={O_fixed.x} y1={O_fixed.y} x2={O_fixed.x + 340} y2={O_fixed.y} stroke="#3b82f6" strokeWidth="1.8" markerEnd="url(#arrowBlue)" />
              <line x1={O_fixed.x} y1={O_fixed.y} x2={O_fixed.x} y2={O_fixed.y - 150} stroke="#3b82f6" strokeWidth="1.8" markerEnd="url(#arrowBlue)" />
              <text x={O_fixed.x + 328} y={O_fixed.y + 15} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">x</text>
              <text x={O_fixed.x - 16} y={O_fixed.y - 138} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">y</text>
              
              {/* Point O Badge */}
              <circle cx={O_fixed.x} cy={O_fixed.y} r="4" fill="#3b82f6" filter="url(#glowBlue)" />
              <text x={O_fixed.x - 16} y={O_fixed.y + 15} fill="#60a5fa" fontSize="13" fontWeight="bold" fontFamily="monospace">O</text>

              {/* Unit Vectors i and j */}
              <line x1={O_fixed.x} y1={O_fixed.y} x2={O_fixed.x + 28} y2={O_fixed.y} stroke="#10b981" strokeWidth="1.8" markerEnd="url(#arrowSmallGreen)" />
              <text x={O_fixed.x + 12} y={O_fixed.y + 15} fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">i</text>

              <line x1={O_fixed.x} y1={O_fixed.y} x2={O_fixed.x} y2={O_fixed.y - 28} stroke="#10b981" strokeWidth="1.8" markerEnd="url(#arrowSmallGreen)" />
              <text x={O_fixed.x - 14} y={O_fixed.y - 10} fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">j</text>

              {/* Circle centered at O1 passing through O */}
              <circle cx={O1_fixed.x} cy={O1_fixed.y} r={R_fixed} fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.9" />
              <circle cx={O1_fixed.x} cy={O1_fixed.y} r="3.5" fill="#c084fc" />
              <text x={O1_fixed.x - 12} y={O1_fixed.y + 16} fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace">O1</text>

              {/* Diameter Line OA (carrying x1 axis) */}
              <line
                x1={O_fixed.x}
                y1={O_fixed.y}
                x2={O1_fixed.x + 130 * ux1_fixed.x}
                y2={O1_fixed.y + 130 * ux1_fixed.y}
                stroke="#a855f7" strokeWidth="1.6" markerEnd="url(#arrowPurple)"
              />
              <text
                x={O1_fixed.x + 138 * ux1_fixed.x}
                y={O1_fixed.y + 138 * ux1_fixed.y + 4}
                fill="#c084fc" fontSize="13" fontWeight="bold" fontFamily="monospace"
              >
                x1
              </text>

              {/* Axis y1 perpendicular at O1 */}
              <line
                x1={O1_fixed.x - 35 * uy1_fixed.x}
                y1={O1_fixed.y - 35 * uy1_fixed.y}
                x2={O1_fixed.x + 110 * uy1_fixed.x}
                y2={O1_fixed.y + 110 * uy1_fixed.y}
                stroke="#a855f7" strokeWidth="1.6" strokeDasharray="4,2" markerEnd="url(#arrowPurple)"
              />
              <text
                x={O1_fixed.x + 116 * uy1_fixed.x - 4}
                y={O1_fixed.y + 116 * uy1_fixed.y}
                fill="#c084fc" fontSize="13" fontWeight="bold" fontFamily="monospace"
              >
                y1
              </text>

              {/* Unit Vectors i1 and j1 in mobile frame */}
              <line x1={O1_fixed.x} y1={O1_fixed.y} x2={O1_fixed.x + 24 * ux1_fixed.x} y2={O1_fixed.y + 24 * ux1_fixed.y} stroke="#10b981" strokeWidth="1.8" markerEnd="url(#arrowSmallGreen)" />
              <text x={O1_fixed.x + 24 * ux1_fixed.x + 2} y={O1_fixed.y + 24 * ux1_fixed.y + 12} fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">i1</text>

              <line x1={O1_fixed.x} y1={O1_fixed.y} x2={O1_fixed.x + 24 * uy1_fixed.x} y2={O1_fixed.y + 24 * uy1_fixed.y} stroke="#10b981" strokeWidth="1.8" markerEnd="url(#arrowSmallGreen)" />
              <text x={O1_fixed.x + 24 * uy1_fixed.x - 12} y={O1_fixed.y + 24 * uy1_fixed.y} fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">j1</text>

              {/* Point A (End of Diameter OA) */}
              <circle cx={A_fixed.x} cy={A_fixed.y} r="4" fill="#f59e0b" filter="url(#glowGold)" />
              <text x={A_fixed.x + 8} y={A_fixed.y + 14} fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace">A</text>

              {/* Line O1 -> M */}
              <line x1={O1_fixed.x} y1={O1_fixed.y} x2={M_fixed.x} y2={M_fixed.y} stroke="#a855f7" strokeWidth="1.6" />

              {/* Point M on circle */}
              <circle cx={M_fixed.x} cy={M_fixed.y} r="5.5" fill="#38bdf8" filter="url(#glowCyan)" />
              <text x={M_fixed.x + 8} y={M_fixed.y - 6} fill="#38bdf8" fontSize="14" fontWeight="black" fontFamily="monospace">M</text>

              {/* Angle theta arc at Origin O */}
              <path
                d={`M ${O_fixed.x + 36},${O_fixed.y} A 36 36 0 0 0 ${O_fixed.x + 36 * Math.cos(thetaFixed)},${O_fixed.y - 36 * Math.sin(thetaFixed)}`}
                fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowSmallAmber)"
              />
              <text x={O_fixed.x + 44 * Math.cos(thetaFixed / 2)} y={O_fixed.y - 44 * Math.sin(thetaFixed / 2)} fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">θ</text>

              {/* Angle theta arc at Center O1 */}
              <path
                d={`M ${O1_fixed.x + 24 * ux1_fixed.x},${O1_fixed.y + 24 * ux1_fixed.y} A 24 24 0 0 0 ${O1_fixed.x + 24 * Math.cos(2 * thetaFixed)},${O1_fixed.y - 24 * Math.sin(2 * thetaFixed)}`}
                fill="none" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowSmallAmber)"
              />
              <text x={O1_fixed.x + 32 * Math.cos(1.5 * thetaFixed)} y={O1_fixed.y - 32 * Math.sin(1.5 * thetaFixed)} fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">θ</text>
            </g>
          ) : (
            /* ========================================================= */
            /* === MODE 2: 2D MOUVEMENT ANIMÉ (CLEAN TRAIL NO ARTIFACTS) === */
            /* ========================================================= */
            <g>
              {/* Fixed Frame R0(O, x, y) Centered Tightly */}
              <line x1={O_anim.x - 120} y1={O_anim.y} x2={O_anim.x + 260} y2={O_anim.y} stroke="#3b82f6" strokeWidth="1.6" markerEnd="url(#arrowBlue)" />
              <line x1={O_anim.x} y1={O_anim.y + 130} x2={O_anim.x} y2={O_anim.y - 130} stroke="#3b82f6" strokeWidth="1.6" markerEnd="url(#arrowBlue)" />
              <text x={O_anim.x + 248} y={O_anim.y + 16} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">x</text>
              <text x={O_anim.x - 16} y={O_anim.y - 118} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">y</text>
              <circle cx={O_anim.x} cy={O_anim.y} r="4" fill="#3b82f6" filter="url(#glowBlue)" />
              <text x={O_anim.x - 16} y={O_anim.y + 15} fill="#60a5fa" fontSize="13" fontWeight="bold" fontFamily="monospace">O</text>

              {/* Dynamic Real-time Glowing Full Cardioid Trail */}
              {trail2DRef.current.length > 1 && (
                <polyline
                  points={trail2DRef.current.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                  filter="url(#glowGold)"
                />
              )}

              {/* Circle centered at O1 */}
              <circle cx={O1_anim.x} cy={O1_anim.y} r={R_anim} fill="none" stroke="#a855f7" strokeWidth="1.8" />
              <circle cx={O1_anim.x} cy={O1_anim.y} r="3.5" fill="#c084fc" />
              <text x={O1_anim.x - 10} y={O1_anim.y + 15} fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace">O1</text>

              {/* Mobile Frame R1 Axes x1 and y1 */}
              <line
                x1={O1_anim.x - 30 * ux1_anim.x}
                y1={O1_anim.y - 30 * ux1_anim.y}
                x2={O1_anim.x + 100 * ux1_anim.x}
                y2={O1_anim.y + 100 * ux1_anim.y}
                stroke="#a855f7" strokeWidth="1.6" strokeDasharray="4,2" markerEnd="url(#arrowPurple)"
              />
              <line
                x1={O1_anim.x - 30 * uy1_anim.x}
                y1={O1_anim.y - 30 * uy1_anim.y}
                x2={O1_anim.x + 85 * uy1_anim.x}
                y2={O1_anim.y + 85 * uy1_anim.y}
                stroke="#a855f7" strokeWidth="1.6" strokeDasharray="4,2" markerEnd="url(#arrowPurple)"
              />
              
              {/* x1 Label */}
              <text
                x={O1_anim.x + 108 * ux1_anim.x}
                y={O1_anim.y + 108 * ux1_anim.y + 4}
                fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace"
              >
                x1
              </text>

              {/* y1 Label */}
              <text
                x={O1_anim.x + 90 * uy1_anim.x - 4}
                y={O1_anim.y + 90 * uy1_anim.y}
                fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace"
              >
                y1
              </text>

              {/* Point A */}
              <circle cx={A_anim.x} cy={A_anim.y} r="3.5" fill="#f59e0b" filter="url(#glowGold)" />
              <text x={A_anim.x + 6} y={A_anim.y + 12} fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">A</text>

              {/* Point M on circle */}
              <circle cx={M_anim.x} cy={M_anim.y} r="5" fill="#38bdf8" filter="url(#glowCyan)" />
              <text x={M_anim.x + 8} y={M_anim.y - 5} fill="#38bdf8" fontSize="13" fontWeight="black" fontFamily="monospace">M</text>

              {/* Chasles Vectors OO1, O1M, OM */}
              <line x1={O_anim.x} y1={O_anim.y} x2={O1_anim.x} y2={O1_anim.y} stroke="#f59e0b" strokeWidth="2.0" markerEnd="url(#arrowSmallAmber)" />
              <line x1={O1_anim.x} y1={O1_anim.y} x2={M_anim.x} y2={M_anim.y} stroke="#10b981" strokeWidth="2.0" markerEnd="url(#arrowSmallGreen)" />
              <line x1={O_anim.x} y1={O_anim.y} x2={M_anim.x} y2={M_anim.y} stroke="#06b6d4" strokeWidth="2.2" markerEnd="url(#arrowSmallCyan)" filter="url(#glowCyan)" />
            </g>
          )}
        </svg>
      </div>

      {/* Controls Bar for Animated Mode */}
      {mode === "ANIMATED" && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Animer"}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span>Vitesse angulaire <LatexMath math="\omega" />:</span>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.2"
                value={omega}
                onChange={(e) => setOmega(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1.5 accent-amber-500 cursor-pointer rounded-lg bg-slate-800"
              />
              <span className="font-bold text-amber-400">{omega.toFixed(1)} rad/s</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. HIDDEN SOLUTION DRAWER AT THE VERY BOTTOM */}
      <div className="mt-3 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden shadow-lg">
        {/* Toggle Solution Header */}
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between p-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs sm:text-sm border-b border-slate-800/80 transition-all"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{showSolution ? "Masquer la Correction" : "Afficher la Solution Détaillée 📑"}</span>
          </span>
          {showSolution ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
        </button>

        {showSolution && (
          <div className="p-3.5 space-y-3 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed animate-in fade-in duration-200">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>1. Expression des Vecteurs Position :</span>
              </h4>
              <p>• Centre mobile : <LatexMath math="\vec{OO}_1 = R \vec{i}_1 = R\cos(\omega t)\vec{i} + R\sin(\omega t)\vec{j}" /></p>
              <p>• Position relative de <LatexMath math="M" /> dans <LatexMath math="\mathcal{R}_1" /> : <LatexMath math="\vec{O_1 M} = R\cos(\omega t)\vec{i}_1 + R\sin(\omega t)\vec{j}_1" /></p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2. Vitesse Relative <LatexMath math="\vec{V}_r(M)" /> et Vitesse d'Entraînement <LatexMath math="\vec{V}_e(M)" /> :</span>
              </h4>
              <p>Dérivée par rapport au temps dans le repère mobile <LatexMath math="\mathcal{R}_1" /> :</p>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-bold text-center">
                <LatexMath math="\vec{V}_r(M) = \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_1} = -R\omega\sin(\omega t)\vec{i}_1 + R\omega\cos(\omega t)\vec{j}_1" />
              </div>
              <p>Vitesse d'entraînement :</p>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-bold text-center">
                <LatexMath math="\vec{V}_e(M) = -R\omega\sin(\omega t)\vec{i}_1 + R\omega(1 + \cos\omega t)\vec{j}_1" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <h4 className="font-bold text-rose-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>3. Accélération de Coriolis <LatexMath math="\vec{\gamma}_c(M)" /> :</span>
              </h4>
              <p><LatexMath math="\vec{\gamma}_c(M) = 2 \vec{\Omega} \wedge \vec{V}_r(M) = 2(\omega\vec{k}) \wedge [-R\omega\sin(\omega t)\vec{i}_1 + R\omega\cos(\omega t)\vec{j}_1]" /></p>
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-center">
                <LatexMath math="\vec{\gamma}_c(M) = -2R\omega^2\cos(\omega t)\vec{i}_1 - 2R\omega^2\sin(\omega t)\vec{j}_1 = -2\omega^2 \vec{O_1 M}" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <h4 className="font-bold text-purple-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>4. Trajectoire Absolue (Cardioïde) :</span>
              </h4>
              <p>Dans la base fixe <LatexMath math="(\vec{i}, \vec{j})" /> :</p>
              <p><LatexMath math="x(t) = R\cos(\omega t) + R\cos(2\omega t) \,,\quad y(t) = R\sin(\omega t) + R\sin(2\omega t)" /></p>
              <p className="text-amber-300 font-bold">La courbe engendrée par le point $M$ est une Cardioïde.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
