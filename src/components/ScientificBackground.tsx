"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface ScientificBackgroundProps {
  type?: "physique" | "chimie";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  shape: "circle" | "hex";
}

export default function ScientificBackground({ type = "physique" }: ScientificBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === "dark";
    const isPhysique = type === "physique";

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Particle color palettes
    const mainColor = isPhysique
      ? isDark ? "59, 130, 246" : "37, 99, 235"    // Blue
      : isDark ? "16, 185, 129" : "5, 150, 105";   // Emerald

    const secondaryColor = isPhysique
      ? isDark ? "99, 102, 241" : "79, 70, 229"    // Indigo
      : isDark ? "20, 184, 166" : "13, 148, 136";  // Teal

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 70);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 2 + Math.random() * 4,
          alpha: 0.2 + Math.random() * 0.5,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          shape: Math.random() > 0.4 ? "circle" : "hex",
        });
      }
    };

    initParticles();

    // Helper to draw hexagon
    const drawHexagon = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    let step = 0;
    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Futuristic Holographic Grid Matrix
      const gridSize = 60;
      ctx.lineWidth = 0.75;

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const distFromCenter = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          );
          const gridAlpha = (1 - distFromCenter / (width * 0.8)) * (isDark ? 0.07 : 0.04);

          if (gridAlpha > 0) {
            ctx.strokeStyle = `rgba(${mainColor}, ${gridAlpha})`;
            ctx.strokeRect(x, y, gridSize, gridSize);
          }
        }
      }

      // 2. Animated Floating Sci-Fi Particles & Molecular Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(step * p.pulseSpeed * 10) * 0.15;
        const color = i % 2 === 0 ? mainColor : secondaryColor;

        ctx.save();
        ctx.fillStyle = `rgba(${color}, ${Math.max(0.05, currentAlpha)})`;
        ctx.strokeStyle = `rgba(${color}, ${Math.max(0.1, currentAlpha * 1.2)})`;
        ctx.shadowColor = `rgba(${color}, 0.8)`;
        ctx.shadowBlur = 10;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 1;
          drawHexagon(p.x, p.y, p.size * 1.8);
          ctx.stroke();
        }

        ctx.restore();

        // Connect nearby nodes with laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.12 : 0.06);
            ctx.strokeStyle = `rgba(${mainColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, theme, type]);

  if (!mounted) return null;

  const isDark = theme === "dark";
  const isPhysique = type === "physique";

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background pointer-events-none">
      {/* Animated Holographic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Atmospheric Glowing Aurora Lights */}
      {isPhysique ? (
        <>
          <div
            className={`absolute -top-32 -left-32 w-[45rem] h-[45rem] rounded-full filter blur-[150px] opacity-45 ${
              isDark ? "bg-blue-600/30" : "bg-blue-400/40"
            } animate-pulse`}
            style={{ animationDuration: "12s" }}
          ></div>
          <div
            className={`absolute top-1/3 -right-32 w-[50rem] h-[50rem] rounded-full filter blur-[160px] opacity-35 ${
              isDark ? "bg-indigo-600/25" : "bg-indigo-300/40"
            }`}
          ></div>
          <div
            className={`absolute -bottom-32 left-1/3 w-[40rem] h-[40rem] rounded-full filter blur-[150px] opacity-30 ${
              isDark ? "bg-cyan-600/20" : "bg-cyan-300/30"
            }`}
          ></div>
        </>
      ) : (
        <>
          <div
            className={`absolute -top-32 -left-32 w-[45rem] h-[45rem] rounded-full filter blur-[150px] opacity-45 ${
              isDark ? "bg-emerald-600/30" : "bg-emerald-400/40"
            } animate-pulse`}
            style={{ animationDuration: "12s" }}
          ></div>
          <div
            className={`absolute top-1/3 -right-32 w-[50rem] h-[50rem] rounded-full filter blur-[160px] opacity-35 ${
              isDark ? "bg-teal-600/25" : "bg-teal-300/40"
            }`}
          ></div>
          <div
            className={`absolute -bottom-32 left-1/3 w-[40rem] h-[40rem] rounded-full filter blur-[150px] opacity-30 ${
              isDark ? "bg-green-600/20" : "bg-green-300/30"
            }`}
          ></div>
        </>
      )}
    </div>
  );
}
