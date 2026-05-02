"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

interface JakartaMapProps {
  height?: string;
  className?: string;
  truckLat?: number;
  truckLng?: number;
  zoom?: number;
}

export default function JakartaMap({
  height = "100%",
  className = "",
  truckLat = -6.2266,
  truckLng = 106.8061,
  zoom = 12,
}: JakartaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Check if container is already initialized
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current!, {
        center: [truckLat, truckLng],
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Custom truck icon
      const truckIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;border-radius:50%;
          background:#e63946;border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
          position:relative;
        ">
          <div style="width:10px;height:10px;background:white;border-radius:50%"></div>
          <div style="
            position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);
            width:0;height:0;border-left:5px solid transparent;
            border-right:5px solid transparent;border-top:8px solid #e63946;
          "></div>
        </div>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });

      // Destination icon
      const destIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:22px;height:22px;border-radius:50%;
          background:#1e2d4d;border:2.5px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
        </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      // Truck position
      L.marker([truckLat, truckLng], { icon: truckIcon })
        .addTo(map)
        .bindPopup("<b>B 9531 PD</b><br>In Transit");

      // Destination: Terminal Pelumpung (South Jakarta)
      const destLat = -6.2088;
      const destLng = 106.7752;
      L.marker([destLat, destLng], { icon: destIcon })
        .addTo(map)
        .bindPopup("<b>Terminal Pelumpung</b>");

      // Route line
      const routePoints: [number, number][] = [
        [-6.2266, 106.8061],
        [-6.222, 106.795],
        [-6.215, 106.785],
        [-6.2088, 106.7752],
      ];
      L.polyline(routePoints, {
        color: "#e63946",
        weight: 3,
        opacity: 0.8,
        dashArray: "8, 6",
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [truckLat, truckLng, zoom]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ height, width: "100%" }}
    />
  );
}
