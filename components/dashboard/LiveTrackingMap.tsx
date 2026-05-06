"use client";
import { useEffect, useRef, useState } from "react";
import type { vessels as VesselsType, trucks as TrucksType } from "@/lib/mockData";
import { cctvLocations } from "@/lib/mockData";

type Vessel = (typeof VesselsType)[number];
type Truck  = (typeof TrucksType)[number];

interface LiveTrackingMapProps {
  vessels: Vessel[];
  trucks: Truck[];
  selectedVesselId?: string | null;
  selectedTruckId?: string | null;
  onVesselClick: (id: string) => void;
  onTruckClick:  (id: string) => void;
  mapType?: "satellite" | "street";
  activeFilter?: "all" | "vessel" | "truck";
  height?: string;
  className?: string;
  /** Show infrastructure / CCTV-location markers. Default true. */
  showInfra?: boolean;
}

type LeafletType = typeof import("leaflet");

declare global {
  interface Window {
    _fleetDetailClick?: (type: "vessel" | "truck", id: string) => void;
  }
}

// bearing in degrees where 0 = North, 90 = East
function getBearing(from: [number, number], to: [number, number]): number {
  const dLng = to[1] - from[1];
  const dLat = to[0] - from[0];
  return Math.atan2(dLng, dLat) * (180 / Math.PI);
}

function normalizeBearing(deg: number): number {
  return Math.round(((deg % 360) + 360) % 360);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Icon builders ─────────────────────────────────────────────────────────────

/**
 * Ship icon: /kapalicon.png — right side is the FRONT.
 * rotate(bearing - 90) aligns the front with direction of travel.
 */
function vesselDivIcon(L: LeafletType, bearing: number, isSelected: boolean, hasAlert: boolean) {
  const size = isSelected ? 48 : 38;
  const rotateDeg = bearing - 90;

  const pulseHtml = isSelected
    ? `<div style="position:absolute;top:50%;left:50%;
        width:${size + 18}px;height:${size + 18}px;
        margin-left:-${(size + 18) / 2}px;margin-top:-${(size + 18) / 2}px;
        border-radius:50%;border:2px solid rgba(59,130,246,0.6);
        animation:fleetPulse 1.5s ease-out infinite;"></div>`
    : "";
  const alertRing = hasAlert && !isSelected
    ? `<div style="position:absolute;top:50%;left:50%;
        width:${size + 8}px;height:${size + 8}px;
        margin-left:-${(size + 8) / 2}px;margin-top:-${(size + 8) / 2}px;
        border-radius:50%;border:2px solid rgba(239,68,68,0.85);
        animation:fleetPulse 2s ease-out infinite;"></div>`
    : "";
  const shadow = isSelected
    ? "drop-shadow(0 0 8px rgba(59,130,246,.9))"
    : hasAlert
    ? "drop-shadow(0 0 6px rgba(239,68,68,.85))"
    : "drop-shadow(0 2px 5px rgba(0,0,0,.6))";

  return L.divIcon({
    className: "",
    html: `<style>
      @keyframes fleetPulse{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.4);opacity:0}}
    </style>
    <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
      ${pulseHtml}${alertRing}
      <div style="transform:rotate(${rotateDeg}deg);transform-origin:50% 50%;
        width:${size}px;height:${size}px;filter:${shadow};">
        <img src="/kapalicon.png" style="width:100%;height:100%;object-fit:contain;display:block;" />
      </div>
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

/**
 * Truck icon: /truckicon.png — right side is the FRONT of the truck.
 * Same rotation logic as kapalicon: rotate(bearing - 90).
 */
function truckDivIcon(L: LeafletType, bearing: number, isSelected: boolean, hasAlert: boolean) {
  const size = isSelected ? 44 : 34;
  const rotateDeg = bearing - 90;

  const pulseHtml = isSelected
    ? `<div style="position:absolute;top:50%;left:50%;
        width:${size + 14}px;height:${size + 14}px;
        margin-left:-${(size + 14) / 2}px;margin-top:-${(size + 14) / 2}px;
        border-radius:50%;border:2px solid rgba(230,57,70,0.6);opacity:.7;
        animation:fleetPulse 1.5s ease-out infinite;"></div>`
    : "";
  const alertRing = hasAlert && !isSelected
    ? `<div style="position:absolute;top:50%;left:50%;
        width:${size + 8}px;height:${size + 8}px;
        margin-left:-${(size + 8) / 2}px;margin-top:-${(size + 8) / 2}px;
        border-radius:50%;border:2px solid rgba(239,68,68,0.85);
        animation:fleetPulse 2s ease-out infinite;"></div>`
    : "";
  const shadow = isSelected
    ? "drop-shadow(0 0 8px rgba(230,57,70,.85))"
    : hasAlert
    ? "drop-shadow(0 0 6px rgba(239,68,68,.85))"
    : "drop-shadow(0 2px 5px rgba(0,0,0,.6))";

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
      ${pulseHtml}${alertRing}
      <div style="transform:rotate(${rotateDeg}deg);transform-origin:50% 50%;
        width:${size}px;height:${size}px;filter:${shadow};">
        <img src="/truckicon.png" style="width:100%;height:100%;object-fit:contain;display:block;" />
      </div>
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

/** Anomaly label badge placed at the midpoint of an alert vehicle's route */
function anomalyLabelIcon(L: LeafletType, label: string) {
  const w = label.length * 6.5 + 36;
  return L.divIcon({
    className: "",
    html: `<div style="
      display:inline-flex;align-items:center;gap:4px;
      background:#dc2626;color:#fff;
      font-family:Inter,system-ui,sans-serif;font-size:10px;font-weight:700;
      padding:4px 10px 4px 8px;border-radius:20px;
      box-shadow:0 3px 10px rgba(220,38,38,.55),0 1px 4px rgba(0,0,0,.4);
      white-space:nowrap;cursor:default;
      border:1.5px solid rgba(255,255,255,.3);">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <path d="M12 2L2 20h20L12 2z" fill="rgba(255,255,255,.25)" stroke="white" stroke-width="2"
          stroke-linejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="17.5" r="1.2" fill="white"/>
      </svg>
      ${label}
    </div>`,
    iconSize:    [w, 24],
    iconAnchor:  [w / 2, 12],
    popupAnchor: [0, -18],
  });
}

// ── Infrastructure marker icon ────────────────────────────────────────────────
const INFRA_CONFIG: Record<string, { color: string; pinpoint: string }> = {
  SPBU:     { color: "#22c55e", pinpoint: "/spbuiconpinpoint.png"     },
  Kilang:   { color: "#f97316", pinpoint: "/kilangiconpinpoint.png"   },
  Storage:  { color: "#8b5cf6", pinpoint: "/storageiconpinpoint.png"  },
  Terminal: { color: "#14b8a6", pinpoint: "/terminaliconpinpoint.png" },
  Upstream: { color: "#3b82f6", pinpoint: "/upstreamiconpinpoint.png" },
};

function infraDivIcon(L: LeafletType, type: string, hasAlert: boolean) {
  const cfg  = INFRA_CONFIG[type] ?? { color: "#64748b", pinpoint: "" };
  const size = 28;
  const alertDot = hasAlert
    ? `<div style="position:absolute;top:-2px;right:-2px;width:8px;height:8px;
        border-radius:50%;background:#ef4444;border:1.5px solid white;"></div>`
    : "";

  const iconHtml = cfg.pinpoint
    ? `<img src="${cfg.pinpoint}" style="width:100%;height:100%;object-fit:contain;display:block;" />`
    : `<div style="width:100%;height:100%;border-radius:50%;background:${cfg.color};border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;">
         <div style="width:8px;height:8px;border-radius:50%;background:white;opacity:.9;"></div>
       </div>`;

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;
        filter:drop-shadow(0 2px 5px rgba(0,0,0,.35));">
      ${iconHtml}${alertDot}
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ── Popup HTML builders ───────────────────────────────────────────────────────
function vesselPopupHtml(v: Vessel): string {
  const statusLabel =
    v.trackingStatus === "alert"      ? "Alert / Delayed" :
    v.trackingStatus === "in-transit" ? "In Transit"       : "En Route";
  const headerColor = v.color ?? "#1e2d4d";
  const bearing = normalizeBearing(getBearing(v.routeFrom as [number, number], v.routeTo as [number, number]));
  const rows: [string, string][] = [
    ["Kapten",  v.captain],
    ["Rute",    `${v.port} → ${v.destPort}`],
    ["Muatan",  v.cargo],
    ["Vol.",    v.cargoVolume],
    ["Kec.",    v.speed],
    ["Hdg.",    `${bearing}°`],
  ];
  return `<div style="min-width:250px;font-family:Inter,system-ui,sans-serif;">
    <div style="background:${headerColor};padding:12px 14px 10px;border-radius:0;">
      <div style="font-weight:700;font-size:13px;color:#fff;">${v.name}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.65);margin-top:2px;">${v.type} · ${statusLabel}</div>
    </div>
    <div style="background:#111827;padding:10px 14px 6px;">
      ${rows.map(([k, val]) => `
        <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.07);">
          <span style="color:rgba(255,255,255,.45);font-size:10px;flex-shrink:0;">${k}</span>
          <span style="color:#fff;font-size:10px;font-weight:600;max-width:170px;text-align:right;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${val}</span>
        </div>`).join("")}
    </div>
    <div style="background:#111827;padding:8px 14px 12px;">
      <button onclick="window._fleetDetailClick && window._fleetDetailClick('vessel','${v.id}')"
        style="width:100%;padding:7px 12px;background:rgba(255,255,255,.1);
          border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;
          font-size:10px;font-weight:700;cursor:pointer;transition:background .15s;"
        onmouseover="this.style.background='rgba(255,255,255,.2)'"
        onmouseout="this.style.background='rgba(255,255,255,.1)'">
        Lihat Detail Lengkap →
      </button>
    </div>
  </div>`;
}

function truckPopupHtml(t: Truck): string {
  const statusLabel =
    t.trackingStatus === "alert" ? "Alert" :
    t.trackingStatus === "idle"  ? "Idle"  : "On Route";
  const headerColor = t.trackingStatus === "alert" ? "#b91c1c" : "#dc2626";
  const idNum = parseInt(t.id.replace("t", "")) || 1;
  const kec = (t.trackingStatus === "idle" || t.phase === "Idle" || t.phase === "Loading")
    ? "0 km/h"
    : `${28 + (idNum * 7) % 22} km/h`;
  const bearing = normalizeBearing(getBearing(t.routeFrom as [number, number], t.routeTo as [number, number]));
  const rows: [string, string][] = [
    ["Driver",  t.driver],
    ["Rute",    t.tableRoute],
    ["Muatan",  t.load],
    ["Kec.",    kec],
    ["Hdg.",    `${bearing}°`],
  ];
  return `<div style="min-width:230px;font-family:Inter,system-ui,sans-serif;">
    <div style="background:${headerColor};padding:12px 14px 10px;">
      <div style="font-weight:700;font-size:13px;color:#fff;">${t.plateNumber}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.65);margin-top:2px;">Truk Tangki · ${statusLabel}</div>
    </div>
    <div style="background:#111827;padding:10px 14px 6px;">
      ${rows.map(([k, val]) => `
        <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.07);">
          <span style="color:rgba(255,255,255,.45);font-size:10px;flex-shrink:0;">${k}</span>
          <span style="color:#fff;font-size:10px;font-weight:600;max-width:155px;text-align:right;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${val}</span>
        </div>`).join("")}
    </div>
    <div style="background:#111827;padding:8px 14px 12px;">
      <button onclick="window._fleetDetailClick && window._fleetDetailClick('truck','${t.id}')"
        style="width:100%;padding:7px 12px;background:rgba(255,255,255,.1);
          border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;
          font-size:10px;font-weight:700;cursor:pointer;transition:background .15s;"
        onmouseover="this.style.background='rgba(255,255,255,.2)'"
        onmouseout="this.style.background='rgba(255,255,255,.1)'">
        Lihat Detail Lengkap →
      </button>
    </div>
  </div>`;
}

function infraPopupHtml(loc: (typeof cctvLocations)[number]): string {
  const cfg = INFRA_CONFIG[loc.type] ?? { color: "#64748b" };
  const online  = loc.cameras.filter((c) => c.status === "Live").length;
  const alerts  = loc.cameras.filter((c) => c.status === "Alert").length;
  const offline = loc.cameras.filter((c) => c.status === "Offline").length;
  return `<div style="min-width:200px;font-family:Inter,system-ui,sans-serif;">
    <div style="background:${cfg.color};padding:10px 12px 8px;">
      <div style="font-weight:700;font-size:12px;color:#fff;">${loc.name}</div>
      <div style="font-size:10px;color:rgba(255,255,255,.75);margin-top:2px;">${loc.type} · ${loc.region}</div>
    </div>
    <div style="background:#111827;padding:8px 12px 10px;">
      <div style="color:rgba(255,255,255,.5);font-size:10px;margin-bottom:6px;">${loc.location}</div>
      <div style="display:flex;gap:8px;">
        ${online  > 0 ? `<span style="color:#22c55e;font-size:10px;font-weight:600;">● ${online} online</span>` : ""}
        ${alerts  > 0 ? `<span style="color:#ef4444;font-size:10px;font-weight:600;">⚠ ${alerts} alert</span>` : ""}
        ${offline > 0 ? `<span style="color:#64748b;font-size:10px;">◯ ${offline} off</span>` : ""}
      </div>
      <div style="color:rgba(255,255,255,.35);font-size:9px;margin-top:4px;">${loc.cameras.length} kamera aktif</div>
    </div>
  </div>`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiveTrackingMap({
  vessels, trucks,
  selectedVesselId, selectedTruckId,
  onVesselClick, onTruckClick,
  mapType = "street",
  activeFilter = "all",
  height = "100%",
  className = "",
  showInfra = true,
}: LiveTrackingMapProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<import("leaflet").Map | null>(null);
  const leafletRef      = useRef<LeafletType | null>(null);
  const tileLayerRef    = useRef<import("leaflet").TileLayer | null>(null);
  const vesselMarkers   = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const truckMarkers    = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const vesselLines     = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const truckLines      = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const infraMarkers    = useRef<import("leaflet").Marker[]>([]);
  const anomalyMarkers  = useRef<import("leaflet").Marker[]>([]);
  const animState       = useRef<Map<string, { progress: number; dir: number; speed: number }>>(new Map());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stable refs to avoid stale closures in setInterval
  const onVesselRef = useRef(onVesselClick);
  const onTruckRef  = useRef(onTruckClick);
  const vesselsRef  = useRef(vessels);
  const trucksRef   = useRef(trucks);
  const selVRef     = useRef(selectedVesselId);
  const selTRef     = useRef(selectedTruckId);
  const filterRef   = useRef(activeFilter);

  onVesselRef.current = onVesselClick;
  onTruckRef.current  = onTruckClick;
  vesselsRef.current  = vessels;
  trucksRef.current   = trucks;
  selVRef.current     = selectedVesselId;
  selTRef.current     = selectedTruckId;
  filterRef.current   = activeFilter;

  // Toggle fullscreen via Fullscreen API
  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keep isFullscreen state in sync with DOM fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Notify Leaflet to resize when entering/exiting fullscreen
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 100);
    }
  }, [isFullscreen]);

  // ── Init map (once) ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((containerRef.current as any)._leaflet_id) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) return;

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const satUrl    = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      tileLayerRef.current = L.tileLayer(
        mapType === "satellite" ? satUrl : streetUrl,
        { maxZoom: 18, opacity: 0.9 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Popup / tooltip styles
      const style = document.createElement("style");
      style.textContent = `
        .fleet-popup .leaflet-popup-content-wrapper {
          background: transparent !important; border: none !important;
          box-shadow: 0 20px 56px rgba(0,0,0,.6) !important;
          padding: 0 !important; border-radius: 12px !important; overflow: hidden !important;
        }
        .fleet-popup .leaflet-popup-content { margin: 0 !important; color: #fff !important; }
        .fleet-popup .leaflet-popup-tip-container { display: none !important; }
        .fleet-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,.7) !important; font-size: 18px !important;
          font-weight: 300 !important; right: 10px !important; top: 10px !important; z-index: 10 !important;
        }
        .fleet-popup .leaflet-popup-close-button:hover { color: #fff !important; }
        .infra-popup .leaflet-popup-content-wrapper {
          background: transparent !important; border: none !important;
          box-shadow: 0 8px 32px rgba(0,0,0,.5) !important;
          padding: 0 !important; border-radius: 10px !important; overflow: hidden !important;
        }
        .infra-popup .leaflet-popup-content { margin: 0 !important; }
        .infra-popup .leaflet-popup-tip-container { display: none !important; }
        .infra-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,.7) !important; font-size: 16px !important; right: 8px !important; top: 8px !important;
        }
        .track-tooltip {
          background: rgba(10,15,25,.94) !important; border: 1px solid rgba(255,255,255,.14) !important;
          color: #fff !important; border-radius: 7px !important; padding: 4px 9px !important;
          font-size: 11px !important; font-family: Inter, sans-serif !important;
          box-shadow: 0 4px 14px rgba(0,0,0,.45) !important; white-space: nowrap !important;
          pointer-events: none !important;
        }
        .track-tooltip::before { display: none !important; }
        .infra-tooltip {
          background: rgba(10,15,25,.88) !important; border: 1px solid rgba(255,255,255,.1) !important;
          color: #e2e8f0 !important; border-radius: 6px !important; padding: 3px 8px !important;
          font-size: 10px !important; font-family: Inter, sans-serif !important;
          box-shadow: 0 3px 10px rgba(0,0,0,.4) !important;
        }
        .infra-tooltip::before { display: none !important; }
      `;
      document.head.appendChild(style);

      // Global popup callback
      window._fleetDetailClick = (type, id) => {
        if (type === "vessel") onVesselRef.current(id);
        else onTruckRef.current(id);
        map.closePopup();
      };

      // ── Infrastructure markers (optional) ──────────────────────────────
      if (showInfra) {
        cctvLocations.forEach((loc) => {
          const hasAlert = loc.cameras.some((c) => c.status === "Alert");
          const icon = infraDivIcon(L, loc.type, hasAlert);
          const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: -100 }).addTo(map);
          marker.bindTooltip(loc.name, {
            permanent: false, direction: "top",
            offset: [0, -28], className: "infra-tooltip",
          });
          marker.bindPopup(
            L.popup({ className: "infra-popup", closeButton: true, autoClose: true, closeOnClick: false })
              .setContent(infraPopupHtml(loc))
          );
          infraMarkers.current.push(marker);
        });
      }

      // Seed animation state
      vesselsRef.current.forEach((v, i) => {
        if (!animState.current.has(v.id)) {
          animState.current.set(v.id, {
            progress: v.progress / 100,
            dir: 1,
            speed: 0.0025 + (i % 6) * 0.0007,
          });
        }
      });
      trucksRef.current.forEach((t, i) => {
        if (!animState.current.has(t.id)) {
          animState.current.set(t.id, {
            progress: 0.20 + (i % 8) * 0.09,
            dir: 1,
            speed: 0.006 + (i % 5) * 0.002,
          });
        }
      });

      // Helper: add anomaly label at midpoint of a route
      const addAnomalyLabel = (from: [number,number], to: [number,number], label: string) => {
        const midLat = lerp(from[0], to[0], 0.5);
        const midLng = lerp(from[1], to[1], 0.5);
        const icon   = anomalyLabelIcon(L, label);
        const m      = L.marker([midLat, midLng], { icon, interactive: false, zIndexOffset: 500 }).addTo(map);
        anomalyMarkers.current.push(m);
      };

      // ── Draw ALL vessels ───────────────────────────────────────────────
      vesselsRef.current.forEach((v) => {
        const state    = animState.current.get(v.id)!;
        const from     = v.routeFrom as [number, number];
        const to       = v.routeTo   as [number, number];
        const lat      = lerp(from[0], to[0], state.progress);
        const lng      = lerp(from[1], to[1], state.progress);
        const bearing  = getBearing(state.dir === 1 ? from : to, state.dir === 1 ? to : from);
        const isSel    = v.id === selVRef.current;
        const hasAlert = v.trackingStatus === "alert";

        const line = L.polyline([from, [lat, lng], to], {
          color: hasAlert ? "#ef4444" : (v.color ?? "#1e2d4d"),
          weight: isSel ? 2.5 : 1.5,
          opacity: isSel ? 0.85 : 0.4,
          dashArray: "8 6",
        }).addTo(map);
        vesselLines.current.set(v.id, line);

        const marker = L.marker([lat, lng], {
          icon: vesselDivIcon(L, bearing, isSel, hasAlert),
          zIndexOffset: isSel ? 1000 : 0,
        }).addTo(map);
        marker.bindTooltip(v.name, {
          permanent: false, direction: "top",
          offset: [0, -20], className: "track-tooltip",
        });
        marker.bindPopup(
          L.popup({ className: "fleet-popup", closeButton: true, autoClose: true, closeOnClick: false })
            .setContent(vesselPopupHtml(v))
        );
        marker.on("click", () => { map.closePopup(); onVesselRef.current(v.id); });
        vesselMarkers.current.set(v.id, marker);

        // Anomaly label
        if (hasAlert) addAnomalyLabel(from, to, "Anomaly Alert");
      });

      // ── Draw ALL trucks ────────────────────────────────────────────────
      trucksRef.current.forEach((t) => {
        const state    = animState.current.get(t.id)!;
        const from     = t.routeFrom as [number, number];
        const to       = t.routeTo   as [number, number];
        const lat      = lerp(from[0], to[0], state.progress);
        const lng      = lerp(from[1], to[1], state.progress);
        const bearing  = getBearing(state.dir === 1 ? from : to, state.dir === 1 ? to : from);
        const isSel    = t.id === selTRef.current;
        const hasAlert = t.trackingStatus === "alert";

        const line = L.polyline([from, [lat, lng], to], {
          color: hasAlert ? "#ef4444" : "#e63946",
          weight: isSel ? 2.5 : 1.5,
          opacity: isSel ? 0.85 : 0.4,
          dashArray: "6 4",
        }).addTo(map);
        truckLines.current.set(t.id, line);

        const marker = L.marker([lat, lng], {
          icon: truckDivIcon(L, bearing, isSel, hasAlert),
          zIndexOffset: isSel ? 1000 : 0,
        }).addTo(map);
        marker.bindTooltip(t.plateNumber, {
          permanent: false, direction: "top",
          offset: [0, -16], className: "track-tooltip",
        });
        marker.bindPopup(
          L.popup({ className: "fleet-popup", closeButton: true, autoClose: true, closeOnClick: false })
            .setContent(truckPopupHtml(t))
        );
        marker.on("click", () => { map.closePopup(); onTruckRef.current(t.id); });
        truckMarkers.current.set(t.id, marker);

        // Anomaly label
        if (hasAlert) addAnomalyLabel(from, to, "Anomaly Alert");
      });

      mapRef.current = map;

      // Apply initial filter
      const initFilter = filterRef.current;
      if (initFilter !== "all") {
        const showV = initFilter === "vessel";
        const showT = initFilter === "truck";
        if (!showV) { vesselMarkers.current.forEach(m => m.remove()); vesselLines.current.forEach(l => l.remove()); }
        if (!showT) { truckMarkers.current.forEach(m => m.remove());  truckLines.current.forEach(l => l.remove());  }
      }

      // ── Animation tick (1 s interval) ──────────────────────────────────
      const tick = () => {
        const Lx  = leafletRef.current;
        const mp  = mapRef.current;
        if (!Lx || !mp) return;

        // Vessels
        vesselsRef.current.forEach((v) => {
          const state = animState.current.get(v.id);
          if (!state) return;
          const from = v.routeFrom as [number, number];
          const to   = v.routeTo   as [number, number];

          state.progress += state.dir * state.speed;
          if (state.progress >= 1) { state.progress = 1; state.dir = -1; }
          if (state.progress <= 0) { state.progress = 0; state.dir =  1; }

          const lat     = lerp(from[0], to[0], state.progress);
          const lng     = lerp(from[1], to[1], state.progress);
          const bearing = getBearing(
            state.dir === 1 ? from : to,
            state.dir === 1 ? to   : from
          );

          const marker = vesselMarkers.current.get(v.id);
          if (marker) {
            marker.setLatLng([lat, lng]);
            const isSel = v.id === selVRef.current;
            marker.setIcon(vesselDivIcon(Lx, bearing, isSel, v.trackingStatus === "alert"));
          }
          const line = vesselLines.current.get(v.id);
          if (line) line.setLatLngs([from, [lat, lng], to]);
        });

        // Trucks
        trucksRef.current.forEach((t) => {
          const state = animState.current.get(t.id);
          if (!state || t.trackingStatus === "idle" || t.phase === "Loading") return;

          const from = t.routeFrom as [number, number];
          const to   = t.routeTo   as [number, number];

          state.progress += state.dir * state.speed;
          if (state.progress >= 1) { state.progress = 1; state.dir = -1; }
          if (state.progress <= 0) { state.progress = 0; state.dir =  1; }

          const lat     = lerp(from[0], to[0], state.progress);
          const lng     = lerp(from[1], to[1], state.progress);
          const bearing = getBearing(
            state.dir === 1 ? from : to,
            state.dir === 1 ? to   : from
          );

          const marker = truckMarkers.current.get(t.id);
          if (marker) {
            marker.setLatLng([lat, lng]);
            const isSel = t.id === selTRef.current;
            marker.setIcon(truckDivIcon(Lx, bearing, isSel, t.trackingStatus === "alert"));
          }
          const line = truckLines.current.get(t.id);
          if (line) line.setLatLngs([from, [lat, lng], to]);
        });
      };

      intervalId = setInterval(tick, 1000);
    };

    initMap().catch(console.error);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      delete window._fleetDetailClick;
      vesselMarkers.current.clear();
      truckMarkers.current.clear();
      vesselLines.current.clear();
      truckLines.current.clear();
      infraMarkers.current  = [];
      anomalyMarkers.current = [];
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Show/hide markers on filter change ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const showV = activeFilter === "all" || activeFilter === "vessel";
    const showT = activeFilter === "all" || activeFilter === "truck";
    vesselMarkers.current.forEach((m) => { showV ? (!map.hasLayer(m) && m.addTo(map)) : m.remove(); });
    vesselLines.current.forEach((l)   => { showV ? (!map.hasLayer(l) && l.addTo(map)) : l.remove(); });
    truckMarkers.current.forEach((m)  => { showT ? (!map.hasLayer(m) && m.addTo(map)) : m.remove(); });
    truckLines.current.forEach((l)    => { showT ? (!map.hasLayer(l) && l.addTo(map)) : l.remove(); });
  }, [activeFilter]);

  // ── Switch tile layer on mapType change ───────────────────────────────────
  useEffect(() => {
    const L   = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !tileLayerRef.current) return;
    tileLayerRef.current.remove();
    const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const satUrl    = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    tileLayerRef.current = L.tileLayer(
      mapType === "satellite" ? satUrl : streetUrl,
      { maxZoom: 18, opacity: 0.9 }
    ).addTo(map);
  }, [mapType]);

  // ── Update icon styles on selection change ────────────────────────────────
  useEffect(() => {
    const L = leafletRef.current;
    if (!L) return;

    vessels.forEach((v) => {
      const marker = vesselMarkers.current.get(v.id);
      if (!marker) return;
      const state   = animState.current.get(v.id);
      const bearing = state
        ? getBearing(
            state.dir === 1 ? v.routeFrom as [number,number] : v.routeTo as [number,number],
            state.dir === 1 ? v.routeTo   as [number,number] : v.routeFrom as [number,number]
          )
        : 0;
      const isSel = v.id === selectedVesselId;
      marker.setIcon(vesselDivIcon(L, bearing, isSel, v.trackingStatus === "alert"));
      marker.setZIndexOffset(isSel ? 1000 : 0);
      const line = vesselLines.current.get(v.id);
      if (line) {
        line.setStyle({ weight: isSel ? 2.5 : 1.5, opacity: isSel ? 0.85 : 0.4 });
        if (isSel) line.bringToFront();
      }
    });

    trucks.forEach((t) => {
      const marker = truckMarkers.current.get(t.id);
      if (!marker) return;
      const state   = animState.current.get(t.id);
      const bearing = state
        ? getBearing(
            state.dir === 1 ? t.routeFrom as [number,number] : t.routeTo as [number,number],
            state.dir === 1 ? t.routeTo   as [number,number] : t.routeFrom as [number,number]
          )
        : 0;
      const isSel = t.id === selectedTruckId;
      marker.setIcon(truckDivIcon(L, bearing, isSel, t.trackingStatus === "alert"));
      marker.setZIndexOffset(isSel ? 1000 : 0);
      const line = truckLines.current.get(t.id);
      if (line) {
        line.setStyle({ weight: isSel ? 2.5 : 1.5, opacity: isSel ? 0.85 : 0.4 });
        if (isSel) line.bringToFront();
      }
    });

    if (!selectedVesselId && !selectedTruckId) {
      mapRef.current?.closePopup();
    }
  }, [selectedVesselId, selectedTruckId, vessels, trucks]);

  // ── Fly to selected marker ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedVesselId) {
      const v = vessels.find((x) => x.id === selectedVesselId);
      if (v) {
        const s   = animState.current.get(v.id);
        const lat = s ? lerp(v.routeFrom[0], v.routeTo[0], s.progress) : v.lat;
        const lng = s ? lerp(v.routeFrom[1], v.routeTo[1], s.progress) : v.lng;
        mapRef.current.flyTo([lat, lng], 7, { duration: 1.2 });
      }
    } else if (selectedTruckId) {
      const t = trucks.find((x) => x.id === selectedTruckId);
      if (t) {
        const s   = animState.current.get(t.id);
        const lat = s ? lerp(t.routeFrom[0], t.routeTo[0], s.progress) : t.lat;
        const lng = s ? lerp(t.routeFrom[1], t.routeTo[1], s.progress) : t.lng;
        mapRef.current.flyTo([lat, lng], 10, { duration: 1.2 });
      }
    }
  }, [selectedVesselId, selectedTruckId, vessels, trucks]);

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{ height, width: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 8,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          backdropFilter: "blur(4px)",
        }}
      >
        {isFullscreen ? (
          /* Minimize icon */
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
          </svg>
        ) : (
          /* Maximize icon */
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
          </svg>
        )}
      </button>
    </div>
  );
}
