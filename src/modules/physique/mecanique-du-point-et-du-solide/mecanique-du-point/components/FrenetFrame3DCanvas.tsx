"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RefreshCw, Compass } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function FrenetFrame3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Interactive sliders
  const [radius, setRadius] = useState<number>(3); // Radius of curvature Rc
  const [speed, setSpeed] = useState<number>(2.5); // Speed v
  const [dvdt, setDvdt] = useState<number>(0.8); // Tangential acceleration dv/dt

  // Computed intrinsic stats
  const at = dvdt;
  const an = (speed * speed) / radius;
  const aTotal = Math.sqrt(at * at + an * an);

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
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dLight.position.set(5, 10, 5);
    scene.add(dLight);

    // 3. Grid
    const grid = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // 4. Osculating Circle & Trajectory Curve
    const osculatingCircleGroup = new THREE.Group();
    scene.add(osculatingCircleGroup);

    // Center of curvature C is at (-radius, 0, 0)
    // Point M is at (0, 0, 0)
    // Tangent tau is along +Z axis
    // Normal n is along -X axis (pointing towards center C)
    // Binormal b is along +Y axis

    const rebuildOsculatingCircle = (r: number) => {
      osculatingCircleGroup.clear();
      
      // Draw Osculating Circle
      const curve = new THREE.EllipseCurve(
        -r, 0, // ax, aY (Center C)
        r, r, // xRadius, yRadius
        0, 2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
      );

      const points2D = curve.getPoints(100);
      // Map 2D (x,y) ellipse to 3D (x, z) horizontal plane
      const points3D = points2D.map(p => new THREE.Vector3(p.x, 0, p.y));
      const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
      const material = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.7
      });
      const circleLine = new THREE.Line(geometry, material);
      circleLine.computeLineDistances();
      osculatingCircleGroup.add(circleLine);

      // Center of curvature C sphere marker
      const centerGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const centerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      centerMesh.position.set(-r, 0, 0);
      osculatingCircleGroup.add(centerMesh);

      // Radius line C-M
      const radiusGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-r, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ]);
      const radiusLine = new THREE.Line(radiusGeo, new THREE.LineDashedMaterial({ color: 0x06b6d4, dashSize: 0.15, gapSize: 0.1 }));
      radiusLine.computeLineDistances();
      osculatingCircleGroup.add(radiusLine);
    };

    rebuildOsculatingCircle(radius);

    // 5. Point M
    const particleGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    const particleMesh = new THREE.Mesh(particleGeo, particleMat);
    particleMesh.position.set(0, 0, 0);
    scene.add(particleMesh);

    // 6. Frenet Vectors (\tau, n, b)
    // \tau (Tangent) - Cyan along +Z
    const tauArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.8, 0x06b6d4, 0.25, 0.15);
    // \vec{n} (Normal) - Emerald along -X (towards C)
    const nArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 1.8, 0x10b981, 0.25, 0.15);
    // \vec{b} (Binormal) - Rose along +Y
    const bArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.8, 0xf43f5e, 0.25, 0.15);
    
    scene.add(tauArrow, nArrow, bArrow);

    // 7. Acceleration Vector & Components (a_t \tau + a_n n)
    const atArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0xfacc15, 0.2, 0.1);
    const anArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xa855f7, 0.2, 0.1);
    
    // Total Acceleration a
    const aTotalArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 1).normalize(), new THREE.Vector3(0, 0, 0), 1, 0xec4899, 0.3, 0.18);

    scene.add(atArrow, anArrow, aTotalArrow);

    // Update acceleration arrows lengths
    const updateAccelerationArrows = () => {
      const scale = 0.35;
      const atLen = Math.max(at * scale, 0.05);
      const anLen = Math.max(an * scale, 0.05);
      
      atArrow.setLength(atLen, 0.15, 0.1);
      anArrow.setLength(anLen, 0.15, 0.1);

      const totalVec = new THREE.Vector3(-an, 0, at);
      const totalNorm = totalVec.length();
      if (totalNorm > 0.01) {
        aTotalArrow.setDirection(totalVec.clone().normalize());
        aTotalArrow.setLength(totalNorm * scale, 0.25, 0.15);
      }
    };

    updateAccelerationArrows();

    // 8. Orbit Drag Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.7;
    let cameraAngleY = 0.4;
    const cameraRadius = 10;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(-radius * 0.4, 0.2, 0);
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

    // Render loop
    const animate = () => {
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
  }, [radius, speed, dvdt, at, an]);

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-cyan-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Simulateur 3D Interactif : Repère de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" /> & Rayon de Courbure <LatexMath math="R_c" /></span>
          </h3>
          <p className="text-xs text-slate-400">
            Visualisez le trièdre de Frenet, le cercle osculateur et l'accélération <LatexMath math="\vec{a} = a_t\vec{\tau} + a_n\vec{n}" />.
          </p>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[360px] sm:h-[400px] cursor-grab active:cursor-grabbing" />

        {/* Live Vector Legend Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-lg pointer-events-none">
          <div className="text-xs font-sans font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">
            Trièdre & Composées Intrinseque :
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-cyan-400 inline-block" />
            <span>Vecteur Tangent τ (Cyan)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />
            <span>Vecteur Normal n (Émeraude → Centre C)</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-rose-400 inline-block" />
            <span>Vecteur Binormal b = τ ∧ n (Rose)</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400 font-bold pt-1 border-t border-slate-800/80">
            <span className="w-3 h-1 rounded-full bg-purple-400 inline-block" />
            <span>a_n = v²/R_c = {an.toFixed(2)} m/s² (Normale)</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span className="w-3 h-1 rounded-full bg-amber-400 inline-block" />
            <span>a_t = dv/dt = {at.toFixed(2)} m/s² (Tangentielle)</span>
          </div>
          <div className="flex items-center gap-2 text-pink-400 font-bold font-mono">
            <span>||a|| = √(a_t² + a_n²) = {aTotal.toFixed(2)} m/s²</span>
          </div>
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        
        {/* Radius Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Rayon de courbure <LatexMath math="R_c" />:</span>
            <span className="text-cyan-400 font-bold">{radius.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="0.2"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse linéaire <LatexMath math="v" />:</span>
            <span className="text-emerald-400 font-bold">{speed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.2"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Tangential Acceleration Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Accélération <LatexMath math="a_t = \dot{v}" />:</span>
            <span className="text-amber-400 font-bold">{dvdt.toFixed(1)} m/s²</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={dvdt}
            onChange={(e) => setDvdt(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
}
