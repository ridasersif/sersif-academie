"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Compass, Eye, Layers } from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

type CoordSystem = "cartesien" | "cylindrique" | "spherique";

export default function ThreeDCoordinateCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [coordType, setCoordType] = useState<CoordSystem>("cylindrique");
  const [showVolumeShape, setShowVolumeShape] = useState(true);

  // Control Sliders State: Cylindrical/Spherical (r, phi, theta, z)
  const [r, setR] = useState(3.0);
  const [phi, setPhi] = useState(60);
  const [theta, setTheta] = useState(45);
  const [zVal, setZVal] = useState(2.0);

  // Control Sliders State: Cartesian (x, y, z)
  const [xVal, setXVal] = useState(2.5);
  const [yVal, setYVal] = useState(2.0);
  const [cartZVal, setCartZVal] = useState(2.0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const mMeshRef = useRef<THREE.Mesh | null>(null);
  const omLineRef = useRef<THREE.Line | null>(null);
  const projLineRef = useRef<THREE.Line | null>(null);
  const erhoArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ephiArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ezArrowRef = useRef<THREE.ArrowHelper | null>(null);
  const ethetaArrowRef = useRef<THREE.ArrowHelper | null>(null);

  // 3D Volume Groups
  const cylinderGroupRef = useRef<THREE.Group | null>(null);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const boxGroupRef = useRef<THREE.Group | null>(null);

  // Visual 3D Angle Filled Sector Meshes
  const phiSectorMeshRef = useRef<THREE.Mesh | null>(null);
  const thetaSectorMeshRef = useRef<THREE.Mesh | null>(null);

  // Spherical Specific References
  const sphMeshSolidRef = useRef<THREE.Mesh | null>(null);
  const sphLatitudeLineRef = useRef<THREE.Line | null>(null);
  const sphGroundCircleLineRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    container.innerHTML = "";

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    let webglSupported = false;
    try {
      const testCanvas = document.createElement("canvas");
      webglSupported = !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch (e) {
      webglSupported = false;
    }

    if (!webglSupported) {
      const canvas2D = document.createElement("canvas");
      canvas2D.width = width;
      canvas2D.height = height;
      canvas2D.className = "w-full h-full";
      container.appendChild(canvas2D);
      const ctx = canvas2D.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);
        ctx.font = "bold 12px Inter, sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText("Simulateur 3D Interactif (Three.js WebGL)", width / 2, height / 2 - 10);
      }
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6.5, 5.5, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 3. Grid Helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 4. Main Axes (X: Coral Red, Y: Emerald Green, Z: Cyan Blue)
    const axesLen = 5.0;
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axesLen, 0xf87171, 0.22, 0.07);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axesLen, 0x34d399, 0.22, 0.07);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axesLen, 0x38bdf8, 0.22, 0.07);
    scene.add(xAxis, yAxis, zAxis);

    // --- A. CYLINDER GROUP ---
    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);
    cylinderGroupRef.current = cylinderGroup;

    const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 32);
    const cylMatSolid = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      roughness: 0.2,
    });
    const cylMeshSolid = new THREE.Mesh(cylGeo, cylMatSolid);
    cylinderGroup.add(cylMeshSolid);

    const cylEdgesGeo = new THREE.EdgesGeometry(cylGeo);
    const cylEdgesMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 1.5 });
    const cylWireframe = new THREE.LineSegments(cylEdgesGeo, cylEdgesMat);
    cylinderGroup.add(cylWireframe);

    // --- B. BEAUTIFUL GLASS SPHERE GROUP ---
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    sphereGroupRef.current = sphereGroup;

    // 1. Electric Glass Sphere Mesh (Transparent Ice Cyan, Opacity 0.10)
    const sphGeo = new THREE.SphereGeometry(1, 36, 28);
    const sphMatSolid = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.10,
      side: THREE.DoubleSide,
      roughness: 0.1,
      metalness: 0.2,
    });
    const sphMeshSolid = new THREE.Mesh(sphGeo, sphMatSolid);
    sphereGroup.add(sphMeshSolid);
    sphMeshSolidRef.current = sphMeshSolid;

    // 2. Latitude Circle Line at height y passing right through M
    const sphLatMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const sphLatLine = new THREE.Line(new THREE.BufferGeometry(), sphLatMat);
    sphereGroup.add(sphLatLine);
    sphLatitudeLineRef.current = sphLatLine;

    // 3. Ground Circle Line (Equator r_xy)
    const sphGroundMat = new THREE.LineDashedMaterial({ color: 0x3b82f6, dashSize: 0.15, gapSize: 0.08, opacity: 0.6, transparent: true });
    const sphGroundLine = new THREE.Line(new THREE.BufferGeometry(), sphGroundMat);
    sphereGroup.add(sphGroundLine);
    sphGroundCircleLineRef.current = sphGroundLine;

    // --- C. BOX GROUP ---
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);
    boxGroupRef.current = boxGroup;

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMatSolid = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const boxMeshSolid = new THREE.Mesh(boxGeo, boxMatSolid);
    boxGroup.add(boxMeshSolid);

    const boxEdgesGeo = new THREE.EdgesGeometry(boxGeo);
    const boxEdgesMat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 1.5 });
    const boxWireframe = new THREE.LineSegments(boxEdgesGeo, boxEdgesMat);
    boxGroup.add(boxWireframe);

    // 6. 100% GUARANTEED VIBRANT FILLED ANGLE SECTOR MESHES
    // A. Phi Sector (Emerald Green)
    const phiSectorMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald Green
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    const phiSectorMesh = new THREE.Mesh(new THREE.RingGeometry(0, 1.5, 32, 1, 0, Math.PI / 3), phiSectorMat);
    phiSectorMesh.renderOrder = 999;
    scene.add(phiSectorMesh);
    phiSectorMeshRef.current = phiSectorMesh;

    // B. Theta Sector (Amber Gold)
    const thetaSectorMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber Gold
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    const thetaSectorMesh = new THREE.Mesh(new THREE.RingGeometry(0, 1.5, 32, 1, 0, Math.PI / 4), thetaSectorMat);
    thetaSectorMesh.renderOrder = 999;
    scene.add(thetaSectorMesh);
    thetaSectorMeshRef.current = thetaSectorMesh;

    // 7. Point M Mesh (Glowing Sphere)
    const mGeo = new THREE.SphereGeometry(0.13, 32, 32);
    const mMats = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });
    const mMesh = new THREE.Mesh(mGeo, mMats);
    scene.add(mMesh);
    mMeshRef.current = mMesh;

    // 8. Vector OM Line
    const omMat = new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2.5 });
    const omGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)]);
    const omLine = new THREE.Line(omGeo, omMat);
    scene.add(omLine);
    omLineRef.current = omLine;

    // 9. Projection Line (Dashed)
    const projMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.2, gapSize: 0.1 });
    const projGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), new THREE.Vector3(1, 1, 1)]);
    const projLine = new THREE.Line(projGeo, projMat);
    projLine.computeLineDistances();
    scene.add(projLine);
    projLineRef.current = projLine;

    // 10. Basis Vector Arrow Helpers at M
    const erhoArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1.2, 0xf43f5e, 0.2, 0.07);
    const ephiArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1.2, 0x10b981, 0.2, 0.07);
    const ezArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1.2, 0x38bdf8, 0.2, 0.07);
    const ethetaArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1.2, 0xf59e0b, 0.2, 0.07);

    scene.add(erhoArrow, ephiArrow, ezArrow, ethetaArrow);
    erhoArrowRef.current = erhoArrow;
    ephiArrowRef.current = ephiArrow;
    ezArrowRef.current = ezArrow;
    ethetaArrowRef.current = ethetaArrow;

    // 11. Mouse / Touch Drag Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let camSpherical = new THREE.Spherical().setFromVector3(camera.position);

    const onStart = (clientX: number, clientY: number) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      camSpherical.theta -= deltaX * 0.008;
      camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi - deltaY * 0.008));

      camera.position.setFromSpherical(camSpherical);
      camera.lookAt(0, 0, 0);

      prevX = clientX;
      prevY = clientY;
    };

    const onEnd = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onEnd();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onEnd();

    domElem.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    domElem.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let isInView = false;

    const animate = () => {
      if (!isInView) return;
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) animate();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      intersectionObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      domElem.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      domElem.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      if (container) container.innerHTML = "";
      renderer.dispose();
    };
  }, []);


  // Update 3D Vector & Dynamically Scale/Orient Filled Ring Sector Geometries
  useEffect(() => {
    if (!sceneRef.current || !mMeshRef.current || !omLineRef.current) return;

    const phiRad = (phi * Math.PI) / 180;
    const thetaRad = (theta * Math.PI) / 180;

    let mx = 0, my = 0, mz = 0;

    if (coordType === "cartesien") {
      mx = xVal;
      my = yVal;
      mz = cartZVal;
    } else if (coordType === "cylindrique") {
      mx = r * Math.cos(phiRad);
      my = zVal;
      mz = r * Math.sin(phiRad);
    } else if (coordType === "spherique") {
      mx = r * Math.sin(thetaRad) * Math.cos(phiRad);
      my = r * Math.cos(thetaRad);
      mz = r * Math.sin(thetaRad) * Math.sin(phiRad);
    }

    const mPos = new THREE.Vector3(mx, my, mz);
    mMeshRef.current.position.copy(mPos);

    // Update OM line
    omLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), mPos]);

    // Update Projection line (O -> H -> M)
    if (projLineRef.current) {
      const hPos = new THREE.Vector3(mx, 0, mz);
      projLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), hPos, mPos]);
      projLineRef.current.computeLineDistances();
    }

    // Dynamic 3D Geometries
    const rhoVal = Math.sqrt(mx * mx + mz * mz) || 0.1;

    // 1. CYLINDER
    if (cylinderGroupRef.current) {
      cylinderGroupRef.current.visible = showVolumeShape && coordType === "cylindrique";
      if (coordType === "cylindrique") {
        const absHeight = Math.max(0.1, Math.abs(my));
        cylinderGroupRef.current.scale.set(rhoVal, absHeight, rhoVal);
        cylinderGroupRef.current.position.set(0, my / 2, 0);
      }
    }

    // 2. ELEGANT GLASS SPHERE
    if (sphereGroupRef.current) {
      const showSph = showVolumeShape && coordType === "spherique";
      sphereGroupRef.current.visible = showSph;

      if (showSph) {
        const rSph = mPos.length() || 0.1;
        const latRadius = rSph * Math.sin(thetaRad);
        const latY = rSph * Math.cos(thetaRad);

        if (sphMeshSolidRef.current) {
          sphMeshSolidRef.current.scale.set(rSph, rSph, rSph);
        }

        // Latitude Circle at height y passing right through point M
        if (sphLatitudeLineRef.current) {
          const latPts: THREE.Vector3[] = [];
          for (let i = 0; i <= 64; i++) {
            const a = (i * 2 * Math.PI) / 64;
            latPts.push(new THREE.Vector3(latRadius * Math.cos(a), latY, latRadius * Math.sin(a)));
          }
          sphLatitudeLineRef.current.geometry.setFromPoints(latPts);
        }

        // Ground Circle Line (Sphere equator in XZ plane)
        if (sphGroundCircleLineRef.current) {
          const gndPts: THREE.Vector3[] = [];
          for (let i = 0; i <= 64; i++) {
            const a = (i * 2 * Math.PI) / 64;
            gndPts.push(new THREE.Vector3(rSph * Math.cos(a), 0, rSph * Math.sin(a)));
          }
          sphGroundCircleLineRef.current.geometry.setFromPoints(gndPts);
          sphGroundCircleLineRef.current.computeLineDistances();
        }
      }
    }

    // 3. BOX
    if (boxGroupRef.current) {
      boxGroupRef.current.visible = showVolumeShape && coordType === "cartesien";
      if (coordType === "cartesien") {
        const bx = Math.abs(mx) || 0.1;
        const by = Math.abs(my) || 0.1;
        const bz = Math.abs(mz) || 0.1;
        boxGroupRef.current.scale.set(bx, by, bz);
        boxGroupRef.current.position.set(mx / 2, my / 2, mz / 2);
      }
    }

    // --- 100% GUARANTEED FILLED ANGLE SECTORS USING RingGeometry ---

    // A. PHI SECTOR (Emerald Green filled pie slice on XZ ground plane)
    const phiRadius = Math.max(1.2, Math.min(2.5, rhoVal));

    if (phiSectorMeshRef.current) {
      const showPhi = coordType !== "cartesien" && phi > 0;
      phiSectorMeshRef.current.visible = showPhi;

      if (showPhi) {
        phiSectorMeshRef.current.geometry.dispose();
        // RingGeometry(0, radius, 32, 1, 0, phiRad)
        const ringGeo = new THREE.RingGeometry(0, phiRadius, 32, 1, 0, phiRad);
        phiSectorMeshRef.current.geometry = ringGeo;
        
        // Orient onto XZ ground plane (rotation.x = Math.PI / 2)
        phiSectorMeshRef.current.rotation.set(Math.PI / 2, 0, 0);
        phiSectorMeshRef.current.position.set(0, 0.01, 0); // slightly above grid
      }
    }

    // B. THETA SECTOR (Amber Gold filled pie slice in vertical plane O-Z-M)
    const thetaRadius = Math.max(1.2, Math.min(2.5, mPos.length()));

    if (thetaSectorMeshRef.current) {
      const showTheta = coordType === "spherique" && theta > 0;
      thetaSectorMeshRef.current.visible = showTheta;

      if (showTheta) {
        thetaSectorMeshRef.current.geometry.dispose();
        
        // RingGeometry starting from top (+Z axis, theta=0) down to thetaRad
        // In local 2D plane: theta goes from 0 to thetaRad
        const ringGeo = new THREE.RingGeometry(0, thetaRadius, 32, 1, Math.PI / 2 - thetaRad, thetaRad);
        thetaSectorMeshRef.current.geometry = ringGeo;
        
        // Rotate around Y axis by phiRad to align with vector OM projection plane!
        thetaSectorMeshRef.current.rotation.set(0, -phiRad, 0);
        thetaSectorMeshRef.current.position.set(0, 0, 0);
      }
    }

    // Update Basis Vector Directions
    if (coordType === "cylindrique") {
      const dirErho = new THREE.Vector3(mx / rhoVal, 0, mz / rhoVal);
      const dirEphi = new THREE.Vector3(-mz / rhoVal, 0, mx / rhoVal);
      const dirEz = new THREE.Vector3(0, 1, 0);

      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(dirErho);
        erhoArrowRef.current.setColor(0xf43f5e);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(dirEphi);
        ephiArrowRef.current.setColor(0x10b981);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(dirEz);
        ezArrowRef.current.setColor(0x38bdf8);
      }

      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
      if (ezArrowRef.current) ezArrowRef.current.visible = true;
    } else if (coordType === "spherique") {
      const dirEr = mPos.clone().normalize();
      const dirEphi = new THREE.Vector3(-Math.sin(phiRad), 0, Math.cos(phiRad));
      const dirEtheta = new THREE.Vector3(
        Math.cos(thetaRad) * Math.cos(phiRad),
        -Math.sin(thetaRad),
        Math.cos(thetaRad) * Math.sin(phiRad)
      ).normalize();

      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(dirEr);
        erhoArrowRef.current.setColor(0xf43f5e);
      }

      if (ethetaArrowRef.current) {
        ethetaArrowRef.current.position.copy(mPos);
        ethetaArrowRef.current.setDirection(dirEtheta);
        ethetaArrowRef.current.setColor(0xf59e0b);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(dirEphi);
        ephiArrowRef.current.setColor(0x10b981);
      }

      if (ezArrowRef.current) ezArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
    } else {
      if (erhoArrowRef.current) {
        erhoArrowRef.current.position.copy(mPos);
        erhoArrowRef.current.setDirection(new THREE.Vector3(1, 0, 0));
        erhoArrowRef.current.setColor(0xf87171);
      }

      if (ephiArrowRef.current) {
        ephiArrowRef.current.position.copy(mPos);
        ephiArrowRef.current.setDirection(new THREE.Vector3(0, 1, 0));
        ephiArrowRef.current.setColor(0x34d399);
      }

      if (ezArrowRef.current) {
        ezArrowRef.current.position.copy(mPos);
        ezArrowRef.current.setDirection(new THREE.Vector3(0, 0, 1));
        ezArrowRef.current.setColor(0x38bdf8);
      }

      if (ethetaArrowRef.current) ethetaArrowRef.current.visible = false;
      if (erhoArrowRef.current) erhoArrowRef.current.visible = true;
      if (ephiArrowRef.current) ephiArrowRef.current.visible = true;
      if (ezArrowRef.current) ezArrowRef.current.visible = true;
    }
  }, [coordType, r, phi, theta, zVal, xVal, yVal, cartZVal, showVolumeShape]);

  return (
    <div className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl my-4 w-full max-w-full overflow-hidden">
      
      {/* Selector Tabs Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 pb-3 border-b border-border/40 w-full">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-extrabold text-foreground leading-tight">
            Simulateur 3D WebGL • Formes 3D & Secteurs d'Angles (φ, θ)
          </h3>
        </div>

        {/* Buttons Grid */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setCoordType("cartesien")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "cartesien" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cube (x,y,z)
            </button>
            <button
              onClick={() => setCoordType("cylindrique")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "cylindrique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cylindre (ρ,φ,z)
            </button>
            <button
              onClick={() => setCoordType("spherique")}
              className={`px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center truncate ${
                coordType === "spherique" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sphère (r,θ,φ)
            </button>
          </div>

          <button
            onClick={() => setShowVolumeShape(!showVolumeShape)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              showVolumeShape ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40" : "bg-muted text-muted-foreground border-border/50"
            }`}
            title="Afficher/Masquer le volume 3D"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volume 3D</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div 
        className="relative w-full h-[260px] sm:h-[330px] rounded-xl sm:rounded-2xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing border border-slate-800"
        style={{ touchAction: 'none' }}
      >
        <div ref={mountRef} className="w-full h-full" />

        {/* Visual Angle Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-wrap items-center gap-2">
          {coordType !== "cartesien" ? (
            <>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>Secteur Azimutal φ = {phi}°</span>
              </div>
              {coordType === "spherique" && (
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  <span>Secteur Zénithal θ = {theta}°</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-purple-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              <span>Cube Cartésien (x={xVal.toFixed(1)}, y={yVal.toFixed(1)}, z={cartZVal.toFixed(1)})</span>
            </div>
          )}
        </div>

        {/* View Indicator */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 flex items-center gap-1">
          <Eye className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>Faites glisser en 3D</span>
        </div>

        {/* LaTeX Formula Legend */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 bg-slate-950/90 backdrop-blur-md p-2 sm:px-4 sm:py-2 rounded-lg border border-white/10 text-[10px] sm:text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 max-h-[85px] overflow-y-auto custom-scrollbar">
          {coordType === "cylindrique" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{e}_\rho = \cos\phi\vec{i} + \sin\phi\vec{j}" />
                <LatexMath math="\vec{e}_\phi = -\sin\phi\vec{i} + \cos\phi\vec{j}" />
                <LatexMath math="\vec{e}_z = \vec{k}" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = \rho\,d\rho\,d\phi\,dz" /></div>
            </>
          )}
          {coordType === "spherique" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{e}_r = \sin\theta\cos\phi\vec{i} + \sin\theta\sin\phi\vec{j} + \cos\theta\vec{k}" />
                <LatexMath math="\vec{e}_\theta = \cos\theta\cos\phi\vec{i} + \cos\theta\sin\phi\vec{j} - \sin\theta\vec{k}" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = r^2\sin\theta\,dr\,d\theta\,d\phi" /></div>
            </>
          )}
          {coordType === "cartesien" && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <LatexMath math="\vec{i} = (1,0,0)" />
                <LatexMath math="\vec{j} = (0,1,0)" />
                <LatexMath math="\vec{k} = (0,0,1)" />
              </div>
              <div className="text-amber-400 font-bold shrink-0"><LatexMath math="dV = dx\,dy\,dz" /></div>
            </>
          )}
        </div>
      </div>

      {/* Sliders Controls Panel */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-muted/30 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/40 w-full overflow-hidden">
        
        {coordType === "cartesien" ? (
          <>
            <div className="w-full">
              <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                <span>Dimension X (x):</span>
                <span className="text-red-400 font-extrabold">{xVal.toFixed(1)} u</span>
              </label>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.2"
                value={xVal}
                onChange={(e) => setXVal(Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="w-full">
              <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                <span>Dimension Y / Hauteur (y):</span>
                <span className="text-emerald-400 font-extrabold">{yVal.toFixed(1)} u</span>
              </label>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.2"
                value={yVal}
                onChange={(e) => setYVal(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="w-full">
              <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                <span>Dimension Z (z):</span>
                <span className="text-cyan-400 font-extrabold">{cartZVal.toFixed(1)} u</span>
              </label>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.2"
                value={cartZVal}
                onChange={(e) => setCartZVal(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full">
              <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                <span>Rayon / Distance (r / ρ):</span>
                <span className="text-cyan-400 font-extrabold">{r.toFixed(1)} u</span>
              </label>
              <input
                type="range"
                min="1.0"
                max="4.5"
                step="0.1"
                value={r}
                onChange={(e) => setR(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="w-full">
              <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                <span>Angle Azimutal (φ):</span>
                <span className="text-emerald-400 font-extrabold">{phi}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={phi}
                onChange={(e) => setPhi(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {coordType === "spherique" ? (
              <div className="w-full">
                <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                  <span>Angle Zénithal (θ):</span>
                  <span className="text-amber-400 font-extrabold">{theta}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={theta}
                  onChange={(e) => setTheta(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full">
                <label className="text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-between mb-1.5">
                  <span>Hauteur (z) [Négatif & Positif]:</span>
                  <span className={`font-extrabold ${zVal < 0 ? "text-rose-400" : "text-purple-400"}`}>{zVal.toFixed(1)} u</span>
                </label>
                <input
                  type="range"
                  min="-3.0"
                  max="4.0"
                  step="0.2"
                  value={zVal}
                  onChange={(e) => setZVal(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
