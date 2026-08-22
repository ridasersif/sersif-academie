"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, ContactShadows, Box, Cylinder, Environment, Sphere, Cone } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Zap, Magnet, CheckCircle2, RotateCw } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// ── 1. SCÈNE ARQS MAGNÉTIQUE : FIL, DENSITÉ j & LIGNES B CONCENTRIQUES ──
const bRings = [0.65, 1.15, 1.65];
const numRingsPoints = 48;

const MagneticARQSScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.5);
  });

  const wireLength = 6.0;
  const radius = 0.22;

  // Lignes de champ B circulaires concentriques
  const ringsData = useMemo(() => {
    return bRings.map((r, ringIdx) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= numRingsPoints; i++) {
        const theta = (i / numRingsPoints) * Math.PI * 2;
        pts.push(new THREE.Vector3(0, r * Math.cos(theta), r * Math.sin(theta)));
      }
      return { r, pts, ringIdx };
    });
  }, []);

  // Particules de courant j se déplaçant le long du fil (div j = 0)
  const numParticles = 14;
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < numParticles; i++) {
      const alpha = ((time * 0.35 + i / numParticles) % 1);
      const x = -wireLength / 2 + alpha * wireLength;
      pts.push(x);
    }
    return pts;
  }, [time]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── CÂBLE CONDUCTEUR 3D CUIVRE ── */}
      <Cylinder args={[radius, radius, wireLength, 24]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color="#d97706" 
          metalness={0.7} 
          roughness={0.2} 
          transparent 
          opacity={0.88} 
        />
      </Cylinder>

      {/* ── FLÈCHE VECTEUR DENSITÉ DE COURANT j ── */}
      <group position={[0, 0.45, 0]}>
        <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#f59e0b" lineWidth={3.5} />
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.09, 0.22, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* ── PARTICULES DE COURANT DANS LE FIL (div j = 0) ── */}
      {particles.map((px, idx) => (
        <Sphere key={idx} args={[0.07, 12, 12]} position={[px, 0, 0]}>
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.9} />
        </Sphere>
      ))}

      {/* ── LIGNES DE CHAMP B CONCENTRIQUES EN ROTATION ── */}
      {[-1.5, 0, 1.5].map((posX, posIdx) => (
        <group key={posIdx} position={[posX, 0, 0]}>
          {ringsData.map((ring, rIdx) => {
            // Flèche rotative de sens sur chaque anneau
            const arrowAngle = time * 2.2 + posIdx * 0.5 + rIdx;
            const arrowY = ring.r * Math.cos(arrowAngle);
            const arrowZ = ring.r * Math.sin(arrowAngle);

            return (
              <group key={rIdx}>
                <Line 
                  points={ring.pts} 
                  color="#38bdf8" 
                  lineWidth={2.2} 
                  transparent 
                  opacity={0.75} 
                />
                <mesh 
                  position={[0, arrowY, arrowZ]} 
                  rotation={[0, 0, 0]}
                >
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};

// ── 2. SCÈNE ARQS ÉLECTRIQUE : CONDENSATEUR, CHAMP E & BOUCLE DE MAILLE ──
const ElectricARQSScene = ({ isPlaying }: { isPlaying: boolean }) => {
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    if (isPlaying) setTime((t) => t + delta * 3.0);
  });

  const plateSize = 2.4;
  const plateGap = 1.8;

  // Lignes de champ électrique E entre les armatures
  const eFieldLines = useMemo(() => {
    const lines = [];
    const numRows = 3;
    const numCols = 3;
    const startY = -plateSize / 3;
    const startZ = -plateSize / 3;

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const y = startY + (r * plateSize) / (numRows - 1);
        const z = startZ + (c * plateSize) / (numCols - 1);
        lines.push({ y, z });
      }
    }
    return lines;
  }, [plateSize]);

  // Points de la boucle de maille fermée (Loi des mailles)
  const loopPoints = useMemo(() => {
    const pts = [
      new THREE.Vector3(-plateGap / 2 - 0.7, -1.6, 0),
      new THREE.Vector3(plateGap / 2 + 0.7, -1.6, 0),
      new THREE.Vector3(plateGap / 2 + 0.7, 1.6, 0),
      new THREE.Vector3(-plateGap / 2 - 0.7, 1.6, 0),
      new THREE.Vector3(-plateGap / 2 - 0.7, -1.6, 0),
    ];
    return pts;
  }, [plateGap]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── ARMATURE POSITIVE (+Q) À GAUCHE ── */}
      <group position={[-plateGap / 2, 0, 0]}>
        <Box args={[0.1, plateSize, plateSize]}>
          <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
        </Box>
      </group>

      {/* ── ARMATURE NÉGATIVE (-Q) À DROITE ── */}
      <group position={[plateGap / 2, 0, 0]}>
        <Box args={[0.1, plateSize, plateSize]}>
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </Box>
      </group>

      {/* ── VECTEURS CHAMP ÉLECTRIQUE E UNIFORME ENTRE LES PLAQUES ── */}
      {eFieldLines.map((line, idx) => (
        <group key={idx} position={[0, line.y, line.z]}>
          <Line 
            points={[[-plateGap / 2 + 0.1, 0, 0], [plateGap / 2 - 0.1, 0, 0]]} 
            color="#a855f7" 
            lineWidth={2.2} 
          />
          <mesh position={[plateGap / 2 - 0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.05, 0.14, 8]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </group>
      ))}

      {/* ── BOUCLE DE MAILLE EXTÉRIEURE FERMÉE (rot E = 0) ── */}
      <Line 
        points={loopPoints} 
        color="#10b981" 
        lineWidth={2.5} 
        dashed 
        dashSize={0.2} 
        gapSize={0.15} 
      />

      {/* Particule voyageant sur la maille montrant la circulation nulle */}
      {(() => {
        const loopLen = (plateGap + 1.4) * 2 + 3.2 * 2;
        const progress = (time * 0.25) % 1;
        const d = progress * loopLen;

        let px = 0, py = 0;
        const w = plateGap + 1.4;
        const h = 3.2;

        if (d < w) {
          px = -w / 2 + d;
          py = -h / 2;
        } else if (d < w + h) {
          px = w / 2;
          py = -h / 2 + (d - w);
        } else if (d < 2 * w + h) {
          px = w / 2 - (d - (w + h));
          py = h / 2;
        } else {
          px = -w / 2;
          py = h / 2 - (d - (2 * w + h));
        }

        return (
          <Sphere args={[0.1, 16, 16]} position={[px, py, 0]}>
            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.9} />
          </Sphere>
        );
      })()}
    </group>
  );
};

export default function ARQSTypesDual3DCanvas() {
  const [activeTab, setActiveTab] = useState<"magnetic" | "electric">("magnetic");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans">
      
      {/* ── ONGLETS DE SÉLECTION DU CAS ── */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-card border border-border/80 text-xs">
        <div className="flex items-center gap-1 flex-1">
          <button
            onClick={() => setActiveTab("magnetic")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border flex-1 justify-center ${
              activeTab === "magnetic"
                ? "bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-xs"
                : "bg-background hover:bg-muted text-muted-foreground border-border/60"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Cas 1 : ARQS Magnétique (Circuits R, L)</span>
          </button>

          <button
            onClick={() => setActiveTab("electric")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border flex-1 justify-center ${
              activeTab === "electric"
                ? "bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-xs"
                : "bg-background hover:bg-muted text-muted-foreground border-border/60"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cas 2 : ARQS Électrique (Circuits C)</span>
          </button>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors shrink-0"
          title={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ── CANVAS 3D INTERACTIF COMPACT (240px - 260px) ── */}
      <div 
        ref={canvasContainerRef} 
        className="w-full h-[240px] sm:h-[260px] bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner border border-slate-800"
      >
        {/* HUD Info Récapitulatif en haut à gauche */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none max-w-[260px]">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 rounded-xl shadow-lg flex flex-col gap-1 text-[10.5px]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {activeTab === "magnetic" ? "ARQS Magnétique" : "ARQS Électrique"}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {activeTab === "magnetic" ? "Loi des Nœuds ✓" : "Loi des Mailles ✓"}
              </span>
            </div>

            <div className="text-white font-bold">
              {activeTab === "magnetic" 
                ? "Conservation stricte du courant j" 
                : "Champ électrique conservatif E"}
            </div>

            <div className="text-slate-400 text-[10px]">
              {activeTab === "magnetic" 
                ? "Terme négligé : Courant de déplacement jD ≈ 0" 
                : "Terme négligé : Induction temporelle ∂B/∂t ≈ 0"}
            </div>
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 1.8, 6.0], fov: 38 }} className="w-full h-full" dpr={[1, 1.5]}>
            <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.7} />
          <spotLight position={[0, 8, 5]} intensity={1.6} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />
          
          {activeTab === "magnetic" ? (
            <MagneticARQSScene isPlaying={isPlaying} />
          ) : (
            <ElectricARQSScene isPlaying={isPlaying} />
          )}
          
          <ContactShadows resolution={256} scale={10} blur={2} opacity={0.35} far={4} color="#0f172a" position={[0, -1.1, 0]} />
                    </Suspense>
          </Canvas>
      </div>

      {/* ── LÉGENDE DU VISUEL SOUS LE CANVAS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
        {activeTab === "magnetic" ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Courant de conduction <LatexMath math="\vec{j}" /></span>
            </span>
            <span className="flex items-center gap-1 text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Lignes de champ magnétique <LatexMath math="\vec{B}" /></span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span><LatexMath math="\text{div}\,\vec{j} = 0 \implies \sum I_k = 0" /></span>
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-purple-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Champ électrique <LatexMath math="\vec{E}" /></span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Boucle de maille <LatexMath math="\oint \vec{E}\cdot d\vec{l} = 0" /></span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span><LatexMath math="\sum U_k = 0" /></span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
