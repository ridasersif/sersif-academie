"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Lignes de champ du dipôle magnétique
// Formule approchée d'un dipôle parfait m = I * S
const DipoleFieldLines = ({ count = 8, scale = 1, showMoment = true }) => {
  const curves = useMemo(() => {
    const arr = [];
    // Générer 'count' lignes réparties angulairement autour de l'axe Z
    for (let i = 0; i < count; i++) {
      const phi = (i / count) * Math.PI * 2;
      const pts = [];
      // Tracer la ligne de champ (r = r0 * sin^2(theta))
      const r0 = 2.5 * scale; 
      for (let j = 0; j <= 60; j++) {
        // theta de 0 (pôle nord) à PI (pôle sud), en évitant l'origine exacte
        const theta = 0.05 + (j / 60) * (Math.PI - 0.1); 
        const r = r0 * Math.pow(Math.sin(theta), 2);
        
        // Coordonnées sphériques -> cartésiennes
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta); // L'axe du dipôle est Z
        
        pts.push(new THREE.Vector3(x, y, z));
      }
      arr.push(pts);
    }
    return arr;
  }, [count, scale]);

  return (
    <group>
      {curves.map((pts, i) => (
        <group key={i}>
          <Line points={pts} color="#10b981" lineWidth={1.5} opacity={0.6} transparent />
          {/* Petite flèche au milieu de la ligne pour indiquer le sens (du N vers le S) */}
          <mesh position={pts[30]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.04]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      ))}

      {/* Moment Magnétique m */}
      {showMoment && (
        <group>
          <Line points={[[0, 0, -1], [0, 0, 1.5 * scale]]} color="#facc15" lineWidth={4} />
          <mesh position={[0, 0, 1.5 * scale]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.15, 0.4, 16]} />
            <meshBasicMaterial color="#facc15" toneMapped={false} />
          </mesh>
          <Html position={[0.2, 0.2, 1.6 * scale]} center>
            <div className="text-yellow-400 font-bold text-lg drop-shadow-md"><LatexMath math="\vec{m}" /></div>
          </Html>
        </group>
      )}
    </group>
  );
};

export default function MagneticDipole3DCanvas() {
  const [intensity, setIntensity] = useState(1);
  const [showMoment, setShowMoment] = useState(true);
  
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
        
        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 3, 5], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
          
          <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Spire de courant */}
            <mesh>
              <torusGeometry args={[0.6, 0.06, 16, 64]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} emissive="#1e40af" emissiveIntensity={0.5} />
            </mesh>
            {/* Sens du courant I */}
            <mesh position={[0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.1, 0.25, 16]} />
              <meshBasicMaterial color="#60a5fa" toneMapped={false} />
            </mesh>
            <Html position={[0.8, 0, 0]} center>
              <span className="text-blue-400 font-bold text-sm">I</span>
            </Html>

            <DipoleFieldLines scale={intensity} showMoment={showMoment} count={12} />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2} opacity={0.4} far={5} color="#0f172a" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
            <span>Intensité du Moment <LatexMath math="\|\vec{m}\|" /></span>
            <span className="text-yellow-400">{intensity.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="0.5" max="2" step="0.1" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-yellow-500 h-1.5"
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setShowMoment(!showMoment)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showMoment ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
          >
            {showMoment ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Moment <LatexMath math="\vec{m}" />
          </button>
        </div>
      </div>
    </div>
  );
}
