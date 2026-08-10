"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Zap, Eye } from "lucide-react";

export default function VectorProductSimulator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [normU, setNormU] = useState(4.0);
  const [normV, setNormV] = useState(3.4);
  const [angleDeg, setAngleDeg] = useState(45);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const uArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const vArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const crossArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const parMeshRef = useRef<THREE.Mesh | null>(null);
  const perpSquareRef = useRef<THREE.LineSegments | null>(null);

  const angleRad = (angleDeg * Math.PI) / 180;
  const dotProduct = normU * normV * Math.cos(angleRad);
  const crossProductNorm = normU * normV * Math.sin(angleRad);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      webglSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch (e) {
      webglSupported = false;
    }

    if (!webglSupported) {
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(5.5, 4.5, 6.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(8, 12, 8);
    scene.add(dirLight);

    // 3. Ground Grid Helper
    const gridHelper = new THREE.GridHelper(8, 8, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Ground Plane Axes (X: Cyan, Z: Purple)
    const axesLen = 4.0;
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axesLen, 0x334155, 0.15, 0.05);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axesLen, 0x334155, 0.15, 0.05);
    scene.add(xAxis, zAxis);

    // 5. Dynamic 3D Vectors
    // U Arrow (Cyan)
    const uArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), normU * 0.7, 0x38bdf8, 0.25, 0.08);
    scene.add(uArrow);
    uArrowRef.current = uArrow;

    // V Arrow (Purple)
    const vArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), normV * 0.7, 0xc084fc, 0.25, 0.08);
    scene.add(vArrow);
    vArrowRef.current = vArrow;

    // Cross Product Arrow u ∧ v (Rose Red - Vertically Upwards along +Y axis!)
    const crossArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.5, 0xf43f5e, 0.28, 0.09);
    scene.add(crossArrow);
    crossArrowRef.current = crossArrow;

    // 6. Translucent Parallelogram Mesh (Area = ||u ∧ v||)
    const parMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const parMesh = new THREE.Mesh(new THREE.BufferGeometry(), parMat);
    scene.add(parMesh);
    parMeshRef.current = parMesh;

    // 7. Right-Angle Symbol (Perpendicularity Marker ⊥)
    const squareMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
    const sqPts = [
      new THREE.Vector3(0.3, 0, 0), new THREE.Vector3(0.3, 0.3, 0),
      new THREE.Vector3(0.3, 0.3, 0), new THREE.Vector3(0, 0.3, 0),
    ];
    const sqGeo = new THREE.BufferGeometry().setFromPoints(sqPts);
    const perpSquare = new THREE.LineSegments(sqGeo, squareMat);
    scene.add(perpSquare);
    perpSquareRef.current = perpSquare;

    // 8. Orbit Controls (Mouse Drag)
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
      camSpherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, camSpherical.phi - deltaY * 0.008));

      camera.position.setFromSpherical(camSpherical);
      camera.lookAt(0, 1.2, 0);

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

    const animate = () => {
      if (!isInView) return;
      animId = requestAnimationFrame(animate);
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

  // Update 3D Vector Geometries
  useEffect(() => {
    if (!uArrowRef.current || !vArrowRef.current || !crossArrowRef.current || !parMeshRef.current) return;

    const rad = (angleDeg * Math.PI) / 180;
    const s = 0.55; // scale factor

    // Vector U along ground +X axis
    const uVec = new THREE.Vector3(normU * s, 0, 0);
    uArrowRef.current.setLength(normU * s, 0.22, 0.07);

    // Vector V in ground plane at angle rad
    const vVec = new THREE.Vector3(normV * s * Math.cos(rad), 0, -normV * s * Math.sin(rad));
    const dirV = vVec.clone().normalize();
    vArrowRef.current.setDirection(dirV);
    vArrowRef.current.setLength(normV * s, 0.22, 0.07);

    // Cross Product u ∧ v vector (Strictly Orthogonal upwards along +Y)
    const cpNorm = (normU * normV * Math.sin(rad)) * s * 0.5;
    const cpLength = Math.max(0.1, Math.min(3.8, cpNorm));
    crossArrowRef.current.setLength(cpLength, 0.25, 0.08);
    crossArrowRef.current.visible = angleDeg > 0 && angleDeg < 180;

    // Parallelogram Mesh (0, uVec, uVec + vVec, vVec)
    const parGeo = new THREE.BufferGeometry();
    const positions = [
      0, 0, 0,
      uVec.x, uVec.y, uVec.z,
      uVec.x + vVec.x, uVec.y + vVec.y, uVec.z + vVec.z,

      0, 0, 0,
      uVec.x + vVec.x, uVec.y + vVec.y, uVec.z + vVec.z,
      vVec.x, vVec.y, vVec.z,
    ];
    parGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    parGeo.computeVertexNormals();

    parMeshRef.current.geometry.dispose();
    parMeshRef.current.geometry = parGeo;
  }, [normU, normV, angleDeg]);

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl my-6 w-full max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              Simulateur 3D Interactif • Produit Vectoriel Orthogonal (u ∧ v ⊥ Plan)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Observez la perpendicularité 3D stricte du vecteur résultat <span className="text-rose-400 font-bold">u ∧ v</span> au plan (u, v)
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-cyan-400 font-mono font-bold self-start sm:self-auto">
          θ = {angleDeg}°
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* 3D WebGL Vector Interactive Canvas */}
        <div className="md:col-span-6 bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 relative h-[210px] overflow-hidden cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />

          {/* View Drag Badge */}
          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>Glisser en 3D</span>
          </div>

          {/* Legend Badge */}
          <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">u</span>
            <span className="text-purple-400 font-bold">v</span>
            <span className="text-rose-400 font-extrabold">u ∧ v (⊥ Plan)</span>
          </div>
        </div>

        {/* Live Calculation Results */}
        <div className="md:col-span-6 space-y-2.5">
          
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-cyan-400">Produit Scalaire (u · v):</span>
              <span className="text-sm font-black font-mono text-cyan-300">{dotProduct.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              <LatexMath math={`\\vec{u} \\cdot \\vec{v} = ${normU} \\times ${normV} \\times \\cos(${angleDeg}^\\circ) = ${dotProduct.toFixed(2)}`} />
            </p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-400">Norme du Produit Vectoriel (||u ∧ v||):</span>
              <span className="text-sm font-black font-mono text-rose-300">{crossProductNorm.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              <LatexMath math={`\\|\\vec{u} \\wedge \\vec{v}\\| = ${normU} \\times ${normV} \\times \\sin(${angleDeg}^\\circ) = ${crossProductNorm.toFixed(2)}`} />
            </p>
          </div>

        </div>

      </div>

      {/* Sliders Controls Panel - Slender H-1.5 Tracks */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
            <span>Longueur ||u||:</span>
            <span className="text-cyan-400 font-extrabold">{normU.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={normU}
            onChange={(e) => setNormU(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
            <span>Longueur ||v||:</span>
            <span className="text-purple-400 font-extrabold">{normV.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={normV}
            onChange={(e) => setNormV(Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
            <span>Angle Entre Vecteurs (θ):</span>
            <span className="text-amber-400 font-extrabold">{angleDeg}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="180"
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

    </div>
  );
}
