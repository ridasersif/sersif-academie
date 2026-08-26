"use client";
/* eslint-disable react-hooks/purity, react-hooks/immutability */

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Info 
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// --- 1. SINGLE WATER MOLECULE WITH DIPOLE ---
function WaterMolecule({ 
  position = [0, 0, 0] as [number, number, number], 
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
  showDipole = true,
  showCharges = true,
  isAnimated = true,
  oxygenCharge = "-2δ",
  hydrogenCharge = "+δ"
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Geometry parameters: angle ~104.5°, O-H bond length ~ 0.96 Å (scaled for 3D)
  const bondLength = 0.95;
  const halfAngle = (104.5 * Math.PI) / 360; // 52.25 deg

  const h1Pos: [number, number, number] = [
    -bondLength * Math.sin(halfAngle),
    -bondLength * Math.cos(halfAngle),
    0
  ];
  const h2Pos: [number, number, number] = [
    bondLength * Math.sin(halfAngle),
    -bondLength * Math.cos(halfAngle),
    0
  ];

  useFrame((state) => {
    if (!groupRef.current || !isAnimated) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Oxygen Atom (Red/Ruby) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial 
          color="#ef4444" 
          roughness={0.25} 
          metalness={0.2} 
          emissive="#b91c1c"
          emissiveIntensity={0.25}
        />
      </mesh>

      {showCharges && (
        <Html position={[0, 0.65, 0]} center distanceFactor={12}>
          <div className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-[10px] font-black text-red-300 shadow-sm pointer-events-none whitespace-nowrap">
            {oxygenCharge} (O)
          </div>
        </Html>
      )}

      {/* Hydrogen 1 */}
      <mesh position={h1Pos}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.3} 
          metalness={0.1}
          emissive="#e2e8f0"
          emissiveIntensity={0.15}
        />
      </mesh>

      {showCharges && (
        <Html position={[h1Pos[0] - 0.25, h1Pos[1] - 0.35, 0]} center distanceFactor={12}>
          <div className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-black text-cyan-300 shadow-sm pointer-events-none whitespace-nowrap">
            {hydrogenCharge} (H)
          </div>
        </Html>
      )}

      {/* Hydrogen 2 */}
      <mesh position={h2Pos}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.3} 
          metalness={0.1}
          emissive="#e2e8f0"
          emissiveIntensity={0.15}
        />
      </mesh>

      {showCharges && (
        <Html position={[h2Pos[0] + 0.25, h2Pos[1] - 0.35, 0]} center distanceFactor={12}>
          <div className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-black text-cyan-300 shadow-sm pointer-events-none whitespace-nowrap">
            {hydrogenCharge} (H)
          </div>
        </Html>
      )}

      {/* Covalent Bonds (Cylinders/Lines) */}
      <Line 
        points={[[0, 0, 0], h1Pos]} 
        color="#94a3b8" 
        lineWidth={3.5} 
      />
      <Line 
        points={[[0, 0, 0], h2Pos]} 
        color="#94a3b8" 
        lineWidth={3.5} 
      />

      {/* Electric Dipole Vector: Points from Negative (O) to Positive (H barycenter) OR Physics convention from - to + */}
      {showDipole && (
        <group position={[0, -0.3, 0]}>
          {/* Dipole arrow pointing from + (barycenter H) towards - (O) or standard chemical dipole */}
          <Line 
            points={[[0, -0.6, 0], [0, 0.6, 0]]} 
            color="#38bdf8" 
            lineWidth={4} 
          />
          {/* Arrow Cone */}
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.12, 0.25, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
          </mesh>
          <Html position={[0.4, 0.1, 0]} center distanceFactor={12}>
            <div className="px-1.5 py-0.5 rounded bg-sky-900/90 border border-sky-400 text-[10px] font-extrabold text-sky-200 shadow-lg pointer-events-none">
              p⃗ = 1.85 D
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// --- 2. HYDRATION SHELL: NA+ CATION (OXYGENS POINTING INWARD) ---
function HydrationShellNa({ showCharges, showDipoles, isPlaying }: { showCharges: boolean; showDipoles: boolean; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // 6 water molecules arranged octahedrally around Na+
  // Oxygens face the central Na+ ion (radius ~ 1.85)
  const r = 1.95;
  const waters = useMemo(() => [
    { pos: [r, 0, 0] as [number, number, number], rot: [0, 0, -Math.PI / 2] as [number, number, number] },
    { pos: [-r, 0, 0] as [number, number, number], rot: [0, 0, Math.PI / 2] as [number, number, number] },
    { pos: [0, r, 0] as [number, number, number], rot: [0, 0, Math.PI] as [number, number, number] },
    { pos: [0, -r, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [0, 0, r] as [number, number, number], rot: [Math.PI / 2, 0, 0] as [number, number, number] },
    { pos: [0, 0, -r] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number] },
  ], []);

  useFrame((_, delta) => {
    if (!groupRef.current || !isPlaying) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central Na+ Cation (Purple/Magenta Glow) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial 
          color="#818cf8" 
          roughness={0.15} 
          metalness={0.6}
          emissive="#6366f1"
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      <Html position={[0, 0, 0]} center distanceFactor={10}>
        <div className="px-2 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-400 text-xs font-black text-indigo-200 shadow-xl pointer-events-none">
          Na⁺
        </div>
      </Html>

      {/* 6 Hydrating H2O molecules */}
      {waters.map((w, idx) => (
        <WaterMolecule 
          key={idx} 
          position={w.pos} 
          rotation={w.rot} 
          scale={0.7}
          showDipole={showDipoles}
          showCharges={showCharges}
          isAnimated={false}
        />
      ))}
    </group>
  );
}

// --- 3. HYDRATION SHELL: CL- ANION (HYDROGENS POINTING INWARD) ---
function HydrationShellCl({ showCharges, showDipoles, isPlaying }: { showCharges: boolean; showDipoles: boolean; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // 6 water molecules arranged octahedrally around Cl-
  // Hydrogens face the central Cl- ion (Oxygens face outwards)
  const r = 2.25;
  const waters = useMemo(() => [
    { pos: [r, 0, 0] as [number, number, number], rot: [0, 0, Math.PI / 2] as [number, number, number] },
    { pos: [-r, 0, 0] as [number, number, number], rot: [0, 0, -Math.PI / 2] as [number, number, number] },
    { pos: [0, r, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [0, -r, 0] as [number, number, number], rot: [0, 0, Math.PI] as [number, number, number] },
    { pos: [0, 0, r] as [number, number, number], rot: [-Math.PI / 2, 0, 0] as [number, number, number] },
    { pos: [0, 0, -r] as [number, number, number], rot: [Math.PI / 2, 0, 0] as [number, number, number] },
  ], []);

  useFrame((_, delta) => {
    if (!groupRef.current || !isPlaying) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.z += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Central Cl- Anion (Emerald/Lime Glow) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          roughness={0.15} 
          metalness={0.4}
          emissive="#059669"
          emissiveIntensity={0.7} 
        />
      </mesh>
      
      <Html position={[0, 0, 0]} center distanceFactor={10}>
        <div className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-xs font-black text-emerald-200 shadow-xl pointer-events-none">
          Cl⁻
        </div>
      </Html>

      {/* 6 Hydrating H2O molecules */}
      {waters.map((w, idx) => (
        <WaterMolecule 
          key={idx} 
          position={w.pos} 
          rotation={w.rot} 
          scale={0.7}
          showDipole={showDipoles}
          showCharges={showCharges}
          isAnimated={false}
        />
      ))}
    </group>
  );
}

// --- 4. DISSOCIATION & IONIZING / DISPERSING EFFECT ---
function DissociationScene({ isPlaying, dielectricEnabled }: { isPlaying: boolean; dielectricEnabled: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [separation, setSeparation] = useState(1.4);

  useFrame((_, delta) => {
    if (!isPlaying) return;
    if (dielectricEnabled) {
      // In water: epsilon_r = 80 -> ions easily separate
      setSeparation((prev) => Math.min(3.4, prev + delta * 0.8));
    } else {
      // In vacuum / solid: strong Coulomb attraction pulls them back
      setSeparation((prev) => Math.max(1.3, prev - delta * 1.5));
    }
  });

  return (
    <group ref={groupRef}>
      {/* Na+ Ion */}
      <group position={[-separation, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={0.6} />
        </mesh>
        <Html position={[0, 0.85, 0]} center distanceFactor={11}>
          <div className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-400 text-[11px] font-black text-indigo-200 pointer-events-none">
            Na⁺ (aq)
          </div>
        </Html>
      </group>

      {/* Cl- Ion */}
      <group position={[separation, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
        </mesh>
        <Html position={[0, 0.95, 0]} center distanceFactor={11}>
          <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-[11px] font-black text-emerald-200 pointer-events-none">
            Cl⁻ (aq)
          </div>
        </Html>
      </group>

      {/* Electrostatic Interaction / Force Vector */}
      <Line 
        points={[[-separation + 0.6, 0, 0], [separation - 0.75, 0, 0]]} 
        color={dielectricEnabled ? "#38bdf8" : "#f43f5e"} 
        lineWidth={dielectricEnabled ? 2 : 5} 
        dashed={dielectricEnabled}
        dashScale={5}
      />

      {/* Water Screen Representation when dielectric is active */}
      {dielectricEnabled && (
        <group position={[0, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
            <meshStandardMaterial 
              color="#0284c7" 
              transparent 
              opacity={0.25} 
              roughness={0.1}
            />
          </mesh>
          <Html position={[0, -1.2, 0]} center distanceFactor={10}>
            <div className="px-2 py-1 rounded bg-sky-950/90 border border-sky-400 text-[10px] font-bold text-sky-200 text-center pointer-events-none">
              <div>Écran diélectrique : εᵣ ≈ 80</div>
              <div className="text-emerald-400 font-mono">F = F₀ / 80 (Attraction divisée par 80)</div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// --- MAIN CANVAS COMPONENT ---
export default function WaterDipoleSolvation3DCanvas() {
  const [activeTab, setActiveTab] = useState<"dipole" | "solvation_na" | "solvation_cl" | "dissociation">("dipole");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showDipoles, setShowDipoles] = useState<boolean>(true);
  const [showCharges, setShowCharges] = useState<boolean>(true);
  const [dielectricEnabled, setDielectricEnabled] = useState<boolean>(true);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/80 shadow-2xl flex flex-col">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              Simulateur 3D • Propriétés de l&apos;Eau & Solvatation
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Visualisation à l&apos;échelle moléculaire du caractère dipolaire et de l&apos;effet solvatant
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-border/40">
          <button
            onClick={() => setActiveTab("dipole")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "dipole" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            1. Dipôle H₂O
          </button>
          <button
            onClick={() => setActiveTab("solvation_na")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "solvation_na" 
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2. Hydratation Na⁺
          </button>
          <button
            onClick={() => setActiveTab("solvation_cl")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "solvation_cl" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            3. Hydratation Cl⁻
          </button>
          <button
            onClick={() => setActiveTab("dissociation")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === "dissociation" 
                ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            4. Effet Dispersant (εᵣ=80)
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Canvas camera={{ position: [0, 1.2, 5.5], fov: 48 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#38bdf8" />

          {activeTab === "dipole" && (
            <WaterMolecule 
              position={[0, 0, 0]} 
              scale={1.4}
              showDipole={showDipoles}
              showCharges={showCharges}
              isAnimated={isPlaying}
            />
          )}

          {activeTab === "solvation_na" && (
            <HydrationShellNa 
              showCharges={showCharges} 
              showDipoles={showDipoles} 
              isPlaying={isPlaying} 
            />
          )}

          {activeTab === "solvation_cl" && (
            <HydrationShellCl 
              showCharges={showCharges} 
              showDipoles={showDipoles} 
              isPlaying={isPlaying} 
            />
          )}

          {activeTab === "dissociation" && (
            <DissociationScene 
              isPlaying={isPlaying} 
              dielectricEnabled={dielectricEnabled} 
            />
          )}

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={2.5} 
            maxDistance={9} 
          />
        </Canvas>

        {/* Floating Quick Action Overlays */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/50 text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-foreground transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <div className="h-4 w-px bg-border/60" />
            <button
              onClick={() => setShowCharges(!showCharges)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                showCharges ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              {showCharges ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Charges Partielles</span>
            </button>
            <button
              onClick={() => setShowDipoles(!showDipoles)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                showDipoles ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Vecteur Dipôle p⃗</span>
            </button>

            {activeTab === "dissociation" && (
              <button
                onClick={() => setDielectricEnabled(!dielectricEnabled)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  dielectricEnabled ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{dielectricEnabled ? "Eau (εᵣ=80)" : "Vide (εᵣ=1)"}</span>
              </button>
            )}
          </div>

          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/50 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Faites glisser pour faire tourner la molécule en 3D</span>
          </div>
        </div>
      </div>

      {/* Explanatory Scientific Footer Panel */}
      <div className="p-4 bg-slate-900/60 border-t border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {activeTab === "dipole" && (
          <div className="space-y-1.5">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-400">
              ⚡ Structure & Polarité de l&apos;Eau :
            </span>
            <p>
              L&apos;oxygène est plus électronégatif (<LatexMath math="\chi_O = 3.44" />) que l&apos;hydrogène (<LatexMath math="\chi_H = 2.20" />). La géométrie coudée (angle <LatexMath math="\theta = 104.5^\circ" />) confère à la molécule un fort moment dipolaire permanent <LatexMath math="p = 1.85\text{ D} = 6.17 \times 10^{-30}\text{ C}\cdot\text{m}" />.
            </p>
          </div>
        )}

        {activeTab === "solvation_na" && (
          <div className="space-y-1.5">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-indigo-400">
              💧 Hydratation du Cation <LatexMath math="\text{Na}^+" /> (Pouvoir Solvatant) :
            </span>
            <p>
              Les atomes d&apos;oxygène (<LatexMath math="\delta^-" />) s&apos;orientent vers le cation <LatexMath math="\text{Na}^+" />, formant une première sphère d&apos;hydratation stable qui libère une grande <strong>énergie d&apos;hydratation</strong> (<LatexMath math="\Delta_{\text{hyd}}H^\circ < 0" />).
            </p>
          </div>
        )}

        {activeTab === "solvation_cl" && (
          <div className="space-y-1.5">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-400">
              🧪 Hydratation de l&apos;Anion <LatexMath math="\text{Cl}^-" /> (Liaisons Hydrogène) :
            </span>
            <p>
              Les atomes d&apos;hydrogène (<LatexMath math="\delta^+" />) s&apos;orientent vers l&apos;anion <LatexMath math="\text{Cl}^-" /> par attraction électrostatique et établissement de liaisons hydrogène fortes, stabilisant l&apos;anion en solution aqueuse.
            </p>
          </div>
        )}

        {activeTab === "dissociation" && (
          <div className="space-y-1.5">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-sky-400">
              🛡️ Pouvoir Ionisant & Dispersant (Constante Diélectrique <LatexMath math="\varepsilon_r = 78.5" />) :
            </span>
            <p>
              D&apos;après la loi de Coulomb, la force d&apos;attraction entre deux ions distants de <LatexMath math="r" /> est <LatexMath math="F = \frac{|q_1 q_2|}{4\pi \varepsilon_0 \varepsilon_r r^2}" />. Grâce à la permittivité relative très élevée de l&apos;eau (<LatexMath math="\varepsilon_r \approx 80" />), la force d&apos;attraction réticulaire est divisée par 80, ce qui permet la dissociation spontanée des cristaux ioniques et empêche leur recombinaison (effet dispersant).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
