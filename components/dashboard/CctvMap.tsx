"use client";
import { useEffect, useRef } from "react";
import type { CctvLocation } from "@/lib/mockData";

interface CctvMapProps {
  locations: CctvLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  categoryFilter: string;
  regionFilter: string;
  height?: string;
}

type L = typeof import("leaflet");

const PINPOINT: Record<string, { url: string; size: [number, number] }> = {
  SPBU:     { url: "/spbuiconpinpoint.png",     size: [28, 36] },
  Kilang:   { url: "/kilangiconpinpoint.png",   size: [28, 36] },
  Storage:  { url: "/storageiconpinpoint.png",  size: [28, 36] },
  Terminal: { url: "/terminaliconpinpoint.png", size: [28, 36] },
  Upstream: { url: "/upstreamiconpinpoint.png", size: [28, 36] },
};

function isVisible(loc: CctvLocation, cat: string, reg: string) {
  const catOk = cat === "Semua" || loc.type === cat;
  const regOk = reg === "Semua" || loc.region === reg;
  return catOk && regOk;
}

export default function CctvMap({
  locations,
  selectedId,
  onSelect,
  categoryFilter,
  regionFilter,
  height = "100%",
}: CctvMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const leafletRef   = useRef<L | null>(null);
  const markers      = useRef<Map<string, import("leaflet").Marker>>(new Map());

  const onSelectRef      = useRef(onSelect);
  const locationsRef     = useRef(locations);
  const catRef           = useRef(categoryFilter);
  const regRef           = useRef(regionFilter);
  const selectedRef      = useRef(selectedId);

  onSelectRef.current  = onSelect;
  locationsRef.current = locations;
  catRef.current       = categoryFilter;
  regRef.current       = regionFilter;
  selectedRef.current  = selectedId;

  // ── Init map once ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((containerRef.current as any)._leaflet_id) return;

    const init = async () => {
      const Lx = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) return;

      leafletRef.current = Lx;

      const map = Lx.map(containerRef.current, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      Lx.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        opacity: 0.9,
      }).addTo(map);

      Lx.control.zoom({ position: "bottomright" }).addTo(map);

      // Custom tooltip style
      const style = document.createElement("style");
      style.textContent = `
        .cctv-tooltip {
          background: rgba(10,15,25,.94) !important;
          border: 1px solid rgba(255,255,255,.14) !important;
          color: #fff !important; border-radius: 7px !important;
          padding: 4px 9px !important; font-size: 11px !important;
          font-family: Inter, sans-serif !important;
          box-shadow: 0 4px 14px rgba(0,0,0,.45) !important;
          white-space: nowrap !important; pointer-events: none !important;
        }
        .cctv-tooltip::before { display: none !important; }
        .cctv-selected-ring {
          width: 44px; height: 44px;
          border: 2px solid rgba(59,130,246,.7);
          border-radius: 50%;
          animation: cctvPulse 1.5s ease-out infinite;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        @keyframes cctvPulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.8}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
      `;
      document.head.appendChild(style);

      // Draw all markers
      locationsRef.current.forEach((loc) => {
        const cfg = PINPOINT[loc.type] ?? PINPOINT.SPBU;
        const icon = Lx.icon({
          iconUrl:    cfg.url,
          iconSize:   cfg.size,
          iconAnchor: [cfg.size[0] / 2, cfg.size[1]],
          popupAnchor: [0, -cfg.size[1]],
        });

        const marker = Lx.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindTooltip(loc.name, { permanent: false, direction: "top", offset: [0, -cfg.size[1]], className: "cctv-tooltip" });

        marker.on("click", () => onSelectRef.current(loc.id));
        markers.current.set(loc.id, marker);
      });

      mapRef.current = map;

      // Apply initial filter
      locationsRef.current.forEach((loc) => {
        const m = markers.current.get(loc.id)!;
        if (!isVisible(loc, catRef.current, regRef.current)) {
          m.remove();
        }
      });
    };

    init().catch(console.error);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      markers.current.clear();
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filter visibility ─────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    locations.forEach((loc) => {
      const m = markers.current.get(loc.id);
      if (!m) return;
      if (isVisible(loc, categoryFilter, regionFilter)) {
        if (!map.hasLayer(m)) m.addTo(map);
      } else {
        if (map.hasLayer(m)) m.remove();
      }
    });
  }, [categoryFilter, regionFilter, locations]);

  // ── Fly to / highlight selected ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const Lx  = leafletRef.current;
    if (!map || !Lx) return;

    if (selectedId) {
      const loc = locations.find((l) => l.id === selectedId);
      if (loc) {
        map.flyTo([loc.lat, loc.lng], 9, { duration: 1 });
        const m = markers.current.get(loc.id);
        if (m) m.setZIndexOffset(1000);
      }
    }
    // Reset z-index for unselected
    locations.forEach((loc) => {
      const m = markers.current.get(loc.id);
      if (m && loc.id !== selectedId) m.setZIndexOffset(0);
    });
  }, [selectedId, locations]);

  return (
    <div ref={containerRef} style={{ height, width: "100%" }} />
  );
}
