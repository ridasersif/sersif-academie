"use client";

import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Cylinder, Box, Html } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Zap, Magnet, Play, Pause, RotateCcw, Activity } from "lucide-react";

/* ── Capacitor 3D Scene ── */
function Capacitor3DScene({
  voltage,
  plateDist,
  isCharging,
}: {
  voltage: number;
  plateDist: number;
  isCharging: boolean;
}) {
  const eFieldVectors = useMemo(() => {
    const vectors: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const countY = 5;
    const countZ = 5;
    const halfH = 1.2;
    const halfW = 1.2;
    const xLeft = -plateDist / 2;
    const xRight = plateDist / 2;

    for (let i = 0; i < countY; i++) {
      for (let j = 0; j < countZ; j++) {
        const y = -halfH + (i / (countY - 1)) * 2 * halfH;
        const z = -halfW + (j / (countZ - 1)) * 2 * halfW;
        vectors.push({
          start: new THREE.Vector3(xLeft + 0.05, y, z),
          end: new THREE.Vector3(xRight - 0.05, y, z),
        });
      }
    }
    return vectors;
  }, [plateDist]);

  const chargeParticles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      leftY: (Math.random() - 0.5) * 2.4,
      leftZ: (Math.random() - 0.5) * 2.4,
      rightY: (Math.random() - 0.5) * 2.4,
      rightZ: (Math.random() - 0.5) * 2.4,
    }));
  }, []);

  const intensity = Math.min(Math.abs(voltage) / 12, 1);
  const leftColor = voltage >= 0 ? "#ef4444" : "#3b82f6"; // Red (+) or Blue (-)
  const rightColor = voltage >= 0 ? "#3b82f6" : "#ef4444"; // Blue (-) or Red (+)

  return (
    <group>
      {/* Left Plate (+Q) */}
      <Box
        position={[-plateDist / 2, 0, 0]}
        args={[0.08, 2.8, 2.8]}
      >
        <meshStandardMaterial
          color={leftColor}
          metalness={0.7}
          roughness={0.3}
          emissive={leftColor}
          emissiveIntensity={intensity * 0.4}
        />
      </Box>

      {/* Right Plate (-Q) */}
      <Box
        position={[plateDist / 2, 0, 0]}
        args={[0.08, 2.8, 2.8]}
      >
        <meshStandardMaterial
          color={rightColor}
          metalness={0.7}
          roughness={0.3}
          emissive={rightColor}
          emissiveIntensity={intensity * 0.4}
        />
      </Box>

      {/* Connecting Wires */}
      <Cylinder
        position={[-plateDist / 2 - 0.6, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        args={[0.04, 0.04, 1.2, 16]}
      >
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder
        position={[plateDist / 2 + 0.6, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        args={[0.04, 0.04, 1.2, 16]}
      >
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Dielectric Glow / Volume */}
      <Box position={[0, 0, 0]} args={[plateDist - 0.08, 2.7, 2.7]}>
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={intensity * 0.18}
          roughness={0.1}
        />
      </Box>

      {/* Electric Field Vector Arrows */}
      {voltage !== 0 &&
        eFieldVectors.map((v, idx) => {
          const dir = v.end.clone().sub(v.start).normalize();
          const len = v.start.distanceTo(v.end);
          return (
            <group key={idx} position={v.start.toArray()}>
              <primitive
                object={
                  new THREE.ArrowHelper(
                    voltage >= 0 ? dir : dir.clone().negate(),
                    new THREE.Vector3(0, 0, 0),
                    len,
                    voltage >= 0 ? 0x38bdf8 : 0x818cf8,
                    0.15,
                    0.08
                  )
                }
              />
            </group>
          );
        })}

      {/* 3D Labels */}
      <Html position={[-plateDist / 2, 1.7, 0]} center distanceFactor={8}>
        <div className="bg-rose-500/90 text-white font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow border border-rose-400/50 backdrop-blur whitespace-nowrap">
          {voltage >= 0 ? "+Q (Armature A)" : "-Q (Armature A)"}
        </div>
      </Html>
      <Html position={[plateDist / 2, 1.7, 0]} center distanceFactor={8}>
        <div className="bg-blue-500/90 text-white font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow border border-blue-400/50 backdrop-blur whitespace-nowrap">
          {voltage >= 0 ? "-Q (Armature B)" : "+Q (Armature B)"}
        </div>
      </Html>
      <Html position={[0, -1.7, 0]} center distanceFactor={8}>
        <div className="bg-sky-950/80 text-sky-300 font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          Champ uniforme : <LatexMath math="\vec{E} = \frac{u_C}{d}\vec{u}_x" />
        </div>
      </Html>
    </group>
  );
}

/* ── Inductor 3D Scene ── */
function Inductor3DScene({
  current,
  numTurns = 8,
}: {
  current: number;
  numTurns?: number;
}) {
  const coilCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const length = 4.0;
    const radius = 0.8;
    const totalPoints = numTurns * 40;
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const x = -length / 2 + t * length;
      const angle = t * numTurns * Math.PI * 2;
      const y = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [numTurns]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(coilCurve, 200, 0.07, 12, false);
  }, [coilCurve]);

  // Magnetic B-field arrows in the core
  const bFieldArrows = useMemo(() => {
    const arrows: THREE.Vector3[] = [];
    const countRings = 3;
    const rad = 0.4;
    for (let k = 0; k < countRings; k++) {
      const ang = (k / countRings) * Math.PI * 2;
      arrows.push(new THREE.Vector3(-1.8, Math.cos(ang) * rad, Math.sin(ang) * rad));
    }
    arrows.push(new THREE.Vector3(-1.8, 0, 0)); // Center axis
    return arrows;
  }, []);

  const intensity = Math.min(Math.abs(current) / 5, 1);
  const coilColor = "#f59e0b"; // Copper amber

  return (
    <group>
      {/* Ferromagnetic Core / Air Core Axis */}
      <Cylinder
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        args={[0.3, 0.3, 4.4, 32]}
      >
        <meshStandardMaterial
          color="#334155"
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.35}
        />
      </Cylinder>

      {/* Copper Wire Coil */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={coilColor}
          metalness={0.85}
          roughness={0.2}
          emissive={coilColor}
          emissiveIntensity={intensity * 0.4}
        />
      </mesh>

      {/* Core B-Field Lines */}
      {current !== 0 &&
        bFieldArrows.map((startPos, idx) => (
          <group key={idx} position={startPos.toArray()}>
            <primitive
              object={
                new THREE.ArrowHelper(
                  current >= 0
                    ? new THREE.Vector3(1, 0, 0)
                    : new THREE.Vector3(-1, 0, 0),
                  new THREE.Vector3(0, 0, 0),
                  3.6,
                  0x10b981,
                  0.3,
                  0.15
                )
              }
            />
          </group>
        ))}

      {/* External Magnetic Loop Field visualization */}
      {current !== 0 && (
        <group>
          {[-1.2, 1.2].map((yOff, i) => (
            <mesh key={i} position={[0, yOff, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[1.5, 0.02, 16, 60, Math.PI]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={intensity * 0.4}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 3D Labels */}
      <Html position={[0, 1.5, 0]} center distanceFactor={8}>
        <div className="bg-amber-950/90 text-amber-300 font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow border border-amber-500/40 backdrop-blur whitespace-nowrap">
          Bobine d&apos;inductance <LatexMath math="L" /> • <LatexMath math="N" /> spires
        </div>
      </Html>
      <Html position={[0, -1.5, 0]} center distanceFactor={8}>
        <div className="bg-emerald-950/90 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          Champ interne : <LatexMath math="\vec{B} = \mu_0 n i\,\vec{u}_x" />
        </div>
      </Html>
    </group>
  );
}

export default function RLCStorage3DCanvas() {
  const [activeTab, setActiveTab] = useState<"capacitor" | "inductor">("capacitor");
  
  // Capacitor parameters
  const [voltage, setVoltage] = useState(10); // Volts
  const [capacitance, setCapacitance] = useState(2.2); // µF
  const [plateDist, setPlateDist] = useState(1.4); // cm proxy

  // Inductor parameters
  const [current, setCurrent] = useState(3.0); // Amperes
  const [inductance, setInductance] = useState(15); // mH

  // Stored Energies
  const capEnergy_mJ = 0.5 * (capacitance * 1e-6) * (voltage * voltage) * 1e3; // mJ
  const indEnergy_mJ = 0.5 * (inductance * 1e-3) * (current * current) * 1e3; // mJ

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-b from-card/95 to-card/70 overflow-hidden shadow-xl">
      {/* ── Top Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-border/60 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
              Laboratoire 3D : Stockage Réactif d&apos;Énergie
            </h3>
            <p className="text-xs text-muted-foreground">
              Visualisez les champs <LatexMath math="\vec{E}" /> et <LatexMath math="\vec{B}" /> et l&apos;énergie emmagasinée
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("capacitor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "capacitor"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Condensateur (C)
          </button>
          <button
            onClick={() => setActiveTab("inductor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "inductor"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            Bobine / Inductance (L)
          </button>
        </div>
      </div>

      {/* ── 3D Viewport & HUD ── */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Canvas camera={{ position: [0, 1.8, 5.0], fov: 48 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 5]} intensity={1.2} />
          <directionalLight position={[-6, -4, -5]} intensity={0.5} />
          <Suspense fallback={null}>
            {activeTab === "capacitor" ? (
              <Capacitor3DScene
                voltage={voltage}
                plateDist={plateDist}
                isCharging={false}
              />
            ) : (
              <Inductor3DScene current={current} numTurns={8} />
            )}
          </Suspense>
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2 + 0.2}
          />
        </Canvas>

        {/* Live Energy Floating Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/85 border border-slate-700/70 backdrop-blur-md shadow-2xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Énergie Réactive Stockée
            </span>
            <div className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
              {activeTab === "capacitor" ? (
                <span>
                  <LatexMath math={`\\mathcal{E}_e = ${capEnergy_mJ.toFixed(3)}\\text{ mJ}`} />
                </span>
              ) : (
                <span>
                  <LatexMath math={`\\mathcal{E}_m = ${indEnergy_mJ.toFixed(3)}\\text{ mJ}`} />
                </span>
              )}
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              {activeTab === "capacitor" ? (
                <span>
                  <LatexMath math="\\mathcal{E}_e = \\frac{1}{2} C u_C^2" /> (Forme Électrostatique)
                </span>
              ) : (
                <span>
                  <LatexMath math="\\mathcal{E}_m = \\frac{1}{2} L i_L^2" /> (Forme Magnétique)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 pointer-events-none text-[10px] text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur">
          🖱️ Glisser pour tourner la vue 3D
        </div>
      </div>

      {/* ── Control Panel & Physics Gauges ── */}
      <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-border/60">
        {activeTab === "capacitor" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Slider 1: Voltage */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-card/60 border border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Tension aux bornes <LatexMath math="u_C" /></span>
                <span className="text-cyan-400 font-mono font-bold">{voltage} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0 V</span>
                <span>12 V</span>
                <span>24 V</span>
              </div>
            </div>

            {/* Slider 2: Capacitance */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-card/60 border border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Capacité <LatexMath math="C" /></span>
                <span className="text-cyan-400 font-mono font-bold">{capacitance} µF</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={capacitance}
                onChange={(e) => setCapacitance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0.1 µF</span>
                <span>5 µF</span>
                <span>10 µF</span>
              </div>
            </div>

            {/* Slider 3: Plate Distance */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-card/60 border border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Écartement armatures <LatexMath math="d" /></span>
                <span className="text-cyan-400 font-mono font-bold">{plateDist.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={plateDist}
                onChange={(e) => setPlateDist(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0.8 cm</span>
                <span>1.6 cm</span>
                <span>2.5 cm</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Slider 1: Inductor Current */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-card/60 border border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Courant traversant <LatexMath math="i_L" /></span>
                <span className="text-amber-400 font-mono font-bold">{current.toFixed(1)} A</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.2"
                value={current}
                onChange={(e) => setCurrent(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0 A</span>
                <span>5 A</span>
                <span>10 A</span>
              </div>
            </div>

            {/* Slider 2: Inductance */}
            <div className="space-y-2 p-3 sm:p-4 rounded-xl bg-card/60 border border-border/60">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Inductance propre <LatexMath math="L" /></span>
                <span className="text-amber-400 font-mono font-bold">{inductance} mH</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={inductance}
                onChange={(e) => setInductance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>1 mH</span>
                <span>25 mH</span>
                <span>50 mH</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Key Insight Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-foreground/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-500/20 text-blue-400 font-bold">Loi Fondamentale</span>
            {activeTab === "capacitor" ? (
              <span>
                La puissance instantanée est une dérivée exacte : <LatexMath math="p_C(t) = u_C \cdot i = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2} C u_C^2\right)" />. Le condensateur <strong>ne dissipe aucune énergie</strong> par effet Joule.
              </span>
            ) : (
              <span>
                La puissance instantanée est une dérivée exacte : <LatexMath math="p_L(t) = u_L \cdot i = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2} L i^2\right)" />. La bobine idéale <strong>stocke et restitue</strong> l&apos;énergie sans perte.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
