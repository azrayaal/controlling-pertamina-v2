"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { logisticsKPI, dispatchVolumeData } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Ship, Camera, AlertTriangle, Activity, Truck, Layers, Filter } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const LogisticsMap = dynamic(
  () => import("@/components/dashboard/LogisticsMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-slate-400 text-xs font-medium">Loading Map…</span>
        </div>
      </div>
    ),
  }
);

type RouteFilter = "all" | "pipeline" | "truck" | "vessel";
type MapType = "satellite" | "street";

const routeComplianceData = [
  { day: "Sun", value: 88 }, { day: "Mon", value: 92 }, { day: "Tue", value: 85 },
  { day: "Wed", value: 95 }, { day: "Thu", value: 90 }, { day: "Fri", value: 93 }, { day: "Sat", value: 89 },
];

const pipelineData = [
  { t: "10:00", v: 75 }, { t: "11:00", v: 78 }, { t: "12:00", v: 82 }, { t: "13:00", v: 76 },
  { t: "14:00", v: 89 }, { t: "15:00", v: 84 }, { t: "16:00", v: 80 }, { t: "17:00", v: 83 },
];

const kpiColors: Record<string, string> = {
  green: "text-emerald-500",
  red: "text-red-500",
  white: "text-slate-800",
};

const FILTER_OPTIONS: { key: RouteFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "all",      label: "Semua",    icon: <Layers size={12} />,  color: "#1e2d4d" },
  { key: "pipeline", label: "Pipeline", icon: <Activity size={12}/>, color: "#f59e0b" },
  { key: "vessel",   label: "Kapal",    icon: <Ship size={12}/>,     color: "#3b82f6" },
  { key: "truck",    label: "Truck",    icon: <Truck size={12}/>,    color: "#e63946" },
];

// CCTV images from public/cctv/
const CCTV_IMAGES = [
  "/cctv/cctv1.png", "/cctv/cctv2.png", "/cctv/cctv3.png",
  "/cctv/cctv4.png", "/cctv/cctv5.png", "/cctv/cctv6.png",
  "/cctv/cctv7.png", "/cctv/cctv8.png", "/cctv/cctv9.png",
];

export default function LogisticsPage() {
  const [activeFilter, setActiveFilter] = useState<RouteFilter>("all");
  const [mapType, setMapType] = useState<MapType>("street");

  return (
    <DashboardLayout title="Logistics Control Dashboard" subtitle="GPS Tracking · Pipeline Routes · Vessel · Terminal Networks">
      <div className="space-y-4">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {logisticsKPI.map((k) => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
              <p className="text-[10px] text-slate-500 font-medium">{k.label}</p>
              <p className={`text-xl font-bold mt-1 ${kpiColors[k.color] ?? "text-slate-800"}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ── Truck GPS & CCTV ── */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-red-500" />
                <h3 className="text-sm font-semibold text-slate-800">Truck GPS & E-Seal Status</h3>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Live GPS · Cargo Status · CCTV Feed</p>
            </div>
            <div className="p-3">
              {/* Real CCTV images grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {CCTV_IMAGES.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden relative">
                    <Image src={src} alt={`CCTV Truck ${i + 1}`} fill style={{ objectFit: "cover" }} />
                    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-[6.5px] font-bold">LIVE</span>
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <span className="text-white/80 text-[7px] font-semibold bg-black/40 px-1 rounded">Truck Cam {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Route Compliance</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={routeComplianceData}>
                      <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[70, 100]} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-700 mb-1.5">Dispatch vs Delivery Volume</p>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="text-left pb-1">Volume</th>
                      <th className="text-right pb-1">Dispatch</th>
                      <th className="text-right pb-1">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchVolumeData.map((r, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-1 text-slate-600">{r.label}</td>
                        <td className="py-1 text-right text-slate-700 font-medium">{r.dispatch}</td>
                        <td className="py-1 text-right text-slate-700 font-medium">{r.delivery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Logistics Map (center, full Leaflet) ── */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
            {/* Map header / filter bar */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">Logistics Map</span>
                <span className="text-[10px] text-slate-400">— Indonesia</span>
              </div>
              <div className="flex-1" />
              {/* Filter pills like the reference image */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: "#f1f5f9" }}>
                {FILTER_OPTIONS.map(({ key, label, icon, color }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className="flex items-center gap-1 px-2 h-6 rounded-md text-[10px] font-semibold transition-all"
                    style={activeFilter === key
                      ? { background: color, color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }
                      : { color: "#64748b" }}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
              {/* Map type switcher */}
              <div className="flex items-center gap-0.5">
                {(["street", "satellite"] as MapType[]).map((mt) => (
                  <button
                    key={mt}
                    onClick={() => setMapType(mt)}
                    className="px-2 h-6 rounded-md text-[10px] font-semibold transition-colors"
                    style={mapType === mt
                      ? { background: "#1e293b", color: "#fff" }
                      : { color: "#94a3b8" }}
                  >
                    {mt === "street" ? "Map" : "Sat"}
                  </button>
                ))}
              </div>
              <button className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#f1f5f9" }}>
                <Filter size={11} className="text-slate-500" />
              </button>
            </div>

            {/* Map container */}
            <div className="flex-1 relative" style={{ minHeight: 340 }}>
              <LogisticsMap
                activeFilter={activeFilter}
                mapType={mapType}
                height="100%"
              />

              {/* Map title badge */}
              <div className="absolute top-3 right-3 z-[400] pointer-events-none">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-white/50">
                    <span className="text-[9px] font-bold text-slate-500">GPS Trails</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-[9px] font-bold text-amber-500">Pipeline Routes</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-[9px] font-bold text-teal-500">Depot Positions</span>
                  </div>
                  {/* Active filter indicator */}
                  {activeFilter !== "all" && (
                    <div className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold text-white"
                      style={{ background: activeFilter === "pipeline" ? "#f59e0b" : activeFilter === "vessel" ? "#3b82f6" : "#e63946" }}>
                      {activeFilter === "pipeline" ? "📍 Pipeline Route" : activeFilter === "vessel" ? "⛵ Vessel Route" : "🚛 Truck Route"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Vessel & Pipeline ── */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ship size={14} className="text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-800">Vessel & Pipeline Monitoring</h3>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AIS Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Vessel AIS · Pipeline Pressure</p>
            </div>
            <div className="p-3 space-y-3">
              {/* Vessel CCTV — real images */}
              <div className="grid grid-cols-2 gap-1.5">
                {CCTV_IMAGES.slice(5, 9).map((src, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden relative">
                    <Image src={src} alt={`CCTV Vessel ${i + 1}`} fill style={{ objectFit: "cover" }} />
                    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-[6.5px] font-bold">LIVE</span>
                    </div>
                    <div className="absolute bottom-1 left-1">
                      <span className="text-white/80 text-[7px] font-semibold bg-black/40 px-1 rounded">
                        {i === 0 ? "Bridge" : i === 1 ? "Cargo Deck" : i === 2 ? "Engine Room" : "Stern"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-slate-400">Cargo Volume</p>
                  <p className="font-bold text-slate-800">500,000 kL</p>
                  <p className="text-slate-400 mt-1">Cargo Vs:</p>
                  <p className="font-semibold text-slate-700">30,000 kL</p>
                  <p className="text-slate-400 mt-1">Depots:</p>
                  <p className="font-semibold text-slate-700">78 Bar</p>
                </div>
                <div>
                  <p className="text-slate-400">ETA</p>
                  <p className="font-bold text-slate-800">25 hrs</p>
                  <p className="text-slate-400 mt-1">Vessels Active:</p>
                  <p className="font-semibold text-slate-700">12 Unit</p>
                  <p className="text-slate-400 mt-1">Fleet Alert:</p>
                  <p className="font-semibold text-red-500">3 Unit</p>
                </div>
              </div>

              {/* Pipeline pressure chart */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold text-slate-700">Pipeline Pressure</p>
                  <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                    <AlertTriangle size={10} /> Leak Alerts
                  </span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pipelineData}>
                      <XAxis dataKey="t" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pipeline alert CCTV */}
              <div>
                <p className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <AlertTriangle size={11} className="text-red-500" /> Pipeline Pressure Alerts
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {CCTV_IMAGES.slice(0, 2).map((src, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden relative">
                      <Image src={src} alt={`Pipeline CCTV ${i + 1}`} fill style={{ objectFit: "cover" }} />
                      <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)" }} />
                      <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-amber-500/90 rounded px-1 py-0.5">
                        <AlertTriangle size={6} className="text-white" />
                        <span className="text-white text-[6px] font-bold">ALRT</span>
                      </div>
                      <div className="absolute bottom-1 left-1">
                        <span className="text-white/80 text-[7px] font-semibold bg-black/40 px-1 rounded">
                          Sector {i === 0 ? "Cikampek" : "Merak"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a href="/live-cctv" className="flex items-center justify-center gap-1.5 w-full h-8 rounded-xl bg-slate-800 text-white text-[11px] font-bold hover:bg-slate-700 transition-colors">
                <Camera size={12} /> Live CCTV Full View
              </a>
            </div>
          </div>
        </div>

        {/* Reconciliation Engine */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Reconciliation Engine</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Dispatched Volume", value: "500,000 KL", change: "Variance", changeType: "down" },
              { label: "In-Transit Volume", value: "200,000 KL", change: "Variance", changeType: "up" },
              { label: "Received Volume", value: "495,000 KL", change: "Variance", changeType: "down" },
            ].map((r) => (
              <div key={r.label} className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">{r.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{r.value}</p>
                <p className={`text-[11px] font-semibold mt-1 flex items-center justify-center gap-1 ${r.changeType === "down" ? "text-red-500" : "text-emerald-500"}`}>
                  {r.changeType === "down" ? "▼" : "▲"} {r.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
