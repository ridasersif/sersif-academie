"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, Eye, Layers } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type CoordSystem = "cartesien" | "cylindrique" | "spherique";

export default function ThreeDCoordinateCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [coordType, setCoordType] = useState<CoordSystem>("cylindrique");
  const [showVolumeShape, setShowVolumeShape] = useState(true);

  // Control Sliders State
  const [r, setR] = useState(3.0);
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

  // 3D Volume Shapes Refs
  const cylinderMeshRef = useRef<THREE.Mesh | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const boxMeshRef = useRef<THREE.Mesh | null>(null);

  // Visual 3D Angle Arcs Line Refs
  const phiArcLineRef = useRef<THREE.Line | null>(null);
  const thetaArcLineRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      webglSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch (e) {
      webglSupported = false;
    }

    if (!webglSupported) {
      const canvas2D = document.createElement("canvas");
      canvas2D.width = width;
      canvas2D.height = height;
      canvas2D.className = "w-full h-full";
      container.appendChild(canvas2D);
      const ctx = canvas2D.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText("Simulateur 3D Interactif (Three.js WebGL)", width / 2, height / 2 - 10);
      }
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6.5, 5.5, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 3. Grid Helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Main Axes (Slender Arrow Heads: headLength=0.25, headWidth=0.08)
    const axesLen = 5.0;
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axesLen, 0xf87171, 0.25, 0.08);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axesLen, 0x34d399, 0.25, 0.08);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axesLen, 0x38bdf8, 0.25, 0.08);
    scene.add(xAxis, yAxis, zAxis);

    // 5. Translucent 3D Volume Shapes Materials
    const shapeMatCyl = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      roughness: 0.3,
    });

    const shapeMatSph = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
      side: THREE.DoubleSide,
    });

    const shapeMatBox = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });

    // Cylindre Mesh
    const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
    const cylMesh = new THREE.Mesh(cylGeo, shapeMatCyl);
    scene.add(cylMesh);
    cylinderMeshRef.current = cylMesh;

    // Sphère Mesh
    const sphGeo = new THREE.SphereGeometry(1, 32, 24);
    const sphMesh = new THREE.Mesh(sphGeo, shapeMatSph);
    scene.add(sphMesh);
    sphereMeshRef.current = sphMesh;

    // Box Mesh
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMesh = new THREE.Mesh(boxGeo, shapeMatBox);
    scene.add(boxMesh);
    boxMeshRef.current = boxMesh;

    // 6. Point M Mesh (Slender Sphere Geometry)
    const mGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const mMats = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const mMesh = new THREE.Mesh(mGeo, mMats);
    scene.add(mMesh);
    mMeshRef.current = mMesh;

    // 7. Vector OM Line
    const omMat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2 });
    const omGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)]);
    const omLine = new THREE.Line(omGeo, omMat);
    scene.add(omLine);
    omLineRef.current = omLine;

    // 8. Projection Line (Dashed)
    const projMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.2, gapSize: 0.1 });
    const projGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 1, 1)]);
    const projLine = new THREE.Line(projGeo, projMat);
    projLine.computeLineDistances();
    scene.add(projLine);
    projLineRef.current = projLine;

    // 9. Visual 3D Angle Arcs
    const phiArcMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
    const phiArcGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]);
    const phiArcLine = new THREE.Line(phiArcGeo, phiArcMat);
    scene.add(phiArcLine);
    phiArcLineRef.current = phiArcLine;

    const thetaArcMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
    const thetaArcGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]);
    const thetaArcLine = new THREE.Line(thetaArcGeo, thetaArcMat);
    scene.add(thetaArcLine);
    thetaArcLineRef.current = thetaArcLine;

    // 10. Basis Vector Arrow Helpers at M (Slender: headLength=0.2, headWidth=0.07)
    const erhoArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.2, 0xf43f5e, 0.2, 0.07);
    const ephiArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.2, 0x10b981, 0.2, 0.07);
    const ezArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.2, 0x38bdf8, 0.2, 0.07);
    const ethetaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1.2, 0xf59e0b, 0.2, 0.07);

    scene.add(erhoArrow, ephiArrow, ezArrow, ethetaArrow);
    erhoArrowRef.current = erhoArrow;
    ephiArrowRef.current = ephiArrow;
    ezArrowRef.current = ezArrow;
    ethetaArrowRef.current = ethetaArrow;

    // 11. Mouse / Touch Drag Controls
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

    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onEnd();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onEnd();

    domElem.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    domElem.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

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
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      domElem.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      domElem.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (container) container.innerHTML = "";
      renderer.dispose();
    };
  }, []);

  // Update 3D Vector, 3D Geometries & 3D Visual Angle Arcs
  useEffect(() => {
    if (!sceneRef.current || !mMeshRef.current || !omLineRef.current) return;

    const phiRad = (phi * Math.PI) / 180;
    const thetaRad = (theta * Math.PI) / 180;

    let mx = 0, my = 0, mz = 0;

    if (coordType === "cartesien") {
      mx = r * Math.cos(phiRad);
      my = Math.max(0.1, zVal);
      mz = r * Math.sin(phiRad);
    } else if (coordType === "cylindrique") {
      mx = r * Math.cos(phiRad);
      my = Math.max(0.1, zVal);
      mz = r * Math.sin(phiRad);
    } else if (coordType === "spherique") {
      mx = r * Math.sin(thetaRad) * Math.cos(phiRad);
      my = r * Math.cos(thetaRad);
      mz = r * Math.sin(thetaRad) * Math.sin(phiRad);
    }

    const mPos = new THREE.Vector3(mx, my, mz);
    mMeshRef.current.position.copy(mPos);

    // Update OM line
    omLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), mPos]);

    // Update Projection line (O -> H -> M)
    if (projLineRef.current) {
      const hPos = new THREE.Vector3(mx, 0, mz);
      projLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), hPos, mPos]);
      projLineRef.current.computeLineDistances();
    }

    // Dynamic 3D Geometries Scaling & Positioning
    const rhoVal = Math.sqrt(mx * mx + mz * mz) || 0.1;

    if (cylinderMeshRef.current) {
      cylinderMeshRef.current.visible = showVolumeShape && coordType === "cylindrique";
      if (coordType === "cylindrique") {
        cylinderMeshRef.current.scale.set(rhoVal, my, rhoVal);
        cylinderMeshRef.current.position.set(0, my / 2, 0);
      }
    }

    if (sphereMeshRef.current) {
      sphereMeshRef.current.visible = showVolumeShape && coordType === "spherique";
      if (coordType === "spherique") {
        const radiusSph = mPos.length() || 0.1;
        sphereMeshRef.current.scale.set(radiusSph, radiusSph, radiusSph);
        sphereMeshRef.current.position.set(0, 0, 0);
      }
    }

    if (boxMeshRef.current) {
      boxMeshRef.current.visible = showVolumeShape && coordType === "cartesien";
      if (coordType === "cartesien") {
        const bx = Math.abs(mx) || 0.1;
        const by = Math.abs(my) || 0.1;
        const bz = Math.abs(mz) || 0.1;
        boxMeshRef.current.scale.set(bx, by, bz);
        boxMeshRef.current.position.set(mx / 2, my / 2, mz / 2);
      }
    }

    // Render 3D Visual Angle Arcs
    if (phiArcLineRef.current) {
      phiArcLineRef.current.visible = coordType !== "cartesien";
      if (coordType !== "cartesien") {
        const arcPoints: THREE.Vector3[] = [];
        const radiusArc = 1.3;
        const segments = 24;
        for (let i = 0; i <= segments; i++) {
          const a = (phiRad * i) / segments;
          arcPoints.push(new THREE.Vector3(radiusArc * Math.cos(a), 0, radiusArc * Math.sin(a)));
        }
        phiArcLineRef.current.geometry.setFromPoints(arcPoints);
      }
    }

    if (thetaArcLineRef.current) {
      thetaArcLineRef.current.visible = coordType === "spherique";
      if (coordType === "spherique") {
        const arcPoints: THREE.Vector3[] = [];
        const radiusArc = 1.1;
        const segments = 24;
        for (let i = 0; i <= segments; i++) {
          const a = (thetaRad * i) / segments;
          const px = radiusArc * Math.sin(a) * Math.cos(phiRad);
          const py = radiusArc * Math.cos(a);
          const pz = radiusArc * Math.sin(a) * Math.sin(phiRad);
          arcPoints.push(new THREE.Vector3(px, py, pz));
        }
        thetaArcLineRef.current.geometry.setFromPoints(arcPoints);
      }
    }

    // Update Basis Vector Directions
    if (coordType === "cylindrique") {
      const dirErho = new THREE.Vector3(mx / rhoVal, 0, mz / rhoVal);
      const dirEphi = new THREE.Vector3(-mz / rhoVal, 0, mx / rhoVal);
      const dirEz = new THREE.Vector3(0, 1, 0);

      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(dirErho);
        erhoArrowRef.current.setColor(0xf43f5e);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(dirEphi);
        ephiArrowRef.current.setColor(0x10b981);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(dirEz);
        ezArrowRef.current.setColor(0x38bdf8);
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
        erhoArrowRef.current.setColor(0xf43f5e);
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
        erhoArrowRef.current.setColor(0xf87171);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(new THREE.Vector3(0, 1, 0));
        ephiArrowRef.current.setColor(0x34d399);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(new THREE.Vector3(0, 0, 1));
        ezArrowRef.current.setColor(0x38bdf8);
      }

      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
      if (ezArrowRef.current) ezArrowRef.current.visible = true;
    }
  }, [coordType, r, phi, theta, zVal, showVolumeShape]);

  return (
    <div className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl my-4 w-full max-w-full overflow-hidden">
      
      {/* Selector Tabs Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 pb-3 border-b border-border/40 w-full">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-extrabold text-foreground leading-tight">
            Simulateur 3D WebGL • Angles Visuels (φ, θ) & Formes 3D
          </h3>
        </div>

        {/* Buttons Grid */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setCoordType("cartesien")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "cartesien" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cube (x,y,z)
            </button>
            <button
              onClick={() => setCoordType("cylindrique")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "cylindrique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cylindre (ρ,φ,z)
            </button>
            <button
              onClick={() => setCoordType("spherique")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "spherique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sphère (r,θ,φ)
            </button>
          </div>

          <button
            onClick={() => setShowVolumeShape(!showVolumeShape)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              showVolumeShape ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" : "bg-muted text-muted-foreground border-border/50"
            }`}
            title="Afficher/Masquer le volume 3D"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volume 3D</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[260px] sm:h-[330px] rounded-xl sm:rounded-2xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing border border-slate-800">
        <div ref={mountRef} className="w-full h-full" />

        {/* Visual Angle Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Angle Azimutal φ = {phi}°</span>
          </div>
          {coordType === "spherique" && (
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Angle Zénithal θ = {theta}°</span>
            </div>
          )}
        </div>

        {/* View Indicator */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-1">
          <Eye className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Faites glisser en 3D</span>
        </div>

        {/* LaTeX Formula Legend */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 bg-slate-950/90 backdrop-blur-md p-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 text-[10px] sm:text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 max-h-[85px] overflow-y-auto custom-scrollbar">
          {coordType === "cylindrique" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{e}_\rho = \cos\phi\vec{i} + \sin\phi\vec{j}" />
                <LatexMath math="\vec{e}_\phi = -\sin\phi\vec{i} + \cos\phi\vec{j}" />
                <LatexMath math="\vec{e}_z = \vec{k}" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = \rho\,d\rho\,d\phi\,dz" /></div>
            </>
          )}
          {coordType === "spherique" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{e}_r = \sin\theta\cos\phi\vec{i} + \sin\theta\sin\phi\vec{j} + \cos\theta\vec{k}" />
                <LatexMath math="\vec{e}_\theta = \cos\theta\cos\phi\vec{i} + \cos\theta\sin\phi\vec{j} - \sin\theta\vec{k}" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = r^2\sin\theta\,dr\,d\theta\,d\phi" /></div>
            </>
          )}
          {coordType === "cartesien" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{i} = (1,0,0)" />
                <LatexMath math="\vec{j} = (0,1,0)" />
                <LatexMath math="\vec{k} = (0,0,1)" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = dx\,dy\,dz" /></div>
            </>
          )}
        </div>
      </div>

      {/* Sliders Controls Panel - Slender H-1.5 Tracks */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-muted/30 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/40 w-full overflow-hidden">
        <div className="w-full">
          <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
            <span>Rayon / Dimension (r / ρ):</span>
            <span className="text-cyan-400 font-extrabold">{r.toFixed(1)} u</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="4.5"
            step="0.1"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div className="w-full">
          <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
            <span>Angle Azimutal (φ):</span>
            <span className="text-emerald-400 font-extrabold">{phi}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {coordType === "spherique" ? (
          <div className="w-full">
            <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
              <span>Angle Zénithal (θ):</span>
              <span className="text-amber-400 font-extrabold">{theta}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="180"
              value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full">
            <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
              <span>Hauteur (z):</span>
              <span className="text-purple-400 font-extrabold">{zVal.toFixed(1)} u</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={zVal}
              onChange={(e) => setZVal(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
