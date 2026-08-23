/* eslint-disable react-hooks/purity */
"use client";

import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, ContactShadows, Box, Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";
import { ChevronRight, ChevronLeft, Info, CheckCircle2, Zap, Magnet, Flame } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type DipoleType = "capacitor" | "inductor" | "resistor";

/* ── Arrow 3D Helper ── */
function Arrow({
  start,
  dir,
  length,
  color,
  thickness = 0.04,
  label,
  labelOffset = [0, 0, 0],
  opacity = 1,
}: {
  start: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  color: string;
  thickness?: number;
  label?: string;
  labelOffset?: [number, number, number];
  opacity?: number;
}) {
  if (length <= 0.001 || opacity <= 0) return null;
  const normalizedDir = dir.clone().normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion();

  if (Math.abs(normalizedDir.y) > 0.99999) {
    if (normalizedDir.y < 0) quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  } else {
    quaternion.setFromUnitVectors(up, normalizedDir);
  }

  return (
    <group position={start}>
      <group quaternion={quaternion}>
        <mesh position={[0, length / 2, 0]}>
          <cylinderGeometry args={[thickness, thickness, length, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        <mesh position={[0, length + thickness * 1.5, 0]}>
          <coneGeometry args={[thickness * 2.5, thickness * 4, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      </group>
      {label && opacity > 0.5 && (
        <Html
          position={[
            normalizedDir.x * (length + 0.1) + labelOffset[0],
            normalizedDir.y * (length + 0.1) + labelOffset[1],
            normalizedDir.z * (length + 0.1) + labelOffset[2],
          ]}
          center
        >
          <div
            className="font-bold text-xs drop-shadow-md whitespace-nowrap"
            style={{ color, textShadow: "0px 0px 4px rgba(0,0,0,0.8)", opacity }}
          >
            <LatexMath math={label} />
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── 3D Voltmeter Instrument ── */
function Voltmeter({ voltage, label = "VOLTMÈTRE" }: { voltage: number; label?: string }) {
  return (
    <group position={[0, -1.3, 1.8]}>
      {/* Box Case */}
      <Box args={[2.0, 0.8, 0.9]}>
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </Box>

      {/* Screen */}
      <Box args={[1.5, 0.45, 0.05]} position={[0, 0.05, 0.46]}>
        <meshBasicMaterial color="#020617" />
      </Box>

      {/* Digital Readout */}
      <Html position={[0, 0.05, 0.5]} center transform>
        <div className="font-mono text-emerald-400 font-black text-sm bg-black px-2 py-0.5 rounded border border-emerald-500/40 shadow-inner flex items-center gap-1">
          <span>{voltage.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-500 font-bold">V</span>
        </div>
      </Html>

      {/* Voltmeter Label */}
      <Html position={[0, 0.3, 0.47]} center transform>
        <div className="text-[8px] font-extrabold tracking-widest text-slate-400 uppercase">
          {label} (U)
        </div>
      </Html>

      {/* Connecting Terminal Leads (Red and Blue Wires) */}
      <Line
        points={[
          new THREE.Vector3(-0.6, 0.35, 0.4),
          new THREE.Vector3(-1.4, 0.6, 0.2),
          new THREE.Vector3(-1.6, 0.1, 0),
        ]}
        color="#ef4444"
        lineWidth={3}
      />
      <Line
        points={[
          new THREE.Vector3(0.6, 0.35, 0.4),
          new THREE.Vector3(1.4, 0.6, 0.2),
          new THREE.Vector3(1.6, 0.1, 0),
        ]}
        color="#3b82f6"
        lineWidth={3}
      />
    </group>
  );
}

/* ── 3D Scene Component: Capacitor Experiment ── */
function Capacitor3DExperiment({
  phase,
  generatorVoltage,
}: {
  phase: number;
  generatorVoltage: number;
}) {
  // Voltage and Current based on phase (0: t=0+, 1: transitoire, 2: permanent)
  const uC = phase === 0 ? 0.0 : phase === 1 ? generatorVoltage * 0.63 : generatorVoltage;
  const iC = phase === 0 ? generatorVoltage / 10 : phase === 1 ? (generatorVoltage / 10) * 0.37 : 0.0;

  const particlesRef = useRef<THREE.Group>(null);
  const plateDist = 1.4;

  // Electrons in circuit
  useFrame((_, delta) => {
    if (particlesRef.current && iC > 0) {
      particlesRef.current.children.forEach((child) => {
        child.position.x += (iC / 2) * delta * 2.5;
        if (child.position.x > plateDist / 2) {
          child.position.x = -plateDist / 2;
        }
      });
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Left Plate (+ Charge) */}
      <Box position={[-plateDist / 2, 0, 0]} args={[0.08, 2.2, 2.2]}>
        <meshStandardMaterial
          color="#ef4444"
          metalness={0.8}
          roughness={0.2}
          emissive="#ef4444"
          emissiveIntensity={phase > 0 ? 0.4 : 0.05}
        />
      </Box>

      {/* Right Plate (- Charge) */}
      <Box position={[plateDist / 2, 0, 0]} args={[0.08, 2.2, 2.2]}>
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          emissive="#3b82f6"
          emissiveIntensity={phase > 0 ? 0.4 : 0.05}
        />
      </Box>

      {/* Accumulating Charges Signs */}
      {phase >= 1 && (
        <>
          {[-0.6, 0, 0.6].map((y, idx) => (
            <group key={idx}>
              <Html position={[-plateDist / 2 - 0.2, y, 0]} center>
                <span className="text-red-400 font-extrabold text-sm drop-shadow">+</span>
              </Html>
              <Html position={[plateDist / 2 + 0.2, y, 0]} center>
                <span className="text-blue-400 font-extrabold text-sm drop-shadow">-</span>
              </Html>
            </group>
          ))}
        </>
      )}

      {/* Leads */}
      <Cylinder position={[-plateDist / 2 - 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.035, 0.035, 1.2, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Cylinder position={[plateDist / 2 + 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.035, 0.035, 1.2, 16]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Electric Field Vector E */}
      {phase > 0 && (
        <Arrow
          start={new THREE.Vector3(-plateDist / 2 + 0.1, 0, 0)}
          dir={new THREE.Vector3(1, 0, 0)}
          length={plateDist - 0.2}
          color="#38bdf8"
          thickness={0.035}
          label="\vec{E}"
          labelOffset={[0, 0.25, 0]}
        />
      )}

      {/* Current Vector I */}
      {iC > 0.01 && (
        <Arrow
          start={new THREE.Vector3(-2.6, 0, 0)}
          dir={new THREE.Vector3(1, 0, 0)}
          length={0.9}
          color="#facc15"
          thickness={0.04}
          label="\vec{I}"
          labelOffset={[0, 0.25, 0]}
        />
      )}

      {/* Floating State Badge */}
      <Html position={[0, 1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-cyan-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          {phase === 0 && "t = 0⁺ : uC(0⁺) = 0 V ⟹ Court-circuit initial (Fil)"}
          {phase === 1 && "0 < t < 5τ : Accumulation des charges (uC ↗, i ↘)"}
          {phase === 2 && "t ≥ 5τ : uC = E, i = 0 A ⟹ Interrupteur Ouvert !"}
        </div>
      </Html>

      {/* 3D Voltmeter */}
      <Voltmeter voltage={uC} />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={6} blur={2.0} />
    </group>
  );
}

/* ── 3D Scene Component: Inductor Experiment ── */
function Inductor3DExperiment({
  phase,
  generatorVoltage,
}: {
  phase: number;
  generatorVoltage: number;
}) {
  const uL = phase === 0 ? generatorVoltage : phase === 1 ? generatorVoltage * 0.37 : 0.0;
  const iL = phase === 0 ? 0.0 : phase === 1 ? (generatorVoltage / 10) * 0.63 : generatorVoltage / 10;

  const coilCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const length = 3.2;
    const radius = 0.6;
    const numTurns = 7;
    const totalPoints = numTurns * 36;
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const x = -length / 2 + t * length;
      const angle = t * numTurns * Math.PI * 2;
      const y = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(coilCurve, 140, 0.055, 12, false);
  }, [coilCurve]);

  return (
    <group position={[0, 0.2, 0]}>
      {/* Ferromagnetic Core */}
      <Cylinder position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} args={[0.22, 0.22, 3.5, 32]}>
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} transparent opacity={0.35} />
      </Cylinder>

      {/* Copper Wire Coil */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.85}
          roughness={0.2}
          emissive="#d97706"
          emissiveIntensity={iL > 0 ? 0.45 : 0.05}
        />
      </mesh>

      {/* Magnetic Field B Arrow */}
      {iL > 0.01 && (
        <Arrow
          start={new THREE.Vector3(-1.4, 0, 0)}
          dir={new THREE.Vector3(1, 0, 0)}
          length={2.8}
          color="#10b981"
          thickness={0.035}
          label="\vec{B}"
          labelOffset={[0, 0.25, 0]}
        />
      )}

      {/* Current Vector I */}
      {iL > 0.01 && (
        <Arrow
          start={new THREE.Vector3(-2.6, 0, 0)}
          dir={new THREE.Vector3(1, 0, 0)}
          length={0.9}
          color="#facc15"
          thickness={0.04}
          label="\vec{I}"
          labelOffset={[0, 0.25, 0]}
        />
      )}

      {/* Floating State Badge */}
      <Html position={[0, 1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-amber-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          {phase === 0 && "t = 0⁺ : iL(0⁺) = 0 A ⟹ Interrupteur Ouvert initial (uL = E)"}
          {phase === 1 && "0 < t < 5τ : Établissement du courant (iL ↗, uL ↘)"}
          {phase === 2 && "t ≥ 5τ : uL = 0 V, i = Imax ⟹ Court-Circuit / Fil !"}
        </div>
      </Html>

      {/* 3D Voltmeter */}
      <Voltmeter voltage={uL} />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={6} blur={2.0} />
    </group>
  );
}

/* ── 3D Scene Component: Resistor Experiment ── */
function Resistor3DExperiment({
  phase,
  generatorVoltage,
}: {
  phase: number;
  generatorVoltage: number;
}) {
  const uR = generatorVoltage;
  const iR = generatorVoltage / 5;

  return (
    <group position={[0, 0.2, 0]}>
      {/* Resistor Body */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 2.5, 32]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.4}
            metalness={0.2}
            emissive="#ea580c"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Color Bands */}
        {[-0.75, -0.25, 0.25, 0.75].map((x, idx) => {
          const bandColors = ["#b91c1c", "#000000", "#d97706", "#eab308"];
          return (
            <mesh key={idx} position={[0, x, 0]}>
              <cylinderGeometry args={[0.43, 0.43, 0.12, 32]} />
              <meshStandardMaterial color={bandColors[idx]} roughness={0.3} metalness={0.5} />
            </mesh>
          );
        })}

        {/* Leads */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Current Vector I */}
      <Arrow
        start={new THREE.Vector3(-2.6, 0, 0)}
        dir={new THREE.Vector3(1, 0, 0)}
        length={0.9}
        color="#facc15"
        thickness={0.04}
        label="\vec{I}"
        labelOffset={[0, 0.25, 0]}
      />

      {/* Floating State Badge */}
      <Html position={[0, 1.4, 0]} center className="pointer-events-none">
        <div className="bg-slate-900/90 text-rose-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-rose-500/30 backdrop-blur whitespace-nowrap shadow-lg">
          Loi d&apos;Ohm Instantanée (τ = 0) : U = R·I • Dissipation thermique pure (PJ = RI²)
        </div>
      </Html>

      {/* 3D Voltmeter */}
      <Voltmeter voltage={uR} />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={6} blur={2.0} />
    </group>
  );
}

/* ── Main Exported Component Matching HallEffect Layout ── */
export default function RLCDCTransitionExperiment() {
  const [dipole, setDipole] = useState<DipoleType>("capacitor");
  const [phase, setPhase] = useState(0);
  const [voltage, setVoltage] = useState(12.0);

  const maxPhases = dipole === "resistor" ? 1 : 3;

  const nextPhase = () => setPhase((prev) => Math.min(prev + 1, maxPhases - 1));
  const prevPhase = () => setPhase((prev) => Math.max(prev - 1, 0));

  const handleDipoleChange = (d: DipoleType) => {
    setDipole(d);
    setPhase(0);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      
      {/* ── MAIN 2-COLUMN VIEW (LEFT PANEL 40% + RIGHT 3D CANVAS 60%) ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        
        {/* LEFT PANEL: EXPLANATIONS & RESULTS */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            
            {/* Step Badge */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-2">
              <h3 className="text-orange-400 font-extrabold text-sm sm:text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-400" />
                Étape {phase + 1}/{maxPhases}
              </h3>

              {/* Capacitor Explanations */}
              {dipole === "capacitor" && (
                <>
                  {phase === 0 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-white text-sm">Fermeture du Circuit • Régime Initial (<LatexMath math="t = 0^+" />)</p>
                      <p>
                        Par continuité de l&apos;énergie électrostatique, la tension ne peut pas sauter instantanément : <LatexMath math="u_C(0^+) = u_C(0^-) = 0\text{ V}" />.
                      </p>
                      <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/30 text-cyan-200 font-mono">
                        <LatexMath math="u_C = 0\text{ V} \implies \text{Court-Circuit Initial (Fil)}" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Tout le courant initial du générateur jaillit à cet instant : <LatexMath math="i(0^+) = E/R" />.
                      </p>
                    </div>
                  )}

                  {phase === 1 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-cyan-400 text-sm">Régime Transitoire • Phase de Charge (<LatexMath math="0 < t < 5\tau" />)</p>
                      <p>
                        Les électrons s&apos;accumulent sur l&apos;armature négative. Le champ <LatexMath math="\vec{E}" /> grandit et crée une force électrostatique antagoniste.
                      </p>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-slate-200 font-mono">
                        <LatexMath math="u_C(t) = E(1 - e^{-t/\tau}) \nearrow \quad \text{et} \quad i_C(t) \searrow" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        La différence de potentiel s&apos;oppose au passage du courant et le freine.
                      </p>
                    </div>
                  )}

                  {phase === 2 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-emerald-400 text-sm">Régime Permanent Continu (<LatexMath math="t \ge 5\tau \to \infty" />)</p>
                      <p>
                        Le condensateur est saturé sous la tension <LatexMath math="u_C = E" />. La dérivée s&apos;annule : <LatexMath math="\frac{\mathrm{d}u_C}{\mathrm{d}t} = 0" />.
                      </p>
                      <p>
                        L&apos;isolant diélectrique bloque tout passage continu : aucun courant ne circule.
                      </p>
                      <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 flex justify-center text-emerald-300 font-bold font-mono">
                        <LatexMath math="i_C = C \frac{\mathrm{d}u_C}{\mathrm{d}t} = 0\text{ A} \iff \text{Interrupteur Ouvert}" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Inductor Explanations */}
              {dipole === "inductor" && (
                <>
                  {phase === 0 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-white text-sm">Fermeture du Circuit • Auto-Induction (<LatexMath math="t = 0^+" />)</p>
                      <p>
                        Par continuité de l&apos;énergie magnétique, le courant ne peut pas sauter brusquement : <LatexMath math="i_L(0^+) = i_L(0^-) = 0\text{ A}" />.
                      </p>
                      <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/30 text-amber-200 font-mono">
                        <LatexMath math="i_L = 0\text{ A} \implies \text{Interrupteur Ouvert Initial}" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        La f.é.m induite <LatexMath math="e = -L\frac{\mathrm{d}i}{\mathrm{d}t}" /> bloque totalement le courant (<LatexMath math="u_L = E" />).
                      </p>
                    </div>
                  )}

                  {phase === 1 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-amber-400 text-sm">Régime Transitoire • Établissement du Courant (<LatexMath math="0 < t < 5\tau" />)</p>
                      <p>
                        Le champ magnétique <LatexMath math="\vec{B}" /> s&apos;installe dans les spires. L&apos;inertie d&apos;auto-induction faiblit progressivement.
                      </p>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-slate-200 font-mono">
                        <LatexMath math="i_L(t) = \frac{E}{R}(1 - e^{-t/\tau}) \nearrow \quad \text{et} \quad u_L(t) \searrow" />
                      </div>
                    </div>
                  )}

                  {phase === 2 && (
                    <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                      <p className="font-bold text-emerald-400 text-sm">Régime Permanent Continu (<LatexMath math="t \ge 5\tau \to \infty" />)</p>
                      <p>
                        Le courant atteint sa valeur maximale constante <LatexMath math="i_L = E/R" /> (<LatexMath math="\frac{\mathrm{d}i_L}{\mathrm{d}t} = 0" />).
                      </p>
                      <p>
                        Sans variation de flux, la f.é.m induite disparaît : le fil de cuivre n&apos;oppose plus aucune résistance.
                      </p>
                      <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 flex justify-center text-emerald-300 font-bold font-mono">
                        <LatexMath math="u_L = L \frac{\mathrm{d}i_L}{\mathrm{d}t} = 0\text{ V} \iff \text{Court-Circuit / Fil Parfait}" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Resistor Explanations */}
              {dipole === "resistor" && (
                <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-rose-400 text-sm">Loi d&apos;Ohm Instantanée (<LatexMath math="\tau = 0" />)</p>
                  <p>
                    La résistance ne stocke aucune énergie et n&apos;oppose aucune inertie. La tension et le courant sont liés immédiatement.
                  </p>
                  <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/30 flex justify-center text-rose-300 font-bold font-mono">
                    <LatexMath math="u_R(t) = R \cdot i(t) \quad \text{et} \quad P_J = R i^2 \ge 0" />
                  </div>
                </div>
              )}
            </div>

            {/* Equivalent Behavior Results Container */}
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl shadow-md space-y-2">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Comportement en Régime Continu (<LatexMath math="t \to \infty" />)
              </h4>

              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Équivalent physique :</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    dipole === "capacitor"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : dipole === "inductor"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {dipole === "capacitor"
                    ? "Interrupteur Ouvert (i = 0)"
                    : dipole === "inductor"
                    ? "Court-Circuit / Fil (u = 0)"
                    : "Résistance pure R"}
                </span>
              </div>

              <div className="text-center p-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-slate-300">
                {dipole === "capacitor" && <span>⚠️ Piège : <LatexMath math="u_C = E \ne 0" /> (Tension maximale)</span>}
                {dipole === "inductor" && <span>⚠️ Piège : <LatexMath math="i_L = E/R \ne 0" /> (Courant maximal)</span>}
                {dipole === "resistor" && <span>Aucun retard transitoire (<LatexMath math="\tau = 0" />)</span>}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: 3D CANVAS (60% WIDTH) */}
        <div className="w-full lg:w-[60%] h-[300px] lg:h-[380px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <Canvas camera={{ position: [5, 5, 7.5], fov: 36 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <color attach="background" args={["#020617"]} />
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 10, 5]} intensity={1.6} />
              <directionalLight position={[-5, -5, -5]} intensity={0.5} />
              <Environment preset="city" />
              <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.05} autoRotate={false} />

              {dipole === "capacitor" && (
                <Capacitor3DExperiment phase={phase} generatorVoltage={voltage} />
              )}
              {dipole === "inductor" && (
                <Inductor3DExperiment phase={phase} generatorVoltage={voltage} />
              )}
              {dipole === "resistor" && (
                <Resistor3DExperiment phase={phase} generatorVoltage={voltage} />
              )}
            </Suspense>
          </Canvas>

          <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-[9.5px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 backdrop-blur">
            🖱️ 3D Interactif • Tourner / Zoomer
          </div>
        </div>

      </div>

      {/* ── BOTTOM PANEL: CONTROLS BAR (Matching HallEffect) ── */}
      <div className="w-full bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 flex-wrap shadow-lg">
        
        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPhase}
            disabled={phase === 0}
            className={`px-3 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-xs sm:text-sm transition-all ${
              phase === 0
                ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 shadow-sm cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>

          <button
            onClick={nextPhase}
            disabled={phase >= maxPhases - 1}
            className={`px-4 py-1.5 flex items-center gap-1 rounded-lg border font-bold text-xs sm:text-sm transition-all ${
              phase >= maxPhases - 1
                ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-orange-600 border-orange-500 text-white hover:bg-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.35)] cursor-pointer"
            }`}
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Generator Voltage Slider */}
        <div className="flex flex-col gap-1 w-[130px] sm:w-[160px]">
          <label className="text-[10px] sm:text-xs text-slate-400 font-bold flex justify-between uppercase tracking-wider">
            <span>Tension <LatexMath math="E" /></span>
            <span className="text-cyan-400 font-mono">{voltage.toFixed(1)} V</span>
          </label>
          <input
            type="range"
            min="4"
            max="24"
            step="1"
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            className="accent-cyan-500 cursor-pointer w-full h-1.5 rounded-lg"
          />
        </div>

        {/* Dipole Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => handleDipoleChange("capacitor")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center gap-1.5 ${
              dipole === "capacitor"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Condensateur (C)
          </button>
          <button
            onClick={() => handleDipoleChange("inductor")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center gap-1.5 ${
              dipole === "inductor"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            Bobine (L)
          </button>
          <button
            onClick={() => handleDipoleChange("resistor")}
            className={`px-3 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center gap-1.5 ${
              dipole === "resistor"
                ? "bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.35)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Résistance (R)
          </button>
        </div>

      </div>
    </div>
  );
}
