"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sparkles, Play, Pause, Activity } from "lucide-react";
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
  // CRITICAL: Made extremely small and delicate for a premium non-cluttered look
  sprite.scale.set(0.35, 0.175, 1);
  return sprite;
}

export default function RelativeMotion3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const [omega, setOmega] = useState<number>(1.5); 
  const [vRel, setVRel] = useState<number>(2.0); 
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); 
    scene.fog = new THREE.Fog(0x020617, 4, 15);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    // Pulled camera back for breathing room
    camera.position.set(4.5, 3.5, 6.0);

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
    controls.target.set(0.0, 0.5, 0.0);
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
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(4, 10, 6);
    scene.add(dirLight);

    const gridR = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    gridR.position.y = -0.5;
    scene.add(gridR);

    // --- REPERE FIXE R(O, x, y, z) ---
    const fixedAxes = new THREE.Group();
    fixedAxes.add(
      new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.5, 0x334155, 0.1, 0.05),
      new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.5, 0x334155, 0.1, 0.05),
      new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.5, 0x334155, 0.1, 0.05)
    );
    scene.add(fixedAxes);
    // REMOVED clutter labels O, x, y, z 

    // --- REPERE MOBILE R1(O1, x1, y1, z1) ---
    const mobileFrameGroup = new THREE.Group();
    scene.add(mobileFrameGroup);

    const mobileX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.2, 0x7e22ce, 0.12, 0.06);
    const mobileY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.4, 0xb45309, 0.12, 0.06);
    const mobileZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.2, 0x0891b2, 0.12, 0.06);
    mobileFrameGroup.add(mobileX, mobileY, mobileZ);
    // REMOVED clutter labels x1, z1

    const labelOmega = createVectorSprite("Ω", "", "#fbbf24");
    labelOmega.position.set(0, 2.6, 0);
    mobileFrameGroup.add(labelOmega);

    // --- PARTICLE M ---
    const pointMGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 1.2, roughness: 0.1 });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);
    // REMOVED clutter label M

    // --- COMPOSITION VECTORS ---
    // Made arrows slightly thinner for elegance
    const vrArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0x10b981, 0.12, 0.06);
    const veArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xf59e0b, 0.12, 0.06);
    const vaArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0x06b6d4, 0.14, 0.08);
    const acArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xf43f5e, 0.14, 0.08);
    scene.add(vrArrow, veArrow, vaArrow, acArrow);

    const labelVr = createVectorSprite("V", "r", "#34d399");
    const labelVe = createVectorSprite("V", "e", "#fbbf24");
    const labelVa = createVectorSprite("V", "a", "#22d3ee");
    const labelAc = createVectorSprite("γ", "c", "#fb7185");
    scene.add(labelVr, labelVe, labelVa, labelAc);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    let time = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (isPlaying) time += delta;

      const thetaR1 = omega * time;
      mobileFrameGroup.rotation.y = thetaR1;

      // Particle oscillation
      const rM = 1.0 + 0.6 * Math.sin(vRel * 0.8 * time); 
      const vrM = 0.6 * (vRel * 0.8) * Math.cos(vRel * 0.8 * time);

      const posLocal = new THREE.Vector3(rM, 0, 0);
      const posWorld = posLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);
      
      pointMMesh.position.copy(posWorld);

      const vrLocal = new THREE.Vector3(vrM, 0, 0);
      const vrWorld = vrLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);
      
      const omegaVec = new THREE.Vector3(0, omega, 0);
      const veWorld = new THREE.Vector3().crossVectors(omegaVec, posWorld);
      const vaWorld = new THREE.Vector3().addVectors(vrWorld, veWorld);
      
      const acWorld = new THREE.Vector3().crossVectors(omegaVec, vrWorld).multiplyScalar(2);

      // Delicate vector scaling
      const visualScale = 0.6; 

      vrArrow.position.copy(posWorld);
      if (vrWorld.length() > 0.05) {
        const len = vrWorld.length() * visualScale;
        const dir = vrWorld.clone().normalize();
        vrArrow.setDirection(dir);
        vrArrow.setLength(len, 0.12, 0.06);
        vrArrow.visible = true; labelVr.visible = true;
        // Small elegant offset
        labelVr.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.1)).add(new THREE.Vector3(0, 0.1, 0)));
      } else {
        vrArrow.visible = false; labelVr.visible = false;
      }

      veArrow.position.copy(posWorld);
      if (veWorld.length() > 0.05) {
        const len = veWorld.length() * visualScale * 0.7;
        const dir = veWorld.clone().normalize();
        veArrow.setDirection(dir);
        veArrow.setLength(len, 0.12, 0.06);
        veArrow.visible = true; labelVe.visible = true;
        labelVe.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.1)).add(new THREE.Vector3(0, -0.1, 0)));
      } else {
        veArrow.visible = false; labelVe.visible = false;
      }

      vaArrow.position.copy(posWorld);
      if (vaWorld.length() > 0.05) {
        const len = vaWorld.length() * visualScale * 0.8;
        const dir = vaWorld.clone().normalize();
        vaArrow.setDirection(dir);
        vaArrow.setLength(len, 0.14, 0.08);
        vaArrow.visible = true; labelVa.visible = true;
        labelVa.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.1)).add(new THREE.Vector3(0.05, 0, 0)));
      } else {
        vaArrow.visible = false; labelVa.visible = false;
      }

      acArrow.position.copy(posWorld);
      if (acWorld.length() > 0.05) {
        const len = Math.min(acWorld.length() * 0.3, 1.8);
        const dir = acWorld.clone().normalize();
        acArrow.setDirection(dir);
        acArrow.setLength(len, 0.14, 0.08);
        acArrow.visible = true; labelAc.visible = true;
        labelAc.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.1)).add(new THREE.Vector3(-0.05, 0.1, 0)));
      } else {
        acArrow.visible = false; labelAc.visible = false;
      }

      controls.target.set(0, 0.5, 0); 
      controls.update();

      renderer.render(scene, camera);
      if (isInViewRef.current) animFrameRef.current = requestAnimationFrame(animate);
    };

    updateSize();

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
      controls.dispose();
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [omega, vRel, isPlaying]);

  return (
    <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
        <div>
          <h3 className="text-[11px] sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Simulateur Interactif : Repère <LatexMath math="\mathcal{R}" /> & Mobile <LatexMath math="\mathcal{R}_1" /></span>
          </h3>
          <p className="text-[9px] sm:text-[10px] text-slate-400">
            Visualisation 3D de la composition <LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" />
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-all"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
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
        <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5 text-[10px] sm:text-xs">
          <Activity className="w-3.5 h-3.5" />
          <span>Composition des Vitesses & Coriolis :</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] sm:text-[10px]">
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-slate-400 block text-[8px]">Vitesse Relative</span>
              <span className="text-emerald-400 font-bold"><LatexMath math="\vec{V}_r" /></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-slate-400 block text-[8px]">Vitesse d'Entraînement</span>
              <span className="text-amber-400 font-bold"><LatexMath math="\vec{V}_e" /></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-slate-400 block text-[8px]">Vitesse Absolue</span>
              <span className="text-cyan-400 font-bold"><LatexMath math="\vec{V}_a" /></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-slate-400 block text-[8px]">Accélération Coriolis</span>
              <span className="text-rose-400 font-bold"><LatexMath math="\vec{\gamma}_c" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] font-mono">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Rotation <LatexMath math="\Omega" /> :</span>
            <span className="text-amber-400 font-bold">{omega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range" min="0" max="4" step="0.2" value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse <LatexMath math="V_r" /> :</span>
            <span className="text-emerald-400 font-bold">{vRel.toFixed(1)} m/s</span>
          </div>
          <input
            type="range" min="0.5" max="5" step="0.2" value={vRel}
            onChange={(e) => setVRel(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5"
          />
        </div>
      </div>

    </div>
  );
}
