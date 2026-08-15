"use client";
import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";
import { Play, Pause, RotateCcw, Zap, Gauge, BatteryCharging, Wind, Lightbulb, Move3d, Compass } from "lucide-react";

// Real-time Mini Oscilloscope Waveform Component
function LiveOscilloscope({ emf, eMax }: { emf: number; eMax: number }) {
  const [history, setHistory] = useState<number[]>(() => Array(45).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), emf]);
  }, [emf]);

  const width = 115;
  const height = 34;
  const midY = height / 2;
  const scaleY = eMax > 0.05 ? (height * 0.42) / eMax : 1;

  const points = history
    .map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = midY - val * scaleY;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="w-[115px] h-[34px] bg-slate-950/90 rounded-lg border border-cyan-500/30 overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20" />
      <svg className="w-full h-full relative z-10" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.8))" }}
        />
      </svg>
      <div className="absolute top-0.5 right-1 text-[7px] font-mono font-bold text-cyan-400">
        e(t)
      </div>
    </div>
  );
}

// Sleek Cylindrical Magnet Pole Shoes (Open arc so the rotor is always visible)
function CylindricalPoleShell({
  type,
  radius = 1.12,
  length = 1.6,
  arcDeg = 75,
}: {
  type: "N" | "S";
  radius?: number;
  length?: number;
  arcDeg?: number;
}) {
  const isNorth = type === "N";
  const mainColor = isNorth ? "#ef4444" : "#3b82f6";
  const arcRad = (arcDeg * Math.PI) / 180;
  const startAngle = isNorth ? -arcRad / 2 : Math.PI - arcRad / 2;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const segments = 24;
    const rIn = radius;
    const rOut = radius + 0.1;

    const outerPts: THREE.Vector2[] = [];
    const innerPts: THREE.Vector2[] = [];

    for (let i = 0; i <= segments; i++) {
      const a = startAngle + (i / segments) * arcRad;
      outerPts.push(new THREE.Vector2(Math.cos(a) * rOut, Math.sin(a) * rOut));
      innerPts.push(new THREE.Vector2(Math.cos(a) * rIn, Math.sin(a) * rIn));
    }

    shape.moveTo(outerPts[0].x, outerPts[0].y);
    for (let i = 1; i <= segments; i++) shape.lineTo(outerPts[i].x, outerPts[i].y);
    for (let i = segments; i >= 0; i--) shape.lineTo(innerPts[i].x, innerPts[i].y);
    shape.closePath();

    const extrudeSettings = {
      depth: length,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.translate(0, 0, -length / 2);
    return geom;
  }, [radius, length, arcRad, startAngle]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={mainColor}
        roughness={0.25}
        metalness={0.3}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

// B-Field Lines: Strictly pointing from North Pole (Red, +X) to South Pole (Blue, -X)
function FieldFluxLines() {
  const lines = useMemo(() => [
    { y: 0.35, z: 0.3 },
    { y: 0.35, z: -0.3 },
    { y: 0.0, z: 0.4 },
    { y: 0.0, z: -0.4 },
    { y: -0.35, z: 0.3 },
    { y: -0.35, z: -0.3 },
  ], []);

  return (
    <group>
      {lines.map((pos, idx) => (
        <group key={idx} position={[0, pos.y, pos.z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 1.7, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.025, 0.1, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Beautiful Realistic 3D Propeller Blade (Sleek aerodynamic curved blade)
function ModernFanBlade({ angle }: { angle: number }) {
  const bladeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Smooth aerodynamic paddle profile with curved trailing & leading edges
    shape.moveTo(0, 0.04);
    shape.bezierCurveTo(0.08, 0.15, 0.14, 0.45, 0.12, 0.85);
    shape.quadraticCurveTo(0.08, 1.05, 0.0, 1.08);
    shape.quadraticCurveTo(-0.06, 1.02, -0.07, 0.85);
    shape.bezierCurveTo(-0.08, 0.45, -0.05, 0.15, 0, 0.04);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    geom.translate(0, 0.55, 0);
    return geom;
  }, []);

  return (
    <group rotation={[0, 0, angle]}>
      {/* Blade Root Neck */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.1, 16]} />
        <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Aerodynamic Blade with Angle of Attack (Twist) */}
      <group rotation={[0.3, 0, -0.05]}>
        <mesh geometry={bladeGeometry} castShadow>
          <meshPhysicalMaterial
            color="#f8fafc"
            metalness={0.3}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Glossy Cyan Wingtip Badge */}
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[0.08, 0.09, 0.024]} />
          <meshPhysicalMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.5} roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Complete Turbine Fan Assembly (Modern 3-Blade Propeller with Chrome Bullet Spinner)
function WindTurbinePropeller({ active }: { active: boolean }) {
  if (!active) return null;

  const blades = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  return (
    <group position={[0, 0, -1.3]}>
      {/* Chrome Streamlined Bullet Spinner Hub */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.42, 32]} />
        <meshPhysicalMaterial
          color="#0284c7"
          metalness={0.9}
          roughness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Chrome Central Hub Cap Base */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} />
        <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3 Aerodynamic Blades */}
      {blades.map((angle, idx) => (
        <ModernFanBlade key={idx} angle={angle} />
      ))}
    </group>
  );
}

// Cinematic Aerodynamic Wind Vortex Flow (Swirling Streamlines + Floating Wind Glints)
function WindTunnelAerodynamics({ active, speed }: { active: boolean; speed: number }) {
  const spiralsCount = 12;
  const glintsCount = 42;
  const timeRef = useRef(0);
  const linesGroupRef = useRef<THREE.Group>(null);

  // 1. Aerodynamic Swirling Streamline Ribbon Geometry
  const spiralGeometries = useMemo(() => {
    return Array.from({ length: spiralsCount }).map((_, i) => {
      const baseAngle = (i / spiralsCount) * Math.PI * 2;
      const baseRadius = 0.28 + (i % 4) * 0.22;
      const points: THREE.Vector3[] = [];
      const numSegments = 32;

      for (let j = 0; j <= numSegments; j++) {
        const u = j / numSegments; // 0 (inlet z = -4.2) to 1 (fan z = -1.3)
        const z = -4.2 + u * 2.9;
        const rad = baseRadius * (1.35 - u * 0.45); // funnels as it approaches the blades
        const twist = (1 - u) * 2.2; // vortex twist
        const angle = baseAngle + twist;
        points.push(new THREE.Vector3(Math.cos(angle) * rad, Math.sin(angle) * rad, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, 32, 0.007, 6, false);
    });
  }, []);

  // 2. Floating Wind Glint Particles
  const glintsData = useMemo(() => {
    return Array.from({ length: glintsCount }).map((_, i) => {
      const angle = (i / glintsCount) * Math.PI * 2 + (i * 0.4);
      const rad = 0.22 + (i % 5) * 0.18;
      return {
        angle,
        rad,
        uInit: Math.random(),
        speedMult: 0.8 + Math.random() * 0.4,
        size: 0.014 + (i % 3) * 0.005,
      };
    });
  }, []);

  const [glintU, setGlintU] = useState(() => glintsData.map((g) => g.uInit));

  useFrame((_, delta) => {
    if (!active || speed === 0) return;
    timeRef.current += delta * (speed * 0.7 + 1.2);

    // Rotate the entire vortex assembly in sync with the wind speed
    if (linesGroupRef.current) {
      linesGroupRef.current.rotation.z = timeRef.current;
    }

    const advance = Math.max(0.45, speed * 0.6) * delta;
    setGlintU((prev) =>
      prev.map((u, idx) => {
        const nextU = u + advance * glintsData[idx].speedMult;
        return nextU > 1.0 ? nextU - 1.0 : nextU;
      })
    );
  });

  if (!active || speed === 0) return null;

  return (
    <group>
      {/* 1. Swirling Wind Streamline Ribbons */}
      <group ref={linesGroupRef}>
        {spiralGeometries.map((geom, idx) => (
          <mesh key={idx} geometry={geom}>
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.45 * Math.min(1, speed / 0.8)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 2. Floating Wind Glints / Glow Particles travelling into the fan */}
      {glintsData.map((g, idx) => {
        const u = glintU[idx];
        const z = -4.2 + u * 2.9;
        const rad = g.rad * (1.35 - u * 0.45);
        const twist = (1 - u) * 2.2 + timeRef.current;
        const angle = g.angle + twist;
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        const fade = Math.sin(u * Math.PI); // smooth fade in and fade out

        return (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[g.size, 8, 8]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={fade * 0.85 * Math.min(1, speed / 0.8)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Laplace Force Vectors on Rotor Sides (Visible in Motor Mode)
function LaplaceForceVectors({ loopH, loopL, active }: { loopH: number; loopL: number; active: boolean }) {
  if (!active) return null;

  return (
    <group>
      {/* Top Wire Laplace Force */}
      <group position={[0, loopH / 2, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.5, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <coneGeometry args={[0.04, 0.16, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* Bottom Wire Laplace Force */}
      <group position={[0, -loopH / 2, 0]}>
        <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.5, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.04, 0.16, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </group>
  );
}

// Circuit Output Element: Light Bulb + Resistor (Generator) OR DC Power Supply (Motor)
function FrontCircuitElement({
  mode,
  emf,
  eMax,
  appliedVoltage,
}: {
  mode: "generator" | "motor";
  emf: number;
  eMax: number;
  appliedVoltage: number;
}) {
  const isMotor = mode === "motor";
  const genIntensity = eMax > 0.05 ? Math.min(1, Math.abs(emf) / Math.max(eMax, 4.0)) : 0;
  const isBulbLit = genIntensity > 0.05;
  const motorActive = Math.abs(appliedVoltage) > 0.1;

  return (
    <group position={[0, 0, 1.85]}>
      {isMotor ? (
        /* DC Power Supply Battery */
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 20]} />
            <meshPhysicalMaterial
              color="#1e293b"
              roughness={0.2}
              metalness={0.8}
              emissive={motorActive ? "#06b6d4" : "#000000"}
              emissiveIntensity={motorActive ? 0.8 : 0}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.082, 0.082, 0.1, 20]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={motorActive ? 1.5 : 0.2}
            />
          </mesh>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.03, 20]} />
            <meshPhysicalMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.03, 20]} />
            <meshPhysicalMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
          </mesh>
          {motorActive && (
            <pointLight position={[0, 0, 0]} intensity={2.0} distance={2.0} color="#38bdf8" />
          )}
        </group>
      ) : (
        /* Generator Output: Load Resistor with Glowing Demonstration Bulb */
        <group>
          {/* Resistor Base Block */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.065, 0.065, 0.3, 20]} />
            <meshPhysicalMaterial
              color="#0284c7"
              roughness={0.3}
              metalness={0.4}
              emissive={isBulbLit ? "#38bdf8" : "#000000"}
              emissiveIntensity={genIntensity * 1.5}
            />
          </mesh>
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Demonstration Glass Bulb */}
          <group position={[0, 0.18, 0]}>
            <mesh position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
              <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.09, 20, 20]} />
              <meshPhysicalMaterial
                color={isBulbLit ? "#fef08a" : "#94a3b8"}
                emissive={isBulbLit ? "#fbbf24" : "#000000"}
                emissiveIntensity={genIntensity * 2.8}
                transparent
                opacity={0.85}
                roughness={0.1}
                clearcoat={1.0}
              />
            </mesh>
            {isBulbLit && (
              <pointLight
                position={[0, 0.06, 0]}
                intensity={genIntensity * 3.5}
                distance={2.5}
                color="#f59e0b"
              />
            )}
          </group>
        </group>
      )}
    </group>
  );
}

// 3D Scene Controller
const AlternatorVisualization = ({
  mode,
  speed,
  appliedVoltage,
  isPaused,
  onUpdateValues,
}: {
  mode: "generator" | "motor";
  speed: number;
  appliedVoltage: number;
  isPaused: boolean;
  onUpdateValues: (emf: number, eMax: number, effectiveSpeed: number) => void;
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const thetaRef = useRef(0);
  const [thetaState, setThetaState] = useState(0);

  const loopH = 1.3;
  const loopL = 1.4;
  const B0 = 1.0;
  const S = loopH * loopL;

  // In motor mode, angular speed is driven by applied DC voltage: omega = K * U
  const effectiveSpeed = mode === "motor" ? appliedVoltage * 0.65 : speed;

  useFrame((_, delta) => {
    if (isPaused || effectiveSpeed === 0) {
      const e = mode === "generator" ? B0 * S * effectiveSpeed * Math.sin(thetaRef.current) : appliedVoltage;
      const eMax = mode === "generator" ? B0 * S * effectiveSpeed : appliedVoltage;
      onUpdateValues(e, eMax, effectiveSpeed);
      return;
    }

    if (rotorRef.current) {
      thetaRef.current += effectiveSpeed * delta;
      rotorRef.current.rotation.z = thetaRef.current;
      setThetaState(thetaRef.current);

      const e = mode === "generator" ? B0 * S * effectiveSpeed * Math.sin(thetaRef.current) : appliedVoltage;
      const eMax = mode === "generator" ? B0 * S * effectiveSpeed : appliedVoltage;
      onUpdateValues(e, eMax, effectiveSpeed);
    }
  });

  const currentEmf = mode === "generator" ? B0 * S * effectiveSpeed * Math.sin(thetaRef.current) : appliedVoltage;
  const currentEMax = mode === "generator" ? B0 * S * effectiveSpeed : appliedVoltage;

  // Instantaneous magnetic flux & induced EMF factor
  const fluxFactor = Math.cos(thetaState);
  const isFluxPositive = fluxFactor >= 0;
  const fluxIntensity = Math.abs(fluxFactor);

  const commutatorRadius = 0.16;
  const commutatorZ = loopL / 2 + 0.35; // z = 1.05

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Curved Stator Pole Shells */}
      <CylindricalPoleShell type="N" radius={1.08} length={1.5} arcDeg={80} />
      <CylindricalPoleShell type="S" radius={1.08} length={1.5} arcDeg={80} />

      {/* 2. Magnetic Flux Streamlines */}
      <FieldFluxLines />

      {/* 3. Central Stainless Steel Shaft */}
      <mesh position={[0, 0, 0.0]}>
        <cylinderGeometry args={[0.024, 0.024, 3.4, 24]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* 4. Realistic Aerodynamic Wind Tunnel Streamlines & Particles (Generator Mode) */}
      <WindTunnelAerodynamics active={mode === "generator"} speed={speed} />

      {/* 5. ROTATING ASSEMBLY (Propeller + Loop + Commutator Rings) */}
      <group ref={rotorRef} position={[0, 0, 0]}>
        {/* Wind Turbine Propeller (Mirwaha) */}
        <WindTurbinePropeller active={mode === "generator"} />

        {/* Rectangular Copper Loop Wires */}
        <mesh position={[0, loopH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, loopL, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, -loopH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, loopL, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, -loopL / 2]}>
          <cylinderGeometry args={[0.022, 0.022, loopH, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, loopL / 2]}>
          <cylinderGeometry args={[0.022, 0.022, loopH, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* DYNAMIC FLUX INVERSION SURFACE: Colors dynamically flip & pulse with AC magnetic flux */}
        <mesh position={[0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[loopL, loopH]} />
          <meshPhysicalMaterial
            color={isFluxPositive ? "#0284c7" : "#ef4444"}
            emissive={isFluxPositive ? "#38bdf8" : "#f43f5e"}
            emissiveIntensity={fluxIntensity * 0.75}
            roughness={0.2}
            metalness={0.3}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Laplace Force Vectors (Active in Motor Mode) */}
        <LaplaceForceVectors loopH={loopH} loopL={loopL} active={mode === "motor" && Math.abs(appliedVoltage) > 0.2} />

        {/* CONTINUOUS ROTATING COPPER TERMINALS */}
        <mesh position={[0, (loopH / 2 + commutatorRadius) / 2, loopL / 2]}>
          <cylinderGeometry args={[0.02, 0.02, loopH / 2 - commutatorRadius, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, commutatorRadius, loopL / 2 + (commutatorZ - loopL / 2) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, commutatorZ - loopL / 2, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        <mesh position={[0, -(loopH / 2 + commutatorRadius) / 2, loopL / 2]}>
          <cylinderGeometry args={[0.02, 0.02, loopH / 2 - commutatorRadius, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh position={[0, -commutatorRadius, loopL / 2 + (commutatorZ - loopL / 2) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, commutatorZ - loopL / 2, 16]} />
          <meshPhysicalMaterial color="#d97706" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* ROTATING SPLIT-RING COMMUTATOR */}
        <group position={[0, 0, commutatorZ]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[commutatorRadius, commutatorRadius, 0.22, 28, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
            <meshPhysicalMaterial color="#f59e0b" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[commutatorRadius, commutatorRadius, 0.22, 28, 1, true, Math.PI * 0.58, Math.PI * 0.84]} />
            <meshPhysicalMaterial color="#f59e0b" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Normal Vector n Arrow */}
        <group position={[0, 0, 0]}>
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* 6. STATIONARY CARBON BRUSHES & OUTPUT WIRES */}
      <mesh position={[-(commutatorRadius + 0.035), 0, commutatorZ]}>
        <boxGeometry args={[0.07, 0.07, 0.12]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[-(commutatorRadius + 0.085), 0, commutatorZ]}>
        <boxGeometry args={[0.04, 0.08, 0.1]} />
        <meshPhysicalMaterial color="#2563eb" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh position={[commutatorRadius + 0.035, 0, commutatorZ]}>
        <boxGeometry args={[0.07, 0.07, 0.12]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.8} roughness={0.5} />
      </mesh>
      <mesh position={[commutatorRadius + 0.085, 0, commutatorZ]}>
        <boxGeometry args={[0.04, 0.08, 0.1]} />
        <meshPhysicalMaterial color="#dc2626" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* LEFT WIRE (BLUE / NEGATIVE −) */}
      <mesh position={[-(commutatorRadius + 0.085), 0, (commutatorZ + 1.85) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.85 - commutatorZ, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[(-(commutatorRadius + 0.085) - 0.15) / 2, 0, 1.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, (commutatorRadius + 0.085) - 0.15, 12]} />
        <meshPhysicalMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* RIGHT WIRE (RED / POSITIVE +) */}
      <mesh position={[commutatorRadius + 0.085, 0, (commutatorZ + 1.85) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.85 - commutatorZ, 12]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[(commutatorRadius + 0.085 + 0.15) / 2, 0, 1.85]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, (commutatorRadius + 0.085) - 0.15, 12]} />
        <meshPhysicalMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* 7. Front Circuit Output Element (Load Lamp in Gen Mode / Battery in Motor Mode) */}
      <FrontCircuitElement
        mode={mode}
        emf={currentEmf}
        eMax={currentEMax}
        appliedVoltage={appliedVoltage}
      />

      {/* Studio Floor Shadow */}
      <ContactShadows position={[0, -1.05, 0]} opacity={0.35} scale={6} blur={2.0} far={3.0} />
    </group>
  );
};

export default function Alternator3DCanvas() {
  const [mode, setMode] = useState<"generator" | "motor">("generator");
  const [speed, setSpeed] = useState(2.8);             // wind speed / omega for Generator mode
  const [appliedVoltage, setAppliedVoltage] = useState(6.0); // U (Volts) for Motor mode
  const [isPaused, setIsPaused] = useState(false);
  const [simData, setSimData] = useState({ e: 0, eMax: 0, speed: 2.8 });

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans max-w-full select-none">
      {/* Mode Switcher Banner: Generator vs Motor */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-md backdrop-blur-sm">
        <div className="grid grid-cols-2 w-full gap-1.5 sm:gap-2">
          <button
            onClick={() => { setMode("generator"); setIsPaused(false); }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              mode === "generator"
                ? "bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sky-500/10"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Wind size={14} className={mode === "generator" ? "text-sky-400" : "text-slate-500"} />
            <span>1. Mode Éolienne / Turbine (Vent ➔ Électricité)</span>
          </button>

          <button
            onClick={() => { setMode("motor"); setIsPaused(false); }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              mode === "motor"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-emerald-500/10"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <BatteryCharging size={14} className={mode === "motor" ? "text-emerald-400" : "text-slate-500"} />
            <span>2. Mode Moteur Électrique (Laplace)</span>
          </button>
        </div>
      </div>

      <div className="w-full h-[320px] sm:h-[370px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-slate-800">
        
        {/* Top-Left Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg flex items-center gap-1.5">
            {mode === "generator" ? (
              <>
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[10px] sm:text-xs text-sky-200 font-bold">
                  Éolienne • Souffle du Vent ➔ Énergie Électrique
                </span>
              </>
            ) : (
              <>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] sm:text-xs text-emerald-200 font-bold">
                  Moteur • Tension Continue ➔ Forces de Laplace
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3D Navigation Hint Pill */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700/40 text-[9px] text-slate-400">
          <Compass size={11} className="text-cyan-400" />
          <span>Rotation 360° libre • Zoom molette</span>
        </div>

        {/* Top-Right HUD: Oscilloscope & Digital Voltmeter / Speedometer */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-1.5 sm:p-2 rounded-xl shadow-xl pointer-events-none">
          {mode === "generator" ? (
            <>
              <LiveOscilloscope emf={simData.e} eMax={simData.eMax} />
              
              <div className="flex flex-col items-center min-w-[65px]">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Tension e(t)</span>
                <span 
                  className={`text-xs sm:text-sm font-mono font-black transition-colors ${
                    Math.abs(simData.e) < 0.05 ? "text-slate-300" : simData.e > 0 ? "text-cyan-400" : "text-rose-400"
                  }`}
                  style={{ textShadow: `0 0 8px ${simData.e >= 0 ? "rgba(6,182,212,0.6)" : "rgba(244,63,94,0.6)"}` }}
                >
                  {simData.e > 0 ? "+" : ""}{simData.e.toFixed(2)} V
                </span>
                <span className="text-[8px] text-slate-400 font-medium">
                  e₀ = {simData.eMax.toFixed(2)} V
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5 px-1 py-0.5">
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Tension U</span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-400">
                  {appliedVoltage.toFixed(1)} V
                </span>
              </div>
              <div className="w-[1px] h-6 bg-slate-700/60" />
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Vitesse ω</span>
                <span className="text-xs sm:text-sm font-mono font-black text-cyan-400">
                  {simData.speed.toFixed(1)} rad/s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas with 100% FREE ORBIT CONTROLS (Full 360° rotation, smooth zoom, pan) */}
        <Canvas camera={{ position: [3.6, 1.8, 2.4], fov: 34 }} className="w-full h-full cursor-grab active:cursor-grabbing">
          <color attach="background" args={["#0b1120"]} />
          <ambientLight intensity={0.95} />
          <directionalLight position={[6, 8, 6]} intensity={2.0} castShadow />
          <directionalLight position={[-6, 4, -4]} intensity={0.8} color="#38bdf8" />
          <pointLight position={[2, 3, 3]} intensity={1.0} color="#f59e0b" />
          
          <OrbitControls 
            makeDefault 
            enableDamping 
            dampingFactor={0.08}
            minDistance={0.5} 
            maxDistance={25}
          />

          <AlternatorVisualization 
            mode={mode}
            speed={speed} 
            appliedVoltage={appliedVoltage}
            isPaused={isPaused} 
            onUpdateValues={(e, eMax, effSpeed) => setSimData({ e, eMax, speed: effSpeed })} 
          />
        </Canvas>
      </div>

      {/* Controls Toolbar tailored to active Mode */}
      <div className="w-full bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex flex-col gap-2 shadow-md backdrop-blur-sm">
        
        {/* Play/Pause & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-[11px] transition-all shadow-sm border ${
                isPaused 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                  : "bg-sky-500/10 text-sky-400 border-sky-500/50 hover:bg-sky-500/20"
              }`}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? "Démarrer" : "Pause"}
            </button>
            
            <button
              onClick={() => { setSpeed(2.8); setAppliedVoltage(6.0); setIsPaused(false); }}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              title="Réinitialiser paramètres"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            {mode === "generator" ? (
              <>
                <Lightbulb size={11} className="text-amber-400" />
                <span>Puissance générée : </span>
                <span className="text-cyan-400 font-bold">{(1 * 1.0 * (1.3 * 1.4) * speed).toFixed(2)} V</span>
              </>
            ) : (
              <>Couple Laplace : <span className="text-emerald-400 font-bold">Γ = {(appliedVoltage * 0.15).toFixed(2)} N·m</span></>
            )}
          </div>
        </div>

        {/* Dynamic Slider depending on mode */}
        {mode === "generator" ? (
          /* Slider: Wind Speed (Vent qui frappe la turbine) */
          <div className="flex flex-col gap-1 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
            <div className="flex justify-between items-center text-xs font-semibold gap-1.5">
              <span className="text-sky-400 flex items-center gap-1 text-[11px] whitespace-nowrap">
                <Wind size={12} className="shrink-0" />
                Vitesse du Souffle du Vent (<LatexMath math="v_{\text{vent}}" />)
              </span>
              <span className="font-mono text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded text-[10px] border border-sky-800/60 shrink-0">
                {speed === 0 ? "Vent nul (Arrêt)" : `${(speed * 3.6).toFixed(1)} km/h (${speed.toFixed(1)} rad/s)`}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="8" 
              step="0.2"
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-sky-500 hover:accent-sky-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ) : (
          /* Slider: Applied DC Voltage (U) */
          <div className="flex flex-col gap-1 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
            <div className="flex justify-between items-center text-xs font-semibold gap-1.5">
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] whitespace-nowrap">
                <Gauge size={12} className="shrink-0" />
                Tension continue d'alimentation (<LatexMath math="U" />)
              </span>
              <span className="font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] border border-emerald-800/60 shrink-0">
                {appliedVoltage === 0 ? "0 V (Moteur éteint)" : `${appliedVoltage.toFixed(1)} V`}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="12" 
              step="0.5"
              value={appliedVoltage} 
              onChange={(e) => setAppliedVoltage(Number(e.target.value))}
              className="w-full accent-emerald-500 hover:accent-emerald-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

      </div>
    </div>
  );
}
