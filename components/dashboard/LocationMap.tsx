"use client";

import { useEffect, useRef, useState } from "react";

export type LocationCategory = "Upstream" | "Kilang" | "Storage" | "Terminal" | "SPBU" | "Depot";

export interface MapLocation {
  id: number;
  lat: number;
  lng: number;
  label: string;
  status?: string;
  category?: LocationCategory;
}

interface StatBadge {
  label: string;
  value: string;
}

interface LocationMapProps {
  locations: MapLocation[];
  selectedId: number;
  stats?: StatBadge[];
  height?: string;
  className?: string;
}

// Pinpoint icon URLs per category
const CATEGORY_PINPOINT: Record<LocationCategory, string> = {
  Upstream: "/upstreamiconpinpoint.png",
  Kilang:   "/kilangiconpinpoint.png",
  Storage:  "/storageiconpinpoint.png",
  Terminal: "/terminaliconpinpoint.png",
  SPBU:     "/spbuiconpinpoint.png",
  Depot:    "/storageiconpinpoint.png",
};

// Category accent colors for selection ring
const CATEGORY_COLOR: Record<LocationCategory, string> = {
  Upstream: "#3b82f6",
  Kilang:   "#f97316",
  Storage:  "#8b5cf6",
  Terminal: "#14b8a6",
  SPBU:     "#22c55e",
  Depot:    "#8b5cf6",
};

/** Builds a DivIcon that uses the real pinpoint PNG (with selection ring when active) */
function pinpointDivIcon(
  L: typeof import("leaflet"),
  iconUrl: string,
  isSelected: boolean,
  color: string,
) {
  const size   = isSelected ? 38 : 28;
  const ring   = isSelected
    ? `<div style="
        position:absolute;top:50%;left:50%;
        width:${size + 14}px;height:${size + 14}px;
        margin-left:-${(size + 14) / 2}px;margin-top:-${(size + 14) / 2}px;
        border-radius:50%;border:2.5px solid ${color};opacity:0.7;
        animation:locPulse 1.8s ease-out infinite;"></div>`
    : "";
  const shadow = isSelected
    ? `drop-shadow(0 0 7px ${color}99)`
    : "drop-shadow(0 2px 5px rgba(0,0,0,0.45))";

  return L.divIcon({
    className: "",
    html: `<style>
      @keyframes locPulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.9);opacity:0}}
    </style>
    <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
      ${ring}
      <img src="${iconUrl}" style="width:${size}px;height:${size}px;
        object-fit:contain;display:block;filter:${shadow};" />
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/** Fallback SVG pins (used when no category pinpoint is available) */
function selectedPinSvg(status: string) {
  const color = status === "Maintenance" || status === "Construction" ? "#f59e0b" : "#ef4444";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <filter id="ps" x="-50%" y="-30%" width="200%" height="180%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.4)"/>
      </filter>
      <ellipse cx="20" cy="48" rx="7" ry="2.5" fill="rgba(0,0,0,0.2)"/>
      <path d="M20 2 C11.2 2 4 9.2 4 18 C4 29 20 46 20 46 C20 46 36 29 36 18 C36 9.2 28.8 2 20 2Z"
        fill="${color}" filter="url(#ps)"/>
      <circle cx="20" cy="18" r="8" fill="white" opacity="0.95"/>
      <circle cx="20" cy="18" r="4" fill="${color}"/>
    </svg>`;
}

function smallPinSvg(status: string) {
  const color =
    status === "Maintenance" || status === "Construction"
      ? "#f59e0b"
      : status === "Active" || status === "Running"
      ? "#10b981"
      : "#6b7280";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
      <ellipse cx="12" cy="28.5" rx="4" ry="1.5" fill="rgba(0,0,0,0.18)"/>
      <path d="M12 1.5 C7.3 1.5 3.5 5.3 3.5 10 C3.5 17 12 27 12 27 C12 27 20.5 17 20.5 10 C20.5 5.3 16.7 1.5 12 1.5Z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="10" r="3.5" fill="white" opacity="0.9"/>
    </svg>`;
}

export default function LocationMap({
  locations,
  selectedId,
  stats = [],
  height = "176px",
  className = "",
}: LocationMapProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<import("leaflet").Map | null>(null);
  const markersRef      = useRef<Map<number, import("leaflet").Marker>>(new Map());
  const prevSelectedId  = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (mapRef.current) setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, [isFullscreen]);

  // ── Init map & all markers once ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((containerRef.current as any)._leaflet_id) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) return;

      const selectedLoc = locations.find((l) => l.id === selectedId) ?? locations[0];

      const map = L.map(containerRef.current, {
        center: [selectedLoc.lat, selectedLoc.lng],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        opacity: 0.88,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Draw all markers
      locations.forEach((loc) => {
        const isSelected = loc.id === selectedId;
        const icon = buildIcon(L, loc, isSelected);

        const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 })
          .addTo(map)
          .bindTooltip(
            `<b>${loc.label}</b><br><span style="color:#94a3b8;font-size:10px">${loc.status ?? ""}</span>`,
            {
              direction: "top",
              offset: isSelected ? [0, -40] : [0, -30],
              className: "loc-tooltip",
            }
          );
        markersRef.current.set(loc.id, marker);
      });

      // Fit all markers in view
      const latlngs = locations.map((l) => L.latLng(l.lat, l.lng));
      if (latlngs.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [32, 32] });
      }

      prevSelectedId.current = selectedId;

      // Tooltip styles
      if (!document.getElementById("loc-tooltip-style")) {
        const style = document.createElement("style");
        style.id = "loc-tooltip-style";
        style.textContent = `
          .loc-tooltip {
            background: rgba(15,23,42,0.92) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            color: #fff !important;
            border-radius: 8px !important;
            padding: 5px 10px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            font-family: Inter, sans-serif !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
            white-space: nowrap !important;
            pointer-events: none !important;
          }
          .loc-tooltip::before { display:none !important; }
          .leaflet-control-zoom a {
            border-radius: 6px !important;
            font-size: 14px !important;
          }
        `;
        document.head.appendChild(style);
      }

      mapRef.current = map;
    };

    init().catch(console.error);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
        prevSelectedId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update marker icons & fly to selected when selection changes ────────────
  useEffect(() => {
    if (!mapRef.current || prevSelectedId.current === selectedId) return;

    const update = async () => {
      const L = (await import("leaflet")).default;
      if (!mapRef.current) return;

      const selectedLoc = locations.find((l) => l.id === selectedId);
      if (!selectedLoc) return;

      // Update all marker icons
      locations.forEach((loc) => {
        const marker = markersRef.current.get(loc.id);
        if (!marker) return;
        const isSelected = loc.id === selectedId;
        const icon = buildIcon(L, loc, isSelected);
        marker.setIcon(icon);
        marker.setZIndexOffset(isSelected ? 1000 : 0);
      });

      mapRef.current.flyTo([selectedLoc.lat, selectedLoc.lng], 10, { duration: 0.9 });
      prevSelectedId.current = selectedId;
    };

    update().catch(console.error);
  }, [selectedId, locations]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`} style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
        style={{
          position: "absolute", top: 8, left: 8, zIndex: 1000,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.13)",
          borderRadius: 7, width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.16)",
        }}
      >
        {isFullscreen ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
          </svg>
        )}
      </button>

      {stats.length > 0 && (
        <div className="absolute bottom-3 left-3 flex gap-2 z-[1000] flex-wrap">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center shadow-md border border-white/60"
            >
              <p className="text-[11px] font-bold text-slate-800 leading-tight">{s.value}</p>
              <p className="text-[9px] text-slate-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Builds the appropriate Leaflet DivIcon for a location */
function buildIcon(
  L: typeof import("leaflet"),
  loc: MapLocation,
  isSelected: boolean,
): import("leaflet").DivIcon {
  if (loc.category && CATEGORY_PINPOINT[loc.category]) {
    const url   = CATEGORY_PINPOINT[loc.category];
    const color = CATEGORY_COLOR[loc.category] ?? "#64748b";
    return pinpointDivIcon(L, url, isSelected, color);
  }
  // Fallback: generic SVG pin
  if (isSelected) {
    return L.divIcon({
      className: "",
      html: selectedPinSvg(loc.status ?? "Active"),
      iconSize:    [40, 50],
      iconAnchor:  [20, 50],
      popupAnchor: [0, -52],
    });
  }
  return L.divIcon({
    className: "",
    html: smallPinSvg(loc.status ?? "Active"),
    iconSize:    [24, 30],
    iconAnchor:  [12, 30],
    popupAnchor: [0, -32],
  });
}
