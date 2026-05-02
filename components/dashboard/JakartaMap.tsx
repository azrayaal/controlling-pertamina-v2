"use client";
import { useEffect, useRef } from "react";
import type { trucks as TrucksType } from "@/lib/mockData";

type Truck = (typeof TrucksType)[number];

interface JakartaMapProps {
  trucks?: Truck[];
  selectedTruckId?: string | null;
  onTruckClick?: (id: string) => void;
  height?: string;
  className?: string;
  truckLat?: number;
  truckLng?: number;
  zoom?: number;
}

function truckMarkerHtml(selected: boolean, status: string) {
  const color  = status === "Loading" ? "#f59e0b" : "#e63946";
  const size   = selected ? 32 : 24;
  const shadow = selected
    ? "0 0 0 4px rgba(230,57,70,0.2), 0 2px 8px rgba(0,0,0,0.35)"
    : "0 2px 6px rgba(0,0,0,0.3)";
  return `<div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:${color};border:3px solid white;
    box-shadow:${shadow};
    display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;
  ">
    <div style="width:${selected ? 10 : 7}px;height:${selected ? 10 : 7}px;background:white;border-radius:50%"></div>
  </div>`;
}

export default function JakartaMap({
  trucks = [],
  selectedTruckId,
  onTruckClick,
  height = "100%",
  className = "",
  truckLat = -6.5,
  truckLng = 110,
  zoom = 7,
}: JakartaMapProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const mapInstanceRef  = useRef<import("leaflet").Map | null>(null);
  const truckMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const truckLinesRef   = useRef<Map<string, import("leaflet").Polyline>>(new Map());
  const onClickRef      = useRef(onTruckClick);
  onClickRef.current    = onTruckClick;

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((containerRef.current as any)._leaflet_id) return;

    let aborted = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Bail out if the effect was cleaned up while imports were loading,
      // or if another initMap call already initialized this container.
      if (aborted || !containerRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((containerRef.current as any)._leaflet_id) return;

      const map = L.map(containerRef.current!, {
        center: [truckLat, truckLng],
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        opacity: 0.88,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      trucks.forEach((t) => {
        const isSel = t.id === selectedTruckId;

        if (t.routeFrom && t.routeTo) {
          const line = L.polyline([t.routeFrom, [t.lat, t.lng], t.routeTo], {
            color: "#e63946",
            weight: isSel ? 2.5 : 1.5,
            opacity: isSel ? 0.85 : 0.4,
            dashArray: "7,5",
          }).addTo(map);
          truckLinesRef.current.set(t.id, line);
        }

        const icon = L.divIcon({
          className: "",
          html: truckMarkerHtml(isSel, t.status),
          iconSize: [isSel ? 32 : 24, isSel ? 32 : 24],
          iconAnchor: [isSel ? 16 : 12, isSel ? 16 : 12],
        });

        const marker = L.marker([t.lat, t.lng], { icon })
          .addTo(map)
          .bindTooltip(
            `<b>${t.plateNumber}</b><br>${t.driver} · ${t.status}`,
            { direction: "top", offset: [0, -10], className: "jk-tooltip" }
          );
        marker.on("click", () => onClickRef.current?.(t.id));
        truckMarkersRef.current.set(t.id, marker);
      });

      const style = document.createElement("style");
      style.textContent = `
        .jk-tooltip {
          background: rgba(15,23,42,0.88) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: #fff !important;
          border-radius: 8px !important;
          padding: 5px 9px !important;
          font-size: 11px !important;
          font-family: Inter, sans-serif !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35) !important;
          white-space: nowrap !important;
        }
        .jk-tooltip::before { display: none !important; }
      `;
      document.head.appendChild(style);

      mapInstanceRef.current = map;
    };

    initMap().catch(console.error);

    return () => {
      aborted = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      truckMarkersRef.current.clear();
      truckLinesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = async () => {
      const L = (await import("leaflet")).default;
      trucks.forEach((t) => {
        const marker = truckMarkersRef.current.get(t.id);
        if (!marker) return;
        const isSel = t.id === selectedTruckId;
        marker.setIcon(
          L.divIcon({
            className: "",
            html: truckMarkerHtml(isSel, t.status),
            iconSize: [isSel ? 32 : 24, isSel ? 32 : 24],
            iconAnchor: [isSel ? 16 : 12, isSel ? 16 : 12],
          })
        );
        const line = truckLinesRef.current.get(t.id);
        if (line) {
          line.setStyle({ weight: isSel ? 2.5 : 1.5, opacity: isSel ? 0.85 : 0.4 });
          if (isSel) line.bringToFront();
        }
      });
    };
    update().catch(console.error);
  }, [selectedTruckId, trucks]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTruckId) return;
    const t = trucks.find((x) => x.id === selectedTruckId);
    if (t) mapInstanceRef.current.flyTo([t.lat, t.lng], 11, { duration: 1 });
  }, [selectedTruckId, trucks]);

  return <div ref={containerRef} className={className} style={{ height, width: "100%" }} />;
}
