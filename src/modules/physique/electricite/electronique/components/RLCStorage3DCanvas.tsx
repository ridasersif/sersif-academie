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
  const width = 300;
  const height = 185;
  const padL = 34;
  const padR = 26;
  const padT = 18;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  // Generate curve points
  const pointsCount = 40;

  let curve1Points = "";
  let curve2Points = "";
  let area1Points = "";
  let color1 = "#06b6d4";
  let color2 = "#f43f5e";

  // Dynamic calculations based on slider parameters
  if (tab === "capacitor") {
    color1 = "#06b6d4";
    color2 = "#f43f5e";

    // Voltage scale: 0 to 24 V, Capacitance scale: 0.5 to 10 uF (affects charging speed tau)
    const voltScale = Math.max(voltage / 24, 0.02);
    const tauFactor = 0.6 + (capacitance / 10) * 1.4; // higher C = slower charging curve

    const pts1: string[] = [];
    const pts2: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = (i / pointsCount) * 5;
      const uFrac = voltScale * (1 - Math.exp(-tNorm / tauFactor)); // Scaled directly with Voltage & C
      const iFrac = voltScale * Math.exp(-tNorm / tauFactor);
      const x = padL + (i / pointsCount) * plotW;
      const y1 = padT + (1 - Math.min(uFrac, 1.0)) * plotH;
      const y2 = padT + (1 - Math.min(iFrac, 1.0)) * plotH;
      pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
      pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
    curve2Points = pts2.join(" ");
    area1Points = `${padL},${padT + plotH} ${curve1Points} ${padL + plotW},${padT + plotH}`;

  } else if (tab === "inductor") {
    color1 = "#f59e0b";
    color2 = "#f43f5e";

    // Current scale: 0 to 10 A, Inductance scale: 5 to 50 mH (affects establishment speed tau)
    const currScale = Math.max(current / 10, 0.02);
    const tauFactor = 0.6 + (inductance / 50) * 1.4; // higher L = slower current rise

    const pts1: string[] = [];
    const pts2: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const tNorm = (i / pointsCount) * 5;
      const iFrac = currScale * (1 - Math.exp(-tNorm / tauFactor)); // Scaled directly with Current & L
      const uFrac = currScale * Math.exp(-tNorm / tauFactor);
      const x = padL + (i / pointsCount) * plotW;
      const y1 = padT + (1 - Math.min(iFrac, 1.0)) * plotH;
      const y2 = padT + (1 - Math.min(uFrac, 1.0)) * plotH;
      pts1.push(`${x.toFixed(1)},${y1.toFixed(1)}`);
      pts2.push(`${x.toFixed(1)},${y2.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
    curve2Points = pts2.join(" ");
    area1Points = `${padL},${padT + plotH} ${curve1Points} ${padL + plotW},${padT + plotH}`;

  } else {
    color1 = "#f43f5e";
    color2 = "#fbbf24";

    // Resistor Characteristic: U = R * I (Slope R dynamically changes the angle!)
    // Max I on axis = 4.0 A, Max U on axis = 20 V
    const maxI_axis = 4.0;
    const maxU_axis = 20.0;

    const pts1: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const currentVal = (i / pointsCount) * maxI_axis;
      const voltageVal = resistance * currentVal; // U = R * I
      const yFrac = Math.min(voltageVal / maxU_axis, 1.0);
      const x = padL + (i / pointsCount) * plotW;
      const y = padT + (1 - yFrac) * plotH;
      pts1.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    curve1Points = pts1.join(" ");
    area1Points = `${padL},${padT + plotH} ${curve1Points} ${padL + plotW},${padT + plotH}`;
  }

  // Operating point for Resistor
  const resOperI = Math.min((voltage / resistance) / 4.0, 1.0);
  const resOperU = Math.min(voltage / 20.0, 1.0);
  const operPtX = padL + resOperI * plotW;
  const operPtY = padT + (1 - resOperU) * plotH;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
      {/* Header (single-line, non-wrapping) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 gap-1">
        <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-200 flex items-center gap-1 uppercase tracking-tight whitespace-nowrap">
          <LineChart className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>{tab === "resistor" ? "Caractéristique U = f(I)" : "Réponse Transitoire"}</span>
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
          {tab === "resistor" ? "τ = 0 (Instantané)" : "5τ • Permanent"}
        </span>
      </div>

      {/* SVG Plot */}
      <div className="w-full flex-1 flex items-center justify-center py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] h-auto overflow-visible font-sans">
          <defs>
            <linearGradient id="curveFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color1} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color1} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <line x1={padL} y1={padT} x2={padL + plotW} y2={padT} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL} y1={padT + plotH / 2} x2={padL + plotW} y2={padT + plotH / 2} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padL + plotW / 2} y1={padT} x2={padL + plotW / 2} y2={padT + plotH} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Permanent Regime Zone Highlight */}
          {tab !== "resistor" && (
            <rect
              x={padL + plotW * 0.72}
              y={padT}
              width={plotW * 0.28}
              height={plotH}
              fill="#10b981"
              opacity="0.08"
              rx="4"
            />
          )}

          {/* Filled area under primary curve */}
          <polygon fill="url(#curveFillGrad)" points={area1Points} />

          {/* Axes */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW + 12} y2={padT + plotH} stroke="#64748b" strokeWidth="1.4" />
          <line x1={padL} y1={padT + plotH} x2={padL} y2={padT - 10} stroke="#64748b" strokeWidth="1.4" />

          {/* Axis End Arrows */}
          <polygon points={`${padL + plotW + 14},${padT + plotH} ${padL + plotW + 8},${padT + plotH - 3} ${padL + plotW + 8},${padT + plotH + 3}`} fill="#64748b" />
          <polygon points={`${padL},${padT - 12} ${padL - 3},${padT - 6} ${padL + 3},${padT - 6}`} fill="#64748b" />

          {/* Axis Labels */}
          <text x={padL + plotW + 16} y={padT + plotH + 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">
            {tab === "resistor" ? "I" : "t"}
          </text>
          <text x={padL - 6} y={padT - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="end">
            {tab === "resistor" ? "U" : "u, i"}
          </text>

          {/* Axis Ticks */}
          <text x={padL - 8} y={padT + plotH + 12} fill="#64748b" fontSize="8.5" textAnchor="middle">0</text>
          {tab !== "resistor" ? (
            <text x={padL + plotW * 0.85} y={padT + plotH + 14} fill="#10b981" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              5τ
            </text>
          ) : (
            <text x={padL + plotW - 4} y={padT + plotH + 14} fill="#f59e0b" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              4 A
            </text>
          )}

          {/* Primary Curve */}
          <polyline fill="none" stroke={color1} strokeWidth="2.4" points={curve1Points} strokeLinecap="round" strokeLinejoin="round" />

          {/* Secondary Curve (decaying) */}
          {curve2Points && (
            <polyline fill="none" stroke={color2} strokeWidth="1.8" strokeDasharray="4 3" points={curve2Points} strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* Operating Point on Resistor + Dotted Projections */}
          {tab === "resistor" && (
            <g>
              <line x1={operPtX} y1={padT + plotH} x2={operPtX} y2={operPtY} stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="1" />
              <line x1={padL} y1={operPtY} x2={operPtX} y2={operPtY} stroke="#fbbf24" strokeDasharray="2 2" strokeWidth="1" />
              <circle
                cx={operPtX}
                cy={operPtY}
                r="4.5"
                fill="#fbbf24"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend & Regime Status (Rendered with Clean, single-line LaTeX) */}
      <div className="space-y-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono px-0.5 whitespace-nowrap gap-1">
          <div className="flex items-center gap-1 whitespace-nowrap" style={{ color: color1 }}>
            <span className="w-2 h-0.5 rounded-full shrink-0" style={{ backgroundColor: color1 }}></span>
            {tab === "capacitor" ? (
              <LatexMath math={`u_C(t) \\to ${voltage}\\text{ V}`} />
            ) : tab === "inductor" ? (
              <LatexMath math={`i_L(t) \\to ${current.toFixed(1)}\\text{ A}`} />
            ) : (
              <LatexMath math={`U = ${resistance.toFixed(1)}\\cdot I`} />
            )}
          </div>

          <div className="flex items-center gap-1 whitespace-nowrap" style={{ color: color2 }}>
            <span className="w-2 h-0.5 rounded-full border-b border-dashed shrink-0" style={{ borderColor: color2 }}></span>
            {tab === "capacitor" ? (
              <LatexMath math={"i_C(t) \\to 0\\text{ A}"} />
            ) : tab === "inductor" ? (
              <LatexMath math={"u_L(t) \\to 0\\text{ V}"} />
            ) : (
              <LatexMath math={`(${ (voltage / resistance).toFixed(2) }\\text{A}, ${voltage}\\text{V})`} />
            )}
          </div>
        </div>

        {/* Permanent Regime Status Pill (Single Line) */}
        <div className="text-[9px] sm:text-[9.5px] text-emerald-300 font-mono text-center bg-slate-900/90 py-0.5 px-1.5 rounded-xl border border-emerald-500/20 shadow-sm whitespace-nowrap overflow-x-auto">
          {tab === "capacitor" && (
            <LatexMath math={"\\text{Régime continu } : i_C(\\infty) = 0\\text{ A } \\iff \\text{Interrupteur Ouvert}"} />
          )}
          {tab === "inductor" && (
            <LatexMath math={"\\text{Régime continu } : u_L(\\infty) = 0\\text{ V } \\iff \\text{Court-Circuit (Fil)}"} />
          )}
          {tab === "resistor" && (
            <LatexMath math={`\\text{Régime continu } : U = R\\cdot I \\implies P_J = ${((voltage * voltage) / resistance).toFixed(1)}\\text{ W}`} />
          )}
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
