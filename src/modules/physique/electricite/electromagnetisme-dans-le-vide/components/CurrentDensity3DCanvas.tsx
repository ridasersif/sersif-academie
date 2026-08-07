"use client";
/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity, react-hooks/immutability */

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";

// --- Composant des particules avec vecteur vitesse ---
const Particles = ({ density = 200, speed = 4, chargeSign = -1, isPlaying = true }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const coneMesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const coneDummy = useMemo(() => new THREE.Object3D(), []);

  // Génération des positions initiales (dans un cylindre de rayon 1.4, longueur 10)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 500; i++) { // Max particles is 500
      const radius = Math.random() * 1.3;
      const theta = Math.random() * 2 * Math.PI;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (Math.random() - 0.5) * 10;
      temp.push({ x, y, z, offset: Math.random() * 100 });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current || !coneMesh.current) return;
    
    // Animer uniquement le nombre de particules demandé par "density"
    for (let i = 0; i < 500; i++) {
      const p = particles[i];
      
      if (i < density) {
        if (isPlaying) {
          p.z += speed * delta;
          if (p.z > 5) p.z = -5; // Boucle
        }
        
        // Position de la sphère
        dummy.position.set(p.x, p.y, p.z);
        // Légère oscillation thermique
        dummy.position.x += Math.sin(state.clock.elapsedTime * 5 + p.offset) * 0.002;
        dummy.position.y += Math.cos(state.clock.elapsedTime * 5 + p.offset) * 0.002;
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);

        // Position du vecteur vitesse (Cône orienté vers +Z)
        coneDummy.position.set(p.x, p.y, p.z + 0.12);
        coneDummy.rotation.set(Math.PI / 2, 0, 0); // Pointe vers +Z
        coneDummy.scale.setScalar(1);
        coneDummy.updateMatrix();
        coneMesh.current.setMatrixAt(i, coneDummy.matrix);
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
      <instancedMesh ref={mesh} args={[null, null, 500] as any}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhysicalMaterial 
          color={particleColor} 
          emissive={particleEmissive} 
          emissiveIntensity={2} 
          roughness={0.2}
          metalness={0.8}
          toneMapped={false} 
        />
      </instancedMesh>
      <instancedMesh ref={coneMesh} args={[null, null, 500]}>
        <coneGeometry args={[0.04, 0.15, 8]} />
        <meshBasicMaterial color="#facc15" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default function CurrentDensity3DCanvas() {
  const [chargeSign, setChargeSign] = useState<-1 | 1>(-1); // -1 = Électrons, 1 = Cations
  const [density, setDensity] = useState(250);
  const [speed, setSpeed] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const controlsRef = useRef<any>(null);

  // Calcul visuel du vecteur j
  const jLength = (density / 250) * (speed / 4) * 2.5; // Base length is 2.5
  const jDir = chargeSign; // si charge positive, j est dans le même sens que v (+Z). Sinon opposé (-Z).

  // Formules en temps réel
  const qStr = chargeSign === -1 ? "-e" : "+q";
  const absQStr = chargeSign === -1 ? "e" : "q";
  const iValue = (density * speed * 3.14).toFixed(0);

  return (
    <div className="w-full h-[450px] sm:h-[500px] md:h-[600px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800 flex flex-col font-sans">
      
      {/* HUD: Titre et Switch Porteurs */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-3 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl">
          <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-blue-400" /> Paramètres
          </h4>
          
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setChargeSign(-1)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${chargeSign === -1 ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
            >
              Électrons (-e)
            </button>
            <button 
              onClick={() => setChargeSign(1)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${chargeSign === 1 ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
            >
              Cations (+q)
            </button>
          </div>
        </div>
      </div>

      {/* HUD: Formules en Temps Réel */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl flex flex-col gap-2 min-w-[180px]">
          <h4 className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1 border-b border-slate-700 pb-1">Mesures (Live)</h4>
          <div className="text-[11px] font-mono text-slate-300">
            <div className="flex justify-between mb-1">
              <span>j = n|{qStr}|v</span>
              <span className="text-emerald-400">{density}·{absQStr}·{speed}</span>
            </div>
            <div className="flex justify-between font-bold text-amber-400 mt-2 border-t border-slate-700/50 pt-2">
              <span>Flux I :</span>
              <span>{iValue} A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles du bas (Sliders et Play/Reset) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] max-w-[500px] z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl flex flex-col gap-4 pointer-events-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-300">
              <span>Densité Particulaire (n)</span>
              <span className="text-blue-400">{density}</span>
            </div>
            <input 
              type="range" min="10" max="500" value={density} onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-300">
              <span>Vitesse moyenne (v)</span>
              <span className="text-purple-400">{speed}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-1 border-t border-slate-700/50 pt-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-600"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button 
            onClick={() => controlsRef.current?.reset()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Centrer
          </button>
        </div>
      </div>

      <Canvas camera={{ position: [5, 4, -5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
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
            <cylinderGeometry args={[1.5, 1.5, 10, 64]} />
            <meshPhysicalMaterial 
              color="#e2e8f0" 
              transparent 
              opacity={0.15} 
              roughness={0.05}
              metalness={0.2}
              transmission={0.95} // Effet verre très fluide
              thickness={1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Bords du cylindre pour la lisibilité */}
          <lineSegments rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.CylinderGeometry(1.5, 1.5, 10, 32)]} />
            <lineBasicMaterial color="#94a3b8" transparent opacity={0.2} />
          </lineSegments>

          {/* Section dS (Surface élémentaire au milieu) */}
          <group position={[0, 0, 0]}>
            <mesh>
              <circleGeometry args={[1.52, 64]} />
              <meshPhysicalMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
            <Line 
              points={(() => {
                const pts = [];
                for(let i=0; i<=64; i++) {
                  const a = (i/64) * Math.PI * 2;
                  pts.push(new THREE.Vector3(1.52*Math.cos(a), 1.52*Math.sin(a), 0));
                }
                return pts;
              })()}
              color="#ef4444"
              lineWidth={2}
            />
          </group>

          {/* Vecteur Normal dS (Strictement normal au centre) */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 0, 2.5]]} color="#f87171" lineWidth={4} />
            <mesh position={[0, 0, 2.5]} rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.1, 0.3, 16]} />
              <meshBasicMaterial color="#f87171" toneMapped={false} />
            </mesh>
            <Html position={[0.2, 0.2, 2.7]} center>
              <div className="text-red-400 font-bold font-mono text-xs drop-shadow-md bg-slate-900/50 px-1 rounded">dS</div>
            </Html>
          </group>

          {/* Vecteur Densité de Courant (j) : S'inverse selon la charge */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 0, jLength * jDir]]} color="#10b981" lineWidth={7} />
            <mesh position={[0, 0, jLength * jDir]} rotation={[jDir > 0 ? Math.PI/2 : -Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.18, 0.5, 16]} />
              <meshBasicMaterial color="#10b981" toneMapped={false} />
            </mesh>
            <Html position={[-0.4, -0.4, (jLength + 0.5) * jDir]} center>
              <div className="text-emerald-400 font-bold font-mono text-base bg-emerald-900/30 px-2 rounded-lg border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                j
              </div>
            </Html>
          </group>

          {/* Vecteur Vitesse Moyenne global (v) */}
          <group position={[0, 0, 0]}>
            <Line points={[[0, 0, 0], [0, 0, speed * 0.5]]} color="#facc15" lineWidth={4} />
            <mesh position={[0, 0, speed * 0.5]} rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.15, 0.4, 16]} />
              <meshBasicMaterial color="#facc15" toneMapped={false} />
            </mesh>
            <Html position={[0.4, 0.4, (speed * 0.5) + 0.3]} center>
              <div className="text-yellow-400 font-bold font-mono text-sm drop-shadow-md bg-slate-900/50 px-1 rounded">
                v
              </div>
            </Html>
          </group>

          {/* Particules animées */}
          <Particles count={500} density={density} speed={speed} chargeSign={chargeSign} isPlaying={isPlaying} />
        </group>
        
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.4} far={10} color="#0f172a" />
      </Canvas>
    </div>
  );
}
