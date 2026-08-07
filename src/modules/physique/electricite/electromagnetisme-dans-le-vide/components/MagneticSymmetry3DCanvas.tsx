"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Cylinder, Sphere, Cone, Torus, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { EyeOff, Scan, Info, AlertTriangle } from "lucide-react";

type ShapeType = "fil" | "cylindre" | "solenoide" | "cercle" | "sphere" | "demi_sphere" | "cone" | "double_cone" | "tore_circulaire" | "tore_carre" | "plan";
type PlaneType = "none" | "symmetry" | "antisymmetry";

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
       {/* X axis (e_r or e_x) */}
       <Line points={[[0,0,0], [1.5, 0, 0]]} color="#ef4444" lineWidth={2} transparent opacity={0.5} />
       <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}><coneGeometry args={[0.04, 0.15, 8]}/><meshBasicMaterial color="#ef4444" transparent opacity={0.7} /></mesh>
       <Html position={[1.7, 0, 0]} center><div className="text-red-400/90 text-[12px] font-bold font-serif italic">e<sub>{isCyl ? 'r' : 'x'}</sub></div></Html>

       {/* Y axis (e_z or e_y) */}
       <Line points={[[0,0,0], [0, 1.5, 0]]} color="#22c55e" lineWidth={2} transparent opacity={0.5} />
       <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.04, 0.15, 8]}/><meshBasicMaterial color="#22c55e" transparent opacity={0.7} /></mesh>
       <Html position={[0, 1.7, 0]} center><div className="text-green-400/90 text-[12px] font-bold font-serif italic">e<sub>{isCyl ? 'z' : 'y'}</sub></div></Html>

       {/* Z axis (e_theta or e_z) */}
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

const FieldLineCircle = ({ radius, color }: { radius: number, color: string }) => {
  const pts = useMemo(() => {
    const points = [];
    for(let i=0; i<=64; i++) {
      const a = (i/64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a)*radius, 0, Math.sin(a)*radius));
    }
    return points;
  }, [radius]);
  
  return (
    <group>
       <Line points={pts} color={color} lineWidth={1.5} transparent opacity={0.4} />
       <mesh position={[radius, 0, 0]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.3, 8]} /><meshBasicMaterial color={color} /></mesh>
       <mesh position={[-radius, 0, 0]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.3, 8]} /><meshBasicMaterial color={color} /></mesh>
       <mesh position={[0, 0, radius]} rotation={[0, 0, -Math.PI/2]}><coneGeometry args={[0.1, 0.3, 8]} /><meshBasicMaterial color={color} /></mesh>
       <mesh position={[0, 0, -radius]} rotation={[0, 0, Math.PI/2]}><coneGeometry args={[0.1, 0.3, 8]} /><meshBasicMaterial color={color} /></mesh>
    </group>
  );
};

export default function MagneticSymmetry3DCanvas() {
  const [shape, setShape] = useState<ShapeType>("fil");
  const [planeType, setPlaneType] = useState<PlaneType>("none");

  const getInfo = () => {
    if (planeType === "none") return { text: "Sélectionnez un plan pour analyser ses propriétés de symétrie.", type: "info" };
    
    if (planeType === "symmetry") {
      if (shape === "cone") return { text: "Le plan Π contient l'axe du cône. Les courants radiaux qui montent vers le sommet sont INCLUS dans ce plan. Le champ B lui est perpendiculaire.", type: "info" };
      if (shape === "demi_sphere") return { text: "La demi-sphère n'a pas de plan de symétrie horizontal (le haut et le bas sont différents).", type: "warning" };
      if (shape === "tore_circulaire" || shape === "tore_carre") return { text: "Tout plan méridien (contenant l'axe de révolution) coupe les spires en deux de façon symétrique. B (circulaire) lui est perpendiculaire.", type: "info" };
      if (shape === "plan") return { text: "Le plan contenant le vecteur courant js et orthogonal à la surface est un plan de Symétrie Π. B lui est perpendiculaire.", type: "info" };
      if (shape === "fil" || shape === "cylindre") return { text: "Le plan Π contient l'axe de révolution. Le champ B est toujours perpendiculaire à ce plan (Principe de Curie).", type: "info" };
      return { text: "Le plan Π contient la boucle de courant (Plan de l'équateur). Le champ B est perpendiculaire à ce plan.", type: "info" };
    }
    
    if (planeType === "antisymmetry") {
      if (shape === "cone") return { text: "Le cône n'a pas de plan d'antisymétrie transverse car il est asymétrique (la base et le sommet sont différents).", type: "warning" };
      if (shape === "tore_circulaire" || shape === "tore_carre") return { text: "Le plan horizontal de l'équateur est un plan d'Antisymétrie Π*. Les courants le traversent. B appartient à ce plan.", type: "info" };
      if (shape === "plan") return { text: "Tout plan perpendiculaire au courant js est un plan d'Antisymétrie Π*. Le champ B est inclus dans ce plan.", type: "info" };
      if (shape === "fil" || shape === "cylindre") return { text: "Le plan Π* est perpendiculaire à l'axe (plan transverse). Les courants le traversent. Le champ B appartient à ce plan.", type: "info" };
      return { text: "Le plan Π* contient l'axe de révolution (Plan méridien). Les courants le traversent perpendiculairement. Le champ B appartient à ce plan.", type: "info" };
    }
    return { text: "", type: "info" };
  };

  const info = getInfo();

  const toreCarrePoints = useMemo(() => [
    new THREE.Vector2(2, -1),
    new THREE.Vector2(4, -1),
    new THREE.Vector2(4, 1),
    new THREE.Vector2(2, 1),
    new THREE.Vector2(2, -1)
  ], []);

  // Position M dynamically based on shape
  const mPos = useMemo(() => {
    if (shape === "fil" || shape === "cylindre") return [3, 0, 0];
    if (shape === "cone") return [3.5, 0, 0];
    if (shape === "tore_circulaire" || shape === "tore_carre") return [3, 0, 0];
    if (shape === "plan") return [2, 0, 0];
    if (shape === "solenoide") return [0, 1.5, 0];
    if (shape === "double_cone") return [0, 4, 0];
    return [0, 3.5, 0];
  }, [shape]);

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* Canvas Area */}
      <div className="w-full h-[320px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        
        {/* Shape Selector Float */}
        <div 
          className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-10 flex flex-row overflow-x-auto gap-2 bg-slate-900/60 backdrop-blur-md p-2 rounded-xl border border-slate-700/50 shadow-xl pointer-events-auto hide-scrollbar" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shapesList.map((s) => (
            <button 
              key={s.id}
              onClick={() => { setShape(s.id); setPlaneType("none"); }}
              className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border outline-none ${shape === s.id ? s.activeColor : s.inactiveColor}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 3D Scene */}
        <Canvas camera={{ position: [8, 6, 8], fov: 45 }} className="w-full flex-1 cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 15, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.8} target={[0, 0, 0]} maxPolarAngle={Math.PI / 1.5} />
          <gridHelper args={[30, 30, 0x1e293b, 0x0f172a]} position={[0, -0.01, 0]} />

          <group position={[0, 0, 0]}>
            
            {/* ======================= */}
            {/* 1. COURANTS AXIAUX / MÉRIDIENS (Fil, Cylindre, Cône, Tores) */}
            {/* ======================= */}
            {(shape === "fil" || shape === "cylindre" || shape === "cone" || shape === "tore_circulaire" || shape === "tore_carre") && (
              <group>
                {/* Formes */}
                {shape === "fil" && (
                  <Cylinder args={[0.05, 0.05, 12, 16]} rotation={[0, 0, 0]} position={[0, 0, 0]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} clearcoat={1} />
                  </Cylinder>
                )}
                {shape === "cylindre" && (
                  <Cylinder args={[0.6, 0.6, 12, 32]} rotation={[0, 0, 0]} position={[0, 0, 0]}>
                    <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} clearcoat={1} />
                  </Cylinder>
                )}
                {shape === "cone" && (
                  <Cone args={[2.5, 6, 32]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
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
                         <Torus args={[1.05, 0.03, 8, 32]} position={[3, 0, 0]} rotation={[0, 0, 0]}>
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
                
                {/* Lignes de champ (Cercles) pour fil, cylindre, cone */}
                {(shape === "fil" || shape === "cylindre" || shape === "cone") && (
                  <group>
                    <FieldLineCircle radius={shape === "cone" ? 3.5 : 1.5} color="#10b981" />
                    <FieldLineCircle radius={shape === "cone" ? 4.5 : 2.5} color="#10b981" />
                    <FieldLineCircle radius={shape === "cone" ? 5.5 : 4} color="#10b981" />
                  </group>
                )}

                {/* Courant j */}
                {shape === "cone" && (
                   <group position={[1.25, 0, 0]} rotation={[0, 0, Math.atan(2.5/6)]}>
                     <Line points={[[0, -1, 0], [0, 1, 0]]} color="#3b82f6" lineWidth={4} />
                     <mesh position={[0, 1, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                     <Html position={[0, 1.3, 0]} center><div className="text-blue-400 font-bold drop-shadow-md">j</div></Html>
                   </group>
                )}
                {(shape === "fil" || shape === "cylindre") && (
                   <group position={[shape === "fil" ? 0.3 : 1.2, 0, 0]}>
                     <Line points={[[0, -1.5, 0], [0, 1.5, 0]]} color="#3b82f6" lineWidth={4} />
                     <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                     <Html position={[0, 1.8, 0]} center><div className="text-blue-400 font-bold drop-shadow-md">j</div></Html>
                   </group>
                )}

                {/* Point M et Vecteur B (Circulaire vers -Z) */}
                <Basis3D position={[mPos[0], mPos[1], mPos[2]]} type="cylindrical" />
                <Sphere args={[0.15, 32, 32]} position={[mPos[0], mPos[1], mPos[2]]}>
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
                  <Html position={[0.3, 0.3, 0]} center><div className="text-amber-400 font-bold text-sm drop-shadow-md">M</div></Html>
                </Sphere>
                <group position={[mPos[0], mPos[1], mPos[2]]}>
                  <Line points={[[0, 0, 0], [0, 0, -2.5]]} color="#10b981" lineWidth={4} />
                  <mesh position={[0, 0, -2.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
                  <Html position={[0, 0, -3]} center><div className="text-emerald-400 font-bold drop-shadow-md">B</div></Html>
                </group>

                {/* Plans (Curie) */}
                {planeType === "symmetry" && (
                  <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#3b82f6" linewidth={2} /></lineSegments>
                    <Html position={[5, 5, 0]} center><div className="text-blue-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-blue-500/50">Plan Π (Symétrie)</div></Html>
                  </mesh>
                )}
                {planeType === "antisymmetry" && shape !== "cone" && (
                  <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#10b981" linewidth={2} /></lineSegments>
                    <Html position={[5, 0, 5]} center><div className="text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-emerald-500/50">Plan Π* (Antisymétrie)</div></Html>
                  </mesh>
                )}
              </group>
            )}

            {/* ======================= */}
            {/* 2. COURANTS AZIMUTAUX (Cercle, Sphère, Demi-Sphère, Double Cône, Solénoïde) */}
            {/* ======================= */}
            {(shape === "cercle" || shape === "sphere" || shape === "demi_sphere" || shape === "double_cone" || shape === "solenoide") && (
              <group position={[0, 0, 0]}>
                
                {/* Formes */}
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
                    <Cone args={[2.5, 3, 32]} position={[0, 1.5, 0]} rotation={[0, 0, 0]}><meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} /></Cone>
                    <Cone args={[2.5, 3, 32]} position={[0, -1.5, 0]} rotation={[Math.PI, 0, 0]}><meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.7} /></Cone>
                  </group>
                )}
                {shape === "solenoide" && (
                  <group>
                    <Cylinder args={[2, 2, 6, 32]} position={[0, 0, 0]}>
                      <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.15} />
                    </Cylinder>
                    {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((y, i) => (
                      <group key={y}>
                        <Torus args={[2.02, 0.05, 8, 64]} position={[0, y, 0]} rotation={[Math.PI/2, 0, 0]}><meshBasicMaterial color="#3b82f6" /></Torus>
                        {i === 3 && (
                          <group position={[2.02, y, 0]}>
                            <Line points={[[0, 0, 0.5], [0, 0, -0.5]]} color="#3b82f6" lineWidth={4} />
                            <mesh position={[0, 0, -0.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                            <Html position={[0.3, 0, -0.8]} center><div className="text-blue-400 font-bold drop-shadow-md text-sm">j</div></Html>
                          </group>
                        )}
                      </group>
                    ))}
                    <Line points={[[0, -4, 0], [0, 4, 0]]} color="#10b981" lineWidth={3} transparent opacity={0.5}/>
                    <Line points={[[-1, -4, 0], [-1, 4, 0]]} color="#10b981" lineWidth={1.5} transparent opacity={0.3}/>
                    <Line points={[[1, -4, 0], [1, 4, 0]]} color="#10b981" lineWidth={1.5} transparent opacity={0.3}/>
                  </group>
                )}

                {/* Courant j (Boucle) - Affiché sauf pour solenoide */}
                {shape !== "solenoide" && (
                  <group position={[2.5, 0, 0]}>
                    <Line points={[[0, 0, 1.5], [0, 0, -1.5]]} color="#3b82f6" lineWidth={4} />
                    <mesh position={[0, 0, -1.5]} rotation={[-Math.PI/2, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                    <Html position={[0, 0.4, -1.8]} center><div className="text-blue-400 font-bold drop-shadow-md">j</div></Html>
                  </group>
                )}

                {/* Point M et Vecteur B (Axial vers +Y) */}
                <Basis3D position={[mPos[0], mPos[1], mPos[2]]} type="cartesian" />
                <Sphere args={[0.15, 32, 32]} position={[mPos[0], mPos[1], mPos[2]]}>
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
                  <Html position={[0.3, 0.3, 0]} center><div className="text-amber-400 font-bold text-sm">M</div></Html>
                </Sphere>
                <group position={[mPos[0], mPos[1], mPos[2]]}>
                  <Line points={[[0, 0, 0], [0, 2.5, 0]]} color="#10b981" lineWidth={4} />
                  <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
                  <Html position={[0, 3, 0]} center><div className="text-emerald-400 font-bold">B</div></Html>
                </group>

                {/* Plans (Curie) */}
                {planeType === "symmetry" && shape !== "demi_sphere" && (
                  <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.2} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#3b82f6" linewidth={2} /></lineSegments>
                    <Html position={[5, 5, 0]} center><div className="text-blue-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-blue-500/50">Plan Π (Symétrie)</div></Html>
                  </mesh>
                )}
                {planeType === "antisymmetry" && (
                  <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#10b981" transparent opacity={0.2} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#10b981" linewidth={2} /></lineSegments>
                    <Html position={[5, 5, 0]} center><div className="text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-emerald-500/50">Plan Π* (Antisymétrie)</div></Html>
                  </mesh>
                )}
              </group>
            )}

            {/* ======================= */}
            {/* 3. PLAN INFINI          */}
            {/* ======================= */}
            {shape === "plan" && (
              <group>
                {/* Surface YZ plane */}
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                  <planeGeometry args={[12, 12]} />
                  <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.3} side={THREE.DoubleSide} />
                  <gridHelper args={[12, 12, 0xffffff, 0xffffff]} rotation={[Math.PI/2, 0, 0]} material-opacity={0.1} material-transparent />
                </mesh>

                {/* Courant Surfacique js */}
                <group position={[0, 2, 2]}>
                  <Line points={[[0, -1.5, 0], [0, 1.5, 0]]} color="#3b82f6" lineWidth={4} />
                  <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                  <Html position={[0, 1.8, 0]} center><div className="text-blue-400 font-bold drop-shadow-md">j<sub>s</sub></div></Html>
                </group>
                <group position={[0, -2, -2]}>
                  <Line points={[[0, -1.5, 0], [0, 1.5, 0]]} color="#3b82f6" lineWidth={4} />
                  <mesh position={[0, 1.5, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                </group>

                {/* Point M et Vecteur B (+Z) */}
                <Basis3D position={[mPos[0], mPos[1], mPos[2]]} type="cartesian" />
                <Sphere args={[0.15, 32, 32]} position={[mPos[0], mPos[1], mPos[2]]}>
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} />
                  <Html position={[0.3, 0.3, 0]} center><div className="text-amber-400 font-bold text-sm">M</div></Html>
                </Sphere>
                <group position={[mPos[0], mPos[1], mPos[2]]}>
                  <Line points={[[0, 0, 0], [0, 0, 2.5]]} color="#10b981" lineWidth={4} />
                  <mesh position={[0, 0, 2.5]} rotation={[Math.PI/2, 0, 0]}><coneGeometry args={[0.1, 0.4, 8]} /><meshBasicMaterial color="#10b981" /></mesh>
                  <Html position={[0, 0, 3]} center><div className="text-emerald-400 font-bold">B</div></Html>
                </group>

                {/* Plans (Curie) */}
                {planeType === "symmetry" && (
                  <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#3b82f6" linewidth={2} /></lineSegments>
                    <Html position={[5, 5, 0]} center><div className="text-blue-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-blue-500/50">Plan Π (Symétrie)</div></Html>
                  </mesh>
                )}
                {planeType === "antisymmetry" && (
                  <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <planeGeometry args={[12, 12]} />
                    <meshPhysicalMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} />
                    <lineSegments><edgesGeometry args={[new THREE.PlaneGeometry(12, 12)]} /><lineBasicMaterial color="#10b981" linewidth={2} /></lineSegments>
                    <Html position={[5, 0, 5]} center><div className="text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded text-xs border border-emerald-500/50">Plan Π* (Antisymétrie)</div></Html>
                  </mesh>
                )}
              </group>
            )}

          </group>

          <ContactShadows resolution={1024} scale={25} blur={2.5} opacity={0.5} far={15} color="#0f172a" />
        </Canvas>
      </div>

      {/* Dashboard - Control Panel */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-3 sm:p-5 rounded-b-2xl flex flex-col gap-4">
        
        {/* Plane Selector & Info */}
        <div className="flex flex-col gap-3">
          
          <div className="flex flex-col gap-2 w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scan className="w-3.5 h-3.5 text-slate-500"/> Visualiser les Plans (Principe de Curie)
            </span>
            <div className="flex flex-row overflow-x-auto gap-2 pb-1 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button 
                onClick={() => setPlaneType("none")}
                className={`shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border outline-none flex items-center gap-1.5 ${planeType === "none" ? "bg-slate-700 border-slate-500 text-white shadow-lg" : "bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800"}`}
              >
                <EyeOff className="w-3.5 h-3.5" /> Cacher
              </button>
              <button 
                onClick={() => setPlaneType("symmetry")}
                className={`shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border outline-none flex items-center gap-1.5 ${planeType === "symmetry" ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-slate-800/30 border-blue-900/50 text-blue-400 hover:bg-blue-900/30"}`}
              >
                Plan de Symétrie (Π)
              </button>
              <button 
                onClick={() => setPlaneType("antisymmetry")}
                className={`shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all border outline-none flex items-center gap-1.5 ${planeType === "antisymmetry" ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-800/30 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/30"}`}
              >
                Plan d&apos;Antisymétrie (Π*)
              </button>
            </div>
          </div>

          {/* Dynamic Info Panel */}
          <div className={`w-full p-3 rounded-xl border flex gap-3 items-start transition-colors ${info.type === "warning" ? "bg-amber-950/30 border-amber-800/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "bg-slate-800/40 border-slate-700/50"}`}>
            {info.type === "warning" ? <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0 mt-0.5" />}
            <p className={`text-[10px] sm:text-xs leading-relaxed font-medium ${info.type === "warning" ? "text-amber-200" : "text-slate-300"}`}>
              {info.text}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
