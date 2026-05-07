"use client";
/**
 * Model3DViewer.tsx
 * Unified 3D model viewer — dynamically loads TankerScene or TruckScene.
 * Supports light/dark theme auto-detection to match the surrounding UI.
 *
 * Usage:
 *   import Model3DViewer from "@/components/3d/Model3DViewer";
 *   <Model3DViewer type="tanker" width={560} height={320} label="MT Patra I" />
 *   <Model3DViewer type="truck"  width={560} height={320} label="B 9531 PD" />
 *   <Model3DViewer type="tanker" colorScheme="light" ... />   ← bright daylight
 */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Layers } from "lucide-react";

export type ColorScheme = "dark" | "light" | "auto";

/** Theme tokens passed to each scene */
export interface SceneTheme {
  bgTop: string;    // sky / background top color
  bgBottom: string; // horizon / ground bottom color
  fogColor: string;
  ambientColor: string;
  sunIntensity: number;
  waterColor?: string;
  groundColor?: string;
  roadColor?: string;
}

const DARK_OCEAN_THEME: SceneTheme = {
  bgTop:       "#050d1a",
  bgBottom:    "#0a2040",
  fogColor:    "#0a2040",
  ambientColor:"#6688cc",
  sunIntensity: 2.2,
  waterColor:  "#1a5276",
};

const LIGHT_OCEAN_THEME: SceneTheme = {
  bgTop:       "#4fc3f7",
  bgBottom:    "#e3f2fd",
  fogColor:    "#c9e9f6",
  ambientColor:"#fffbe6",
  sunIntensity: 3.5,
  waterColor:  "#1e88e5",
};

const DARK_ROAD_THEME: SceneTheme = {
  bgTop:       "#050d1a",
  bgBottom:    "#0d1b2a",
  fogColor:    "#0d1b2a",
  ambientColor:"#668899",
  sunIntensity: 2.5,
  groundColor: "#1a1a1a",
  roadColor:   "#2d3436",
};

const LIGHT_ROAD_THEME: SceneTheme = {
  bgTop:       "#87ceeb",
  bgBottom:    "#f0e68c",
  fogColor:    "#d0e8f0",
  ambientColor:"#fffbe6",
  sunIntensity: 4.0,
  groundColor: "#3a6e1a",
  roadColor:   "#555555",
};

function getTheme(type: "tanker" | "truck", isDark: boolean): SceneTheme {
  if (type === "tanker") return isDark ? DARK_OCEAN_THEME : LIGHT_OCEAN_THEME;
  return isDark ? DARK_ROAD_THEME : LIGHT_ROAD_THEME;
}

// Dynamically load each scene (client-only, no SSR)
const TankerScene = dynamic(() => import("./TankerScene"), {
  ssr: false,
  loading: () => <SceneLoader label="Tanker" color="#1e2d4d" isDark={true} />,
});

const TruckScene = dynamic(() => import("./TruckScene"), {
  ssr: false,
  loading: () => <SceneLoader label="Truck" color="#dc2626" isDark={true} />,
});

function SceneLoader({ label, color, isDark }: { label: string; color: string; isDark: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ background: isDark ? "linear-gradient(135deg, #050d1a 0%, #0a2040 100%)" : "linear-gradient(135deg, #87ceeb 0%, #e3f2fd 100%)" }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-3"
        style={{ borderColor: `${color} ${color} ${color} transparent` }}
      />
      <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-slate-500"}`}>
        Loading 3D {label}…
      </p>
    </div>
  );
}

export interface Model3DViewerProps {
  type: "tanker" | "truck";
  width?: number;
  height?: number;
  /** Vehicle name shown in the HUD badge */
  label?: string;
  /** Subtitle shown in the HUD (e.g. route or plate info) */
  subtitle?: string;
  className?: string;
  /**
   * "auto" reads the <html> .dark class (default),
   * "dark"  forces the dark night theme,
   * "light" forces the bright daylight theme.
   */
  colorScheme?: ColorScheme;
}

export default function Model3DViewer({
  type,
  width = 560,
  height = 320,
  label,
  subtitle,
  className = "",
  colorScheme = "auto",
}: Model3DViewerProps) {
  const [isDark, setIsDark] = useState(true);

  // Detect dark mode from html.dark class
  useEffect(() => {
    if (colorScheme === "dark")  { setIsDark(true);  return; }
    if (colorScheme === "light") { setIsDark(false); return; }
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [colorScheme]);

  const theme = getTheme(type, isDark);
  const accentColor = type === "tanker" ? "#1e2d4d" : "#dc2626";
  const accentLight = type === "tanker" ? (isDark ? "#60a5fa" : "#1d4ed8") : (isDark ? "#f87171" : "#dc2626");
  const textColor   = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)";
  const subColor    = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
  const badgeBg     = isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.8)";
  const badgeBorder = isDark ? `${accentColor}55` : `${accentColor}33`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ width, height, background: theme.bgTop }}
    >
      {/* 3D Canvas */}
      {type === "tanker" ? (
        <TankerScene width={width} height={height} theme={theme} />
      ) : (
        <TruckScene width={width} height={height} theme={theme} />
      )}

      {/* Top HUD badge */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: badgeBg, backdropFilter: "blur(10px)", border: `1px solid ${badgeBorder}` }}
        >
          <Layers size={13} style={{ color: accentLight }} />
          <div>
            <p className="font-bold leading-tight text-sm" style={{ color: textColor }}>
              {type === "tanker" ? "Oil Tanker" : "Fuel Truck"} · 3D View
            </p>
            {label && (
              <p className="text-xs leading-tight mt-0.5" style={{ color: subColor }}>
                {label}{subtitle ? ` · ${subtitle}` : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-1">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: type === "tanker" ? "#22c55e" : "#f87171" }}
            />
            <span className="text-xs font-bold" style={{ color: type === "tanker" ? "#22c55e" : "#f87171" }}>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Bottom control hint */}
      <div className="absolute bottom-2 right-3 z-10 pointer-events-none">
        <div
          className="flex items-center gap-1 rounded-lg px-2 py-1"
          style={{ background: isDark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.6)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"} strokeWidth="2"/>
            <path d="M12 7v10M7 12h10" stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            360° · Scroll zoom
          </span>
        </div>
      </div>
    </div>
  );
}
