"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

export default function CurrentFlux3DCanvas() {
  const [angleDeg, setAngleDeg] = useState(0); // 0 à 90 degrés
  const angleRad = (angleDeg * Math.PI) / 180;
  
  const surfaceRadius = 1.5;
  const dSLength = 2.5;
  
  const cosTheta = Math.cos(angleRad);
  // Valeurs visuelles pour l'intensité
  const fluxValue = (100 * cosTheta).toFixed(1);

  // Fonction pour dessiner le faisceau de lignes j
  const renderJBeam = () => {
    const lines = [];
    const numLines = 12;
    for (let i = 0; i < numLines; i++) {
      const a = (i / numLines) * Math.PI * 2;
      const r = surfaceRadius * 0.7; // lines spread out
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      lines.push(
        <group key={i} position={[x, y, 0]}>
          <Line points={[[0, 0, -3], [0, 0, 3]]} color="#10b981" lineWidth={1.5} transparent opacity={0.5} />
        </group>
      );
    }
    return lines;
  };

  return (
    <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800 flex flex-col font-sans">
      
      {/* HUD: Titre et Valeurs */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl flex flex-col gap-2">
          <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider border-b border-slate-700 pb-1">
            Flux de Courant (I)
          </h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div className="flex justify-between gap-4 mb-1">
              <span>Formule:</span>
              <span className="text-emerald-400">I = j · dS · cos(θ)</span>
            </div>
            <div className="flex justify-between gap-4 mb-1">
              <span>Angle θ:</span>
              <span className="text-blue-400">{angleDeg}°</span>
            </div>
            <div className="flex justify-between gap-4 font-bold text-amber-400 mt-2 border-t border-slate-700/50 pt-2">
              <span>Intensité (Flux):</span>
              <span>{fluxValue} A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Contrôle (Overlay en bas) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] sm:w-[70%] max-w-[400px] z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl flex flex-col gap-2 pointer-events-auto">
        <div className="flex justify-between text-[11px] font-bold text-slate-300">
          <span>Inclinaison de la surface (θ)</span>
          <span className="text-blue-400">{angleDeg}°</span>
        </div>
        <input 
          type="range" min="0" max="90" value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <p className="text-[10px] text-slate-400 text-center mt-1">
          {angleDeg === 0 && "Flux Maximal (cos(0) = 1)"}
          {angleDeg === 90 && "Flux Nul (cos(90) = 0)"}
          {angleDeg > 0 && angleDeg < 90 && `Flux réduit (cos(${angleDeg}) = ${cosTheta.toFixed(2)})`}
        </p>
      </div>

      <Canvas camera={{ position: [5, 3, 5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={1.5} penumbra={1} />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} />

        <group position={[0, 0, 0]}>
          {/* Faisceau j global (lignes vertes) */}
          {renderJBeam()}
          
          {/* Vecteur principal j */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, -2], [0, 0, 2]]} color="#10b981" lineWidth={5} />
            <mesh position={[0, 0, 2]} rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color="#10b981" toneMapped={false} />
            </mesh>
            <Html position={[0.2, 0.2, 2.3]} center>
              <div className="text-emerald-400 font-bold font-mono text-sm bg-emerald-900/50 px-1.5 rounded">j</div>
            </Html>
          </group>

          {/* Surface Inclinable */}
          {/* On la tourne autour de l'axe X ou Y. Si j est sur Z, on incline sur X ou Y. */}
          <group rotation={[angleRad, 0, 0]}>
            {/* Le disque rouge semi-transparent */}
            <mesh>
              <circleGeometry args={[surfaceRadius, 64]} />
              <meshPhysicalMaterial color="#ef4444" transparent opacity={0.3} side={THREE.DoubleSide} emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
            {/* Bordure du disque */}
            <Line 
              points={(() => {
                const pts = [];
                for(let i=0; i<=64; i++) {
                  const a = (i/64) * Math.PI * 2;
                  pts.push(new THREE.Vector3(surfaceRadius*Math.cos(a), surfaceRadius*Math.sin(a), 0));
                }
                return pts;
              })()}
              color="#ef4444"
              lineWidth={3}
            />

            {/* Vecteur normal dS */}
            <group position={[0, 0, 0]}>
              <Line points={[[0, 0, 0], [0, 0, dSLength]]} color="#3b82f6" lineWidth={4} />
              <mesh position={[0, 0, dSLength]} rotation={[Math.PI/2, 0, 0]}>
                <coneGeometry args={[0.1, 0.3, 16]} />
                <meshBasicMaterial color="#3b82f6" toneMapped={false} />
              </mesh>
              <Html position={[0, -0.3, dSLength + 0.2]} center>
                <div className="text-blue-400 font-bold font-mono text-sm bg-blue-900/50 px-1.5 rounded">dS</div>
              </Html>
            </group>
          </group>

          {/* Affichage de l'Angle θ entre j et dS */}
          {angleDeg > 0 && (
            <group>
              <Line 
                points={(() => {
                  const arc = [];
                  for (let i = 0; i <= 20; i++) {
                    const a = (i/20) * angleRad;
                    // L'arc va de Z (axe de j) vers l'axe incliné
                    arc.push(new THREE.Vector3(0, 1.2 * Math.sin(a), 1.2 * Math.cos(a)));
                  }
                  return arc;
                })()}
                color="#facc15"
                lineWidth={3}
              />
              <Html position={[0, 1.4 * Math.sin(angleRad/2), 1.4 * Math.cos(angleRad/2)]} center>
                <div className="text-yellow-400 font-bold font-mono text-xs">θ</div>
              </Html>
            </group>
          )}

        </group>

        <ContactShadows resolution={1024} scale={15} blur={2.5} opacity={0.4} far={5} color="#0f172a" />
      </Canvas>
    </div>
  );
}
