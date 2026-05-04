"use client";

import { useEffect, useRef } from "react";

export interface MapLocation {
  id: number;
  lat: number;
  lng: number;
  label: string;
  status?: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<number, import("leaflet").Marker>>(new Map());
  const prevSelectedId = useRef<number | null>(null);

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
        const html = isSelected ? selectedPinSvg(loc.status ?? "Active") : smallPinSvg(loc.status ?? "Active");
        const size: [number, number] = isSelected ? [40, 50] : [24, 30];
        const anchor: [number, number] = isSelected ? [20, 50] : [12, 30];

        const icon = L.divIcon({ className: "", html, iconSize: size, iconAnchor: anchor });
        const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 })
          .addTo(map)
          .bindTooltip(`<b>${loc.label}</b><br><span style="color:#94a3b8;font-size:10px">${loc.status ?? ""}</span>`, {
            direction: "top",
            offset: isSelected ? [0, -52] : [0, -32],
            className: "loc-tooltip",
          });
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
        const html = isSelected ? selectedPinSvg(loc.status ?? "Active") : smallPinSvg(loc.status ?? "Active");
        const size: [number, number] = isSelected ? [40, 50] : [24, 30];
        const anchor: [number, number] = isSelected ? [20, 50] : [12, 30];
        marker.setIcon(L.divIcon({ className: "", html, iconSize: size, iconAnchor: anchor }));
        marker.setZIndexOffset(isSelected ? 1000 : 0);
      });

      mapRef.current.flyTo([selectedLoc.lat, selectedLoc.lng], 13, { duration: 0.9 });
      prevSelectedId.current = selectedId;
    };

    update().catch(console.error);
  }, [selectedId, locations]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
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
