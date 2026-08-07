"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Cylinder, Sphere, Cone, Torus, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpDown, RotateCw, AlertTriangle, CheckCircle2 } from "lucide-react";

type ShapeType = "fil" | "cylindre" | "solenoide" | "cercle" | "sphere" | "demi_sphere" | "cone" | "double_cone" | "tore_circulaire" | "tore_carre" | "plan";

const shapesList: { id: ShapeType; label: string; activeColor: string; inactiveColor: string }[] = [
  { id: "fil", label: "Fil Infini", activeColor: "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]", inactiveColor: "bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20" },
  { id: "cylindre", label: "Cylindre", activeColor: "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]", inactiveColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20" },
  { id: "plan", label: "Plan", activeColor: "bg-lime-500 text-white border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.5)]", inactiveColor: "bg-lime-500/10 text-lime-300 border-lime-500/30 hover:bg-lime-500/20" },
  { id: "cone", label: "Cône (Axial)", activeColor: "bg-pink-500 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]", inactiveColor: "bg-pink-500/10 text-pink-300 border-pink-500/30 hover:bg-pink-500/20" },
  { id: "tore_circulaire", label: "Tore Circulaire", activeColor: "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]", inactiveColor: "bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20" },
  { id: "tore_carre", label: "Tore Carré", activeColor: "bg-yellow-500 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]", inactiveColor: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20" },
  { id: "solenoide", label: "Bobine", activeColor: "bg-teal-500 text-white border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)]", inactiveColor: "bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20" },
  { id: "cercle", label: "Spire", activeColor: "bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]", inactiveColor: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/20" },
  { id: "sphere", label: "Sphère", activeColor: "bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]", inactiveColor: "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20" },
  { id: "demi_sphere", label: "Demi-Sphère", activeColor: "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]", inactiveColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20" },
  { id: "double_cone", label: "Double Cône", activeColor: "bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]", inactiveColor: "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20" },
];

const Basis3D = ({ position, type }: { position: [number, number, number], type: "cylindrical" | "cartesian" }) => {
  const isCyl = type === "cylindrical";
  return (
    <group position={position}>
       <Line points={[[0,0,0], [1.5, 0, 0]]} color="#ef4444" lineWidth={2} transparent opacity={0.5} />
       <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}><coneGeometry args={[0.04, 0.15, 8]}/><meshBasicMaterial color="#ef4444" transparent opacity={0.7} /></mesh>
       <Html position={[1.7, 0, 0]} center><div className="text-red-400/90 text-[12px] font-bold font-serif italic">e<sub>{isCyl ? 'r' : 'x'}</sub></div></Html>

       <Line points={[[0,0,0], [0, 1.5, 0]]} color="#22c55e" lineWidth={2} transparent opacity={0.5} />
       <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.04, 0.15, 8]}/><meshBasicMaterial color="#22c55e" transparent opacity={0.7} /></mesh>
       <Html position={[0, 1.7, 0]} center><div className="text-green-400/90 text-[12px] font-bold font-serif italic">e<sub>{isCyl ? 'z' : 'y'}</sub></div></Html>

       <Line points={[[0,0,0], isCyl ? [0, 0, -1.5] : [0, 0, 1.5]]} color="#3b82f6" lineWidth={2} transparent opacity={0.5} />
       <mesh position={isCyl ? [0, 0, -1.5] : [0, 0, 1.5]} rotation={isCyl ? [-Math.PI/2, 0, 0] : [Math.PI/2, 0, 0]}>
         <coneGeometry args={[0.04, 0.15, 8]}/>
         <meshBasicMaterial color="#3b82f6" transparent opacity={0.7}/>
       </mesh>
       <Html position={isCyl ? [0, 0, -1.7] : [0, 0, 1.7]} center>
         <div className="text-blue-400/90 text-[12px] font-bold font-serif italic">e<sub>{isCyl ? 'θ' : 'z'}</sub></div>
       </Html>
    </group>
  );
};

const AnimatedPointM = ({ mode, shape, isValid }: { mode: "translation" | "rotation", shape: ShapeType, isValid: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const mPos = useMemo(() => {
    if (shape === "fil" || shape === "cylindre") return [3, 0, 0];
    if (shape === "cone") return [3.5, 0, 0];
    if (shape === "tore_circulaire" || shape === "tore_carre") return [3, 0, 0];
    if (shape === "plan") return [2, 0, 0];
    if (shape === "solenoide") return [1.2, 0, 0];
    return [2.5, 2, 0];
  }, [shape]);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!isValid) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }
    const t = state.clock.getElapsedTime();
    
    if (mode === "translation") {
      const y = Math.sin(t * 2) * 1.5;
      groupRef.current.position.set(0, y, 0);
      groupRef.current.rotation.set(0, 0, 0);
    } else {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, t * 1.5, 0);
    }
  });

  let bVector = null;
  if (shape === "fil" || shape === "cylindre" || shape === "cone" || shape === "tore_circulaire" || shape === "tore_carre") {
    bVector = (
      <group position={[mPos[0], mPos[1], mPos[2]]}>
        <Line points={[[0, 0, 0], [0, 0, -2.5]]} color="#10b981" lineWidth={4} />
        <mesh position={[0, 0, -2.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
        <Html position={[0, 0, -3]} center><div className="text-emerald-400 font-bold drop-shadow-md">B</div></Html>
      </group>
    );
  } else if (shape === "plan") {
    bVector = (
      <group position={[mPos[0], mPos[1], mPos[2]]}>
        <Line points={[[0, 0, 0], [0, 0, 2.5]]} color="#10b981" lineWidth={4} />
        <mesh position={[0, 0, 2.5]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
        <Html position={[0, 0, 3]} center><div className="text-emerald-400 font-bold drop-shadow-md">B</div></Html>
      </group>
    );
  } else if (shape === "solenoide") {
    bVector = (
      <group position={[mPos[0], mPos[1], mPos[2]]}>
        <Line points={[[0, 0, 0], [0, 2.5, 0]]} color="#10b981" lineWidth={4} />
        <mesh position={[0, 2.5, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
        <Html position={[0, 3, 0]} center><div className="text-emerald-400 font-bold drop-shadow-md">B</div></Html>
      </group>
    );
  } else {
    bVector = (
      <group position={[mPos[0], mPos[1], mPos[2]]}>
        <Line points={[[0, 0, 0], [0.5, 2, 0]]} color="#10b981" lineWidth={4} />
        <mesh position={[0.5, 2, 0]} rotation={[0, 0, -Math.atan2(0.5, 2)]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
        <Html position={[0.6, 2.4, 0]} center><div className="text-emerald-400 font-bold drop-shadow-md">B</div></Html>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
       <Basis3D position={[mPos[0], mPos[1], mPos[2]]} type={shape === "plan" ? "cartesian" : "cylindrical"} />
       <Sphere args={[0.15, 32, 32]} position={[mPos[0], mPos[1], mPos[2]]}>
          <meshStandardMaterial color={isValid ? "#f59e0b" : "#ef4444"} emissive={isValid ? "#d97706" : "#b91c1c"} emissiveIntensity={0.5} />
          <Html position={[0.3, 0.3, 0]} center><div className={`${isValid ? 'text-amber-400' : 'text-red-400'} font-bold text-sm drop-shadow-md`}>M</div></Html>
       </Sphere>
       {bVector}
       {shape !== "plan" && isValid && mode === "rotation" && (
         <group>
           <Line points={[[0, mPos[1], 0], [mPos[0], mPos[1], 0]]} color="#94a3b8" lineWidth={2} transparent opacity={0.3} dashed dashSize={0.2} gapSize={0.1} />
           {mPos[1] !== 0 && (
              <Line points={[[0, 0, 0], [0, mPos[1], 0]]} color="#94a3b8" lineWidth={2} transparent opacity={0.3} dashed dashSize={0.2} gapSize={0.1} />
           )}
         </group>
       )}
    </group>
  );
};

export default function Invariance3DCanvas() {
  const [shape, setShape] = useState<ShapeType>("fil");
  const [mode, setMode] = useState<"translation" | "rotation">("rotation");

  const supportsTranslation = ["fil", "cylindre", "solenoide", "plan"].includes(shape);
  const supportsRotation = shape !== "plan";

  const isValid = mode === "translation" ? supportsTranslation : supportsRotation;

  useEffect(() => {
    if (shape === "plan" && mode === "rotation") setMode("translation");
    else if (!supportsTranslation && mode === "translation") setMode("rotation");
  }, [shape, supportsTranslation, mode]);

  const toreCarrePoints = useMemo(() => [
    new THREE.Vector2(2, -1),
    new THREE.Vector2(4, -1),
    new THREE.Vector2(4, 1),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2, -1)
  ], []);

  const info = useMemo(() => {
    if (mode === "translation") {
      if (!supportsTranslation) return { text: "Cette géométrie est de dimension finie le long de l'axe. L'invariance par translation n'est pas applicable (le champ change si on se déplace en z).", type: "warning", formula: "B(r, \\theta, z)" };
      return { text: "La distribution est considérée infinie. Le déplacement le long de l'axe ne modifie pas la vue. Le champ B ne dépend pas de z.", type: "success", formula: "B(r, \\theta, z) = B(r, \\theta)" };
    } else {
      if (!supportsRotation) return { text: "Cette géométrie n'a pas de symétrie de révolution axiale. L'invariance par rotation n'est pas applicable.", type: "warning", formula: "B(r, \\theta, z)" };
      return { text: "La distribution possède une symétrie de révolution. La rotation autour de l'axe ne modifie pas la vue. Le champ B ne dépend pas de θ.", type: "success", formula: "B(r, \\theta, z) = B(r, z)" };
    }
  }, [mode, supportsTranslation, supportsRotation]);

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col mb-8">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      
      {/* 3D Canvas Container */}
      <div className="w-full h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* Shape Selector Float */}
        <div 
          className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-10 flex flex-row overflow-x-auto gap-2 bg-slate-900/60 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 shadow-xl pointer-events-auto hide-scrollbar" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shapesList.map((s) => (
            <button 
              key={s.id}
              onClick={() => setShape(s.id)}
              className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border outline-none ${shape === s.id ? s.activeColor : s.inactiveColor}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Canvas camera={{ position: [8, 6, 8], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate={false} target={[0, 0, 0]} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[30, 30, 0x1e293b, 0x0f172a]} position={[0, -4, 0]} />

          <group>
            {/* 1. COURANTS AXIAUX / MÉRIDIENS */}
            {(shape === "fil" || shape === "cylindre" || shape === "cone" || shape === "tore_circulaire" || shape === "tore_carre") && (
              <group>
                {shape === "fil" && (
                  <Cylinder args={[0.05, 0.05, 12, 16]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} clearcoat={1} />
                  </Cylinder>
                )}
                {shape === "cylindre" && (
                  <Cylinder args={[0.6, 0.6, 12, 32]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} clearcoat={1} />
                  </Cylinder>
                )}
                {shape === "cone" && (
                  <Cone args={[2.5, 6, 32]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} />
                  </Cone>
                )}
                {shape === "tore_circulaire" && (
                  <group>
                    <Torus args={[3, 1, 32, 64]} rotation={[Math.PI/2, 0, 0]}>
                      <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} transparent opacity={0.3} />
                    </Torus>
                    {Array.from({length: 24}).map((_, i) => (
                      <group key={i} rotation={[0, (i * Math.PI * 2) / 24, 0]}>
                         <Torus args={[1.05, 0.03, 8, 32]} position={[3, 0, 0]}>
                           <meshBasicMaterial color="#3b82f6" />
                         </Torus>
                         {i === 0 && (
                            <group position={[4.05, 0, 0]}>
                              <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                              <Html position={[0.2, -0.2, 0]} center><div className="text-blue-400 font-bold drop-shadow-md">j</div></Html>
                            </group>
                         )}
                      </group>
                    ))}
                  </group>
                )}
                {shape === "tore_carre" && (
                  <group>
                    <mesh>
                      <latheGeometry args={[toreCarrePoints, 64]} />
                      <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} transparent opacity={0.3} side={THREE.DoubleSide} />
                    </mesh>
                    {Array.from({length: 24}).map((_, i) => (
                      <group key={i} rotation={[0, (i * Math.PI * 2) / 24, 0]}>
                         <Line points={[[4.05, 1.05, 0], [1.95, 1.05, 0], [1.95, -1.05, 0], [4.05, -1.05, 0], [4.05, 1.05, 0]]} color="#3b82f6" lineWidth={3} />
                         {i === 0 && (
                            <group position={[4.05, 0, 0]}>
                              <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                              <Html position={[0.2, -0.2, 0]} center><div className="text-blue-400 font-bold drop-shadow-md">j</div></Html>
                            </group>
                         )}
                      </group>
                    ))}
                  </group>
                )}
                
                {/* Courant j */}
                {shape === "cone" && (
                   <group position={[1.25, 0, 0]} rotation={[0, 0, Math.atan(2.5/6)]}>
                     <Line points={[[0, -1, 0], [0, 1, 0]]} color="#3b82f6" lineWidth={4} />
                     <mesh position={[0, 1, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                   </group>
                )}
                {(shape === "fil" || shape === "cylindre") && (
                   <group position={[shape === "fil" ? 0.3 : 1.2, 0, 0]}>
                     <Line points={[[0, -1.5, 0], [0, 1.5, 0]]} color="#3b82f6" lineWidth={4} />
                     <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                   </group>
                )}
              </group>
            )}

            {/* 2. COURANTS AZIMUTAUX */}
            {(shape === "cercle" || shape === "sphere" || shape === "demi_sphere" || shape === "double_cone" || shape === "solenoide") && (
              <group position={[0, 0, 0]}>
                {shape === "cercle" && (
                  <Torus args={[2.5, 0.08, 16, 100]} rotation={[Math.PI/2, 0, 0]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                  </Torus>
                )}
                {shape === "sphere" && (
                  <Sphere args={[2.5, 32, 32]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} />
                  </Sphere>
                )}
                {shape === "demi_sphere" && (
                  <Sphere args={[2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} side={THREE.DoubleSide} />
                  </Sphere>
                )}
                {shape === "double_cone" && (
                  <group>
                    <Cone args={[2.5, 3, 32]} position={[0, 1.5, 0]}><meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} /></Cone>
                    <Cone args={[2.5, 3, 32]} position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}><meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} /></Cone>
                  </group>
                )}
                {shape === "solenoide" && (
                  <group>
                    <Cylinder args={[2, 2, 6, 32]}>
                      <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.15} />
                    </Cylinder>
                    {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((y, i) => (
                      <group key={y}>
                        <Torus args={[2.02, 0.05, 8, 64]} position={[0, y, 0]} rotation={[Math.PI/2, 0, 0]}><meshBasicMaterial color="#3b82f6" /></Torus>
                        {i === 3 && (
                          <group position={[2.02, y, 0]}>
                            <Line points={[[0, 0, 0.5], [0, 0, -0.5]]} color="#3b82f6" lineWidth={4} />
                            <mesh position={[0, 0, -0.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                          </group>
                        )}
                      </group>
                    ))}
                  </group>
                )}

                {shape !== "solenoide" && (
                  <group position={[2.5, 0, 0]}>
                    <Line points={[[0, 0, 1.5], [0, 0, -1.5]]} color="#3b82f6" lineWidth={4} />
                    <mesh position={[0, 0, -1.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                  </group>
                )}
              </group>
            )}

            {/* 3. PLAN INFINI */}
            {shape === "plan" && (
              <group>
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                  <planeGeometry args={[12, 12]} />
                  <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.3} side={THREE.DoubleSide} />
                  <gridHelper args={[12, 12, 0xffffff, 0xffffff]} rotation={[Math.PI/2, 0, 0]} material-opacity={0.1} material-transparent />
                </mesh>
                <group position={[0, 2, 2]}>
                  <Line points={[[0, -1.5, 0], [0, 1.5, 0]]} color="#3b82f6" lineWidth={4} />
                  <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                </group>
              </group>
            )}

            {/* The Animated Point and Vector */}
            <AnimatedPointM mode={mode} shape={shape} isValid={isValid} />
          </group>

          <ContactShadows resolution={1024} scale={25} blur={2.5} opacity={0.5} far={15} color="#0f172a" position={[0, -3.9, 0]} />
        </Canvas>
      </div>

      {/* Dashboard - Control Panel */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-5 rounded-b-2xl flex flex-col gap-4 shadow-xl">
        
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            Test d'Invariances Spatiales
          </span>
          <div className="flex flex-row overflow-x-auto gap-2 pb-1 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button 
              onClick={() => setMode("translation")}
              className={`shrink-0 px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 border ${mode === "translation" ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"}`}
            >
              <ArrowUpDown className="w-4 h-4" /> Translation
            </button>
            <button 
              onClick={() => setMode("rotation")}
              className={`shrink-0 px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 border ${mode === "rotation" ? "bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"}`}
            >
              <RotateCw className="w-4 h-4" /> Rotation
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className={`w-full p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-center sm:items-start transition-colors ${!isValid ? "bg-red-950/20 border-red-900/50" : "bg-emerald-950/20 border-emerald-900/50"}`}>
          {!isValid ? <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />}
          <div className="flex-1 flex flex-col gap-2">
            <p className={`text-xs leading-relaxed font-medium ${!isValid ? "text-red-200" : "text-emerald-200"}`}>
              {info.text}
            </p>
            <div className="mt-2 self-start bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 shadow-inner">
               <span className="text-slate-400 font-mono text-sm tracking-widest font-bold">
                  B(r, <span className={`transition-all duration-300 ${isValid && mode === "rotation" ? "line-through text-red-500 decoration-red-500 decoration-2" : "text-slate-300"}`}>θ</span>, <span className={`transition-all duration-300 ${isValid && mode === "translation" ? "line-through text-red-500 decoration-red-500 decoration-2" : "text-slate-300"}`}>z</span>)
                  {isValid && mode === "translation" && " = B(r, θ)"}
                  {isValid && mode === "rotation" && " = B(r, z)"}
               </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
