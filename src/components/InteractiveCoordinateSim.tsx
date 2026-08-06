"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sliders, RotateCcw, Eye, Compass } from "lucide-react";

type CoordSystem = "cartesien" | "cylindrique" | "spherique";

export default function InteractiveCoordinateSim() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [coordType, setCoordType] = useState<CoordSystem>("cylindrique");

  // State parameters
  const [r, setR] = useState(120);            // distance / radius
  const [theta, setTheta] = useState(45);     // angle theta (deg)
  const [phi, setPhi] = useState(60);         // angle phi (deg)
  const [zVal, setZVal] = useState(40);        // z height for cylindrical
  const [rotAngleX, setRotAngleX] = useState(25);
  const [rotAngleY, setRotAngleY] = useState(-35);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 420);

    const cx = width / 2;
    const cy = height / 2 + 20;

    // 3D Projection math
    const project = (x: number, y: number, z: number) => {
      const radX = (rotAngleX * Math.PI) / 180;
      const radY = (rotAngleY * Math.PI) / 180;

      // Rotate Y
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const y1 = y;
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotate X
      const x2 = x1;
      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective projection
      const scale = 380 / (380 + z2);
      return {
        px: cx + x2 * scale,
        py: cy - y2 * scale,
        scale,
      };
    };

    const drawArrow3D = (
      fromX: number, fromY: number, fromZ: number,
      toX: number, toY: number, toZ: number,
      color: string, label: string, lineWidth = 2.5
    ) => {
      const p1 = project(fromX, fromY, fromZ);
      const p2 = project(toX, toY, toZ);

      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(p2.py - p1.py, p2.px - p1.px);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(p2.px, p2.py);
      ctx.lineTo(p2.px - headLen * Math.cos(angle - Math.PI / 6), p2.py - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(p2.px - headLen * Math.cos(angle + Math.PI / 6), p2.py - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      if (label) {
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.fillStyle = color;
        ctx.fillText(label, p2.px + 8, p2.py - 4);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Background Grid & Axis
      const axisLen = 160;
      drawArrow3D(0, 0, 0, axisLen, 0, 0, "#ef4444", "X", 1.5);
      drawArrow3D(0, 0, 0, 0, axisLen, 0, "#22c55e", "Y", 1.5);
      drawArrow3D(0, 0, 0, 0, 0, axisLen, "#3b82f6", "Z", 1.5);

      // Origin point (O)
      const origin = project(0, 0, 0);
      ctx.beginPath();
      ctx.arc(origin.px, origin.py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#64748b";
      ctx.fill();
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("O", origin.px - 14, origin.py + 14);

      // Calculate Position of Point M in Cartesian coords
      let mx = 0, my = 0, mz = 0;
      const phiRad = (phi * Math.PI) / 180;
      const thetaRad = (theta * Math.PI) / 180;

      if (coordType === "cartesien") {
        mx = (r * Math.cos(phiRad) * Math.sin(thetaRad));
        my = (r * Math.sin(phiRad) * Math.sin(thetaRad));
        mz = zVal * 2;
      } else if (coordType === "cylindrique") {
        mx = r * Math.cos(phiRad);
        my = r * Math.sin(phiRad);
        mz = zVal * 2;
      } else if (coordType === "spherique") {
        mx = r * Math.sin(thetaRad) * Math.cos(phiRad);
        my = r * Math.sin(thetaRad) * Math.sin(phiRad);
        mz = r * Math.cos(thetaRad);
      }

      // Projection point m (on XY plane)
      const mProj = project(mx, my, 0);
      const mPoint = project(mx, my, mz);

      // Draw projection lines (dashed)
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
      ctx.lineWidth = 1.2;

      // Lines O -> H (in XY plane) -> M
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(mProj.px, mProj.py);
      ctx.lineTo(mPoint.px, mPoint.py);
      ctx.stroke();

      // Lines from M to Z axis
      const mZproj = project(0, 0, mz);
      ctx.beginPath();
      ctx.moveTo(mPoint.px, mPoint.py);
      ctx.lineTo(mZproj.px, mZproj.py);
      ctx.stroke();
      ctx.restore();

      // Position Vector OM
      drawArrow3D(0, 0, 0, mx, my, mz, "#8b5cf6", "OM", 3.5);

      // Point M node dot
      ctx.beginPath();
      ctx.arc(mPoint.px, mPoint.py, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#8b5cf6";
      ctx.shadowColor = "#8b5cf6";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.font = "extrabold 13px sans-serif";
      ctx.fillStyle = "#a855f7";
      ctx.fillText("M", mPoint.px + 10, mPoint.py - 10);

      // Draw Local Unit Vectors at M
      const vLen = 45;
      if (coordType === "cylindrique") {
        // e_rho direction (along OH)
        const rhoLen = Math.sqrt(mx * mx + my * my) || 1;
        const erhoX = (mx / rhoLen) * vLen;
        const erhoY = (my / rhoLen) * vLen;
        drawArrow3D(mx, my, mz, mx + erhoX, my + erhoY, mz, "#ec4899", "e_ρ", 2.5);

        // e_phi direction (ortho to e_rho in XY plane)
        const ephiX = (-my / rhoLen) * vLen;
        const ephiY = (mx / rhoLen) * vLen;
        drawArrow3D(mx, my, mz, mx + ephiX, my + ephiY, mz, "#10b981", "e_φ", 2.5);

        // e_z direction (parallel to Z)
        drawArrow3D(mx, my, mz, mx, my, mz + vLen, "#3b82f6", "e_z", 2.5);
      } else if (coordType === "spherique") {
        // e_r direction (along OM)
        const rLen = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
        const erX = (mx / rLen) * vLen;
        const erY = (my / rLen) * vLen;
        const erZ = (mz / rLen) * vLen;
        drawArrow3D(mx, my, mz, mx + erX, my + erY, mz + erZ, "#ec4899", "e_r", 2.5);

        // e_theta direction (tangent to meridian)
        const ethetaX = Math.cos(thetaRad) * Math.cos(phiRad) * vLen;
        const ethetaY = Math.cos(thetaRad) * Math.sin(phiRad) * vLen;
        const ethetaZ = -Math.sin(thetaRad) * vLen;
        drawArrow3D(mx, my, mz, mx + ethetaX, my + ethetaY, mz + ethetaZ, "#f59e0b", "e_θ", 2.5);

        // e_phi direction (tangent to parallel)
        const ephiX = -Math.sin(phiRad) * vLen;
        const ephiY = Math.cos(phiRad) * vLen;
        drawArrow3D(mx, my, mz, mx + ephiX, my + ephiY, mz, "#10b981", "e_φ", 2.5);
      } else {
        // Cartésiennes (i, j, k) at M
        drawArrow3D(mx, my, mz, mx + vLen, my, mz, "#ef4444", "i", 2.5);
        drawArrow3D(mx, my, mz, mx, my + vLen, mz, "#22c55e", "j", 2.5);
        drawArrow3D(mx, my, mz, mx, my, mz + vLen, "#3b82f6", "k", 2.5);
      }
    };

    render();

    // Drag to rotate 3D view
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      setRotAngleY((prev) => prev + deltaX * 0.6);
      setRotAngleX((prev) => Math.max(-85, Math.min(85, prev - deltaY * 0.6)));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const canvasElem = canvas;
    canvasElem.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvasElem.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [coordType, r, theta, phi, zVal, rotAngleX, rotAngleY]);

  return (
    <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-xl my-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-extrabold text-foreground">
            Simulateur 3D Interactif des Repères Local (Faire glisser pour tourner en 3D)
          </h3>
        </div>

        {/* System Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl">
          <button
            onClick={() => setCoordType("cartesien")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "cartesien" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cartésiennes (x,y,z)
          </button>
          <button
            onClick={() => setCoordType("cylindrique")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "cylindrique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cylindriques (ρ,φ,z)
          </button>
          <button
            onClick={() => setCoordType("spherique")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "spherique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sphériques (r,θ,φ)
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div 
        className="relative w-full h-[420px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
        style={{ touchAction: 'none' }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* View Indicator overlay */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Glissez la souris pour faire pivoter la vue 3D</span>
        </div>

        {/* Formula legend overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white font-medium flex flex-wrap items-center justify-between gap-2">
          {coordType === "cylindrique" && (
            <>
              <div><strong className="text-pink-400">e_ρ</strong> = cos(φ)i + sin(φ)j</div>
              <div><strong className="text-emerald-400">e_φ</strong> = -sin(φ)i + cos(φ)j</div>
              <div><strong className="text-blue-400">e_z</strong> = k</div>
              <div className="text-amber-300 font-bold">dOM = dρ e_ρ + ρ dφ e_φ + dz e_z</div>
            </>
          )}
          {coordType === "spherique" && (
            <>
              <div><strong className="text-pink-400">e_r</strong> = sin(θ)cos(φ)i + sin(θ)sin(φ)j + cos(θ)k</div>
              <div><strong className="text-amber-400">e_θ</strong> = cos(θ)cos(φ)i + cos(θ)sin(φ)j - sin(θ)k</div>
              <div><strong className="text-emerald-400">e_φ</strong> = -sin(φ)i + cos(φ)j</div>
            </>
          )}
          {coordType === "cartesien" && (
            <>
              <div><strong className="text-red-400">i</strong> = (1,0,0)</div>
              <div><strong className="text-green-400">j</strong> = (0,1,0)</div>
              <div><strong className="text-blue-400">k</strong> = (0,0,1)</div>
              <div className="text-amber-300 font-bold">dOM = dx i + dy j + dz k</div>
            </>
          )}
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
            <span>Rayon / Distance (r / ρ):</span>
            <span className="text-primary font-extrabold">{r} px</span>
          </label>
          <input
            type="range"
            min="40"
            max="160"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
            <span>Angle Azimutal (φ):</span>
            <span className="text-emerald-500 font-extrabold">{phi}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {coordType === "spherique" ? (
          <div>
            <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
              <span>Angle Zénithal (θ):</span>
              <span className="text-amber-500 font-extrabold">{theta}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="180"
              value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
              <span>Hauteur (z):</span>
              <span className="text-blue-500 font-extrabold">{zVal} px</span>
            </label>
            <input
              type="range"
              min="-60"
              max="90"
              value={zVal}
              onChange={(e) => setZVal(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
