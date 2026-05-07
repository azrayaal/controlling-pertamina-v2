"use client";
import { useEffect, useRef, useState } from "react";
import { vessels, trucks, cctvLocations } from "@/lib/mockData";

type RouteFilter = "all" | "pipeline" | "truck" | "vessel";

// ── Terminal & Pipeline route data ────────────────────────────────────────────
const TERMINALS = [
  { id: "t-dumai",    name: "Kilang RU-II Dumai",          lat: 1.675,   lng: 101.440, type: "Kilang" },
  { id: "t-batam",    name: "Terminal Pulau Sambu",          lat: 1.180,   lng: 104.070, type: "Terminal" },
  { id: "t-plumpang", name: "Terminal Plumpang",             lat: -6.126,  lng: 106.875, type: "Terminal" },
  { id: "t-merak",    name: "Terminal Tanjung Gerem",        lat: -5.939,  lng: 105.989, type: "Terminal" },
  { id: "t-cilacap",  name: "Kilang RU-IV Cilacap",          lat: -7.714,  lng: 109.015, type: "Kilang" },
  { id: "t-cikampek", name: "Storage Cikampek",              lat: -6.424,  lng: 107.460, type: "Storage" },
  { id: "t-surabaya", name: "Terminal Tanjung Perak",        lat: -7.198,  lng: 112.729, type: "Terminal" },
  { id: "t-baliknep", name: "Kilang RU-V Balikpapan",       lat: -1.267,  lng: 116.828, type: "Kilang" },
  { id: "t-makassar", name: "Terminal Makassar",             lat: -5.147,  lng: 119.432, type: "Terminal" },
  { id: "t-bitung",   name: "Terminal Bitung",               lat: 1.445,   lng: 125.188, type: "Terminal" },
  { id: "t-ambon",    name: "Storage Terminal Ambon",        lat: -3.694,  lng: 128.181, type: "Storage" },
  { id: "t-sorong",   name: "Terminal Sorong",               lat: -0.870,  lng: 131.250, type: "Terminal" },
  { id: "t-medan",    name: "Depot Medan",                   lat: 3.588,   lng: 98.673,  type: "Storage" },
  { id: "t-bandung",  name: "SPBU Bandung",                  lat: -6.921,  lng: 107.608, type: "SPBU" },
  { id: "t-semarang", name: "Depot Semarang",                lat: -6.966,  lng: 110.416, type: "Storage" },
  { id: "t-banjar",   name: "Depot Banjarmasin",             lat: -3.320,  lng: 114.590, type: "Storage" },
];

const PIPELINE_ROUTES = [
  // Sumatera Pipeline
  {
    id: "pp1", name: "Pipeline Dumai → Batam",
    from: [1.675, 101.440] as [number, number],
    to:   [1.180, 104.070] as [number, number],
    alert: false,
  },
  // Java Pipeline (main trunk)
  {
    id: "pp2", name: "Pipeline Merak → Plumpang",
    from: [-5.939, 105.989] as [number, number],
    to:   [-6.126, 106.875] as [number, number],
    alert: false,
  },
  {
    id: "pp3", name: "Pipeline Plumpang → Cikampek",
    from: [-6.126, 106.875] as [number, number],
    to:   [-6.424, 107.460] as [number, number],
    alert: true,
  },
  {
    id: "pp4", name: "Pipeline Cikampek → Cilacap",
    from: [-6.424, 107.460] as [number, number],
    to:   [-7.714, 109.015] as [number, number],
    alert: false,
  },
  {
    id: "pp5", name: "Pipeline Cilacap → Surabaya",
    from: [-7.714, 109.015] as [number, number],
    to:   [-7.198, 112.729] as [number, number],
    alert: false,
  },
];

// Vessel sea routes (inter-island)
const VESSEL_ROUTES = [
  {
    id: "vr1", name: "Dumai → Plumpang (via Selat Malaka)",
    waypoints: [
      [1.675, 101.440],
      [1.0, 103.8],
      [-1.5, 105.0],
      [-5.0, 106.0],
      [-6.126, 106.875],
    ] as [number, number][],
  },
  {
    id: "vr2", name: "Plumpang → Tanjung Perak (Jalur Utara)",
    waypoints: [
      [-6.126, 106.875],
      [-5.5, 108.0],
      [-5.6, 110.2],
      [-6.0, 111.5],
      [-7.198, 112.729],
    ] as [number, number][],
  },
  {
    id: "vr3", name: "Balikpapan → Makassar",
    waypoints: [
      [-1.267, 116.828],
      [-2.5, 117.5],
      [-3.5, 118.2],
      [-5.147, 119.432],
    ] as [number, number][],
  },
  {
    id: "vr4", name: "Makassar → Bitung",
    waypoints: [
      [-5.147, 119.432],
      [-2.0, 121.0],
      [0.5, 123.5],
      [1.445, 125.188],
    ] as [number, number][],
  },
  {
    id: "vr5", name: "Bontang → Plumpang (via Laut Jawa)",
    waypoints: [
      [0.130, 117.500],
      [-1.5, 114.5],
      [-3.0, 111.0],
      [-5.0, 109.0],
      [-6.0, 107.5],
      [-6.126, 106.875],
    ] as [number, number][],
  },
  {
    id: "vr6", name: "Sorong → Ambon",
    waypoints: [
      [-0.870, 131.250],
      [-2.5, 130.0],
      [-3.694, 128.181],
    ] as [number, number][],
  },
];

// Truck routes on land only
const TRUCK_ROUTES = [
  {
    id: "tr1", name: "Plumpang → Bandung",
    waypoints: [
      [-6.126, 106.875],
      [-6.45, 107.0],
      [-6.921, 107.608],
    ] as [number, number][],
  },
  {
    id: "tr2", name: "Plumpang → Tangerang",
    waypoints: [
      [-6.126, 106.875],
      [-6.22, 106.78],
      [-6.34, 106.65],
    ] as [number, number][],
  },
  {
    id: "tr3", name: "Cilacap → Yogyakarta",
    waypoints: [
      [-7.714, 109.015],
      [-7.78, 110.33],
      [-7.82, 110.33],
    ] as [number, number][],
  },
  {
    id: "tr4", name: "Semarang → Solo",
    waypoints: [
      [-6.966, 110.416],
      [-7.3, 110.62],
      [-7.57, 110.82],
    ] as [number, number][],
  },
  {
    id: "tr5", name: "Surabaya → Malang",
    waypoints: [
      [-7.198, 112.729],
      [-7.5, 112.7],
      [-7.98, 112.63],
    ] as [number, number][],
  },
  {
    id: "tr6", name: "Balikpapan → Samarinda",
    waypoints: [
      [-1.267, 116.828],
      [-0.9, 117.0],
      [-0.5, 117.15],
    ] as [number, number][],
  },
  {
    id: "tr7", name: "Banjarmasin → Martapura",
    waypoints: [
      [-3.320, 114.590],
      [-3.38, 114.72],
      [-3.42, 114.85],
    ] as [number, number][],
  },
  {
    id: "tr8", name: "Medan → Binjai",
    waypoints: [
      [3.588, 98.673],
      [3.60, 98.57],
      [3.62, 98.47],
    ] as [number, number][],
  },
];

// Pinpoint icons for terminal types (size: [w,h])
const TERMINAL_CONFIG: Record<string, { color: string; size: number; iconUrl?: string; pinSize: [number, number] }> = {
  Kilang:   { color: "#f97316", size: 10, iconUrl: "/kilangiconpinpoint.png",   pinSize: [40, 52]  },
  Terminal: { color: "#14b8a6", size: 11, iconUrl: "/terminaliconpinpoint.png", pinSize: [46, 58]  },
  Storage:  { color: "#8b5cf6", size: 9,  iconUrl: "/storageiconpinpoint.png",  pinSize: [40, 52]  },
  SPBU:     { color: "#22c55e", size: 7,  iconUrl: "/spbuiconpinpoint.png",     pinSize: [32, 42]  },
  Upstream: { color: "#3b82f6", size: 9,  iconUrl: "/upstreamiconpinpoint.png", pinSize: [46, 58]  },
};

interface LogisticsMapProps {
  activeFilter: RouteFilter;
  mapType?: "satellite" | "street";
  height?: string;
}

export default function LogisticsMap({
  activeFilter,
  mapType = "street",
  height = "100%",
}: LogisticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const tileRef      = useRef<import("leaflet").TileLayer | null>(null);
  const layerGroups  = useRef<{
    pipeline: import("leaflet").LayerGroup | null;
    vessel:   import("leaflet").LayerGroup | null;
    truck:    import("leaflet").LayerGroup | null;
    terminals: import("leaflet").LayerGroup | null;
    live:      import("leaflet").LayerGroup | null;
  }>({ pipeline: null, vessel: null, truck: null, terminals: null, live: null });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const filterRef = useRef(activeFilter);
  filterRef.current = activeFilter;

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (mapRef.current) setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, [isFullscreen]);

  // Init map
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

      const map = L.map(containerRef.current, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const satUrl    = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      tileRef.current = L.tileLayer(mapType === "satellite" ? satUrl : streetUrl, { maxZoom: 18, opacity: 0.9 }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Custom styles
      const style = document.createElement("style");
      style.textContent = `
        .logis-tooltip {
          background: rgba(10,15,25,.94) !important;
          border: 1px solid rgba(255,255,255,.15) !important;
          color: #fff !important;
          border-radius: 6px !important;
          padding: 3px 8px !important;
          font-size: 10px !important;
          font-family: Inter, sans-serif !important;
          box-shadow: 0 3px 10px rgba(0,0,0,.45) !important;
        }
        .logis-tooltip::before { display: none !important; }
        .logis-popup .leaflet-popup-content-wrapper {
          background: transparent !important; border: none !important;
          box-shadow: 0 8px 32px rgba(0,0,0,.55) !important;
          padding: 0 !important; border-radius: 10px !important; overflow: hidden !important;
        }
        .logis-popup .leaflet-popup-content { margin: 0 !important; }
        .logis-popup .leaflet-popup-tip-container { display: none !important; }
        .logis-popup .leaflet-popup-close-button { color: rgba(255,255,255,.7) !important; font-size: 16px !important; right: 8px !important; top: 8px !important; }
      `;
      document.head.appendChild(style);

      // ── Create layer groups ─────────────────────────────────────────────────
      const pipelineGroup  = L.layerGroup().addTo(map);
      const vesselGroup    = L.layerGroup().addTo(map);
      const truckGroup     = L.layerGroup().addTo(map);
      const terminalGroup  = L.layerGroup().addTo(map);
      const liveFleetGroup = L.layerGroup().addTo(map);

      layerGroups.current = {
        pipeline:  pipelineGroup,
        vessel:    vesselGroup,
        truck:     truckGroup,
        terminals: terminalGroup,
        live:      liveFleetGroup,
      };

      // ── Pipeline routes ──────────────────────────────────────────────────────
      PIPELINE_ROUTES.forEach((r) => {
        const color = r.alert ? "#ef4444" : "#f59e0b";
        // Solid base
        L.polyline([r.from, r.to], {
          color: color,
          weight: 7,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(pipelineGroup);
        // Glow overlay
        L.polyline([r.from, r.to], {
          color: r.alert ? "#fca5a5" : "#fde68a",
          weight: 3,
          opacity: 0.6,
        }).addTo(pipelineGroup);

        // Alert label
        if (r.alert) {
          const midLat = (r.from[0] + r.to[0]) / 2;
          const midLng = (r.from[1] + r.to[1]) / 2;
          const alertIcon = L.divIcon({
            className: "",
            html: `<div style="
              display:inline-flex;align-items:center;gap:4px;
              background:#dc2626;color:#fff;
              font-family:Inter,system-ui,sans-serif;font-size:10px;font-weight:700;
              padding:4px 10px 4px 8px;border-radius:20px;
              box-shadow:0 3px 10px rgba(220,38,38,.55);
              white-space:nowrap;cursor:default;
              border:1.5px solid rgba(255,255,255,.3);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 20h20L12 2z" fill="rgba(255,255,255,.25)" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="17.5" r="1.2" fill="white"/>
              </svg>
              Pipeline Alert
            </div>`,
            iconSize: [130, 24],
            iconAnchor: [65, 12],
          });
          L.marker([midLat, midLng], { icon: alertIcon, interactive: false, zIndexOffset: 500 }).addTo(pipelineGroup);
        }

        // Route label badge
        const labelIcon = L.divIcon({
          className: "",
          html: `<div style="
            background: rgba(10,15,25,0.85);
            color: #f59e0b;
            font-family: Inter, sans-serif;
            font-size: 8.5px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(245,158,11,0.4);
            white-space: nowrap;
          ">📍 ${r.name}</div>`,
          iconSize: [r.name.length * 5.5 + 40, 20],
          iconAnchor: [(r.name.length * 5.5 + 40) / 2, 10],
        });
        const midLat = (r.from[0] * 0.35 + r.to[0] * 0.65);
        const midLng = (r.from[1] * 0.35 + r.to[1] * 0.65);
        L.marker([midLat, midLng], { icon: labelIcon, interactive: false }).addTo(pipelineGroup);

        // End dots
        [r.from, r.to].forEach((pt) => {
          L.circleMarker(pt, {
            radius: 6, color: "#fff", weight: 2,
            fillColor: r.alert ? "#ef4444" : "#f59e0b", fillOpacity: 1,
          }).addTo(pipelineGroup);
        });
      });

      // ── Vessel sea routes ────────────────────────────────────────────────────
      VESSEL_ROUTES.forEach((r) => {
        // Thick sea route
        L.polyline(r.waypoints, {
          color: "#3b82f6",
          weight: 6,
          opacity: 0.75,
          dashArray: "14 7",
          lineCap: "round",
        }).addTo(vesselGroup);
        // Glow
        L.polyline(r.waypoints, {
          color: "#93c5fd",
          weight: 2.5,
          opacity: 0.5,
          dashArray: "14 7",
        }).addTo(vesselGroup);
        // End-point dots
        const first = r.waypoints[0];
        const last  = r.waypoints[r.waypoints.length - 1];
        L.circleMarker(first, {
          radius: 5, color: "#fff", weight: 2,
          fillColor: "#3b82f6", fillOpacity: 1,
        }).bindTooltip(r.name.split("→")[0].trim(), { direction: "top", offset: [0, -6], className: "logis-tooltip" }).addTo(vesselGroup);
        L.circleMarker(last, {
          radius: 5, color: "#fff", weight: 2,
          fillColor: "#60a5fa", fillOpacity: 1,
        }).addTo(vesselGroup);
      });

      // ── Truck land routes ────────────────────────────────────────────────────
      TRUCK_ROUTES.forEach((r) => {
        L.polyline(r.waypoints, {
          color: "#e63946",
          weight: 5,
          opacity: 0.75,
          dashArray: "8 5",
          lineCap: "round",
        }).addTo(truckGroup);
        // Glow
        L.polyline(r.waypoints, {
          color: "#fca5a5",
          weight: 2,
          opacity: 0.4,
          dashArray: "8 5",
        }).addTo(truckGroup);
        // End dots
        const first = r.waypoints[0];
        const last  = r.waypoints[r.waypoints.length - 1];
        L.circleMarker(first, { radius: 4, color: "#fff", weight: 2, fillColor: "#dc2626", fillOpacity: 1 }).addTo(truckGroup);
        L.circleMarker(last,  { radius: 4, color: "#fff", weight: 2, fillColor: "#22c55e", fillOpacity: 1 })
          .bindTooltip(r.name.split("→")[1]?.trim() ?? r.name, { direction: "top", offset: [0, -6], className: "logis-tooltip" })
          .addTo(truckGroup);
      });

      // ── Terminal markers ─────────────────────────────────────────────────────
      TERMINALS.forEach((t) => {
        const cfg    = TERMINAL_CONFIG[t.type] ?? { color: "#64748b", size: 8, pinSize: [32, 42] as [number,number] };
        const [pw, ph] = cfg.pinSize ?? [36, 46];

        const icon = cfg.iconUrl
          ? L.icon({
              iconUrl:     cfg.iconUrl,
              iconSize:    [pw, ph],
              iconAnchor:  [pw / 2, ph],
              popupAnchor: [0, -ph],
            })
          : L.divIcon({
              className: "",
              html: `<div style="width:${pw}px;height:${ph}px;border-radius:6px 6px 0 0;background:${cfg.color};border:2px solid rgba(255,255,255,.9);box-shadow:0 3px 10px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;border-radius:50%;background:white;opacity:.9;"></div></div>`,
              iconSize:   [pw, ph],
              iconAnchor: [pw / 2, ph],
            });

        L.marker([t.lat, t.lng], { icon, zIndexOffset: 200 })
          .bindTooltip(`<strong style="font-size:13px">${t.name}</strong><br/><span style="color:rgba(255,255,255,0.6);font-size:11px">${t.type}</span>`, {
            direction: "top", offset: [0, -ph], className: "logis-tooltip", permanent: false,
          })
          .addTo(terminalGroup);
      });

      // ── Live fleet markers (vessels + trucks) ────────────────────────────────
      // Vessels
      vessels.forEach((v) => {
        const from    = v.routeFrom as [number, number];
        const to      = v.routeTo   as [number, number];
        const lat     = from[0] + (to[0] - from[0]) * (v.progress / 100);
        const lng     = from[1] + (to[1] - from[1]) * (v.progress / 100);
        const hasAlert = v.trackingStatus === "alert";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:36px; height:36px; position:relative; cursor:pointer;">
            ${hasAlert ? `<div style="position:absolute;top:50%;left:50%;width:50px;height:50px;margin-left:-25px;margin-top:-25px;border-radius:50%;border:2.5px solid rgba(239,68,68,0.85);animation:fleetPulse 2s ease-out infinite;"></div>` : ""}
            <img src="/kapalicon.png" style="width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,.7));"/>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([lat, lng], { icon, zIndexOffset: 300 })
          .bindTooltip(`${v.name}<br/><span style="color:rgba(255,255,255,0.6);font-size:9px">${v.port} → ${v.destPort}</span>`, {
            direction: "top", offset: [0, -16], className: "logis-tooltip",
          })
          .addTo(liveFleetGroup);
      });

      // Trucks
      trucks.forEach((t) => {
        const from = t.routeFrom as [number, number];
        const to   = t.routeTo   as [number, number];
        const lat  = from[0] + (to[0] - from[0]) * 0.5;
        const lng  = from[1] + (to[1] - from[1]) * 0.5;
        const hasAlert = t.trackingStatus === "alert";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:30px; height:30px; position:relative; cursor:pointer;">
            ${hasAlert ? `<div style="position:absolute;top:50%;left:50%;width:42px;height:42px;margin-left:-21px;margin-top:-21px;border-radius:50%;border:2.5px solid rgba(239,68,68,0.85);animation:fleetPulse 2s ease-out infinite;"></div>` : ""}
            <img src="/truckicon.png" style="width:30px;height:30px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,.7));"/>
          </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        L.marker([lat, lng], { icon, zIndexOffset: 300 })
          .bindTooltip(`${t.plateNumber}<br/><span style="color:rgba(255,255,255,0.6);font-size:11px">${t.tableRoute}</span>`, {
            direction: "top", offset: [0, -16], className: "logis-tooltip",
          })
          .addTo(liveFleetGroup);
      });

      // Add pulse animation style
      const animStyle = document.createElement("style");
      animStyle.textContent = `@keyframes fleetPulse{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.2);opacity:0}}`;
      document.head.appendChild(animStyle);

      mapRef.current = map;

      // Apply initial filter
      applyFilter(filterRef.current);
    };

    init().catch(console.error);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      layerGroups.current = { pipeline: null, vessel: null, truck: null, terminals: null, live: null };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filter helper
  const applyFilter = (filter: RouteFilter) => {
    const map = mapRef.current;
    const lg  = layerGroups.current;
    if (!map || !lg.pipeline) return;

    const showPipeline = filter === "all" || filter === "pipeline";
    const showVessel   = filter === "all" || filter === "vessel";
    const showTruck    = filter === "all" || filter === "truck";

    if (showPipeline) { if (!map.hasLayer(lg.pipeline!))  lg.pipeline!.addTo(map); }
    else { lg.pipeline?.remove(); }
    if (showVessel)   { if (!map.hasLayer(lg.vessel!))    lg.vessel!.addTo(map); }
    else { lg.vessel?.remove(); }
    if (showTruck)    { if (!map.hasLayer(lg.truck!))     lg.truck!.addTo(map); }
    else { lg.truck?.remove(); }
    // Always show terminals and live fleet
    if (lg.terminals && !map.hasLayer(lg.terminals)) lg.terminals.addTo(map);
    if (lg.live && !map.hasLayer(lg.live))           lg.live.addTo(map);
  };

  useEffect(() => {
    applyFilter(activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // Switch tile layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    const { default: L } = require("leaflet");
    tileRef.current.remove();
    const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const satUrl    = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    tileRef.current = L.tileLayer(mapType === "satellite" ? satUrl : streetUrl, { maxZoom: 18, opacity: 0.9 }).addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapType]);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
        style={{
          position: "absolute", top: 10, left: 10, zIndex: 1000,
          background: "rgba(255,255,255,0.92)", border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 8, width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", backdropFilter: "blur(4px)",
        }}
      >
        {isFullscreen ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e2d4d" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
          </svg>
        )}
      </button>

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 40, right: 10, zIndex: 400,
        background: "rgba(255,255,255,0.95)", borderRadius: 10,
        padding: "8px 12px", boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.5)",
      }}>
        <p style={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Legend</p>
        {[
          { color: "#f59e0b", label: "Pipeline", dash: false },
          { color: "#3b82f6", label: "Vessel Route", dash: true },
          { color: "#e63946", label: "Truck Route", dash: true },
          { color: "#ef4444", label: "Alert Route", dash: false },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{
              width: 24, height: 3, flexShrink: 0,
              background: l.dash
                ? `repeating-linear-gradient(90deg, ${l.color} 0, ${l.color} 6px, transparent 6px, transparent 10px)`
                : l.color,
              borderRadius: 2,
            }} />
            <span style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 4, paddingTop: 4 }}>
          {[
            { color: "#14b8a6", label: "Terminal" },
            { color: "#f97316", label: "Kilang" },
            { color: "#8b5cf6", label: "Storage" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, border: "1.5px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
