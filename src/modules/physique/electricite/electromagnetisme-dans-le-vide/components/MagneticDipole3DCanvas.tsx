"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, ContactShadows, Environment, Line } from "@react-three/drei";
import * as THREE from "three";
import { Settings, Eye, EyeOff } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Arrow helper component
function Arrow({ start, dir, length, color, thickness = 0.05, label, labelOffset = [0, 0, 0] }: { start: THREE.Vector3, dir: THREE.Vector3, length: number, color: string, thickness?: number, label?: string, labelOffset?: [number, number, number] }) {
  const normalizedDir = dir.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDir);
  
  return (
    <group position={start}>
      <group quaternion={quaternion}>
        {/* Cylinder (shaft) */}
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        {/* Cone (head) */}
        <mesh position={[0, length + thickness*2, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 5, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
      {label && (
        <Html position={[normalizedDir.x * (length + 0.5) + labelOffset[0], normalizedDir.y * (length + 0.5) + labelOffset[1], normalizedDir.z * (length + 0.5) + labelOffset[2]]} center>
          <div className="font-bold text-sm drop-shadow-md whitespace-nowrap" style={{ color }}>
            <LatexMath math={label} />
          </div>
        </Html>
      )}
    </group>
  );
}

// Dashed line helper
function DashedLine({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  return <Line points={[start, end]} color={color} dashed dashSize={0.2} gapSize={0.1} lineWidth={1} />;
}

// Draw the angle arc for theta
function AngleArc({ radius, theta, color }: { radius: number, theta: number, color: string }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 24;
    // from Y axis (theta=0) down to theta
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * theta;
      pts.push(new THREE.Vector3(radius * Math.sin(t), radius * Math.cos(t), 0));
    }
    return pts;
  }, [radius, theta]);

  return (
    <group>
      <Line points={points} color={color} lineWidth={2} />
      <Html position={[radius * 1.2 * Math.sin(theta/2), radius * 1.2 * Math.cos(theta/2), 0]} center>
        <span className="text-orange-400 font-bold"><LatexMath math="\theta" /></span>
      </Html>
    </group>
  );
}

export default function MagneticDipole3DCanvas() {
  const [r, setR] = useState(3.0);
  const [thetaDeg, setThetaDeg] = useState(60);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [showBasis, setShowBasis] = useState(true);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate coordinates and vectors
  const theta = (thetaDeg * Math.PI) / 180;
  
  // Point M (in XY plane, Z=0 for visualization)
  const M = new THREE.Vector3(r * Math.sin(theta), r * Math.cos(theta), 0);
  const origin = new THREE.Vector3(0, 0, 0);
  
  // Local basis vectors
  const ur = new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0);
  const utheta = new THREE.Vector3(Math.cos(theta), -Math.sin(theta), 0);
  const uphi = new THREE.Vector3(0, 0, -1);
  
  // Dipole moment m (along Y axis)
  const mVector = new THREE.Vector3(0, 1, 0);
  
  // Vector A = (mu0 m sin(theta) / 4 pi r^2) u_phi
  // For visualization, we scale the vectors so they are visible
  const A_mag = (Math.sin(theta) / (r * r)) * 15; // arbitrary scaling factor
  const A_vec = uphi.clone().multiplyScalar(A_mag);
  
  // Vector B = (mu0 m / 4 pi r^3) (2 cos(theta) u_r + sin(theta) u_theta)
  const B_r = (2 * Math.cos(theta)) / (r * r * r);
  const B_theta = Math.sin(theta) / (r * r * r);
  const B_mag_factor = 25; // arbitrary scaling factor
  const B_vec = ur.clone().multiplyScalar(B_r * B_mag_factor).add(utheta.clone().multiplyScalar(B_theta * B_mag_factor));

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      <div ref={canvasContainerRef} className="w-full max-w-[900px] mx-auto h-[280px] sm:h-[360px] bg-[#020617] rounded-2xl overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-slate-800">
        
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-700/50 pb-1 mb-1">Vecteurs</span>
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-yellow-400 rounded-full" /><span className="text-yellow-400 font-bold text-[11px]"><LatexMath math="\vec{m}" /> (Moment)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-cyan-400 rounded-full" /><span className="text-cyan-400 font-bold text-[11px]"><LatexMath math="\vec{A}" /> (Potentiel)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-pink-500 rounded-full" /><span className="text-pink-500 font-bold text-[11px]"><LatexMath math="\vec{B}" /> (Champ)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-white rounded-full opacity-50" /><span className="text-slate-300 font-bold text-[11px]"><LatexMath math="\vec{r}" /> (Position)</span></div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [7, 4.5, 7], fov: 45 }} className="w-full h-full">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} target={[0, 0, 0]} />
          
          {/* Axis references (dimmed) */}
          <gridHelper args={[10, 10, "#1e293b", "#0f172a"]} position={[0, -2, 0]} />
          
          <group>
            {/* Current loop (Spire in XZ plane) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.8, 0.04, 16, 64]} />
              <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.5} />
            </mesh>
            {/* Current direction indicator */}
            <mesh position={[0.8, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.1, 0.3, 16]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
            <Html position={[1.1, 0, 0]} center><span className="text-blue-400 font-bold text-sm">I</span></Html>
            
            {/* Magnetic Moment Vector m */}
            <Arrow start={origin} dir={mVector} length={1.5} color="#facc15" label="\vec{m}" thickness={0.04} />
            
            {/* Position Vector r */}
            <DashedLine start={origin} end={M} color="#cbd5e1" />
            
            {/* Angle theta arc */}
            {r > 1 && thetaDeg > 5 && (
              <AngleArc radius={1.2} theta={theta} color="#fb923c" />
            )}
            
            {/* Point M */}
            <mesh position={M}>
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Html position={[M.x + 0.2, M.y + 0.2, M.z]} center>
              <div className="font-bold text-slate-200 drop-shadow-md">M</div>
            </Html>

            {/* Local Basis at M */}
            {showBasis && (
              <group>
                <Arrow start={M} dir={ur} length={1} color="#64748b" label="\vec{u}_r" thickness={0.02} labelOffset={[0.1, 0.1, 0]} />
                <Arrow start={M} dir={utheta} length={1} color="#64748b" label="\vec{u}_\theta" thickness={0.02} labelOffset={[0.1, -0.1, 0]} />
              </group>
            )}

            {/* Vector A */}
            {showA && A_mag > 0.01 && (
              <Arrow start={M} dir={uphi} length={A_mag} color="#22d3ee" label="\vec{A}" thickness={0.02} />
            )}

            {/* Vector B */}
            {showB && B_vec.length() > 0.01 && (
              <Arrow start={M} dir={B_vec} length={B_vec.length()} color="#ec4899" label="\vec{B}" thickness={0.025} />
            )}
            
          </group>
        </Canvas>
      </div>

      {/* External Controls */}
      <div className="w-full max-w-[900px] mx-auto bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex flex-col sm:flex-row gap-6 items-center justify-between shadow-sm">
        
        {/* Sliders */}
        <div className="flex-1 w-full flex gap-4 sm:gap-6 items-center flex-col sm:flex-row">
           <div className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-blue-400" /> Distance <LatexMath math="r" /></span>
                <span className="text-blue-400">{r.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="1.5" max="5" step="0.1" value={r} onChange={(e) => setR(Number(e.target.value))} 
                className="w-full accent-blue-500 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #3b82f6 ${((r - 1.5) / 3.5) * 100}%, #1e293b ${((r - 1.5) / 3.5) * 100}%)` }}
              />
            </div>
            
            <div className="w-full flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-orange-400" /> Angle <LatexMath math="\theta" /></span>
                <span className="text-orange-400">{thetaDeg}°</span>
              </div>
              <input 
                type="range" min="0" max="180" step="1" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} 
                className="w-full accent-orange-500 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #f97316 ${(thetaDeg / 180) * 100}%, #1e293b ${(thetaDeg / 180) * 100}%)` }}
              />
            </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 shrink-0 flex-wrap justify-center">
            <button onClick={() => setShowA(!showA)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm ${showA ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'}`}>
              {showA ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} <LatexMath math="\vec{A}" />
            </button>
            <button onClick={() => setShowB(!showB)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm ${showB ? 'bg-pink-500/20 text-pink-400 border-pink-500/40 hover:bg-pink-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'}`}>
              {showB ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} <LatexMath math="\vec{B}" />
            </button>
            <button onClick={() => setShowBasis(!showBasis)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm ${showBasis ? 'bg-slate-700 text-slate-200 border-slate-500 hover:bg-slate-600' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'}`}>
              {showBasis ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} Base
            </button>
        </div>

      </div>
      
      {/* Explications dynamiques en bas */}
      <div className="w-full max-w-[900px] mx-auto bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl flex flex-col gap-2">
        <h3 className="text-slate-200 font-bold text-sm flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" /> Observation des champs au point M
        </h3>
        <div className="text-xs text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="mb-2"><strong className="text-cyan-400">Le Potentiel Vecteur <LatexMath math="\vec{A}" /></strong> est orienté selon <LatexMath math="\vec{u}_\phi" /> (perpendiculaire au plan <LatexMath math="(\vec{u}_r, \vec{u}_\theta)" />).</p>
            <p>Sa norme est maximale pour <LatexMath math="\theta = 90^\circ" /> (dans le plan de la spire) et nulle sur l'axe (<LatexMath math="\theta = 0^\circ" /> ou <LatexMath math="180^\circ" />).</p>
          </div>
          <div>
            <p className="mb-2"><strong className="text-pink-400">Le Champ Magnétique <LatexMath math="\vec{B}" /></strong> appartient au plan méridien <LatexMath math="(\vec{u}_r, \vec{u}_\theta)" />.</p>
            <p>Sur l'axe (<LatexMath math="\theta = 0^\circ" />), il est purement radial (<LatexMath math="B_\theta = 0" />). Dans le plan équatorial (<LatexMath math="\theta = 90^\circ" />), il est purement orthoradial (<LatexMath math="B_r = 0" />).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
