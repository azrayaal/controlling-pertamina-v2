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
  height?: string;
  className?: string;
}

const VESSEL_COLORS: Record<string, string> = {
  "Oil Tanker":     "#1e2d4d",
  "Product Tanker": "#0d9488",
  "LPG Tanker":     "#f59e0b",
  "VLCC":           "#7c3aed",
};

function shipSvg(color: string, selected: boolean) {
  const size = selected ? 32 : 24;
  const ring = selected ? `<circle cx="16" cy="16" r="15" fill="none" stroke="${color}" stroke-width="2" opacity="0.35"/>` : "";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      ${ring}
      <circle cx="16" cy="16" r="${selected ? 11 : 9}" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M11 16 L16 10 L21 16 L21 20 L11 20 Z" fill="white" opacity="0.9"/>
    </svg>`;
}

function truckSvg(selected: boolean, status: string) {
  const color = status === "Loading" ? "#f59e0b" : "#e63946";
  const size  = selected ? 32 : 24;
  const ring  = selected ? `<circle cx="16" cy="16" r="15" fill="none" stroke="${color}" stroke-width="2" opacity="0.35"/>` : "";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      ${ring}
      <circle cx="16" cy="16" r="${selected ? 11 : 9}" fill="${color}" stroke="white" stroke-width="2"/>
      <rect x="9" y="17" width="14" height="6" rx="1" fill="white" opacity="0.9"/>
      <polygon points="9,17 9,12 18,12 22,17" fill="white" opacity="0.9"/>
    </svg>`;
}

export default function LiveTrackingMap({
  vessels, trucks,
  selectedVesselId, selectedTruckId,
  onVesselClick, onTruckClick,
  height = "100%",
  className = "",
}: LiveTrackingMapProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<import("leaflet").Map | null>(null);
  // track markers/layers so we can update icons on selection change
  const vesselMarkers  = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const truckMarkers   = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const vesselLines    = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const truckLines     = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  // stable callback refs
  const onVesselRef = useRef(onVesselClick);
  const onTruckRef  = useRef(onTruckClick);
  onVesselRef.current = onVesselClick;
  onTruckRef.current  = onTruckClick;

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((containerRef.current as any)._leaflet_id) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Guard: component may have unmounted or another async run beat us here
      if (!containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current, {
        center: [-2.5, 112],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        opacity: 0.85,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // ── Draw vessels ──────────────────────────────────────────────────────
      vessels.forEach((v) => {
        const isSelected = v.id === selectedVesselId;
        const color = VESSEL_COLORS[v.type] ?? "#1e2d4d";

        // Route line
        if (v.routeFrom && v.routeTo) {
          const line = L.polyline([v.routeFrom, [v.lat, v.lng], v.routeTo], {
            color, weight: isSelected ? 3 : 1.5, opacity: isSelected ? 0.9 : 0.45,
            dashArray: "8,5",
          }).addTo(map);
          vesselLines.current.set(v.id, line);
        }

        // Progress dot on route
        const icon = L.divIcon({
          className: "",
          html: shipSvg(color, isSelected),
          iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
          iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        });
        const marker = L.marker([v.lat, v.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b>${v.name}</b><br>${v.type} · ${v.speed}`, {
            direction: "top", offset: [0, -12], className: "tracking-tooltip",
          });
        marker.on("click", () => onVesselRef.current(v.id));
        vesselMarkers.current.set(v.id, marker);
      });

      // ── Draw trucks ───────────────────────────────────────────────────────
      trucks.forEach((t) => {
        const isSelected = t.id === selectedTruckId;

        // Route line
        if (t.routeFrom && t.routeTo) {
          const line = L.polyline([t.routeFrom, [t.lat, t.lng], t.routeTo], {
            color: "#e63946", weight: isSelected ? 3 : 1.5,
            opacity: isSelected ? 0.9 : 0.45, dashArray: "6,4",
          }).addTo(map);
          truckLines.current.set(t.id, line);
        }

        const icon = L.divIcon({
          className: "",
          html: truckSvg(isSelected, t.status),
          iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
          iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        });
        const marker = L.marker([t.lat, t.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b>${t.plateNumber}</b><br>${t.driver} · ${t.status}`, {
            direction: "top", offset: [0, -12], className: "tracking-tooltip",
          });
        marker.on("click", () => onTruckRef.current(t.id));
        truckMarkers.current.set(t.id, marker);
      });

      // add tooltip CSS once
      const style = document.createElement("style");
      style.textContent = `
        .tracking-tooltip {
          background: rgba(15,23,42,0.9) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: #fff !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          font-size: 12px !important;
          font-family: Inter, sans-serif !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
          white-space: nowrap !important;
        }
        .tracking-tooltip::before { display:none !important; }
      `;
      document.head.appendChild(style);

      mapRef.current = map;
    };

    initMap().catch(console.error);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      vesselMarkers.current.clear();
      truckMarkers.current.clear();
    };
    // run once — data updates handled in separate effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update marker icons & lines when selection changes ─────────────────────
  useEffect(() => {
    const initIcons = async () => {
      const L = (await import("leaflet")).default;

      vessels.forEach((v) => {
        const marker = vesselMarkers.current.get(v.id);
        if (!marker) return;
        const isSelected = v.id === selectedVesselId;
        const color = VESSEL_COLORS[v.type] ?? "#1e2d4d";
        marker.setIcon(L.divIcon({
          className: "",
          html: shipSvg(color, isSelected),
          iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
          iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        }));

        const line = vesselLines.current.get(v.id);
        if (line) {
          line.setStyle({ weight: isSelected ? 3 : 1.5, opacity: isSelected ? 0.9 : 0.45 });
          if (isSelected) line.bringToFront();
        }
      });

      trucks.forEach((t) => {
        const marker = truckMarkers.current.get(t.id);
        if (!marker) return;
        const isSelected = t.id === selectedTruckId;
        marker.setIcon(L.divIcon({
          className: "",
          html: truckSvg(isSelected, t.status),
          iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
          iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        }));

        const line = truckLines.current.get(t.id);
        if (line) {
          line.setStyle({ weight: isSelected ? 3 : 1.5, opacity: isSelected ? 0.9 : 0.45 });
          if (isSelected) line.bringToFront();
        }
      });
    };

    initIcons().catch(console.error);
  }, [selectedVesselId, selectedTruckId, vessels, trucks]);

  // ── Fly-to selected item ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedVesselId) {
      const v = vessels.find((x) => x.id === selectedVesselId);
      if (v) mapRef.current.flyTo([v.lat, v.lng], 7, { duration: 1.2 });
    } else if (selectedTruckId) {
      const t = trucks.find((x) => x.id === selectedTruckId);
      if (t) mapRef.current.flyTo([t.lat, t.lng], 10, { duration: 1.2 });
    }
  }, [selectedVesselId, selectedTruckId, vessels, trucks]);

  return <div ref={containerRef} className={className} style={{ height, width: "100%" }} />;
}
