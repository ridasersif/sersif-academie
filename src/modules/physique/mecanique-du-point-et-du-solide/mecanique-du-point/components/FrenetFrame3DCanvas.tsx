"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Compass, Play, Pause, RotateCcw, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// High-Resolution crisp mathematical vector labels - Scaled DOWN for elegance
function createVectorSprite(base: string, sub: string = "", colorHex: string = "#ffffff") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = colorHex;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 8;
    
    const baseFontSize = 72;
    const subFontSize = 46;
    
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    const baseWidth = ctx.measureText(base).width;
    
    ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
    const subWidth = sub ? ctx.measureText(sub).width : 0;
    
    const totalWidth = baseWidth + subWidth;
    const startX = 128 - totalWidth / 2;
    
    ctx.font = `italic bold ${baseFontSize}px 'Times New Roman', serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(base, startX, 64);
    
    if (sub) {
      ctx.font = `bold ${subFontSize}px 'Times New Roman', serif`;
      ctx.fillText(sub, startX + baseWidth, 82);
    }
    
    const arrowY = 20;
    ctx.beginPath();
    ctx.moveTo(startX, arrowY);
    ctx.lineTo(startX + totalWidth, arrowY);
    ctx.lineTo(startX + totalWidth - 10, arrowY - 8);
    ctx.moveTo(startX + totalWidth, arrowY);
    ctx.lineTo(startX + totalWidth - 10, arrowY + 8);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  // CRITICAL: Made extremely small and delicate
  sprite.scale.set(0.35, 0.175, 1);
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
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.Fog(0x020617, 4, 15);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    // Camera pulled back slightly for breathing room
    camera.position.set(0.0, 3.5, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false; 
    controls.enableZoom = false; 
    controls.target.set(0.0, 0.0, 0.0); 
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.update();

    const updateSize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.fov = width < 640 ? 50 : 40; 
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dLight.position.set(5, 10, 7);
    scene.add(dLight);

    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -1.0; 
    scene.add(grid);

    // --- REPERE FIXE GALILEEN R0 ---
    const galileanGroup = new THREE.Group();
    scene.add(galileanGroup);

    const oGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const oMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.9 });
    const oMesh = new THREE.Mesh(oGeo, oMat);
    galileanGroup.add(oMesh);

    // Thinner fixed axes
    const x0Arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.5, 0x334155, 0.1, 0.05);
    const y0Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.7, 0x334155, 0.1, 0.05);
    const z0Arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.5, 0x334155, 0.1, 0.05);
    galileanGroup.add(x0Arrow, y0Arrow, z0Arrow);
    // REMOVED clutter labels O, x, y, z

    // --- TRAJECTORY ---
    const getPosAt = (u: number): THREE.Vector3 => {
      return new THREE.Vector3(
        1.8 * Math.cos(u),
        0.5 * Math.sin(2 * u),
        1.5 * Math.sin(u)
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
    const trajLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(trajPts), new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 2 }));
    trajGroup.add(trajLine);

    // --- OSCULATING CIRCLE ---
    const osculatingCircleGroup = new THREE.Group();
    scene.add(osculatingCircleGroup);
    const oscCircleMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.15, gapSize: 0.1, transparent: true, opacity: 0.8 });

    const centerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    scene.add(centerMesh);
    // REMOVED clutter label C

    // --- PARTICLE M ---
    const particleMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.2, roughness: 0.2 }));
    scene.add(particleMesh);
    // REMOVED clutter label M

    // --- VECTORS ---
    const tauArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1.2, 0x06b6d4, 0.12, 0.06);
    const nArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.2, 0x10b981, 0.12, 0.06);
    const bArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 1.2, 0xf43f5e, 0.12, 0.06);
    scene.add(tauArrow, nArrow, bArrow);

    const labelTau = createVectorSprite("τ", "", "#38bdf8");
    const labelN = createVectorSprite("n", "", "#34d399");
    const labelB = createVectorSprite("b", "", "#fb7185");
    scene.add(labelTau, labelN, labelB);

    const atArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xfacc15, 0.1, 0.05);
    const anArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1, 0xa855f7, 0.1, 0.05);
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
      centerMesh.position.copy(centerC);

      radiusLine.geometry.setFromPoints([centerC, pos]);
      radiusLine.computeLineDistances();

      // --- ELEGANT VECTOR SCALING & OFFSETS ---
      const visualScale = 0.8;
      
      tauArrow.position.copy(pos); tauArrow.setDirection(tau);
      labelTau.position.copy(pos.clone().add(tau.clone().multiplyScalar(1.2 + 0.1)).add(new THREE.Vector3(0.05, 0.05, 0)));

      nArrow.position.copy(pos); nArrow.setDirection(n);
      labelN.position.copy(pos.clone().add(n.clone().multiplyScalar(1.2 + 0.1)).add(new THREE.Vector3(-0.05, 0.05, 0)));

      bArrow.position.copy(pos); bArrow.setDirection(b);
      labelB.position.copy(pos.clone().add(b.clone().multiplyScalar(1.2 + 0.1)).add(new THREE.Vector3(0, 0.1, 0)));

      atArrow.position.copy(pos);
      const atLen = Math.min(Math.abs(aT_val) * visualScale, 2.0);
      if (atLen > 0.05) {
        const dirAt = aT_val >= 0 ? tau : tau.clone().negate();
        atArrow.setDirection(dirAt);
        atArrow.setLength(atLen, 0.1, 0.05);
        atArrow.visible = true; labelAt.visible = true;
        labelAt.position.copy(pos.clone().add(dirAt.clone().multiplyScalar(atLen + 0.1)).add(new THREE.Vector3(0, 0.08, 0)));
      } else {
        atArrow.visible = false; labelAt.visible = false;
      }

      anArrow.position.copy(pos);
      const anLen = Math.min(aN_val * visualScale, 2.0);
      if (anLen > 0.05) {
        anArrow.setDirection(n);
        anArrow.setLength(anLen, 0.1, 0.05);
        anArrow.visible = true; labelAn.visible = true;
        labelAn.position.copy(pos.clone().add(n.clone().multiplyScalar(anLen + 0.1)).add(new THREE.Vector3(0, -0.08, 0)));
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

      controls.target.set(0, 0, 0); 
      controls.update();

      setStats({ speed: vNorm, rc: Rc_val, aT: aT_val, aN: aN_val, aTotal: acc.length() });

      renderer.render(scene, camera);
      if (isInViewRef.current) animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    updateSize();

    const isInViewRef = { current: false };
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (isInViewRef.current) animFrameRef.current = requestAnimationFrame(renderFrame);
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      intersectionObserver.disconnect();
      controls.dispose();
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isPlaying, speedMultiplier]);

  return (
    <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
        <div>
          <h3 className="text-[11px] sm:text-sm font-bold text-cyan-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Repère Galiléen <LatexMath math="\mathcal{R}_0" /> & Repère de Frenet <LatexMath math="(\vec{\tau}, \vec{n}, \vec{b})" /></span>
          </h3>
          <p className="text-[9px] sm:text-[10px] text-slate-400">
            Observez la trajectoire 3D <LatexMath math="s(t)" /> et le cercle osculateur.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition-all"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
          </button>
          <button
            onClick={() => { timeRef.current = 0; }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-[280px] sm:h-[350px] w-full flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700 text-[9px] text-slate-300 pointer-events-none">
          👆 Glissez pour tourner la caméra
        </div>
      </div>

      <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5 text-[10px] sm:text-xs">
          <Activity className="w-3.5 h-3.5" />
          <span>Grandeurs de Frenet en Temps Réel:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] sm:text-[10px]">
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[8px]">Rayon courbure</span>
            <span className="text-amber-400 font-bold">Rc = {stats.rc.toFixed(2)}m</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[8px]">Accélération Normale</span>
            <span className="text-purple-400 font-bold"><LatexMath math="a_N" /> = {stats.aN.toFixed(2)}</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[8px]">Accélération Tangente</span>
            <span className="text-yellow-400 font-bold"><LatexMath math="a_T" /> = {stats.aT.toFixed(2)}</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[8px]">Accélération Totale</span>
            <span className="text-pink-400 font-bold"><LatexMath math="||\vec{\gamma}||" /> = {stats.aTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-300">Vitesse:</span>
          <input
            type="range" min="0.2" max="2.5" step="0.1" value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-full sm:w-32 accent-cyan-500 cursor-pointer h-1.5"
          />
          <span className="text-cyan-400 font-bold w-6">{speedMultiplier.toFixed(1)}x</span>
        </div>
        <div className="text-slate-400 hidden sm:block">
          <LatexMath math="\mathcal{R}_0" /> + <span className="text-amber-400 font-bold">Frenet mobile en <LatexMath math="M(t)" /></span>
        </div>
      </div>

    </div>
  );
}
