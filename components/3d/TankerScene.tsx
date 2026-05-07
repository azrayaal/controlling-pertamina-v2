"use client";
/**
 * TankerScene.tsx
 * Procedural Three.js 3D oil tanker ship with 360° orbit controls.
 * No external model files required — fully self-contained.
 */
import { useEffect, useRef, useCallback } from "react";
import type * as THREE_TYPE from "three";

import type { SceneTheme } from "./Model3DViewer";

interface TankerSceneProps {
  width?: number;
  height?: number;
  className?: string;
  theme?: SceneTheme;
}

// ── Build the tanker ship geometry ────────────────────────────────────────────
function buildTanker(THREE: typeof THREE_TYPE): THREE_TYPE.Group {
  const group = new THREE.Group();

  // Shared materials
  const hullMat    = new THREE.MeshStandardMaterial({ color: 0x1e2d4d, roughness: 0.55, metalness: 0.4 });
  const redMat     = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.6,  metalness: 0.2 });
  const whiteMat   = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.5,  metalness: 0.2 });
  const steelMat   = new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.35, metalness: 0.8 });
  const orangeMat  = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5,  metalness: 0.3 });
  const yellowMat  = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.6,  metalness: 0.2 });
  const glassMat   = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1,  metalness: 0.1, opacity: 0.6, transparent: true });

  // ── Hull ────────────────────────────────────────────────────────────────────
  // Main hull body
  const hullGeo  = new THREE.BoxGeometry(8, 0.7, 1.6);
  const hull     = new THREE.Mesh(hullGeo, hullMat);
  hull.position.set(0, 0, 0);
  hull.castShadow = true;
  group.add(hull);

  // Bow (tapered front) — a wedge-like shape
  const bowGeo = new THREE.CylinderGeometry(0, 0.8, 1.8, 4, 1);
  const bow    = new THREE.Mesh(bowGeo, hullMat);
  bow.rotation.set(Math.PI / 2, Math.PI / 4, 0);
  bow.position.set(4.5, 0, 0);
  bow.castShadow = true;
  group.add(bow);

  // Stern (rounded rear)
  const sternGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 8, 1);
  const stern    = new THREE.Mesh(sternGeo, hullMat);
  stern.rotation.set(Math.PI / 2, 0, 0);
  stern.position.set(-4, 0, 0);
  stern.castShadow = true;
  group.add(stern);

  // Red waterline stripe
  const waterlineGeo = new THREE.BoxGeometry(8, 0.15, 1.65);
  const waterline    = new THREE.Mesh(waterlineGeo, redMat);
  waterline.position.set(0, -0.28, 0);
  group.add(waterline);

  // Deck (top flat surface)
  const deckGeo  = new THREE.BoxGeometry(8, 0.1, 1.55);
  const deck     = new THREE.Mesh(deckGeo, steelMat);
  deck.position.set(0, 0.38, 0);
  group.add(deck);

  // ── Cargo tanks (4 cylinders along deck) ────────────────────────────────────
  const tankGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16);
  const tankPositionsX = [-2.8, -1.0, 0.8, 2.6];
  tankPositionsX.forEach((x) => {
    const tank = new THREE.Mesh(tankGeo, steelMat);
    tank.rotation.set(0, 0, Math.PI / 2);
    tank.position.set(x, 0.75, 0);
    tank.castShadow = true;
    group.add(tank);

    // Tank end caps
    const capGeo = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    [-0.7, 0.7].forEach((dz) => {
      const cap = new THREE.Mesh(capGeo, steelMat);
      cap.rotation.set(dz > 0 ? 0 : Math.PI, 0, Math.PI / 2);
      cap.position.set(x + dz, 0.75, 0);
      group.add(cap);
    });

    // Tank band rings
    const bandGeo  = new THREE.TorusGeometry(0.36, 0.02, 8, 16);
    const band1    = new THREE.Mesh(bandGeo, orangeMat);
    band1.rotation.set(0, 0, Math.PI / 2);
    band1.position.set(x - 0.3, 0.75, 0);
    group.add(band1);
    const band2    = band1.clone();
    band2.position.set(x + 0.3, 0.75, 0);
    group.add(band2);
  });

  // ── Superstructure / Bridge (stern area) ─────────────────────────────────────
  // Main bridge block
  const bridgeGeo  = new THREE.BoxGeometry(1.6, 1.1, 1.45);
  const bridge     = new THREE.Mesh(bridgeGeo, whiteMat);
  bridge.position.set(-3.0, 0.95, 0);
  bridge.castShadow = true;
  group.add(bridge);

  // Bridge second level
  const bridge2Geo = new THREE.BoxGeometry(1.4, 0.5, 1.3);
  const bridge2    = new THREE.Mesh(bridge2Geo, whiteMat);
  bridge2.position.set(-3.0, 1.75, 0);
  group.add(bridge2);

  // Bridge windows (glass panels)
  const winGeo = new THREE.BoxGeometry(1.35, 0.25, 0.05);
  const winFront = new THREE.Mesh(winGeo, glassMat);
  winFront.position.set(-3.0, 1.75, 0.68);
  group.add(winFront);
  const winBack = winFront.clone();
  winBack.position.set(-3.0, 1.75, -0.68);
  group.add(winBack);

  // Bridge top (navigation bridge)
  const bridgeTopGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
  const bridgeTop    = new THREE.Mesh(bridgeTopGeo, whiteMat);
  bridgeTop.position.set(-3.0, 2.05, 0);
  group.add(bridgeTop);

  // Funnel / smokestack
  const funnelGeo   = new THREE.CylinderGeometry(0.14, 0.18, 0.9, 12);
  const funnel      = new THREE.Mesh(funnelGeo, new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.6, metalness: 0.3 }));
  funnel.position.set(-3.3, 2.7, 0);
  funnel.castShadow = true;
  group.add(funnel);

  // Funnel top black band
  const funnelTopGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12);
  const funnelTop    = new THREE.Mesh(funnelTopGeo, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }));
  funnelTop.position.set(-3.3, 3.1, 0);
  group.add(funnelTop);

  // Pertamina logo stripe on funnel
  const stripeGeo  = new THREE.CylinderGeometry(0.145, 0.145, 0.15, 12);
  const pertStripe = new THREE.Mesh(stripeGeo, yellowMat);
  pertStripe.position.set(-3.3, 2.65, 0);
  group.add(pertStripe);

  // ── Mast (forward) ──────────────────────────────────────────────────────────
  const mastGeo  = new THREE.CylinderGeometry(0.02, 0.025, 1.8, 6);
  const mast     = new THREE.Mesh(mastGeo, steelMat);
  mast.position.set(3.5, 1.28, 0);
  group.add(mast);

  // Cross-arm
  const armGeo   = new THREE.BoxGeometry(0.02, 0.02, 0.8);
  const arm      = new THREE.Mesh(armGeo, steelMat);
  arm.position.set(3.5, 1.9, 0);
  group.add(arm);

  // ── Railings (side rails) ────────────────────────────────────────────────────
  const railGeo  = new THREE.BoxGeometry(7.8, 0.02, 0.02);
  [0.78, -0.78].forEach((z) => {
    const rail = new THREE.Mesh(railGeo, steelMat);
    rail.position.set(0, 0.56, z);
    group.add(rail);
    // Rail posts
    for (let x = -3.6; x <= 3.6; x += 0.6) {
      const postGeo = new THREE.BoxGeometry(0.02, 0.2, 0.02);
      const post    = new THREE.Mesh(postGeo, steelMat);
      post.position.set(x, 0.47, z);
      group.add(post);
    }
  });

  // ── Propeller ────────────────────────────────────────────────────────────────
  const propHub  = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8);
  const propHubM = new THREE.Mesh(propHub, steelMat);
  propHubM.rotation.set(0, 0, Math.PI / 2);
  propHubM.position.set(-4.6, -0.15, 0);
  group.add(propHubM);

  for (let i = 0; i < 4; i++) {
    const bladeGeo = new THREE.BoxGeometry(0.02, 0.28, 0.14);
    const blade    = new THREE.Mesh(bladeGeo, steelMat);
    blade.rotation.set(0, 0, (i * Math.PI) / 2);
    blade.position.set(-4.6, -0.15 + Math.sin((i * Math.PI) / 2) * 0.16, Math.cos((i * Math.PI) / 2) * 0.16);
    group.add(blade);
  }

  // ── Anchor chain detail ───────────────────────────────────────────────────────
  const anchorGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const anchorMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
  for (let i = 0; i < 4; i++) {
    const link = new THREE.Mesh(anchorGeo, anchorMat);
    link.position.set(4.0, -0.1 - i * 0.08, 0.55);
    group.add(link);
  }

  return group;
}

// ── Build Ocean Environment ────────────────────────────────────────────────────
function buildOcean(THREE: typeof THREE_TYPE, waterColor = "#1a5276"): THREE_TYPE.Group {
  const group = new THREE.Group();
  const oceanGeo = new THREE.PlaneGeometry(40, 40, 32, 32);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(waterColor),
    roughness: 0.3,
    metalness: 0.6,
    opacity: 0.88,
    transparent: true,
  });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.rotation.set(-Math.PI / 2, 0, 0);
  ocean.position.set(0, -0.35, 0);
  ocean.receiveShadow = true;
  group.add(ocean);
  return group;
}

const DEFAULT_THEME: SceneTheme = {
  bgTop: "#050d1a", bgBottom: "#0a2040", fogColor: "#0a2040",
  ambientColor: "#6688cc", sunIntensity: 2.2, waterColor: "#1a5276",
};

// ── TankerScene Component ──────────────────────────────────────────────────────
export default function TankerScene({ width = 600, height = 340, className = "", theme }: TankerSceneProps) {
  const t = theme ?? DEFAULT_THEME;
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const stateRef     = useRef<{
    renderer: THREE_TYPE.WebGLRenderer | null;
    animId: number;
    isDragging: boolean;
    lastX: number;
    lastY: number;
    rotX: number;
    rotY: number;
    zoom: number;
    autoRotate: boolean;
    idleTimer: ReturnType<typeof setTimeout> | null;
    themeRef?: SceneTheme;
  }>({
    renderer: null, animId: 0,
    isDragging: false, lastX: 0, lastY: 0,
    rotX: 0.3, rotY: 0, zoom: 12,
    autoRotate: true, idleTimer: null,
    themeRef: theme,
  });
  // Keep theme in sync so re-renders with new theme work
  stateRef.current.themeRef = theme ?? DEFAULT_THEME;

  const scheduleAutoRotate = useCallback(() => {
    const s = stateRef.current;
    if (s.idleTimer) clearTimeout(s.idleTimer);
    s.idleTimer = setTimeout(() => { s.autoRotate = true; }, 3000);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let THREE_MOD: typeof THREE_TYPE;
    let tanker: THREE_TYPE.Group;
    let ocean: THREE_TYPE.Group;
    let scene: THREE_TYPE.Scene;
    let camera: THREE_TYPE.PerspectiveCamera;
    let renderer: THREE_TYPE.WebGLRenderer;
    const s = stateRef.current;

    const setup = async () => {
      THREE_MOD = await import("three");
      const currentTheme = stateRef.current.themeRef ?? t;

      // Scene
      scene = new THREE_MOD.Scene();
      scene.background = new THREE_MOD.Color(currentTheme.bgTop);
      scene.fog = new THREE_MOD.FogExp2(new THREE_MOD.Color(currentTheme.fogColor).getHex(), 0.028);

      // Camera
      camera = new THREE_MOD.PerspectiveCamera(45, width / height, 0.1, 200);
      camera.position.set(0, 3, s.zoom);

      // Renderer
      renderer = new THREE_MOD.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE_MOD.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      stateRef.current.renderer = renderer;

      // Lighting
      const ambient = new THREE_MOD.AmbientLight(new THREE_MOD.Color(currentTheme.ambientColor), 0.65);
      scene.add(ambient);

      const sun = new THREE_MOD.DirectionalLight(0xfff4e0, currentTheme.sunIntensity);
      sun.position.set(8, 12, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      scene.add(sun);

      const fill = new THREE_MOD.DirectionalLight(0x4488ff, 0.5);
      fill.position.set(-6, 4, -8);
      scene.add(fill);

      const rimLight = new THREE_MOD.PointLight(0xffffff, 0.8, 30);
      rimLight.position.set(-8, 6, 0);
      scene.add(rimLight);

      // Build models
      tanker = buildTanker(THREE_MOD);
      scene.add(tanker);

      ocean = buildOcean(THREE_MOD, currentTheme.waterColor ?? "#1a5276");
      scene.add(ocean);

      // Stars (dark theme only) / clouds (light theme)
      const isDarkTheme = currentTheme.bgTop.startsWith("#0") || currentTheme.bgTop === "#050d1a";
      if (isDarkTheme) {
        const starGeo = new THREE_MOD.BufferGeometry();
        const stars: number[] = [];
        for (let i = 0; i < 800; i++) {
          stars.push((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120);
        }
        starGeo.setAttribute("position", new THREE_MOD.Float32BufferAttribute(stars, 3));
        const starMat = new THREE_MOD.PointsMaterial({ color: 0xffffff, size: 0.12, sizeAttenuation: true });
        scene.add(new THREE_MOD.Points(starGeo, starMat));
      } else {
        // Daylight: add horizon haze dome
        const domeGeo = new THREE_MOD.SphereGeometry(50, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE_MOD.MeshBasicMaterial({
          color: new THREE_MOD.Color(currentTheme.bgTop),
          side: THREE_MOD.BackSide,
        });
        scene.add(new THREE_MOD.Mesh(domeGeo, domeMat));
      }

      // Animation loop
      let elapsed = 0;
      const animate = () => {
        s.animId = requestAnimationFrame(animate);
        elapsed += 0.016;

        if (s.autoRotate) {
          s.rotY += 0.005;
        }

        // Ocean wave effect
        if (ocean.children[0]) {
          const oceanMesh = ocean.children[0] as THREE_TYPE.Mesh;
          const pos = (oceanMesh.geometry as THREE_TYPE.PlaneGeometry).attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getY(i);
            pos.setZ(i, Math.sin(x * 0.4 + elapsed) * 0.08 + Math.sin(z * 0.3 + elapsed * 0.8) * 0.05);
          }
          pos.needsUpdate = true;
        }

        // Ship gentle rocking
        tanker.rotation.z = Math.sin(elapsed * 0.4) * 0.025;
        tanker.position.y = Math.sin(elapsed * 0.5) * 0.04;

        // Camera orbit
        const theta = s.rotY;
        const phi   = Math.max(0.1, Math.min(1.4, s.rotX));
        camera.position.x = s.zoom * Math.sin(phi) * Math.sin(theta);
        camera.position.y = s.zoom * Math.cos(phi);
        camera.position.z = s.zoom * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(0, 0.5, 0);

        renderer.render(scene, camera);
      };
      animate();
    };

    setup().catch(console.error);

    // ── Mouse / Touch orbit controls ────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      s.isDragging  = true;
      s.lastX       = e.clientX;
      s.lastY       = e.clientY;
      s.autoRotate  = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!s.isDragging) return;
      const dx  = e.clientX - s.lastX;
      const dy  = e.clientY - s.lastY;
      s.rotY   += dx * 0.008;
      s.rotX   += dy * 0.008;
      s.lastX   = e.clientX;
      s.lastY   = e.clientY;
    };
    const onMouseUp = () => {
      s.isDragging = false;
      scheduleAutoRotate();
    };
    const onWheel = (e: WheelEvent) => {
      s.zoom   = Math.max(4, Math.min(22, s.zoom + e.deltaY * 0.02));
      s.autoRotate = false;
      scheduleAutoRotate();
    };
    // Touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        s.isDragging = true;
        s.lastX = e.touches[0].clientX;
        s.lastY = e.touches[0].clientY;
        s.autoRotate = false;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - s.lastX;
      const dy = e.touches[0].clientY - s.lastY;
      s.rotY += dx * 0.008;
      s.rotX += dy * 0.008;
      s.lastX = e.touches[0].clientX;
      s.lastY = e.touches[0].clientY;
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
      if (stateRef.current.renderer) {
        stateRef.current.renderer.dispose();
        stateRef.current.renderer = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div className={`relative select-none ${className}`} style={{ width, height, cursor: "grab" }}>
      <canvas ref={canvasRef} style={{ display: "block", width, height }} />
      {/* HUD overlay */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
          </svg>
          <span className="text-white/60 text-[9px] font-medium">Drag · Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white text-[9px] font-bold">3D Live</span>
        </div>
      </div>
    </div>
  );
}
