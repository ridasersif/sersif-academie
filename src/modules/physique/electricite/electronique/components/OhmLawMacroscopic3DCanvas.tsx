"use client";

import React, { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Html } from "@react-three/drei";
import { Zap, Sliders, Layers } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

interface MaterialProp {
  name: string;
  resistivity: number; // in Ohm.m
  color: string;
  metalness: number;
  roughness: number;
}

const MATERIALS: Record<string, MaterialProp> = {
  cuivre: {
    name: "Cuivre (Cu)",
    resistivity: 1.7e-8,
    color: "#ea580c",
    metalness: 0.85,
    roughness: 0.25,
  },
  aluminium: {
    name: "Aluminium (Al)",
    resistivity: 2.8e-8,
    color: "#94a3b8",
    metalness: 0.9,
    roughness: 0.2,
  },
  or: {
    name: "Or (Au)",
    resistivity: 2.4e-8,
    color: "#eab308",
    metalness: 0.95,
    roughness: 0.15,
  },
  nichrome: {
    name: "Nichrome (Résistif)",
    resistivity: 1.1e-6,
    color: "#64748b",
    metalness: 0.6,
    roughness: 0.4,
  },
  carbone: {
    name: "Carbone / Graphite",
    resistivity: 3.5e-5,
    color: "#1e293b",
    metalness: 0.2,
    roughness: 0.7,
  },
};

function Resistor3DScene({
  lengthM,
  radiusMm,
  voltageV,
  materialKey,
}: {
  lengthM: number;
  radiusMm: number;
  voltageV: number;
  materialKey: string;
}) {
  const mat = MATERIALS[materialKey] || MATERIALS.cuivre;
  // Scaled visual dimension
  const visualLength = Math.min(5.5, Math.max(2.0, lengthM * 1.5));
  const visualRadius = Math.min(1.2, Math.max(0.3, radiusMm * 0.45));

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1.5} />
      <pointLight position={[-4, 3, -3]} intensity={0.6} color="#38bdf8" />

      {/* Main Cylinder Resistor Body */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[visualRadius, visualRadius, visualLength, 32]}>
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
          />
        </Cylinder>
      </group>

      {/* Terminal Electrodes A (+) and B (-) */}
      {/* Terminal A (+) */}
      <group position={[-visualLength / 2 - 0.2, 0, 0]}>
        <Cylinder args={[visualRadius * 1.1, visualRadius * 1.1, 0.4, 24]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.6} />
        </Cylinder>
        <Html position={[0, visualRadius + 0.6, 0]} center>
          <div className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-mono text-[11px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
            Borne A : <LatexMath math={`V_A = +${voltageV}\\,\\text{V}`} />
          </div>
        </Html>
      </group>

      {/* Terminal B (-) */}
      <group position={[visualLength / 2 + 0.2, 0, 0]}>
        <Cylinder args={[visualRadius * 1.1, visualRadius * 1.1, 0.4, 24]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.6} />
        </Cylinder>
        <Html position={[0, visualRadius + 0.6, 0]} center>
          <div className="bg-blue-950/90 border border-blue-500/50 text-blue-300 font-mono text-[11px] px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
            Borne B : <LatexMath math="V_B = 0\,\text{V}" />
          </div>
        </Html>
      </group>

      {/* Internal Electric Field Arrows along the conductor */}
      <group position={[0, -visualRadius - 0.4, 0]}>
        <Cylinder args={[0.04, 0.04, visualLength * 0.85]} rotation={[0, 0, -Math.PI / 2]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
        </Cylinder>
        {/* Cone Head */}
        <mesh position={[visualLength * 0.44, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.14, 0.35, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={1} />
        </mesh>
        <Html position={[0, -0.35, 0]} center>
          <div className="text-amber-400 font-mono text-[11px] font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
            Champ uniforme <LatexMath math="\vec{E} = \frac{U}{L} \vec{u}_x" />
          </div>
        </Html>
      </group>

      <OrbitControls enableZoom={true} minDistance={3.5} maxDistance={10} />
    </>
  );
}

export default function OhmLawMacroscopic3DCanvas() {
  const [lengthM, setLengthM] = useState<number>(2.0); // meters
  const [radiusMm, setRadiusMm] = useState<number>(1.0); // mm
  const [voltageV, setVoltageV] = useState<number>(12.0); // Volts
  const [materialKey, setMaterialKey] = useState<string>("cuivre");

  const mat = MATERIALS[materialKey] || MATERIALS.cuivre;

  // Cross section area S = pi * r^2 in m^2
  const sectionM2 = useMemo(() => {
    const rM = radiusMm * 1e-3;
    return Math.PI * Math.pow(rM, 2);
  }, [radiusMm]);

  // Resistance R = rho * L / S (in Ohms)
  const resistanceOhm = useMemo(() => {
    return (mat.resistivity * lengthM) / sectionM2;
  }, [mat.resistivity, lengthM, sectionM2]);

  // Current I = U / R (in Amperes)
  const currentA = useMemo(() => {
    return resistanceOhm > 0 ? voltageV / resistanceOhm : 0;
  }, [voltageV, resistanceOhm]);

  // Dissipated Power P = U * I = R * I^2 (in Watts)
  const powerW = useMemo(() => {
    return voltageV * currentA;
  }, [voltageV, currentA]);

  // Electric Field E = U / L (in V/m)
  const eFieldVm = useMemo(() => {
    return lengthM > 0 ? (voltageV / lengthM).toFixed(1) : "0";
  }, [voltageV, lengthM]);

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Zap size={16} className="text-amber-400" /> Loi d&apos;Ohm Macroscopique & Résistance <LatexMath math="R = \rho \frac{L}{S}" />
          </h4>
        </div>

        {/* Material Dropdown / Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs font-bold px-2">Matériau :</span>
          {Object.keys(MATERIALS).map((key) => (
            <button
              key={key}
              onClick={() => setMaterialKey(key)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                materialKey === key
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {MATERIALS[key].name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-[260px] sm:h-[300px] bg-[#050713] cursor-grab active:cursor-grabbing">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.0, 6.0], fov: 45 }}>
          <Suspense fallback={null}>
            <Resistor3DScene
              lengthM={lengthM}
              radiusMm={radiusMm}
              voltageV={voltageV}
              materialKey={materialKey}
            />
          </Suspense>
        </Canvas>

        {/* Metrics Live Dashboard Card */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl text-xs space-y-2 shadow-2xl min-w-[210px]">
          <div className="flex justify-between items-center text-slate-400 pb-1 border-b border-slate-800">
            <span>Résistance <LatexMath math="R" /> :</span>
            <strong className="text-amber-400 font-mono text-sm">
              {resistanceOhm < 0.01
                ? `${(resistanceOhm * 1000).toFixed(2)} mΩ`
                : resistanceOhm > 1000
                ? `${(resistanceOhm / 1000).toFixed(2)} kΩ`
                : `${resistanceOhm.toFixed(3)} Ω`}
            </strong>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Courant <LatexMath math="I = \frac{U}{R}" /> :</span>
            <strong className="text-cyan-400 font-mono text-sm">
              {currentA > 1000
                ? `${(currentA / 1000).toFixed(1)} kA`
                : `${currentA.toFixed(2)} A`}
            </strong>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Puissance Joule <LatexMath math="P_J" /> :</span>
            <strong className="text-rose-400 font-mono text-sm">
              {powerW > 1e6
                ? `${(powerW / 1e6).toFixed(2)} MW`
                : powerW > 1000
                ? `${(powerW / 1000).toFixed(2)} kW`
                : `${powerW.toFixed(1)} W`}
            </strong>
          </div>

          <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800 text-[11px]">
            <span>Champ interne <LatexMath math="E" /> :</span>
            <span className="font-mono text-slate-300">{eFieldVm} V/m</span>
          </div>
        </div>
      </div>

      {/* Sliders Panel */}
      <div className="p-4 bg-slate-900/70 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Tension U */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> Tension appliquée <LatexMath math="U_{AB}" /> :
            </span>
            <span className="text-amber-400 font-mono font-bold">{voltageV.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min={1}
            max={48}
            step={1}
            value={voltageV}
            onChange={(e) => setVoltageV(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">
            Fixe la différence de potentiel entre les deux extrémités du conducteur.
          </p>
        </div>

        {/* Longueur L */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-blue-400" /> Longueur du fil <LatexMath math="L" /> :
            </span>
            <span className="text-blue-400 font-mono font-bold">{lengthM.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={5.0}
            step={0.1}
            value={lengthM}
            onChange={(e) => setLengthM(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-[10px] text-slate-500">
            La résistance est directement proportionnelle à la longueur <LatexMath math="L" />.
          </p>
        </div>

        {/* Rayon r */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Layers size={14} className="text-emerald-400" /> Rayon de section <LatexMath math="r" /> :
            </span>
            <span className="text-emerald-400 font-mono font-bold">{radiusMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={3.0}
            step={0.1}
            value={radiusMm}
            onChange={(e) => setRadiusMm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-[10px] text-slate-500">
            La résistance est inversement proportionnelle à la section <LatexMath math="S = \pi r^2" />.
          </p>
        </div>
      </div>
    </div>
  );
}
