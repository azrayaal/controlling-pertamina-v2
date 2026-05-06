"use client";
import { useEffect, useRef } from "react";
import type { vessels as VesselsType, trucks as TrucksType } from "@/lib/mockData";

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
}

type LeafletType = typeof import("leaflet");

declare global {
  interface Window {
    _fleetDetailClick?: (type: "vessel" | "truck", id: string) => void;
  }
}

// bearing in degrees where 0 = North, 90 = East (standard compass)
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
function vesselDivIcon(L: LeafletType, bearing: number, isSelected: boolean, hasAlert: boolean) {
  const size = isSelected ? 48 : 38;
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
        border-radius:50%;border:2px solid rgba(239,68,68,0.85);"></div>`
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
      <div style="transform:rotate(${bearing}deg);transform-origin:50% 50%;
        width:${size}px;height:${size}px;filter:${shadow};">
        <img src="/kapalicon.png" style="width:100%;height:100%;object-fit:contain;display:block;" />
      </div>
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
  });
}

// Truck icon: a rounded square with a truck SVG, rotates to face direction of travel
function truckDivIcon(L: LeafletType, bearing: number, isSelected: boolean, hasAlert: boolean) {
  const color = hasAlert ? "#ef4444" : "#e63946";
  const size  = isSelected ? 36 : 28;
  const pulseHtml = isSelected
    ? `<div style="position:absolute;top:50%;left:50%;
        width:${size + 14}px;height:${size + 14}px;
        margin-left:-${(size + 14) / 2}px;margin-top:-${(size + 14) / 2}px;
        border-radius:50%;border:2px solid ${color};opacity:.55;
        animation:fleetPulse 1.5s ease-out infinite;"></div>`
    : "";
  // Truck SVG naturally points UP (north), so bearing rotation works the same as vessels
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
      ${pulseHtml}
      <div style="transform:rotate(${bearing}deg);transform-origin:50% 50%;
        width:${size}px;height:${size}px;
        filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="${isSelected ? 15 : 13}" fill="${color}" stroke="white" stroke-width="2"/>
          <!-- Arrow pointing up = direction of travel -->
          <polygon points="16,6 22,20 16,17 10,20" fill="white" opacity=".95"/>
          ${hasAlert ? `<circle cx="24" cy="8" r="5" fill="#f59e0b"/>
            <text x="24" y="12" text-anchor="middle" font-size="7" fill="white" font-weight="bold">!</text>` : ""}
        </svg>
      </div>
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 4],
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
      <div style="font-weight:700;font-size:13px;color:#fff;letter-spacing:-.2px;">${v.name}</div>
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
          font-size:10px;font-weight:700;cursor:pointer;letter-spacing:.3px;transition:background .15s;"
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiveTrackingMap({
  vessels, trucks,
  selectedVesselId, selectedTruckId,
  onVesselClick, onTruckClick,
  mapType = "street",
  activeFilter = "all",
  height = "100%",
  className = "",
}: LiveTrackingMapProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<import("leaflet").Map | null>(null);
  const leafletRef    = useRef<LeafletType | null>(null);
  const tileLayerRef  = useRef<import("leaflet").TileLayer | null>(null);
  const vesselMarkers = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const truckMarkers  = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const vesselLines   = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const truckLines    = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const animState     = useRef<Map<string, { progress: number; dir: number; speed: number }>>(new Map());

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

      // Custom popup/tooltip styles
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
        .track-tooltip {
          background: rgba(10,15,25,.94) !important; border: 1px solid rgba(255,255,255,.14) !important;
          color: #fff !important; border-radius: 7px !important; padding: 4px 9px !important;
          font-size: 11px !important; font-family: Inter, sans-serif !important;
          box-shadow: 0 4px 14px rgba(0,0,0,.45) !important; white-space: nowrap !important;
          pointer-events: none !important;
        }
        .track-tooltip::before { display: none !important; }
      `;
      document.head.appendChild(style);

      // Global callback: popup button → parent React handler
      window._fleetDetailClick = (type, id) => {
        if (type === "vessel") onVesselRef.current(id);
        else onTruckRef.current(id);
        map.closePopup();
      };

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

      // ── Draw ALL vessels (always; filter controls visibility) ──────────
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
          color: v.color ?? "#1e2d4d",
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

        vesselMarkers.current.set(v.id, marker);
      });

      // ── Draw ALL trucks (always; filter controls visibility) ───────────
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

        truckMarkers.current.set(t.id, marker);
      });

      mapRef.current = map;

      // Apply initial filter (handles case where filter changed before async init completed)
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
        const map = mapRef.current;
        if (!Lx || !map) return;

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
          // Idle/Loading trucks stay put
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
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Show/hide markers when filter changes ─────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const showV = activeFilter === "all" || activeFilter === "vessel";
    const showT = activeFilter === "all" || activeFilter === "truck";

    vesselMarkers.current.forEach((m) => {
      if (showV) { if (!map.hasLayer(m)) m.addTo(map); }
      else       { if (map.hasLayer(m))  m.remove();   }
    });
    vesselLines.current.forEach((l) => {
      if (showV) { if (!map.hasLayer(l)) l.addTo(map); }
      else       { if (map.hasLayer(l))  l.remove();   }
    });
    truckMarkers.current.forEach((m) => {
      if (showT) { if (!map.hasLayer(m)) m.addTo(map); }
      else       { if (map.hasLayer(m))  m.remove();   }
    });
    truckLines.current.forEach((l) => {
      if (showT) { if (!map.hasLayer(l)) l.addTo(map); }
      else       { if (map.hasLayer(l))  l.remove();   }
    });
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

  // ── Update icon style on selection change ─────────────────────────────────
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

    // Close any open popup when nothing is selected
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
    <div ref={containerRef} className={className} style={{ height, width: "100%" }} />
  );
}
