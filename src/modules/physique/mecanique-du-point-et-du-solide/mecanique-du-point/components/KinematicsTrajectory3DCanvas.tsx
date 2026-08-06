"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Activity, Sparkles, Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type TrajectoryType = "helix" | "circular" | "parabolic";

export default function KinematicsTrajectory3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [trajectory, setTrajectory] = useState<TrajectoryType>("helix");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [time, setTime] = useState<number>(0);

  // Live vector values for stats UI
  const [omVector, setOmVector] = useState({ norm: 0 });
  const [vVector, setVVector] = useState({ norm: 0 });
  const [aVector, setAVector] = useState({ norm: 0 });

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 360;

    // Reset time and trail on trajectory change
    timeRef.current = 0;
    setTime(0);
    trailPointsRef.current = [];

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7.5, 6.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Grid & Reference Axes
    const grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const axesGroup = new THREE.Group();
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 4, 0xef4444, 0.25, 0.15);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 4, 0x10b981, 0.25, 0.15);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, 0x3b82f6, 0.25, 0.15);
    axesGroup.add(xAxis, yAxis, zAxis);
    scene.add(axesGroup);

    // 4. Trajectory Equations
    const getPositionAt = (t: number, type: TrajectoryType): THREE.Vector3 => {
      if (type === "helix") {
        const R = 2.5;
        const omega = 1.2;
        const vz = 0.5;
        const tCycle = (t % 8);
        return new THREE.Vector3(R * Math.cos(omega * tCycle), vz * tCycle - 2.0, R * Math.sin(omega * tCycle));
      } else if (type === "circular") {
        const R = 3;
        const omega = 1.5;
        return new THREE.Vector3(R * Math.cos(omega * t), 0, R * Math.sin(omega * t));
      } else {
        // Parabolic (projectile)
        const v0x = 2.2;
        const v0y = 4.2;
        const g = 2.8;
        const tCycle = (t % 3.0);
        const x = v0x * tCycle - 3.2;
        const y = Math.max(0, v0y * tCycle - 0.5 * g * tCycle * tCycle);
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

    // 5. Full Trajectory Reference Guide (Subtle background path)
    const guideGroup = new THREE.Group();
    scene.add(guideGroup);
    const buildFullGuidePath = () => {
      guideGroup.clear();
      const pts: THREE.Vector3[] = [];
      const steps = 180;
      const maxT = trajectory === "helix" ? 8 : trajectory === "circular" ? Math.PI * 2 : 3.0;
      for (let i = 0; i <= steps; i++) {
        pts.push(getPositionAt((i / steps) * maxT, trajectory));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(geo, mat);
      guideGroup.add(line);
    };
    buildFullGuidePath();

    // 6. High-Definition Dynamic Real-Time Trajectory Trail (Pre-allocated 600 points)
    const MAX_TRAIL = 600;
    const trailPositions = new Float32Array(MAX_TRAIL * 3);
    const trailGeometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(trailPositions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    trailGeometry.setAttribute("position", posAttr);
    trailGeometry.setDrawRange(0, 0);

    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xfbbf24, // Bright Neon Gold / Yellow
      transparent: true,
      opacity: 0.95,
    });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);

    // Dynamic Trail Glow Dots (Small spheres along the active trail behind M)
    const trailDotsGroup = new THREE.Group();
    scene.add(trailDotsGroup);

    const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const dotPool: THREE.Mesh[] = [];
    for (let i = 0; i < 30; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.visible = false;
      dotPool.push(dot);
      trailDotsGroup.add(dot);
    }

    // 7. Point M Sphere
    const particleGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particleMesh);

    // 8. Interactive Thin Vector Arrows
    const omArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x06b6d4, 0.22, 0.12);
    const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.22, 0.12);
    const aArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf43f5e, 0.22, 0.12);
    scene.add(omArrow, vArrow, aArrow);

    // 9. Orbit Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngleX = 0.6;
    let cameraAngleY = 0.5;
    const cameraRadius = 12.5;

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

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation Loop (Updates trail buffer in real time behind Point M)
    let lastTimestamp = performance.now();
    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        timeRef.current += delta * speedMultiplier;
        setTime(timeRef.current);

        const currentPos = getPositionAt(timeRef.current, trajectory);
        const trail = trailPointsRef.current;

        // Reset trail if cycle loops or distance jumps
        if (trail.length > 0 && trail[trail.length - 1].distanceTo(currentPos) > 2.0) {
          trailPointsRef.current = [currentPos.clone()];
        } else if (trail.length === 0 || trail[trail.length - 1].distanceTo(currentPos) > 0.02) {
          trail.push(currentPos.clone());
          if (trail.length > MAX_TRAIL) trail.shift();

          // Update line buffer attribute directly
          const positionsArr = posAttr.array as Float32Array;
          for (let i = 0; i < trail.length; i++) {
            positionsArr[i * 3] = trail[i].x;
            positionsArr[i * 3 + 1] = trail[i].y;
            positionsArr[i * 3 + 2] = trail[i].z;
          }
          posAttr.needsUpdate = true;
          trailGeometry.setDrawRange(0, trail.length);

          // Update trail glowing dots
          const step = Math.max(1, Math.floor(trail.length / 30));
          dotPool.forEach((dot, idx) => {
            const pIdx = trail.length - 1 - idx * step;
            if (pIdx >= 0 && pIdx < trail.length) {
              dot.position.copy(trail[pIdx]);
              dot.visible = true;
              const scale = Math.max(0.3, 1 - (idx / 30));
              dot.scale.set(scale, scale, scale);
            } else {
              dot.visible = false;
            }
          });
        }
      }

      const t = timeRef.current;
      const pos = getPositionAt(t, trajectory);
      const vel = getVelocityAt(t, trajectory);
      const acc = getAccelerationAt(t, trajectory);

      // Particle Position
      particleMesh.position.copy(pos);

      // Vectors OM, V, A
      const omNorm = pos.length();
      if (omNorm > 0.001) {
        omArrow.setDirection(pos.clone().normalize());
        omArrow.setLength(omNorm, 0.22, 0.12);
      }

      const vNorm = vel.length();
      vArrow.position.copy(pos);
      if (vNorm > 0.001) {
        vArrow.setDirection(vel.clone().normalize());
        vArrow.setLength(Math.min(vNorm * 0.55, 2.4), 0.2, 0.12);
      }

      const aNorm = acc.length();
      aArrow.position.copy(pos);
      if (aNorm > 0.001) {
        aArrow.setDirection(acc.clone().normalize());
        aArrow.setLength(Math.min(aNorm * 0.35, 2.0), 0.2, 0.12);
      }

      setOmVector({ norm: omNorm });
      setVVector({ norm: vNorm });
      setAVector({ norm: aNorm });

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
  }, [trajectory, isPlaying, speedMultiplier]);

  return (
    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Simulateur 3D : Trajectoire Lumineuse Déroulante derrière <LatexMath math="M(t)" /></span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            La trajectoire se trace en <strong className="text-amber-400 font-bold">ligne lumineuse en temps réel derrière le point matériel</strong>.
          </p>
        </div>

        {/* Eye Toggle & Trajectory Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500"
          >
            {showLegend ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showLegend ? "Masquer Légende" : "Afficher Légende"}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
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
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[280px] sm:h-[360px] cursor-grab active:cursor-grabbing" />

        {/* Collapsible Floating Legend Overlay */}
        {showLegend && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-mono space-y-1 shadow-lg pointer-events-none z-10 max-w-[230px] sm:max-w-none">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block" />
              <span>OM (Position) : ||OM|| = {omVector.norm.toFixed(2)} m</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-emerald-400 inline-block" />
              <span>Vitesse V : ||V|| = {vVector.norm.toFixed(2)} m/s</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-rose-400 inline-block" />
              <span>Accélération γ : ||γ|| = {aVector.norm.toFixed(2)} m/s²</span>
            </div>
          </div>
        )}

        {/* Orbit Hint */}
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-800 text-[9px] sm:text-[10px] text-slate-400 pointer-events-none">
          <span>🖱️ Pivotement 3D tactile</span>
        </div>
      </div>

      {/* Bottom Responsive Controls Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Effacer Trajectoire</span>
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
            className="w-16 sm:w-24 h-1.5 accent-amber-500 cursor-pointer rounded-lg bg-slate-800"
          />
          <span className="font-bold text-amber-400 text-[11px]">{speedMultiplier}x</span>
        </div>

        {/* Live Timer readout */}
        <div className="font-mono text-xs text-slate-400">
          t = <span className="text-amber-400 font-bold">{time.toFixed(2)} s</span>
        </div>
      </div>

    </div>
  );
}
