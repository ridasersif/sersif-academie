"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Magnet, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Rails et circuit
const Circuit = () => {
  return (
    <group>
      {/* Rail Gauche */}
      <Box args={[0.2, 0.2, 8]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Rail Droit */}
      <Box args={[0.2, 0.2, 8]} position={[2, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Fil de fermeture (Résistance R) */}
      <Box args={[4.2, 0.2, 0.2]} position={[0, 0, -3.9]}>
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.8} />
      </Box>
      <Html position={[0, 0.3, -3.9]} center>
        <div className="bg-slate-800/80 text-white px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-600">R</div>
      </Html>
    </group>
  );
};

// Champ Magnétique B uniforme
const MagneticField = () => {
  const arrows = useMemo(() => {
    const arr = [];
    for (let x = -1.5; x <= 1.5; x += 1) {
      for (let z = -3; z <= 3; z += 1.5) {
        arr.push([x, z]);
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {arrows.map(([x, z], i) => (
        <group key={i} position={[x, -0.5, z]}>
          <Line points={[[0, 0, 0], [0, 1.2, 0]]} color="#10b981" lineWidth={1.5} opacity={0.4} transparent />
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.08, 0.2, 8]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      <Html position={[2.5, 1, 0]} center>
        <div className="text-emerald-400 font-bold text-lg"><LatexMath math="\vec{B}" /></div>
      </Html>
    </group>
  );
};

export default function LaplaceRail3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [v0, setV0] = useState(2); // Vitesse initiale
  const [B, setB] = useState(1);   // Intensité champ B
  
  const [posZ, setPosZ] = useState(3);
  const [vel, setVel] = useState(0);
  const [inducedI, setInducedI] = useState(0);
  const [laplaceF, setLaplaceF] = useState(0);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Relancer si on change v0 manuellement quand à l'arrêt
  useEffect(() => {
    if (!isPlaying && Math.abs(vel) < 0.1) {
      setVel(v0);
      setPosZ(3);
    }
  }, [v0]);

  // Physique du freinage par induction
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && inView) {
        setPosZ((prevZ) => {
          let newZ = prevZ;
          setVel((prevV) => {
            // e = B * L * v
            const L = 4; // distance entre les rails
            const e = B * L * prevV;
            const R = 2; // résistance arbitraire
            const I = e / R; // courant induit
            
            // Force de Laplace: F = I * L * B (opposée à la vitesse)
            const F = -I * L * B;
            
            // a = F / m
            const m = 1;
            const a = F / m;
            
            let newV = prevV + a * delta;
            
            // Si la vitesse devient quasi nulle, on arrête
            if (Math.abs(newV) < 0.05) newV = 0;
            
            newZ = prevZ - newV * delta; // - car on va de Z=3 vers Z=-3
            
            // Limites physiques du rail
            if (newZ < -3.5) {
              newZ = -3.5;
              newV = 0;
            }

            setInducedI(I);
            setLaplaceF(F);
            
            return newV;
          });
          return newZ;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, inView, B]);

  const resetSim = () => {
    setPosZ(3);
    setVel(v0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[320px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Data */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[130px]">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Vitesse (v):</span>
              <span className="text-blue-400 font-bold">{vel.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Courant (I):</span>
              <span className="text-amber-400 font-bold">{inducedI.toFixed(1)} A</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300 border-t border-slate-700/50 pt-1 mt-1">
              <span>Force (F_L):</span>
              <span className="text-red-400 font-bold">{laplaceF.toFixed(1)} N</span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 6, 8], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[0, 10, 0]} intensity={1.5} penumbra={1} />
          <Environment preset="city" />
          <OrbitControls ref={controlsRef} enableZoom={true} maxPolarAngle={Math.PI / 2.2} />
          
          <group position={[0, -0.5, 0]}>
            <Circuit />
            {B > 0 && <MagneticField />}

            {/* Barre Mobile */}
            <group position={[0, 0.25, posZ]}>
              <Cylinder args={[0.15, 0.15, 4.4, 32]} rotation={[0, 0, Math.PI/2]}>
                <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
              </Cylinder>
              
              {/* Vecteur Vitesse */}
              {vel > 0.1 && (
                <group position={[0, 0.5, 0]}>
                  <Line points={[[0, 0, 0], [0, 0, -vel * 0.5]]} color="#3b82f6" lineWidth={3} />
                  <mesh position={[0, 0, -vel * 0.5]} rotation={[-Math.PI/2, 0, 0]}>
                    <coneGeometry args={[0.08, 0.2, 8]} />
                    <meshBasicMaterial color="#3b82f6" toneMapped={false} />
                  </mesh>
                  <Html position={[0, 0.2, -vel * 0.25]} center>
                    <div className="text-blue-400 font-bold text-xs"><LatexMath math="\vec{v}" /></div>
                  </Html>
                </group>
              )}

              {/* Vecteur Force Laplace */}
              {Math.abs(laplaceF) > 0.1 && (
                <group position={[0, 0.5, 0]}>
                  <Line points={[[0, 0, 0], [0, 0, -laplaceF * 0.1]]} color="#ef4444" lineWidth={4} />
                  <mesh position={[0, 0, -laplaceF * 0.1]} rotation={[Math.PI/2, 0, 0]}>
                    <coneGeometry args={[0.1, 0.25, 8]} />
                    <meshBasicMaterial color="#ef4444" toneMapped={false} />
                  </mesh>
                  <Html position={[0, 0.3, -laplaceF * 0.05]} center>
                    <div className="text-red-400 font-bold text-xs"><LatexMath math="\vec{F}_L" /></div>
                  </Html>
                </group>
              )}
            </group>
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -0.6, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex w-full gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
              <span>Champ B</span>
              <span className="text-emerald-400">{B} T</span>
            </div>
            <input type="range" min="0" max="3" step="0.5" value={B} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
              <span>Vitesse v0</span>
              <span className="text-blue-400">{v0} m/s</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value={v0} onChange={(e) => setV0(Number(e.target.value))} className="w-full accent-blue-500 h-1.5" />
          </div>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={resetSim} title="Relancer l'expérience" className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
