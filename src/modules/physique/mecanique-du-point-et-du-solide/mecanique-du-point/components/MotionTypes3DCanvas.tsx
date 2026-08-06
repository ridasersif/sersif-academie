"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Activity, Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type MotionKind = "mru" | "mruv" | "mcu" | "mcuv" | "helical" | "parabolic";

export default function MotionTypes3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [motionType, setMotionType] = useState<MotionKind>("mcu");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [time, setTime] = useState<number>(0);

  // Live stats
  const [vNorm, setVNorm] = useState<number>(0);
  const [aNorm, setANorm] = useState<number>(0);

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 380;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Grid & Reference Axes
    const grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const axesGroup = new THREE.Group();
    axesGroup.add(
      new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 4, 0xef4444, 0.3, 0.2),
      new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 4, 0x10b981, 0.3, 0.2),
      new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, 0x3b82f6, 0.3, 0.2)
    );
    scene.add(axesGroup);

    // 4. Motion Position Equations
    const getPositionAt = (t: number, kind: MotionKind): THREE.Vector3 => {
      if (kind === "mru") {
        const v0 = 2.0;
        const x = (v0 * (t % 4)) - 4;
        return new THREE.Vector3(x, 0, 0);
      } else if (kind === "mruv") {
        const a0 = 0.8;
        const tCycle = (t % 3.5);
        const x = 0.5 * a0 * tCycle * tCycle - 3.5;
        return new THREE.Vector3(x, 0, 0);
      } else if (kind === "mcu") {
        const R = 3.0;
        const omega = 1.5;
        return new THREE.Vector3(R * Math.cos(omega * t), 0, R * Math.sin(omega * t));
      } else if (kind === "mcuv") {
        const R = 3.0;
        const alpha = 0.6;
        const tCycle = (t % 4.5);
        const theta = 0.5 * alpha * tCycle * tCycle;
        return new THREE.Vector3(R * Math.cos(theta), 0, R * Math.sin(theta));
      } else if (kind === "helical") {
        const R = 2.5;
        const omega = 1.2;
        const vz = 0.6;
        return new THREE.Vector3(R * Math.cos(omega * t), vz * (t % 6) - 1.8, R * Math.sin(omega * t));
      } else {
        // Parabolic
        const v0x = 2.5;
        const v0y = 4.5;
        const g = 3.0;
        const tCycle = (t % 3.0);
        const x = v0x * tCycle - 3.5;
        const y = Math.max(0, v0y * tCycle - 0.5 * g * tCycle * tCycle);
        return new THREE.Vector3(x, y, 0);
      }
    };

    const getVelocityAt = (t: number, kind: MotionKind): THREE.Vector3 => {
      const dt = 0.001;
      const p1 = getPositionAt(t - dt, kind);
      const p2 = getPositionAt(t + dt, kind);
      return p2.sub(p1).divideScalar(2 * dt);
    };

    const getAccelerationAt = (t: number, kind: MotionKind): THREE.Vector3 => {
      const dt = 0.001;
      const v1 = getVelocityAt(t - dt, kind);
      const v2 = getVelocityAt(t + dt, kind);
      return v2.sub(v1).divideScalar(2 * dt);
    };

    // 5. Dynamic Dashed Trajectory Line (Khat Mota9ati3)
    trailPointsRef.current = [];
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.25,
      gapSize: 0.15,
      linewidth: 2,
      transparent: true,
      opacity: 0.9
    });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);

    // 6. Particle Point M
    const particleGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const particleMesh = new THREE.Mesh(particleGeo, particleMat);
    scene.add(particleMesh);

    // 7. Velocity & Acceleration Vector Arrows
    const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.25, 0.15);
    const aArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf43f5e, 0.25, 0.15);
    scene.add(vArrow, aArrow);

    // 8. Orbit Controls & Resize Handler
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.6;
    let cameraAngleY = 0.5;
    const cameraRadius = 11;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(0, 0.5, 0);
    };

    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      cameraAngleX -= dx * 0.008;
      cameraAngleY += dy * 0.008;
      cameraAngleY = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, cameraAngleY));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => { isDragging = false; };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 380;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isPlaying) {
        timeRef.current += delta * speedMultiplier;
        setTime(timeRef.current);

        const currentPos = getPositionAt(timeRef.current, motionType);
        const trail = trailPointsRef.current;

        // If cycle resets (distance jump), clear trail
        if (trail.length > 0 && trail[trail.length - 1].distanceTo(currentPos) > 2.0) {
          trailPointsRef.current = [];
        } else if (trail.length === 0 || trail[trail.length - 1].distanceTo(currentPos) > 0.04) {
          trail.push(currentPos.clone());
          if (trail.length > 300) trail.shift();
          trailGeometry.setFromPoints(trail);
          trailLine.computeLineDistances(); // Re-compute dashes along path!
        }
      }

      const t = timeRef.current;
      const pos = getPositionAt(t, motionType);
      const vel = getVelocityAt(t, motionType);
      const acc = getAccelerationAt(t, motionType);

      particleMesh.position.copy(pos);

      // Update V Arrow
      const vL = vel.length();
      vArrow.position.copy(pos);
      if (vL > 0.01) {
        vArrow.setDirection(vel.clone().normalize());
        vArrow.setLength(Math.min(vL * 0.5, 2.2), 0.2, 0.12);
      }

      // Update A Arrow
      const aL = acc.length();
      aArrow.position.copy(pos);
      if (aL > 0.01) {
        aArrow.setDirection(acc.clone().normalize());
        aArrow.setLength(Math.min(aL * 0.4, 2.0), 0.2, 0.12);
      }

      setVNorm(vL);
      setANorm(aL);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(domElement)) container.removeChild(domElement);
    };
  }, [motionType, isPlaying, speedMultiplier]);

  return (
    <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Simulateur 3D Types de Mouvements : Trajectoire Pointillée en Temps Réel</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Observez la trajectoire <strong className="text-cyan-400">se tracer en trait pointillé</strong> au passage du point matériel <LatexMath math="M(t)" />.
          </p>
        </div>

        {/* Motion Type Selectors */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => { setMotionType("mru"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "mru" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            MRU
          </button>
          <button
            onClick={() => { setMotionType("mruv"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "mruv" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            MRUV
          </button>
          <button
            onClick={() => { setMotionType("mcu"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "mcu" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            MCU
          </button>
          <button
            onClick={() => { setMotionType("mcuv"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "mcuv" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            MCUV
          </button>
          <button
            onClick={() => { setMotionType("helical"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "helical" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Hélicoïdal
          </button>
          <button
            onClick={() => { setMotionType("parabolic"); trailPointsRef.current = []; timeRef.current = 0; }}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              motionType === "parabolic" ? "bg-cyan-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Parabolique
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[320px] sm:h-[400px] cursor-grab active:cursor-grabbing" />

        {/* Live Overlay Legend */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-mono space-y-1 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block" />
            <span>Trajectoire : Trait pointillé bleu</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>Vitesse V : ||V|| = {vNorm.toFixed(2)} m/s</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-rose-400 inline-block" />
            <span>Accélération γ : ||γ|| = {aNorm.toFixed(2)} m/s²</span>
          </div>
        </div>

        {/* Orbit Hint */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-800 text-[9px] sm:text-[10px] text-slate-400 pointer-events-none">
          <span>🖱️ Pivotement 3D tactile</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
          
          <button
            onClick={() => {
              timeRef.current = 0;
              setTime(0);
              trailPointsRef.current = [];
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Effacer Trajectoire</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vitesse:</span>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.2"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-20 sm:w-24 accent-cyan-500 cursor-pointer"
          />
          <span className="w-8 font-bold text-cyan-400">{speedMultiplier}x</span>
        </div>

        {/* Live Timer readout */}
        <div className="font-mono text-xs text-slate-400">
          Temps t = <span className="text-cyan-400 font-bold">{time.toFixed(2)} s</span>
        </div>
      </div>

    </div>
  );
}
