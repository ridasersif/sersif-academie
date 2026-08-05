"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function RelativeMotion3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [omega, setOmega] = useState<number>(1.5); // Rotation speed of R'
  const [vRel, setVRel] = useState<number>(2.0); // Relative speed of M in R'
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 7, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Fixed Frame R(O, i, j, k) - Dark Gray Grid & Dim Axes
    const gridR = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    gridR.position.y = -0.01;
    scene.add(gridR);

    const fixedAxes = new THREE.Group();
    fixedAxes.add(
      new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 4, 0x475569, 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 4, 0x475569, 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, 0x475569, 0.2, 0.1)
    );
    scene.add(fixedAxes);

    // Mobile Frame R'(O', i', j', k') Rotating around Y-axis
    const mobileFrameGroup = new THREE.Group();
    scene.add(mobileFrameGroup);

    // Mobile axes - Purple & Cyan
    const mobileX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xa855f7, 0.25, 0.15);
    const mobileY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.5, 0xf59e0b, 0.25, 0.15); // Omega vector along Y
    const mobileZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x06b6d4, 0.25, 0.15);
    mobileFrameGroup.add(mobileX, mobileY, mobileZ);

    // Omega vector label arrow (Rotation Axis \vec{\Omega})
    const omegaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.5, 0xf59e0b, 0.3, 0.2);
    scene.add(omegaArrow);

    // Point M Mesh
    const pointMGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8
    });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    // Vectors for Composition of Velocities & Accelerations
    // v_r (Relative Velocity - Emerald)
    const vrArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.25, 0.15);
    // v_e (Entrainment Velocity - Amber)
    const veArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf59e0b, 0.25, 0.15);
    // v_a (Absolute Velocity - Cyan)
    const vaArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x06b6d4, 0.3, 0.18);
    // a_c (Coriolis Acceleration - Rose)
    const acArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf43f5e, 0.3, 0.18);

    scene.add(vrArrow, veArrow, vaArrow, acArrow);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
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

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation Loop
    let time = 0;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isPlaying) {
        time += delta;
      }

      // Angle of rotation of R' relative to R: theta = omega * time
      const theta = omega * time;
      mobileFrameGroup.rotation.y = theta;

      // Position of M relative to R' (moving radially outward along X' axis in R')
      const rRel = 2 + 0.8 * Math.sin(vRel * time); // radial distance
      const posLocalInR = new THREE.Vector3(rRel * Math.cos(theta), 0.5, -rRel * Math.sin(theta));

      pointMMesh.position.copy(posLocalInR);

      // Relative Velocity v_r (radial movement in R')
      const drdt = 0.8 * vRel * Math.cos(vRel * time);
      const vrVec = new THREE.Vector3(drdt * Math.cos(theta), 0, -drdt * Math.sin(theta));

      // Entrainment Velocity v_e = \Omega \wedge OM = (0, omega, 0) \wedge posLocalInR
      const omegaVec = new THREE.Vector3(0, omega, 0);
      const veVec = new THREE.Vector3().crossVectors(omegaVec, posLocalInR);

      // Absolute Velocity v_a = v_r + v_e
      const vaVec = new THREE.Vector3().addVectors(vrVec, veVec);

      // Coriolis Acceleration a_c = 2 \Omega \wedge v_r
      const acVec = new THREE.Vector3().crossVectors(omegaVec, vrVec).multiplyScalar(2);

      // Update Arrows
      const setArrow = (arrow: THREE.ArrowHelper, origin: THREE.Vector3, dirVec: THREE.Vector3, scale: number) => {
        arrow.position.copy(origin);
        const norm = dirVec.length();
        if (norm > 0.01) {
          arrow.setDirection(dirVec.clone().normalize());
          arrow.setLength(Math.min(norm * scale, 3), 0.2, 0.12);
        }
      };

      setArrow(vrArrow, posLocalInR, vrVec, 0.6);
      setArrow(veArrow, posLocalInR, veVec, 0.4);
      setArrow(vaArrow, posLocalInR, vaVec, 0.4);
      setArrow(acArrow, posLocalInR, acVec, 0.4);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(domElement)) container.removeChild(domElement);
    };
  }, [omega, vRel, isPlaying]);

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Simulateur 3D Interactif : Composition des Vitesses & Accélération de Coriolis <LatexMath math="\vec{a}_c" /></span>
          </h3>
          <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1">
            <span>Visualisez le référentiel fixe</span> <LatexMath math="\mathcal{R}" /><span>, le référentiel tournant</span> <LatexMath math="\mathcal{R}'" /> <LatexMath math="(\vec{\Omega})" /><span>, et la décomposition</span> <LatexMath math="\vec{v}_a = \vec{v}_r + \vec{v}_e" /><span>.</span>
          </p>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[360px] sm:h-[400px] cursor-grab active:cursor-grabbing" />

        {/* Floating Overlay Legend */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-lg pointer-events-none">
          <div className="text-xs font-sans font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1">
            Vecteurs de Composition :
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>Vitesse Relative v_r (Vert)</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-amber-400 inline-block" />
            <span>Vitesse d'Entraînement v_e = Ω ∧ OM (Ambre)</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-cyan-400 inline-block" />
            <span>Vitesse Absolue v_a = v_r + v_e (Cyan)</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold pt-1 border-t border-slate-800/80">
            <span className="w-3 h-1 rounded-full bg-rose-400 inline-block" />
            <span>Accélération de Coriolis a_c = 2 Ω ∧ v_r (Rose)</span>
          </div>
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        
        {/* Rotation Speed Omega */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse de rotation <LatexMath math="\Omega" /> du repère mobile <LatexMath math="\mathcal{R}'" />:</span>
            <span className="text-amber-400 font-bold">{omega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="4"
            step="0.2"
            value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Relative Velocity vRel */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse relative <LatexMath math="v_r" /> du point <LatexMath math="M" /> dans <LatexMath math="\mathcal{R}'" />:</span>
            <span className="text-emerald-400 font-bold">{vRel.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.2"
            value={vRel}
            onChange={(e) => setVRel(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
}
