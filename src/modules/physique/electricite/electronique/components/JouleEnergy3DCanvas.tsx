"use client";

import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Flame, Sparkles, Sliders, Activity, ThermometerSun } from "lucide-react";

// Electron definitions
interface Electron {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  meshRef: React.RefObject<THREE.Mesh>;
}

function InternalLatticeScene({ isGlobal, eField, voltageV }: { isGlobal: boolean; eField: number; voltageV: number }) {
  const wireRef = useRef<THREE.Mesh>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);
  const ionsGroupRef = useRef<THREE.Group>(null);
  const electronsGroupRef = useRef<THREE.Group>(null);
  const macroGroupRef = useRef<THREE.Group>(null);
  
  // Create lattice ions (compact, well-spaced)
  const latticeIons = useMemo(() => {
    const ions: THREE.Vector3[] = [];
    const layersX = [-1.5, -0.75, 0, 0.75, 1.5];
    const ringRadius = 0.32;
    layersX.forEach((x) => {
      ions.push(new THREE.Vector3(x, 0, 0));
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

  // Sparks / Micro collisions
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sparkData = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({ pos: new THREE.Vector3(), life: 0 }));
  }, []);
  const nextSpark = useRef(0);

  // Convection heat particles for macroscopic view
  const heatParticleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const heatParticleData = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 3.2, 0.3, (Math.random() - 0.5) * 0.6),
      life: Math.random(),
      speed: 0.8 + Math.random() * 0.8,
    }));
  }, []);

  useFrame((_, delta) => {
    const driftVelocity = eField * 1.8;
    const thermalSpeed = 1.8;

    // Macro Incandescence calculation based on Voltage U (0 to 10 V)
    const uNorm = Math.min(Math.max(voltageV / 10.0, 0), 1.0);
    const powerRatio = uNorm * uNorm; // P = U^2 / R

    // Transition wire appearance
    if (wireRef.current && glowLightRef.current) {
      const wireMat = wireRef.current.material as THREE.MeshStandardMaterial;

      if (isGlobal) {
        // Cold slate -> Dull red -> Radiant orange -> Blazing incandescent yellow
        const targetColor = new THREE.Color();
        const targetEmissive = new THREE.Color();

        if (voltageV < 0.5) {
          targetColor.set("#334155"); // Cold metallic slate
          targetEmissive.set("#000000");
          wireMat.emissiveIntensity = 0.0;
        } else if (voltageV < 3.5) {
          // Warm up (Dark red)
          targetColor.lerpColors(new THREE.Color("#334155"), new THREE.Color("#991b1b"), voltageV / 3.5);
          targetEmissive.set("#7f1d1d");
          wireMat.emissiveIntensity = THREE.MathUtils.lerp(0.1, 0.6, voltageV / 3.5);
        } else if (voltageV < 7.0) {
          // Bright Orange
          targetColor.lerpColors(new THREE.Color("#991b1b"), new THREE.Color("#ea580c"), (voltageV - 3.5) / 3.5);
          targetEmissive.set("#f97316");
          wireMat.emissiveIntensity = THREE.MathUtils.lerp(0.6, 1.8, (voltageV - 3.5) / 3.5);
        } else {
          // Blazing Incandescent White/Yellow
          targetColor.lerpColors(new THREE.Color("#ea580c"), new THREE.Color("#fef08a"), (voltageV - 7.0) / 3.0);
          targetEmissive.set("#fde047");
          wireMat.emissiveIntensity = THREE.MathUtils.lerp(1.8, 3.2, (voltageV - 7.0) / 3.0);
        }

        wireMat.color.lerp(targetColor, delta * 4.0);
        wireMat.emissive.lerp(targetEmissive, delta * 4.0);
        wireMat.opacity = 0.95;

        // Glow light in scene
        glowLightRef.current.color.copy(targetEmissive);
        glowLightRef.current.intensity = powerRatio * 3.5;

        if (ionsGroupRef.current) ionsGroupRef.current.visible = false;
        if (electronsGroupRef.current) electronsGroupRef.current.visible = false;
        if (macroGroupRef.current) macroGroupRef.current.visible = true;

        // Animate rising heat particles in macro mode
        heatParticleData.forEach((p, i) => {
          const mesh = heatParticleRefs.current[i];
          if (!mesh) return;

          if (voltageV > 1.5) {
            p.life -= delta * (0.8 + powerRatio);
            p.pos.y += delta * p.speed * (0.5 + powerRatio * 0.8);

            if (p.life <= 0) {
              p.life = 1.0;
              p.pos.set((Math.random() - 0.5) * 3.2, 0.25, (Math.random() - 0.5) * 0.6);
            }

            mesh.position.copy(p.pos);
            mesh.scale.setScalar(p.life * (0.04 + powerRatio * 0.05));
            mesh.visible = true;
            (mesh.material as THREE.MeshBasicMaterial).color.set(powerRatio > 0.6 ? "#fef08a" : "#f97316");
          } else {
            mesh.visible = false;
          }
        });

      } else {
        // Microscopic mode (transparent glass conductor)
        wireMat.color.lerp(new THREE.Color("#b45309"), delta * 4.0);
        wireMat.emissive.set("#000000");
        wireMat.emissiveIntensity = 0.0;
        wireMat.opacity = 0.12;
        glowLightRef.current.intensity = 0.0;

        if (ionsGroupRef.current) ionsGroupRef.current.visible = true;
        if (electronsGroupRef.current) electronsGroupRef.current.visible = true;
        if (macroGroupRef.current) macroGroupRef.current.visible = false;
      }
    }

    if (isGlobal) return;

    // Simulate electrons in microscopic mode
    electrons.forEach((el) => {
      el.vel.x += driftVelocity * delta;
      el.vel.x += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.y += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.z += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.multiplyScalar(0.96);
      
      el.pos.add(el.vel.clone().multiplyScalar(delta));

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

      {/* Dynamic Thermal Glow Light for Macroscopic view */}
      <pointLight ref={glowLightRef} position={[0, 0, 0]} distance={7} intensity={0} />

      {/* Main Cylinder Conductor */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={wireRef}>
          <cylinderGeometry args={[0.48, 0.48, 3.8, 32]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.7}
            roughness={0.25}
            transparent
            opacity={0.12}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ── MACROSCOPIC ACCESSORIES (Terminals, Heat Aura, Voltage Vector) ── */}
      <group ref={macroGroupRef} visible={false}>
        {/* Silver Terminal Caps */}
        <mesh position={[-1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 0.18, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 0.18, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lead Wires */}
        <mesh position={[-2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Terminal Labels */}
        <Html position={[-2.4, 0.4, 0]} center className="pointer-events-none">
          <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-rose-400 font-mono font-bold text-[11px] shadow">
            A (+)
          </div>
        </Html>
        <Html position={[2.4, 0.4, 0]} center className="pointer-events-none">
          <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-cyan-400 font-mono font-bold text-[11px] shadow">
            B (-)
          </div>
        </Html>

        {/* Macroscopic Voltage Arrow U = V_A - V_B */}
        {voltageV > 0 && (
          <group position={[0, 1.1, 0]}>
            <Cylinder args={[0.015, 0.015, 2.6]} rotation={[0, 0, -Math.PI / 2]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1} />
            </Cylinder>
            <mesh position={[1.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.2, 16]} />
              <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1} />
            </mesh>
            <Html position={[0, 0.25, 0]} center className="pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-rose-500/50 text-rose-400 font-mono font-bold text-xs shadow-lg whitespace-nowrap">
                <LatexMath math={`U = ${voltageV.toFixed(1)}\\text{ V}`} />
              </span>
            </Html>
          </group>
        )}

        {/* Convection Heat Particles */}
        <group>
          {heatParticleData.map((_, i) => (
            <mesh key={`heat-${i}`} ref={(el) => { heatParticleRefs.current[i] = el; }} visible={false}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── MICROSCOPIC VIEW (Ions, Electrons, Sparks) ── */}
      <group ref={ionsGroupRef}>
        {latticeIons.map((pos, i) => (
          <mesh key={`ion-${i}`} position={pos} ref={(el) => { ionMeshRefs.current[i] = el; }}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshStandardMaterial color="#f97316" emissive="#c2410c" emissiveIntensity={0.2} roughness={0.3} metalness={0.4} />
          </mesh>
        ))}
      </group>

      <group ref={electronsGroupRef}>
        {electrons.map((el, i) => (
          <mesh key={`el-${i}`} ref={el.meshRef}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2.0} />
          </mesh>
        ))}
      </group>

      {/* Micro Sparks */}
      <group>
        {sparkData.map((_, i) => (
          <mesh key={`spark-${i}`} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        ))}
      </group>
      
      {/* Micro HUD E-field Vector */}
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
      <OrbitControls enableZoom={true} maxDistance={8.5} minDistance={3.2} autoRotate={isGlobal} autoRotateSpeed={1.2} />
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

  // Incandescence stage description
  const getThermalStateText = () => {
    if (voltageV === 0) return "Froid (Température ambiante, 0 W)";
    if (voltageV < 3.5) return "Échauffement modéré (Rouge sombre)";
    if (voltageV < 7.0) return "Forte incandescence (Orange vif)";
    return "Incandescence maximale (Jaune / Blanc éclatant)";
  };

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
                <span>Résistance & Courant</span>
                <span className="font-mono text-slate-200 font-bold">{R.toFixed(1)} <LatexMath math="\Omega" /> • {currentI} A</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center">
                <div className="text-[9px] uppercase font-bold text-rose-400/80 mb-0.5">Puissance Totale Joule</div>
                <div className="text-rose-400 font-mono font-extrabold text-sm sm:text-base">
                  <LatexMath math={`P_J = ${PJ} \\text{ W}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-300 bg-slate-950 p-1 rounded border border-slate-800">
                <ThermometerSun className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">{getThermalStateText()}</span>
              </div>
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
