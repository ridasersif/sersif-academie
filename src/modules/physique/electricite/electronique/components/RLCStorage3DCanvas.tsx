"use client";

import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Box, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Zap, Magnet, Flame, BatteryCharging, ShieldAlert } from "lucide-react";

/* ── 1. Resistor 3D Scene ── */
function Resistor3DScene({
  voltage,
  resistance,
}: {
  voltage: number;
  resistance: number;
}) {
  const current = voltage / resistance;
  const power = (voltage * voltage) / resistance;
  const intensity = Math.min(power / 30, 1.0);

  return (
    <group>
      {/* Resistor Body */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 2.6, 32]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.4}
            metalness={0.2}
            emissive="#ea580c"
            emissiveIntensity={intensity * 0.8}
          />
        </mesh>

        {/* Color Bands (Resistor Code) */}
        {[-0.8, -0.3, 0.2, 0.8].map((x, idx) => {
          const bandColors = ["#b91c1c", "#000000", "#d97706", "#eab308"];
          return (
            <mesh key={idx} position={[0, x, 0]}>
              <cylinderGeometry args={[0.43, 0.43, 0.12, 32]} />
              <meshStandardMaterial color={bandColors[idx]} roughness={0.3} metalness={0.5} />
            </mesh>
          );
        })}

        {/* Metal End Caps */}
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.2, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.2, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Connecting Wires */}
        <mesh position={[0, -2.0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 3D Dynamic Label */}
      <Html position={[0, -1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-rose-400 font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-rose-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          <LatexMath math={`U = R \\cdot I \\implies I = ${current.toFixed(2)}\\text{ A}`} />
        </div>
      </Html>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={6} blur={1.8} />
    </group>
  );
}

/* ── 2. Capacitor 3D Scene ── */
function Capacitor3DScene({
  voltage,
  plateDist,
}: {
  voltage: number;
  plateDist: number;
}) {
  const eFieldVectors = useMemo(() => {
    const vectors: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const countY = 4;
    const countZ = 4;
    const halfH = 0.85;
    const halfW = 0.85;
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

  const intensity = Math.min(Math.abs(voltage) / 24, 1);
  const leftColor = voltage >= 0 ? "#ef4444" : "#3b82f6";
  const rightColor = voltage >= 0 ? "#3b82f6" : "#ef4444";

  return (
    <group>
      {/* Left Plate */}
      <Box position={[-plateDist / 2, 0, 0]} args={[0.08, 2.3, 2.3]}>
        <meshStandardMaterial
          color={leftColor}
          metalness={0.8}
          roughness={0.2}
          emissive={leftColor}
          emissiveIntensity={intensity * 0.5}
        />
      </Box>

      {/* Right Plate */}
      <Box position={[plateDist / 2, 0, 0]} args={[0.08, 2.3, 2.3]}>
        <meshStandardMaterial
          color={rightColor}
          metalness={0.8}
          roughness={0.2}
          emissive={rightColor}
          emissiveIntensity={intensity * 0.5}
        />
      </Box>

      {/* Lead Connecting Wires */}
      <Cylinder position={[-plateDist / 2 - 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.035, 0.035, 1.0, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder position={[plateDist / 2 + 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.035, 0.035, 1.0, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Glowing E-field Volume */}
      {voltage > 0 && (
        <Box position={[0, 0, 0]} args={[plateDist - 0.08, 2.2, 2.2]}>
          <meshStandardMaterial color="#38bdf8" transparent opacity={intensity * 0.15} roughness={0.1} />
        </Box>
      )}

      {/* Electric Field Vector Arrows */}
      {voltage > 0 &&
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
                    0x38bdf8,
                    0.15,
                    0.08
                  )
                }
              />
            </group>
          );
        })}

      {/* 3D Floating Field Label */}
      <Html position={[0, -1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-cyan-400 font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          <LatexMath math="\vec{E} = \frac{u_C}{d}\,\vec{u}_x" />
        </div>
      </Html>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={6} blur={1.8} />
    </group>
  );
}

/* ── 3. Inductor 3D Scene ── */
function Inductor3DScene({ current, numTurns = 8 }: { current: number; numTurns?: number }) {
  const coilCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const length = 3.4;
    const radius = 0.65;
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
    return new THREE.TubeGeometry(coilCurve, 160, 0.055, 12, false);
  }, [coilCurve]);

  const bFieldArrows = useMemo(() => {
    const arrows: THREE.Vector3[] = [];
    const countRings = 3;
    const rad = 0.32;
    for (let k = 0; k < countRings; k++) {
      const ang = (k / countRings) * Math.PI * 2;
      arrows.push(new THREE.Vector3(-1.5, Math.cos(ang) * rad, Math.sin(ang) * rad));
    }
    arrows.push(new THREE.Vector3(-1.5, 0, 0));
    return arrows;
  }, []);

  const intensity = Math.min(Math.abs(current) / 10, 1);

  return (
    <group>
      {/* Ferromagnetic Core Axis */}
      <Cylinder position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.24, 0.24, 3.6, 32]}>
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} transparent opacity={0.35} />
      </Cylinder>

      {/* Copper Wire Coil */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.85}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={intensity * 0.4}
        />
      </mesh>

      {/* Core B-Field Lines */}
      {current > 0 &&
        bFieldArrows.map((startPos, idx) => (
          <group key={idx} position={startPos.toArray()}>
            <primitive
              object={
                new THREE.ArrowHelper(
                  new THREE.Vector3(1, 0, 0),
                  new THREE.Vector3(0, 0, 0),
                  3.0,
                  0x10b981,
                  0.22,
                  0.11
                )
              }
            />
          </group>
        ))}

      {/* 3D Field Label */}
      <Html position={[0, -1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-amber-400 font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          <LatexMath math="\vec{B} = \mu_0 n i\,\vec{u}_x" />
        </div>
      </Html>

      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={6} blur={1.8} />
    </group>
  );
}

export default function RLCStorage3DCanvas() {
  const [activeTab, setActiveTab] = useState<"resistor" | "capacitor" | "inductor">("capacitor");
  
  // Resistor parameters
  const [resVoltage, setResVoltage] = useState(10); // V
  const [resistance, setResistance] = useState(5.0); // Ohm

  // Capacitor parameters
  const [capVoltage, setCapVoltage] = useState(12); // V
  const [capacitance, setCapacitance] = useState(2.2); // uF
  const [plateDist, setPlateDist] = useState(1.4); // cm

  // Inductor parameters
  const [indCurrent, setIndCurrent] = useState(4.0); // A
  const [inductance, setInductance] = useState(20); // mH

  // Live Calculations
  const resCurrent = (resVoltage / resistance).toFixed(2);
  const resPower = ((resVoltage * resVoltage) / resistance).toFixed(1);

  const capEnergy_mJ = 0.5 * (capacitance * 1e-6) * (capVoltage * capVoltage) * 1e3;
  const indEnergy_mJ = 0.5 * (inductance * 1e-3) * (indCurrent * indCurrent) * 1e3;

  // Helper for custom colored slider tracks
  const getSliderStyle = (val: number, min: number, max: number, color: string) => {
    const pct = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    return {
      background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #1e293b ${pct}%, #1e293b 100%)`,
    };
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col md:grid md:grid-cols-12 min-h-[340px]">
      
      {/* ── LEFT PANEL: CONTROLS & ENERGY READINGS (Lisare) ── */}
      <div className="md:col-span-5 p-3.5 sm:p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 space-y-3">
        
        {/* 3-Dipole Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            Choix du Dipôle
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("resistor")}
              className={`py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
                activeTab === "resistor"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3 h-3" />
              Résistance
            </button>
            <button
              onClick={() => setActiveTab("capacitor")}
              className={`py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
                activeTab === "capacitor"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3 h-3" />
              Condensateur
            </button>
            <button
              onClick={() => setActiveTab("inductor")}
              className={`py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
                activeTab === "inductor"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Magnet className="w-3 h-3" />
              Bobine
            </button>
          </div>
        </div>

        {/* Dynamic Sliders with Colorful Filled Tracks */}
        {activeTab === "resistor" && (
          <div className="space-y-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Tension <LatexMath math="U" /></span>
                <span className="font-mono text-rose-400 font-bold">{resVoltage} V</span>
              </div>
              <input
                type="range" min="0" max="20" step="1" value={resVoltage}
                onChange={(e) => setResVoltage(parseFloat(e.target.value))}
                style={getSliderStyle(resVoltage, 0, 20, "#f43f5e")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Résistance <LatexMath math="R" /></span>
                <span className="font-mono text-amber-400 font-bold">{resistance.toFixed(1)} <LatexMath math="\Omega" /></span>
              </div>
              <input
                type="range" min="1" max="10" step="0.5" value={resistance}
                onChange={(e) => setResistance(parseFloat(e.target.value))}
                style={getSliderStyle(resistance, 1, 10, "#f59e0b")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        )}

        {activeTab === "capacitor" && (
          <div className="space-y-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Tension <LatexMath math="u_C" /></span>
                <span className="font-mono text-cyan-400 font-bold">{capVoltage} V</span>
              </div>
              <input
                type="range" min="0" max="24" step="1" value={capVoltage}
                onChange={(e) => setCapVoltage(parseFloat(e.target.value))}
                style={getSliderStyle(capVoltage, 0, 24, "#06b6d4")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Capacité <LatexMath math="C" /></span>
                <span className="font-mono text-indigo-400 font-bold">{capacitance} µF</span>
              </div>
              <input
                type="range" min="0.5" max="10" step="0.5" value={capacitance}
                onChange={(e) => setCapacitance(parseFloat(e.target.value))}
                style={getSliderStyle(capacitance, 0.5, 10, "#6366f1")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Écartement <LatexMath math="d" /></span>
                <span className="font-mono text-emerald-400 font-bold">{plateDist.toFixed(1)} cm</span>
              </div>
              <input
                type="range" min="0.8" max="2.2" step="0.1" value={plateDist}
                onChange={(e) => setPlateDist(parseFloat(e.target.value))}
                style={getSliderStyle(plateDist, 0.8, 2.2, "#10b981")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        )}

        {activeTab === "inductor" && (
          <div className="space-y-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Courant <LatexMath math="i_L" /></span>
                <span className="font-mono text-amber-400 font-bold">{indCurrent.toFixed(1)} A</span>
              </div>
              <input
                type="range" min="0" max="10" step="0.5" value={indCurrent}
                onChange={(e) => setIndCurrent(parseFloat(e.target.value))}
                style={getSliderStyle(indCurrent, 0, 10, "#f59e0b")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Inductance <LatexMath math="L" /></span>
                <span className="font-mono text-purple-400 font-bold">{inductance} mH</span>
              </div>
              <input
                type="range" min="5" max="50" step="5" value={inductance}
                onChange={(e) => setInductance(parseFloat(e.target.value))}
                style={getSliderStyle(inductance, 5, 50, "#a855f7")}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        )}

        {/* Live Stored Energy / Dissipation Card */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 shadow-inner">
          <div className="text-[9px] uppercase font-bold text-slate-400 text-center">
            {activeTab === "resistor"
              ? "Puissance Thermique Dissipée (Joule)"
              : activeTab === "capacitor"
              ? "Énergie Électrostatique Stockée"
              : "Énergie Magnétique Stockée"}
          </div>

          <div className={`p-2 rounded-lg border text-center ${
            activeTab === "resistor"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : activeTab === "capacitor"
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <div className="font-mono font-extrabold text-base">
              {activeTab === "resistor" ? (
                <LatexMath math={`P_J = ${resPower} \\text{ W}`} />
              ) : activeTab === "capacitor" ? (
                <LatexMath math={`\\mathcal{E}_e = ${capEnergy_mJ.toFixed(3)} \\text{ mJ}`} />
              ) : (
                <LatexMath math={`\\mathcal{E}_m = ${indEnergy_mJ.toFixed(3)} \\text{ mJ}`} />
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {activeTab === "resistor" ? (
                <span><LatexMath math="P_J = R I^2 = U I" /> • Énergie stockée = 0</span>
              ) : activeTab === "capacitor" ? (
                <LatexMath math="\mathcal{E}_e = \frac{1}{2} C u_C^2" />
              ) : (
                <LatexMath math="\mathcal{E}_m = \frac{1}{2} L i_L^2" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-300 bg-slate-950 p-1 rounded border border-slate-800">
            <ShieldAlert className="w-3 h-3 text-cyan-400 shrink-0" />
            {activeTab === "resistor" ? (
              <span>Régime continu : Résistance <LatexMath math="U = R I" /> ({resCurrent} A)</span>
            ) : activeTab === "capacitor" ? (
              <span>Régime continu : Interrupteur ouvert (<LatexMath math="i_C = 0" />)</span>
            ) : (
              <span>Régime continu : Fil / Court-circuit (<LatexMath math="u_L = 0" />)</span>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: 3D INTERACTIVE VIEWPORT (Limane) ── */}
      <div className="md:col-span-7 h-[260px] sm:h-[300px] md:h-auto min-h-[260px] md:min-h-[340px] relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.4, 4.8], fov: 46 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 7, 5]} intensity={1.6} />
          <directionalLight position={[-5, -4, -4]} intensity={0.5} />
          <Suspense fallback={null}>
            {activeTab === "resistor" ? (
              <Resistor3DScene voltage={resVoltage} resistance={resistance} />
            ) : activeTab === "capacitor" ? (
              <Capacitor3DScene voltage={capVoltage} plateDist={plateDist} />
            ) : (
              <Inductor3DScene current={indCurrent} numTurns={8} />
            )}
          </Suspense>
          <OrbitControls enableZoom={true} maxDistance={8.5} minDistance={3.0} />
        </Canvas>

        {/* 3D Hint */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
          🖱️ 3D Interactif • Tourner / Zoomer
        </div>
      </div>
    </div>
  );
}
