"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface ScientificBackgroundProps {
  type?: "physique" | "chimie" | "mecanique" | "electricite";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  shape: "circle" | "hex" | "gear";
  rotation: number;
  rotSpeed: number;
}

export default function ScientificBackground({ type = "physique" }: ScientificBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Particle color palettes based on subject type
    let mainColor = "59, 130, 246";
    let secondaryColor = "99, 102, 241";

    if (type === "mecanique") {
      mainColor = isDark ? "14, 165, 233" : "2, 132, 199";     // Sky / Cyan
      secondaryColor = isDark ? "99, 102, 241" : "79, 70, 229"; // Indigo
    } else if (type === "electricite") {
      mainColor = isDark ? "234, 179, 8" : "202, 138, 4";       // Yellow / Amber
      secondaryColor = isDark ? "6, 182, 212" : "8, 145, 178";  // Cyan / Blue
    } else if (type === "chimie") {
      mainColor = isDark ? "16, 185, 129" : "5, 150, 105";     // Emerald
      secondaryColor = isDark ? "20, 184, 166" : "13, 148, 136";  // Teal
    } else {
      mainColor = isDark ? "59, 130, 246" : "37, 99, 235";     // Blue
      secondaryColor = isDark ? "99, 102, 241" : "79, 70, 229";  // Indigo
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 70);

      for (let i = 0; i < count; i++) {
        const shapeChoice = type === "mecanique"
          ? (Math.random() > 0.4 ? "gear" : "circle")
          : type === "electricite"
          ? (Math.random() > 0.7 ? "hex" : "circle")
          : (Math.random() > 0.4 ? "circle" : "hex");

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 2 + Math.random() * 5,
          alpha: 0.2 + Math.random() * 0.5,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          shape: shapeChoice,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
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

    // Helper to draw mechanical gear wheel
    const drawGear = (x: number, y: number, r: number, rotation: number) => {
      const teeth = 8;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const angle = (Math.PI * 2 / teeth) * i + rotation;
        const outerR = r * 1.4;
        const innerR = r * 0.9;

        const x1 = x + innerR * Math.cos(angle - 0.1);
        const y1 = y + innerR * Math.sin(angle - 0.1);
        const x2 = x + outerR * Math.cos(angle - 0.05);
        const y2 = y + outerR * Math.sin(angle - 0.05);
        const x3 = x + outerR * Math.cos(angle + 0.05);
        const y3 = y + outerR * Math.sin(angle + 0.05);
        const x4 = x + innerR * Math.cos(angle + 0.1);
        const y4 = y + innerR * Math.sin(angle + 0.1);

        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
      }
      ctx.closePath();
    };

    const drawLightning = (x1: number, y1: number, x2: number, y2: number, color: string, segments: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const dx = x2 - x1;
      const dy = y2 - y1;
      for (let i = 1; i <= segments; i++) {
        const progress = i / segments;
        const targetX = x1 + dx * progress;
        const targetY = y1 + dy * progress;
        const jitter = (1 - progress) * 20; 
        const newX = i === segments ? x2 : targetX + (Math.random() - 0.5) * jitter;
        const newY = i === segments ? y2 : targetY + (Math.random() - 0.5) * jitter;
        ctx.lineTo(newX, newY);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 + Math.random();
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();
    };

    let step = 0;
    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Blueprint / Engineering Coordinate Grid for Mechanics
      const gridSize = type === "mecanique" ? 80 : 60;
      ctx.lineWidth = 0.75;

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const distFromCenter = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          );
          const gridAlpha = (1 - distFromCenter / (width * 0.85)) * (isDark ? 0.08 : 0.05);

          if (gridAlpha > 0) {
            ctx.strokeStyle = `rgba(${mainColor}, ${gridAlpha})`;
            
            if (type === "mecanique") {
              // Draw coordinate vectors (+) at grid intersections for mechanics
              ctx.strokeRect(x, y, gridSize, gridSize);
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${mainColor}, ${gridAlpha * 2})`;
              ctx.fill();
            } else {
              ctx.strokeRect(x, y, gridSize, gridSize);
            }
          }
        }
      }

      // Draw large mechanical gear assembly in background for Mechanics
      if (type === "mecanique") {
        ctx.save();
        const gearAlpha = isDark ? 0.04 : 0.03;
        ctx.strokeStyle = `rgba(${mainColor}, ${gearAlpha})`;
        ctx.lineWidth = 1.5;

        // Big gear center right
        drawGear(width * 0.85, height * 0.4, 120, step * 0.15);
        ctx.stroke();

        // Meshing gear top left
        drawGear(width * 0.12, height * 0.25, 90, -step * 0.2);
        ctx.stroke();

        // Pendulum vector arc
        ctx.beginPath();
        const pendAngle = Math.sin(step * 1.5) * 0.3 + Math.PI / 2;
        const pendX = width * 0.5 + Math.cos(pendAngle) * 160;
        const pendY = height * 0.05 + Math.sin(pendAngle) * 160;
        ctx.moveTo(width * 0.5, height * 0.05);
        ctx.lineTo(pendX, pendY);
        ctx.arc(pendX, pendY, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 2. Animated Floating Sci-Fi Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

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
        } else if (p.shape === "gear") {
          ctx.lineWidth = 1;
          drawGear(p.x, p.y, p.size * 1.5, p.rotation);
          ctx.stroke();
        } else {
          ctx.lineWidth = 1;
          drawHexagon(p.x, p.y, p.size * 1.8);
          ctx.stroke();
        }

        ctx.restore();

        // Mouse interaction for electricity: Lightning strikes!
        if (type === "electricite" && mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 250) {
            const intensity = 1 - (mDist / 250);
            if (Math.random() < 0.15 * intensity) {
              drawLightning(p.x, p.y, mouse.x, mouse.y, `rgba(${mainColor}, ${intensity})`, 5);
            }
            // Magnetic pull
            p.x -= mdx * 0.02 * intensity;
            p.y -= mdy * 0.02 * intensity;
          }
        }

        // Connect nearby nodes with laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.12 : 0.06);
            ctx.strokeStyle = `rgba(${mainColor}, ${lineAlpha * (type === "electricite" ? 1.8 : 1)})`;
            ctx.lineWidth = type === "electricite" ? 1.5 : 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            
            // Draw electric jagged arc for electricity
            if (type === "electricite" && Math.random() > 0.4) {
              const midX = (p.x + p2.x) / 2 + (Math.random() - 0.5) * 20;
              const midY = (p.y + p2.y) / 2 + (Math.random() - 0.5) * 20;
              ctx.lineTo(midX, midY);
            }

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, theme, type]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background pointer-events-none">
      {/* Animated Holographic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Atmospheric Glowing Aurora Lights */}
      {type === "mecanique" ? (
        <>
          <div
            className={`absolute -top-32 -left-32 w-[45rem] h-[45rem] rounded-full filter blur-[150px] opacity-45 ${
              isDark ? "bg-sky-600/35" : "bg-sky-400/40"
            } animate-pulse`}
            style={{ animationDuration: "10s" }}
          ></div>
          <div
            className={`absolute top-1/3 -right-32 w-[50rem] h-[50rem] rounded-full filter blur-[160px] opacity-35 ${
              isDark ? "bg-indigo-600/30" : "bg-indigo-400/40"
            }`}
          ></div>
        </>
      ) : type === "electricite" ? (
        <>
          <div
            className={`absolute -top-32 -left-32 w-[45rem] h-[45rem] rounded-full filter blur-[150px] opacity-45 ${
              isDark ? "bg-amber-600/35" : "bg-yellow-400/40"
            } animate-pulse`}
            style={{ animationDuration: "7s" }}
          ></div>
          <div
            className={`absolute top-1/3 -right-32 w-[50rem] h-[50rem] rounded-full filter blur-[160px] opacity-35 ${
              isDark ? "bg-cyan-600/30" : "bg-cyan-400/40"
            }`}
          ></div>
        </>
      ) : type === "physique" ? (
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
        </>
      )}
    </div>
  );
}
