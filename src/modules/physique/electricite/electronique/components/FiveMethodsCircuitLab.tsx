'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, 
  Play, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Sparkles 
} from 'lucide-react';
import LatexMath from '@/components/ui/LatexMath';

export function FiveMethodsCircuitLab() {
  // Circuit Parameters
  const [E1, setE1] = useState<number>(12); // Volts
  const [R1, setR1] = useState<number>(10); // Ohms
  const [E2, setE2] = useState<number>(6);  // Volts
  const [R2, setR2] = useState<number>(20); // Ohms
  const [R, setR] = useState<number>(15);   // Ohms (Charge centrale)

  const [activeTab, setActiveTab] = useState<'kirchhoff' | 'superposition' | 'thevenin' | 'norton' | 'millman'>('kirchhoff');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Exact Electrical Calculations
  const calculations = useMemo(() => {
    const G1 = 1 / Math.max(0.1, R1);
    const G2 = 1 / Math.max(0.1, R2);
    const G = 1 / Math.max(0.1, R);

    // Potentiel au nœud A par Millman
    const VA = (E1 * G1 + E2 * G2) / (G1 + G2 + G);

    // Courants de branche
    const I1 = (E1 - VA) / R1;
    const I2 = (E2 - VA) / R2;
    const I = VA / R; // Courant traversant R

    // Puissance dissipée dans R
    const P = R * I * I;

    // Thévenin vu par R
    const Eth = (E1 * R2 + E2 * R1) / (R1 + R2);
    const Rth = (R1 * R2) / (R1 + R2);

    // Norton vu par R
    const IN = E1 / R1 + E2 / R2;
    const RN = Rth;

    return {
      VA,
      I1,
      I2,
      I,
      P,
      Eth,
      Rth,
      IN,
      RN,
      G1,
      G2,
      G
    };
  }, [E1, R1, E2, R2, R]);

  // Canvas Animation Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particleOffsetRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isSimulating) {
        particleOffsetRef.current = (particleOffsetRef.current + dt * 35) % 1000;
      }

      // Handle Retina / HiDPI
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Coordinates Layout (Compact & symmetrical)
      const padX = 55;
      const padY = 32;
      const w = width - 2 * padX;
      const h = height - 2 * padY;

      const xLeft = padX;
      const xMid = padX + w / 2;
      const xRight = padX + w;

      const yTop = padY + 8;
      const yBottom = padY + h - 8;

      // ── Helper to draw mathematical text with subscripts on canvas ──
      const drawMath = (
        main: string, 
        sub: string, 
        x: number, 
        y: number, 
        color = '#38bdf8', 
        size = 12,
        align: CanvasTextAlign = 'center'
      ) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        
        ctx.font = `italic bold ${size}px "Times New Roman", "KaTeX_Math", serif`;
        const mainWidth = ctx.measureText(main).width;
        
        if (!sub) {
          ctx.fillText(main, x, y);
        } else {
          let startX = x;
          if (align === 'center') startX = x - (mainWidth + size * 0.4) / 2;
          else if (align === 'right') startX = x - (mainWidth + size * 0.4);
          
          ctx.textAlign = 'left';
          ctx.fillText(main, startX, y);
          ctx.font = `italic bold ${Math.max(8, size * 0.7)}px "Times New Roman", "KaTeX_Math", serif`;
          ctx.fillText(sub, startX + mainWidth + 0.5, y + size * 0.28);
        }
        ctx.restore();
      };

      // 1. Draw Subtle Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Main Circuit Wires (Sky Blue)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Left Loop (C -> D -> A -> B -> C)
      ctx.beginPath();
      ctx.moveTo(xLeft, yBottom);
      ctx.lineTo(xLeft, yTop);
      ctx.lineTo(xMid, yTop);
      ctx.lineTo(xMid, yBottom);
      ctx.lineTo(xLeft, yBottom);
      ctx.stroke();

      // Right Loop (A -> C' -> D' -> B)
      ctx.beginPath();
      ctx.moveTo(xMid, yTop);
      ctx.lineTo(xRight, yTop);
      ctx.lineTo(xRight, yBottom);
      ctx.lineTo(xMid, yBottom);
      ctx.stroke();

      // 3. Draw Moving Current Particles (High-contrast red)
      const drawParticles = (
        p1: { x: number; y: number }, 
        p2: { x: number; y: number }, 
        currentVal: number, 
        color: string = '#f43f5e'
      ) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0 || Math.abs(currentVal) < 0.001) return;

        const speedFactor = Math.min(Math.abs(currentVal) * 1.6, 3.5);
        const sign = currentVal >= 0 ? 1 : -1;
        const spacing = 20;
        const count = Math.floor(dist / spacing);

        const progressBase = (particleOffsetRef.current * speedFactor * sign) % spacing;

        ctx.fillStyle = color;
        for (let i = 0; i <= count; i++) {
          const offset = (i * spacing + progressBase + spacing * 100) % dist;
          const px = p1.x + (dx / dist) * offset;
          const py = p1.y + (dy / dist) * offset;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Particles in Branch 1 (Left: C -> D -> A)
      drawParticles({ x: xLeft, y: yBottom }, { x: xLeft, y: yTop }, calculations.I1);
      drawParticles({ x: xLeft, y: yTop }, { x: xMid, y: yTop }, calculations.I1);

      // Particles in Branch 2 (Right: D' -> C' -> A if I2 entered from right)
      drawParticles({ x: xRight, y: yBottom }, { x: xRight, y: yTop }, -calculations.I2);
      drawParticles({ x: xRight, y: yTop }, { x: xMid, y: yTop }, -calculations.I2);

      // Particles in Center Branch (A -> B through R)
      drawParticles({ x: xMid, y: yTop }, { x: xMid, y: yBottom }, calculations.I, '#f43f5e');

      // 4. Draw Circuit Components & Measurements

      // ── Source E1 (Left vertical wire, centered) ──
      const yE1 = (yTop + yBottom) / 2;
      // Erase only the small dielectric gap between the two plates
      ctx.fillStyle = '#020617';
      ctx.fillRect(xLeft - 15, yE1 - 5, 30, 10);

      // Long positive plate (Top)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xLeft - 14, yE1 - 6);
      ctx.lineTo(xLeft + 14, yE1 - 6);
      ctx.stroke();

      // Short thick negative plate (Bottom)
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(xLeft - 7, yE1 + 6);
      ctx.lineTo(xLeft + 7, yE1 + 6);
      ctx.stroke();

      // Plus / Minus polarities (on the outside left)
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', xLeft - 16, yE1 - 10);
      ctx.fillText('−', xLeft - 16, yE1 + 14);

      // Long Voltage Arrow E1 (INSIDE Maille 1: running from C to D on the right of left wire)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xLeft + 20, yBottom - 18);
      ctx.lineTo(xLeft + 20, yTop + 36);
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(xLeft + 16, yTop + 42);
      ctx.lineTo(xLeft + 24, yTop + 42);
      ctx.lineTo(xLeft + 20, yTop + 34);
      ctx.closePath();
      ctx.fill();
      drawMath('E', '1', xLeft + 30, yE1, '#facc15', 12.5, 'left');

      // ── Resistor R1 (Top left wire) ──
      const xR1 = (xLeft + xMid) / 2 + 10;
      ctx.fillStyle = '#020617';
      ctx.fillRect(xR1 - 20, yTop - 7, 40, 14);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xR1 - 20, yTop - 7, 40, 14);

      // Resistor R1 Label (cleanly above the box)
      drawMath('R', '1', xR1, yTop - 14, '#38bdf8', 12, 'center');

      // Current I1 Arrow (Directly ON the wire between D and R1)
      const xWireI1 = (xLeft + xR1 - 20) / 2;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(xWireI1 - 3, yTop - 3.5);
      ctx.lineTo(xWireI1 - 3, yTop + 3.5);
      ctx.lineTo(xWireI1 + 4.5, yTop);
      ctx.closePath();
      ctx.fill();
      drawMath('I', '1', xWireI1, yTop - 11, '#f43f5e', 11, 'center');

      // Long Voltage Arrow U1 (INSIDE Maille 1: below the top-left wire, from A to D)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(xMid - 25, yTop + 20);
      ctx.lineTo(xLeft + 35, yTop + 20);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(xLeft + 41, yTop + 16.5);
      ctx.lineTo(xLeft + 41, yTop + 23.5);
      ctx.lineTo(xLeft + 33, yTop + 20);
      ctx.closePath();
      ctx.fill();
      drawMath('U', '1', (xLeft + xMid) / 2, yTop + 30, '#22c55e', 11, 'center');

      // ── Resistor R (Central vertical branch) ──
      const yR = (yTop + yBottom) / 2 + 10;
      ctx.fillStyle = '#020617';
      ctx.fillRect(xMid - 7, yR - 20, 14, 40);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(xMid - 7, yR - 20, 14, 40);

      drawMath('R', '', xMid + 16, yR, '#c084fc', 13, 'left');

      // Current I Arrow (Directly ON the central wire between A and R)
      const yWireI = (yTop + yR - 20) / 2;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(xMid - 3.5, yWireI - 3);
      ctx.lineTo(xMid + 3.5, yWireI - 3);
      ctx.lineTo(xMid, yWireI + 4.5);
      ctx.closePath();
      ctx.fill();
      drawMath('I', '', xMid + 14, yWireI, '#f43f5e', 11.5, 'left');

      // Long Voltage Arrow U (INSIDE Maille 1: from B to A, on the left of central branch)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(xMid - 20, yBottom - 18);
      ctx.lineTo(xMid - 20, yTop + 36);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(xMid - 24, yTop + 42);
      ctx.lineTo(xMid - 16, yTop + 42);
      ctx.lineTo(xMid - 20, yTop + 34);
      ctx.closePath();
      ctx.fill();
      drawMath('U', '', xMid - 28, (yTop + yBottom) / 2, '#22c55e', 11.5, 'right');

      // ── Resistor R2 (Top right wire) ──
      const xR2 = (xMid + xRight) / 2 - 10;
      ctx.fillStyle = '#020617';
      ctx.fillRect(xR2 - 20, yTop - 7, 40, 14);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(xR2 - 20, yTop - 7, 40, 14);

      // Resistor R2 Label (cleanly above the box)
      drawMath('R', '2', xR2, yTop - 14, '#38bdf8', 12, 'center');

      // Current I2 Arrow (Directly ON the wire between A and R2)
      const xWireI2 = (xMid + xR2 - 20) / 2;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(xWireI2 - 3, yTop - 3.5);
      ctx.lineTo(xWireI2 - 3, yTop + 3.5);
      ctx.lineTo(xWireI2 + 4.5, yTop);
      ctx.closePath();
      ctx.fill();
      drawMath('I', '2', xWireI2, yTop - 11, '#f43f5e', 11, 'center');

      // Long Voltage Arrow U2 (INSIDE Maille 2: below the top-right wire, from C' to A)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(xRight - 35, yTop + 20);
      ctx.lineTo(xMid + 25, yTop + 20);
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(xMid + 31, yTop + 16.5);
      ctx.lineTo(xMid + 31, yTop + 23.5);
      ctx.lineTo(xMid + 23, yTop + 20);
      ctx.closePath();
      ctx.fill();
      drawMath('U', '2', (xMid + xRight) / 2, yTop + 30, '#22c55e', 11, 'center');

      // ── Source E2 (Right vertical wire, centered) ──
      const yE2 = (yTop + yBottom) / 2;
      // Erase only the small dielectric gap between the two plates
      ctx.fillStyle = '#020617';
      ctx.fillRect(xRight - 15, yE2 - 5, 30, 10);

      // Long positive plate (Top)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(xRight - 14, yE2 - 6);
      ctx.lineTo(xRight + 14, yE2 - 6);
      ctx.stroke();

      // Short thick negative plate (Bottom)
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(xRight - 7, yE2 + 6);
      ctx.lineTo(xRight + 7, yE2 + 6);
      ctx.stroke();

      // Plus / Minus polarities (on the outside right)
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', xRight + 16, yE2 - 10);
      ctx.fillText('−', xRight + 16, yE2 + 14);

      // Long Voltage Arrow E2 (INSIDE Maille 2: running from D' to C' on the left of right wire)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xRight - 20, yBottom - 18);
      ctx.lineTo(xRight - 20, yTop + 36);
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(xRight - 24, yTop + 42);
      ctx.lineTo(xRight - 16, yTop + 42);
      ctx.lineTo(xRight - 20, yTop + 34);
      ctx.closePath();
      ctx.fill();
      drawMath('E', '2', xRight - 30, yE2, '#facc15', 12.5, 'right');

      // 5. Draw All Node Dots & Mathematical Labels: D, C, A, B, C', D'
      const drawNode = (x: number, y: number, main: string, sub: string, align: CanvasTextAlign, offX: number, offY: number, dotColor = '#38bdf8') => {
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        drawMath(main, sub, x + offX, y + offY, '#f8fafc', 13, align);
      };

      drawNode(xLeft, yTop, 'D', '', 'right', -8, -4);
      drawNode(xLeft, yBottom, 'C', '', 'right', -8, 4);
      drawNode(xMid, yTop, 'A', '', 'center', 0, -12, '#f43f5e');
      drawNode(xMid, yBottom, 'B', '', 'center', 0, 12, '#64748b');
      drawNode(xRight, yTop, "C'", '', 'left', 8, -4);
      drawNode(xRight, yBottom, "D'", '', 'left', 8, 4);

      // Mesh orientation symbols (Circular arrows in the center of each mesh)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⟲ ∑Uᵢ = 0 (Maille 1)', (xLeft + xMid) / 2, yBottom - 18);
      ctx.fillText('⟲ ∑Uᵢ = 0 (Maille 2)', (xMid + xRight) / 2, yBottom - 18);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [E1, R1, E2, R2, R, calculations, isSimulating]);

  return (
    <div className="space-y-4 w-full max-w-full font-sans">
      {/* ── INTERACTIVE CANVAS & CONTROLS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left: Interactive Dynamic Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          <div className="relative w-full h-[250px] sm:h-[270px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              className="w-full h-full block"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-slate-800 text-[9.5px] font-mono text-slate-300 flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Calcul en temps réel
            </div>
          </div>

          {/* Metrics HUD (Ultra-Sleek Glassmorphic Compact Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* VA Card */}
            <div className="py-1.5 px-2.5 rounded-xl bg-gradient-to-b from-cyan-950/40 to-slate-950/80 border border-cyan-500/30 backdrop-blur-md flex flex-col items-center justify-center shadow-sm hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                <LatexMath math="V_A" />
              </div>
              <span className="text-xs sm:text-[13px] font-black font-mono text-cyan-300 tracking-tight">
                {calculations.VA.toFixed(2)} V
              </span>
            </div>

            {/* I (Charge R) Card */}
            <div className="py-1.5 px-2.5 rounded-xl bg-gradient-to-b from-rose-950/40 to-slate-950/80 border border-rose-500/40 backdrop-blur-md flex flex-col items-center justify-center shadow-sm hover:border-rose-400/50 transition-all">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
                <LatexMath math="I \text{ (Charge } R)" />
              </div>
              <span className="text-xs sm:text-[13px] font-black font-mono text-rose-400 tracking-tight">
                {calculations.I.toFixed(3)} A
              </span>
            </div>

            {/* I1 (Branche 1) Card */}
            <div className="py-1.5 px-2.5 rounded-xl bg-gradient-to-b from-amber-950/40 to-slate-950/80 border border-amber-500/30 backdrop-blur-md flex flex-col items-center justify-center shadow-sm hover:border-amber-400/50 transition-all">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                <LatexMath math="I_1 \text{ (Branche 1)}" />
              </div>
              <span className="text-xs sm:text-[13px] font-black font-mono text-amber-300 tracking-tight">
                {calculations.I1.toFixed(3)} A
              </span>
            </div>

            {/* I2 (Branche 2) Card */}
            <div className="py-1.5 px-2.5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950/80 border border-indigo-500/30 backdrop-blur-md flex flex-col items-center justify-center shadow-sm hover:border-indigo-400/50 transition-all">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                <LatexMath math="I_2 \text{ (Branche 2)}" />
              </div>
              <span className="text-xs sm:text-[13px] font-black font-mono text-indigo-300 tracking-tight">
                {calculations.I2.toFixed(3)} A
              </span>
            </div>
          </div>
        </div>

        {/* Right: Parameter Sliders Panel (5 Cols) */}
        <div className="lg:col-span-5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2.5 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                Paramètres du Circuit
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono flex items-center gap-1 border border-slate-700"
                title={isSimulating ? 'Mettre en pause' : 'Démarrer animation'}
              >
                {isSimulating ? <Activity className="w-3 h-3 text-cyan-400 animate-spin" /> : <Play className="w-3 h-3 text-emerald-400" />}
                {isSimulating ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => {
                  setE1(12);
                  setR1(10);
                  setE2(6);
                  setR2(20);
                  setR(15);
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* E1 Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span className="font-mono text-amber-300 font-bold"><LatexMath math="E_1 \text{ (Source 1)}" /></span>
                <span className="font-mono font-bold text-amber-300">{E1} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={E1}
                onChange={(e) => setE1(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* R1 Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span className="font-mono text-cyan-300 font-bold"><LatexMath math="R_1 \text{ (Résistance 1)}" /></span>
                <span className="font-mono font-bold text-cyan-300">{R1} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={R1}
                onChange={(e) => setR1(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* E2 Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span className="font-mono text-amber-300 font-bold"><LatexMath math="E_2 \text{ (Source 2)}" /></span>
                <span className="font-mono font-bold text-amber-300">{E2} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={E2}
                onChange={(e) => setE2(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* R2 Slider */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span className="font-mono text-cyan-300 font-bold"><LatexMath math="R_2 \text{ (Résistance 2)}" /></span>
                <span className="font-mono font-bold text-cyan-300">{R2} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={R2}
                onChange={(e) => setR2(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Load Resistor R */}
            <div className="space-y-0.5 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span className="font-mono text-purple-300 font-bold"><LatexMath math="R \text{ (Charge Centrale)}" /></span>
                <span className="font-mono font-bold text-purple-300">{R} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={R}
                onChange={(e) => setR(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950 border border-purple-500/20 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="text-slate-400 font-mono"><LatexMath math="P_R \text{ (Puissance) :}" /></span>
            <span className="font-mono font-bold text-purple-300">{calculations.P.toFixed(3)} W ({ (calculations.P * 1000).toFixed(1) } mW)</span>
          </div>
        </div>
      </div>

      {/* ── 5 METHODS NAVIGATION TABS ── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
            Sélectionner la Méthode de Résolution :
          </h4>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'kirchhoff', label: '1°) Lois de Kirchhoff', color: 'border-cyan-500 text-cyan-300 bg-cyan-500/10' },
            { id: 'superposition', label: '2°) Superposition', color: 'border-amber-500 text-amber-300 bg-amber-500/10' },
            { id: 'thevenin', label: '3°) Théorème de Thévenin', color: 'border-emerald-500 text-emerald-300 bg-emerald-500/10' },
            { id: 'norton', label: '4°) Théorème de Norton', color: 'border-indigo-500 text-indigo-300 bg-indigo-500/10' },
            { id: 'millman', label: '5°) Théorème de Millman', color: 'border-purple-500 text-purple-300 bg-purple-500/10' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                activeTab === tab.id
                  ? `${tab.color} shadow-md`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: LOIS DE KIRCHHOFF (WHITEBOARD DEMONSTRATION) ── */}
        {activeTab === 'kirchhoff' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 animate-in fade-in duration-200 shadow-md">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                1°) Résolution par les Lois de KIRCHHOFF
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                Loi des Nœuds + Loi des Mailles + Déterminants
              </span>
            </div>

            <div className="space-y-3.5 text-slate-300 text-xs leading-relaxed font-sans">
              
              {/* Étape A: Loi de Nœuds */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-cyan-300 font-bold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">Étape 1</span>
                  Loi des Nœuds au nœud A :
                </div>
                <p className="text-[11px] text-slate-300">
                  D&apos;après la conservation de la charge électrique :
                </p>
                <div className="p-2.5 rounded-lg bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs space-y-1">
                  <div>
                    <LatexMath math="\sum I_{\text{ent}} = \sum I_{\text{sort}}" />
                  </div>
                  <div>
                    <LatexMath math="\text{On a : } I_1 - I - I_2 = 0 \quad \implies \quad \mathbf{I_2 = I_1 - I} \quad \text{--- (1)}" />
                  </div>
                </div>
              </div>

              {/* Étape B: Loi des Mailles */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="text-cyan-300 font-bold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">Étape 2</span>
                  Loi des Mailles (<LatexMath math="\sum U_i = 0" />) :
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  {/* Maille 1 */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">• Maille ABCDA :</span>
                    <p className="text-slate-300">
                      <LatexMath math="E_1 - U_1 - U = 0" />
                    </p>
                    <p className="text-slate-300">
                      <LatexMath math="\iff E_1 - R_1 I_1 - R I = 0" />
                    </p>
                    <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-center">
                      <LatexMath math="\mathbf{R_1 I_1 + R I = E_1} \quad \text{--- (2)}" />
                    </div>
                  </div>

                  {/* Maille 2 */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 space-y-1">
                    <span className="font-bold text-slate-200 block">• Maille ABD&apos;C&apos;A :</span>
                    <p className="text-slate-300">
                      <LatexMath math="+U - U_2 - E_2 = 0" />
                    </p>
                    <p className="text-slate-300">
                      <LatexMath math="\iff R I - R_2 I_2 = E_2 \quad \text{--- (3)}" />
                    </p>
                    <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-center">
                      <LatexMath math="\mathbf{R I - R_2 I_2 = E_2}" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape C: Élimination de I2 et Formation du Système Linéaire */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-cyan-300 font-bold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">Étape 3</span>
                  Élimination de <LatexMath math="I_2" /> et Mise sous Forme de Système Linéaire :
                </div>
                <p className="text-[11px] text-slate-300">
                  En injectant <LatexMath math="(1) \implies I_2 = I_1 - I" /> dans l&apos;équation <LatexMath math="(3)" /> :
                </p>
                <div className="p-2 rounded bg-black/60 text-center font-mono text-slate-200 text-[11px] space-y-1">
                  <div>
                    <LatexMath math="R I - R_2 (I_1 - I) = E_2 \iff R I - R_2 I_1 + R_2 I = E_2" />
                  </div>
                  <div>
                    <LatexMath math="\implies \mathbf{-R_2 I_1 + (R + R_2) I = E_2} \quad \text{--- (3')}" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 pt-0.5">
                  On obtient ainsi le système de 2 équations à 2 inconnues <LatexMath math="(I_1, I)" /> :
                </p>
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-center font-mono font-bold text-cyan-200 text-xs sm:text-sm">
                  <LatexMath math="\begin{cases} R_1 I_1 + R I = E_1 & \text{--- (2)} \\ -R_2 I_1 + (R + R_2) I = E_2 & \text{--- (3')} \end{cases}" />
                </div>
              </div>

              {/* Étape D: Résolution par la Méthode de Cramer (Déterminants) */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2.5 shadow-inner">
                <div className="text-cyan-300 font-bold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">Étape 4</span>
                  Résolution par la Méthode de Cramer (Déterminants) :
                </div>

                {/* Déterminant Principal Delta */}
                <div className="space-y-1 text-[11px]">
                  <span className="font-bold text-amber-300 block">1. Déterminant Principal <LatexMath math="\Delta" /> :</span>
                  <div className="p-2 rounded-lg bg-black/60 text-center font-mono text-amber-300 text-xs">
                    <LatexMath math="\Delta = \begin{vmatrix} R_1 & R \\ -R_2 & R + R_2 \end{vmatrix} = R_1 (R + R_2) - (-R_2)(R) = R_1 R + R_1 R_2 + R R_2" />
                  </div>
                  <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-center font-mono font-bold text-amber-300 text-xs">
                    <LatexMath math="\mathbf{\Delta = R_1 R_2 + R_1 R + R_2 R = R_1 R_2 + R(R_1 + R_2)}" />
                  </div>
                </div>

                {/* Calcul du Courant I Recherché */}
                <div className="space-y-1 text-[11px] pt-1">
                  <span className="font-bold text-cyan-300 block">2. Expression du Courant <LatexMath math="I" /> (dans la résistance <LatexMath math="R" />) :</span>
                  <div className="p-2 rounded-lg bg-black/60 text-center font-mono text-cyan-300 text-xs">
                    <LatexMath math="I = \frac{\begin{vmatrix} R_1 & E_1 \\ -R_2 & E_2 \end{vmatrix}}{\Delta} = \frac{R_1 E_2 - (-R_2 E_1)}{\Delta} = \frac{R_1 E_2 + R_2 E_1}{R_1 R_2 + R_1 R + R_2 R}" />
                  </div>
                </div>

                {/* Formule Finale Encadrée */}
                <div className="p-3 rounded-xl bg-cyan-500/15 border-2 border-cyan-400 text-center font-mono text-cyan-200 font-black text-xs sm:text-sm shadow-md">
                  <LatexMath math="\mathbf{I = \frac{R_2 E_1 + R_1 E_2}{R_1 R_2 + R(R_1 + R_2)} = \frac{\frac{E_1}{R_1} + \frac{E_2}{R_2}}{1 + R\left(\frac{1}{R_1} + \frac{1}{R_2}\right)}}" />
                </div>

                {/* Courant I1 (Bonus du tableau) */}
                <div className="space-y-1 text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400 font-bold block">• Courant de branche <LatexMath math="I_1" /> (calculé par Cramer) :</span>
                  <div className="p-1.5 rounded bg-black/40 text-center font-mono text-slate-300 text-[11px]">
                    <LatexMath math="I_1 = \frac{\begin{vmatrix} E_1 & R \\ E_2 & R + R_2 \end{vmatrix}}{\Delta} = \frac{E_1(R + R_2) - R E_2}{R_1 R_2 + R(R_1 + R_2)}" />
                  </div>
                </div>
              </div>

              {/* Application Numérique en direct avec les sliders */}
              <div className="p-3 rounded-xl bg-black/70 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Application Numérique en direct (Valeurs des Sliders) :
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    <LatexMath math={`\\Delta = ${R1 * R2 + R * (R1 + R2)}\\text{ }\\Omega^2`} />
                  </span>
                </div>
                <div className="text-slate-200 pt-0.5 leading-relaxed text-center">
                  <LatexMath math={`I = \\frac{${R2} \\times ${E1} + ${R1} \\times ${E2}}{${R1} \\times ${R2} + ${R}(${R1} + ${R2})} = \\frac{${R2 * E1} + ${R1 * E2}}{${R1 * R2} + ${R * (R1 + R2)}} = \\frac{${R2 * E1 + R1 * E2}}{${R1 * R2 + R * (R1 + R2)}} = \\mathbf{${calculations.I.toFixed(3)}\\text{ A}}`} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 2: THÉORÈME DE SUPERPOSITION ── */}
        {activeTab === 'superposition' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                2°) Résolution par le Théorème de Superposition
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Principe de Linéarité
              </span>
            </div>

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                On décompose le courant total en la somme de deux contributions : <LatexMath math="I = I' + I''" /> où chaque source agit seule en éteignant l&apos;autre (source de tension éteinte = court-circuit / fil).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                {/* Cas 1: E1 seule */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-1.5">
                  <span className="font-bold text-amber-300">1. Source <LatexMath math="E_1" /> active seule (<LatexMath math="E_2 = 0\text{V}" />) :</span>
                  <p className="text-slate-300">
                    <LatexMath math="R" /> et <LatexMath math="R_2" /> sont en parallèle. La résistance équivalente vue par <LatexMath math="E_1" /> est <LatexMath math="R_1 + \frac{R R_2}{R + R_2}" />.
                  </p>
                  <p className="text-slate-300">Par pont diviseur de courant :</p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-amber-300 font-bold">
                    <LatexMath math="I' = \frac{E_1}{R_1 + \frac{R R_2}{R + R_2}} \cdot \frac{R_2}{R + R_2} = \frac{R_2 E_1}{R_1 R_2 + R(R_1 + R_2)}" />
                  </div>
                </div>

                {/* Cas 2: E2 seule */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-1.5">
                  <span className="font-bold text-amber-300">2. Source <LatexMath math="E_2" /> active seule (<LatexMath math="E_1 = 0\text{V}" />) :</span>
                  <p className="text-slate-300">
                    Par symétrie rigoureuse en permutant les indices 1 et 2 :
                  </p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-amber-300 font-bold">
                    <LatexMath math="I'' = \frac{E_2}{R_2 + \frac{R R_1}{R + R_1}} \cdot \frac{R_1}{R + R_1} = \frac{R_1 E_2}{R_1 R_2 + R(R_1 + R_2)}" />
                  </div>
                </div>
              </div>

              {/* Somme Algébrique */}
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center font-mono font-bold text-amber-300 text-xs">
                <LatexMath math={`I = I' + I'' = \\frac{R_2 E_1 + R_1 E_2}{R_1 R_2 + R(R_1 + R_2)} \\implies \\mathbf{I = ${calculations.I.toFixed(3)}\\text{ A}}`} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: THÉORÈME DE THÉVENIN ── */}
        {activeTab === 'thevenin' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                3°) Résolution par le Théorème de Thévenin
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                Modèle (Eth, Rth)
              </span>
            </div>

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                On déconnecte la résistance centrale <LatexMath math="R" /> et on détermine le dipôle de Thévenin équivalent <LatexMath math="(E_{th}, R_{th})" /> vu entre les bornes <LatexMath math="A" /> et <LatexMath math="B" /> :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                {/* Calcul Eth */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-1.5">
                  <span className="font-bold text-emerald-300">1. Tension à vide <LatexMath math="E_{th}" /> (Pont diviseur) :</span>
                  <p className="text-slate-300">
                    À vide (<LatexMath math="R" /> retirée), un courant circule dans la seule maille formée par <LatexMath math="E_1, R_1, R_2, E_2" /> :
                  </p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-emerald-300 font-bold">
                    <LatexMath math={`E_{th} = V_A - V_B = \\frac{R_2 E_1 + R_1 E_2}{R_1 + R_2} = ${calculations.Eth.toFixed(2)}\\text{ V}`} />
                  </div>
                </div>

                {/* Calcul Rth */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-1.5">
                  <span className="font-bold text-emerald-300">2. Résistance de Thévenin <LatexMath math="R_{th}" /> :</span>
                  <p className="text-slate-300">
                    En éteignant les deux sources (<LatexMath math="E_1 = E_2 = 0" />), les résistances <LatexMath math="R_1" /> et <LatexMath math="R_2" /> se retrouvent en parallèle :
                  </p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-emerald-300 font-bold">
                    <LatexMath math={`R_{th} = R_1 \\parallel R_2 = \\frac{R_1 R_2}{R_1 + R_2} = ${calculations.Rth.toFixed(2)}\\text{ }\\Omega`} />
                  </div>
                </div>
              </div>

              {/* Reconnexion de R */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center font-mono font-bold text-emerald-300 text-xs">
                <LatexMath math={`I = \\frac{E_{th}}{R_{th} + R} = \\frac{\\frac{R_2 E_1 + R_1 E_2}{R_1 + R_2}}{\\frac{R_1 R_2}{R_1 + R_2} + R} = \\mathbf{${calculations.I.toFixed(3)}\\text{ A}}`} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: THÉORÈME DE NORTON ── */}
        {activeTab === 'norton' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                4°) Résolution par le Théorème de Norton
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                Modèle (IN, RN)
              </span>
            </div>

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                On remplace l&apos;ensemble du réseau vu par <LatexMath math="R" /> par une source de courant de court-circuit <LatexMath math="I_N" /> en parallèle avec <LatexMath math="R_N = R_{th}" /> :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                {/* Calcul IN */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-1.5">
                  <span className="font-bold text-indigo-300">1. Courant de court-circuit <LatexMath math="I_N" /> :</span>
                  <p className="text-slate-300">
                    En reliant A et B par un fil (court-circuit), chaque source débite directement dans sa propre résistance :
                  </p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-indigo-300 font-bold">
                    <LatexMath math={`I_N = \\frac{E_1}{R_1} + \\frac{E_2}{R_2} = ${calculations.IN.toFixed(3)}\\text{ A}`} />
                  </div>
                </div>

                {/* Calcul RN */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-1.5">
                  <span className="font-bold text-indigo-300">2. Résistance de Norton <LatexMath math="R_N" /> :</span>
                  <p className="text-slate-300">
                    Identique à la résistance de Thévenin :
                  </p>
                  <div className="p-2 rounded bg-black/60 text-center font-mono text-indigo-300 font-bold">
                    <LatexMath math={`R_N = R_{th} = \\frac{R_1 R_2}{R_1 + R_2} = ${calculations.RN.toFixed(2)}\\text{ }\\Omega`} />
                  </div>
                </div>
              </div>

              {/* Diviseur de courant */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center font-mono font-bold text-indigo-300 text-xs">
                <LatexMath math={`I = I_N \\cdot \\frac{R_N}{R_N + R} = \\left(\\frac{E_1}{R_1} + \\frac{E_2}{R_2}\\right) \\cdot \\frac{\\frac{R_1 R_2}{R_1 + R_2}}{\\frac{R_1 R_2}{R_1 + R_2} + R} = \\mathbf{${calculations.I.toFixed(3)}\\text{ A}}`} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: THÉORÈME DE MILLMAN ── */}
        {activeTab === 'millman' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-4 animate-in fade-in duration-200 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                5°) Résolution par le Théorème de Millman (Méthode la plus rapide)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                Formule Directe
              </span>
            </div>

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                Le nœud A est connecté à 3 branches ayant pour potentiels distants <LatexMath math="E_1, E_2" /> et <LatexMath math="0\text{V}" /> à travers les résistances respectives <LatexMath math="R_1, R_2, R" /> :
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-300">1. Application de la formule de Millman au nœud A :</span>
                <div className="p-2.5 rounded bg-black/60 text-center font-mono text-purple-300 font-bold text-xs sm:text-sm">
                  <LatexMath math={`V_A = \\frac{\\frac{E_1}{R_1} + \\frac{E_2}{R_2} + \\frac{0}{R}}{\\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R}} = \\frac{G_1 E_1 + G_2 E_2}{G_1 + G_2 + G} = ${calculations.VA.toFixed(2)}\\text{ V}`} />
                </div>
              </div>

              {/* Déduction directe de I */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center font-mono font-bold text-purple-300 text-xs space-y-1.5">
                <div>
                  <LatexMath math={`I = \\frac{V_A - 0}{R} = \\frac{V_A}{R} = \\frac{\\frac{E_1}{R_1} + \\frac{E_2}{R_2}}{R \\left(\\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R}\\right)} = \\mathbf{${calculations.I.toFixed(3)}\\text{ A}}`} />
                </div>
                <p className="text-[10px] text-purple-300 font-sans font-normal">
                  ⚡ En 1 seule ligne de calcul, on obtient directement la tension et le courant recherchés !
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
