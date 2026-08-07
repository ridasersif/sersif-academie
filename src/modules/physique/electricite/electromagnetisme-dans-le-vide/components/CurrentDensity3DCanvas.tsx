"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity, react-hooks/immutability */

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Settings2, Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// --- Composant des particules avec vecteur vitesse ---
const Particles = ({ density = 200, speed = 4, chargeSign = -1, isPlaying = true, showVectors = true }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const coneMesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const coneDummy = useMemo(() => new THREE.Object3D(), []);

  // Génération des positions initiales (dans un cylindre de rayon 1.4, longueur 10)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 300; i++) {
      const radius = Math.random() * 0.7;
      const theta = Math.random() * 2 * Math.PI;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 6;
      temp.push({ x, y, z, offset: Math.random() * 100 });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current || !coneMesh.current) return;
    
    // Animer uniquement le nombre de particules demandé par "density"
    for (let i = 0; i < 300; i++) {
      const p = particles[i];
      
      if (i < density) {
        if (isPlaying) {
          p.z += speed * delta * 0.8;
          if (p.z > 3) p.z = -3; // Boucle
        }
        
        // Position de la sphère
        dummy.position.set(p.x, p.y, p.z);
        // Légère oscillation thermique
        dummy.position.x += Math.sin(state.clock.elapsedTime * 5 + p.offset) * 0.002;
        dummy.position.y += Math.cos(state.clock.elapsedTime * 5 + p.offset) * 0.002;
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);

        if (showVectors) {
          // Position du vecteur vitesse (Cône orienté vers +Z)
          coneDummy.position.set(p.x, p.y, p.z + 0.12);
          coneDummy.rotation.set(Math.PI / 2, 0, 0); // Pointe vers +Z
          coneDummy.scale.setScalar(1);
          coneDummy.updateMatrix();
          coneMesh.current.setMatrixAt(i, coneDummy.matrix);
        } else {
          coneDummy.scale.setScalar(0);
          coneDummy.updateMatrix();
          coneMesh.current.setMatrixAt(i, coneDummy.matrix);
        }
      } else {
        // Cacher les particules en excès
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        
        coneDummy.scale.setScalar(0);
        coneDummy.updateMatrix();
        coneMesh.current.setMatrixAt(i, coneDummy.matrix);
      }
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
    coneMesh.current.instanceMatrix.needsUpdate = true;
  });

  const particleColor = chargeSign === -1 ? "#3b82f6" : "#ef4444";
  const particleEmissive = chargeSign === -1 ? "#2563eb" : "#dc2626";

  return (
    <group>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={mesh} args={[null, null, 300] as any}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshPhysicalMaterial 
          color={particleColor} 
          emissive={particleEmissive} 
          emissiveIntensity={2} 
          roughness={0.2}
          metalness={0.8}
          toneMapped={false} 
        />
      </instancedMesh>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={coneMesh} args={[null, null, 300] as any}>
        <coneGeometry args={[0.02, 0.08, 8]} />
        <meshBasicMaterial color="#facc15" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default function CurrentDensity3DCanvas() {
  const [chargeSign, setChargeSign] = useState<-1 | 1>(-1); // -1 = Électrons, 1 = Cations
  const [density, setDensity] = useState(150);
  const [speed, setSpeed] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Calcul visuel du vecteur j
  const jLength = (density / 250) * (speed / 4) * 1.5; // Base length is 1.5
  const jDir = chargeSign; // si charge positive, j est dans le même sens que v (+Z). Sinon opposé (-Z).

  // Formules en temps réel
  const qStr = chargeSign === -1 ? "-e" : "+q";
  const absQStr = chargeSign === -1 ? "e" : "q";
  const iValue = (density * speed * 3.14).toFixed(0);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      
      {/* Zone 3D */}
      <div className="w-full max-w-[800px] mx-auto h-[280px] sm:h-[320px] md:h-[350px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">

        {/* HUD: Formules en Temps Réel */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 p-3 rounded-xl shadow-md flex flex-col gap-2 min-w-[140px]">
            <div className="text-[10px] sm:text-[11px] font-mono text-slate-300">
              <div className="flex justify-between mb-1">
                <span>j = n|{qStr}|v</span>
                <span className="text-emerald-400 ml-2">{density}·{absQStr}·{speed}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-400 mt-2 border-t border-slate-700/50 pt-2">
                <span>I :</span>
                <span className="ml-2">{iValue} A</span>
              </div>
            </div>
          </div>
        </div>

        <Canvas camera={{ position: [10, 6, -10], fov: 40 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          
          <Environment preset="city" />
          <OrbitControls ref={controlsRef} enableZoom={true} maxPolarAngle={Math.PI / 1.5} />
          
          {/* Post-processing Glow */}
          <EffectComposer>
            <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>

          <group position={[0, 0.5, 0]}>
            
            {/* Fil Conducteur (Verre/Cristal) orienté le long de Z */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 6, 64]} />
              <meshPhysicalMaterial 
                color="#e2e8f0" 
                transparent 
                opacity={0.10} 
                roughness={0.05}
                metalness={0.2}
                transmission={0.95}
                thickness={1}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>

            {/* Bords du cylindre pour la lisibilité */}
            <lineSegments rotation={[Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.8, 0.8, 6, 32)]} />
              <lineBasicMaterial color="#94a3b8" transparent opacity={0.15} />
            </lineSegments>

            {/* Section dS (Surface élémentaire au milieu) */}
            <group position={[0, 0, 0]}>
              <mesh>
                <circleGeometry args={[0.82, 64]} />
                <meshPhysicalMaterial color="#ef4444" transparent opacity={0.15} side={THREE.DoubleSide} emissive="#ef4444" emissiveIntensity={0.2} />
              </mesh>
              <Line 
                points={(() => {
                  const pts = [];
                  for(let i=0; i<=64; i++) {
                    const a = (i/64) * Math.PI * 2;
                    pts.push(new THREE.Vector3(0.82*Math.cos(a), 0.82*Math.sin(a), 0));
                  }
                  return pts;
                })()}
                color="#ef4444"
                lineWidth={1}
              />
            </group>

            {/* Vecteur Vitesse Moyenne global (v) */}
            {showVectors && (
              <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [0, 0, speed * 0.3]]} color="#facc15" lineWidth={2} />
                <mesh position={[0, 0, speed * 0.3]} rotation={[Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.06, 0.15, 16]} />
                  <meshBasicMaterial color="#facc15" toneMapped={false} />
                </mesh>
                <Html position={[0.2, 0.2, (speed * 0.3) + 0.1]} center>
                  <div className="text-yellow-400 font-bold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <LatexMath math="\vec{v}" />
                  </div>
                </Html>
              </group>
            )}

            {/* Vecteur Normal dS (Strictement normal au centre) */}
            {showVectors && (
              <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [0, 0, 1.2]]} color="#f87171" lineWidth={1.5} dashed dashSize={0.1} gapSize={0.1} />
                <mesh position={[0, 0, 1.2]} rotation={[Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.05, 0.15, 16]} />
                  <meshBasicMaterial color="#f87171" toneMapped={false} />
                </mesh>
                <Html position={[0.1, 0.1, 1.3]} center>
                  <div className="text-red-400 font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <LatexMath math="d\vec{S}" />
                  </div>
                </Html>
              </group>
            )}

            {/* Vecteur Densité de Courant (j) */}
            {showVectors && (
              <group position={[0, 0, 0]}>
                <Line points={[[0, 0, 0], [0, 0, jLength * jDir]]} color="#10b981" lineWidth={3} />
                <mesh position={[0, 0, jLength * jDir]} rotation={[jDir > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
                  <coneGeometry args={[0.08, 0.2, 16]} />
                  <meshBasicMaterial color="#10b981" toneMapped={false} />
                </mesh>
                <Html position={[-0.3, -0.3, (jLength + 0.2) * jDir]} center>
                  <div className="text-emerald-400 font-bold text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <LatexMath math="\vec{j}" />
                  </div>
                </Html>
              </group>
            )}

            {/* Particules animées */}
            <Particles density={density} speed={speed} chargeSign={chargeSign} isPlaying={isPlaying} showVectors={showVectors} />
          </group>
          
          <ContactShadows resolution={256} scale={20} blur={2} opacity={0.4} far={10} color="#0f172a" />
        </Canvas>
      </div>

      {/* Contrôles externes (en dessous du canvas) */}
      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Densité (n)</span>
              <span className="text-blue-400">{density}</span>
            </div>
            <input 
              type="range" min="10" max="300" value={density} onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Vitesse (v)</span>
              <span className="text-purple-400">{speed}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-purple-500 h-1.5"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
          {/* Switch Porteurs */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto">
            <button 
              onClick={() => setChargeSign(-1)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${chargeSign === -1 ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
            >
              Électrons (-e)
            </button>
            <button 
              onClick={() => setChargeSign(1)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${chargeSign === 1 ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
            >
              Cations (+q)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowVectors(!showVectors)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
            >
              {showVectors ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Vecteurs
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-md transition-colors border border-slate-700"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={() => controlsRef.current?.reset()}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
