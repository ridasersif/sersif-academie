"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sphere, Cylinder, Box, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Magnet, Zap, Activity } from "lucide-react";

/* ──────────────────────────────────────────────
   Bezier field line with directional arrow
   ────────────────────────────────────────────── */
function FieldLine({ curve, color = "#10b981", opacity = 0.45 }: { curve: THREE.Curve<THREE.Vector3>; color?: string; opacity?: number }) {
  const midPoint = React.useMemo(() => curve.getPoint(0.5), [curve]);
  const tangent  = React.useMemo(() => curve.getTangent(0.5), [curve]);

  const arrowRotation = React.useMemo(() => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    return new THREE.Euler().setFromQuaternion(q);
  }, [tangent]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.012, 6, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={midPoint} rotation={arrowRotation}>
        <coneGeometry args={[0.055, 0.18, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Animated group wrapper (smooth position lerp)
   ────────────────────────────────────────────── */
function AnimatedGroup({ targetX, children }: { targetX: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += (targetX - ref.current.position.x) * 0.08;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/* ──────────────────────────────────────────────
   Animated camera (smooth zoom when isolating)
   ────────────────────────────────────────────── */
function CameraController({ targetZ }: { targetZ: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.setZ(camera.position.z + (targetZ - camera.position.z) * 0.05);
  });

  return null;
}

/* ──────────────────────────────────────────────
   Source 1: Charge en mouvement
   ────────────────────────────────────────────── */
function ChargeSource() {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, d) => {
    t.current += d;
    if (ref.current) ref.current.position.x = Math.sin(t.current * 1.3) * 0.8;
  });

  return (
    <group>
      <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="bg-red-950/95 border border-red-500/50 text-red-200 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap backdrop-blur-sm">
            Charge en Mouvement
          </div>
        </div>
      </Html>

      <group ref={ref}>
        <Sphere args={[0.2, 32, 32]}>
          <meshPhysicalMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={0.6} />
        </Sphere>
        <Html position={[0.25, 0.28, 0]} center>
          <span className="text-red-200 bg-red-700/80 font-mono text-[7px] font-bold px-1 rounded-full select-none">+q</span>
        </Html>

        {/* v → */}
        <Line points={[[0, 0, 0], [0.9, 0, 0]]} color="#a855f7" lineWidth={2.5} />
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.2, 10]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} />
        </mesh>
        <Html position={[1.1, 0, 0]} center>
          <span className="text-purple-300 font-mono text-[9px] font-bold select-none">v</span>
        </Html>

        {/* B ↑ */}
        <group position={[0, 0.7, 0]}>
          <Line points={[[0, 0, 0], [0, 0, 0.7]]} color="#10b981" lineWidth={2.5} />
          <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.05, 0.18, 10]} />
            <meshBasicMaterial color="#10b981" toneMapped={false} />
          </mesh>
          <Html position={[0.15, 0, 0.8]} center>
            <span className="text-emerald-300 font-mono text-[9px] font-bold select-none">B</span>
          </Html>
          <Sphere args={[0.03]}><meshBasicMaterial color="#64748b" /></Sphere>
        </group>
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Source 2: Courant (fil infini)
   ────────────────────────────────────────────── */
function WireSource() {
  const eRef = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!eRef.current) return;
    eRef.current.children.forEach((e) => {
      e.position.y += d * 1.8;
      if (e.position.y > 1.8) e.position.y = -1.8;
    });
  });

  return (
    <group>
      <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="bg-blue-950/95 border border-blue-500/50 text-blue-200 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap backdrop-blur-sm">
            Courant Électrique
          </div>
        </div>
      </Html>

      <Cylinder args={[0.06, 0.06, 3.6, 16]}>
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} transparent opacity={0.45} />
      </Cylinder>

      <group ref={eRef}>
        {[-1.6, -1.3, -1.0, -0.7, -0.4, -0.1, 0.2, 0.5, 0.8, 1.1, 1.4, 1.7].map((y, i) => (
          <Sphere key={i} args={[0.04]} position={[0, y, 0]}>
            <meshBasicMaterial color="#60a5fa" toneMapped={false} />
          </Sphere>
        ))}
      </group>

      {/* I ↑ */}
      <Line points={[[0.25, 1, 0], [0.25, 1.55, 0]]} color="#3b82f6" lineWidth={3} />
      <mesh position={[0.25, 1.55, 0]}>
        <coneGeometry args={[0.065, 0.2, 10]} />
        <meshBasicMaterial color="#3b82f6" toneMapped={false} />
      </mesh>
      <Html position={[0.4, 1.55, 0]} center>
        <span className="text-blue-300 font-mono text-[9px] font-bold select-none">I</span>
      </Html>

      {/* B rings */}
      {[0.45, 0.8].map((r, i) => (
        <group key={i}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.018, 64]} />
            <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.5 - i * 0.12} />
          </mesh>
          <mesh position={[r, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.05, 0.16, 10]} />
            <meshBasicMaterial color="#10b981" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <Html position={[1, 0, 0]} center>
        <span className="text-emerald-300 font-mono text-[8px] font-bold select-none">B</span>
      </Html>
    </group>
  );
}

/* ──────────────────────────────────────────────
   Source 3: Aimant droit — realistic dipole field
   ────────────────────────────────────────────── */
function MagnetSource() {
  const curves = React.useMemo(() => {
    const c: THREE.CubicBezierCurve3[] = [];

    // Helper: all curves in XY plane (z=0)
    // The magnet sits horizontal: N at x=-0.5, S at x=+0.5
    // Field lines go FROM N (left) TO S (right) on the OUTSIDE
    const bz = (sx: number, sy: number, cx1: number, cy1: number, cx2: number, cy2: number, ex: number, ey: number, z1 = 0, z2 = 0) =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(sx, sy, 0),
        new THREE.Vector3(cx1, cy1, z1),
        new THREE.Vector3(cx2, cy2, z2),
        new THREE.Vector3(ex, ey, 0),
      );

    // ─── TOP arcs (from N-face to S-face, curving upward) ───
    c.push(bz(-0.55,  0.22, -0.6,  0.65,  0.6,  0.65,  0.55,  0.22, 0.15, -0.15));
    c.push(bz(-0.55,  0.22, -0.85, 1.1,   0.85, 1.1,   0.55,  0.22, 0.25, -0.25));
    c.push(bz(-0.55,  0.22, -1.2,  1.7,   1.2,  1.7,   0.55,  0.22, 0.35, -0.35));
    c.push(bz(-0.55,  0.22, -1.6,  2.5,   1.6,  2.5,   0.55,  0.22, 0.5, -0.5));

    // ─── BOTTOM arcs (mirror) ───
    c.push(bz(-0.55, -0.22, -0.6,  -0.65, 0.6,  -0.65, 0.55, -0.22, 0.15, -0.15));
    c.push(bz(-0.55, -0.22, -0.85, -1.1,  0.85, -1.1,  0.55, -0.22, 0.25, -0.25));
    c.push(bz(-0.55, -0.22, -1.2,  -1.7,  1.2,  -1.7,  0.55, -0.22, 0.35, -0.35));
    c.push(bz(-0.55, -0.22, -1.6,  -2.5,  1.6,  -2.5,  0.55, -0.22, 0.5, -0.5));

    // ─── SIDE arcs ───
    c.push(bz(-0.55, 0, -2.0,  0.9,  2.0,  0.9,  0.55, 0, 0.3, -0.3));
    c.push(bz(-0.55, 0, -2.0, -0.9,  2.0, -0.9,  0.55, 0, 0.3, -0.3));

    return c;
  }, []);

  return (
    <group>
      <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="bg-purple-950/95 border border-purple-500/50 text-purple-200 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap backdrop-blur-sm">
            Aimant Permanent
          </div>
        </div>
      </Html>

      {/* Bar magnet body: N (red, left) — S (blue, right) */}
      {/* Using rotation to place N left and S right */}
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* N pole → maps to LEFT after 90° rotation */}
        <Box args={[0.44, 1.1, 0.44]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.12} />
          <Html position={[0, 0, 0.23]} center>
            <span className="text-white font-black text-[11px] drop-shadow-lg select-none">N</span>
          </Html>
        </Box>
        {/* S pole → maps to RIGHT */}
        <Box args={[0.44, 1.1, 0.44]} position={[0, -0.55, 0]}>
          <meshStandardMaterial color="#2563eb" roughness={0.35} metalness={0.12} />
          <Html position={[0, 0, 0.23]} center>
            <span className="text-white font-black text-[11px] drop-shadow-lg select-none">S</span>
          </Html>
        </Box>
      </group>

      {/* Field lines */}
      {curves.map((c, i) => (
        <FieldLine key={i} curve={c} opacity={0.45 - (i % 4) * 0.06} />
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────── */
type SourceKey = "all" | "charge" | "wire" | "magnet";

const POSITIONS: Record<SourceKey, { charge: number; wire: number; magnet: number; camZ: number }> = {
  all:    { charge: -4.5, wire: 0, magnet: 4.5, camZ: 10 },
  charge: { charge: 0,    wire: 0, magnet: 0,   camZ: 6  },
  wire:   { charge: 0,    wire: 0, magnet: 0,   camZ: 6  },
  magnet: { charge: 0,    wire: 0, magnet: 0,   camZ: 5  },
};

export default function MagneticSources3DCanvas() {
  const [active, setActive] = useState<SourceKey>("all");
  const pos = POSITIONS[active];

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-full mx-auto flex flex-col rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={canvasContainerRef} className="w-full h-[260px] sm:h-[340px] md:h-[380px] bg-slate-950 relative">
        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [0, 1, 9], fov: 40 }} className="w-full flex-1 cursor-grab active:cursor-grabbing" dpr={[1, 2]}>
            <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[4, 10, 5]} angle={0.5} penumbra={1} intensity={1} />
          <Environment preset="city" />
          <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 1.6} autoRotate autoRotateSpeed={0.25} />
          <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -1.2, 0]} />

          <CameraController targetZ={pos.camZ} />

          <group position={[0, 0.2, 0]}>
            {(active === "all" || active === "charge") && (
              <AnimatedGroup targetX={pos.charge}>
                <ChargeSource />
              </AnimatedGroup>
            )}
            {(active === "all" || active === "wire") && (
              <AnimatedGroup targetX={pos.wire}>
                <WireSource />
              </AnimatedGroup>
            )}
            {(active === "all" || active === "magnet") && (
              <AnimatedGroup targetX={pos.magnet}>
                <MagnetSource />
              </AnimatedGroup>
            )}
          </group>

          <ContactShadows resolution={512} scale={20} blur={2} opacity={0.3} far={4} color="#0f172a" position={[0, -1.19, 0]} />
                    </Suspense>
          </Canvas>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-2.5 py-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {([
          { key: "all"    as SourceKey, label: "Toutes",  Icon: null,     on: "bg-slate-700 text-white",                                     off: "bg-slate-800 text-slate-400 hover:bg-slate-750" },
          { key: "charge" as SourceKey, label: "Charge",  Icon: Activity, on: "bg-red-500/15 text-red-400 border border-red-500/40",          off: "bg-slate-800 text-slate-400 border border-transparent" },
          { key: "wire"   as SourceKey, label: "Courant", Icon: Zap,      on: "bg-blue-500/15 text-blue-400 border border-blue-500/40",       off: "bg-slate-800 text-slate-400 border border-transparent" },
          { key: "magnet" as SourceKey, label: "Aimant",  Icon: Magnet,   on: "bg-purple-500/15 text-purple-400 border border-purple-500/40", off: "bg-slate-800 text-slate-400 border border-transparent" },
        ]).map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActive(btn.key)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all duration-300 flex items-center gap-1 ${active === btn.key ? btn.on : btn.off}`}
          >
            {btn.Icon && <btn.Icon className="w-3 h-3" />}
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
