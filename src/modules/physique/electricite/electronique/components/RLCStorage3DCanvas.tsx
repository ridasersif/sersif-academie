"use client";

import React, { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Box, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Zap, Magnet, Flame, ShieldAlert, LineChart } from "lucide-react";

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
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 2.4, 32]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.4}
            metalness={0.2}
            emissive="#ea580c"
            emissiveIntensity={intensity * 0.8}
          />
        </mesh>

        {[-0.75, -0.25, 0.25, 0.75].map((x, idx) => {
          const bandColors = ["#b91c1c", "#000000", "#d97706", "#eab308"];
          return (
            <mesh key={idx} position={[0, x, 0]}>
              <cylinderGeometry args={[0.41, 0.41, 0.1, 32]} />
              <meshStandardMaterial color={bandColors[idx]} roughness={0.3} metalness={0.5} />
            </mesh>
          );
        })}

        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.15, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.15, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>

        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      <Html position={[0, -1.3, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-rose-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 backdrop-blur whitespace-nowrap shadow">
          <LatexMath math={`U = R \\cdot I = ${voltage} \\text{ V}`} />
        </div>
      </Html>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.4} scale={5} blur={1.8} />
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
    const halfH = 0.8;
    const halfW = 0.8;
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
      <Box position={[-plateDist / 2, 0, 0]} args={[0.07, 2.1, 2.1]}>
        <meshStandardMaterial
          color={leftColor}
          metalness={0.8}
          roughness={0.2}
          emissive={leftColor}
          emissiveIntensity={intensity * 0.5}
        />
      </Box>

      <Box position={[plateDist / 2, 0, 0]} args={[0.07, 2.1, 2.1]}>
        <meshStandardMaterial
          color={rightColor}
          metalness={0.8}
          roughness={0.2}
          emissive={rightColor}
          emissiveIntensity={intensity * 0.5}
        />
      </Box>

      <Cylinder position={[-plateDist / 2 - 0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.03, 0.03, 0.9, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder position={[plateDist / 2 + 0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.03, 0.03, 0.9, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {voltage > 0 && (
        <Box position={[0, 0, 0]} args={[plateDist - 0.07, 2.0, 2.0]}>
          <meshStandardMaterial color="#38bdf8" transparent opacity={intensity * 0.15} roughness={0.1} />
        </Box>
      )}

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
                    0.14,
                    0.07
                  )
                }
              />
            </group>
          );
        })}

      <Html position={[0, -1.3, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-cyan-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 backdrop-blur whitespace-nowrap shadow">
          <LatexMath math="\vec{E} = \frac{u_C}{d}\,\vec{u}_x" />
        </div>
      </Html>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.4} scale={5} blur={1.8} />
    </group>
  );
}

/* ── 3. Inductor 3D Scene ── */
function Inductor3DScene({ current, numTurns = 8 }: { current: number; numTurns?: number }) {
  const coilCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const length = 3.2;
    const radius = 0.6;
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
    return new THREE.TubeGeometry(coilCurve, 140, 0.05, 12, false);
  }, [coilCurve]);

  const bFieldArrows = useMemo(() => {
    const arrows: THREE.Vector3[] = [];
    const countRings = 3;
    const rad = 0.28;
    for (let k = 0; k < countRings; k++) {
      const ang = (k / countRings) * Math.PI * 2;
      arrows.push(new THREE.Vector3(-1.4, Math.cos(ang) * rad, Math.sin(ang) * rad));
    }
    arrows.push(new THREE.Vector3(-1.4, 0, 0));
    return arrows;
  }, []);

  const intensity = Math.min(Math.abs(current) / 10, 1);

  return (
    <group>
      <Cylinder position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.22, 0.22, 3.4, 32]}>
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} transparent opacity={0.35} />
      </Cylinder>

      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.85}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={intensity * 0.4}
        />
      </mesh>

      {current > 0 &&
        bFieldArrows.map((startPos, idx) => (
          <group key={idx} position={startPos.toArray()}>
            <primitive
              object={
                new THREE.ArrowHelper(
                  new THREE.Vector3(1, 0, 0),
                  new THREE.Vector3(0, 0, 0),
                  2.8,
                  0x10b981,
                  0.2,
                  0.1
                )
              }
            />
          </group>
        ))}

      <Html position={[0, -1.3, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 backdrop-blur whitespace-nowrap shadow">
          <LatexMath math="\vec{B} = \mu_0 n i\,\vec{u}_x" />
        </div>
      </Html>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.4} scale={5} blur={1.8} />
    </group>
  );
}

/* ── 2D Interactive Physics Response Curve (SVG Graph) ── */
function DynamicResponseGraph({
  tab,
  voltage,
  resistance,
  capacitance,
  inductance,
  current,
}: {
  tab: "resistor" | "capacitor" | "inductor";
  voltage: number;
  resistance: number;
  capacitance: number;
  inductance: number;
  current: number;
}) {
  const width = 280;
  const height = 180;
  const padL = 38;
  const padR = 15;
  const padT = 20;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Generate curve points
  const pointsCount = 40;

  let curve1Points = "";
  let curve2Points = "";
  let legend1 = "";
  let legend2 = "";
  let color1 = "#06b6d4";
  let color2 = "#f43f5e";
  let regimeText = "";

  if (tab === "capacitor") {
    // Charging: u_C(t) = U (1 - e^-t) & i_C(t) = (U/R) e^-t
    legend1 = `u_C(t) → ${voltage} V`;
    legend2 = "i_C(t) → 0 A";
    color1 = "#06b6d4";
    color2 = "#f43f5e";
    regimeText = "Régime Continu (t → ∞) : i_C = 0 (Interrupteur ouvert)";

    const pts1: string[] = [];
    const pts2: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = (i / pointsCount) * 5; // 0 to 5 tau
      const uVal = 1 - Math.exp(-tNorm); // 0 to 1
      const iVal = Math.exp(-tNorm); // 1 to 0
      const x = padL + (i / pointsCount) * plotW;
      const y1 = padT + (1 - uVal) * plotH;
      const y2 = padT + (1 - iVal) * plotH;
      pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
      pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
    curve2Points = pts2.join(" ");

  } else if (tab === "inductor") {
    // Current establishment: i_L(t) = I (1 - e^-t) & u_L(t) = U e^-t
    legend1 = `i_L(t) → ${current.toFixed(1)} A`;
    legend2 = "u_L(t) → 0 V";
    color1 = "#f59e0b";
    color2 = "#f43f5e";
    regimeText = "Régime Continu (t → ∞) : u_L = 0 (Fil / Court-circuit)";

    const pts1: string[] = [];
    const pts2: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = (i / pointsCount) * 5;
      const iVal = 1 - Math.exp(-tNorm);
      const uVal = Math.exp(-tNorm);
      const x = padL + (i / pointsCount) * plotW;
      const y1 = padT + (1 - iVal) * plotH;
      const y2 = padT + (1 - uVal) * plotH;
      pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
      pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
    curve2Points = pts2.join(" ");

  } else {
    // Resistor Characteristic: U = R * I (Linear)
    legend1 = `U = ${resistance.toFixed(1)} · I (Pente R)`;
    legend2 = `Point : (${(voltage/resistance).toFixed(2)}A, ${voltage}V)`;
    color1 = "#f43f5e";
    color2 = "#fbbf24";
    regimeText = `Régime Continu : U = R·I (P_J = ${((voltage*voltage)/resistance).toFixed(1)} W)`;

    const pts1: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const frac = i / pointsCount;
      const x = padL + frac * plotW;
      const y = padT + (1 - frac) * plotH;
      pts1.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 uppercase">
          <LineChart className="w-3.5 h-3.5 text-cyan-400" />
          {tab === "resistor" ? "Caractéristique U = f(I)" : "Réponse Transitoire & Régime Continu"}
        </span>
        <span className="text-[9px] font-mono text-slate-400">
          {tab === "resistor" ? "τ = 0 (Instantané)" : "5τ (Permanent)"}
        </span>
      </div>

      {/* SVG Plot */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[280px] h-auto overflow-visible">
          {/* Background Grid */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#334155" strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="#334155" strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="#334155" strokeDasharray="2 2" strokeWidth="0.8" />

          {/* Axes */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW + 10} y2={padT + plotH} stroke="#94a3b8" strokeWidth="1.2" />
          <line x1={padL} y1={padT + plotH} x2={padL} y2={padT - 8} stroke="#94a3b8" strokeWidth="1.2" />

          {/* Axis Labels */}
          <text x={padL + plotW + 6} y={padT + plotH + 3} fill="#94a3b8" fontSize="9" fontWeight="bold">
            {tab === "resistor" ? "I" : "t"}
          </text>
          <text x={padL - 10} y={padT - 2} fill="#94a3b8" fontSize="9" fontWeight="bold">
            {tab === "resistor" ? "U" : "u, i"}
          </text>
          <text x={padL - 12} y={padT + plotH + 10} fill="#64748b" fontSize="8">0</text>
          <text x={padL + plotW - 8} y={padT + plotH + 12} fill="#64748b" fontSize="8 font-mono">
            {tab === "resistor" ? "I_max" : "5τ"}
          </text>

          {/* Curve 1 */}
          <polyline fill="none" stroke={color1} strokeWidth="2.2" points={curve1Points} strokeLinecap="round" />

          {/* Curve 2 (if transient) */}
          {curve2Points && (
            <polyline fill="none" stroke={color2} strokeWidth="1.6" strokeDasharray="3 2" points={curve2Points} strokeLinecap="round" />
          )}

          {/* Operating Point on Resistor */}
          {tab === "resistor" && (
            <circle
              cx={padL + (Math.min(voltage / 20, 1.0)) * plotW}
              cy={padT + (1 - Math.min(voltage / 20, 1.0)) * plotH}
              r="4.5"
              fill="#fbbf24"
              stroke="#000"
              strokeWidth="1.5"
            />
          )}

          {/* Permanent Regime Zone Highlight */}
          {tab !== "resistor" && (
            <rect
              x={padL + plotW * 0.7}
              y={padT}
              width={plotW * 0.3}
              height={plotH}
              fill="#10b981"
              opacity="0.08"
            />
          )}
        </svg>
      </div>

      {/* Legend & Regime Status */}
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1" style={{ color: color1 }}>
            <span className="w-2 h-0.5 rounded" style={{ backgroundColor: color1 }}></span>
            {legend1}
          </span>
          {legend2 && (
            <span className="flex items-center gap-1" style={{ color: color2 }}>
              <span className="w-2 h-0.5 rounded border-b border-dashed" style={{ borderColor: color2 }}></span>
              {legend2}
            </span>
          )}
        </div>
        <div className="text-[9.5px] text-emerald-400 font-sans text-center bg-slate-900/90 py-0.5 px-1.5 rounded border border-slate-800">
          {regimeText}
        </div>
      </div>
    </div>
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

  const getSliderStyle = (val: number, min: number, max: number, color: string) => {
    const pct = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
    return {
      background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #1e293b ${pct}%, #1e293b 100%)`,
    };
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col space-y-3 p-3.5 sm:p-4">
      
      {/* ── 1. TOP BAR : 3-DIPOLE SELECTOR BUTTONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Modèles Réactifs R, L, C :
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("resistor")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "resistor"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Résistance (R)
          </button>
          <button
            onClick={() => setActiveTab("capacitor")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "capacitor"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Condensateur (C)
          </button>
          <button
            onClick={() => setActiveTab("inductor")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "inductor"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            Bobine (L)
          </button>
        </div>
      </div>

      {/* ── 2. MIDDLE SECTION : 3D VIEWPORT (LEFT) + 2D DYNAMIC GRAPH (RIGHT) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[260px] sm:min-h-[290px]">
        {/* Left: 3D Viewport */}
        <div className="md:col-span-7 h-[240px] sm:h-[280px] md:h-auto rounded-xl overflow-hidden border border-slate-800 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.3, 4.4], fov: 46 }}>
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
            <OrbitControls enableZoom={true} maxDistance={7.5} minDistance={2.8} />
          </Canvas>

          <div className="absolute bottom-2 right-2 pointer-events-none text-[9px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            🖱️ 3D Interactif
          </div>
        </div>

        {/* Right: 2D Dynamic Physics Response Graph */}
        <div className="md:col-span-5 h-[220px] sm:h-[260px] md:h-auto flex flex-col">
          <DynamicResponseGraph
            tab={activeTab}
            voltage={activeTab === "resistor" ? resVoltage : capVoltage}
            resistance={resistance}
            capacitance={capacitance}
            inductance={inductance}
            current={activeTab === "inductor" ? indCurrent : parseFloat(resCurrent)}
          />
        </div>
      </div>

      {/* ── 3. BOTTOM SECTION : SLIDERS IN A SINGLE ROW + METRICS BAR ── */}
      <div className="space-y-2.5 pt-1">
        {/* Sliders Grid Row */}
        {activeTab === "resistor" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
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

        {/* Compact Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className={`p-2 rounded-xl border flex items-center justify-between ${
            activeTab === "resistor"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : activeTab === "capacitor"
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <span className="text-[11px] font-semibold text-slate-300">
              {activeTab === "resistor" ? "Puissance Dissipée (Joule) :" : "Énergie Stockée :"}
            </span>
            <span className="font-mono font-bold text-sm">
              {activeTab === "resistor" ? (
                <LatexMath math={`P_J = ${resPower} \\text{ W}`} />
              ) : activeTab === "capacitor" ? (
                <LatexMath math={`\\mathcal{E}_e = ${capEnergy_mJ.toFixed(3)} \\text{ mJ}`} />
              ) : (
                <LatexMath math={`\\mathcal{E}_m = ${indEnergy_mJ.toFixed(3)} \\text{ mJ}`} />
              )}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {activeTab === "resistor" ? (
              <span>Régime continu : <LatexMath math="U = R I" /> ({resCurrent} A)</span>
            ) : activeTab === "capacitor" ? (
              <span>Régime continu : Interrupteur ouvert (<LatexMath math="i_C = 0" />)</span>
            ) : (
              <span>Régime continu : Court-circuit / Fil (<LatexMath math="u_L = 0" />)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
