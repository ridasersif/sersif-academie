"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Compass, Play, Pause, Eye, EyeOff, RotateCcw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function FrenetFrame3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Controls & States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  // Live computed intrinsic stats
  const [stats, setStats] = useState({
    speed: 0,
    rc: 0,
    aT: 0,
    aN: 0,
    aTotal: 0,
  });

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 360;

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
    const dLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dLight.position.set(5, 10, 7);
    scene.add(dLight);

    // 3. Grid
    const grid = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    grid.position.y = -1.2;
    scene.add(grid);

    // 4. 3D Curvilinear Trajectory Equations (3D Wavy Curve with varying curvature)
    const getPosAt = (u: number): THREE.Vector3 => {
      const x = 3.2 * Math.cos(u);
      const y = 0.85 * Math.sin(2 * u);
      const z = 2.4 * Math.sin(u);
      return new THREE.Vector3(x, y, z);
    };

    const getVelAt = (u: number): THREE.Vector3 => {
      const du = 0.001;
      const p1 = getPosAt(u - du);
      const p2 = getPosAt(u + du);
      return p2.sub(p1).divideScalar(2 * du);
    };

    const getAccAt = (u: number): THREE.Vector3 => {
      const du = 0.001;
      const v1 = getVelAt(u - du);
      const v2 = getVelAt(u + du);
      return v2.sub(v1).divideScalar(2 * du);
    };

    // Draw full 3D Curvilinear Trajectory Path
    const trajGroup = new THREE.Group();
    scene.add(trajGroup);
    const numTrajPts = 200;
    const trajPts: THREE.Vector3[] = [];
    for (let i = 0; i <= numTrajPts; i++) {
      const u = (i / numTrajPts) * Math.PI * 2;
      trajPts.push(getPosAt(u));
    }
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajPts);
    const trajMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const trajLine = new THREE.LineLoop(trajGeo, trajMat);
    trajGroup.add(trajLine);

    // Dynamic Osculating Circle & Curvature Group
    const osculatingCircleGroup = new THREE.Group();
    scene.add(osculatingCircleGroup);

    const oscCircleMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    const centerMeshGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const centerMeshMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const centerMesh = new THREE.Mesh(centerMeshGeo, centerMeshMat);
    scene.add(centerMesh);

    // Point M Particle Mesh
    const particleGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    });
    const particleMesh = new THREE.Mesh(particleGeo, particleMat);
    scene.add(particleMesh);

    // Frenet Frame Vector Helpers (tau: Cyan, n: Emerald, b: Rose)
    const tauArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.6, 0x06b6d4, 0.22, 0.12);
    const nArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.6, 0x10b981, 0.22, 0.12);
    const bArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.6, 0xf43f5e, 0.22, 0.12);
    scene.add(tauArrow, nArrow, bArrow);

    // Acceleration Vectors (a_T tau: Amber, a_N n: Purple, Total gamma: Pink)
    const atArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xfacc15, 0.18, 0.1);
    const anArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0xa855f7, 0.18, 0.1);
    const aTotalArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 1, 0).normalize(), new THREE.Vector3(0, 0, 0), 1, 0xec4899, 0.24, 0.14);
    scene.add(atArrow, anArrow, aTotalArrow);

    // Radius line C -> M
    const radiusLineGeo = new THREE.BufferGeometry();
    const radiusLineMat = new THREE.LineDashedMaterial({ color: 0x10b981, dashSize: 0.15, gapSize: 0.1 });
    const radiusLine = new THREE.Line(radiusLineGeo, radiusLineMat);
    scene.add(radiusLine);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.7;
    let cameraAngleY = 0.4;
    const cameraRadius = 11.5;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(0, 0, 0);
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
      height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", handleResize);

    // Animation & Physics Loop along 3D Curvilinear Trajectory
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        timeRef.current += delta * speedMultiplier * 0.6;
      }

      const u = timeRef.current;

      // 1. Position, Velocity, Acceleration in 3D
      const pos = getPosAt(u);
      const vel = getVelAt(u);
      const acc = getAccAt(u);

      const vNorm = vel.length();

      // Tangent Unit Vector tau
      const tau = vel.clone().normalize();

      // Tangential Acceleration scalar a_T = acc . tau
      const aT_val = acc.dot(tau);
      const aT_vec = tau.clone().multiplyScalar(aT_val);

      // Normal Acceleration vector a_N = acc - a_T * tau
      const aN_vec = acc.clone().sub(aT_vec);
      const aN_val = aN_vec.length();

      // Normal Unit Vector n (pointing towards center of curvature C)
      const n = aN_val > 0.001 ? aN_vec.clone().normalize() : new THREE.Vector3(0, 1, 0);

      // Binormal Unit Vector b = tau x n
      const b = new THREE.Vector3().crossVectors(tau, n).normalize();

      // Radius of curvature Rc = v^2 / a_N
      const Rc_val = aN_val > 0.05 ? (vNorm * vNorm) / aN_val : 5.0;

      // Center of Curvature C = pos + Rc * n
      const centerC = pos.clone().add(n.clone().multiplyScalar(Rc_val));

      // Particle Position
      particleMesh.position.copy(pos);
      centerMesh.position.copy(centerC);

      // Radius line C -> M
      const rPts = [centerC.clone(), pos.clone()];
      radiusLineGeo.setFromPoints(rPts);
      radiusLine.computeLineDistances();

      // Update Frenet Vectors (tau: Cyan, n: Emerald, b: Rose)
      tauArrow.position.copy(pos);
      tauArrow.setDirection(tau);

      nArrow.position.copy(pos);
      nArrow.setDirection(n);

      bArrow.position.copy(pos);
      bArrow.setDirection(b);

      // Update Acceleration Vectors (a_T, a_N, gamma_total)
      atArrow.position.copy(pos);
      const atLen = Math.min(Math.abs(aT_val) * 0.35, 2.2);
      if (atLen > 0.01) {
        atArrow.setDirection(aT_val >= 0 ? tau : tau.clone().negate());
        atArrow.setLength(atLen, 0.15, 0.08);
      }

      anArrow.position.copy(pos);
      const anLen = Math.min(aN_val * 0.35, 2.2);
      if (anLen > 0.01) {
        anArrow.setDirection(n);
        anArrow.setLength(anLen, 0.15, 0.08);
      }

      aTotalArrow.position.copy(pos);
      const aTotNorm = acc.length();
      if (aTotNorm > 0.01) {
        aTotalArrow.setDirection(acc.clone().normalize());
        aTotalArrow.setLength(Math.min(aTotNorm * 0.35, 2.5), 0.22, 0.12);
      }

      // Rebuild Dynamic Osculating Circle at Center C in plane (tau, n)
      osculatingCircleGroup.clear();
      const oscCirclePts: THREE.Vector3[] = [];
      const stepsOsc = 72;
      for (let i = 0; i <= stepsOsc; i++) {
        const phi = (i / stepsOsc) * Math.PI * 2;
        const ptOsc = centerC.clone()
          .addScaledVector(tau, Rc_val * Math.cos(phi))
          .addScaledVector(n, Rc_val * Math.sin(phi));
        oscCirclePts.push(ptOsc);
      }
      const oscGeo = new THREE.BufferGeometry().setFromPoints(oscCirclePts);
      const oscLine = new THREE.Line(oscGeo, oscCircleMat);
      oscLine.computeLineDistances();
      osculatingCircleGroup.add(oscLine);

      // Update stats UI state
      setStats({
        speed: vNorm,
        rc: Rc_val,
        aT: aT_val,
        aN: aN_val,
        aTotal: aTotNorm,
      });

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
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Title Bar & Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-cyan-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Simulateur 3D Interactif : Repère de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" /> sur Trajectoire Curviligne 3D</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Observez le déplacement sur la trajectoire 3D $s(t)$, le cercle osculateur de centre $C$, le rayon de courbure $R_c$, et l'accélération <LatexMath math="\vec{\gamma} = a_T\vec{\tau} + a_N\vec{n}" />.
          </p>
        </div>

        {/* Action Buttons: Eye Toggle & Play/Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 transition-all"
          >
            {showLegend ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showLegend ? "Masquer Légende" : "Afficher Légende"}</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
          </button>

          <button
            onClick={() => {
              timeRef.current = 0;
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing" />

        {/* Floating Vector Legend Overlay (Togglable via Eye Button!) */}
        {showLegend && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-mono space-y-1 shadow-lg pointer-events-none z-10 max-w-[260px] sm:max-w-none">
            <div className="text-[11px] font-sans font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">
              Repère & Composantes Intrinsèques :
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block" />
              <span>Vecteur Tangent τ (Cyan)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-emerald-400 inline-block" />
              <span>Vecteur Normal n (Émeraude → Centre C)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-rose-400 inline-block" />
              <span>Vecteur Binormal b (Rose)</span>
            </div>
            <div className="pt-1 border-t border-slate-800/80 space-y-0.5 text-[9.5px] sm:text-[10px]">
              <div className="text-amber-400 font-bold">Rayon de courbure Rc = {stats.rc.toFixed(2)} m</div>
              <div className="text-purple-400 font-bold">a_N = v²/Rc = {stats.aN.toFixed(2)} m/s²</div>
              <div className="text-yellow-400 font-bold">a_T = dv/dt = {stats.aT.toFixed(2)} m/s²</div>
              <div className="text-pink-400 font-bold">||γ|| = √(aT² + aN²) = {stats.aTotal.toFixed(2)} m/s²</div>
            </div>
          </div>
        )}

        {/* Orbit Hint */}
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-800 text-[9px] sm:text-[10px] text-slate-400 pointer-events-none">
          <span>🖱️ Pivotement 3D tactile</span>
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-300">Vitesse de simulation:</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-24 sm:w-36 accent-cyan-500 cursor-pointer"
          />
          <span className="text-cyan-400 font-bold">{speedMultiplier.toFixed(1)}x</span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Trajectoire Curviligne 3D : <span className="text-amber-400 font-bold">Rayon $R_c(s)$ variable en temps réel</span>
        </div>
      </div>

    </div>
  );
}
