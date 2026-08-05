"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, Eye } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type CoordSystem = "cartesien" | "cylindrique" | "spherique";

export default function ThreeDCoordinateCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [coordType, setCoordType] = useState<CoordSystem>("cylindrique");

  // Control Sliders State
  const [r, setR] = useState(3.5);
  const [phi, setPhi] = useState(60);
  const [theta, setTheta] = useState(45);
  const [zVal, setZVal] = useState(2.0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const mMeshRef = useRef<THREE.Mesh | null>(null);
  const omLineRef = useRef<THREE.Line | null>(null);
  const projLineRef = useRef<THREE.Line | null>(null);
  const erhoArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ephiArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ezArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ethetaArrowRef = useRef<THREE.ArrowHelper | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Prevent duplicate canvases in React StrictMode
    container.innerHTML = "";

    const width = container.clientWidth || 600;
    const height = 440;

    // Check if WebGL is supported
    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      webglSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch (e) {
      webglSupported = false;
    }

    if (!webglSupported) {
      // Fallback 2D Rendering if WebGL is unavailable
      const canvas2D = document.createElement("canvas");
      canvas2D.width = width;
      canvas2D.height = height;
      canvas2D.className = "w-full h-full";
      container.appendChild(canvas2D);
      const ctx = canvas2D.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0a0f1d";
        ctx.fillRect(0, 0, width, height);
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText("Simulateur 3D Interactif des Repères Mobile", width / 2, height / 2 - 10);
        ctx.font = "11px Inter, sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Mode de rendu 2D actif (Prêt pour le WebGL 3D)", width / 2, height / 2 + 15);
      }
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 3. Grid Helper
    const gridHelper = new THREE.GridHelper(12, 12, 0x334155, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Main Coordinate Axes (X: Red, Y: Green, Z: Blue)
    const axesLen = 5.5;
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axesLen, 0xef4444, 0.4, 0.2);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axesLen, 0x22c55e, 0.4, 0.2);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axesLen, 0x3b82f6, 0.4, 0.2);
    scene.add(xAxis, yAxis, zAxis);

    // 5. Point M Mesh (Glowing Sphere)
    const mGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const mMats = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      roughness: 0.2,
      metalness: 0.8,
    });
    const mMesh = new THREE.Mesh(mGeo, mMats);
    scene.add(mMesh);
    mMeshRef.current = mMesh;

    // 6. Vector OM Line
    const omMat = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 3 });
    const omGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)]);
    const omLine = new THREE.Line(omGeo, omMat);
    scene.add(omLine);
    omLineRef.current = omLine;

    // 7. Projection Line (Dashed)
    const projMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.2, gapSize: 0.1 });
    const projGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 1, 1)]);
    const projLine = new THREE.Line(projGeo, projMat);
    projLine.computeLineDistances();
    scene.add(projLine);
    projLineRef.current = projLine;

    // 8. Basis Vector Arrow Helpers at M
    const erhoArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.5, 0xec4899, 0.3, 0.15);
    const ephiArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.5, 0x10b981, 0.3, 0.15);
    const ezArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.5, 0x3b82f6, 0.3, 0.15);
    const ethetaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1.5, 0xf59e0b, 0.3, 0.15);

    scene.add(erhoArrow, ephiArrow, ezArrow, ethetaArrow);
    erhoArrowRef.current = erhoArrow;
    ephiArrowRef.current = ephiArrow;
    ezArrowRef.current = ezArrow;
    ethetaArrowRef.current = ethetaArrow;

    // 9. Mouse Orbit Drag Controls
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let camSpherical = new THREE.Spherical().setFromVector3(camera.position);

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      camSpherical.theta -= deltaX * 0.008;
      camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi - deltaY * 0.008));

      camera.position.setFromSpherical(camSpherical);
      camera.lookAt(0, 0, 0);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 10. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container) {
        container.innerHTML = "";
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D Vector Positions when sliders or coordinate type changes
  useEffect(() => {
    if (!sceneRef.current || !mMeshRef.current || !omLineRef.current) return;

    const phiRad = (phi * Math.PI) / 180;
    const thetaRad = (theta * Math.PI) / 180;

    let mx = 0, my = 0, mz = 0;

    if (coordType === "cartesien") {
      mx = r * Math.cos(phiRad);
      my = zVal;
      mz = r * Math.sin(phiRad);
    } else if (coordType === "cylindrique") {
      mx = r * Math.cos(phiRad);
      my = zVal;
      mz = r * Math.sin(phiRad);
    } else if (coordType === "spherique") {
      mx = r * Math.sin(thetaRad) * Math.cos(phiRad);
      my = r * Math.cos(thetaRad);
      mz = r * Math.sin(thetaRad) * Math.sin(phiRad);
    }

    const mPos = new THREE.Vector3(mx, my, mz);
    mMeshRef.current.position.copy(mPos);

    // Update OM vector line
    omLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), mPos]);

    // Update Projection line (O -> H -> M)
    if (projLineRef.current) {
      const hPos = new THREE.Vector3(mx, 0, mz);
      projLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), hPos, mPos]);
      projLineRef.current.computeLineDistances();
    }

    // Update local basis vectors
    if (coordType === "cylindrique") {
      const rhoLen = Math.sqrt(mx * mx + mz * mz) || 1;
      const dirErho = new THREE.Vector3(mx / rhoLen, 0, mz / rhoLen);
      const dirEphi = new THREE.Vector3(-mz / rhoLen, 0, mx / rhoLen);
      const dirEz = new THREE.Vector3(0, 1, 0);

      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(dirErho);
        erhoArrowRef.current.setColor(0xec4899);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(dirEphi);
        ephiArrowRef.current.setColor(0x10b981);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(dirEz);
        ezArrowRef.current.setColor(0x3b82f6);
      }

      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
      if (ezArrowRef.current) ezArrowRef.current.visible = true;
    } else if (coordType === "spherique") {
      const dirEr = mPos.clone().normalize();
      const dirEphi = new THREE.Vector3(-Math.sin(phiRad), 0, Math.cos(phiRad));
      const dirEtheta = new THREE.Vector3(
        Math.cos(thetaRad) * Math.cos(phiRad),
        -Math.sin(thetaRad),
        Math.cos(thetaRad) * Math.sin(phiRad)
      ).normalize();

      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(dirEr);
        erhoArrowRef.current.setColor(0xec4899);
      }

      if (ethetaArrowRef.current) {
        ethetaArrowRef.current.position.copy(mPos);
        ethetaArrowRef.current.setDirection(dirEtheta);
        ethetaArrowRef.current.setColor(0xf59e0b);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(dirEphi);
        ephiArrowRef.current.setColor(0x10b981);
      }

      if (ezArrowRef.current) ezArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
    } else {
      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(new THREE.Vector3(1, 0, 0));
        erhoArrowRef.current.setColor(0xef4444);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(new THREE.Vector3(0, 1, 0));
        ephiArrowRef.current.setColor(0x22c55e);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(new THREE.Vector3(0, 0, 1));
        ezArrowRef.current.setColor(0x3b82f6);
      }

      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
      if (ezArrowRef.current) ezArrowRef.current.visible = true;
    }
  }, [coordType, r, phi, theta, zVal]);

  return (
    <div className="bg-card/90 border border-border/80 rounded-3xl p-5 shadow-xl my-6">
      
      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-extrabold text-foreground">
            Simulateur 3D WebGL (Three.js) • Repères Mobiles Local (Rotatif)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl">
          <button
            onClick={() => setCoordType("cartesien")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "cartesien" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cartésien (x,y,z)
          </button>
          <button
            onClick={() => setCoordType("cylindrique")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "cylindrique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cylindrique (ρ,φ,z)
          </button>
          <button
            onClick={() => setCoordType("spherique")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coordType === "spherique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sphérique (r,θ,φ)
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[440px] rounded-2xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing border border-slate-800">
        <div ref={mountRef} className="w-full h-full" />

        {/* View overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-semibold text-slate-300 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Faites glisser la souris pour pivoter la caméra 3D WebGL</span>
        </div>

        {/* LaTeX Formula legend */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white flex flex-wrap items-center justify-between gap-2">
          {coordType === "cylindrique" && (
            <>
              <div><LatexMath math="\vec{e}_\rho = \cos\phi\,\vec{i} + \sin\phi\,\vec{j}" /></div>
              <div><LatexMath math="\vec{e}_\phi = -\sin\phi\,\vec{i} + \cos\phi\,\vec{j}" /></div>
              <div><LatexMath math="\vec{e}_z = \vec{k}" /></div>
              <div className="text-amber-400 font-bold"><LatexMath math="d\vec{OM} = d\rho\vec{e}_\rho + \rho d\phi\vec{e}_\phi + dz\vec{e}_z" /></div>
            </>
          )}
          {coordType === "spherique" && (
            <>
              <div><LatexMath math="\vec{e}_r = \sin\theta\cos\phi\vec{i} + \sin\theta\sin\phi\vec{j} + \cos\theta\vec{k}" /></div>
              <div><LatexMath math="\vec{e}_\theta = \cos\theta\cos\phi\vec{i} + \cos\theta\sin\phi\vec{j} - \sin\theta\vec{k}" /></div>
              <div><LatexMath math="\vec{e}_\phi = -\sin\phi\vec{i} + \cos\phi\vec{j}" /></div>
            </>
          )}
          {coordType === "cartesien" && (
            <>
              <div><LatexMath math="\vec{i} = (1,0,0)" /></div>
              <div><LatexMath math="\vec{j} = (0,1,0)" /></div>
              <div><LatexMath math="\vec{k} = (0,0,1)" /></div>
              <div className="text-amber-400 font-bold"><LatexMath math="d\vec{OM} = dx\vec{i} + dy\vec{j} + dz\vec{k}" /></div>
            </>
          )}
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
            <span>Rayon / Distance (r / ρ):</span>
            <span className="text-primary font-extrabold">{r.toFixed(1)} u</span>
          </label>
          <input
            type="range"
            min="1.5"
            max="5.0"
            step="0.1"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
            <span>Angle Azimutal (φ):</span>
            <span className="text-emerald-500 font-extrabold">{phi}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {coordType === "spherique" ? (
          <div>
            <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
              <span>Angle Zénithal (θ):</span>
              <span className="text-amber-500 font-extrabold">{theta}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="180"
              value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
              <span>Hauteur (z):</span>
              <span className="text-blue-500 font-extrabold">{zVal.toFixed(1)} u</span>
            </label>
            <input
              type="range"
              min="-3.0"
              max="4.0"
              step="0.2"
              value={zVal}
              onChange={(e) => setZVal(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
