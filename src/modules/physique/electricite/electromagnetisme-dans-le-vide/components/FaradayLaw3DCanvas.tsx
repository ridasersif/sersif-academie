"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Cylinder, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Activity, Zap, Play, Pause, RotateCcw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// --- Composant Aimant ---
const Magnet = ({ positionY, velocityY }: { positionY: number; velocityY: number }) => {
  return (
    <group position={[0, positionY, 0]}>
      <Box args={[0.4, 1.2, 0.4]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </Box>
      <Box args={[0.4, 0.6, 0.4]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
      </Box>
      
      {/* Labels N et S */}
      <Html position={[0, -0.4, 0.21]} center>
        <span className="text-white font-bold text-xs select-none">N</span>
      </Html>
      <Html position={[0, 0.4, 0.21]} center>
        <span className="text-white font-bold text-xs select-none">S</span>
      </Html>
      
      {/* Vecteur vitesse si en mouvement */}
      {Math.abs(velocityY) > 0.01 && (
        <group position={[0.4, 0, 0]}>
          <Line points={[[0, 0, 0], [0, Math.sign(velocityY) * 0.5, 0]]} color="#facc15" lineWidth={3} />
          <mesh position={[0, Math.sign(velocityY) * 0.5, 0]} rotation={[velocityY > 0 ? 0 : Math.PI, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 16]} />
            <meshBasicMaterial color="#facc15" toneMapped={false} />
          </mesh>
          <Html position={[0.2, Math.sign(velocityY) * 0.3, 0]} center>
            <div className="text-yellow-400 font-bold text-xs"><LatexMath math="\vec{v}" /></div>
          </Html>
        </group>
      )}
    </group>
  );
};

// --- Composant Bobine ---
const Coil = ({ inducedCurrent }: { inducedCurrent: number }) => {
  const points = useMemo(() => {
    const pts = [];
    const turns = 10;
    const radius = 0.7;
    const height = 1.5;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const angle = t * Math.PI * 2 * turns;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (t - 0.5) * height;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const color = Math.abs(inducedCurrent) > 0.01 ? "#10b981" : "#94a3b8";

  return (
    <group>
      {/* Tube de verre */}
      <Cylinder args={[0.65, 0.65, 1.6, 32]} transparent opacity={0.15} color="#e2e8f0">
        <meshPhysicalMaterial roughness={0.1} transmission={0.9} thickness={0.1} />
      </Cylinder>
      
      {/* Fil de la bobine */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 200, 0.03, 8, false]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={Math.abs(inducedCurrent) * 5} />
      </mesh>
    </group>
  );
};

export default function FaradayLaw3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [magnetPos, setMagnetPos] = useState(2);
  const [direction, setDirection] = useState(-1);
  const [inducedE, setInducedE] = useState(0); // Force électromotrice induite
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Logique d'animation (useFrame simulé avec useEffect pour l'état React)
  // On utilise requestAnimationFrame pour mettre à jour l'état doucement si on veut l'afficher dans l'UI
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && inView) {
        setMagnetPos((prev) => {
          let newPos = prev + direction * speed * delta * 2;
          let newDir = direction;
          
          // Rebond aux extrémités
          if (newPos < -2) {
            newPos = -2;
            newDir = 1;
            setDirection(1);
          } else if (newPos > 2) {
            newPos = 2;
            newDir = -1;
            setDirection(-1);
          }
          
          // Calcul simple de l'induction (dérivée du flux)
          // Le flux est max quand l'aimant est au centre (pos = 0)
          // Flux approx: phi = A * exp(-pos^2)
          // d(phi)/dt = -2 * A * pos * exp(-pos^2) * (d(pos)/dt)
          const velocity = newDir * speed * 2;
          const emf = 5 * newPos * Math.exp(-newPos * newPos) * velocity;
          setInducedE(emf);
          
          return newPos;
        });
      } else {
        // Décroissance douce si en pause
        setInducedE((prev) => prev * 0.9);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, inView, speed, direction]);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[300px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Galvanomètre */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
            <span className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Galvanomètre</span>
            <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center mb-1">
              {/* Cadran */}
              <div className="absolute w-24 h-24 rounded-full border-t-2 border-l-2 border-r-2 border-slate-600 border-dashed" />
              {/* Aiguille */}
              <div 
                className="absolute w-1 h-12 bg-red-500 origin-bottom rounded-full transition-transform duration-75"
                style={{ transform: `rotate(${Math.max(-60, Math.min(60, inducedE * 15))}deg)` }}
              />
              <div className="absolute w-3 h-3 bg-slate-200 rounded-full bottom-0 translate-y-1/2" />
            </div>
            <div className="text-emerald-400 font-mono text-xs font-bold">
              {inducedE > 0.1 ? "+" : ""}{inducedE.toFixed(2)} mA
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [4, 2, 6], fov: 40 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} angle={0.3} intensity={2} />
          <Environment preset="city" />
          <OrbitControls ref={controlsRef} enableZoom={true} maxPolarAngle={Math.PI / 1.5} />
          
          <group position={[0, 0, 0]}>
            <Coil inducedCurrent={inducedE} />
            <Magnet positionY={magnetPos} velocityY={isPlaying ? direction * speed : 0} />
          </group>
          
          <ContactShadows resolution={256} scale={10} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Vitesse de l'aimant</span>
            <span className="text-blue-400">v = {speed}</span>
          </div>
          <input 
            type="range" min="0" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5"
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => { setMagnetPos(2); setDirection(-1); setSpeed(1); controlsRef.current?.reset(); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
