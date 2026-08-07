"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity */

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Play, Pause, RotateCcw, Eye, EyeOff } from "lucide-react";

// --- Système de particules représentant le courant (j) ---
const FluxParticles = ({ jMagnitude, isPlaying }: { jMagnitude: number, isPlaying: boolean }) => {
  const count = 300;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mesh = useRef<any>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Cylindre de rayon 2.0 pour couvrir largement la boucle
      const r = Math.random() * 2.0;
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (Math.random() - 0.5) * 8; 
      temp.push({ x, y, z, speed: 1.5 + Math.random() * 1.0 });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const activeCount = Math.floor((jMagnitude / 10) * count);

    particles.forEach((p, i) => {
      if (i >= activeCount) {
        dummy.position.set(100, 100, 100);
      } else {
        if (isPlaying) {
          p.z += p.speed * delta * 2;
          if (p.z > 4) p.z = -4;
        }
        dummy.position.set(p.x, p.y, p.z);
      }
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <instancedMesh ref={mesh} args={[null, null, count] as any}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color="#10b981" />
    </instancedMesh>
  );
};

export default function CurrentFlux3DCanvas() {
  const [angleDeg, setAngleDeg] = useState(30); 
  const [radius, setRadius] = useState(1.0); 
  const [jMagnitude, setJMagnitude] = useState(5); 
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHUD, setShowHUD] = useState(false);
  
  const angleRad = (angleDeg * Math.PI) / 180;
  const cosTheta = Math.cos(angleRad);
  
  // Valeurs Physiques pour le HUD
  const surfaceArea = Math.PI * radius * radius;
  const fluxValue = (jMagnitude * 10 * surfaceArea * cosTheta).toFixed(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      
      {/* Zone 3D */}
      <div className="w-full max-w-[800px] mx-auto h-[280px] sm:h-[320px] md:h-[350px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD: Titre et Valeurs */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 p-2 sm:p-3 rounded-xl shadow-md flex flex-col gap-2 items-start">
            <div className="flex justify-between items-center w-full gap-4">
              <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider">
                Flux de Courant (I)
              </h4>
              <button 
                onClick={() => setShowHUD(!showHUD)}
                title="Afficher/Masquer les formules"
                className="text-slate-400 hover:text-white transition-colors"
              >
                {showHUD ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {showHUD && (
              <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 border-t border-slate-700/50 pt-2 mt-1 min-w-[180px]">
                <div className="flex justify-between gap-4 mb-1">
                  <span>Formule:</span>
                  <span className="text-emerald-400">I = j · dS · cos(θ)</span>
                </div>
                <div className="flex justify-between gap-4 mb-1">
                  <span>Surface (S):</span>
                  <span className="text-blue-400">{surfaceArea.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between gap-4 mb-1">
                  <span>Angle θ:</span>
                  <span className="text-yellow-400">{angleDeg}°</span>
                </div>
                <div className="flex justify-between gap-4 font-bold text-amber-400 mt-2 border-t border-slate-700/50 pt-2">
                  <span>I :</span>
                  <span>{fluxValue} A</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Canvas camera={{ position: [5, 3, 5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 10, 5]} intensity={1.5} penumbra={1} />
          
          <Environment preset="city" />
          <OrbitControls ref={controlsRef} enableZoom={true} autoRotate={!isPlaying} autoRotateSpeed={1.0} maxPolarAngle={Math.PI / 1.2} />

          <group position={[0, 0, 0]}>
            
            {/* Tube transparent (Le fil conducteur) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.0, 2.0, 8, 32, 1, true]} />
              <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} roughness={0.1} transmission={0.5} thickness={0.5} />
            </mesh>

            {/* Particules (Fleuve de courant) */}
            <FluxParticles jMagnitude={jMagnitude} isPlaying={isPlaying} />
            
            {/* Vecteur principal j */}
            <group position={[0, 0, 0]}>
              <Line points={[[0, 0, -1], [0, 0, 1.5]]} color="#10b981" lineWidth={3} />
              <mesh position={[0, 0, 1.5]} rotation={[Math.PI/2, 0, 0]}>
                <coneGeometry args={[0.06, 0.15, 16]} />
                <meshBasicMaterial color="#10b981" toneMapped={false} />
              </mesh>
              <Html position={[0.1, 0.1, 1.7]} center>
                <div className="text-emerald-400 font-bold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  <LatexMath math="\vec{j}" />
                </div>
              </Html>
            </group>

            {/* Surface S Inclinable */}
            <group rotation={[angleRad, 0, 0]}>
              {/* Le cerceau physique */}
              <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[radius, 0.03, 16, 64]} />
                <meshPhysicalMaterial color="#3b82f6" metalness={0.8} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.5} />
              </mesh>
              
              {/* Le "Verre" intérieur pour matérialiser la surface */}
              <mesh>
                <circleGeometry args={[radius, 64]} />
                <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} />
              </mesh>

              {/* Vecteur normal dS */}
              <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [0, 0, radius + 0.5]]} color="#3b82f6" lineWidth={2} dashed dashSize={0.1} gapSize={0.1} />
                <mesh position={[0, 0, radius + 0.5]} rotation={[Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.05, 0.15, 16]} />
                  <meshBasicMaterial color="#3b82f6" toneMapped={false} />
                </mesh>
                <Html position={[0, -0.15, radius + 0.6]} center>
                  <div className="text-blue-400 font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <LatexMath math="d\vec{S}" />
                  </div>
                </Html>
              </group>
            </group>

            {/* Surface Projetée (S * cos(theta)) -> Ombre du flux */}
            {angleDeg > 0 && (
              <group position={[0, 0, -2.5]}>
                {/* C'est un cercle qu'on écrase selon l'axe Y */}
                <mesh scale={[1, cosTheta, 1]}>
                  <circleGeometry args={[radius, 64]} />
                  <meshBasicMaterial color="#facc15" transparent opacity={0.2} side={THREE.DoubleSide} />
                </mesh>
                {/* Bord de l'ombre */}
                <mesh scale={[1, cosTheta, 1]}>
                  <torusGeometry args={[radius, 0.015, 16, 64]} />
                  <meshBasicMaterial color="#facc15" />
                </mesh>
                
                {/* Label de la section efficace */}
                <Html position={[0, -radius * cosTheta - 0.2, 0]} center>
                  <div className="text-yellow-400 font-bold text-[9px] sm:text-[10px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded border border-yellow-500/30">
                    Surface Efficace = S·cos(θ)
                  </div>
                </Html>

                {/* Lignes de projection reliant la surface à son ombre */}
                <Line points={[[0, radius * cosTheta, radius * Math.sin(angleRad) + 2.5], [0, radius * cosTheta, 0]]} color="#facc15" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} transparent opacity={0.4} />
                <Line points={[[0, -radius * cosTheta, -radius * Math.sin(angleRad) + 2.5], [0, -radius * cosTheta, 0]]} color="#facc15" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} transparent opacity={0.4} />
                <Line points={[[radius, 0, 2.5], [radius, 0, 0]]} color="#facc15" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} transparent opacity={0.4} />
                <Line points={[[-radius, 0, 2.5], [-radius, 0, 0]]} color="#facc15" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} transparent opacity={0.4} />
              </group>
            )}

            {/* Affichage de l'Angle θ entre j et dS */}
            {angleDeg > 0 && (
              <group>
                <Line 
                  points={(() => {
                    const arc = [];
                    for (let i = 0; i <= 20; i++) {
                      const a = (i/20) * angleRad;
                      arc.push(new THREE.Vector3(0, (radius * 0.5) * Math.sin(a), (radius * 0.5) * Math.cos(a)));
                    }
                    return arc;
                  })()}
                  color="#facc15"
                  lineWidth={2}
                />
                <Html position={[0, (radius * 0.7) * Math.sin(angleRad/2), (radius * 0.7) * Math.cos(angleRad/2)]} center>
                  <div className="text-yellow-400 font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <LatexMath math="\theta" />
                  </div>
                </Html>
              </group>
            )}

          </group>

          <ContactShadows resolution={256} scale={15} blur={2.5} opacity={0.4} far={5} color="#0f172a" />
        </Canvas>
      </div>

      {/* Contrôles externes (en dessous du canvas) */}
      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
        
        {/* Sliders Area */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Angle */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
              <span>Angle (θ)</span>
              <span className="text-yellow-400">{angleDeg}°</span>
            </div>
            <input 
              type="range" min="0" max="90" value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))}
              className="w-full accent-yellow-500 h-1.5"
            />
          </div>
          
          {/* Radius */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
              <span>Surface (S)</span>
              <span className="text-blue-400">{radius.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0.5" max="2.0" step="0.1" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5"
            />
          </div>
          
          {/* Intensité */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-wider">
              <span>Courant (j)</span>
              <span className="text-emerald-400">{jMagnitude}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={jMagnitude} onChange={(e) => setJMagnitude(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 shrink-0 w-full sm:w-auto justify-end sm:border-l sm:border-slate-700/50 sm:pl-4">
           <button 
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Mettre en Pause" : "Démarrer Flux"}
              className="flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
           </button>
           <button 
              onClick={() => {
                setAngleDeg(0);
                setRadius(1.0);
                setJMagnitude(5);
                controlsRef.current?.reset();
              }}
              title="Réinitialiser"
              className="flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
