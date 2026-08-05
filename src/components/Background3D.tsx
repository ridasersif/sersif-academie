"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
}

export default function Background3D() {
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

    // Mouse tracking state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160, // Wider repulsion radius
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Determine color palette based on current theme
    const isDark = theme === "dark";
    const particleColors = isDark
      ? [
          "rgba(59, 130, 246, 0.75)",   // Blue
          "rgba(16, 185, 129, 0.75)",   // Emerald
          "rgba(99, 102, 241, 0.75)",   // Indigo
          "rgba(14, 165, 233, 0.75)",   // Cyan
        ]
      : [
          "rgba(37, 99, 235, 0.65)",    // Blue
          "rgba(5, 150, 105, 0.65)",    // Emerald
          "rgba(79, 70, 229, 0.65)",    // Indigo
          "rgba(2, 132, 199, 0.65)",    // Cyan
        ];

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      // Large swarm of ant particles (around 350-500 on desktop)
      const count = Math.min(Math.floor((width * height) / 1800), 500);

      for (let i = 0; i < count; i++) {
        // Ant-like base velocity (erratic ant speed)
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.7 + Math.random() * 1.1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: 1.5 + Math.random() * 2.0,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
        });
      }
    };

    initParticles();

    // Render loop
    let frameCount = 0;
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between nearby particles
      const lineDist = 65;
      const lineColor = isDark ? "rgba(255, 255, 255," : "rgba(30, 41, 59,";

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < lineDist) {
            const alpha = (1 - dist / lineDist) * (isDark ? 0.15 : 0.08);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Ant-like twitchy/Brownian motion jitter every ~15-30 frames
        if (frameCount % (12 + (i % 10)) === 0) {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
        }

        // 2. Mouse Repulsion ("yhrob bhal nmal")
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 7.0; // Strong repulsion force
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // 3. Apply velocity damping so they return to natural speed smoothly
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Keep minimum speed so they keep moving like ants
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed < 0.5) {
          const angle = Math.atan2(p.vy, p.vx) || Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * 0.8;
          p.vy = Math.sin(angle) * 0.8;
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // 4. Wrap around screen edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // 5. Draw Particle Dot with glow
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, theme]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background pointer-events-none">
      {/* Dynamic Interactive Ant-Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-auto"
      />

      {/* Ambient Glowing Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full filter blur-[130px] opacity-40 ${
          isDark ? "bg-blue-600/20" : "bg-blue-300/40"
        } animate-pulse pointer-events-none`}
        style={{ animationDuration: "10s" }}
      ></div>

      <div
        className={`absolute top-40 -right-20 w-[45rem] h-[45rem] rounded-full filter blur-[130px] opacity-40 ${
          isDark ? "bg-emerald-600/15" : "bg-emerald-300/30"
        } animate-pulse pointer-events-none`}
        style={{ animationDuration: "14s", animationDelay: "3s" }}
      ></div>

      <div
        className={`absolute -bottom-40 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] rounded-full filter blur-[130px] opacity-30 ${
          isDark ? "bg-indigo-600/15" : "bg-indigo-300/20"
        } pointer-events-none`}
      ></div>
    </div>
  );
}
