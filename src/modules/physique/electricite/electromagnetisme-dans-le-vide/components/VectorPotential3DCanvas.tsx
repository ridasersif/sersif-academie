"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, ContactShadows, Cylinder, Environment, Torus, Sphere, Cone } from "@react-three/drei";
import * as THREE from "three";
import { Eye, EyeOff, RefreshCw, Info } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// -------------------------------------------------------------
// SHAPE CONFIGURATIONS
// -------------------------------------------------------------
const SHAPES = [
  { id: 'fil_infini', label: 'Fil Infini', activeColor: "bg-blue-500/20 text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]", inactiveColor: "bg-blue-500/5 text-blue-300 border-blue-500/30 hover:bg-blue-500/10" },
  { id: 'cylindre', label: 'Cylindre', activeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]", inactiveColor: "bg-cyan-500/5 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10" },
  { id: 'plan', label: 'Plan', activeColor: "bg-lime-500/20 text-lime-400 border-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.5)]", inactiveColor: "bg-lime-500/5 text-lime-300 border-lime-500/30 hover:bg-lime-500/10" },
  { id: 'cone', label: 'Cône (Axial)', activeColor: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)]", inactiveColor: "bg-fuchsia-500/5 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/10" },
  { id: 'tore_circulaire', label: 'Tore Circulaire', activeColor: "bg-orange-500/20 text-orange-400 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]", inactiveColor: "bg-orange-500/5 text-orange-300 border-orange-500/30 hover:bg-orange-500/10" },
  { id: 'tore_carre', label: 'Tore Carré', activeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]", inactiveColor: "bg-yellow-500/5 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/10" },
  { id: 'bobine', label: 'Bobine', activeColor: "bg-teal-500/20 text-teal-400 border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]", inactiveColor: "bg-teal-500/5 text-teal-300 border-teal-500/30 hover:bg-teal-500/10" },
  { id: 'spire', label: 'Spire', activeColor: "bg-pink-500/20 text-pink-400 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]", inactiveColor: "bg-pink-500/5 text-pink-300 border-pink-500/30 hover:bg-pink-500/10" },
  { id: 'sphere', label: 'Sphère', activeColor: "bg-purple-500/20 text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]", inactiveColor: "bg-purple-500/5 text-purple-300 border-purple-500/30 hover:bg-purple-500/10" },
  { id: 'demi_sphere', label: 'Demi-Sphère', activeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]", inactiveColor: "bg-indigo-500/5 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10" },
  { id: 'double_cone', label: 'Double Cône', activeColor: "bg-rose-500/20 text-rose-400 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]", inactiveColor: "bg-rose-500/5 text-rose-300 border-rose-500/30 hover:bg-rose-500/10" }
];

// -------------------------------------------------------------
// GEOMETRY & PHYSICS RENDERERS
// -------------------------------------------------------------

// 1. FIL INFINI & CYLINDRE
const WirePhysics = ({ direction, showA, showB, radius, isCylinder }: any) => {
  const meshA = useRef<THREE.InstancedMesh>(null);
  const meshAArrow = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshBArrow = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const count = 12;
  const zPositions = [-1.5, 0, 1.5];
  const total = count * zPositions.length;

  useFrame(() => {
    if (!meshA.current || !meshAArrow.current || !meshB.current || !meshBArrow.current) return;
    let index = 0;
    for (let z of zPositions) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (showA) {
          const scaleA = Math.max(0.2, 1.5 - 0.4 * radius);
          dummy.position.set(x, y, z + (scaleA * 0.4 * direction));
          dummy.scale.set(0.02, scaleA * 0.8, 0.02);
          dummy.rotation.set(Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          meshA.current.setMatrixAt(index, dummy.matrix);
          
          dummy.position.set(x, y, z + (scaleA * 0.8 * direction));
          dummy.scale.set(0.05, 0.12, 0.05);
          dummy.rotation.set(direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          meshAArrow.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          meshA.current.setMatrixAt(index, dummy.matrix); meshAArrow.current.setMatrixAt(index, dummy.matrix);
        }

        if (showB) {
          const bx = -Math.sin(angle) * direction;
          const by = Math.cos(angle) * direction;
          const scaleB = 1.2 / radius;
          dummy.position.set(x + bx * scaleB * 0.4, y + by * scaleB * 0.4, z);
          dummy.scale.set(0.02, scaleB * 0.8, 0.02);
          dummy.rotation.set(0, 0, angle + (direction > 0 ? 0 : Math.PI));
          dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix);
          
          dummy.position.set(x + bx * scaleB * 0.8, y + by * scaleB * 0.8, z);
          dummy.scale.set(0.05, 0.12, 0.05);
          dummy.rotation.set(0, 0, angle + (direction > 0 ? 0 : Math.PI));
          dummy.updateMatrix();
          meshBArrow.current.setMatrixAt(index, dummy.matrix);
        } else {
          dummy.scale.setScalar(0); dummy.updateMatrix();
          meshB.current.setMatrixAt(index, dummy.matrix); meshBArrow.current.setMatrixAt(index, dummy.matrix);
        }
        index++;
      }
    }
    meshA.current.instanceMatrix.needsUpdate = true; meshAArrow.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true; meshBArrow.current.instanceMatrix.needsUpdate = true;
  });

  const wireRadius = isCylinder ? 0.4 : 0.08;

  return (
    <group>
      <Cylinder args={[wireRadius, wireRadius, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.1} transparent opacity={isCylinder ? 0.3 : 0.6} side={THREE.DoubleSide} />
      </Cylinder>
      <Line points={Array.from({ length: 65 }).map((_, i) => new THREE.Vector3(radius * Math.cos((i / 64) * Math.PI * 2), radius * Math.sin((i / 64) * Math.PI * 2), 0))} color="#475569" lineWidth={1} transparent opacity={0.8} />
      
      <instancedMesh ref={meshA} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#00e5ff" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshAArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#00e5ff" /></instancedMesh>
      <instancedMesh ref={meshB} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#ff007f" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshBArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#ff007f" /></instancedMesh>
      <CurrentParticles direction={direction} geometryType={isCylinder ? "cylinder" : "line"} solRadius={wireRadius} />
    </group>
  );
};

// 2. PLAN (Nappe)
const PlanePhysics = ({ direction, showA, showB, radius }: any) => {
  const meshA = useRef<THREE.InstancedMesh>(null);
  const meshAArrow = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshBArrow = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const yPositions = [-radius, radius];
  const zPositions = [-2, 0, 2];
  const xPositions = [-2, 0, 2];
  const total = yPositions.length * zPositions.length * xPositions.length;

  useFrame(() => {
    if (!meshA.current || !meshAArrow.current || !meshB.current || !meshBArrow.current) return;
    let index = 0;
    for (let y of yPositions) {
      for (let z of zPositions) {
        for (let x of xPositions) {
          if (showA) {
            const dirA = -direction * Math.sign(y);
            const scaleA = Math.max(0.2, 1.2 - 0.2 * Math.abs(y));
            dummy.position.set(x + (scaleA * 0.4 * dirA), y, z);
            dummy.scale.set(0.02, scaleA * 0.8, 0.02);
            dummy.rotation.set(0, 0, Math.PI / 2);
            dummy.updateMatrix();
            meshA.current.setMatrixAt(index, dummy.matrix);
            
            dummy.position.set(x + (scaleA * 0.8 * dirA), y, z);
            dummy.scale.set(0.05, 0.12, 0.05);
            dummy.rotation.set(0, 0, dirA > 0 ? Math.PI / 2 : -Math.PI / 2);
            dummy.updateMatrix();
            meshAArrow.current.setMatrixAt(index, dummy.matrix);
          } else {
            dummy.scale.setScalar(0); dummy.updateMatrix();
            meshA.current.setMatrixAt(index, dummy.matrix); meshAArrow.current.setMatrixAt(index, dummy.matrix);
          }

          if (showB) {
            const dirB = direction * Math.sign(y);
            const scaleB = 0.8;
            dummy.position.set(x, y, z + (scaleB * 0.4 * dirB));
            dummy.scale.set(0.02, scaleB * 0.8, 0.02);
            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            meshB.current.setMatrixAt(index, dummy.matrix);
            
            dummy.position.set(x, y, z + (scaleB * 0.8 * dirB));
            dummy.scale.set(0.05, 0.12, 0.05);
            dummy.rotation.set(dirB > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            meshBArrow.current.setMatrixAt(index, dummy.matrix);
          } else {
            dummy.scale.setScalar(0); dummy.updateMatrix();
            meshB.current.setMatrixAt(index, dummy.matrix); meshBArrow.current.setMatrixAt(index, dummy.matrix);
          }
          index++;
        }
      }
    }
    meshA.current.instanceMatrix.needsUpdate = true; meshAArrow.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true; meshBArrow.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshPhysicalMaterial color="#0f172a" transparent opacity={0.6} side={THREE.DoubleSide} metalness={0.8} roughness={0.2} />
      </mesh>
      <gridHelper args={[8, 16, 0x334155, 0x1e293b]} position={[0, 0, 0]} />
      <instancedMesh ref={meshA} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#00e5ff" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshAArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#00e5ff" /></instancedMesh>
      <instancedMesh ref={meshB} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#ff007f" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshBArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#ff007f" /></instancedMesh>
      <CurrentParticles direction={direction} geometryType="plane" />
    </group>
  );
};

// 3. GÉNÉRIQUE AXISYMETRIQUE (Solénoïde, Tore, Sphère, Cône, etc.)
// Utilise A azimutal, et B dipolaire/axial
const AxisymmetricPhysics = ({ direction, showA, showB, radius, shape }: any) => {
  const meshA = useRef<THREE.InstancedMesh>(null);
  const meshAArrow = useRef<THREE.InstancedMesh>(null);
  const meshB = useRef<THREE.InstancedMesh>(null);
  const meshBArrow = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const solRadius = 1;
  const isToroidal = shape.includes('tore');
  const obsPoints: any[] = [];
  
  if (isToroidal) {
    // Torus: B is azimuthal inside the tube (R=1.5). A is axial inside the hole (r=0).
    for (let i = 0; i < 16; i++) {
      obsPoints.push({ r: 1.5, theta: (i/16)*Math.PI*2, z: 0, type: 'tube' });
    }
    for (let z = -1.5; z <= 1.5; z += 0.5) {
      obsPoints.push({ r: 0.01, theta: 0, z, type: 'hole' });
    }
  } else {
    // Azimuthal currents (Spire, Solenoid, Sphere): B is poloidal, A is azimuthal
    const zPositions = [-1.5, 0, 1.5];
    const count = 12;
    for (let z of zPositions) {
      for (let i = 0; i < count; i++) {
        obsPoints.push({ r: radius, theta: (i/count)*Math.PI*2, z, type: 'poloidal' });
      }
    }
  }
  const total = obsPoints.length;

  useFrame(() => {
    if (!meshA.current || !meshAArrow.current || !meshB.current || !meshBArrow.current) return;
    
    let index = 0;
    for (let pt of obsPoints) {
      const x = pt.r * Math.cos(pt.theta);
      const y = pt.r * Math.sin(pt.theta);
      const z = pt.z;
      const d = Math.sqrt(x*x + y*y + z*z);
      
      let scaleA = 0; let scaleB = 0;
      let eulerA = new THREE.Euler(0,0,0); let eulerB = new THREE.Euler(0,0,0);
      let showThisA = showA; let showThisB = showB;

      if (isToroidal) {
        if (pt.type === 'tube') {
          showThisA = false; // We don't show A inside the tube for simplicity
          scaleB = 1.0;
          const dirX = -Math.sin(pt.theta) * direction;
          const dirY = Math.cos(pt.theta) * direction;
          const bDir = new THREE.Vector3(dirX, dirY, 0).normalize();
          eulerB.setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), bDir));
        } else if (pt.type === 'hole') {
          showThisB = false; // B is zero in the hole
          scaleA = 1.0;
          eulerA = new THREE.Euler(direction > 0 ? 0 : Math.PI, 0, 0); // A is axial
        }
      } else {
        // Poloidal (Spire/Solenoid)
        showThisA = showA; showThisB = showB;
        // A is azimuthal
        scaleA = Math.max(0.1, Math.min(1.2, 0.8 / Math.max(pt.r, 0.5)));
        const aDir = new THREE.Vector3(-Math.sin(pt.theta) * direction, Math.cos(pt.theta) * direction, 0).normalize();
        eulerA.setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), aDir));

        // B is poloidal
        if (shape === 'bobine' && pt.r < 1.2) {
          scaleB = 1.0;
          eulerB = new THREE.Euler(direction > 0 ? Math.PI/2 : -Math.PI/2, 0, 0);
        } else {
          const m = direction * 2;
          const d5 = Math.pow(Math.max(d, 0.5), 5);
          const bx = 3 * x * z * m / d5;
          const by = 3 * y * z * m / d5;
          const bz = (3 * z * z - d * d) * m / d5;
          const bMag = Math.sqrt(bx*bx + by*by + bz*bz);
          scaleB = Math.max(0.1, Math.min(1.2, bMag * 0.5));
          if (bMag > 0.001) {
            const bDir = new THREE.Vector3(bx, by, bz).normalize();
            eulerB.setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), bDir));
          }
        }
      }

      // Draw A
      if (showThisA && scaleA > 0.01) {
        dummy.position.copy(new THREE.Vector3(x, y, z).add(new THREE.Vector3(0,1,0).applyEuler(eulerA).multiplyScalar(scaleA * 0.4)));
        dummy.scale.set(0.02, scaleA * 0.8, 0.02);
        dummy.rotation.copy(eulerA);
        dummy.updateMatrix();
        meshA.current.setMatrixAt(index, dummy.matrix);
        
        dummy.position.copy(new THREE.Vector3(x, y, z).add(new THREE.Vector3(0,1,0).applyEuler(eulerA).multiplyScalar(scaleA * 0.8)));
        dummy.scale.set(0.05, 0.12, 0.05);
        dummy.rotation.copy(eulerA);
        dummy.updateMatrix();
        meshAArrow.current.setMatrixAt(index, dummy.matrix);
      } else {
        dummy.scale.setScalar(0); dummy.updateMatrix();
        meshA.current.setMatrixAt(index, dummy.matrix); meshAArrow.current.setMatrixAt(index, dummy.matrix);
      }

      // Draw B
      if (showThisB && scaleB > 0.01) {
        dummy.position.copy(new THREE.Vector3(x, y, z).add(new THREE.Vector3(0,1,0).applyEuler(eulerB).multiplyScalar(scaleB * 0.4)));
        dummy.scale.set(0.02, scaleB * 0.8, 0.02);
        dummy.rotation.copy(eulerB);
        dummy.updateMatrix();
        meshB.current.setMatrixAt(index, dummy.matrix);
        
        dummy.position.copy(new THREE.Vector3(x, y, z).add(new THREE.Vector3(0,1,0).applyEuler(eulerB).multiplyScalar(scaleB * 0.8)));
        dummy.scale.set(0.05, 0.12, 0.05);
        dummy.rotation.copy(eulerB);
        dummy.updateMatrix();
        meshBArrow.current.setMatrixAt(index, dummy.matrix);
      } else {
        dummy.scale.setScalar(0); dummy.updateMatrix();
        meshB.current.setMatrixAt(index, dummy.matrix); meshBArrow.current.setMatrixAt(index, dummy.matrix);
      }

      index++;
    }
    meshA.current.instanceMatrix.needsUpdate = true; meshAArrow.current.instanceMatrix.needsUpdate = true;
    meshB.current.instanceMatrix.needsUpdate = true; meshBArrow.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* RENDER THE PHYSICAL SHAPE */}
      {shape === 'bobine' && (
        <Cylinder args={[solRadius, solRadius, 6, 32, 1, true]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial color="#334155" transparent opacity={0.2} side={THREE.DoubleSide} wireframe />
        </Cylinder>
      )}
      {shape === 'spire' && (
        <Torus args={[solRadius, 0.05, 16, 64]}>
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
        </Torus>
      )}
      {shape === 'tore_circulaire' && (
        <Torus args={[1.5, 0.5, 32, 100]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
        </Torus>
      )}
      {shape === 'tore_carre' && (
        <Torus args={[1.5, 0.5, 4, 100]} rotation={[0, 0, Math.PI/4]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
        </Torus>
      )}
      {shape === 'cone' && (
        <Cone args={[1.5, 3, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0,0,-1.5]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
        </Cone>
      )}
      {shape === 'double_cone' && (
        <group>
          <Cone args={[1.5, 3, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0,0,-1.5]}>
            <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
          </Cone>
          <Cone args={[1.5, 3, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0,0,1.5]}>
            <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
          </Cone>
        </group>
      )}
      {shape === 'sphere' && (
        <Sphere args={[1.5, 32, 32]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
        </Sphere>
      )}
      {shape === 'demi_sphere' && (
        <Sphere args={[1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} rotation={[Math.PI/2, 0, 0]}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={0.4} wireframe />
        </Sphere>
      )}

      <CurrentParticles direction={direction} geometryType={shape} solRadius={solRadius} />
      
      <instancedMesh ref={meshA} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#00e5ff" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshAArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#00e5ff" /></instancedMesh>
      <instancedMesh ref={meshB} args={[null, null, total] as any}><cylinderGeometry args={[1, 1, 1, 6]} /><meshBasicMaterial color="#ff007f" transparent opacity={0.8} /></instancedMesh>
      <instancedMesh ref={meshBArrow} args={[null, null, total] as any}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#ff007f" /></instancedMesh>
    </group>
  );
};


// -------------------------------------------------------------
// CURRENT PARTICLES ENGINE
// -------------------------------------------------------------
const CurrentParticles = ({ direction, geometryType, solRadius = 1 }: { direction: number, geometryType: string, solRadius?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const numParticles = geometryType === 'plane' ? 400 : (geometryType === 'bobine' || geometryType.includes('tore') || geometryType.includes('sphere')) ? 800 : 300; 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [positions, setPositions] = useState(() => 
    Array.from({ length: numParticles }).map(() => ({
      val: Math.random(), 
      offset1: (Math.random() - 0.5), 
      offset2: (Math.random() - 0.5),
      offset3: Math.random() * Math.PI * 2
    }))
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    setPositions(prev => prev.map(p => {
      let newVal = p.val + delta * 0.3 * direction;
      if (newVal > 1) newVal -= 1;
      if (newVal < 0) newVal += 1;
      return { ...p, val: newVal };
    }));

    positions.forEach((p, i) => {
      if (geometryType === 'line' || geometryType === 'cylindre') {
        const r = geometryType === 'cylindre' ? solRadius * (0.8 + 0.2*p.offset1) : 0;
        dummy.position.set(r * Math.cos(p.offset3), r * Math.sin(p.offset3), (p.val - 0.5) * 8);
      } else if (geometryType === 'plane') {
        dummy.position.set((p.val - 0.5) * 8, 0, p.offset2 * 8);
      } else if (geometryType === 'bobine') {
        const theta = p.val * Math.PI * 2 * 10;
        const z = (p.val - 0.5) * 6;
        dummy.position.set(solRadius * Math.cos(theta), solRadius * Math.sin(theta), z);
      } else if (geometryType === 'spire') {
        const theta = p.val * Math.PI * 2;
        dummy.position.set(solRadius * Math.cos(theta), solRadius * Math.sin(theta), 0);
      } else if (geometryType === 'tore_circulaire' || geometryType === 'tore_carre') {
        const theta = p.val * Math.PI * 2 * 15; // spirale
        const R = 1.5;
        const r = 0.5;
        const phi = p.val * Math.PI * 2;
        dummy.position.set((R + r*Math.cos(theta))*Math.cos(phi), (R + r*Math.cos(theta))*Math.sin(phi), r*Math.sin(theta));
      } else if (geometryType === 'sphere' || geometryType === 'demi_sphere') {
        const theta = p.val * Math.PI * 2 * 10;
        const R = 1.5;
        const phi = (p.val - 0.5) * Math.PI * (geometryType === 'demi_sphere' ? 1 : 2); // pole to pole
        dummy.position.set(R * Math.cos(phi) * Math.cos(theta), R * Math.cos(phi) * Math.sin(theta), R * Math.sin(phi));
      } else if (geometryType === 'cone') {
        const theta = p.val * Math.PI * 2 * 10;
        const z = (p.val) * -3;
        const R = (p.val) * 1.5;
        dummy.position.set(R * Math.cos(theta), R * Math.sin(theta), z);
      } else if (geometryType === 'double_cone') {
        const theta = p.val * Math.PI * 2 * 20;
        const z = (p.val - 0.5) * 6;
        const R = Math.abs(z) * 0.5;
        dummy.position.set(R * Math.cos(theta), R * Math.sin(theta), z);
      }
      
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, numParticles] as any}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
    </instancedMesh>
  );
};


// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
const AnimatedGroup = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current && groupRef.current.scale.x < 1) {
      const newScale = Math.min(1, groupRef.current.scale.x + delta * 3);
      groupRef.current.scale.setScalar(newScale);
    }
  });
  return <group ref={groupRef} scale={0.01}>{children}</group>;
};

export default function VectorPotential3DCanvas() {
  const [shape, setShape] = useState('fil_infini');
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const [radius, setRadius] = useState(1.5);
  const [direction, setDirection] = useState(1);
  const [showLegend, setShowLegend] = useState(true);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 font-sans max-w-[900px] mx-auto">


      <div ref={canvasContainerRef} className="w-full h-[280px] sm:h-[350px] bg-[#050b14] rounded-2xl overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-slate-800">
        
        {/* HUD Legend */}
        <div className="absolute top-4 left-4 z-10">
          {showLegend ? (
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-lg flex flex-col gap-2 min-w-[120px] pointer-events-auto transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Légende</span>
                <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-1 rounded-md transition-colors">
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-[#00e5ff] rounded-full shadow-[0_0_8px_#00e5ff]" />
                <span className="text-[#00e5ff] font-bold text-xs"><LatexMath math="\vec{A}" /> (Potentiel)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-[#ff007f] rounded-full shadow-[0_0_8px_#ff007f]" />
                <span className="text-[#ff007f] font-bold text-xs"><LatexMath math="\vec{B}" /> (Champ)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-blue-500 rounded-full" />
                <span className="text-blue-400 font-bold text-xs"><LatexMath math="I" /> (Courant)</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowLegend(true)}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl shadow-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all pointer-events-auto flex items-center gap-2"
              title="Afficher la légende"
            >
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Légende</span>
            </button>
          )}
        </div>

        {/* HUD Shape Selector (Internal) */}
        <div className="absolute top-4 left-[140px] right-4 z-10 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent pointer-events-auto">
          <div className="flex items-center gap-1.5 min-w-max pr-2">
            {SHAPES.map(s => (
              <button 
                key={s.id} 
                onClick={() => setShape(s.id)}
                className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all border backdrop-blur-md ${shape === s.id ? s.activeColor : s.inactiveColor}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <Canvas frameloop={inView ? "always" : "demand"} camera={{ position: [6, 5, 6], fov: 45 }} className="w-full h-full cursor-move">
          <color attach="background" args={["#050b14"]} />
          <ambientLight intensity={0.6} />
          <spotLight position={[5, 10, 5]} intensity={2.5} color="#e2e8f0" />
          <Environment preset="night" />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} />
          
          <gridHelper args={[24, 24, 0x1e293b, 0x090f1e]} position={[0, -2, 0]} />

          <AnimatedGroup key={shape}>
            <group position={[0, shape === 'plan' ? 0 : 0, 0]}>
              {(shape === 'fil_infini' || shape === 'cylindre') && <WirePhysics direction={direction} showA={showA} showB={showB} radius={radius} isCylinder={shape === 'cylindre'} />}
              {shape === 'plan' && <PlanePhysics direction={direction} showA={showA} showB={showB} radius={radius} />}
              {(!['fil_infini', 'cylindre', 'plan'].includes(shape)) && <AxisymmetricPhysics direction={direction} showA={showA} showB={showB} radius={radius} shape={shape} />}
            </group>
          </AnimatedGroup>
        </Canvas>
      </div>

      {/* Controls */}
      <div className="w-full bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Slider */}
        <div className="w-full sm:flex-1 flex flex-col gap-1.5 min-w-[200px]">
          <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase px-1">
            <span className="whitespace-nowrap">Rayon (r)</span>
            <span className="text-cyan-400 whitespace-nowrap">{radius.toFixed(1)} m</span>
          </div>
          <input 
            type="range" min="0.5" max="3" step="0.1" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-cyan-500 h-1.5"
          />
        </div>
        
        {/* Buttons */}
        <div className="w-full sm:w-auto flex flex-row flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
          <button 
            onClick={() => setDirection(d => -d)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-all min-w-[110px]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Inverser
          </button>
          <button 
            onClick={() => setShowA(!showA)} 
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all min-w-[110px] ${showA ? 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'}`}
          >
            {showA ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} <LatexMath math="\vec{A}" />
          </button>
          <button 
            onClick={() => setShowB(!showB)} 
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all min-w-[110px] ${showB ? 'bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/30 shadow-[0_0_10px_rgba(255,0,127,0.1)]' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'}`}
          >
            {showB ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} <LatexMath math="\vec{B}" />
          </button>
        </div>
      </div>
    </div>
  );
}
