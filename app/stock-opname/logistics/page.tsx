"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Truck, Activity, AlertTriangle, Gauge, Radio, Video,
  Ship, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, ChevronRight, Sparkles,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const statCards = [
  { label: "Armada Aktif", value: "450", sub: "unit aktif", change: "+2 dari kemarin", positive: true, icon: Truck, color: "blue" },
  { label: "On-Time Rate", value: "95.2%", sub: "In Target", change: "↑ In Target Del.", positive: true, icon: Activity, color: "emerald" },
  { label: "Anomalies", value: "8", sub: "Aktif indikasi", change: "Perlu tindakan", positive: false, icon: AlertTriangle, color: "red" },
  { label: "Avg. Pressure", value: "78 Bar", sub: "All Pump", change: "±0.5% dari normal", positive: true, icon: Gauge, color: "purple" },
  { label: "Delay Rate", value: "0.5%", sub: "On Target", change: "−0.2% vs kemarin", positive: true, icon: TrendingDown, color: "amber" },
  { label: "Vessel Transit", value: "3", sub: "in pelabuhan / transit", change: "1 tiba hari ini", positive: true, icon: Ship, color: "teal" },
];

// All logistics assets on the map — trucks, vessels, pipeline stations
const logisticsLocations = [
  // Trucks (active)
  { id: 1, name: "T-461 — Jakarta Utara", status: "Active", lat: -6.11, lng: 106.87 },
  { id: 2, name: "T-462 — Semarang", status: "Active", lat: -6.97, lng: 110.42 },
  { id: 3, name: "T-442 — Surabaya", status: "Maintenance", lat: -7.25, lng: 112.75 },
  { id: 4, name: "T-443 — Bandung", status: "Active", lat: -6.92, lng: 107.60 },
  { id: 5, name: "T-471 — Medan", status: "Active", lat: 3.58, lng: 98.67 },
  { id: 6, name: "T-482 — Makassar", status: "Active", lat: -5.13, lng: 119.43 },
  { id: 7, name: "T-501 — Pekanbaru", status: "Active", lat: 0.51, lng: 101.44 },
  { id: 8, name: "T-512 — Palembang", status: "Active", lat: -2.92, lng: 104.75 },
  // Vessels
  { id: 9, name: "V-443 MT Petra 1 — Selat Malaka", status: "Active", lat: 2.0, lng: 102.5 },
  { id: 10, name: "V-492 MT Petra 2 — Laut Jawa", status: "Active", lat: -5.0, lng: 110.5 },
  { id: 11, name: "V-551 MT Rinjani — Selat Makassar", status: "Active", lat: -2.0, lng: 118.0 },
  // Pipeline stations
  { id: 12, name: "P-483 Pipeline A — Cilacap", status: "Active", lat: -7.73, lng: 109.00 },
  { id: 13, name: "P-562 Pipeline B — Balongan", status: "Maintenance", lat: -6.46, lng: 108.34 },
  { id: 14, name: "P-601 Pipeline C — Dumai", status: "Active", lat: 1.67, lng: 101.43 },
  { id: 15, name: "P-720 Pipeline D — Plaju", status: "Active", lat: -2.97, lng: 104.76 },
  { id: 16, name: "P-831 Pipeline E — Balikpapan", status: "Active", lat: -1.27, lng: 116.83 },
];

const truckFeeds = [
  { id: 1, label: "T-461 — En Route Plumpang", live: true, status: "On-Route" },
  { id: 2, label: "T-442 — Loading Surabaya", live: true, status: "Loading" },
];

const vesselFeeds = [
  { id: 1, label: "MT Petra 1 — Selat Malaka", live: true },
];

const vesselCargo = [
  { product: "Pertalite", volume: "120,000 KL", dest: "Jakarta" },
  { product: "Solar", volume: "200,000 KL", dest: "Surabaya" },
  { product: "Pertamax", volume: "75 Bar", dest: "Cilacap" },
  { product: "Pertamina", volume: "10 Tkm", dest: "Zones A" },
  { product: "Lokal 4", volume: "— 0 kira", dest: "Offtns" },
];

const routeCompliance = [
  { label: "23 Okt", val: 88 }, { label: "24 Okt", val: 91 }, { label: "25 Okt", val: 85 },
  { label: "26 Okt", val: 94 }, { label: "27 Okt", val: 92 }, { label: "28 Okt", val: 96 },
  { label: "29 Okt", val: 90 }, { label: "1 Nov", val: 93 }, { label: "2 Nov", val: 95 },
];

const dispatchTable = [
  { label: "Dispatched", volume: "500,100 KL", delivered: "888,921 KL", color: "text-emerald-600" },
  { label: "In-Transit", volume: "150,500 KL", delivered: "226,800 KL", color: "text-blue-600" },
  { label: "In-Transit 2", volume: "413,500 KL", delivered: "226,800 KL", color: "text-blue-600" },
  { label: "Total", volume: "495,000 KL", delivered: "425,200 KL", color: "text-slate-800" },
];

const pipelinePressure = [
  { time: "06:00", bar: 72 }, { time: "08:00", bar: 76 }, { time: "10:00", bar: 79 },
  { time: "12:00", bar: 81 }, { time: "14:00", bar: 78 }, { time: "16:00", bar: 80 },
  { time: "18:00", bar: 82 }, { time: "20:00", bar: 77 }, { time: "22:00", bar: 75 },
];

const pipelineAlerts = [
  { id: "P-483", pressure: "82 Bar", status: "Normal" },
  { id: "P-562", pressure: "102 Bar", status: "Alert" },
];

const activeFleet = [
  { id: "T-461", type: "Truck", vehicle: "B 8531 FG", route: "Plaju → Plumpang", status: "On-Route", vol: "52 KL", eta: "1d 7ms" },
  { id: "T-462", type: "Truck", vehicle: "D 8820 SR", route: "Surabaya → Slirang", status: "On-Route", vol: "28 KL", eta: "5 Jam" },
  { id: "T-442", type: "Truck", vehicle: "L 4421 PB", route: "Tambang · 3 Hari", status: "Alert", vol: "34 KL", eta: "—" },
  { id: "V-443", type: "Vessel", vehicle: "MT Petra 1", route: "Tanjut → Jakarta", status: "In-Transit", vol: "100 KL", eta: "25 Jm" },
  { id: "V-492", type: "Vessel", vehicle: "MT Petra 2", route: "Taktaban → Makane", status: "In-Transit", vol: "350 KL", eta: "61 Jm" },
  { id: "P-483", type: "Pipeline", vehicle: "Pipeline A", route: "Di-run · Aktif", status: "Normal", vol: "78 Bar", eta: "—" },
  { id: "P-562", type: "Pipeline", vehicle: "Pipeline B", route: "Balongan", status: "Alert", vol: "102 Bar", eta: "—" },
];

const maxPressure = Math.max(...pipelinePressure.map((d) => d.bar));
const minPressure = Math.min(...pipelinePressure.map((d) => d.bar));
const maxCompliance = Math.max(...routeCompliance.map((d) => d.val));

const typeColor: Record<string, string> = {
  Truck: "bg-blue-100 text-blue-600",
  Vessel: "bg-purple-100 text-purple-600",
  Pipeline: "bg-emerald-100 text-emerald-600",
};

const statusColor: Record<string, string> = {
  "On-Route": "bg-emerald-100 text-emerald-600",
  "In-Transit": "bg-blue-100 text-blue-600",
  "Alert": "bg-red-100 text-red-500",
  "Normal": "bg-emerald-100 text-emerald-600",
  "Loading": "bg-amber-100 text-amber-600",
};

const iconColor: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500", purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600", teal: "bg-teal-50 text-teal-600",
};

export default function LogisticsPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"All" | "Truck" | "Pipeline">("All");

  return (
    <DashboardLayout title="Controlling Distribusi" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Logistics Control — Controlling Distribusi</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Real-time pipeline, truck, and vessel monitoring BBC · Diperbarui: 14:52 WIB
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Truck", "Pipeline"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeFilter === f ? "bg-[#1e2d4d] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f === "Truck" ? "🚚 " : f === "Pipeline" ? "⛽ " : ""}{f}
              </button>
            ))}
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg ml-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live Feed
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 flex flex-col gap-1.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor[card.color]}`}>
                <card.icon size={15} />
              </div>
              <p className="text-base font-bold text-slate-800 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-400">{card.label}</p>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
              <p className={`text-[10px] font-semibold ${card.positive ? "text-emerald-600" : "text-red-500"}`}>{card.change}</p>
            </div>
          ))}
        </div>

        {/* Main 3-col: Truck GPS | Map | Vessel */}
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
          {/* Truck GPS & Fleet Status */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Truck GPS &amp; Fleet Status</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time lokasi · {truckFeeds.length} feed aktif</p>
            </div>
            <div className="p-3 space-y-2">
              {truckFeeds.map((feed) => (
                <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-800 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <Video size={18} className="text-slate-500 mx-auto mb-1" />
                      <p className="text-[9px] text-slate-400 px-2 leading-tight">{feed.label}</p>
                    </div>
                  </div>
                  {feed.live && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
                    </div>
                  )}
                  <span className={`absolute top-1.5 right-1.5 text-[8px] font-semibold px-1.5 py-0.5 rounded ${feed.status === "On-Route" ? "bg-emerald-500/80 text-white" : "bg-amber-500/80 text-white"}`}>
                    {feed.status}
                  </span>
                  <div className="absolute bottom-1 right-1.5 text-[8px] text-white/40">14:52 WIB</div>
                </div>
              ))}
            </div>
            {/* Route Compliance chart */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-700">Route Compliance</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">+2.1% MoM</span>
              </div>
              <div className="relative h-20">
                <svg className="w-full h-full" viewBox={`0 0 ${routeCompliance.length * 40} 60`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#rcGrad)" points={[
                    `${0 * 40 + 20},60`,
                    ...routeCompliance.map((d, i) => `${i * 40 + 20},${60 - ((d.val - 80) / (maxCompliance - 80)) * 50}`),
                    `${(routeCompliance.length - 1) * 40 + 20},60`,
                  ].join(" ")} />
                  <polyline fill="none" stroke="#0891b2" strokeWidth="2"
                    points={routeCompliance.map((d, i) => `${i * 40 + 20},${60 - ((d.val - 80) / (maxCompliance - 80)) * 50}`).join(" ")} />
                  {routeCompliance.map((d, i) => (
                    <circle key={i} cx={i * 40 + 20} cy={60 - ((d.val - 80) / (maxCompliance - 80)) * 50} r="3" fill="#0891b2" />
                  ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                  {routeCompliance.filter((_, i) => i % 3 === 0).map((d) => (
                    <span key={d.label} className="text-[7px] text-slate-400">{d.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Map */}
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Logistics Map — Indonesia</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" />Truck</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full" />Vessel</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Pipeline</span>
                <span className="text-slate-400 ml-1">{logisticsLocations.length} unit</span>
              </div>
            </div>
            <LocationMap
              locations={logisticsLocations.map((l) => ({ id: l.id, lat: l.lat, lng: l.lng, label: l.name, status: l.status }))}
              selectedId={selectedId}
              height="328px"
            />
          </div>

          {/* Vessel & Pipeline */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ship size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Vessel &amp; Pipeline</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                <Radio size={10} className="animate-pulse" />LIVE
              </span>
            </div>
            <div className="p-3">
              {vesselFeeds.map((feed) => (
                <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-800 h-28 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <Ship size={22} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-[9px] text-slate-300 px-2 leading-tight">{feed.label}</p>
                    </div>
                  </div>
                  {feed.live && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1.5 text-[8px] text-white/40">14:52 WIB</div>
                </div>
              ))}
              <div className="space-y-1">
                {vesselCargo.map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-[10px] text-slate-500 w-20 truncate">{row.product}</span>
                    <span className="text-[10px] font-bold text-slate-800">{row.volume}</span>
                    <span className="text-[9px] text-slate-400">{row.dest}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch table + Pipeline Pressure + Pipeline Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Dispatch vs Delivery */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Dispatch vs Delivery Volume</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-500">
                    <th className="px-4 py-2.5 text-left font-semibold">Label</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Volume</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchTable.map((row, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 text-[11px] text-slate-600">{row.label}</td>
                      <td className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-700">{row.volume}</td>
                      <td className={`px-4 py-2.5 text-right text-[11px] font-bold ${row.color}`}>{row.delivered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pipeline Pressure chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Gauge size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Pipeline Pressure</span>
              </div>
              <span className="text-[10px] text-red-500 bg-red-50 font-semibold px-2 py-0.5 rounded-full">1 Alert</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Real-time Bar/Kg-f · Bali</p>
            <div className="relative h-32">
              <svg className="w-full h-full" viewBox={`0 0 ${pipelinePressure.length * 50} 80`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ppGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e2d4d" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1e2d4d" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Safe zone band */}
                <rect x="0" y={80 - ((82 - minPressure + 2) / (maxPressure - minPressure + 4)) * 75}
                  width={pipelinePressure.length * 50} height={((4) / (maxPressure - minPressure + 4)) * 75}
                  fill="rgba(16,185,129,0.08)" />
                <polygon fill="url(#ppGrad)" points={[
                  `${0 * 50 + 25},80`,
                  ...pipelinePressure.map((d, i) => `${i * 50 + 25},${80 - ((d.bar - minPressure) / (maxPressure - minPressure + 4)) * 70}`),
                  `${(pipelinePressure.length - 1) * 50 + 25},80`,
                ].join(" ")} />
                <polyline fill="none" stroke="#1e2d4d" strokeWidth="2"
                  points={pipelinePressure.map((d, i) => `${i * 50 + 25},${80 - ((d.bar - minPressure) / (maxPressure - minPressure + 4)) * 70}`).join(" ")} />
                {pipelinePressure.map((d, i) => (
                  <circle key={i} cx={i * 50 + 25} cy={80 - ((d.bar - minPressure) / (maxPressure - minPressure + 4)) * 70}
                    r="3" fill={d.bar > 80 ? "#ef4444" : "#1e2d4d"} />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                {pipelinePressure.filter((_, i) => i % 2 === 0).map((d) => (
                  <span key={d.time} className="text-[8px] text-slate-400">{d.time}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[9px] text-slate-500"><span className="w-2.5 h-0.5 bg-[#1e2d4d] inline-block" />Tekanan</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-600"><span className="w-2.5 h-2 bg-emerald-100 inline-block rounded-sm" />Zona Aman (78–82 Bar)</span>
            </div>
          </div>

          {/* Pipeline Pressure Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">Pipeline Pressure Alerts</span>
              </div>
              <span className="text-[10px] text-red-500 bg-red-50 font-semibold px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-3 space-y-2">
              {pipelineAlerts.map((alert) => (
                <div key={alert.id} className={`rounded-xl p-3 ${alert.status === "Alert" ? "bg-red-50" : "bg-emerald-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold ${alert.status === "Alert" ? "text-red-700" : "text-emerald-700"}`}>{alert.id}</span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${alert.status === "Alert" ? "bg-red-200 text-red-700" : "bg-emerald-200 text-emerald-700"}`}>{alert.status}</span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-slate-700 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-800 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{alert.pressure}</p>
                        <p className="text-[8px] text-slate-400">Tekanan saat ini</p>
                      </div>
                    </div>
                    {alert.status === "Alert" && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-bold px-1 py-0.5 rounded animate-pulse">ALERT</div>
                    )}
                  </div>
                  {alert.status === "Alert" && (
                    <div className="mt-2 rounded-lg bg-red-100/70 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={9} className="text-red-600" />
                        <span className="text-[9px] font-bold text-red-700">AI Suggestion</span>
                      </div>
                      <p className="text-[9px] text-red-600 leading-relaxed">
                        Tekanan melebihi batas aman. Kurangi aliran input segera dan koordinasikan dengan tim lapangan untuk inspeksi valve.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Fleet Monitor */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#1e2d4d]" />
              <div>
                <span className="text-sm font-semibold text-slate-800">Active Fleet Monitor</span>
                <p className="text-[10px] text-slate-400">Real-time · Truck · Vessel · Pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">Autorefresh</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500">
                  <th className="px-4 py-2.5 text-left font-semibold">ID</th>
                  <th className="px-4 py-2.5 text-left font-semibold">TIPE</th>
                  <th className="px-4 py-2.5 text-left font-semibold">KENDARAAN</th>
                  <th className="px-4 py-2.5 text-left font-semibold">RUTE / STATUS</th>
                  <th className="px-4 py-2.5 text-left font-semibold">STATUS</th>
                  <th className="px-4 py-2.5 text-right font-semibold">VOLUME</th>
                  <th className="px-4 py-2.5 text-right font-semibold">ETA</th>
                </tr>
              </thead>
              <tbody>
                {activeFleet.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      const loc = logisticsLocations.find((l) => l.name.startsWith(row.id));
                      if (loc) setSelectedId(loc.id);
                    }}
                    className="border-t border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5 text-[11px] font-bold text-[#1e2d4d]">{row.id}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${typeColor[row.type]}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-semibold text-slate-800">{row.vehicle}</td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500">{row.route}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusColor[row.status] ?? "bg-slate-100 text-slate-500"}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-[11px] font-bold text-slate-700">{row.vol}</td>
                    <td className="px-4 py-2.5 text-right text-[11px] text-slate-400">{row.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reconciliation Engine */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChevronRight size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Reconciliation Engine</span>
            </div>
            <span className="text-[10px] text-slate-400">Saat ini · 14:52 WIB</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-x divide-slate-100">
            {[
              { label: "Dispatched Volume", value: "500,000 KL", change: "↑ Increase", positive: true },
              { label: "In-Transit Volume", value: "200,000 KL", change: "✓ Progress", positive: true },
              { label: "Received Volume", value: "495,000 KL", change: "↑ Increase", positive: true },
            ].map((item) => (
              <div key={item.label} className="pl-6 first:pl-0">
                <p className="text-[11px] text-slate-400 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {item.positive ? <ArrowUp size={11} className="text-emerald-500" /> : <ArrowDown size={11} className="text-red-500" />}
                  <span className={`text-[10px] font-semibold ${item.positive ? "text-emerald-600" : "text-red-500"}`}>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
