"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Eye, EyeOff, Play, Pause, RotateCcw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function RelativeMotion3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [omega, setOmega] = useState<number>(1.5); // Rotation speed of R1
  const [vRel, setVRel] = useState<number>(2.0); // Relative speed of M in R1
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clear previous canvas
    container.innerHTML = "";

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const updateSize = () => {
      if (!container) return;
      const width = container.clientWidth || container.getBoundingClientRect().width || 600;
      const height = container.clientHeight || container.getBoundingClientRect().height || 360;
      
      const aspect = width / height;
      camera.aspect = aspect;

      // Adjust Field of View dynamically for mobile screens to keep scene perfectly centered!
      if (width < 640) {
        camera.fov = 55;
      } else {
        camera.fov = 44;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Fixed Frame R(O, i, j, k) - Dark Grid & Axes (Centered at Origin y = 0)
    const gridR = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    gridR.position.y = 0;
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
    const mobileY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.5, 0xf59e0b, 0.25, 0.15);
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

    // Perfectly Centered Orbit Camera Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.6;
    let cameraAngleY = 0.32; // Balanced angle for dead-center view!
    const cameraRadius = 10.0;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(0, 0.2, 0); // Targeted dead center!
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

    // ResizeObserver for instant responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    // Animation Loop
    let time = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        time += delta;
      }

      // Rotate mobile frame R1 around Y axis
      const thetaR1 = omega * time;
      mobileFrameGroup.rotation.y = thetaR1;

      // Position of M in R1
      const rM = ((vRel * time) % 3.2) + 0.5;
      const posLocal = new THREE.Vector3(rM, 0, 0);
      const posWorld = posLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);
      pointMMesh.position.copy(posWorld);

      // Relative Velocity Vr
      const vrLocal = new THREE.Vector3(vRel, 0, 0);
      const vrWorld = vrLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);

      // Entraînement Velocity Ve = Omega x OM
      const omegaVec = new THREE.Vector3(0, omega, 0);
      const veWorld = new THREE.Vector3().crossVectors(omegaVec, posWorld);

      // Absolute Velocity Va = Vr + Ve
      const vaWorld = new THREE.Vector3().addVectors(vrWorld, veWorld);

      // Coriolis Acceleration gamma_C = 2 * Omega x Vr
      const acWorld = new THREE.Vector3().crossVectors(omegaVec, vrWorld).multiplyScalar(2);

      // Update Arrows
      vrArrow.position.copy(posWorld);
      if (vrWorld.length() > 0.01) {
        vrArrow.setDirection(vrWorld.clone().normalize());
        vrArrow.setLength(vrWorld.length() * 0.4, 0.2, 0.12);
      }

      veArrow.position.copy(posWorld);
      if (veWorld.length() > 0.01) {
        veArrow.setDirection(veWorld.clone().normalize());
        veArrow.setLength(veWorld.length() * 0.4, 0.2, 0.12);
      }

      vaArrow.position.copy(posWorld);
      if (vaWorld.length() > 0.01) {
        vaArrow.setDirection(vaWorld.clone().normalize());
        vaArrow.setLength(vaWorld.length() * 0.35, 0.22, 0.14);
      }

      acArrow.position.copy(posWorld);
      if (acWorld.length() > 0.01) {
        acArrow.setDirection(acWorld.clone().normalize());
        acArrow.setLength(Math.min(acWorld.length() * 0.25, 2.5), 0.22, 0.14);
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    updateSize();
    animate(performance.now());

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(domElement)) container.removeChild(domElement);
    };
  }, [omega, vRel, isPlaying]);

  return (
    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      {/* Title & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Simulateur 3D Interactif : Repère Fixe <LatexMath math="\mathcal{R}" /> & Mobile Tournant <LatexMath math="\mathcal{R}_1(\vec{\Omega})" /></span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1">
            <span>Visualisation 3D du repère mobile tournant à la vitesse</span> <LatexMath math="\vec{\Omega}" /><span>, et de la composition</span> <LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" /><span>.</span>
          </p>
        </div>

        {/* Eye Toggle Legend & Play/Pause Button */}
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas (Centered & Responsive for Mobile/Desktop) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[280px] sm:min-h-[360px] w-full flex items-center justify-center">
        <div ref={mountRef} className="w-full h-[280px] sm:h-[360px] cursor-grab active:cursor-grabbing" />

        {/* Floating Overlay Legend */}
        {showLegend && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-slate-800 text-[9.5px] sm:text-[11px] font-mono space-y-1 shadow-lg pointer-events-none z-10 max-w-[220px] sm:max-w-none">
            <div className="text-[10px] sm:text-[11px] font-sans font-bold text-amber-400 border-b border-slate-800 pb-0.5 mb-1">
              Composition des Vitesses & Coriolis :
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-1 rounded-full bg-emerald-400 inline-block" />
              <span>Vitesse Relative Vr (Vert)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-1 rounded-full bg-amber-400 inline-block" />
              <span>Vitesse d'Entraînement Ve = Ω ∧ O1M (Ambre)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-2 h-1 rounded-full bg-cyan-400 inline-block" />
              <span>Vitesse Absolue Va = Vr + Ve (Cyan)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold pt-1 border-t border-slate-800/80">
              <span className="w-2 h-1 rounded-full bg-rose-400 inline-block" />
              <span>Accélération de Coriolis γc = 2 Ω ∧ Vr (Rose)</span>
            </div>
          </div>
        )}
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-2.5 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        
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
