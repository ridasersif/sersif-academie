"use client";

import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Flame, Sparkles, Sliders, Activity } from "lucide-react";

// Electron definitions
interface Electron {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  meshRef: React.RefObject<THREE.Mesh>;
}

function InternalLatticeScene({ isGlobal, eField, voltageV }: { isGlobal: boolean; eField: number; voltageV: number }) {
  const wireRef = useRef<THREE.Mesh>(null);
  const ionsGroupRef = useRef<THREE.Group>(null);
  const electronsGroupRef = useRef<THREE.Group>(null);
  
  // Create lattice ions (compact, well-spaced)
  const latticeIons = useMemo(() => {
    const ions: THREE.Vector3[] = [];
    const layersX = [-1.5, -0.75, 0, 0.75, 1.5];
    const ringRadius = 0.32;
    layersX.forEach((x) => {
      ions.push(new THREE.Vector3(x, 0, 0)); // Center axis
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2;
        ions.push(new THREE.Vector3(x, Math.sin(ang) * ringRadius, Math.cos(ang) * ringRadius));
      }
    });
    return ions;
  }, []);
  const ionMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Create electrons
  const electronCount = 35;
  const electrons = useMemo(() => {
    return Array.from({ length: electronCount }).map(() => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 0.55, (Math.random() - 0.5) * 0.55),
      vel: new THREE.Vector3(),
      meshRef: React.createRef<THREE.Mesh>(),
    }));
  }, []);

  // Sparks for collisions
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sparkData = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({ pos: new THREE.Vector3(), life: 0 }));
  }, []);
  const nextSpark = useRef(0);

  useFrame((_, delta) => {
    const driftVelocity = eField * 1.8;
    const thermalSpeed = 1.8;

    // Transition wire appearance
    if (ionsGroupRef.current && electronsGroupRef.current && wireRef.current) {
      const wireMat = wireRef.current.material as THREE.MeshStandardMaterial;
      const wireTargetOp = isGlobal ? 0.88 : 0.12;
      const wireTargetEmissive = isGlobal ? (voltageV / 5.5) : 0.0;
      
      wireMat.opacity += (wireTargetOp - wireMat.opacity) * delta * 4.0;
      wireMat.emissiveIntensity += (wireTargetEmissive - wireMat.emissiveIntensity) * delta * 4.0;
      
      if (isGlobal) {
        wireMat.color.lerp(new THREE.Color("#f97316"), delta * 3.0);
        ionsGroupRef.current.visible = false;
        electronsGroupRef.current.visible = false;
      } else {
        wireMat.color.lerp(new THREE.Color("#9a3412"), delta * 3.0);
        ionsGroupRef.current.visible = true;
        electronsGroupRef.current.visible = true;
      }
    }

    if (isGlobal) return;

    // Simulate electrons
    electrons.forEach((el) => {
      el.vel.x += driftVelocity * delta;
      el.vel.x += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.y += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.z += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.multiplyScalar(0.96);
      
      el.pos.add(el.vel.clone().multiplyScalar(delta));

      // Cylinder radius 0.45, length 3.6
      if (el.pos.y * el.pos.y + el.pos.z * el.pos.z > 0.2) {
        el.vel.y *= -1;
        el.vel.z *= -1;
        el.pos.y *= 0.9;
        el.pos.z *= 0.9;
      }
      if (el.pos.x > 1.8) el.pos.x = -1.8;
      if (el.pos.x < -1.8) el.pos.x = 1.8;

      // Collisions with ions
      for (let i = 0; i < latticeIons.length; i++) {
        const ionPos = latticeIons[i];
        if (el.pos.distanceToSquared(ionPos) < 0.035) {
          el.vel.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
          
          const ionMesh = ionMeshRefs.current[i];
          if (ionMesh && (ionMesh.material as THREE.MeshStandardMaterial).emissiveIntensity < 2.0) {
            (ionMesh.material as THREE.MeshStandardMaterial).emissiveIntensity += eField * 0.4;
          }

          if (eField > 0) {
            const sd = sparkData[nextSpark.current];
            sd.pos.copy(ionPos).add(new THREE.Vector3((Math.random()-0.5)*0.15, Math.random()*0.2, (Math.random()-0.5)*0.15));
            sd.life = 1.0;
            nextSpark.current = (nextSpark.current + 1) % sparkData.length;
          }
        }
      }

      if (el.meshRef.current) {
        el.meshRef.current.position.copy(el.pos);
      }
    });

    // Cool down ions
    latticeIons.forEach((_, i) => {
      const ionMesh = ionMeshRefs.current[i];
      if (ionMesh) {
        const mat = ionMesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity > 0.15) mat.emissiveIntensity -= delta * 1.2;
      }
    });

    // Sparks update
    sparkData.forEach((sd, i) => {
      const mesh = sparkRefs.current[i];
      if (sd.life > 0) {
        sd.life -= delta * 3.5;
        sd.pos.y += delta * 0.4;
        if (mesh) {
          mesh.position.copy(sd.pos);
          mesh.scale.setScalar(sd.life);
          mesh.visible = true;
        }
      } else {
        if (mesh) mesh.visible = false;
      }
    });
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 6, 5]} intensity={1.8} />
      <directionalLight position={[-4, -3, -4]} intensity={0.6} />

      {/* Wire Cylinder (Compact: Radius 0.48, Length 3.8) */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={wireRef}>
          <cylinderGeometry args={[0.48, 0.48, 3.8, 32]} />
          <meshStandardMaterial
            color="#b45309"
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.12}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Internal Ions */}
      <group ref={ionsGroupRef}>
        {latticeIons.map((pos, i) => (
          <mesh key={`ion-${i}`} position={pos} ref={(el) => { ionMeshRefs.current[i] = el; }}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshStandardMaterial color="#f97316" emissive="#c2410c" emissiveIntensity={0.2} roughness={0.3} metalness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Electrons */}
      <group ref={electronsGroupRef}>
        {electrons.map((el, i) => (
          <mesh key={`el-${i}`} ref={el.meshRef}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2.0} />
          </mesh>
        ))}
      </group>

      {/* Sparks */}
      <group>
        {sparkData.map((_, i) => (
          <mesh key={`spark-${i}`} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        ))}
      </group>
      
      {/* HUD Field Vectors */}
      {!isGlobal && eField > 0 && (
        <group position={[0, 0.8, 0]}>
          <group position={[0, 0, 0]}>
            <Cylinder args={[0.012, 0.012, 0.75 * eField]} rotation={[0, 0, -Math.PI / 2]} position={[0.375 * eField, 0, 0]}>
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </Cylinder>
            <mesh position={[0.75 * eField, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.05, 0.15, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </mesh>
            <Html position={[0.75 * eField + 0.15, 0, 0]} center className="text-cyan-400 font-bold text-xs pointer-events-none">
              <LatexMath math="\vec{E}" />
            </Html>
          </group>
        </group>
      )}

      <ContactShadows position={[0, -1.0, 0]} opacity={0.5} scale={7} blur={1.8} />
      <OrbitControls enableZoom={true} maxDistance={8.5} minDistance={3.2} autoRotate={isGlobal} autoRotateSpeed={1.5} />
    </>
  );
}

export default function JouleEnergy3DCanvas() {
  const [isGlobal, setIsGlobal] = useState(false);
  
  // Interactive Variables
  const [eField, setEField] = useState(1.0);
  const [voltageV, setVoltageV] = useState(5.0);
  
  const gamma = 5.0;
  const pJ = (gamma * eField * eField).toFixed(1);
  
  const R = 2.0;
  const currentI = (voltageV / R).toFixed(2);
  const PJ = ((voltageV * voltageV) / R).toFixed(1);

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col md:grid md:grid-cols-12 min-h-[320px]">
      
      {/* ── LEFT COLUMN : CONTROLS & RESULTS (Lisare) ── */}
      <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 space-y-4">
        
        {/* Mode Selector */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Mode d&apos;observation
          </span>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsGlobal(false)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                !isGlobal ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Vue Locale
            </button>
            <button
              onClick={() => setIsGlobal(true)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                isGlobal ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Vue Globale
            </button>
          </div>
        </div>

        {/* Live Slider Control */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              {!isGlobal ? <span>Champ <LatexMath math="E" /></span> : <span>Tension <LatexMath math="U" /></span>}
            </span>
            <span className="font-mono font-bold text-xs text-cyan-400">
              {!isGlobal ? `${eField.toFixed(1)} V/m` : `${voltageV.toFixed(1)} V`}
            </span>
          </div>

          {!isGlobal ? (
            <input 
              type="range" min="0" max="2" step="0.1" value={eField} onChange={(e) => setEField(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-amber-500 cursor-pointer" 
            />
          ) : (
            <input 
              type="range" min="0" max="10" step="0.5" value={voltageV} onChange={(e) => setVoltageV(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-rose-500 cursor-pointer" 
            />
          )}
        </div>

        {/* Output Results Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-inner">
          {!isGlobal ? (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Conductivité <LatexMath math="\gamma" /></span>
                <span className="font-mono text-slate-200 font-bold">{gamma.toFixed(1)} <LatexMath math="\text{S/m}" /></span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-[9px] uppercase font-bold text-amber-400/80 mb-0.5">Puissance Volumique Locale</div>
                <div className="text-amber-300 font-mono font-extrabold text-sm sm:text-base">
                  <LatexMath math={`p_J = ${pJ} \\text{ W/m}^3`} />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight text-center">
                Chocs inélastiques <LatexMath math="\to" /> dissipation thermique locale.
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Résistance <LatexMath math="R" /> & Courant <LatexMath math="I" /></span>
                <span className="font-mono text-slate-200 font-bold">{R.toFixed(1)} <LatexMath math="\Omega" /> • {currentI} A</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
                <div className="text-[9px] uppercase font-bold text-rose-400/80 mb-0.5">Puissance Totale Joule</div>
                <div className="text-rose-400 font-mono font-extrabold text-sm sm:text-base">
                  <LatexMath math={`P_J = ${PJ} \\text{ W}`} />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight text-center">
                Somme macroscopique <LatexMath math="P_J = R I^2 = U I" />.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN : 3D VIEWPORT (Limane) ── */}
      <div className="md:col-span-7 h-[260px] sm:h-[300px] md:h-auto min-h-[260px] md:min-h-[320px] relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.2, 5.2], fov: 44 }}>
          <Suspense fallback={null}>
            <InternalLatticeScene isGlobal={isGlobal} eField={eField} voltageV={voltageV} />
          </Suspense>
        </Canvas>

        {/* 3D Hint */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
          🖱️ 3D Interactif • Tourner / Zoomer
        </div>
      </div>
    </div>
  );
}
