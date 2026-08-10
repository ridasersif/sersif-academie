"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Activity, Eye, Sliders, RotateCw, ArrowUpRight, Radio } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type OperatorType = "gradient" | "divergence" | "rotationnel";

export default function DifferentialOperators3DSimulator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [operatorType, setOperatorType] = useState<OperatorType>("gradient");

  // Control parameters
  const [amplitude, setAmplitude] = useState(2.5); // Gradient height / Divergence strength / Vortex speed
  const [spread, setSpread] = useState(2.0); // Surface spread / Field radius

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      webglSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch (e) {
      webglSupported = false;
    }

    if (!webglSupported) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5.5, 4.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(8, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 0.8);
    dirLight2.position.set(-8, -8, -8);
    scene.add(dirLight2);

    // 3. Grid Helper
    const gridHelper = new THREE.GridHelper(8, 8, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Main 3D Object Group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // 5. Mouse Drag Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let camSpherical = new THREE.Spherical().setFromVector3(camera.position);

    const onStart = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      camSpherical.theta -= deltaX * 0.008;
      camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi - deltaY * 0.008));

      camera.position.setFromSpherical(camSpherical);
      camera.lookAt(0, 0, 0);

      prevX = clientX;
      prevY = clientY;
    };

    const onEnd = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("mousedown", (e) => onStart(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
    window.addEventListener("mouseup", onEnd);

    domElem.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchend", onEnd);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let isInView = false;
    let time = 0;
    const animate = () => {
      if (!isInView) return;
      animId = requestAnimationFrame(animate);
      time += 0.02;

      // Rotate particles or vortex in Rotationnel mode
      if (meshGroupRef.current && meshGroupRef.current.userData.rotGroup) {
        meshGroupRef.current.userData.rotGroup.rotation.y = time * (amplitude * 0.4);
      }

      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) animate();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      intersectionObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (container) container.innerHTML = "";
      renderer.dispose();
    };
  }, []);

  // Dynamically build 3D geometry based on operatorType, amplitude, spread
  useEffect(() => {
    if (!meshGroupRef.current) return;
    const group = meshGroupRef.current;
    
    // Clear previous mesh objects
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
    group.userData = {};

    if (operatorType === "gradient") {
      // --- 1. 3D GRADIENT (Parametric Surface f(x,z) = Amp * exp(-(x^2+z^2)/Spread)) ---
      const gridSegments = 40;
      const size = 5.0;
      const planeGeo = new THREE.PlaneGeometry(size, size, gridSegments, gridSegments);
      planeGeo.rotateX(-Math.PI / 2); // Put on XZ plane

      const posAttr = planeGeo.attributes.position;
      const colors: number[] = [];

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const r2 = x * x + z * z;
        const y = amplitude * Math.exp(-r2 / Math.max(0.5, spread));
        posAttr.setY(i, y);

        // Color gradient from Deep Navy (base) to Bright Cyan (peak)
        const t = y / Math.max(0.1, amplitude);
        const c = new THREE.Color().setHSL(0.55 - t * 0.15, 0.9, 0.3 + t * 0.4);
        colors.push(c.r, c.g, c.b);
      }

      planeGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      planeGeo.computeVertexNormals();

      const surfMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        wireframe: false,
        roughness: 0.3,
        metalness: 0.1,
      });
      const surfMesh = new THREE.Mesh(planeGeo, surfMat);
      group.add(surfMesh);

      // Wireframe overlay for 3D depth
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.15 });
      const wireMesh = new THREE.Mesh(planeGeo, wireMat);
      group.add(wireMesh);

      // Gradient Vectors pointing UP the steepest slope
      const samplePts = [
        new THREE.Vector3(1.2, 0, 0),
        new THREE.Vector3(-1.2, 0, 0),
        new THREE.Vector3(0, 0, 1.2),
        new THREE.Vector3(0, 0, -1.2),
        new THREE.Vector3(0.9, 0, 0.9),
      ];

      samplePts.forEach((pt) => {
        const r2 = pt.x * pt.x + pt.z * pt.z;
        const y = amplitude * Math.exp(-r2 / Math.max(0.5, spread));
        pt.y = y;

        // Grad f = df/dx i + df/dz k = -2x/S * y i - 2z/S * y k + dy/dt j (up slope)
        const dfdx = (-2 * pt.x / Math.max(0.5, spread)) * y;
        const dfdz = (-2 * pt.z / Math.max(0.5, spread)) * y;
        const gradVec = new THREE.Vector3(-dfdx, 1.5, -dfdz).normalize();

        const gradArrow = new THREE.ArrowHelper(gradVec, pt, 1.0, 0x38bdf8, 0.22, 0.07);
        group.add(gradArrow);
      });

      // Peak Master Gradient Arrow
      const peakPos = new THREE.Vector3(0, amplitude, 0);
      const peakArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), peakPos, 1.4, 0x38bdf8, 0.28, 0.09);
      group.add(peakArrow);

    } else if (operatorType === "divergence") {
      // --- 2. 3D DIVERGENCE (Point Source / Translucent Sphere & 3D Radial Arrows) ---
      const rSph = Math.max(1.0, spread * 0.9);
      const sphGeo = new THREE.SphereGeometry(rSph, 32, 24);
      const sphMat = new THREE.MeshStandardMaterial({
        color: amplitude >= 0 ? 0x10b981 : 0xf43f5e,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        wireframe: true,
      });
      const sphMesh = new THREE.Mesh(sphGeo, sphMat);
      group.add(sphMesh);

      // Central Source Sphere
      const centerGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const centerMat = new THREE.MeshBasicMaterial({ color: amplitude >= 0 ? 0x34d399 : 0xf43f5e });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      group.add(centerMesh);

      // 3D Radial Arrows (Source if amp > 0, Sink if amp < 0)
      const numArrows = 18;
      const isSource = amplitude >= 0;
      const arrowColor = isSource ? 0x34d399 : 0xf43f5e;
      const arrowLen = Math.abs(amplitude) * 0.45;

      for (let i = 0; i < numArrows; i++) {
        // Distribute uniformly on sphere surface
        const phiAngle = Math.acos(-1 + (2 * i) / numArrows);
        const thetaAngle = Math.sqrt(numArrows * Math.PI) * phiAngle;

        const dir = new THREE.Vector3(
          Math.cos(thetaAngle) * Math.sin(phiAngle),
          Math.sin(thetaAngle) * Math.sin(phiAngle),
          Math.cos(phiAngle)
        ).normalize();

        const startPt = isSource ? new THREE.Vector3(0, 0, 0) : dir.clone().multiplyScalar(rSph);
        const arrowDir = isSource ? dir : dir.clone().negate();

        const arrow = new THREE.ArrowHelper(arrowDir, startPt, arrowLen, arrowColor, 0.2, 0.07);
        group.add(arrow);
      }

    } else if (operatorType === "rotationnel") {
      // --- 3. 3D ROTATIONNEL (Swirling Vortex Rings & Central Axis Vector rot A) ---
      const rotGroup = new THREE.Group();
      group.add(rotGroup);
      group.userData.rotGroup = rotGroup;

      const numRings = 5;
      for (let rIdx = 1; rIdx <= numRings; rIdx++) {
        const radius = rIdx * (spread * 0.35);
        const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 32);
        ringGeo.rotateX(Math.PI / 2);

        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6 - rIdx * 0.08,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.y = (rIdx - 3) * 0.4;
        rotGroup.add(ringMesh);

        // Swirling tangent arrows around each ring
        const numTangents = 4;
        for (let tIdx = 0; tIdx < numTangents; tIdx++) {
          const a = (tIdx * 2 * Math.PI) / numTangents;
          const pos = new THREE.Vector3(radius * Math.cos(a), (rIdx - 3) * 0.4, radius * Math.sin(a));
          const tangent = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)).normalize();

          const arrow = new THREE.ArrowHelper(tangent, pos, 0.6, 0xfbbf24, 0.18, 0.06);
          rotGroup.add(arrow);
        }
      }

      // Central Rotation Axis Vector rot A (Rose Red Vertically Upward)
      const rotAxisLen = Math.max(1.0, amplitude * 0.9);
      const rotAxisArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1.2, 0),
        rotAxisLen + 1.2,
        0xf43f5e,
        0.3,
        0.1
      );
      group.add(rotAxisArrow);
    }
  }, [operatorType, amplitude, spread]);

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl my-6 w-full max-w-full overflow-hidden">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              Simulateur 3D Interactif • Opérateurs Différentiels (Grad, Div, Rot)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Faites glisser en 3D et modifiez l'intensité pour observer le comportement physique en direct
            </p>
          </div>
        </div>

        {/* Operator Selection Buttons */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setOperatorType("gradient")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              operatorType === "gradient" ? "bg-cyan-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Gradient (∇f)</span>
          </button>
          <button
            onClick={() => setOperatorType("divergence")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              operatorType === "divergence" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Div (∇·A)</span>
          </button>
          <button
            onClick={() => setOperatorType("rotationnel")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              operatorType === "rotationnel" ? "bg-amber-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rot (∇∧A)</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[250px] sm:h-[300px] rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-slate-800 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* View Indicator */}
        <div className="absolute top-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Faites glisser en 3D</span>
        </div>

        {/* Current Operator Physics Explanation Overlay */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          {operatorType === "gradient" && (
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span>Gradient ∇f: Pente maximale (Hauteur = {amplitude.toFixed(1)})</span>
            </div>
          )}
          {operatorType === "divergence" && (
            <div className={`font-bold flex items-center gap-1.5 ${amplitude >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              <span className={`w-2 h-2 rounded-full inline-block ${amplitude >= 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
              <span>{amplitude >= 0 ? "div A > 0 (Source de flux)" : "div A < 0 (Puits de flux)"}</span>
            </div>
          )}
          {operatorType === "rotationnel" && (
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>rot A ≠ 0: Tourbillonnement (Vitesse ω = {amplitude.toFixed(1)})</span>
            </div>
          )}
        </div>

        {/* Bottom Formula Legend */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-slate-200 flex items-center justify-between overflow-x-auto">
          {operatorType === "gradient" && (
            <>
              <LatexMath math="\vec{\mathrm{grad}}(f) = \frac{\partial f}{\partial x}\vec{i} + \frac{\partial f}{\partial y}\vec{j} + \frac{\partial f}{\partial z}\vec{k}" />
              <span className="text-cyan-400 font-bold ml-2">Perpendiculaire aux équipotentielles</span>
            </>
          )}
          {operatorType === "divergence" && (
            <>
              <LatexMath math="\mathrm{div}(\vec{A}) = \vec{\nabla} \cdot \vec{A} = \frac{\partial A_x}{\partial x} + \frac{\partial A_y}{\partial y} + \frac{\partial A_z}{\partial z}" />
              <span className="text-emerald-400 font-bold ml-2">Flux surfacique sortant net</span>
            </>
          )}
          {operatorType === "rotationnel" && (
            <>
              <LatexMath math="\vec{\mathrm{rot}}(\vec{A}) = \vec{\nabla} \wedge \vec{A} = \text{Axe de Rotation 3D}" />
              <span className="text-amber-400 font-bold ml-2">Règle de la main droite</span>
            </>
          )}
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1.5">
            <span>
              {operatorType === "gradient" ? "Hauteur du relief (A):" : operatorType === "divergence" ? "Débit du Flux (q):" : "Vitesse du Tourbillon (ω):"}
            </span>
            <span className="text-cyan-400 font-extrabold">{amplitude.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={operatorType === "divergence" ? "-4.0" : "0.5"}
            max="5.0"
            step="0.2"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1.5">
            <span>
              {operatorType === "gradient" ? "Étalement / Pente (S):" : operatorType === "divergence" ? "Rayon de la sphère (R):" : "Rayon du Vortex (r):"}
            </span>
            <span className="text-purple-400 font-extrabold">{spread.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.2"
            value={spread}
            onChange={(e) => setSpread(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

    </div>
  );
}
