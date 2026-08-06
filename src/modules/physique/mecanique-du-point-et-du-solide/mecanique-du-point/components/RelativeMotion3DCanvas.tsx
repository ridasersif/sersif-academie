"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function RelativeMotion3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [omega, setOmega] = useState<number>(1.5); // Rotation speed of R1
  const [vRel, setVRel] = useState<number>(2.0); // Relative speed of M in R1
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 360;

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

    // Fixed Frame R(O, i, j, k) - Dark Grid & Axes
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

    // Mobile Frame R1(O1, i1, j1, k1) Rotating around Y-axis with velocity Omega
    const mobileFrameGroup = new THREE.Group();
    scene.add(mobileFrameGroup);

    const mobileX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xa855f7, 0.25, 0.15);
    const mobileY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.5, 0xf59e0b, 0.25, 0.15); // Omega rotation vector along Y
    const mobileZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x06b6d4, 0.25, 0.15);
    mobileFrameGroup.add(mobileX, mobileY, mobileZ);

    // Point M Mesh
    const pointMGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8
    });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    // Composition Arrows
    const vrArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x10b981, 0.25, 0.15);
    const veArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf59e0b, 0.25, 0.15);
    const vaArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0x06b6d4, 0.3, 0.18);
    const acArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf43f5e, 0.3, 0.18);
    scene.add(vrArrow, veArrow, vaArrow, acArrow);

    // Orbit Controls & Mobile Resize
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

    // Animation Loop
    let time = 0;
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (isPlaying) time += delta;

      const theta = omega * time;
      mobileFrameGroup.rotation.y = theta;

      const rRel = 2 + 0.8 * Math.sin(vRel * time);
      const posLocalInR = new THREE.Vector3(rRel * Math.cos(theta), 0.5, -rRel * Math.sin(theta));
      pointMMesh.position.copy(posLocalInR);

      const drdt = 0.8 * vRel * Math.cos(vRel * time);
      const vrVec = new THREE.Vector3(drdt * Math.cos(theta), 0, -drdt * Math.sin(theta));

      const omegaVec = new THREE.Vector3(0, omega, 0);
      const veVec = new THREE.Vector3().crossVectors(omegaVec, posLocalInR);
      const vaVec = new THREE.Vector3().addVectors(vrVec, veVec);
      const acVec = new THREE.Vector3().crossVectors(omegaVec, vrVec).multiplyScalar(2);

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
      window.removeEventListener("resize", handleResize);
      if (container.contains(domElement)) container.removeChild(domElement);
    };
  }, [omega, vRel, isPlaying]);

  return (
    <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Simulateur 3D Interactif : Repère Fixe <LatexMath math="\mathcal{R}" /> & Mobile Tournant <LatexMath math="\mathcal{R}_1(\vec{\Omega})" /></span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1">
            <span>Visualisation en 3D du repère fixe, du repère mobile tournant à la vitesse</span> <LatexMath math="\vec{\Omega}" /><span>, et de la composition</span> <LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" /><span>.</span>
          </p>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing" />

        {/* Floating Overlay Legend */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-mono space-y-1 shadow-lg pointer-events-none">
          <div className="text-[11px] font-sans font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1">
            Composition des Vitesses & Coriolis :
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>Vitesse Relative Vr (Vert)</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-amber-400 inline-block" />
            <span>Vitesse d'Entraînement Ve = Ω ∧ O1M (Ambre)</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block" />
            <span>Vitesse Absolue Va = Vr + Ve (Cyan)</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold pt-1 border-t border-slate-800/80">
            <span className="w-2.5 h-1 rounded-full bg-rose-400 inline-block" />
            <span>Accélération de Coriolis γc = 2 Ω ∧ Vr (Rose)</span>
          </div>
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse de rotation <LatexMath math="\Omega" /> de <LatexMath math="\mathcal{R}_1" />:</span>
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

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse relative <LatexMath math="V_r" /> dans <LatexMath math="\mathcal{R}_1" />:</span>
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
