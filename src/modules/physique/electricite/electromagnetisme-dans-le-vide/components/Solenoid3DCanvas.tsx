"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html, Environment, ContactShadows, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import LatexMath from "@/components/ui/LatexMath";

// A component to draw a dot (current coming out)
function Dot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#78350f" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// A component to draw a cross (current going in)
function Cross({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[-0.1, -0.1, 0.01], [0.1, 0.1, 0.01]]} color="#78350f" lineWidth={3} />
      <Line points={[[-0.1, 0.1, 0.01], [0.1, -0.1, 0.01]]} color="#78350f" lineWidth={3} />
    </group>
  );
}

function AmpereRectangle({ y1, y2, xLen, color, label }: { y1: number, y2: number, xLen: number, color: string, label: string }) {
  // Rectangle ABCD
  // A = (-xLen/2, y1, 0)
  // B = (xLen/2, y1, 0)
  // C = (xLen/2, y2, 0)
  // D = (-xLen/2, y2, 0)
  
  const A = new THREE.Vector3(-xLen/2, y1, 0);
  const B = new THREE.Vector3(xLen/2, y1, 0);
  const C = new THREE.Vector3(xLen/2, y2, 0);
  const D = new THREE.Vector3(-xLen/2, y2, 0);

  const pts = [A, B, C, D, A];

  return (
    <group>
      <Line points={pts} color={color} lineWidth={4} />
      
      {/* Arrows to indicate direction A->B->C->D */}
      <group position={[0, y1, 0]}>
        <mesh rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      <group position={[xLen/2, (y1+y2)/2, 0]}>
        <mesh rotation={[0, 0, y2 > y1 ? 0 : Math.PI]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      <group position={[0, y2, 0]}>
        <mesh rotation={[0, 0, Math.PI/2]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      <group position={[-xLen/2, (y1+y2)/2, 0]}>
        <mesh rotation={[0, 0, y1 > y2 ? 0 : Math.PI]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Labels */}
      <Html position={[A.x - 0.3, A.y - 0.3, 0]} center>
        <span className="text-white font-bold drop-shadow-md text-xs">A</span>
      </Html>
      <Html position={[B.x + 0.3, B.y - 0.3, 0]} center>
        <span className="text-white font-bold drop-shadow-md text-xs">B</span>
      </Html>
      <Html position={[C.x + 0.3, C.y + 0.3, 0]} center>
        <span className="text-white font-bold drop-shadow-md text-xs">C</span>
      </Html>
      <Html position={[D.x - 0.3, D.y + 0.3, 0]} center>
        <span className="text-white font-bold drop-shadow-md text-xs">D</span>
      </Html>
      
      {/* Contour Label */}
      <Html position={[0, Math.max(y1, y2) + 0.6, 0]} center>
         <span className="text-white font-bold bg-slate-900/80 px-2 py-1 border border-slate-700 rounded-md text-xs whitespace-nowrap">
           Contour {label}
         </span>
      </Html>
    </group>
  );
}

function SolenoidScene({ contourMode, planeMode, R, L }: { contourMode: number, planeMode: string, R: number, L: number }) {
  
  // Solenoid is along X axis, from -L to +L roughly
  // The dots/crosses will be at y = R and y = -R respectively.
  
  const numTurns = 20;
  const turns = useMemo(() => {
    const arr = [];
    for(let i=0; i<=numTurns; i++) {
      const x = -L/2 + (i / numTurns) * L;
      arr.push(x);
    }
    return arr;
  }, [L, numTurns]);

  // Magnetic Field inside is uniform, parallel to X axis
  const B_vectors = [-1.5, 0, 1.5].map(y => {
    return [-L/2 + 1, 0, L/2 - 1].map(x => ({x, y, z: 0}));
  }).flat();

  return (
    <group position={[0, 0, 0]}>
      
      {/* Cylinder Body (Transparent) */}
      <Cylinder args={[R, R, L+1, 32]} rotation={[0, 0, Math.PI/2]} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#10b981" metalness={0.2} roughness={0.1} transparent opacity={0.1} side={THREE.DoubleSide} />
      </Cylinder>

      {/* Cross section markings (Dots and Crosses) */}
      {turns.map((x, i) => (
        <React.Fragment key={i}>
          <Dot position={[x, R, 0]} />
          <Cross position={[x, -R, 0]} />
          {/* Wire circles (faint) */}
          <group position={[x, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <Line points={(() => {
              const pts = [];
              for(let j=0; j<=32; j++) pts.push(new THREE.Vector3(R*Math.cos(j*2*Math.PI/32), R*Math.sin(j*2*Math.PI/32), 0));
              return pts;
            })()} color="#f59e0b" lineWidth={1} transparent opacity={0.3} />
          </group>
        </React.Fragment>
      ))}

      {/* Axis X */}
      <Line points={[[-L/2 - 2, 0, 0], [L/2 + 2, 0, 0]]} color="#94a3b8" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
      <Html position={[L/2 + 2.5, 0, 0]} center><span className="text-slate-400 italic">Axe x</span></Html>

      {/* Magnetic Field B (Inside) */}
      {B_vectors.map((pos, idx) => (
        <group key={idx} position={[pos.x, pos.y, pos.z]}>
          <Line points={[[0,0,0], [1.5, 0, 0]]} color="#34d399" lineWidth={3} />
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
          {idx === 4 && (
            <Html position={[0.75, 0.4, 0]} center>
              <div className="text-emerald-400 font-bold italic font-serif text-sm drop-shadow-md">B<sub>int</sub></div>
            </Html>
          )}
        </group>
      ))}

      {/* Contours based on mode */}
      {contourMode === 1 && (
        <AmpereRectangle y1={-0.8} y2={0.8} xLen={4} color="#ec4899" label="C'₁ (Intérieur)" />
      )}
      {contourMode === 2 && (
        <AmpereRectangle y1={2.5} y2={4.0} xLen={4} color="#3b82f6" label="C'₃ (Extérieur)" />
      )}
      {contourMode === 3 && (
        <AmpereRectangle y1={0.8} y2={3.5} xLen={4} color="#8b5cf6" label="C'₂ (À cheval)" />
      )}

      {/* Sym Plane (XY plane containing solenoid axis) => Normal is Z */}
      {planeMode === "sym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[14, 10]} />
            <meshPhysicalMaterial color="#3b82f6" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Html position={[0, 4.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-blue-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-blue-500/30 backdrop-blur-md flex flex-col items-center">
              <span>Plan Π</span>
              <span className="text-[8px] text-blue-300/80">(Symétrie)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Anti-Sym Plane (YZ plane perpendicular to solenoid axis) => Normal is X */}
      {planeMode === "antisym" && (
        <group>
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshPhysicalMaterial color="#10b981" transparent opacity={0.15} side={THREE.DoubleSide} metalness={0.9} roughness={0.1} />
          </mesh>
          <Html position={[0, 4.5, 0]} center zIndexRange={[100,0]}>
            <div className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30 backdrop-blur-md flex flex-col items-center">
              <span>Plan Π*</span>
              <span className="text-[8px] text-emerald-300/80">(Antisymétrie)</span>
            </div>
          </Html>
        </group>
      )}

    </group>
  );
}

export default function Solenoid3DCanvas() {
  const [contourMode, setContourMode] = useState(1); // 1: In, 2: Out, 3: Straddle
  const [planeMode, setPlaneMode] = useState<"none" | "sym" | "antisym">("none");
  
  const R = 2.0;
  const L = 10.0;

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col font-sans mb-8">
      
      <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 rounded-t-2xl overflow-hidden relative border border-slate-800 border-b-0 shadow-inner">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.4} penumbra={1} intensity={2} color="#e2e8f0" />
          
          <Environment preset="night" />
          {/* Lock rotation slightly to keep the 2D cross section view easily understandable, but allow 3D viewing */}
          <OrbitControls enableDamping dampingFactor={0.05} makeDefault minDistance={5} maxDistance={30} />
          
          <SolenoidScene contourMode={contourMode} planeMode={planeMode} R={R} L={L} />

          <ContactShadows resolution={512} scale={30} blur={2} opacity={0.5} far={15} color="#000000" position={[0, -5.9, 0]} />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-card border border-border border-t-0 rounded-b-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-sm">
        
        {/* Row 1: Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          
          {/* Contours */}
          <div className="flex items-center bg-slate-800/50 p-1 rounded-xl shrink-0 border border-slate-700/50">
            <button
              onClick={() => setContourMode(1)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                contourMode === 1 
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              C'₁ (Intérieur)
            </button>
            <button
              onClick={() => setContourMode(2)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                contourMode === 2 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              C'₃ (Extérieur)
            </button>
            <button
              onClick={() => setContourMode(3)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                contourMode === 3 
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              C'₂ (À cheval)
            </button>
          </div>

          {/* Planes */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPlaneMode(planeMode === "sym" ? "none" : "sym")}
              className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                planeMode === "sym" 
                  ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                  : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
              }`}
            >
              Π
            </button>
            <button
              onClick={() => setPlaneMode(planeMode === "antisym" ? "none" : "antisym")}
              className={`px-4 h-8 text-[12px] sm:text-sm rounded-lg flex items-center justify-center font-bold transition-all border ${
                planeMode === "antisym" 
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              }`}
            >
              Π*
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
