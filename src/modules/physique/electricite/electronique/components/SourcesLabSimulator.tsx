"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Flame, 
  Activity, 
  Power, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Sliders, 
  Info,
  Sparkles
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function SourcesLabSimulator() {
  // --- Simulation State ---
  const [sourceType, setSourceType] = useState<"tension" | "courant">("tension");
  const [modelMode, setModelMode] = useState<"ideal" | "reel">("reel");
  const [isExtinguished, setIsExtinguished] = useState<boolean>(false);
  
  // Electrical Parameters
  const [E, setE] = useState<number>(12); // Volts
  const [eta, setEta] = useState<number>(3); // Amperes
  const [r, setR] = useState<number>(3); // Ohms (internal resistance)
  const [RL, setRL] = useState<number>(6); // Ohms (load resistance)
  const [isOpenCircuit, setIsOpenCircuit] = useState<boolean>(false);

  // Canvas Refs
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Physical Computations ---
  const isShortCircuit = RL === 0;

  // Real-time calculated values
  let u = 0; // Voltage across AB (V)
  let i = 0; // Current to load (A)
  let i_r = 0; // Current through internal resistance in Norton (A)
  let P_L = 0; // Useful power delivered to load (W)
  let P_r = 0; // Dissipated thermal power in internal resistance (W)
  let efficiency = 0; // Energy efficiency (%)
  let I_cc = 0; // Short-circuit current (A)
  let U_0 = 0; // Open-circuit voltage (V)

  if (sourceType === "tension") {
    const E_eff = isExtinguished ? 0 : E;
    U_0 = E_eff;
    const r_internal = modelMode === "ideal" ? 0 : r;
    I_cc = r_internal > 0 ? E_eff / r_internal : 999;

    if (isOpenCircuit) {
      i = 0;
      u = E_eff;
      P_L = 0;
      P_r = 0;
      efficiency = 100;
    } else if (isShortCircuit) {
      if (r_internal > 0) {
        i = E_eff / r_internal;
        u = 0;
        P_L = 0;
        P_r = r_internal * i * i;
        efficiency = 0;
      } else {
        i = 99; // Cap for ideal short circuit
        u = 0;
        P_L = 0;
        P_r = 0;
        efficiency = 0;
      }
    } else {
      i = E_eff / (r_internal + RL);
      u = RL * i;
      P_L = u * i;
      P_r = r_internal * i * i;
      efficiency = (P_L + P_r) > 0 ? (P_L / (P_L + P_r)) * 100 : 0;
    }
  } else {
    // Current Source (Norton)
    const eta_eff = isExtinguished ? 0 : eta;
    I_cc = eta_eff;
    const r_internal = modelMode === "ideal" ? Infinity : r;
    U_0 = isFinite(r_internal) ? eta_eff * r_internal : 999;

    if (isOpenCircuit) {
      if (isFinite(r_internal)) {
        u = eta_eff * r_internal;
        i = 0;
        i_r = eta_eff;
        P_L = 0;
        P_r = r_internal * i_r * i_r;
        efficiency = 0;
      } else {
        u = 99;
        i = 0;
        P_L = 0;
        P_r = 0;
        efficiency = 0;
      }
    } else if (isShortCircuit) {
      u = 0;
      i = eta_eff;
      i_r = 0;
      P_L = 0;
      P_r = 0;
      efficiency = 100;
    } else {
      if (modelMode === "ideal") {
        i = eta_eff;
        u = RL * i;
        i_r = 0;
        P_L = u * i;
        P_r = 0;
        efficiency = 100;
      } else {
        const Req = (r * RL) / (r + RL);
        u = eta_eff * Req;
        i = u / RL;
        i_r = u / r;
        P_L = u * i;
        P_r = r * i_r * i_r;
        efficiency = (P_L + P_r) > 0 ? (P_L / (P_L + P_r)) * 100 : 0;
      }
    }
  }

  // --- 1. Circuit Animation (Retina Crisp Canvas) ---
  useEffect(() => {
    const canvas = circuitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particleOffset = 0;

    const cssWidth = 320;
    const cssHeight = 145;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const w = cssWidth;
      const h = cssHeight;

      // Coordinate anchors
      const padX = 25;
      const topY = 32;
      const botY = h - 32;
      const leftX = padX + 15;
      const rightX = w - padX - 15;
      const midX = (leftX + rightX) / 2;

      // Current magnitude speed factor
      const speed = Math.min(Math.max(i * 1.2, 0), 10);
      particleOffset = (particleOffset + speed * 0.45) % 1000;

      // Draw Main Circuit Loop Wire
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(leftX, topY);
      ctx.lineTo(rightX, topY);
      ctx.lineTo(rightX, botY);
      ctx.lineTo(leftX, botY);
      ctx.closePath();
      ctx.stroke();

      // Dashed Real Source Box
      if (modelMode === "reel") {
        ctx.save();
        ctx.strokeStyle = sourceType === "tension" ? "rgba(34, 211, 238, 0.35)" : "rgba(129, 140, 248, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.fillStyle = sourceType === "tension" ? "rgba(6, 182, 212, 0.04)" : "rgba(99, 102, 241, 0.04)";
        
        if (sourceType === "tension") {
          ctx.strokeRect(leftX - 12, topY - 14, (midX - leftX) + 18, botY - topY + 28);
          ctx.fillRect(leftX - 12, topY - 14, (midX - leftX) + 18, botY - topY + 28);
        } else {
          ctx.strokeRect(leftX - 12, topY - 14, 140, botY - topY + 28);
          ctx.fillRect(leftX - 12, topY - 14, 140, botY - topY + 28);
        }
        ctx.restore();
      }

      // --- 1. LEFT BRANCH: Source (or Extinguished Equivalent) ---
      const genY = (topY + botY) / 2;
      
      // Wire gap clear for generator
      ctx.fillStyle = "#020617";
      ctx.fillRect(leftX - 16, genY - 18, 32, 36);

      if (isExtinguished) {
        if (sourceType === "tension") {
          // Tension Extinguished = Court-circuit (Solid glowing wire)
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(leftX, genY - 18);
          ctx.lineTo(leftX, genY + 18);
          ctx.stroke();

          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.arc(leftX, genY - 18, 3, 0, Math.PI * 2);
          ctx.arc(leftX, genY + 18, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fb7185";
          ctx.font = "bold 8.5px monospace";
          ctx.textAlign = "right";
          ctx.fillText("e=0", leftX - 6, genY + 3);
        } else {
          // Current Extinguished = Circuit Ouvert (Open switch/gap)
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(leftX, genY - 10, 3, 0, Math.PI * 2);
          ctx.arc(leftX, genY + 10, 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 8.5px monospace";
          ctx.textAlign = "right";
          ctx.fillText("η=0", leftX - 6, genY + 3);
        }
      } else {
        // Active Generator Circle
        const genColor = sourceType === "tension" ? "#22d3ee" : "#818cf8";
        ctx.strokeStyle = genColor;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#040813";
        ctx.beginPath();
        ctx.arc(leftX, genY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = genColor;
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (sourceType === "tension") {
          ctx.fillText(`E`, leftX, genY);
        } else {
          // Arrow inside for current source
          ctx.beginPath();
          ctx.moveTo(leftX, genY + 8);
          ctx.lineTo(leftX, genY - 8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(leftX - 3.5, genY - 3);
          ctx.lineTo(leftX, genY - 9);
          ctx.lineTo(leftX + 3.5, genY - 3);
          ctx.fill();
          ctx.fillText(`η`, leftX - 20, genY);
        }
      }

      // --- 2. INTERNAL RESISTANCE r ---
      if (modelMode === "reel") {
        if (sourceType === "tension") {
          // Series resistor on Top Wire
          const rX = (leftX + midX) / 2;
          ctx.fillStyle = "#020617";
          ctx.fillRect(rX - 16, topY - 10, 32, 20);

          const heatRatio = Math.min(P_r / 20, 1);
          ctx.fillStyle = heatRatio > 0.1 ? `rgba(239, 68, 68, ${0.15 + heatRatio * 0.25})` : "#040813";
          ctx.strokeStyle = heatRatio > 0.1 ? `rgba(239, 68, 68, ${0.5 + heatRatio * 0.5})` : "#22d3ee";
          ctx.lineWidth = 1.6;
          ctx.strokeRect(rX - 14, topY - 7, 28, 14);
          ctx.fillRect(rX - 14, topY - 7, 28, 14);

          ctx.fillStyle = heatRatio > 0.3 ? "#fca5a5" : "#22d3ee";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`r`, rX, topY);
        } else {
          // Parallel resistor branch in Norton
          const rX = leftX + 70;
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(rX, topY);
          ctx.lineTo(rX, botY);
          ctx.stroke();

          // Resistor body
          ctx.fillStyle = "#020617";
          ctx.fillRect(rX - 8, genY - 14, 16, 28);

          const heatRatio = Math.min(P_r / 20, 1);
          ctx.strokeStyle = heatRatio > 0.1 ? `rgba(239, 68, 68, ${0.5 + heatRatio * 0.5})` : "#818cf8";
          ctx.fillStyle = heatRatio > 0.1 ? `rgba(239, 68, 68, ${0.15 + heatRatio * 0.25})` : "#040813";
          ctx.lineWidth = 1.6;
          ctx.strokeRect(rX - 7, genY - 12, 14, 24);
          ctx.fillRect(rX - 7, genY - 12, 14, 24);

          ctx.fillStyle = heatRatio > 0.3 ? "#fca5a5" : "#818cf8";
          ctx.font = "bold 8.5px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`r`, rX, genY);
        }
      }

      // --- 3. RIGHT BRANCH: LOAD RESISTOR RL ---
      const loadY = (topY + botY) / 2;
      ctx.fillStyle = "#020617";
      ctx.fillRect(rightX - 14, loadY - 20, 28, 40);

      if (isOpenCircuit) {
        // Open circuit terminals
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rightX, loadY - 10, 3, 0, Math.PI * 2);
        ctx.arc(rightX, loadY + 10, 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 8.5px monospace";
        ctx.textAlign = "left";
        ctx.fillText("À vide", rightX + 8, loadY);
      } else if (isShortCircuit) {
        // Short circuit wire
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(rightX, topY);
        ctx.lineTo(rightX, botY);
        ctx.stroke();

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 8.5px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Court-Cct", rightX + 8, loadY);
      } else {
        // Active Load Resistor Box
        ctx.strokeStyle = "#10b981";
        ctx.fillStyle = "#06281e";
        ctx.lineWidth = 2;
        ctx.strokeRect(rightX - 9, loadY - 18, 18, 36);
        ctx.fillRect(rightX - 9, loadY - 18, 18, 36);

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`RL`, rightX, loadY);
      }

      // --- 4. TERMINAL NODES A & B ---
      const nodeAX = sourceType === "tension" ? rightX - 45 : rightX - 52;
      const nodeBX = nodeAX;

      // Node A
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(nodeAX, topY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 9.5px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("A", nodeAX, topY - 8);

      // Node B
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(nodeBX, botY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("B", nodeBX, botY + 12);

      // Voltage Arrow between A and B
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(nodeAX + 12, botY - 4);
      ctx.lineTo(nodeAX + 12, topY + 4);
      ctx.stroke();

      // Arrow head pointing to A
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(nodeAX + 9, topY + 7);
      ctx.lineTo(nodeAX + 12, topY + 2);
      ctx.lineTo(nodeAX + 15, topY + 7);
      ctx.fill();

      // --- 5. ANIMATED CURRENT PARTICLES ---
      if (i > 0.05 && !isOpenCircuit) {
        const loopPerimeter = 2 * (rightX - leftX) + 2 * (botY - topY);
        const numElectrons = 14;
        ctx.fillStyle = "#38bdf8";

        for (let k = 0; k < numElectrons; k++) {
          const dist = (particleOffset + (k * loopPerimeter) / numElectrons) % loopPerimeter;
          let px = 0, py = 0;

          if (dist < (rightX - leftX)) {
            px = leftX + dist;
            py = topY;
          } else if (dist < (rightX - leftX) + (botY - topY)) {
            px = rightX;
            py = topY + (dist - (rightX - leftX));
          } else if (dist < 2 * (rightX - leftX) + (botY - topY)) {
            px = rightX - (dist - ((rightX - leftX) + (botY - topY)));
            py = botY;
          } else {
            px = leftX;
            py = botY - (dist - (2 * (rightX - leftX) + (botY - topY)));
          }

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [sourceType, modelMode, isExtinguished, E, eta, r, RL, isOpenCircuit, i, u, P_r, P_L]);

  // --- 2. Live Characteristic Graph ($u$ vs $i$ Plot - Retina Crisp) ---
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = 320;
    const cssHeight = 145;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const pad = { top: 18, right: 18, bottom: 26, left: 38 };
    const pw = cssWidth - pad.left - pad.right;
    const ph = cssHeight - pad.top - pad.bottom;

    // Max scales for plot
    const maxI = Math.max(sourceType === "tension" ? (E / Math.max(r, 0.5)) * 1.15 : eta * 1.4, 4);
    const maxU = Math.max(sourceType === "tension" ? E * 1.2 : (eta * r) * 1.2, 12);

    const toX = (valI: number) => pad.left + (Math.min(valI, maxI) / maxI) * pw;
    const toY = (valU: number) => cssHeight - pad.bottom - (Math.min(valU, maxU) / maxU) * ph;

    // Grid lines
    ctx.strokeStyle = "rgba(51, 65, 85, 0.35)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 3]);

    for (let s = 1; s <= 3; s++) {
      const gI = (maxI / 3) * s;
      const gU = (maxU / 3) * s;
      
      // Vertical grid
      ctx.beginPath();
      ctx.moveTo(toX(gI), pad.top);
      ctx.lineTo(toX(gI), cssHeight - pad.bottom);
      ctx.stroke();

      // Horizontal grid
      ctx.beginPath();
      ctx.moveTo(pad.left, toY(gU));
      ctx.lineTo(cssWidth - pad.right, toY(gU));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, cssHeight - pad.bottom);
    ctx.lineTo(cssWidth - pad.right, cssHeight - pad.bottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    ctx.fillText("u (V)", pad.left - 4, pad.top + 4);
    ctx.textAlign = "center";
    ctx.fillText("i (A)", cssWidth - pad.right + 4, cssHeight - pad.bottom + 14);

    // Generator Characteristic Line: u = E - r*i
    const E_val = isExtinguished ? 0 : (sourceType === "tension" ? E : eta * r);
    const Icc_val = isExtinguished ? 0 : (sourceType === "tension" ? (modelMode === "ideal" ? maxI : E / r) : eta);

    // 1. Soft Sky-Blue Gradient Fill Under Characteristic Curve
    if (E_val > 0 || Icc_val > 0) {
      const curveGrad = ctx.createLinearGradient(0, pad.top, 0, cssHeight - pad.bottom);
      curveGrad.addColorStop(0, "rgba(34, 211, 238, 0.18)"); // Sky-blue glow at top
      curveGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.08)");
      curveGrad.addColorStop(1, "rgba(2, 6, 23, 0.00)"); // Transparent at baseline

      ctx.fillStyle = curveGrad;
      ctx.beginPath();
      if (modelMode === "ideal" && sourceType === "tension") {
        ctx.moveTo(toX(0), toY(E_val));
        ctx.lineTo(toX(maxI), toY(E_val));
        ctx.lineTo(toX(maxI), toY(0));
        ctx.lineTo(toX(0), toY(0));
      } else if (modelMode === "ideal" && sourceType === "courant") {
        ctx.moveTo(toX(0), toY(maxU));
        ctx.lineTo(toX(Icc_val), toY(maxU));
        ctx.lineTo(toX(Icc_val), toY(0));
        ctx.lineTo(toX(0), toY(0));
      } else {
        ctx.moveTo(toX(0), toY(E_val));
        ctx.lineTo(toX(Icc_val), toY(0));
        ctx.lineTo(toX(0), toY(0));
      }
      ctx.closePath();
      ctx.fill();
    }

    // 2. Stroke the Characteristic Curve Line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    if (modelMode === "ideal" && sourceType === "tension") {
      ctx.moveTo(toX(0), toY(E_val));
      ctx.lineTo(toX(maxI), toY(E_val));
    } else if (modelMode === "ideal" && sourceType === "courant") {
      ctx.moveTo(toX(Icc_val), toY(0));
      ctx.lineTo(toX(Icc_val), toY(maxU));
    } else {
      ctx.moveTo(toX(0), toY(E_val));
      ctx.lineTo(toX(Icc_val), toY(0));
    }
    ctx.stroke();

    // 3. Load Characteristic Line: u = RL * i
    if (!isOpenCircuit && RL > 0) {
      ctx.strokeStyle = "rgba(52, 211, 153, 0.75)";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(0));
      const endI = maxU / RL;
      ctx.lineTo(toX(Math.min(endI, maxI)), toY(Math.min(RL * maxI, maxU)));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Operating Point P (Point de Fonctionnement)
    if (!isOpenCircuit && i >= 0 && u >= 0) {
      const isExtreme = i > maxI || (isShortCircuit && modelMode === "ideal");
      const dispI = isExtreme ? maxI : i;
      const ptX = toX(dispI);
      const ptY = toY(u);

      // Shaded Power Area (u * i)
      if (u > 0 && dispI > 0) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
        ctx.fillRect(toX(0), ptY, ptX - toX(0), toY(0) - ptY);
      }

      // Operating Point Beacon
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Tooltip position safety
      const tipX = ptX > cssWidth - 85 ? ptX - 75 : (ptX < pad.left + 20 ? ptX + 8 : ptX - 30);
      const tipY = ptY > cssHeight - pad.bottom - 15 ? ptY - 10 : (ptY < pad.top + 15 ? ptY + 14 : ptY - 8);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      const labelText = isExtreme ? "P(∞, 0V)" : `P(${i.toFixed(1)}A, ${u.toFixed(1)}V)`;
      ctx.fillText(labelText, tipX, tipY);
    }

    // 5. Intercept labels
    if (E_val > 0) {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 8.5px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${E_val.toFixed(0)}V`, pad.left - 4, toY(E_val) + 3);
    }
    
    if (isFinite(Icc_val) && Icc_val > 0 && Icc_val <= maxI) {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 8.5px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${Icc_val.toFixed(1)}A`, toX(Icc_val), cssHeight - pad.bottom + 12);
    }

    ctx.restore();
  }, [sourceType, modelMode, isExtinguished, E, eta, r, RL, isOpenCircuit, i, u]);

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden my-5">
      
      {/* Header Banner */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              Laboratoire Interactif : Générateurs Réels & Extinction
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Analysez en direct la chute de tension interne, l&apos;extinction (<LatexMath math="e=0" /> / <LatexMath math="\eta=0" />) et le point de fonctionnement.
            </p>
          </div>
        </div>

        {/* Extinction / Passivate Button */}
        <button
          onClick={() => setIsExtinguished(!isExtinguished)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer ${
            isExtinguished 
              ? "bg-rose-500 text-white shadow-rose-500/30 animate-pulse" 
              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {isExtinguished ? "Source Éteinte" : "Éteindre Source"}
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT: Controls (5 Cols) */}
        <div className="lg:col-span-5 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 bg-slate-950/40">
          
          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Source</span>
              <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setSourceType("tension")}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    sourceType === "tension" 
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Tension (E)
                </button>
                <button
                  onClick={() => setSourceType("courant")}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    sourceType === "courant" 
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Courant (η)
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Modèle</span>
              <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setModelMode("ideal")}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    modelMode === "ideal" 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Idéal
                </button>
                <button
                  onClick={() => setModelMode("reel")}
                  className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    modelMode === "reel" 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Réel (r)
                </button>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-1">
            
            {/* E or eta slider */}
            {sourceType === "tension" ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Force Électromotrice <LatexMath math="E" />
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{E} V</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={E}
                  disabled={isExtinguished}
                  onChange={(e) => setE(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Courant Électromoteur <LatexMath math="\eta" />
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">{eta} A</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={eta}
                  disabled={isExtinguished}
                  onChange={(e) => setEta(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}

            {/* Internal Resistance r slider */}
            {modelMode === "reel" && (
              <div className="space-y-1 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Résistance Interne <LatexMath math="r" />
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{r} Ω</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={r}
                  onChange={(e) => setR(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}

            {/* Load Resistance RL slider */}
            <div className="space-y-1 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Charge <LatexMath math="R_L" />
                </span>
                <span className="font-mono text-emerald-300 font-bold">
                  {isOpenCircuit ? "∞ (À vide)" : `${RL} Ω`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={isOpenCircuit ? 30 : RL}
                disabled={isOpenCircuit}
                onChange={(e) => {
                  setRL(parseFloat(e.target.value));
                  setIsOpenCircuit(false);
                }}
                className="w-full accent-emerald-400 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-800 rounded-lg"
              />

              {/* Presets - Single Line & Vibrant */}
              <div className="grid grid-cols-3 gap-1.5 pt-1.5">
                <button
                  onClick={() => { setRL(0); setIsOpenCircuit(false); }}
                  className={`h-7 px-1 flex items-center justify-center whitespace-nowrap rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    isShortCircuit && !isOpenCircuit
                      ? "bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-sm shadow-rose-500/20 font-black"
                      : "bg-slate-900/90 text-rose-400/80 border-slate-800 hover:border-rose-500/40 hover:text-rose-300 hover:bg-rose-950/20"
                  }`}
                >
                  Court-Cct (0Ω)
                </button>
                <button
                  onClick={() => { setRL(r); setIsOpenCircuit(false); }}
                  className={`h-7 px-1 flex items-center justify-center whitespace-nowrap rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    RL === r && !isOpenCircuit
                      ? "bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/20 font-black"
                      : "bg-slate-900/90 text-amber-400/80 border-slate-800 hover:border-amber-500/40 hover:text-amber-300 hover:bg-amber-950/20"
                  }`}
                >
                  Adapté (RL=r)
                </button>
                <button
                  onClick={() => setIsOpenCircuit(true)}
                  className={`h-7 px-1 flex items-center justify-center whitespace-nowrap rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    isOpenCircuit
                      ? "bg-cyan-500/25 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-500/20 font-black"
                      : "bg-slate-900/90 text-cyan-400/80 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-cyan-950/20"
                  }`}
                >
                  À vide (∞)
                </button>
              </div>
            </div>
          </div>

          {/* Pedagogical Note */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              {isExtinguished ? (
                <span className="text-rose-300 font-semibold">
                  Source éteinte : {sourceType === "tension" ? "Remplacée par un fil parfait (u=0)" : "Remplacée par un circuit ouvert (i=0)"}.
                </span>
              ) : (
                <span>
                  {RL === r ? (
                    <strong className="text-amber-300">Transfert maximal : </strong>
                  ) : null}
                  Puissance utile <LatexMath math="P_L = u \cdot i" /> face aux pertes thermiques <LatexMath math="P_r = r \cdot i^2" />.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Digital HUD + Canvases (7 Cols) */}
        <div className="lg:col-span-7 p-4 flex flex-col justify-between space-y-3 bg-slate-950/80">
          
          {/* Top HUD Digital Meters with LaTeX Headers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-center">
              <span className="text-[9px] text-slate-400 font-bold block">Tension <LatexMath math="u_{AB}" /></span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-cyan-300">{u.toFixed(2)} V</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-center">
              <span className="text-[9px] text-slate-400 font-bold block">Courant <LatexMath math="i" /></span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-indigo-300">{i.toFixed(2)} A</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-center">
              <span className="text-[9px] text-slate-400 font-bold block">Puissance <LatexMath math="P_L" /></span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-300">{P_L.toFixed(1)} W</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/20 text-center">
              <span className="text-[9px] text-slate-400 font-bold block">Rendement <LatexMath math="\rho" /></span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-300">{efficiency.toFixed(0)} %</span>
            </div>
          </div>

          {/* Dual Canvases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            
            {/* 1. Circuit Animation */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-2 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between px-1.5 pb-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" /> Schéma Animé
                </span>
                <span className="text-[8.5px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 60 FPS
                </span>
              </div>
              <canvas
                ref={circuitCanvasRef}
                style={{ width: "100%", maxWidth: "320px", height: "145px" }}
                className="w-full max-w-[320px] h-[145px]"
              />
            </div>

            {/* 2. Live Characteristic Curve (u vs i) */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-2 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between px-1.5 pb-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Courbe <LatexMath math="u(i)" />
                </span>
                <span className="text-[9px] font-mono text-cyan-400 font-bold">
                  {sourceType === "tension" ? <LatexMath math="u = E - r \cdot i" /> : <LatexMath math="i = \eta - \frac{u}{r}" />}
                </span>
              </div>
              <canvas
                ref={graphCanvasRef}
                style={{ width: "100%", maxWidth: "320px", height: "145px" }}
                className="w-full max-w-[320px] h-[145px]"
              />
            </div>

          </div>

          {/* Footer Equation */}
          <div className="p-2.5 rounded-xl bg-black/50 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Loi d&apos;Ohm globale :
            </span>
            <span className="text-cyan-300 font-bold">
              {sourceType === "tension" ? (
                <LatexMath math={`u = ${u.toFixed(2)}\\text{ V} = ${isExtinguished ? 0 : E}\\text{ V} - (${modelMode === "ideal" ? 0 : r}\\,\\Omega \\times ${i.toFixed(2)}\\text{ A})`} />
              ) : (
                <LatexMath math={`i = ${i.toFixed(2)}\\text{ A} = ${isExtinguished ? 0 : eta}\\text{ A} - \\frac{${u.toFixed(2)}\\text{ V}}{${modelMode === "ideal" ? "\\infty" : r + "\\,\\Omega"}}`} />
              )}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
