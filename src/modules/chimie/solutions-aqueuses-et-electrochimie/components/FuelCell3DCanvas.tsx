"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { Zap, Play, Pause, RefreshCw, Flame } from "lucide-react";

const FuelCellSystem = ({ isPlaying, powerLevel }: { isPlaying: boolean, powerLevel: number }) => {
  const electronMesh = useRef<THREE.InstancedMesh>(null);
  const h2Mesh = useRef<THREE.InstancedMesh>(null);
  const o2Mesh = useRef<THREE.InstancedMesh>(null);
  const waterMesh = useRef<THREE.InstancedMesh>(null);
  const ohMesh = useRef<THREE.InstancedMesh>(null);

  const dummy = new THREE.Object3D();

  // Wire path for electrons: Anode(-1.2, 2, 0) -> Load(0, 3, 0) -> Cathode(1.2, 2, 0)
  const wirePoints = [
    new THREE.Vector3(-1.2, 2, 0),
    new THREE.Vector3(-1.2, 3, 0),
    new THREE.Vector3(1.2, 3, 0),
    new THREE.Vector3(1.2, 2, 0)
  ];

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * (isPlaying ? 1.5 * powerLevel : 0);
    
    // --- Electrons in wire ---
    if (electronMesh.current) {
      for (let i = 0; i < 20; i++) {
        if (!isPlaying && powerLevel === 0) {
          dummy.scale.setScalar(0);
        } else {
          const t = (time + i / 20) % 1;
          let p;
          if (t < 0.2) p = new THREE.Vector3(-1.2, 2 + (t / 0.2), 0);
          else if (t < 0.8) p = new THREE.Vector3(-1.2 + ((t - 0.2) / 0.6) * 2.4, 3, 0);
          else p = new THREE.Vector3(1.2, 3 - ((t - 0.8) / 0.2), 0);
          
          dummy.position.copy(p);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        electronMesh.current.setMatrixAt(i, dummy.matrix);
      }
      electronMesh.current.instanceMatrix.needsUpdate = true;
    }

    // --- H2 entering left side ---
    if (h2Mesh.current) {
      for (let i = 0; i < 15; i++) {
        if (!isPlaying) { dummy.scale.setScalar(0); }
        else {
          const t = (time + i / 15) % 1;
          // Enter from left tube, go towards anode
          dummy.position.set(-3 + t * 1.5, Math.sin(time + i)*0.5, Math.cos(time + i)*0.5);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        h2Mesh.current.setMatrixAt(i, dummy.matrix);
      }
      h2Mesh.current.instanceMatrix.needsUpdate = true;
    }

    // --- O2 entering right side ---
    if (o2Mesh.current) {
      for (let i = 0; i < 15; i++) {
        if (!isPlaying) { dummy.scale.setScalar(0); }
        else {
          const t = (time + i / 15) % 1;
          dummy.position.set(3 - t * 1.5, Math.sin(time + i + 2)*0.5, Math.cos(time + i + 2)*0.5);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        o2Mesh.current.setMatrixAt(i, dummy.matrix);
      }
      o2Mesh.current.instanceMatrix.needsUpdate = true;
    }

    // --- OH- crossing electrolyte (right to left) ---
    if (ohMesh.current) {
      for (let i = 0; i < 20; i++) {
        if (!isPlaying) { dummy.scale.setScalar(0); }
        else {
          const t = (time * 0.5 + i / 20) % 1;
          dummy.position.set(1.1 - t * 2.2, Math.sin(time * 2 + i)*0.8, Math.cos(time * 2 + i)*0.8);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        ohMesh.current.setMatrixAt(i, dummy.matrix);
      }
      ohMesh.current.instanceMatrix.needsUpdate = true;
    }

    // --- H2O leaving bottom ---
    if (waterMesh.current) {
      for (let i = 0; i < 20; i++) {
        if (!isPlaying) { dummy.scale.setScalar(0); }
        else {
          const t = (time * 0.8 + i / 20) % 1;
          dummy.position.set(Math.sin(time+i)*0.2, -1 - t * 2, Math.cos(time+i)*0.2);
          dummy.scale.setScalar(1);
        }
        dummy.updateMatrix();
        waterMesh.current.setMatrixAt(i, dummy.matrix);
      }
      waterMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. MAIN CELL BODY */}
      {/* Electrolyte Membrane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.8} opacity={0.3} transparent />
      </mesh>
      <Text position={[0, 0, 1.1]} fontSize={0.2} color="#0284c7">Électrolyte (OH⁻)</Text>

      {/* Anode (-) */}
      <mesh position={[-1.1, 0, 0]}>
        <boxGeometry args={[0.2, 3, 2]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.6} />
      </mesh>
      <Text position={[-1.2, 1.8, 1.1]} fontSize={0.25} color="#f43f5e">Anode (-)</Text>
      
      {/* Cathode (+) */}
      <mesh position={[1.1, 0, 0]}>
        <boxGeometry args={[0.2, 3, 2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.6} />
      </mesh>
      <Text position={[1.2, 1.8, 1.1]} fontSize={0.25} color="#10b981">Cathode (+)</Text>

      {/* 2. GAS INLETS */}
      {/* H2 Inlet */}
      <mesh position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 2.5, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <Text position={[-3.2, 1.2, 0]} fontSize={0.3} color="#fcd34d">Entrée H₂</Text>

      {/* O2 Inlet */}
      <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 2.5, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <Text position={[3.2, 1.2, 0]} fontSize={0.3} color="#38bdf8">Entrée O₂</Text>

      {/* H2O Outlet (Bottom) */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, -2.5, 0.7]} fontSize={0.2} color="#0ea5e9">Sortie H₂O + Chaleur</Text>


      {/* 3. EXTERNAL CIRCUIT */}
      <Line points={wirePoints} color="#1e293b" lineWidth={4} />
      {/* Electric Motor / Load */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Spinning fan on motor */}
      <group position={[0, 3, 0.25]}>
        <mesh rotation={[0, 0, isPlaying ? Date.now() * 0.01 * powerLevel : 0]}>
          <boxGeometry args={[0.8, 0.1, 0.05]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
      <Text position={[0, 3.8, 0]} fontSize={0.3} color="#e2e8f0">Moteur</Text>


      {/* 4. PARTICLE SYSTEMS */}
      {/* Electrons */}
      <instancedMesh ref={electronMesh} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#facc15" />
      </instancedMesh>
      
      {/* H2 molecules */}
      <instancedMesh ref={h2Mesh} args={[undefined, undefined, 15]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </instancedMesh>

      {/* O2 molecules */}
      <instancedMesh ref={o2Mesh} args={[undefined, undefined, 15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" />
      </instancedMesh>

      {/* OH- ions */}
      <instancedMesh ref={ohMesh} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#c084fc" />
      </instancedMesh>

      {/* Water molecules */}
      <instancedMesh ref={waterMesh} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#0ea5e9" />
      </instancedMesh>
    </group>
  );
};

export default function FuelCell3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [powerLevel, setPowerLevel] = useState(1); // 1, 2, or 3

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col h-[700px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full h-[65%] border-b border-border/50 bg-gradient-to-t from-slate-950 to-[#020617]">
        <Canvas camera={{ position: [0, 1, 9], fov: 55 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <FuelCellSystem isPlaying={isPlaying} powerLevel={powerLevel} />
          <OrbitControls 
            enableZoom={true} 
            minDistance={5} 
            maxDistance={15} 
            target={[0, 0, 0]}
          />
        </Canvas>

        {/* Floating UI overlay */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-3 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Énergie Chimique → Électrique</span>
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400">
            {isPlaying ? (1.23).toFixed(2) : "0.00"} V
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">E° théorique (H₂/O₂) = 1.23 V</div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex-1 flex flex-col md:flex-row bg-slate-900/40 p-6 overflow-y-auto gap-6">
        
        {/* Playback controls */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
              Contrôle de la Pile à Combustible
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Arrêter l'injection de gaz" : "Injecter H₂ et O₂"}
            </button>
          </div>

          <div className="mt-4">
            <label className="text-xs text-muted-foreground mb-2 block">Débit des gaz (Puissance) :</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(level => (
                <button
                  key={level}
                  onClick={() => setPowerLevel(level)}
                  className={`flex-1 py-1 text-xs rounded-lg border transition-colors ${
                    powerLevel === level 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                >
                  {level === 1 ? 'Faible' : level === 2 ? 'Moyen' : 'Fort'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Explanations */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl">
            <h4 className="text-rose-400 font-bold text-sm mb-2">Anode (-) : Oxydation H₂</h4>
            <div className="font-mono text-sm text-foreground mb-2">H₂ + 2OH⁻ → 2H₂O + 2e⁻</div>
            <p className="text-xs text-muted-foreground">
              Le dihydrogène gazeux arrive à l'anode, réagit avec les ions hydroxyde (OH⁻) de l'électrolyte, forme de l'eau et libère des électrons.
            </p>
          </div>
          
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">Cathode (+) : Réduction O₂</h4>
            <div className="font-mono text-sm text-foreground mb-2">O₂ + 2H₂O + 4e⁻ → 4OH⁻</div>
            <p className="text-xs text-muted-foreground">
              Le dioxygène gazeux capte les électrons arrivant par le circuit extérieur et réagit avec l'eau pour régénérer les ions hydroxyde.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
