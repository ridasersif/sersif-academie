"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ChevronRight, ChevronLeft, Info, CheckCircle2 } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow component
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0], opacity = 1 }: any) {
  if (length <= 0.001 || opacity <= 0) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  let quaternion = new THREE.Quaternion();
  
  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }
  
  return (
    <group position={start}>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 4, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      </group>
      {label && opacity > 0.5 && (
        <Html position={[normalizedDir.x * (length + 0.1) + labelOffset[0], normalizedDir.y * (length + 0.1) + labelOffset[1], normalizedDir.z * (length + 0.1) + labelOffset[2]]} center>
          <div className="font-bold text-sm drop-shadow-md whitespace-nowrap" style={{ color, textShadow: '0px 0px 4px rgba(0,0,0,0.8)', opacity }}>
            <LatexMath math={label} />
          </div>
        </Html>
      )}
    </group>
  );
}

function DimensionLine({ start, end, label, color = "#94a3b8", offset = [0,0,0] }: any) {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  return (
    <group>
      <Line points={[start, end]} color={color} lineWidth={2} dashed dashSize={0.1} gapSize={0.05} opacity={0.6} transparent />
      <mesh position={start}><sphereGeometry args={[0.03]} /><meshBasicMaterial color={color}/></mesh>
      <mesh position={end}><sphereGeometry args={[0.03]} /><meshBasicMaterial color={color}/></mesh>
      <Html position={[mid.x + offset[0], mid.y + offset[1], mid.z + offset[2]]} center>
        <div className="text-sm font-black" style={{ color, textShadow: '0px 0px 6px rgba(0,0,0,0.9), 0px 0px 2px rgba(0,0,0,0.8)' }}>
          <LatexMath math={label} />
        </div>
      </Html>
    </group>
  );
}

const Plate = () => (
  <group>
    {/* The plate itself */}
    <Box args={[4, 0.2, 2]} position={[0, 0, 0]}>
      <meshPhysicalMaterial color="#60a5fa" transmission={0.5} thickness={0.5} roughness={0.1} metalness={0.2} transparent opacity={0.4} side={THREE.DoubleSide} />
    </Box>
    {/* Dimensions */}
    <DimensionLine start={new THREE.Vector3(-2, 0.15, 1.2)} end={new THREE.Vector3(2, 0.15, 1.2)} label="L" offset={[0, 0, 0.15]} />
    <DimensionLine start={new THREE.Vector3(2.3, 0.15, -1)} end={new THREE.Vector3(2.3, 0.15, 1)} label="a" offset={[0.15, 0, 0]} />
    <DimensionLine start={new THREE.Vector3(2.3, -0.1, 1.2)} end={new THREE.Vector3(2.3, 0.1, 1.2)} label="b" offset={[0.15, 0, 0.15]} />
  </group>
);

const AccumulatedCharges = ({ chargeSign, phase }: { chargeSign: number, phase: number }) => {
  if (phase < 2) return null;

  const signsFront = chargeSign > 0 ? "+" : "-";
  const signsBack = chargeSign > 0 ? "-" : "+";
  const colorFront = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  const colorBack = chargeSign > 0 ? "#3b82f6" : "#ef4444";

  const arr = [-1.5, -0.5, 0.5, 1.5];
  
  return (
    <group>
      {arr.map((x, i) => (
        <group key={i}>
          {/* Front Edge (+Z) */}
          <Html position={[x, 0.15, 1.0]} center zIndexRange={[100, 0]}>
            <div className="font-bold text-xl drop-shadow-lg" style={{ color: colorFront }}>{signsFront}</div>
          </Html>
          {/* Back Edge (-Z) */}
          <Html position={[x, 0.15, -1.0]} center zIndexRange={[100, 0]}>
            <div className="font-bold text-xl drop-shadow-lg" style={{ color: colorBack }}>{signsBack}</div>
          </Html>
        </group>
      ))}
    </group>
  );
};

const Carriers = ({ chargeSign, phase }: { chargeSign: number, phase: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      const startX = (Math.random() - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 0.8; 
      temp.push({ x: startX, y: 0, z: startZ });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const speed = chargeSign > 0 ? 1.5 : -1.5; 
    let driftZ = phase === 1 ? 1.0 : 0; 
    
    particles.forEach((p, i) => {
      p.x += speed * delta;
      
      if (phase === 1) {
        if (p.z < 0.9 && p.z > -0.9) p.z += driftZ * delta;
      } else if (phase === 2) {
        p.z = THREE.MathUtils.lerp(p.z, (Math.random() - 0.5) * 0.4, 0.05);
      } else {
        p.z = THREE.MathUtils.lerp(p.z, (Math.random() - 0.5) * 1.5, 0.02);
      }

      if (chargeSign > 0 && p.x > 2.2) { p.x = -2.2; p.z = (Math.random() - 0.5) * 1.5; }
      if (chargeSign < 0 && p.x < -2.2) { p.x = 2.2; p.z = (Math.random() - 0.5) * 1.5; }
      
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      if (mesh.current) mesh.current.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  const color = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  
  return (
    <instancedMesh ref={mesh} args={[null as any, null as any, 30]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
    </instancedMesh>
  );
};

const HeroCharge = ({ chargeSign, phase }: { chargeSign: number, phase: number }) => {
  const color = chargeSign > 0 ? "#ef4444" : "#3b82f6";
  // Text instead of LaTeX to avoid wrapping issues in small boxes
  const mathLabel = chargeSign > 0 ? "q > 0" : "q < 0";
  const vDir = chargeSign > 0 ? 1 : -1; 
  
  return (
    <group position={[0, 0.4, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.25, 0]} center zIndexRange={[100, 0]}>
        <div className="font-black text-[13px] text-white whitespace-nowrap" style={{ textShadow: '0px 0px 6px rgba(0,0,0,1), 0px 0px 3px rgba(0,0,0,0.8)' }}>
          {mathLabel}
        </div>
      </Html>
      
      {/* Vitesse v */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(vDir,0,0)} length={0.8} color={color} thickness={0.02} label="\vec{v}" labelOffset={[0, 0.2, 0]} opacity={1} />
      
      {/* Force Magnétique Fm */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,1)} length={1.2} color="#f97316" thickness={0.02} label="\vec{F}_m" labelOffset={[0, 0.15, 0]} opacity={phase >= 1 ? 1 : 0} />
      
      {/* Force Electrique Fe */}
      <Arrow start={new THREE.Vector3(0,0,0)} dir={new THREE.Vector3(0,0,-1)} length={1.2} color="#eab308" thickness={0.02} label="\vec{F}_e" labelOffset={[0, 0.15, 0]} opacity={phase === 2 ? 1 : 0} />
    </group>
  );
};

// Repère (x, y, z)
const AxesBase = () => {
  // Placé en bas à gauche pour ne pas gêner
  const origin = new THREE.Vector3(-3.5, -0.8, 1.5);
  
  return (
    <group>
      <mesh position={origin}>
        <sphereGeometry args={[0.04]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Axe x : direction du courant (ThreeJS +X) */}
      <Arrow start={origin} dir={new THREE.Vector3(1, 0, 0)} length={1} color="#ef4444" thickness={0.012} label="x" labelOffset={[0.2, 0, 0]} opacity={0.8} />
      
      {/* Axe y : vers l'intérieur (ThreeJS -Z) */}
      <Arrow start={origin} dir={new THREE.Vector3(0, 0, -1)} length={1} color="#22c55e" thickness={0.012} label="y" labelOffset={[0, 0, -0.2]} opacity={0.8} />
      
      {/* Axe z : vertical (ThreeJS +Y) */}
      <Arrow start={origin} dir={new THREE.Vector3(0, 1, 0)} length={1} color="#3b82f6" thickness={0.012} label="z" labelOffset={[0, 0.2, 0]} opacity={0.8} />
    </group>
  );
};

export default function HallEffect3DCanvas() {
  const [chargeSign, setChargeSign] = useState(-1);
  const [phase, setPhase] = useState(0); 
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const nextPhase = () => setPhase(p => Math.min(2, p + 1));
  const prevPhase = () => setPhase(p => Math.max(0, p - 1));

  return (
    <div className="w-full flex flex-col gap-4 font-sans max-w-[1200px] mx-auto">
      
      {/* Main Layout: Left Results/Explanation, Right 3D Canvas */}
      <div className="flex flex-col lg:flex-row bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl" ref={canvasContainerRef}>
        
        {/* LEFT PANEL: EXPLANATIONS & RESULTS */}
        <div className="w-full lg:w-[40%] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/40">
          
          <div className="p-3 flex-1 flex flex-col gap-3 justify-center">
            {/* Phase Title */}
            <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl shadow-md">
              <h3 className="text-orange-400 font-black text-base mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Étape {phase + 1}/3
              </h3>
              
              {/* Dynamic Text based on Phase */}
              {phase === 0 && (
                <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-white">Le Courant Électrique Seul</p>
                  <p>Le courant <LatexMath math="\vec{I}" /> circule. Les porteurs (vitesse <LatexMath math="\vec{v}" />) vont tout droit.</p>
                  <div className="bg-black/30 p-1.5 rounded mt-1 border border-slate-700/50">
                    <LatexMath math="\vec{F}_m = \vec{0}" /> (Aucun champ magnétique)
                  </div>
                </div>
              )}
              
              {phase === 1 && (
                <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-white">Application de <LatexMath math="\vec{B}" /></p>
                  <p>La force <LatexMath math="\vec{F}_m = q(\vec{v} \wedge \vec{B})" /> dévie les charges vers le bord.</p>
                  <div className="bg-orange-500/10 p-1.5 rounded mt-1 border border-orange-500/30 text-orange-200">
                    <LatexMath math="\vec{F}_m" /> pointe <strong>toujours</strong> du même côté, peu importe <LatexMath math="q" /> !
                  </div>
                </div>
              )}

              {phase === 2 && (
                <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-emerald-400">Régime Permanent</p>
                  <p>L'accumulation crée un champ de Hall <LatexMath math="\vec{E}_H" />.</p>
                  <p><LatexMath math="\vec{F}_e = q\vec{E}_H" /> compense <LatexMath math="\vec{F}_m" />. Les charges filent droit.</p>
                  <div className="bg-emerald-500/10 p-1.5 rounded mt-1 border border-emerald-500/30 flex justify-center text-emerald-300 font-bold">
                    <LatexMath math="\vec{E}_H = - (\vec{v} \wedge \vec{B})" />
                  </div>
                </div>
              )}
            </div>

            {/* Hall Voltage Results Container */}
            <div className={`transition-all duration-500 overflow-hidden ${phase === 2 ? 'opacity-100 max-h-[250px]' : 'opacity-30 max-h-[60px] pointer-events-none grayscale'}`}>
              <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl shadow-md h-full flex flex-col">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest border-b border-slate-700 pb-1.5 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tension de Hall
                </h4>
                
                <div className="flex flex-col gap-1.5 mb-2">
                  <div className="flex justify-between items-center bg-slate-900/50 px-2 py-1.5 rounded">
                    <span className="text-[11px] text-slate-400">Face Avant (y-)</span>
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded ${chargeSign > 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {chargeSign > 0 ? '+' : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 px-2 py-1.5 rounded">
                    <span className="text-[11px] text-slate-400">Face Arrière (y+)</span>
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded ${chargeSign > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {chargeSign > 0 ? '-' : '+'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-black/40 p-2 rounded-lg border border-slate-700 flex flex-col items-center justify-center flex-1">
                  <span className="text-white font-bold text-base drop-shadow-md"><LatexMath math="U_H = \frac{I B}{n q b}" /></span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: 3D CANVAS */}
        <div className="w-full lg:w-[60%] h-[300px] lg:h-[380px] relative">
          <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [5, 6, 8], fov: 35 }} className="w-full h-full">
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <Environment preset="city" />
            <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} autoRotate={false} />
            
            <AxesBase />

            <group position={[0, -0.2, 0]}>
              <Plate />
              <AccumulatedCharges chargeSign={chargeSign} phase={phase} />
              <Carriers chargeSign={chargeSign} phase={phase} />
              <HeroCharge chargeSign={chargeSign} phase={phase} />
              
              {/* Champ Magnétique B */}
              <Arrow start={new THREE.Vector3(0, -1.5, 0)} dir={new THREE.Vector3(0,1,0)} length={3} color="#10b981" thickness={0.02} label="\vec{B}" labelOffset={[0.2, 0, 0]} opacity={phase >= 1 ? 1 : 0} />

              {/* Courant I */}
              <Arrow start={new THREE.Vector3(-3.5, 0.2, 0)} dir={new THREE.Vector3(1,0,0)} length={1.5} color="#facc15" thickness={0.04} label="\vec{I}" labelOffset={[0, 0.3, 0]} opacity={1} />

              {/* Champ de Hall E_H */}
              <Arrow 
                start={new THREE.Vector3(0, 1.2, chargeSign * 1.2)} 
                dir={new THREE.Vector3(0, 0, chargeSign * -1)} 
                length={2.4} 
                color="#a855f7" 
                thickness={0.015} 
                label="\vec{E}_H" 
                labelOffset={[0, 0.2, 0]} 
                opacity={phase === 2 ? 1 : (phase === 1 ? 0.3 : 0)}
              />
            </group>
            
            <ContactShadows resolution={256} scale={15} blur={2.5} opacity={0.8} far={5} color="#000000" position={[0, -1.5, 0]} />
          </Canvas>
        </div>

      </div>

      {/* BOTTOM PANEL: CONTROLS */}
      <div className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3 flex-wrap shadow-lg">
        
        {/* Step Navigation */}
        <div className="flex gap-2">
          <button 
            onClick={prevPhase}
            disabled={phase === 0}
            className={`px-3 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-sm transition-all ${phase === 0 ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600 shadow-sm'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          
          <button 
            onClick={nextPhase}
            disabled={phase === 2}
            className={`px-4 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-sm transition-all ${phase === 2 ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-orange-600 border-orange-500 text-white hover:bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.3)]'}`}
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Porteurs de charge toggle */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider hidden sm:block">Porteurs :</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
            <button 
              onClick={() => setChargeSign(-1)}
              className={`px-4 py-1.5 text-sm font-black rounded-md transition-all ${chargeSign === -1 ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "text-slate-500 hover:text-slate-300"}`}
            >
              Électrons (<LatexMath math="q < 0" />)
            </button>
            <button 
              onClick={() => setChargeSign(1)}
              className={`px-4 py-1.5 text-sm font-black rounded-md transition-all ${chargeSign === 1 ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-slate-500 hover:text-slate-300"}`}
            >
              Trous (<LatexMath math="q > 0" />)
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
