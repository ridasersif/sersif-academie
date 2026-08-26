"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { Battery, Play, Pause, RefreshCw, Zap } from "lucide-react";

const DaniellCellSystem = ({ isPlaying, progress }: { isPlaying: boolean, progress: number }) => {
  // progress goes from 0 (fresh cell) to 1 (dead cell)
  const electronMesh = useRef<THREE.InstancedMesh>(null);
  const saltIonsMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  // Zinc anode shrinks, Copper cathode grows
  const znScale = 1 - progress * 0.5;
  const cuScale = 1 + progress * 0.3;
  
  // Wire path for electrons: Zn(-3, 2, 0) -> Voltmeter(0, 3, 0) -> Cu(3, 2, 0)
  const wirePoints = [
    new THREE.Vector3(-3, 2.5, 0),
    new THREE.Vector3(-3, 3.5, 0),
    new THREE.Vector3(3, 3.5, 0),
    new THREE.Vector3(3, 2.5, 0)
  ];

  // Animate electrons along wire
  useFrame((state, delta) => {
    if (isPlaying && electronMesh.current) {
      const time = state.clock.elapsedTime * 1.5;
      for (let i = 0; i < 20; i++) {
        // e- moves from Zn to Cu (left to right)
        const t = (time + i / 20) % 1;
        
        let p;
        if (t < 0.2) { // up from Zn
          p = new THREE.Vector3(-3, 2.5 + (t / 0.2), 0);
        } else if (t < 0.8) { // across wire
          p = new THREE.Vector3(-3 + ((t - 0.2) / 0.6) * 6, 3.5, 0);
        } else { // down to Cu
          p = new THREE.Vector3(3, 3.5 - ((t - 0.8) / 0.2), 0);
        }

        dummy.position.copy(p);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        electronMesh.current.setMatrixAt(i, dummy.matrix);
      }
      electronMesh.current.instanceMatrix.needsUpdate = true;
    } else if (electronMesh.current && !isPlaying) {
      for (let i = 0; i < 20; i++) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        electronMesh.current.setMatrixAt(i, dummy.matrix);
      }
      electronMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* 1. ZINC HALF-CELL (Left) */}
      <group position={[-3, 0, 0]}>
        {/* Beaker */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Solution ZnSO4 (Clear) */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[1.45, 1.45, 2, 32]} />
          <meshPhysicalMaterial color="#e2e8f0" transmission={0.95} opacity={0.1} transparent />
        </mesh>
        {/* Zn Electrode */}
        <mesh position={[0, 1.5, 0]} scale={[znScale, 1, znScale]}>
          <boxGeometry args={[0.5, 3, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.4} />
        </mesh>
        <Text position={[0, -0.5, 1.6]} fontSize={0.3} color="#94a3b8">Zn(s) / Zn²⁺(aq)</Text>
        <Text position={[0, 3.2, 0]} fontSize={0.4} color="#f43f5e" anchorY="bottom">Anode (-)</Text>
      </group>

      {/* 2. COPPER HALF-CELL (Right) */}
      <group position={[3, 0, 0]}>
        {/* Beaker */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 2.5, 32]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={0.2} transparent roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* Solution CuSO4 (Blue, fades as Cu2+ is consumed) */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[1.45, 1.45, 2, 32]} />
          <meshPhysicalMaterial color="#3b82f6" transmission={0.8} opacity={0.5 * (1 - progress * 0.8)} transparent />
        </mesh>
        {/* Cu Electrode */}
        <mesh position={[0, 1.5, 0]} scale={[cuScale, 1, cuScale]}>
          <boxGeometry args={[0.5, 3, 0.2]} />
          <meshStandardMaterial color="#b45309" metalness={0.7} roughness={0.5} />
        </mesh>
        <Text position={[0, -0.5, 1.6]} fontSize={0.3} color="#60a5fa">Cu²⁺(aq) / Cu(s)</Text>
        <Text position={[0, 3.2, 0]} fontSize={0.4} color="#10b981" anchorY="bottom">Cathode (+)</Text>
      </group>

      {/* 3. SALT BRIDGE (Pont Salin) */}
      <mesh position={[0, 2.2, 0]}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([
          new THREE.Vector3(-2, 1.5, 0),
          new THREE.Vector3(-2, 2.8, 0),
          new THREE.Vector3(2, 2.8, 0),
          new THREE.Vector3(2, 1.5, 0)
        ]), 64, 0.25, 16, false]} />
        <meshPhysicalMaterial color="#fcd34d" transmission={0.8} opacity={0.6} transparent />
      </mesh>
      <Text position={[0, 3.1, 0]} fontSize={0.25} color="#fbbf24">Pont Salin (K⁺, Cl⁻)</Text>

      {/* 4. EXTERNAL CIRCUIT */}
      <Line points={wirePoints} color="#1e293b" lineWidth={4} />
      {/* Voltmeter / Bulb */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 3.5, 0.16]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Voltmeter needle (moves when active) */}
      <group position={[0, 3.3, 0.17]}>
        <mesh rotation={[0, 0, isPlaying ? -Math.PI / 4 : 0]}>
          <boxGeometry args={[0.02, 0.4, 0.01]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
      <Text position={[0, 4.2, 0]} fontSize={0.25} color="#e2e8f0">{isPlaying ? "1.10 V" : "0.00 V"}</Text>

      {/* 5. ELECTRONS */}
      <instancedMesh ref={electronMesh} args={[undefined, undefined, 20]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#facc15" />
      </instancedMesh>
    </group>
  );
};

export default function DaniellCell3DCanvas() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  // Use a simple interval to update progress
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (lastTimeRef.current != undefined && isPlaying) {
      const deltaTime = time - lastTimeRef.current;
      setProgress((prev) => {
        const next = prev + deltaTime * 0.00005; // speed of reaction
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col h-[700px]">
      
      {/* 3D CANVAS */}
      <div className="relative w-full h-[70%] border-b border-border/50 bg-gradient-to-t from-slate-950 to-[#0f172a]">
        <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <DaniellCellSystem isPlaying={isPlaying} progress={progress} />
          <OrbitControls 
            enableZoom={true} 
            minDistance={5} 
            maxDistance={15} 
            target={[0, 1.5, 0]}
          />
        </Canvas>

        {/* Floating VoltMeter reading UI */}
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-3 rounded-xl border border-border/50 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-1">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Force Électromotrice (f.e.m)</span>
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400">
            {isPlaying ? (1.10 - progress * 1.10).toFixed(2) : (progress >= 1 ? "0.00" : "1.10")} V
          </div>
          {progress >= 1 && (
            <div className="text-xs text-rose-400 mt-1 uppercase font-bold">Pile usée (Équilibre)</div>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex-1 flex flex-col md:flex-row bg-slate-900/40 p-6 overflow-y-auto gap-6">
        
        {/* Playback controls */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
              Contrôle de la Pile
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (progress >= 1) setProgress(0);
                setIsPlaying(!isPlaying);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Fermer le circuit (Pause)" : progress >= 1 ? "Relancer" : "Fermer le circuit (Démarrer)"}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setProgress(0); }}
              className="px-4 flex items-center justify-center bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1 text-muted-foreground">
              <span>Usure :</span>
              <span>{(progress * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-rose-500 h-2 rounded-full" 
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Explanations */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl">
            <h4 className="text-rose-400 font-bold text-sm mb-2">Anode (-) : Oxydation</h4>
            <div className="font-mono text-sm text-foreground mb-2">Zn(s) → Zn²⁺(aq) + 2e⁻</div>
            <p className="text-xs text-muted-foreground">
              Le Zinc métallique s'oxyde. L'électrode de zinc diminue de volume. Les électrons libérés partent dans le circuit extérieur.
            </p>
          </div>
          
          <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">Cathode (+) : Réduction</h4>
            <div className="font-mono text-sm text-foreground mb-2">Cu²⁺(aq) + 2e⁻ → Cu(s)</div>
            <p className="text-xs text-muted-foreground">
              Les ions cuivre(II) captent les électrons arrivant de l'anode. L'électrode de cuivre grossit, et la solution se décolore.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
