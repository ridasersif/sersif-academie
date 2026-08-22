"use client";

import React, { Suspense, useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Settings2 } from "lucide-react";

// Electron and Ion definitions
interface Electron {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  meshRef: React.RefObject<THREE.Mesh>;
}

function InternalLatticeScene({ isGlobal, eField, voltageV }: { isGlobal: boolean; eField: number; voltageV: number }) {
  const wireRef = useRef<THREE.Mesh>(null);
  const ionsGroupRef = useRef<THREE.Group>(null);
  const electronsGroupRef = useRef<THREE.Group>(null);
  
  // Create lattice ions
  const latticeIons = useMemo(() => {
    const ions: THREE.Vector3[] = [];
    const layersX = [-2.0, -1.0, 0, 1.0, 2.0];
    const ringRadius = 0.4;
    layersX.forEach((x) => {
      ions.push(new THREE.Vector3(x, 0, 0)); // center
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2;
        ions.push(new THREE.Vector3(x, Math.sin(ang) * ringRadius, Math.cos(ang) * ringRadius));
      }
    });
    return ions;
  }, []);
  const ionMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Create electrons
  const electronCount = 40;
  const electrons = useMemo(() => {
    return Array.from({ length: electronCount }).map(() => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 4.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
      vel: new THREE.Vector3(),
      meshRef: React.createRef<THREE.Mesh>(),
    }));
  }, []);

  // Sparks for collisions
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sparkData = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({ pos: new THREE.Vector3(), life: 0 }));
  }, []);
  const nextSpark = useRef(0);

  useFrame((_, delta) => {
    const driftVelocity = eField * 2.0; // simplified drift velocity
    const thermalSpeed = 2.0;

    // Fade groups based on mode
    if (ionsGroupRef.current && electronsGroupRef.current && wireRef.current) {
      // Wire becomes red hot in global mode, transparent in micro mode
      const wireMat = wireRef.current.material as THREE.MeshStandardMaterial;
      const wireTargetOp = isGlobal ? 0.8 : 0.15;
      const wireTargetEmissive = isGlobal ? (voltageV / 5.0) : 0.0;
      
      wireMat.opacity += (wireTargetOp - wireMat.opacity) * delta * 3.0;
      wireMat.emissiveIntensity += (wireTargetEmissive - wireMat.emissiveIntensity) * delta * 3.0;
      
      if (isGlobal) {
        wireMat.color.lerp(new THREE.Color("#ea580c"), delta * 2.0);
        ionsGroupRef.current.visible = false;
        electronsGroupRef.current.visible = false;
      } else {
        wireMat.color.lerp(new THREE.Color("#b45309"), delta * 2.0);
        ionsGroupRef.current.visible = true;
        electronsGroupRef.current.visible = true;
      }
    }

    if (isGlobal) return; // Skip physics if in global view

    // Simulate electron movement & collisions
    electrons.forEach((el) => {
      // Add E-field acceleration (drift)
      el.vel.x += driftVelocity * delta;

      // Add random thermal motion
      el.vel.x += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.y += (Math.random() - 0.5) * thermalSpeed * delta;
      el.vel.z += (Math.random() - 0.5) * thermalSpeed * delta;

      // Apply friction (damping)
      el.vel.multiplyScalar(0.95);
      
      // Move
      el.pos.add(el.vel.clone().multiplyScalar(delta));

      // Boundary check (cylinder radius 0.6, length 5)
      if (el.pos.y * el.pos.y + el.pos.z * el.pos.z > 0.35) {
        el.vel.y *= -1;
        el.vel.z *= -1;
        el.pos.y *= 0.9;
        el.pos.z *= 0.9;
      }
      if (el.pos.x > 2.5) el.pos.x = -2.5;
      if (el.pos.x < -2.5) el.pos.x = 2.5;

      // Collisions with ions
      for (let i = 0; i < latticeIons.length; i++) {
        const ionPos = latticeIons[i];
        if (el.pos.distanceToSquared(ionPos) < 0.04) {
          // Collision!
          el.vel.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
          
          // Heat the ion
          const ionMesh = ionMeshRefs.current[i];
          if (ionMesh && (ionMesh.material as THREE.MeshStandardMaterial).emissiveIntensity < 2.0) {
            (ionMesh.material as THREE.MeshStandardMaterial).emissiveIntensity += eField * 0.5;
          }

          // Emit a spark
          if (eField > 0) {
            const sd = sparkData[nextSpark.current];
            sd.pos.copy(ionPos).add(new THREE.Vector3((Math.random()-0.5)*0.2, Math.random()*0.3, (Math.random()-0.5)*0.2));
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
        if (mat.emissiveIntensity > 0.2) mat.emissiveIntensity -= delta * 1.5;
      }
    });

    // Update sparks
    sparkData.forEach((sd, i) => {
      const mesh = sparkRefs.current[i];
      if (sd.life > 0) {
        sd.life -= delta * 3.0;
        sd.pos.y += delta * 0.5; // rise up
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
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} />

      {/* Wire Outline */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh ref={wireRef}>
          <cylinderGeometry args={[0.7, 0.7, 5.0, 32]} />
          <meshStandardMaterial color="#b45309" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Internal Microscopic View */}
      <group ref={ionsGroupRef}>
        {latticeIons.map((pos, i) => (
          <mesh key={`ion-${i}`} position={pos} ref={(el) => { ionMeshRefs.current[i] = el; }}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#ea580c" emissive="#9a3412" emissiveIntensity={0.2} roughness={0.3} />
          </mesh>
        ))}
      </group>

      <group ref={electronsGroupRef}>
        {electrons.map((el, i) => (
          <mesh key={`el-${i}`} ref={el.meshRef}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* Sparks */}
      <group>
        {sparkData.map((_, i) => (
          <mesh key={`spark-${i}`} ref={(el) => { sparkRefs.current[i] = el; }} visible={false}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        ))}
      </group>
      
      {/* HUD Vectors for Micro view */}
      {!isGlobal && eField > 0 && (
        <group position={[0, 1.0, 0]}>
          {/* E Field */}
          <group position={[0, 0, 0]}>
            <Cylinder args={[0.015, 0.015, 1.0 * eField]} rotation={[0, 0, -Math.PI / 2]} position={[0.5 * eField, 0, 0]}>
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </Cylinder>
            <mesh position={[1.0 * eField, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.2, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
            </mesh>
            <Html position={[1.0 * eField + 0.2, 0, 0]} center className="text-cyan-400 font-bold text-xs pointer-events-none">
              <LatexMath math="\vec{E}" />
            </Html>
          </group>

          {/* j Current Density */}
          <group position={[0, -0.3, 0]}>
            <Cylinder args={[0.02, 0.02, 1.2 * eField]} rotation={[0, 0, -Math.PI / 2]} position={[0.6 * eField, 0, 0]}>
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
            </Cylinder>
            <mesh position={[1.2 * eField, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.08, 0.25, 16]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
            </mesh>
            <Html position={[1.2 * eField + 0.2, 0, 0]} center className="text-amber-400 font-bold text-xs pointer-events-none">
              <LatexMath math="\vec{j}" />
            </Html>
          </group>
        </group>
      )}

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={15} blur={2.0} />
      <OrbitControls enableZoom={true} maxDistance={12} minDistance={3} autoRotate={isGlobal} autoRotateSpeed={2.0} />
    </>
  );
}

export default function JouleEnergy3DCanvas() {
  const [isGlobal, setIsGlobal] = useState(false);
  
  // Interactive Variables
  const [eField, setEField] = useState(1.0); // Micro: 0.0 to 2.0
  const [voltageV, setVoltageV] = useState(5.0); // Macro: 0.0 to 10.0
  
  // Live calculations
  const gamma = 5.0; // arbitrary conductivity scale for visualization
  const pJ = (gamma * eField * eField).toFixed(1);
  
  const R = 2.0; // Resistance
  const PJ = ((voltageV * voltageV) / R).toFixed(1);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-6">
      
      {/* ── TOP NAV BAR ── */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center gap-2 flex-wrap">
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setIsGlobal(false)}
            className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              !isGlobal ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Vue Locale (Micro)
          </button>
          <button
            onClick={() => setIsGlobal(true)}
            className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              isGlobal ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Vue Globale (Macro)
          </button>
        </div>

        {/* Dynamic Interactive Controls */}
        <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
          <Settings2 size={16} className="text-slate-400" />
          {!isGlobal ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold">Champ <LatexMath math="E" /> :</span>
              <input 
                type="range" min="0" max="2" step="0.1" value={eField} onChange={(e) => setEField(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-800 rounded appearance-none accent-cyan-500" 
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold">Tension <LatexMath math="U" /> :</span>
              <input 
                type="range" min="0" max="10" step="0.5" value={voltageV} onChange={(e) => setVoltageV(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-800 rounded appearance-none accent-rose-500" 
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 3D CANVAS & OVERLAYS ── */}
      <div className="w-full h-[350px] sm:h-[450px] relative bg-[#030008]">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 7.0], fov: 45 }}>
          <Suspense fallback={null}>
            <InternalLatticeScene isGlobal={isGlobal} eField={eField} voltageV={voltageV} />
          </Suspense>
        </Canvas>

        {/* Informational HUD Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 p-4 sm:p-5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700 shadow-2xl max-w-[280px] pointer-events-none transition-all duration-500">
          {!isGlobal ? (
            <div className="space-y-3 animate-in fade-in zoom-in-95">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Intérieur du Conducteur
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Le champ <LatexMath math="\vec{E}" /> accélère les électrons. En heurtant les ions fixes, ils perdent leur énergie cinétique qui se transforme en chaleur.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Conductivité <LatexMath math="\gamma" /></span>
                  <span className="font-mono text-white">{gamma.toFixed(1)}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Champ <LatexMath math="E" /></span>
                  <span className="font-mono text-cyan-400">{eField.toFixed(1)} V/m</span>
                </div>
                <div className="p-2.5 mt-2 rounded-lg bg-slate-950 border border-amber-500/30 text-center shadow-inner">
                  <div className="text-[10px] text-slate-400 mb-1">Puissance Volumique Locale</div>
                  <span className="text-amber-400 font-mono font-bold text-sm"><LatexMath math={`p_J = ${pJ} \\text{ W/m}^3`} /></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in zoom-in-95">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Échelle Macroscopique
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                À l&apos;échelle globale, la puissance dissipée par le composant est la somme de toutes les puissances locales <LatexMath math="p_J" />.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Résistance <LatexMath math="R" /></span>
                  <span className="font-mono text-white">{R.toFixed(1)} <LatexMath math="\Omega" /></span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Tension <LatexMath math="U" /></span>
                  <span className="font-mono text-rose-400">{voltageV.toFixed(1)} V</span>
                </div>
                <div className="p-2.5 mt-2 rounded-lg bg-slate-950 border border-rose-600/50 text-center shadow-inner">
                  <div className="text-[10px] text-slate-400 mb-1">Puissance Totale (Loi de Joule)</div>
                  <span className="text-rose-500 font-mono font-bold text-sm"><LatexMath math={`P_J = ${PJ} \\text{ W}`} /></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
