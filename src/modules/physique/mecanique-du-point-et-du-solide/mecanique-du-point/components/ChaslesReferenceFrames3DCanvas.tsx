"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Play, Pause, Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function ChaslesReferenceFrames3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Interactive Sliders Parameters
  const [thetaDeg, setThetaDeg] = useState<number>(40); // Angle of mobile frame R1 relative to R0
  const [distO1, setDistO1] = useState<number>(3.5); // Distance O -> O1
  const [relMx, setRelMx] = useState<number>(2.8); // Local X of M in R1
  const [relMy, setRelMy] = useState<number>(1.6); // Local Y of M in R1
  const [relMz, setRelMz] = useState<number>(0.8); // Local Z of M in R1
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const isRotatingRef = useRef<boolean>(isRotating);
  const thetaRef = useRef<number>(thetaDeg);
  const angleO1Ref = useRef<number>(20);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    thetaRef.current = thetaDeg;
  }, [thetaDeg]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8.5, 7.0, 10.5);
    camera.lookAt(1.8, 1.0, 0.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    backLight.position.set(-8, 5, -8);
    scene.add(backLight);

    // Dark Floor Grid
    const grid = new THREE.GridHelper(16, 32, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Helper to create sleek, ultra-thin 3D vectors
    const createThinVector3D = (colorHex: number, shaftRadius: number = 0.018, headRadius: number = 0.055) => {
      const group = new THREE.Group();

      const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, 1, 16);
      shaftGeo.translate(0, 0.5, 0);
      const shaftMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.3,
        roughness: 0.2,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      group.add(shaft);

      const headGeo = new THREE.ConeGeometry(headRadius, 0.2, 16);
      headGeo.translate(0, 0.1, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.4,
        roughness: 0.2,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      group.add(head);

      return {
        group,
        update: (origin: THREE.Vector3, target: THREE.Vector3) => {
          const dir = new THREE.Vector3().subVectors(target, origin);
          const len = dir.length();
          if (len < 0.05) {
            group.visible = false;
            return;
          }
          group.visible = true;
          group.position.copy(origin);

          const normDir = dir.clone().normalize();
          group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normDir);

          const headLen = Math.min(0.2, len * 0.22);
          const shaftLen = len - headLen;
          shaft.scale.set(1, Math.max(0.001, shaftLen), 1);
          head.position.set(0, shaftLen, 0);
          const headScale = headLen / 0.2;
          head.scale.set(headScale, headScale, headScale);
        },
      };
    };

    // --- Fixed Reference Frame R0(O, x0, y0, z0) ---
    const r0OriginGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const r0OriginMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.8,
    });
    const r0OriginMesh = new THREE.Mesh(r0OriginGeo, r0OriginMat);
    scene.add(r0OriginMesh);

    const vecX0 = createThinVector3D(0x3b82f6, 0.016, 0.05);
    const vecY0 = createThinVector3D(0x3b82f6, 0.016, 0.05);
    const vecZ0 = createThinVector3D(0x3b82f6, 0.016, 0.05);
    scene.add(vecX0.group, vecY0.group, vecZ0.group);

    // --- Mobile Reference Frame R1(O1, x1, y1, z1) ---
    const r1OriginGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const r1OriginMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.8,
    });
    const r1OriginMesh = new THREE.Mesh(r1OriginGeo, r1OriginMat);
    scene.add(r1OriginMesh);

    const vecX1 = createThinVector3D(0xa855f7, 0.016, 0.05);
    const vecY1 = createThinVector3D(0xa855f7, 0.016, 0.05);
    const vecZ1 = createThinVector3D(0xa855f7, 0.016, 0.05);
    scene.add(vecX1.group, vecY1.group, vecZ1.group);

    // --- Point M ---
    const pointMGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
    });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    // --- Chasles Relation Main Vectors (Thin & Sleek) ---
    const vecOO1 = createThinVector3D(0xf59e0b, 0.024, 0.07); // OO1 Vector (Amber)
    const vecO1M = createThinVector3D(0x10b981, 0.024, 0.07); // O1M Vector (Emerald)
    const vecOM = createThinVector3D(0x06b6d4, 0.028, 0.08); // OM Vector (Cyan)
    scene.add(vecOO1.group, vecO1M.group, vecOM.group);

    // Dashed helper lines
    const lineMatDashed = new THREE.LineDashedMaterial({
      color: 0x475569,
      dashSize: 0.15,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.5,
    });

    const dashedGeoOO1 = new THREE.BufferGeometry();
    const dashedGeoO1M = new THREE.BufferGeometry();
    const dashedLineOO1 = new THREE.Line(dashedGeoOO1, lineMatDashed);
    const dashedLineO1M = new THREE.Line(dashedGeoO1M, lineMatDashed);
    scene.add(dashedLineOO1, dashedLineO1M);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.5;
    let cameraAngleY = 0.4;
    const cameraRadius = 14;

    const updateCameraPosition = () => {
      camera.position.x = 1.8 + cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = 1.0 + cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(1.8, 1.0, 0);
    };
    updateCameraPosition();

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      cameraAngleX -= dx * 0.008;
      cameraAngleY += dy * 0.008;
      cameraAngleY = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, cameraAngleY));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", handleResize);

    // Convert 3D vector to 2D screen coords for minimal labels
    const toScreenPosition = (v3: THREE.Vector3) => {
      const clone = v3.clone();
      clone.project(camera);
      const x = (clone.x * 0.5 + 0.5) * width;
      const y = (-clone.y * 0.5 + 0.5) * height;
      const visible = clone.z < 1.0;
      return { x, y, visible };
    };

    // Render & Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isRotatingRef.current) {
        thetaRef.current = (thetaRef.current + delta * 40) % 360;
        angleO1Ref.current = (angleO1Ref.current + delta * 12) % 360;
      }

      const thetaRad = (thetaRef.current * Math.PI) / 180;
      const angleO1Rad = (angleO1Ref.current * Math.PI) / 180;

      // 1. Origin Positions
      const O = new THREE.Vector3(0, 0, 0);
      const O1 = new THREE.Vector3(
        distO1 * Math.cos(angleO1Rad),
        0.4,
        -distO1 * Math.sin(angleO1Rad)
      );

      // Fixed R0 Axes
      const r0AxisLen = 2.4;
      const pX0 = new THREE.Vector3(r0AxisLen, 0, 0);
      const pY0 = new THREE.Vector3(0, r0AxisLen, 0);
      const pZ0 = new THREE.Vector3(0, 0, r0AxisLen);
      vecX0.update(O, pX0);
      vecY0.update(O, pY0);
      vecZ0.update(O, pZ0);

      // 2. Mobile R1 Axes
      const uX1 = new THREE.Vector3(Math.cos(thetaRad), 0, -Math.sin(thetaRad));
      const uY1 = new THREE.Vector3(0, 1, 0);
      const uZ1 = new THREE.Vector3(Math.sin(thetaRad), 0, Math.cos(thetaRad));

      const r1AxisLen = 2.2;
      const pX1 = O1.clone().add(uX1.clone().multiplyScalar(r1AxisLen));
      const pY1 = O1.clone().add(uY1.clone().multiplyScalar(r1AxisLen));
      const pZ1 = O1.clone().add(uZ1.clone().multiplyScalar(r1AxisLen));

      r1OriginMesh.position.copy(O1);
      vecX1.update(O1, pX1);
      vecY1.update(O1, pY1);
      vecZ1.update(O1, pZ1);

      // 3. Point M Position
      const vecO1M_local = new THREE.Vector3()
        .addScaledVector(uX1, relMx)
        .addScaledVector(uY1, relMy)
        .addScaledVector(uZ1, relMz);

      const M = O1.clone().add(vecO1M_local);
      pointMMesh.position.copy(M);

      // 4. Chasles Relation 3D Vectors
      vecOO1.update(O, O1);
      vecO1M.update(O1, M);
      vecOM.update(O, M);

      // Dashed lines
      dashedGeoOO1.setFromPoints([O, O1]);
      dashedLineOO1.computeLineDistances();
      dashedGeoO1M.setFromPoints([O1, M]);
      dashedLineO1M.computeLineDistances();

      // --- Minimal Screen Projections (Clean, no dark boxes, only key labels) ---
      const spO = toScreenPosition(O.clone().add(new THREE.Vector3(-0.25, -0.2, 0)));
      const spX0 = toScreenPosition(pX0.clone().add(new THREE.Vector3(0.2, 0, 0)));
      const spY0 = toScreenPosition(pY0.clone().add(new THREE.Vector3(0, 0.2, 0)));

      const spO1 = toScreenPosition(O1.clone().add(new THREE.Vector3(-0.25, -0.2, 0)));
      const spX1 = toScreenPosition(pX1.clone().add(new THREE.Vector3(0.2, 0, 0)));
      const spY1 = toScreenPosition(pY1.clone().add(new THREE.Vector3(0, 0.2, 0)));

      const spM = toScreenPosition(M.clone().add(new THREE.Vector3(0.25, 0.2, 0)));

      const updateLabel = (id: string, sp: {x: number, y: number, visible: boolean}) => {
        const el = document.getElementById(`chasles-lbl-${id}`);
        if (!el) return;
        if (sp.visible) {
          el.style.display = 'block';
          el.style.transform = `translate(-50%, -50%) translate(${sp.x}px, ${sp.y}px)`;
        } else {
          el.style.display = 'none';
        }
      };

      updateLabel("O", spO);
      updateLabel("x0", spX0);
      updateLabel("y0", spY0);
      updateLabel("O1", spO1);
      updateLabel("x1", spX1);
      updateLabel("y1", spY1);
      updateLabel("M", spM);

      renderer.render(scene, camera);
      if (isInViewRef.current) animFrameRef.current = requestAnimationFrame(animate);
    };

    const isInViewRef = { current: false };
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (isInViewRef.current) animFrameRef.current = requestAnimationFrame(animate);
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      intersectionObserver.disconnect();
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(domElement)) container.removeChild(domElement);
    };
  }, [distO1, relMx, relMy, relMz]);

  return (
    <div className="p-2 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-amber-400">
            Simulateur 3D : Repères <LatexMath math="\mathcal{R}_0" />, <LatexMath math="\mathcal{R}_1" /> & Chasles <LatexMath math="\vec{OM} = \vec{OO}_1 + \vec{O_1 M}" />
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500"
          >
            {showLegend ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
            <span className="hidden sm:inline">{showLegend ? "Masquer Légende" : "Afficher Légende"}</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
              isRotating
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse"
                : "bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500"
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? "Pause Ω" : "Animer Ω"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div 
        className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
        style={{ touchAction: 'none' }}
      >
        <div ref={mountRef} className="w-full h-[280px] sm:h-[360px] cursor-grab active:cursor-grabbing" />

        {/* Minimal Clean 3D Labels updated directly via DOM for smooth performance */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div id="chasles-lbl-O" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-blue-400 font-bold top-0 left-0" style={{ display: 'none' }}>O (R0)</div>
          <div id="chasles-lbl-x0" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-blue-300 top-0 left-0" style={{ display: 'none' }}>x0</div>
          <div id="chasles-lbl-y0" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-blue-300 top-0 left-0" style={{ display: 'none' }}>y0</div>
          
          <div id="chasles-lbl-O1" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-purple-400 font-bold top-0 left-0" style={{ display: 'none' }}>O1 (R1)</div>
          <div id="chasles-lbl-x1" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-purple-300 top-0 left-0" style={{ display: 'none' }}>x1</div>
          <div id="chasles-lbl-y1" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-purple-300 top-0 left-0" style={{ display: 'none' }}>y1</div>
          
          <div id="chasles-lbl-M" className="absolute font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none text-sky-300 font-black text-xs top-0 left-0" style={{ display: 'none' }}>M</div>
        </div>

        {/* Collapsible Clean Overlay Legend */}
        {showLegend && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1 shadow-lg pointer-events-none max-w-[220px] sm:max-w-none">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span>R0 Fixe (O, x0, y0, z0)</span>
            </div>

            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span>R1 Mobile (O1, x1, y1, z1)</span>
            </div>

            <div className="pt-1 border-t border-slate-800 space-y-0.5 text-[9.5px]">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400 inline-block" />
                <span>Vecteur OO1 (Ambre)</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
                <span>Vecteur O1M (Émeraude)</span>
              </div>

              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block" />
                <span>Vecteur OM = OO1 + O1M (Cyan)</span>
              </div>
            </div>
          </div>
        )}

        {/* Chasles Formula Card */}
        <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-200 shadow-md">
          <span className="text-amber-400 font-bold">Chasles : </span>
          <LatexMath math="\vec{OM} = \vec{OO}_1 + \vec{O_1 M}" />
        </div>
      </div>

      {/* Compact Sliders Panel (Responsive on Mobile) */}
      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono">
        {/* Slider 1: Orientation Theta */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-slate-300">
            <span>Orientation <LatexMath math="\theta" />:</span>
            <span className="text-purple-400 font-bold">{thetaDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={thetaDeg}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setThetaDeg(val);
              thetaRef.current = val;
            }}
            className="w-full h-1.5 accent-purple-500 cursor-pointer rounded-lg bg-slate-800"
          />
        </div>

        {/* Slider 2: Position OO1 */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-slate-300">
            <span>Distance <LatexMath math="OO_1" />:</span>
            <span className="text-amber-400 font-bold">{distO1.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={distO1}
            onChange={(e) => setDistO1(parseFloat(e.target.value))}
            className="w-full h-1.5 accent-amber-500 cursor-pointer rounded-lg bg-slate-800"
          />
        </div>

        {/* Slider 3: Position O1M */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-slate-300">
            <span>Composante X de <LatexMath math="\vec{O_1 M}" />:</span>
            <span className="text-emerald-400 font-bold">{relMx.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.1"
            value={relMx}
            onChange={(e) => setRelMx(parseFloat(e.target.value))}
            className="w-full h-1.5 accent-emerald-500 cursor-pointer rounded-lg bg-slate-800"
          />
        </div>
      </div>
    </div>
  );
}
