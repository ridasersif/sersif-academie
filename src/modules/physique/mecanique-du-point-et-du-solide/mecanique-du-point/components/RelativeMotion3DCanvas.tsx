"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sparkles, Play, Pause, RotateCcw, Activity } from "lucide-react";
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

export default function RelativeMotion3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const [omega, setOmega] = useState<number>(1.5); // Rotation speed of R1
  const [vRel, setVRel] = useState<number>(2.0); // Relative speed of M in R1
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    // SYMMETRICAL VIEW centered on Origin
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
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const gridR = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    gridR.position.y = -1.0; // move grid down to give breathing room
    scene.add(gridR);

    // --- REPERE FIXE R(O, x, y, z) ---
    const fixedAxes = new THREE.Group();
    fixedAxes.add(
      new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.8, 0x475569, 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3.0, 0x475569, 0.2, 0.1),
      new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.8, 0x475569, 0.2, 0.1)
    );
    scene.add(fixedAxes);

    const labelO = createLabelSprite("O", "(R)", "#64748b");
    labelO.position.set(-0.4, -0.3, 0);
    scene.add(labelO);

    const labelX = createLabelSprite("x", "", "#94a3b8");
    labelX.position.set(3.1, 0, 0);
    scene.add(labelX);

    const labelY = createLabelSprite("y", "", "#94a3b8");
    labelY.position.set(0, 3.3, 0);
    scene.add(labelY);

    const labelZ = createLabelSprite("z", "", "#94a3b8");
    labelZ.position.set(0, 0, 3.1);
    scene.add(labelZ);

    // --- REPERE MOBILE R1(O1, x1, y1, z1) ---
    const mobileFrameGroup = new THREE.Group();
    scene.add(mobileFrameGroup);

    const mobileX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.6, 0xa855f7, 0.22, 0.12);
    const mobileY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.9, 0xf59e0b, 0.22, 0.12);
    const mobileZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.6, 0x06b6d4, 0.22, 0.12);
    mobileFrameGroup.add(mobileX, mobileY, mobileZ);

    const labelX1 = createLabelSprite("x", "1", "#c084fc");
    labelX1.position.set(2.9, 0.1, 0);
    mobileFrameGroup.add(labelX1);

    const labelOmega = createVectorSprite("Ω", "", "#fbbf24");
    labelOmega.position.set(0, 3.2, 0);
    mobileFrameGroup.add(labelOmega);

    const labelZ1 = createLabelSprite("z", "1", "#22d3ee");
    labelZ1.position.set(0, 0.1, 2.9);
    mobileFrameGroup.add(labelZ1);

    // --- PARTICLE M ---
    const pointMGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const pointMMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 });
    const pointMMesh = new THREE.Mesh(pointMGeo, pointMMat);
    scene.add(pointMMesh);

    const labelM = createLabelSprite("M", "", "#38bdf8");
    scene.add(labelM);

    // --- COMPOSITION VECTORS ---
    const vrArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0x10b981, 0.22, 0.12);
    const veArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xf59e0b, 0.22, 0.12);
    const vaArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0x06b6d4, 0.24, 0.14);
    const acArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xf43f5e, 0.24, 0.14);
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

      const rM = ((vRel * time) % 2.5) + 0.5;
      const posLocal = new THREE.Vector3(rM, 0, 0);
      const posWorld = posLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);
      
      pointMMesh.position.copy(posWorld);
      labelM.position.copy(posWorld.clone().add(new THREE.Vector3(0.0, 0.35, 0.0)));

      const vrLocal = new THREE.Vector3(vRel, 0, 0);
      const vrWorld = vrLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), thetaR1);
      const omegaVec = new THREE.Vector3(0, omega, 0);
      const veWorld = new THREE.Vector3().crossVectors(omegaVec, posWorld);
      const vaWorld = new THREE.Vector3().addVectors(vrWorld, veWorld);
      const acWorld = new THREE.Vector3().crossVectors(omegaVec, vrWorld).multiplyScalar(2);

      vrArrow.position.copy(posWorld);
      if (vrWorld.length() > 0.05) {
        const len = vrWorld.length() * 0.35;
        const dir = vrWorld.clone().normalize();
        vrArrow.setDirection(dir);
        vrArrow.setLength(len, 0.18, 0.1);
        vrArrow.visible = true; labelVr.visible = true;
        labelVr.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.3)));
      } else {
        vrArrow.visible = false; labelVr.visible = false;
      }

      veArrow.position.copy(posWorld);
      if (veWorld.length() > 0.05) {
        const len = veWorld.length() * 0.35;
        const dir = veWorld.clone().normalize();
        veArrow.setDirection(dir);
        veArrow.setLength(len, 0.18, 0.1);
        veArrow.visible = true; labelVe.visible = true;
        labelVe.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.3)));
      } else {
        veArrow.visible = false; labelVe.visible = false;
      }

      vaArrow.position.copy(posWorld);
      if (vaWorld.length() > 0.05) {
        const len = vaWorld.length() * 0.3;
        const dir = vaWorld.clone().normalize();
        vaArrow.setDirection(dir);
        vaArrow.setLength(len, 0.2, 0.12);
        vaArrow.visible = true; labelVa.visible = true;
        labelVa.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.35)));
      } else {
        vaArrow.visible = false; labelVa.visible = false;
      }

      acArrow.position.copy(posWorld);
      if (acWorld.length() > 0.05) {
        const len = Math.min(acWorld.length() * 0.22, 1.8);
        const dir = acWorld.clone().normalize();
        acArrow.setDirection(dir);
        acArrow.setLength(len, 0.2, 0.12);
        acArrow.visible = true; labelAc.visible = true;
        labelAc.position.copy(posWorld.clone().add(dir.multiplyScalar(len + 0.35)));
      } else {
        acArrow.visible = false; labelAc.visible = false;
      }

      controls.target.set(0, 0, 0); // KEEP CENTERED
      controls.update();

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    updateSize();
    animate(performance.now());

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [omega, vRel, isPlaying]);

  return (
    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl max-w-full overflow-hidden">
      
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Simulateur 3D Interactif : Repère Fixe <LatexMath math="\mathcal{R}" /> & Mobile Tournant <LatexMath math="\mathcal{R}_1(\vec{\Omega})" /></span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1">
            <span>Visualisation 3D du repère mobile tournant à la vitesse</span> <LatexMath math="\vec{\Omega}" /><span>, et de la composition</span> <LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" /><span>.</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Animer"}</span>
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
        <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-2">
          <Activity className="w-4 h-4" />
          <span>Composition des Vitesses & Coriolis :</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10.5px] sm:text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">Vitesse Relative</span>
              <span className="text-emerald-400 font-bold"><LatexMath math="\vec{V}_r" /> (Vert)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">Vitesse d'Entraînement</span>
              <span className="text-amber-400 font-bold"><LatexMath math="\vec{V}_e = \vec{\Omega} \wedge \vec{O_1M}" /></span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">Vitesse Absolue</span>
              <span className="text-cyan-400 font-bold"><LatexMath math="\vec{V}_a = \vec{V}_r + \vec{V}_e" /></span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">Accélération Coriolis</span>
              <span className="text-rose-400 font-bold"><LatexMath math="\vec{\gamma}_c = 2 \vec{\Omega} \wedge \vec{V}_r" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse de rotation <LatexMath math="\Omega" /> de <LatexMath math="\mathcal{R}_1" />:</span>
            <span className="text-amber-400 font-bold">{omega.toFixed(1)} rad/s</span>
          </div>
          <input
            type="range" min="0" max="4" step="0.2" value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-slate-300">
            <span>Vitesse relative <LatexMath math="V_r" /> dans <LatexMath math="\mathcal{R}_1" />:</span>
            <span className="text-emerald-400 font-bold">{vRel.toFixed(1)} m/s</span>
          </div>
          <input
            type="range" min="0.5" max="5" step="0.2" value={vRel}
            onChange={(e) => setVRel(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
}
