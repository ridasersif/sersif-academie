"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Play, Pause, RotateCcw, BookOpen, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface MinimalLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  visible: boolean;
  color: string;
}

export default function ExerciseCircleRolling3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Interactive parameters
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [omega, setOmega] = useState<number>(1.2); // Vitesse angulaire w (rad/s)
  const [radiusR, setRadiusR] = useState<number>(2.0); // Rayon R du cercle (OA = 2R)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showSolution, setShowSolution] = useState<boolean>(true); // Solution window right below!

  // 2D animation time state
  const [animTime, setAnimTime] = useState<number>(0);

  // 3D Screen Projected Minimal Labels
  const [labels, setLabels] = useState<MinimalLabel[]>([]);

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);

  const isPlayingRef = useRef<boolean>(isPlaying);
  const omegaRef = useRef<number>(omega);
  const radiusRef = useRef<number>(radiusR);
  const viewModeRef = useRef<"2D" | "3D">(viewMode);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    omegaRef.current = omega;
  }, [omega]);

  useEffect(() => {
    radiusRef.current = radiusR;
  }, [radiusR]);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  // 3D Three.js Engine Effect
  useEffect(() => {
    if (viewMode !== "3D" || !mountRef.current) return;
    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 380;

    timeRef.current = animTime;
    trailPointsRef.current = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8.5, 7.5, 10.5);
    camera.lookAt(2.0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(16, 32, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const createThinVector3D = (colorHex: number, shaftRadius: number = 0.018, headRadius: number = 0.055) => {
      const group = new THREE.Group();
      const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, 1, 16);
      shaftGeo.translate(0, 0.5, 0);
      const shaftMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.3, roughness: 0.2 });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      group.add(shaft);

      const headGeo = new THREE.ConeGeometry(headRadius, 0.2, 16);
      headGeo.translate(0, 0.1, 0);
      const headMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.4, roughness: 0.2 });
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
          group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

          const headLen = Math.min(0.2, len * 0.22);
          const shaftLen = len - headLen;
          shaft.scale.set(1, Math.max(0.001, shaftLen), 1);
          head.position.set(0, shaftLen, 0);
          const headScale = headLen / 0.2;
          head.scale.set(headScale, headScale, headScale);
        },
      };
    };

    const r0OriginGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const r0OriginMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.8 });
    const r0OriginMesh = new THREE.Mesh(r0OriginGeo, r0OriginMat);
    scene.add(r0OriginMesh);

    const vecX0 = createThinVector3D(0x3b82f6, 0.016, 0.05);
    const vecY0 = createThinVector3D(0x3b82f6, 0.016, 0.05);
    scene.add(vecX0.group, vecY0.group);

    const r1OriginGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const r1OriginMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.8 });
    const r1OriginMesh = new THREE.Mesh(r1OriginGeo, r1OriginMat);
    scene.add(r1OriginMesh);

    const vecX1 = createThinVector3D(0xa855f7, 0.016, 0.05);
    const vecY1 = createThinVector3D(0xa855f7, 0.016, 0.05);
    scene.add(vecX1.group, vecY1.group);

    const circleGroup = new THREE.Group();
    scene.add(circleGroup);
    const circleMat = new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.8 });
    const circleGeo = new THREE.BufferGeometry();
    const circleMesh = new THREE.LineLoop(circleGeo, circleMat);
    circleGroup.add(circleMesh);

    const pointAGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pointAMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const pointAMesh = new THREE.Mesh(pointAGeo, pointAMat);
    scene.add(pointAMesh);

    const pointMGeo = new THREE.SphereGeometry(0.16, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    const vecOO1 = createThinVector3D(0xf59e0b, 0.024, 0.07);
    const vecO1M = createThinVector3D(0x10b981, 0.024, 0.07);
    const vecOM = createThinVector3D(0x06b6d4, 0.028, 0.08);
    scene.add(vecOO1.group, vecO1M.group, vecOM.group);

    const MAX_TRAIL = 600;
    const trailPositions = new Float32Array(MAX_TRAIL * 3);
    const trailGeometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(trailPositions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    trailGeometry.setAttribute("position", posAttr);
    trailGeometry.setDrawRange(0, 0);

    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.95 });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngleX = 0.6;
    let cameraAngleY = 0.5;
    const cameraRadius = 14.0;

    const updateCameraPosition = () => {
      camera.position.x = 2.0 + cameraRadius * Math.sin(cameraAngleX) * Math.cos(cameraAngleY);
      camera.position.y = 1.0 + cameraRadius * Math.sin(cameraAngleY);
      camera.position.z = cameraRadius * Math.cos(cameraAngleX) * Math.cos(cameraAngleY);
      camera.lookAt(2.0, 0.5, 0);
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

    const toScreenPosition = (v3: THREE.Vector3) => {
      const clone = v3.clone();
      clone.project(camera);
      const x = (clone.x * 0.5 + 0.5) * width;
      const y = (-clone.y * 0.5 + 0.5) * height;
      const visible = clone.z < 1.0;
      return { x, y, visible };
    };

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const w = omegaRef.current;
      const R = radiusRef.current;

      if (isPlayingRef.current) {
        timeRef.current += delta;
        setAnimTime(timeRef.current);
      }

      const t = timeRef.current;
      const theta = w * t;

      const O = new THREE.Vector3(0, 0, 0);
      const O1 = new THREE.Vector3(R * Math.cos(theta), 0.2, -R * Math.sin(theta));
      const A = new THREE.Vector3(2 * R * Math.cos(theta), 0.2, -2 * R * Math.sin(theta));

      const r0AxisLen = 3.0;
      const pX0 = new THREE.Vector3(r0AxisLen, 0, 0);
      const pY0 = new THREE.Vector3(0, 0, -r0AxisLen);
      vecX0.update(O, pX0);
      vecY0.update(O, pY0);

      const uX1 = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));
      const uY1 = new THREE.Vector3(-Math.sin(theta), 0, -Math.cos(theta));

      const r1AxisLen = 2.4;
      const pX1 = O1.clone().add(uX1.clone().multiplyScalar(r1AxisLen));
      const pY1 = O1.clone().add(uY1.clone().multiplyScalar(r1AxisLen));

      r1OriginMesh.position.copy(O1);
      pointAMesh.position.copy(A);
      vecX1.update(O1, pX1);
      vecY1.update(O1, pY1);

      const circlePts: THREE.Vector3[] = [];
      const numPts = 64;
      for (let i = 0; i <= numPts; i++) {
        const phi = (i / numPts) * Math.PI * 2;
        const ptLocal = new THREE.Vector3()
          .addScaledVector(uX1, R * Math.cos(phi))
          .addScaledVector(uY1, R * Math.sin(phi));
        circlePts.push(O1.clone().add(ptLocal));
      }
      circleGeo.setFromPoints(circlePts);

      const relAngle = w * t;
      const vecO1M_local = new THREE.Vector3()
        .addScaledVector(uX1, R * Math.cos(relAngle))
        .addScaledVector(uY1, R * Math.sin(relAngle));

      const M = O1.clone().add(vecO1M_local);
      pointMMesh.position.copy(M);

      vecOO1.update(O, O1);
      vecO1M.update(O1, M);
      vecOM.update(O, M);

      if (isPlayingRef.current) {
        const trail = trailPointsRef.current;
        if (trail.length === 0 || trail[trail.length - 1].distanceTo(M) > 0.03) {
          trail.push(M.clone());
          if (trail.length > MAX_TRAIL) trail.shift();

          const positionsArr = posAttr.array as Float32Array;
          for (let i = 0; i < trail.length; i++) {
            positionsArr[i * 3] = trail[i].x;
            positionsArr[i * 3 + 1] = trail[i].y;
            positionsArr[i * 3 + 2] = trail[i].z;
          }
          posAttr.needsUpdate = true;
          trailGeometry.setDrawRange(0, trail.length);
        }
      }

      const spO = toScreenPosition(O.clone().add(new THREE.Vector3(-0.2, -0.2, 0)));
      const spO1 = toScreenPosition(O1.clone().add(new THREE.Vector3(-0.2, -0.2, 0)));
      const spA = toScreenPosition(A.clone().add(new THREE.Vector3(0.2, 0.2, 0)));
      const spM = toScreenPosition(M.clone().add(new THREE.Vector3(0.25, 0.2, 0)));

      setLabels([
        { id: "O", text: "O (R0)", x: spO.x, y: spO.y, visible: spO.visible, color: "text-blue-400 font-bold" },
        { id: "O1", text: "O1 (Centre)", x: spO1.x, y: spO1.y, visible: spO1.visible, color: "text-purple-400 font-bold" },
        { id: "A", text: "A", x: spA.x, y: spA.y, visible: spA.visible, color: "text-amber-400 font-bold" },
        { id: "M", text: "M", x: spM.x, y: spM.y, visible: spM.visible, color: "text-sky-300 font-black text-xs" },
      ]);

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
  }, [viewMode]);

  // 2D SVG Animation Loop
  useEffect(() => {
    if (viewMode !== "2D") return;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      if (isPlayingRef.current) {
        setAnimTime((prev) => prev + delta);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode]);

  // 2D SVG Calculations matching the whiteboard diagram
  const R_px = 75; // Radius in pixels for 2D diagram
  const theta2D = omega * animTime;
  const O2D = { x: 120, y: 220 }; // Fixed origin O

  // O1 (center of circle) along angle theta from O
  const O12D = {
    x: O2D.x + R_px * Math.cos(theta2D),
    y: O2D.y - R_px * Math.sin(theta2D),
  };

  // Point A (end of diameter OA = 2R)
  const A2D = {
    x: O2D.x + 2 * R_px * Math.cos(theta2D),
    y: O2D.y - 2 * R_px * Math.sin(theta2D),
  };

  // Mobile axes unit vectors x1, y1
  const ux1 = { x: Math.cos(theta2D), y: -Math.sin(theta2D) };
  const uy1 = { x: -Math.sin(theta2D), y: -Math.cos(theta2D) };

  // Point M on circle (relative angle w*t from A)
  const relAngle2D = omega * animTime;
  const M2D = {
    x: O12D.x + R_px * (ux1.x * Math.cos(relAngle2D) + uy1.x * Math.sin(relAngle2D)),
    y: O12D.y + R_px * (ux1.y * Math.cos(relAngle2D) + uy1.y * Math.sin(relAngle2D)),
  };

  return (
    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden mb-6">
      {/* Header: Title "Exercice 1" + Mode Switcher (2D / 3D) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm sm:text-lg font-black text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Exercice 1</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Cercle de diamètre <LatexMath math="OA" /> tournant à vitesse <LatexMath math="\omega" /> autour du point fixe <LatexMath math="O" />.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("2D")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "2D"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2D Schéma (Tableau)
            </button>

            <button
              onClick={() => setViewMode("3D")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "3D"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3D Vue Interactive
            </button>
          </div>

          {/* Eye Toggle Legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500"
          >
            {showLegend ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{showLegend ? "Masquer Légende" : "Afficher Légende"}</span>
          </button>
        </div>
      </div>

      {/* --- CANVAS VIEW CONTAINER (2D SVG OR 3D THREE.JS) --- */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        {viewMode === "2D" ? (
          /* --- 2D SVG SCHEMA (Matching whiteboard diagram) --- */
          <div className="w-full h-[300px] sm:h-[380px] flex items-center justify-center p-2 overflow-x-auto">
            <svg viewBox="0 0 540 340" className="w-full max-w-xl h-auto">
              <defs>
                <marker id="arrowBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker id="arrowPurple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                </marker>
                <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker id="arrowEmerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
              </defs>

              {/* Fixed Frame R0(O, x, y) */}
              <line x1={O2D.x} y1={O2D.y} x2={O2D.x + 360} y2={O2D.y} stroke="#3b82f6" strokeWidth="1.8" markerEnd="url(#arrowBlue)" />
              <line x1={O2D.x} y1={O2D.y} x2={O2D.x} y2={O2D.y - 180} stroke="#3b82f6" strokeWidth="1.8" markerEnd="url(#arrowBlue)" />
              <text x={O2D.x + 345} y={O2D.y + 18} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">x</text>
              <text x={O2D.x - 18} y={O2D.y - 170} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">y</text>
              <circle cx={O2D.x} cy={O2D.y} r="4" fill="#3b82f6" />
              <text x={O2D.x - 18} y={O2D.y + 16} fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="monospace">O</text>

              {/* Unit vectors i and j */}
              <text x={O2D.x + 45} y={O2D.y + 16} fill="#3b82f6" fontSize="12" fontWeight="bold" fontFamily="monospace">i</text>
              <text x={O2D.x - 15} y={O2D.y - 45} fill="#3b82f6" fontSize="12" fontWeight="bold" fontFamily="monospace">j</text>

              {/* Circle centered at O1 with radius R */}
              <circle cx={O12D.x} cy={O12D.y} r={R_px} fill="none" stroke="#a855f7" strokeWidth="2" />
              <circle cx={O12D.x} cy={O12D.y} r="3.5" fill="#a855f7" />
              <text x={O12D.x - 10} y={O12D.y + 18} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="monospace">O1</text>

              {/* Mobile Frame R1 Axes x1 and y1 */}
              <line
                x1={O12D.x - 40 * ux1.x}
                y1={O12D.y - 40 * ux1.y}
                x2={O12D.x + 160 * ux1.x}
                y2={O12D.y + 160 * ux1.y}
                stroke="#a855f7" strokeWidth="1.8" strokeDasharray="5,3" markerEnd="url(#arrowPurple)"
              />
              <line
                x1={O12D.x - 40 * uy1.x}
                y1={O12D.y - 40 * uy1.y}
                x2={O12D.x + 130 * uy1.x}
                y2={O12D.y + 130 * uy1.y}
                stroke="#a855f7" strokeWidth="1.8" strokeDasharray="5,3" markerEnd="url(#arrowPurple)"
              />
              <text x={O12D.x + 155 * ux1.x + 5} y={O12D.y + 155 * ux1.y + 5} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="monospace">x1</text>
              <text x={O12D.x + 125 * uy1.x - 12} y={O12D.y + 125 * uy1.y - 5} fill="#a855f7" fontSize="12" fontWeight="bold" fontFamily="monospace">y1</text>

              {/* Point A (End of Diameter OA) */}
              <circle cx={A2D.x} cy={A2D.y} r="4" fill="#f59e0b" />
              <text x={A2D.x + 8} y={A2D.y + 14} fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">A</text>

              {/* Point M on circle */}
              <circle cx={M2D.x} cy={M2D.y} r="5.5" fill="#06b6d4" />
              <text x={M2D.x + 10} y={M2D.y - 6} fill="#06b6d4" fontSize="14" fontWeight="black" fontFamily="monospace">M</text>

              {/* Vector OO1 (Amber) */}
              <line x1={O2D.x} y1={O2D.y} x2={O12D.x} y2={O12D.y} stroke="#f59e0b" strokeWidth="2.2" markerEnd="url(#arrowAmber)" />

              {/* Vector O1M (Emerald) */}
              <line x1={O12D.x} y1={O12D.y} x2={M2D.x} y2={M2D.y} stroke="#10b981" strokeWidth="2.2" markerEnd="url(#arrowEmerald)" />

              {/* Vector OM (Cyan) */}
              <line x1={O2D.x} y1={O2D.y} x2={M2D.x} y2={M2D.y} stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowCyan)" />

              {/* Rotation Angle Arc theta */}
              <path
                d={`M ${O2D.x + 50},${O2D.y} A 50 50 0 0 0 ${O2D.x + 50 * Math.cos(theta2D)},${O2D.y - 50 * Math.sin(theta2D)}`}
                fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#arrowAmber)"
              />
              <text x={O2D.x + 58 * Math.cos(theta2D / 2)} y={O2D.y - 58 * Math.sin(theta2D / 2)} fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">θ</text>
            </svg>
          </div>
        ) : (
          /* --- 3D THREE.JS CANVAS --- */
          <div className="relative">
            <div ref={mountRef} className="w-full h-[280px] sm:h-[360px] cursor-grab active:cursor-grabbing" />

            {/* Minimal Screen Labels */}
            {labels.map((lbl) =>
              lbl.visible ? (
                <div
                  key={lbl.id}
                  style={{
                    left: `${lbl.x}px`,
                    top: `${lbl.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute pointer-events-none font-mono text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] z-10 select-none ${lbl.color}`}
                >
                  {lbl.text}
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Floating Overlay Legend */}
        {showLegend && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1 shadow-lg pointer-events-none z-10">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span>R0 Fixe (O, x, y)</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span>R1 Mobile (O1, x1, y1) - Cercle de diamètre OA</span>
            </div>
            <div className="pt-1 border-t border-slate-800 space-y-0.5 text-[9.5px]">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400 inline-block" />
                <span>OO1 (Position du centre O1)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
                <span>O1M (Position relative de M)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block" />
                <span>OM = OO1 + O1M (Cardioïde)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Controls Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
          </button>

          <button
            onClick={() => {
              setAnimTime(0);
              timeRef.current = 0;
              trailPointsRef.current = [];
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span>Vitesse angulaire <LatexMath math="\omega" />:</span>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.2"
              value={omega}
              onChange={(e) => setOmega(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 accent-amber-500 cursor-pointer rounded-lg bg-slate-800"
            />
            <span className="font-bold text-amber-400">{omega.toFixed(1)} rad/s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Rayon <LatexMath math="R" />:</span>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.1"
              value={radiusR}
              onChange={(e) => setRadiusR(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 accent-purple-500 cursor-pointer rounded-lg bg-slate-800"
            />
            <span className="font-bold text-purple-400">{radiusR.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      {/* --- SIMPLIFIED STEP-BY-STEP CORRECTION CARD DIRECTLY BENEATH CANVAS --- */}
      <div className="mt-4 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden shadow-lg">
        {/* Toggle Solution Header */}
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between p-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-xs sm:text-sm border-b border-slate-800/80 transition-all"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Correction Détaillée & Simplifiée de l'Exercice 1</span>
          </span>
          {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSolution && (
          <div className="p-4 space-y-4 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed animate-in fade-in duration-200">
            {/* Statement Recap */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <strong className="text-amber-400">Énoncé du Tableau :</strong> Dans le plan <LatexMath math="(Oxy)" />, un cercle de diamètre <LatexMath math="OA" /> tourne à vitesse angulaire constante <LatexMath math="\omega" /> autour du point <LatexMath math="O" />. On lie à son centre mobile <LatexMath math="O_1" /> le repère mobile <LatexMath math="\mathcal{R}_1(O_1, \vec{x}_1, \vec{y}_1)" />. Un point <LatexMath math="M" />, initialement en <LatexMath math="A" />, parcourt la circonférence dans le sens positif avec la même vitesse angulaire <LatexMath math="\omega" />.
            </div>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>1. Expression des Vecteurs Position :</span>
              </h4>
              <p>• Centre mobile : <LatexMath math="\vec{OO}_1 = R \vec{i}_1 = R\cos(\omega t)\vec{i} + R\sin(\omega t)\vec{j}" /></p>
              <p>• Position relative de <LatexMath math="M" /> dans <LatexMath math="\mathcal{R}_1" /> : <LatexMath math="\vec{O_1 M} = R\cos(\omega t)\vec{i}_1 + R\sin(\omega t)\vec{j}_1" /></p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2. Vitesse Relative <LatexMath math="\vec{V}_r(M)" /> :</span>
              </h4>
              <p>Dérivée par rapport au temps dans le repère mobile <LatexMath math="\mathcal{R}_1" /> :</p>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-bold text-center">
                <LatexMath math="\vec{V}_r(M) = \left[\frac{d\vec{O_1 M}}{dt}\right]_{\mathcal{R}_1} = -R\omega\sin(\omega t)\vec{i}_1 + R\omega\cos(\omega t)\vec{j}_1" />
              </div>
              <p>Norme : <LatexMath math="V_r = R\omega" className="text-emerald-400 font-bold" /></p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>3. Vitesse d'Entraînement <LatexMath math="\vec{V}_e(M)" /> :</span>
              </h4>
              <p><LatexMath math="\vec{V}_e(M) = \vec{V}(O_1/\mathcal{R}_0) + \vec{\Omega}(\mathcal{R}_1/\mathcal{R}_0) \wedge \vec{O_1 M}" /></p>
              <p>• <LatexMath math="\vec{V}(O_1/\mathcal{R}_0) = R\omega \vec{j}_1" /></p>
              <p>• <LatexMath math="\vec{\Omega} \wedge \vec{O_1 M} = (\omega\vec{k}) \wedge [R\cos(\omega t)\vec{i}_1 + R\sin(\omega t)\vec{j}_1] = -R\omega\sin(\omega t)\vec{i}_1 + R\omega\cos(\omega t)\vec{j}_1" /></p>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-bold text-center">
                <LatexMath math="\implies \vec{V}_e(M) = -R\omega\sin(\omega t)\vec{i}_1 + R\omega(1 + \cos\omega t)\vec{j}_1" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-rose-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>4. Accélération de Coriolis <LatexMath math="\vec{\gamma}_c(M)" /> :</span>
              </h4>
              <p><LatexMath math="\vec{\gamma}_c(M) = 2 \vec{\Omega} \wedge \vec{V}_r(M) = 2(\omega\vec{k}) \wedge [-R\omega\sin(\omega t)\vec{i}_1 + R\omega\cos(\omega t)\vec{j}_1]" /></p>
              <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-center">
                <LatexMath math="\vec{\gamma}_c(M) = -2R\omega^2\cos(\omega t)\vec{i}_1 - 2R\omega^2\sin(\omega t)\vec{j}_1 = -2\omega^2 \vec{O_1 M}" />
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="font-bold text-purple-400 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>5. Trajectoire Absolue (Cardioïde) :</span>
              </h4>
              <p>Dans la base fixe <LatexMath math="(\vec{i}, \vec{j})" /> :</p>
              <p><LatexMath math="x(t) = R\cos(\omega t) + R\cos(2\omega t) \,,\quad y(t) = R\sin(\omega t) + R\sin(2\omega t)" /></p>
              <p className="text-amber-300 font-bold">La courbe engendrée par le point $M$ est une Cardioïde.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
