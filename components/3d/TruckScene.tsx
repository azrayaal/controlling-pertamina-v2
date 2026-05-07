"use client";
/**
 * TruckScene.tsx
 * Procedural Three.js 3D fuel truck (tanki BBM) with 360° orbit controls.
 * No external model files required — fully self-contained.
 */
import { useEffect, useRef, useCallback } from "react";
import type * as THREE_TYPE from "three";

import type { SceneTheme } from "./Model3DViewer";

interface TruckSceneProps {
  width?: number;
  height?: number;
  className?: string;
  theme?: SceneTheme;
}

// ── Build the fuel truck geometry ─────────────────────────────────────────────
function buildTruck(THREE: typeof THREE_TYPE): THREE_TYPE.Group {
  const group = new THREE.Group();

  // Materials
  const redMat    = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.5, metalness: 0.3 });
  const darkRedM  = new THREE.MeshStandardMaterial({ color: 0x880000, roughness: 0.6, metalness: 0.2 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.3, metalness: 0.75 });
  const steelMat  = new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.4, metalness: 0.8 });
  const blackMat  = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
  const glassMat  = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.05, metalness: 0.05, opacity: 0.5, transparent: true });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5, metalness: 0.2 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.1, metalness: 0.95 });

  // ── Chassis / Frame ──────────────────────────────────────────────────────────
  const chassisGeo = new THREE.BoxGeometry(5.8, 0.18, 0.95);
  const chassis    = new THREE.Mesh(chassisGeo, steelMat);
  chassis.position.set(0, 0.46, 0);
  chassis.castShadow = true;
  group.add(chassis);

  // ── Tank Trailer ─────────────────────────────────────────────────────────────
  const tankGeo  = new THREE.CylinderGeometry(0.65, 0.65, 4.2, 24);
  const tank     = new THREE.Mesh(tankGeo, silverMat);
  tank.rotation.set(0, 0, Math.PI / 2);
  tank.position.set(1.0, 1.12, 0);
  tank.castShadow = true;
  group.add(tank);

  // Tank end caps (domed)
  const capGeo = new THREE.SphereGeometry(0.65, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  [-1.1, 3.1].forEach((x) => {
    const cap = new THREE.Mesh(capGeo, silverMat);
    cap.rotation.set(0, 0, x < 0 ? Math.PI / 2 : -Math.PI / 2);
    cap.position.set(x, 1.12, 0);
    group.add(cap);
  });

  // Tank horizontal stripes (Pertamina brand)
  const stripeGeo = new THREE.CylinderGeometry(0.655, 0.655, 0.12, 24);
  const stripePositions = [-0.5, 0.5, 1.5, 2.5];
  stripePositions.forEach((x, i) => {
    const stripeMat = i % 2 === 0
      ? new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.5, metalness: 0.2 })
      : new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5, metalness: 0.2 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.set(0, 0, Math.PI / 2);
    stripe.position.set(x, 1.12, 0);
    group.add(stripe);
  });

  // PERTAMINA text panel
  const panelGeo = new THREE.BoxGeometry(2.6, 0.22, 0.02);
  const panel    = new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }));
  panel.position.set(1.0, 1.12, 0.658);
  group.add(panel);

  // Tank safety valve
  const valveGeo  = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8);
  const valve     = new THREE.Mesh(valveGeo, chromeMat);
  valve.position.set(0.8, 1.78, 0);
  group.add(valve);
  const valveCapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
  const valveCap    = new THREE.Mesh(valveCapGeo, yellowMat);
  valveCap.position.set(0.8, 1.9, 0);
  group.add(valveCap);

  // ── Cab ──────────────────────────────────────────────────────────────────────
  // Main cab body
  const cabGeo  = new THREE.BoxGeometry(1.6, 1.1, 1.55);
  const cab     = new THREE.Mesh(cabGeo, redMat);
  cab.position.set(-2.2, 1.02, 0);
  cab.castShadow = true;
  group.add(cab);

  // Cab roof (slightly rounded effect)
  const roofGeo = new THREE.BoxGeometry(1.55, 0.12, 1.5);
  const roof    = new THREE.Mesh(roofGeo, darkRedM);
  roof.position.set(-2.2, 1.6, 0);
  group.add(roof);

  // Roof spoiler / air deflector
  const spoilerGeo = new THREE.BoxGeometry(0.12, 0.4, 1.4);
  const spoiler    = new THREE.Mesh(spoilerGeo, darkRedM);
  spoiler.position.set(-1.55, 1.85, 0);
  group.add(spoiler);

  // Hood
  const hoodGeo = new THREE.BoxGeometry(0.75, 0.6, 1.5);
  const hood    = new THREE.Mesh(hoodGeo, redMat);
  hood.position.set(-2.85, 0.77, 0);
  group.add(hood);

  // Bumper
  const bumperGeo = new THREE.BoxGeometry(0.1, 0.3, 1.5);
  const bumper    = new THREE.Mesh(bumperGeo, chromeMat);
  bumper.position.set(-3.23, 0.52, 0);
  group.add(bumper);

  // Grille
  const grilleGeo = new THREE.BoxGeometry(0.05, 0.4, 1.0);
  const grille    = new THREE.Mesh(grilleGeo, blackMat);
  grille.position.set(-3.23, 0.72, 0);
  group.add(grille);

  // Grille bars
  for (let i = 0; i < 5; i++) {
    const barGeo = new THREE.BoxGeometry(0.06, 0.04, 0.9);
    const bar    = new THREE.Mesh(barGeo, chromeMat);
    bar.position.set(-3.22, 0.56 + i * 0.08, 0);
    group.add(bar);
  }

  // Headlights
  [-0.52, 0.52].forEach((z) => {
    const headlightGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 12);
    const headlight    = new THREE.Mesh(headlightGeo, new THREE.MeshStandardMaterial({ color: 0xffffee, roughness: 0.1, metalness: 0.1, emissive: 0xffffff, emissiveIntensity: 0.3 }));
    headlight.rotation.set(0, 0, Math.PI / 2);
    headlight.position.set(-3.24, 0.78, z);
    group.add(headlight);
  });

  // Windshield
  const windshieldGeo = new THREE.BoxGeometry(0.04, 0.55, 1.3);
  const windshield    = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(-1.44, 1.1, 0);
  group.add(windshield);

  // Side windows
  const sideWinGeo = new THREE.BoxGeometry(0.9, 0.38, 0.04);
  [-0.78, 0.78].forEach((z) => {
    const win = new THREE.Mesh(sideWinGeo, glassMat);
    win.position.set(-2.2, 1.2, z);
    group.add(win);
  });

  // Door handle
  const handleGeo = new THREE.BoxGeometry(0.12, 0.04, 0.02);
  const handle    = new THREE.Mesh(handleGeo, chromeMat);
  handle.position.set(-2.4, 0.82, 0.79);
  group.add(handle);

  // Exhaust stack
  const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 8);
  const exhaust    = new THREE.Mesh(exhaustGeo, blackMat);
  exhaust.position.set(-1.85, 1.7, -0.6);
  group.add(exhaust);

  // ── Wheels ────────────────────────────────────────────────────────────────────
  const wheelPositions: [number, number][] = [
    [-2.6, 0.28], [-2.0, 0.28], // front axle
    [0.4,  0.28], [1.0,  0.28], // rear drive axle 1
    [1.8,  0.28], [2.4,  0.28], // rear drive axle 2
  ];
  wheelPositions.forEach(([x, y]) => {
    [0.56, -0.56].forEach((z) => {
      const tireGeo  = new THREE.TorusGeometry(0.27, 0.1, 12, 24);
      const tire     = new THREE.Mesh(tireGeo, blackMat);
      tire.rotation.set(0, Math.PI / 2, 0);
      tire.position.set(x, y, z);
      tire.castShadow = true;
      group.add(tire);

      // Rim
      const rimGeo  = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12);
      const rim     = new THREE.Mesh(rimGeo, steelMat);
      rim.rotation.set(Math.PI / 2, 0, 0);
      rim.position.set(x, y, z);
      group.add(rim);

      // Lug nuts
      for (let i = 0; i < 5; i++) {
        const lugGeo  = new THREE.CylinderGeometry(0.018, 0.018, 0.04, 5);
        const lug     = new THREE.Mesh(lugGeo, chromeMat);
        lug.rotation.set(Math.PI / 2, 0, 0);
        lug.position.set(
          x,
          y + Math.sin((i * Math.PI * 2) / 5) * 0.11,
          z + (z > 0 ? 0.05 : -0.05) + Math.cos((i * Math.PI * 2) / 5) * 0.11
        );
        group.add(lug);
      }
    });
  });

  // Axles
  [[-2.3, 0.28], [0.7, 0.28], [2.1, 0.28]].forEach(([x, y]) => {
    const axleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.22, 8);
    const axle    = new THREE.Mesh(axleGeo, steelMat);
    axle.rotation.set(Math.PI / 2, 0, 0);
    axle.position.set(x, y, 0);
    group.add(axle);
  });

  // ── Fuel hose reel ────────────────────────────────────────────────────────────
  const reelGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 12);
  const reel    = new THREE.Mesh(reelGeo, redMat);
  reel.rotation.set(Math.PI / 2, 0, 0);
  reel.position.set(2.8, 0.72, 0.58);
  group.add(reel);

  // ── Steps on cab ─────────────────────────────────────────────────────────────
  const stepGeo = new THREE.BoxGeometry(0.25, 0.06, 0.45);
  [0.46, 0.64].forEach((y) => {
    const step = new THREE.Mesh(stepGeo, steelMat);
    step.position.set(-3.05, y, 0.6);
    group.add(step);
  });

  return group;
}

// ── Build Road / Ground ───────────────────────────────────────────────────────
function buildGround(THREE: typeof THREE_TYPE, groundColor = "#1a1a1a", roadColor = "#2d3436"): THREE_TYPE.Group {
  const group  = new THREE.Group();

  // Road
  const roadGeo = new THREE.PlaneGeometry(30, 8);
  const roadMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(roadColor), roughness: 0.9, metalness: 0.05 });
  const road    = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.set(-Math.PI / 2, 0, 0);
  road.position.set(0, -0.02, 0);
  road.receiveShadow = true;
  group.add(road);

  // Road markings (center dashes)
  for (let i = -12; i < 14; i += 2.4) {
    const markGeo = new THREE.PlaneGeometry(1.2, 0.1);
    const markMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.9 });
    const mark    = new THREE.Mesh(markGeo, markMat);
    mark.rotation.set(-Math.PI / 2, 0, 0);
    mark.position.set(i, 0, 0);
    group.add(mark);
  }

  // Ground beyond road
  const grassGeo = new THREE.PlaneGeometry(80, 80);
  const grassMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(groundColor), roughness: 1.0, metalness: 0 });
  const grass    = new THREE.Mesh(grassGeo, grassMat);
  grass.rotation.set(-Math.PI / 2, 0, 0);
  grass.position.set(0, -0.025, 0);
  group.add(grass);

  return group;
}

// ── TruckScene Component ──────────────────────────────────────────────────────
const DEFAULT_THEME: SceneTheme = {
  bgTop: "#050d1a", bgBottom: "#0d1b2a", fogColor: "#0d1b2a",
  ambientColor: "#668899", sunIntensity: 2.5, groundColor: "#1a1a1a", roadColor: "#2d3436",
};

export default function TruckScene({ width = 600, height = 340, className = "", theme }: TruckSceneProps) {
  const t = theme ?? DEFAULT_THEME;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    renderer: THREE_TYPE.WebGLRenderer | null;
    animId: number;
    isDragging: boolean;
    lastX: number; lastY: number;
    rotX: number; rotY: number;
    zoom: number;
    autoRotate: boolean;
    idleTimer: ReturnType<typeof setTimeout> | null;
    wheelGroup: THREE_TYPE.Group | null;
    themeRef?: SceneTheme;
  }>({
    renderer: null, animId: 0,
    isDragging: false, lastX: 0, lastY: 0,
    rotX: 0.4, rotY: 0.4, zoom: 9,
    autoRotate: true, idleTimer: null,
    wheelGroup: null,
    themeRef: theme,
  });
  stateRef.current.themeRef = theme ?? DEFAULT_THEME;

  const scheduleAutoRotate = useCallback(() => {
    const s = stateRef.current;
    if (s.idleTimer) clearTimeout(s.idleTimer);
    s.idleTimer = setTimeout(() => { s.autoRotate = true; }, 3000);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: THREE_TYPE.Scene;
    let camera: THREE_TYPE.PerspectiveCamera;
    let renderer: THREE_TYPE.WebGLRenderer;
    let truck: THREE_TYPE.Group;
    const s = stateRef.current;

    const setup = async () => {
      const THREE = await import("three");
      const ct = stateRef.current.themeRef ?? t;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(ct.bgTop);
      scene.fog = new THREE.Fog(new THREE.Color(ct.fogColor).getHex(), 20, 60);

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
      camera.position.set(4, 3, s.zoom);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      stateRef.current.renderer = renderer;

      // Lighting
      scene.add(new THREE.AmbientLight(new THREE.Color(ct.ambientColor), 0.55));

      const sun = new THREE.DirectionalLight(0xfff8e0, ct.sunIntensity);
      sun.position.set(10, 15, 8);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      scene.add(sun);

      const fill = new THREE.DirectionalLight(0x3366aa, 0.4);
      fill.position.set(-8, 3, -6);
      scene.add(fill);

      const underLight = new THREE.PointLight(0xffffff, 0.3, 20);
      underLight.position.set(0, -1, 3);
      scene.add(underLight);

      // Build models
      truck = buildTruck(THREE);
      truck.position.set(0, 0.02, 0);
      scene.add(truck);

      const ground = buildGround(THREE, ct.groundColor, ct.roadColor);
      scene.add(ground);

      // Animate
      let wheelAngle = 0;
      const animate = () => {
        s.animId = requestAnimationFrame(animate);
        wheelAngle += 0.04;

        // Spin wheels (torus elements)
        truck.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const geo = child.geometry;
            if (geo instanceof THREE.TorusGeometry) {
              // Only the tires (large torus)
              if ((geo as { parameters: { tube: number } }).parameters.tube > 0.08) {
                child.rotation.y = wheelAngle;
              }
            }
          }
        });

        if (s.autoRotate) {
          s.rotY += 0.004;
        }

        const theta = s.rotY;
        const phi   = Math.max(0.15, Math.min(1.35, s.rotX));
        camera.position.x = s.zoom * Math.sin(phi) * Math.sin(theta);
        camera.position.y = s.zoom * Math.cos(phi) + 0.5;
        camera.position.z = s.zoom * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(0, 0.8, 0);

        renderer.render(scene, camera);
      };
      animate();
    };

    setup().catch(console.error);

    const onMouseDown = (e: MouseEvent) => { s.isDragging = true; s.lastX = e.clientX; s.lastY = e.clientY; s.autoRotate = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!s.isDragging) return;
      s.rotY += (e.clientX - s.lastX) * 0.008;
      s.rotX += (e.clientY - s.lastY) * 0.008;
      s.lastX = e.clientX; s.lastY = e.clientY;
    };
    const onMouseUp   = () => { s.isDragging = false; scheduleAutoRotate(); };
    const onWheel     = (e: WheelEvent) => { s.zoom = Math.max(3.5, Math.min(18, s.zoom + e.deltaY * 0.018)); s.autoRotate = false; scheduleAutoRotate(); };
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) { s.isDragging = true; s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY; s.autoRotate = false; } };
    const onTouchMove  = (e: TouchEvent) => {
      if (!s.isDragging || e.touches.length !== 1) return;
      s.rotY += (e.touches[0].clientX - s.lastX) * 0.008;
      s.rotX += (e.touches[0].clientY - s.lastY) * 0.008;
      s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { s.isDragging = false; scheduleAutoRotate(); };

    canvas.addEventListener("mousedown",  onMouseDown);
    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseup",    onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("wheel",      onWheel, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: true });
    canvas.addEventListener("touchend",   onTouchEnd);

    return () => {
      cancelAnimationFrame(s.animId);
      if (s.idleTimer) clearTimeout(s.idleTimer);
      canvas.removeEventListener("mousedown",  onMouseDown);
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseup",    onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("wheel",      onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
      if (stateRef.current.renderer) { stateRef.current.renderer.dispose(); stateRef.current.renderer = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div className={`relative select-none ${className}`} style={{ width, height, cursor: "grab" }}>
      <canvas ref={canvasRef} style={{ display: "block", width, height }} />
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
          </svg>
          <span className="text-white/60 text-[9px] font-medium">Drag · Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-1 bg-red-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white text-[9px] font-bold">3D Live</span>
        </div>
      </div>
    </div>
  );
}
