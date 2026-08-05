"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Activity, Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type TrajectoryType = "helix" | "circular" | "parabolic";

export default function KinematicsTrajectory3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [trajectory, setTrajectory] = useState<TrajectoryType>("helix");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [time, setTime] = useState<number>(0);

  // Live vector values for stats UI
  const [omVector, setOmVector] = useState({ x: 0, y: 0, z: 0, norm: 0 });
  const [vVector, setVVector] = useState({ x: 0, y: 0, z: 0, norm: 0 });
  const [aVector, setAVector] = useState({ x: 0, y: 0, z: 0, norm: 0 });

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = 420;

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Grid & Reference Axes
    const grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const axesGroup = new THREE.Group();
    // X axis - Red
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 4, 0xef4444, 0.3, 0.2);
    // Y axis - Green (Vertical in Three.js)
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 4, 0x10b981, 0.3, 0.2);
    // Z axis - Blue
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, 0x3b82f6, 0.3, 0.2);
    axesGroup.add(xAxis, yAxis, zAxis);
    scene.add(axesGroup);

    // 4. Trajectory Path Curve
    const pathGroup = new THREE.Group();
    scene.add(pathGroup);

    const getPositionAt = (t: number, type: TrajectoryType): THREE.Vector3 => {
      if (type === "helix") {
        const R = 2.5;
        const omega = 1.2;
        const vz = 0.5;
        return new THREE.Vector3(R * Math.cos(omega * t), vz * t - 1.5, R * Math.sin(omega * t));
      } else if (type === "circular") {
        const R = 3;
        const omega = 1.5;
        return new THREE.Vector3(R * Math.cos(omega * t), 0, R * Math.sin(omega * t));
      } else {
        // Parabolic (projectile)
        const v0x = 2;
        const v0y = 4;
        const g = 2.5;
        const tNorm = ((t % 4) + 4) % 4; // periodic 0 to 4
        const x = v0x * tNorm - 4;
        const y = Math.max(0, v0y * tNorm - 0.5 * g * tNorm * tNorm);
        return new THREE.Vector3(x, y, 0);
      }
    };

    const getVelocityAt = (t: number, type: TrajectoryType): THREE.Vector3 => {
      const dt = 0.001;
      const p1 = getPositionAt(t - dt, type);
      const p2 = getPositionAt(t + dt, type);
      return p2.sub(p1).divideScalar(2 * dt);
    };

    const getAccelerationAt = (t: number, type: TrajectoryType): THREE.Vector3 => {
      const dt = 0.001;
      const v1 = getVelocityAt(t - dt, type);
      const v2 = getVelocityAt(t + dt, type);
      return v2.sub(v1).divideScalar(2 * dt);
    };

    // Draw trajectory curve line
    const rebuildCurve = (type: TrajectoryType) => {
      pathGroup.clear();
      const points: THREE.Vector3[] = [];
      const steps = 300;
      const maxT = type === "helix" ? 6 : type === "circular" ? Math.PI * 2 : 4;
      for (let i = 0; i <= steps; i++) {
        const tVal = (i / steps) * maxT;
        points.push(getPositionAt(tVal, type));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 });
      const line = new THREE.Line(geometry, material);
      pathGroup.add(line);
    };

    rebuildCurve(trajectory);

    // 5. Particle Point M
    const particleGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particleMesh);

    // 6. Interactive Vector Arrows
    // Position vector OM - Cyan
    const omArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x06b6d4, 0.25, 0.15);
    // Velocity vector v - Emerald
    const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.25, 0.15);
    // Acceleration vector a - Rose
    const aArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf43f5e, 0.25, 0.15);

    scene.add(omArrow, vArrow, aArrow);

    // 7. Mouse Orbit Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngleX = 0.6;
    let cameraAngleY = 0.5;
    const cameraRadius = 12;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(0, 0.5, 0);
    };

    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraAngleX -= deltaX * 0.008;
      cameraAngleY += deltaY * 0.008;
      cameraAngleY = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, cameraAngleY));

      previousMousePosition = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Animation Loop
    let lastTimestamp = performance.now();
    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        timeRef.current += delta * speedMultiplier;
        setTime(timeRef.current);
      }

      const t = timeRef.current;
      const pos = getPositionAt(t, trajectory);
      const vel = getVelocityAt(t, trajectory);
      const acc = getAccelerationAt(t, trajectory);

      // Update Particle Mesh
      particleMesh.position.copy(pos);

      // Update OM Arrow (from origin to pos)
      const omNorm = pos.length();
      if (omNorm > 0.001) {
        omArrow.setDirection(pos.clone().normalize());
        omArrow.setLength(omNorm, 0.25, 0.15);
      }

      // Update V Arrow (from pos along velocity)
      const vNorm = vel.length();
      vArrow.position.copy(pos);
      if (vNorm > 0.001) {
        vArrow.setDirection(vel.clone().normalize());
        vArrow.setLength(Math.min(vNorm * 0.6, 2.5), 0.2, 0.12);
      }

      // Update A Arrow (from pos along acceleration)
      const aNorm = acc.length();
      aArrow.position.copy(pos);
      if (aNorm > 0.001) {
        aArrow.setDirection(acc.clone().normalize());
        aArrow.setLength(Math.min(aNorm * 0.4, 2.2), 0.2, 0.12);
      }

      // Live Stats update for UI
      setOmVector({ x: pos.x, y: pos.y, z: pos.z, norm: omNorm });
      setVVector({ x: vel.x, y: vel.y, z: vel.z, norm: vNorm });
      setAVector({ x: acc.x, y: acc.y, z: acc.z, norm: aNorm });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [trajectory, isPlaying, speedMultiplier]);

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Simulateur 3D Interactif Cinématique : Point Matériel <LatexMath math="M(t)" /></span>
          </h3>
          <p className="text-xs text-slate-400">
            Observez les vecteurs <span className="text-cyan-400 font-bold">OM</span> (Position), <span className="text-emerald-400 font-bold font-mono">v</span> (Vitesse) et <span className="text-rose-400 font-bold font-mono">a</span> (Accélération) en temps réel.
          </p>
        </div>

        {/* Trajectory Select Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setTrajectory("helix")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              trajectory === "helix"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Hélice 3D
          </button>
          <button
            onClick={() => setTrajectory("circular")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              trajectory === "circular"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Circulaire
          </button>
          <button
            onClick={() => setTrajectory("parabolic")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              trajectory === "parabolic"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Parabolique
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[380px] sm:h-[420px] cursor-grab active:cursor-grabbing" />

        {/* Floating Legend Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-cyan-400 inline-block" />
            <span>OM (Position) : ||OM|| = {omVector.norm.toFixed(2)} m</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>v (Vitesse) : ||v|| = {vVector.norm.toFixed(2)} m/s</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-rose-400 inline-block" />
            <span>a (Accélération) : ||a|| = {aVector.norm.toFixed(2)} m/s²</span>
          </div>
        </div>

        {/* Orbit Hint */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400 pointer-events-none">
          <span>🖱️ Glissez pour pivoter la caméra 3D</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
          
          <button
            onClick={() => {
              timeRef.current = 0;
              setTime(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Vitesse:</span>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.2"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-24 accent-amber-500 cursor-pointer"
          />
          <span className="w-8 font-bold text-amber-400">{speedMultiplier}x</span>
        </div>

        {/* Live Timer readout */}
        <div className="font-mono text-xs text-slate-400">
          Temps t = <span className="text-amber-400 font-bold">{time.toFixed(2)} s</span>
        </div>
      </div>

    </div>
  );
}
