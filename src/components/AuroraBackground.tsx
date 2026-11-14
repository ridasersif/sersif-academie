'use client';
import React, { useEffect, useRef } from 'react';

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    
    const render = () => {
      time += 0.005;
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;

      // Dark background
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, w, h);

      // Create a gradient for the aurora
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, `rgba(16, 185, 129, 0.15)`); // emerald
      gradient.addColorStop(0.5, `rgba(14, 165, 233, 0.15)`); // sky blue
      gradient.addColorStop(1, `rgba(139, 92, 246, 0.15)`); // violet

      ctx.fillStyle = gradient;

      // Draw flowing waves
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i < w; i += 10) {
        const y = h * 0.5 + Math.sin(i * 0.005 + time) * 100 + Math.sin(i * 0.01 + time * 0.5) * 50;
        ctx.lineTo(i, y);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Second wave
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i < w; i += 10) {
        const y = h * 0.7 + Math.sin(i * 0.003 - time * 1.2) * 150 + Math.cos(i * 0.008 + time) * 80;
        ctx.lineTo(i, y);
      }
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fill();

      requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover -z-10" />;
}
