"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

// Composant : Condensateur (Stockage d'énergie électrique)
const Capacitor = ({ voltage }: { voltage: number }) => {
  const eFieldColor = "#a855f7";
  const numLines = Math.floor(voltage * 10); // Lignes de champ E proportionnelles à U
  
  return (
    <group position={[-2, 0, 0]}>
      {/* Plaque Supérieure */}
      <Box args={[1.5, 0.1, 1.5]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Box>
      <Html position={[0, 0.8, 0]} center>
        <span className="text-purple-400 font-bold text-xs"><LatexMath math="+Q" /></span>
      </Html>
      
      {/* Plaque Inférieure */}
      <Box args={[1.5, 0.1, 1.5]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Box>
      <Html position={[0, -0.8, 0]} center>
        <span className="text-purple-400 font-bold text-xs"><LatexMath math="-Q" /></span>
      </Html>

      {/* Lignes de champ E */}
      {voltage > 0 && Array.from({ length: numLines }).map((_, i) => {
        const x = (Math.random() - 0.5) * 1.2;
        const z = (Math.random() - 0.5) * 1.2;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
              <meshBasicMaterial color={eFieldColor} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.06, 0.15, 8]} />
              <meshBasicMaterial color={eFieldColor} />
            </mesh>
          </group>
        );
      })}
      
      <Html position={[0, 1.3, 0]} center>
        <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-center min-w-[80px]">
          <div className="text-[10px] text-slate-400 font-bold">ÉNERGIE ÉLECTRIQUE</div>
          <div className="text-purple-400 font-mono text-xs font-bold mt-1">
            <LatexMath math="u_e \propto E^2" />
          </div>
        </div>
      </Html>
    </group>
  );
};

// Composant : Bobine (Stockage d'énergie magnétique)
const Inductor = ({ current }: { current: number }) => {
  const bFieldColor = "#10b981";
  const numLines = Math.floor(current * 10); // Lignes de champ B proportionnelles à I

  return (
    <group position={[2, 0, 0]}>
      {/* Bobine Solénoïde (Torseurs pour faire le fil) */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />
        <meshPhysicalMaterial color="#334155" transmission={0.9} roughness={0.2} transparent opacity={0.3} />
      </mesh>
      
      {/* Fils de la bobine */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, -0.6 + i * 0.17, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.6, 0.03, 16, 64]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Lignes de champ B à l'intérieur */}
      {current > 0 && Array.from({ length: numLines }).map((_, i) => {
        // Points à l'intérieur du cylindre
        const r = Math.sqrt(Math.random()) * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <cylinderGeometry args={[0.015, 0.015, 2, 8]} />
              <meshBasicMaterial color={bFieldColor} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <coneGeometry args={[0.06, 0.15, 8]} />
              <meshBasicMaterial color={bFieldColor} />
            </mesh>
          </group>
        );
      })}

      <Html position={[0, 1.3, 0]} center>
        <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-center min-w-[80px]">
          <div className="text-[10px] text-slate-400 font-bold">ÉNERGIE MAGNÉTIQUE</div>
          <div className="text-emerald-400 font-mono text-xs font-bold mt-1">
            <LatexMath math="u_m \propto B^2" />
          </div>
        </div>
      </Html>
    </group>
  );
};

export default function EMEnergyDensity3DCanvas() {
  const [voltage, setVoltage] = useState(1);
  const [current, setCurrent] = useState(1);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[320px] sm:h-[400px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Total Energy */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-xs font-bold text-slate-300 mb-1">Densité Totale d'Énergie (<LatexMath math="u" />)</span>
            <div className="text-blue-400 font-mono text-sm font-bold">
              <LatexMath math={`u = ${(voltage*voltage * 0.5).toFixed(1)} \\, u_0 + ${(current*current * 0.5).toFixed(1)} \\, u_0`} />
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 2, 7], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[0, 10, 0]} intensity={2} penumbra={1} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, -0.2, 0]}>
            <Capacitor voltage={voltage} />
            <Inductor current={current} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -1.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Tension (Condensateur)</span>
            <span className="text-purple-400">U = {voltage} V</span>
          </div>
          <input 
            type="range" min="0" max="3" step="0.5" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-purple-500 h-1.5"
          />
        </div>
        
        <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Courant (Bobine)</span>
            <span className="text-emerald-400">I = {current} A</span>
          </div>
          <input 
            type="range" min="0" max="3" step="0.5" value={current} onChange={(e) => setCurrent(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5"
          />
        </div>
      </div>
    </div>
  );
}
