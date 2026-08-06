"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, Play, Pause, Eye } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

export default function ChaslesReferenceFrames3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Interactive Parameters
  const [thetaDeg, setThetaDeg] = useState<number>(35); // Angle of mobile frame R1 relative to R0
  const [distO1, setDistO1] = useState<number>(3.2); // Distance O -> O1
  const [angleO1Deg, setAngleO1Deg] = useState<number>(25); // Direction angle of O1 in R0 plane
  const [relMx, setRelMx] = useState<number>(2.5); // Local X of M in R1
  const [relMy, setRelMy] = useState<number>(1.8); // Local Y of M in R1
  const [relMz, setRelMz] = useState<number>(1.0); // Local Z of M in R1
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [showDashedTriangle, setShowDashedTriangle] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 380;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 9);
    camera.lookAt(1.5, 1, 0.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    backLight.position.set(-8, 5, -8);
    scene.add(backLight);

    // Dark Floor Grid
    const grid = new THREE.GridHelper(14, 28, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Helper to create sleek, thin 3D vectors (thin shaft + sharp cone)
    const createThinVector3D = (colorHex: number, shaftRadius: number = 0.025, headRadius: number = 0.07) => {
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

      const headGeo = new THREE.ConeGeometry(headRadius, 0.22, 16);
      headGeo.translate(0, 0.11, 0);
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

          // Default vector direction is Y-up (0,1,0)
          const normDir = dir.clone().normalize();
          group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normDir);

          const headLen = Math.min(0.22, len * 0.25);
          const shaftLen = len - headLen;
          shaft.scale.set(1, Math.max(0.001, shaftLen), 1);
          head.position.set(0, shaftLen, 0);
          const headScale = headLen / 0.22;
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

    const vecX0 = createThinVector3D(0x3b82f6, 0.02, 0.06);
    const vecY0 = createThinVector3D(0x3b82f6, 0.02, 0.06);
    const vecZ0 = createThinVector3D(0x3b82f6, 0.02, 0.06);
    scene.add(vecX0.group, vecY0.group, vecZ0.group);

    // --- Mobile Reference Frame R1(O1, x1, y1, z1) ---
    const r1OriginGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const r1OriginMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.8,
    });
    const r1OriginMesh = new THREE.Mesh(r1OriginGeo, r1OriginMat);
    scene.add(r1OriginMesh);

    const vecX1 = createThinVector3D(0xa855f7, 0.02, 0.06);
    const vecY1 = createThinVector3D(0xa855f7, 0.02, 0.06);
    const vecZ1 = createThinVector3D(0xa855f7, 0.02, 0.06);
    scene.add(vecX1.group, vecY1.group, vecZ1.group);

    // --- Point M ---
    const pointMGeo = new THREE.SphereGeometry(0.16, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
    });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    // --- Chasles Relation Main Vectors (Thin & Sleek) ---
    // 1. OO1 Vector (Amber / Orange)
    const vecOO1 = createThinVector3D(0xf59e0b, 0.03, 0.08);
    // 2. O1M Vector (Emerald Green)
    const vecO1M = createThinVector3D(0x10b981, 0.03, 0.08);
    // 3. OM Vector (Cyan / Sky Blue)
    const vecOM = createThinVector3D(0x06b6d4, 0.035, 0.09);

    scene.add(vecOO1.group, vecO1M.group, vecOM.group);

    // Dashed lines for Chasles vector triangle
    const lineMatDashed = new THREE.LineDashedMaterial({
      color: 0x64748b,
      dashSize: 0.15,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const dashedGeoOO1 = new THREE.BufferGeometry();
    const dashedGeoO1M = new THREE.BufferGeometry();
    const dashedLineOO1 = new THREE.Line(dashedGeoOO1, lineMatDashed);
    const dashedLineO1M = new THREE.Line(dashedGeoO1M, lineMatDashed);
    scene.add(dashedLineOO1, dashedLineO1M);

    // Rotation Arc around O1 for R1
    const rotArcGroup = new THREE.Group();
    scene.add(rotArcGroup);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.5;
    let cameraAngleY = 0.4;
    const cameraRadius = 13;

    const updateCameraPosition = () => {
      camera.position.x = 1.5 + cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = 1.0 + cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(1.5, 1.0, 0);
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

    const onMouseUp = () => {
      isDragging = false;
    };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 380;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", handleResize);

    // Render & Animation Loop
    let currentThetaDeg = thetaDeg;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isRotating) {
        currentThetaDeg = (currentThetaDeg + delta * 30) % 360;
        setThetaDeg(Math.round(currentThetaDeg));
      } else {
        currentThetaDeg = thetaDeg;
      }

      const thetaRad = (currentThetaDeg * Math.PI) / 180;
      const angleO1Rad = (angleO1Deg * Math.PI) / 180;

      // 1. Origin Positions
      const O = new THREE.Vector3(0, 0, 0);
      const O1 = new THREE.Vector3(
        distO1 * Math.cos(angleO1Rad),
        0.5,
        -distO1 * Math.sin(angleO1Rad)
      );

      // Update R0 axes (Fixed frame)
      const r0AxisLen = 2.2;
      vecX0.update(O, new THREE.Vector3(r0AxisLen, 0, 0));
      vecY0.update(O, new THREE.Vector3(0, r0AxisLen, 0));
      vecZ0.update(O, new THREE.Vector3(0, 0, r0AxisLen));

      // 2. Mobile Frame R1 unit vectors (rotated by theta around Y axis)
      const uX1 = new THREE.Vector3(Math.cos(thetaRad), 0, -Math.sin(thetaRad));
      const uY1 = new THREE.Vector3(0, 1, 0);
      const uZ1 = new THREE.Vector3(Math.sin(thetaRad), 0, Math.cos(thetaRad));

      const r1AxisLen = 2.0;
      r1OriginMesh.position.copy(O1);
      vecX1.update(O1, O1.clone().add(uX1.clone().multiplyScalar(r1AxisLen)));
      vecY1.update(O1, O1.clone().add(uY1.clone().multiplyScalar(r1AxisLen)));
      vecZ1.update(O1, O1.clone().add(uZ1.clone().multiplyScalar(r1AxisLen)));

      // 3. Point M Position
      // Local O1M vector in R1 basis
      const vecO1M_local = new THREE.Vector3()
        .addScaledVector(uX1, relMx)
        .addScaledVector(uY1, relMy)
        .addScaledVector(uZ1, relMz);

      const M = O1.clone().add(vecO1M_local);
      pointMMesh.position.copy(M);

      // 4. Update Chasles Relation 3D Vectors
      vecOO1.update(O, O1);
      vecO1M.update(O1, M);
      vecOM.update(O, M);

      // Update dashed support lines
      if (showDashedTriangle) {
        dashedLineOO1.visible = true;
        dashedLineO1M.visible = true;

        dashedGeoOO1.setFromPoints([O, O1]);
        dashedLineOO1.computeLineDistances();

        dashedGeoO1M.setFromPoints([O1, M]);
        dashedLineO1M.computeLineDistances();
      } else {
        dashedLineOO1.visible = false;
        dashedLineO1M.visible = false;
      }

      // Rebuild Rotation Arc around O1
      rotArcGroup.clear();
      const arcCurve = new THREE.EllipseCurve(0, 0, 1.0, 1.0, 0, thetaRad, false, 0);
      const arcPoints2D = arcCurve.getPoints(30);
      const arcPoints3D = arcPoints2D.map((p) => new THREE.Vector3(p.x, 0, -p.y));
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints3D);
      const arcMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.position.copy(O1);
      rotArcGroup.add(arcLine);

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
  }, [thetaDeg, distO1, angleO1Deg, relMx, relMy, relMz, isRotating, showDashedTriangle]);

  return (
    <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Schéma 3D Interactif : Référentiel Fixe <LatexMath math="\mathcal{R}_0(O)" />, Mobile{" "}
              <LatexMath math="\mathcal{R}_1(O_1)" /> & Relation de Chasles
            </span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1">
            <span>Représentation en 3D avec vecteurs fins et distincts. Relation de Chasles :</span>{" "}
            <LatexMath math="\vec{OM} = \vec{OO}_1 + \vec{O_1 M}" />
          </p>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isRotating
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
              : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
          }`}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRotating ? "Pause Rotation Ω" : "Animer Rotation Ω"}</span>
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mountRef} className="w-full h-[340px] sm:h-[400px] cursor-grab active:cursor-grabbing" />

        {/* Floating Overlay Legend */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-mono space-y-1.5 shadow-lg pointer-events-none">
          <div className="text-[11px] font-sans font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between gap-3">
            <span>Légende des Repères & Vecteurs (3D)</span>
          </div>

          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-blue-400 inline-block" />
            <span>Repère Fixe R0 (O, x0, y0, z0)</span>
          </div>

          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <span className="w-2.5 h-1 rounded-full bg-purple-400 inline-block" />
            <span>Repère Mobile R1 (O1, x1, y1, z1)</span>
          </div>

          <div className="pt-1 border-t border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-amber-400 inline-block" />
              <span>Vecteur OO1 (Position d'Origine O1)</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-emerald-400 inline-block" />
              <span>Vecteur O1M (Position Relative de M dans R1)</span>
            </div>

            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2.5 h-1 rounded-full bg-cyan-400 inline-block" />
              <span>Vecteur OM = OO1 + O1M (Position Absolue)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Display Card */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 shadow-lg">
          <span className="text-amber-400 font-bold">Chasles : </span>
          <LatexMath math="\vec{OM} = \vec{OO}_1 + \vec{O_1 M}" />
        </div>
      </div>

      {/* Sliders & Controls */}
      <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        {/* Slider 1: Rotation Theta */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Orientation <LatexMath math="\theta" /> de <LatexMath math="\mathcal{R}_1" />:</span>
            <span className="text-purple-400 font-bold">{thetaDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={thetaDeg}
            onChange={(e) => setThetaDeg(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Slider 2: Position OO1 */}
        <div className="flex flex-col gap-1">
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
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Slider 3: Position O1M */}
        <div className="flex flex-col gap-1">
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
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
