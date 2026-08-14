"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Activity } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow component reused for vectors
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0] }: { start: THREE.Vector3, dir: THREE.Vector3, length: number, color: string, thickness?: number, label?: string, labelOffset?: [number, number, number] }) {
  if (length <= 0.001) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  
  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) {
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    }
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }
  
  return (
    <group position={start}>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 4, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      {label && (
        <Html position={[normalizedDir.x * (length + 0.1) + labelOffset[0], normalizedDir.y * (length + 0.1) + labelOffset[1], normalizedDir.z * (length + 0.1) + labelOffset[2]]} center>
          <div className="font-bold text-sm drop-shadow-md whitespace-nowrap" style={{ color, textShadow: '0px 0px 4px rgba(0,0,0,0.8)' }}>
            <LatexMath math={label} />
          </div>
        </Html>
      )}
    </group>
  );
}

function DimensionLine({ start, end, label, color = "#94a3b8", offset = [0,0,0] }: { start: THREE.Vector3, end: THREE.Vector3, label: string, color?: string, offset?: [number,number,number] }) {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  return (
    <group>
      <Line points={[start, end]} color={color} lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
      {/* Tick marks */}
      <mesh position={start}><sphereGeometry args={[0.03]} /><meshBasicMaterial color={color}/></mesh>
      <mesh position={end}><sphereGeometry args={[0.03]} /><meshBasicMaterial color={color}/></mesh>
      <Html position={[mid.x + offset[0], mid.y + offset[1], mid.z + offset[2]]} center>
        <div className="text-xs font-bold px-1 rounded" style={{ color, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <LatexMath math={label} />
        </div>
      </Html>
    </group>
  );
}

const Plate = () => (
  <group>
    <Box args={[4, 0.2, 2]} position={[0, 0, 0]}>
      {/* Rendu de la plaque plus visible */}
      <meshPhysicalMaterial color="#93c5fd" transmission={0.2} thickness={0.5} roughness={0.2} metalness={0.5} transparent opacity={0.6} side={THREE.DoubleSide} />
    </Box>
    {/* Dimensions */}
    {/* Longueur L */}
    <DimensionLine start={new THREE.Vector3(-2, -0.3, 1.2)} end={new THREE.Vector3(2, -0.3, 1.2)} label="L" offset={[0, -0.1, 0]} />
    {/* Largeur a */}
    <DimensionLine start={new THREE.Vector3(-2.2, 0, -1)} end={new THREE.Vector3(-2.2, 0, 1)} label="a" offset={[-0.2, 0, 0]} />
    {/* Epaisseur b */}
    <DimensionLine start={new THREE.Vector3(2.2, -0.1, 1)} end={new THREE.Vector3(2.2, 0.1, 1)} label="b" offset={[0.2, 0, 0]} />
  </group>
);

const Carriers = ({ chargeSign, isPlaying }: { chargeSign: number, isPlaying: boolean }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      const startX = (Math.random() - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 1.5;
      temp.push({ x: startX, y: 0, z: startZ, offset: Math.random() * 10 });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const speed = chargeSign > 0 ? 1.5 : -1.5; 
    const driftZ = 0.5; 
    
    particles.forEach((p, i) => {
      if (isPlaying) {
        p.x += speed * delta;
        if (p.z < 0.8) p.z += driftZ * delta;
        if (chargeSign > 0 && p.x > 2.2) { p.x = -2.2; p.z = (Math.random() - 0.5) * 1.5; }
        if (chargeSign < 0 && p.x < -2.2) { p.x = 2.2; p.z = (Math.random() - 0.5) * 1.5; }
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      if (mesh.current) mesh.current.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  const color = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  
  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, 40]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
    </instancedMesh>
  );
};

// A central "hero" charge to explain forces clearly
const HeroCharge = ({ chargeSign }: { chargeSign: number }) => {
  const color = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  const label = chargeSign > 0 ? "q > 0" : "q < 0";
  const vDir = chargeSign > 0 ? 1 : -1; // Vitesse
  
  return (
    <group position={[0, 0.4, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.25, 0]} center>
        <div className="font-bold text-[10px] bg-black/60 px-1 rounded text-white">{label}</div>
      </Html>
      
      {/* Vitesse v */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(vDir,0,0)} length={1} color={color} thickness={0.02} label="\vec{v}" labelOffset={[0, 0.2, 0]} />
      
      {/* Force Magnétique Fm = q(v x B). B est vers +Y (0,1,0). 
          Si q>0, v=(1,0,0), B=(0,1,0) -> v x B = (0,0,1). q(v x B) = (0,0,1) (+Z)
          Si q<0, v=(-1,0,0), B=(0,1,0) -> v x B = (0,0,-1). q(v x B) = (0,0,1) (+Z)
          Donc Fm est TOUJOURS vers +Z ! */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,1)} length={1.2} color="#f97316" thickness={0.02} label="\vec{F}_m" labelOffset={[0, 0.2, 0]} />
      
      {/* Force Electrique Fe = q*Eh. Eh compense Fm en régime permanent, donc Fe est opposée à Fm. 
          Fm vers +Z, donc Fe doit être vers -Z. 
          Fe = q*Eh -> Si q>0, Eh est vers -Z. Si q<0, Eh est vers +Z. */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,-1)} length={1.2} color="#eab308" thickness={0.02} label="\vec{F}_e" labelOffset={[0, 0.2, 0]} />
    </group>
  );
};

export default function HallEffect3DCanvas() {
  const [chargeSign, setChargeSign] = useState(-1); // -1: électrons, 1: trous
  const [isPlaying, setIsPlaying] = useState(true);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[800px] mx-auto h-[350px] sm:h-[450px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800">
        
        {/* HUD Explanatory */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-lg flex flex-col gap-3 min-w-[180px]">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-700 pb-1">Tension de Hall</span>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Face Avant (Z+) :</span>
                <span className={`text-sm font-black ${chargeSign > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {chargeSign > 0 ? '+' : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Face Arrière (Z-) :</span>
                <span className={`text-sm font-black ${chargeSign > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {chargeSign > 0 ? '-' : '+'}
                </span>
              </div>
            </div>
            <div className="bg-black/30 p-2 rounded-lg mt-1 border border-slate-800 flex flex-col gap-1 items-center justify-center">
              <span className="text-emerald-400 font-bold text-xs">Régime permanent :</span>
              <span className="text-yellow-400 font-black text-sm"><LatexMath math="\vec{F}_m + \vec{F}_e = \vec{0}" /></span>
              <span className="text-white font-bold text-xs mt-1"><LatexMath math="U_H = \frac{I B}{n q b}" /></span>
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [2, 5, 7], fov: 40 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} autoRotate autoRotateSpeed={0.3} />
          
          <group position={[0, -0.5, 0]}>
            <Plate />
            <Carriers chargeSign={chargeSign} isPlaying={isPlaying} />
            <HeroCharge chargeSign={chargeSign} />
            
            {/* Champ Magnétique B (vers le haut +Y) */}
            <Arrow start={new THREE.Vector3(0, -2, 0)} dir={new THREE.Vector3(0,1,0)} length={4} color="#10b981" thickness={0.02} label="\vec{B}" labelOffset={[0.2, 0, 0]} />

            {/* Courant I (vers la droite +X) */}
            <Arrow start={new THREE.Vector3(-3.5, 0, 0)} dir={new THREE.Vector3(1,0,0)} length={1.5} color="#facc15" thickness={0.04} label="\vec{I}" labelOffset={[0, 0.3, 0]} />

            {/* Champ de Hall E_H */}
            {/* Si q > 0, E_H va de +Z vers -Z */}
            {/* Si q < 0, E_H va de -Z vers +Z */}
            <Arrow 
              start={new THREE.Vector3(0, 0.8, chargeSign * 1.5)} 
              dir={new THREE.Vector3(0, 0, chargeSign * -1)} 
              length={3} 
              color="#a855f7" 
              thickness={0.015} 
              label="\vec{E}_H" 
              labelOffset={[0, 0.3, 0]} 
            />
          </group>
          
          <ContactShadows resolution={256} scale={15} blur={2.5} opacity={0.6} far={5} color="#000000" position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      <div className="w-full max-w-[800px] mx-auto bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setChargeSign(-1)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${chargeSign === -1 ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Électrons (<LatexMath math="q < 0" />)
          </button>
          <button 
            onClick={() => setChargeSign(1)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${chargeSign === 1 ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Trous (<LatexMath math="q > 0" />)
          </button>
        </div>
        
        <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors font-bold text-sm">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
