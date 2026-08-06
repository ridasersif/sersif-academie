"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Compass, Play, Pause, RotateCcw, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Advanced helper to create elegant mathematical vector labels with subscripts and arrows
function createVectorSprite(base: string, sub: string = "", colorHex: string = "#ffffff") {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = colorHex;
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 6;
    
    const baseFontSize = 32;
    const subFontSize = 20;
    
    // Measure widths
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    const baseWidth = ctx.measureText(base).width;
    
    ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
    const subWidth = sub ? ctx.measureText(sub).width : 0;
    
    const totalWidth = baseWidth + subWidth;
    const startX = 64 - totalWidth / 2;
    
    // Draw Base
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(base, startX, 36);
    
    // Draw Subscript
    if (sub) {
      ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
      ctx.fillText(sub, startX + baseWidth, 44);
    }
    
    // Draw Vector Arrow
    const arrowY = 16;
    ctx.beginPath();
    ctx.moveTo(startX, arrowY);
    ctx.lineTo(startX + totalWidth, arrowY);
    ctx.lineTo(startX + totalWidth - 4, arrowY - 3);
    ctx.moveTo(startX + totalWidth, arrowY);
    ctx.lineTo(startX + totalWidth - 4, arrowY + 3);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.4, 0.7, 1);
  return sprite;
}

// Helper for standard labels (points, axes) without arrows
function createLabelSprite(base: string, sub: string = "", colorHex: string = "#ffffff") {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = colorHex;
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 6;
    
    const baseFontSize = 34;
    const subFontSize = 22;
    
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    const baseWidth = ctx.measureText(base).width;
    
    ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
    const subWidth = sub ? ctx.measureText(sub).width : 0;
    
    const totalWidth = baseWidth + subWidth;
    const startX = 64 - totalWidth / 2;
    
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(base, startX, 32);
    
    if (sub) {
      ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
      ctx.fillText(sub, startX + baseWidth, 40);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.4, 0.7, 1);
  return sprite;
}

export default function FrenetFrame3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  const [stats, setStats] = useState({ speed: 0, rc: 0, aT: 0, aN: 0, aTotal: 0 });

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    // EXACT SYMMETRICAL VIEW centered on Origin
    camera.position.set(0.0, 2.5, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enforce full css width/height for perfect centering
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // OrbitControls locked to exactly (0,0,0)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false; 
    controls.target.set(0.0, 0.0, 0.0); // DEAD-CENTER ON ORIGIN
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 3.0;
    controls.maxDistance = 15;
    controls.update();

    const updateSize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.fov = width < 640 ? 50 : 38;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dLight.position.set(5, 10, 7);
    scene.add(dLight);

    const grid = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    grid.position.y = -1.0; // move grid down to give breathing room
    scene.add(grid);

    // --- REPERE FIXE GALILEEN R0 ---
    const galileanGroup = new THREE.Group();
    scene.add(galileanGroup);

    const oGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const oMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.9 });
    const oMesh = new THREE.Mesh(oGeo, oMat);
    galileanGroup.add(oMesh);

    const x0Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.8, 0x3b82f6, 0.2, 0.1);
    const y0Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.0, 0x3b82f6, 0.2, 0.1);
    const z0Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.8, 0x3b82f6, 0.2, 0.1);
    galileanGroup.add(x0Arrow, y0Arrow, z0Arrow);

    const labelO = createLabelSprite("O", "", "#60a5fa");
    labelO.position.set(-0.3, -0.3, 0);
    galileanGroup.add(labelO);

    const labelX0 = createLabelSprite("x", "0", "#60a5fa");
    labelX0.position.set(3.1, 0.0, 0);
    galileanGroup.add(labelX0);

    const labelY0 = createLabelSprite("y", "0", "#60a5fa");
    labelY0.position.set(0.0, 3.3, 0);
    galileanGroup.add(labelY0);

    const labelZ0 = createLabelSprite("z", "0", "#60a5fa");
    labelZ0.position.set(0.0, 0.0, 3.1);
    galileanGroup.add(labelZ0);

    // --- TRAJECTORY ---
    const getPosAt = (u: number): THREE.Vector3 => {
      return new THREE.Vector3(
        2.2 * Math.cos(u),
        0.6 * Math.sin(2 * u),
        1.8 * Math.sin(u)
      );
    };

    const getVelAt = (u: number): THREE.Vector3 => {
      const du = 0.001;
      return getPosAt(u + du).sub(getPosAt(u - du)).divideScalar(2 * du);
    };

    const getAccAt = (u: number): THREE.Vector3 => {
      const du = 0.001;
      return getVelAt(u + du).sub(getVelAt(u - du)).divideScalar(2 * du);
    };

    const trajGroup = new THREE.Group();
    scene.add(trajGroup);
    const trajPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) trajPts.push(getPosAt((i / 240) * Math.PI * 2));
    const trajLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(trajPts), new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 }));
    trajGroup.add(trajLine);

    // --- OSCULATING CIRCLE ---
    const osculatingCircleGroup = new THREE.Group();
    scene.add(osculatingCircleGroup);
    const oscCircleMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.8 });

    const centerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    scene.add(centerMesh);
    const labelC = createLabelSprite("C", "", "#10b981");
    scene.add(labelC);

    // --- PARTICLE M ---
    const particleMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.0, roughness: 0.2 }));
    scene.add(particleMesh);
    const labelM = createLabelSprite("M", "", "#fbbf24");
    scene.add(labelM);

    // --- VECTORS ---
    const tauArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1.6, 0x06b6d4, 0.2, 0.1);
    const nArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.6, 0x10b981, 0.2, 0.1);
    const bArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 1.6, 0xf43f5e, 0.2, 0.1);
    scene.add(tauArrow, nArrow, bArrow);

    const labelTau = createVectorSprite("τ", "", "#38bdf8");
    const labelN = createVectorSprite("n", "", "#34d399");
    const labelB = createVectorSprite("b", "", "#fb7185");
    scene.add(labelTau, labelN, labelB);

    const atArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xfacc15, 0.16, 0.08);
    const anArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0xa855f7, 0.16, 0.08);
    scene.add(atArrow, anArrow);

    const labelAt = createVectorSprite("a", "T", "#fde047");
    const labelAn = createVectorSprite("a", "N", "#c084fc");
    scene.add(labelAt, labelAn);

    const radiusLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0x10b981, dashSize: 0.15, gapSize: 0.1 }));
    scene.add(radiusLine);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (isPlaying) timeRef.current += delta * speedMultiplier * 0.6;
      const u = timeRef.current;

      const pos = getPosAt(u);
      const vel = getVelAt(u);
      const acc = getAccAt(u);
      const vNorm = vel.length();

      const tau = vel.clone().normalize();
      const aT_val = acc.dot(tau);
      const aT_vec = tau.clone().multiplyScalar(aT_val);
      const aN_vec = acc.clone().sub(aT_vec);
      const aN_val = aN_vec.length();
      const n = aN_val > 0.001 ? aN_vec.clone().normalize() : new THREE.Vector3(0, 1, 0);
      const b = new THREE.Vector3().crossVectors(tau, n).normalize();
      const Rc_val = aN_val > 0.05 ? (vNorm * vNorm) / aN_val : 4.0;
      const centerC = pos.clone().add(n.clone().multiplyScalar(Rc_val));

      particleMesh.position.copy(pos);
      labelM.position.copy(pos.clone().add(new THREE.Vector3(0.0, 0.35, 0.0)));

      centerMesh.position.copy(centerC);
      labelC.position.copy(centerC.clone().add(new THREE.Vector3(0.0, 0.3, 0.0)));

      radiusLine.geometry.setFromPoints([centerC, pos]);
      radiusLine.computeLineDistances();

      const arrLen = 1.6;
      tauArrow.position.copy(pos); tauArrow.setDirection(tau);
      labelTau.position.copy(pos.clone().add(tau.clone().multiplyScalar(arrLen + 0.3)));

      nArrow.position.copy(pos); nArrow.setDirection(n);
      labelN.position.copy(pos.clone().add(n.clone().multiplyScalar(arrLen + 0.3)));

      bArrow.position.copy(pos); bArrow.setDirection(b);
      labelB.position.copy(pos.clone().add(b.clone().multiplyScalar(arrLen + 0.3)));

      atArrow.position.copy(pos);
      const atLen = Math.min(Math.abs(aT_val) * 0.4, 2.0);
      if (atLen > 0.05) {
        const dirAt = aT_val >= 0 ? tau : tau.clone().negate();
        atArrow.setDirection(dirAt);
        atArrow.setLength(atLen, 0.15, 0.08);
        atArrow.visible = true; labelAt.visible = true;
        labelAt.position.copy(pos.clone().add(dirAt.clone().multiplyScalar(atLen + 0.25)));
      } else {
        atArrow.visible = false; labelAt.visible = false;
      }

      anArrow.position.copy(pos);
      const anLen = Math.min(aN_val * 0.4, 2.0);
      if (anLen > 0.05) {
        anArrow.setDirection(n);
        anArrow.setLength(anLen, 0.15, 0.08);
        anArrow.visible = true; labelAn.visible = true;
        labelAn.position.copy(pos.clone().add(n.clone().multiplyScalar(anLen + 0.25)));
      } else {
        anArrow.visible = false; labelAn.visible = false;
      }

      osculatingCircleGroup.clear();
      const oscPts = [];
      for (let i = 0; i <= 72; i++) {
        const phi = (i / 72) * Math.PI * 2;
        oscPts.push(centerC.clone().addScaledVector(tau, Rc_val * Math.cos(phi)).addScaledVector(n, Rc_val * Math.sin(phi)));
      }
      const oscLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(oscPts), oscCircleMat);
      oscLine.computeLineDistances();
      osculatingCircleGroup.add(oscLine);

      controls.target.set(0, 0, 0); // Keep totally centered!
      controls.update();

      setStats({ speed: vNorm, rc: Rc_val, aT: aT_val, aN: aN_val, aTotal: acc.length() });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    updateSize();
    renderFrame(performance.now());

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-cyan-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Repère Fixe Galiléen <LatexMath math="\mathcal{R}_0(O, x_0, y_0, z_0)" /> & Repère Mobile de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" /></span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400">
            Observez le repère fixe galiléen <LatexMath math="\mathcal{R}_0" />, la trajectoire 3D <LatexMath math="s(t)" />, le repère mobile de Frenet attaché à <LatexMath math="M" />, et le cercle osculateur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
          </button>
          <button
            onClick={() => { timeRef.current = 0; }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[320px] sm:min-h-[420px] w-full flex items-center justify-center touch-none">
        <div ref={mountRef} className="w-full h-full min-h-[320px] sm:min-h-[420px] touch-none block" />
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-800 text-[9px] sm:text-[10px] text-slate-400 pointer-events-none">
          <span>👆 Tournez en 3D avec 1 doigt • Zoom 2 doigts</span>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-2">
          <Activity className="w-4 h-4" />
          <span>Grandeurs Physique de Frenet en Temps Réel:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] sm:text-xs">
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Rayon de courbure</span>
            <span className="text-amber-400 font-bold">Rc = {stats.rc.toFixed(2)} m</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Accélération Normale</span>
            <span className="text-purple-400 font-bold">a_N = {stats.aN.toFixed(2)} m/s²</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Accélération Tangentielle</span>
            <span className="text-yellow-400 font-bold">a_T = {stats.aT.toFixed(2)} m/s²</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Accélération Totale</span>
            <span className="text-pink-400 font-bold">||γ|| = {stats.aTotal.toFixed(2)} m/s²</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-300">Vitesse de simulation:</span>
          <input
            type="range" min="0.2" max="2.5" step="0.1" value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-20 sm:w-36 accent-cyan-500 cursor-pointer"
          />
          <span className="text-cyan-400 font-bold">{speedMultiplier.toFixed(1)}x</span>
        </div>
        <div className="text-slate-400 text-[10.5px] sm:text-[11px]">
          Repère Galiléen Fixe <LatexMath math="\mathcal{R}_0" /> + <span className="text-amber-400 font-bold">Frenet mobile en <LatexMath math="M(t)" /></span>
        </div>
      </div>

    </div>
  );
}
