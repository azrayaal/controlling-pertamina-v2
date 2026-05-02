"use client";
import { useEffect, useRef } from "react";

interface IndonesiaMapProps {
  height?: string;
  className?: string;
}

export default function IndonesiaMap({ height = "100%", className = "" }: IndonesiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current!, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const shipIcon = (color = "#1e2d4d") => L.divIcon({
        className: "",
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const truckIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#e63946;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Vessels
      L.marker([-6.1, 106.8], { icon: shipIcon() }).addTo(map).bindPopup("<b>MT Srikandi</b><br>IDJKT → IDSUB");
      L.marker([-2.5, 109.3], { icon: shipIcon("#1a3a8c") }).addTo(map).bindPopup("<b>MT Nusantara</b><br>Merak → Pontianak");
      L.marker([-3.2, 114.5], { icon: shipIcon() }).addTo(map);
      L.marker([-7.2, 112.7], { icon: shipIcon("#1a3a8c") }).addTo(map);

      // Trucks
      L.marker([-6.2, 106.8], { icon: truckIcon }).addTo(map).bindPopup("<b>B 9531 PD</b><br>In Transit");

      // Route lines
      L.polyline([[-6.1, 106.8], [-7.2, 112.7]], {
        color: "#e63946", weight: 2, opacity: 0.6, dashArray: "6,4"
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
  }, []);

  return <div ref={mapRef} className={className} style={{ height, width: "100%" }} />;
}
