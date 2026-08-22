"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function ElectricBackground() {
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

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Mouse Interaction
    const mouse = { x: width / 2, y: height / 2, active: false };
    const onMouseMove = (e: MouseEvent) => {
       mouse.x = e.clientX;
       mouse.y = e.clientY;
       mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    
    // Responsive Canvas
    const onResize = () => {
       width = canvas.width = window.innerWidth;
       height = canvas.height = window.innerHeight;
       init();
    };
    window.addEventListener("resize", onResize);

    const isDark = theme === "dark";
    
    // Grid Size for the circuit board
    const gridSize = 60;
    
    // Electrons moving along grid lines
    let electrons: any[] = [];
    const numElectrons = 100; // Lots of activity
    
    const spawnElectron = (randomPos = false) => {
       const isHorizontal = Math.random() > 0.5;
       const col = Math.floor(Math.random() * (width / gridSize));
       const row = Math.floor(Math.random() * (height / gridSize));
       
       const speed = (Math.random() * 2.5 + 1.5) * (Math.random() > 0.5 ? 1 : -1);
       
       let x, y, vx, vy;
       if (isHorizontal) {
           x = randomPos ? Math.random() * width : (speed > 0 ? -10 : width + 10);
           y = row * gridSize;
           vx = speed;
           vy = 0;
       } else {
           x = col * gridSize;
           y = randomPos ? Math.random() * height : (speed > 0 ? -10 : height + 10);
           vx = 0;
           vy = speed;
       }
       
       electrons.push({
           x,
           y,
           vx,
           vy,
           color: Math.random() > 0.5 ? (isDark ? "#eab308" : "#ca8a04") : (isDark ? "#06b6d4" : "#0891b2"),
           size: Math.random() * 1.5 + 1
       });
    };
    
    const init = () => {
       electrons = [];
       for (let i = 0; i < numElectrons; i++) {
           spawnElectron(true);
       }
    };
    
    init();

    let animationId: number;

    const render = () => {
       // Trail effect for glowing electrons
       ctx.fillStyle = isDark ? "rgba(3, 7, 18, 0.25)" : "rgba(248, 250, 252, 0.25)";
       ctx.fillRect(0, 0, width, height);

       const cols = Math.ceil(width / gridSize);
       const rows = Math.ceil(height / gridSize);
       
       // 1. Draw Circuit Grid that lights up near mouse
       ctx.lineWidth = 1;
       
       for (let i = 0; i <= cols; i++) {
           const x = i * gridSize;
           for (let j = 0; j <= rows; j++) {
               const y = j * gridSize;
               
               // Distance from mouse for spotlight effect
               const dx = x - mouse.x;
               const dy = y - mouse.y;
               const dist = Math.sqrt(dx*dx + dy*dy);
               
               let alpha = isDark ? 0.03 : 0.05;
               if (mouse.active && dist < 350) {
                   alpha += (1 - dist / 350) * 0.6; // Spotlight brightens the grid
               }
               
               const strokeColor = isDark ? `rgba(14, 165, 233, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
               
               // Horizontal line
               if (i < cols) {
                   ctx.beginPath();
                   ctx.moveTo(x, y);
                   ctx.lineTo(x + gridSize, y);
                   ctx.strokeStyle = strokeColor;
                   ctx.stroke();
               }
               
               // Vertical line
               if (j < rows) {
                   ctx.beginPath();
                   ctx.moveTo(x, y);
                   ctx.lineTo(x, y + gridSize);
                   ctx.strokeStyle = strokeColor;
                   ctx.stroke();
               }
               
               // Glowing Node at intersections near mouse
               if (mouse.active && dist < 200) {
                   ctx.beginPath();
                   ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                   ctx.fillStyle = isDark ? `rgba(234, 179, 8, ${(1 - dist / 200) * 0.9})` : `rgba(202, 138, 4, ${(1 - dist / 200) * 0.9})`;
                   ctx.shadowBlur = 10;
                   ctx.shadowColor = isDark ? "#eab308" : "#ca8a04";
                   ctx.fill();
                   ctx.shadowBlur = 0; // reset
               }
           }
       }
       
       // 2. Draw moving Electrons
       for (let i = electrons.length - 1; i >= 0; i--) {
           const e = electrons[i];
           e.x += e.vx;
           e.y += e.vy;
           
           // Boost speed if near mouse (magnetic acceleration)
           if (mouse.active) {
               const edx = e.x - mouse.x;
               const edy = e.y - mouse.y;
               const edist = Math.sqrt(edx*edx + edy*edy);
               if (edist < 150) {
                   e.x += e.vx * 0.5;
                   e.y += e.vy * 0.5;
               }
           }
           
           ctx.beginPath();
           ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
           ctx.fillStyle = e.color;
           ctx.shadowBlur = 15;
           ctx.shadowColor = e.color;
           ctx.fill();
           ctx.shadowBlur = 0; // reset
           
           // Respawn if off-screen
           if (e.x < -gridSize || e.x > width + gridSize || e.y < -gridSize || e.y > height + gridSize) {
               electrons.splice(i, 1);
               spawnElectron();
           }
       }
       
       animationId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
       window.removeEventListener("mousemove", onMouseMove);
       window.removeEventListener("mouseleave", onMouseLeave);
       window.removeEventListener("resize", onResize);
       cancelAnimationFrame(animationId);
    };
  }, [mounted, theme]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      
      {/* Soft Ambient Corner Glows to match the grid */}
      <div
        className={`absolute -bottom-32 -left-32 w-[40rem] h-[40rem] rounded-full filter blur-[150px] opacity-20 ${
          isDark ? "bg-amber-600/30" : "bg-yellow-400/30"
        } animate-pulse`}
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className={`absolute top-0 -right-32 w-[50rem] h-[50rem] rounded-full filter blur-[160px] opacity-10 ${
          isDark ? "bg-cyan-600/30" : "bg-cyan-400/30"
        }`}
      ></div>
    </div>
  );
}
