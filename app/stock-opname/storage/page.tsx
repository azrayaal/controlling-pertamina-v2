"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import {
  Database,
  MapPin,
  Wrench,
  Percent,
  LayoutGrid,
  Video,
  ArrowDown,
  ArrowUp,
  Radio,
  TrendingUp,
} from "lucide-react";

const statCards = [
  {
    label: "Total Kapasitas",
    value: "233.1",
    unit: "Jt KL",
    icon: Database,
    color: "blue",
  },
  {
    label: "Lokasi",
    value: "14",
    sub: "1 Tk",
    icon: MapPin,
    color: "emerald",
  },
  {
    label: "Maintenance",
    value: "1",
    unit: "Lokasi",
    icon: Wrench,
    color: "amber",
  },
  {
    label: "Vol. off Plafon",
    value: "75%",
    unit: "Terisi",
    icon: Percent,
    color: "purple",
  },
  {
    label: "Terminal / Depot",
    value: "12/3",
    icon: LayoutGrid,
    color: "slate",
  },
];

const terminals = [
  { id: 1, name: "Terminal Plumpang", region: "Jakarta Utara", status: "Active", capacity: 6.0, util: 92 },
  { id: 2, name: "Tg. Gerem", region: "Cilegon, Banten", status: "Active", capacity: 2.4, util: 78 },
  { id: 3, name: "Terminal Pulau Sambu", region: "Kep. Riau", status: "Active", capacity: 2.5, util: 72 },
  { id: 4, name: "Terminal Medan", region: "Belawan, Sumut", status: "Active", capacity: 1.8, util: 80 },
  { id: 5, name: "Terminal Surabaya", region: "Surabaya, Jatim", status: "Active", capacity: 1.8, util: 86 },
  { id: 6, name: "Terminal Makassar", region: "Makassar, Sulsel", status: "Active", capacity: 1.4, util: 76 },
  { id: 7, name: "Terminal Balikpapan", region: "Balikpapan, Kaltim", status: "Maintenance", capacity: 1.2, util: 0 },
];

const cctvFeeds = [
  { id: 1, label: "Tank Farm Area", live: true },
  { id: 2, label: "Truck Loading Gate 1", live: true },
  { id: 3, label: "Jetty Plumpang Area", live: true },
  { id: 4, label: "Main Entrance Gate", live: true },
  { id: 5, label: "Pump House Control", live: false },
  { id: 6, label: "Safety Intersection Area", live: true },
];

const tankLevels = [
  { id: "T-01", product: "Higrade", level: 90, capacity: 10000, status: "normal" },
  { id: "T-02", product: "Pertamax", level: 90, capacity: 8500, status: "normal" },
  { id: "T-03", product: "Pertalite", level: 83, capacity: 12000, status: "low" },
  { id: "T-04", product: "Pertamina", level: 77, capacity: 9500, status: "low" },
  { id: "T-05", product: "Solar", level: 95, capacity: 7200, status: "high" },
];

const rekonsiliasi = [
  { label: "Refinery Inflow", value: 5010, change: 0, unit: "KL" },
  { label: "Vessel Inflow", value: 6880, change: 20, unit: "KL" },
  { label: "Terminal Transfer", value: 2960, change: -8, unit: "KL" },
  { label: "Truck Loading Outflow", value: 10000, change: 22, unit: "KL" },
];

const inflowOutflowData = [
  { time: "06:00", inflow: 620, outflow: 580 },
  { time: "08:00", inflow: 750, outflow: 700 },
  { time: "10:00", inflow: 820, outflow: 790 },
  { time: "12:00", inflow: 780, outflow: 820 },
  { time: "14:00", inflow: 850, outflow: 800 },
  { time: "16:00", inflow: 730, outflow: 760 },
  { time: "18:00", inflow: 680, outflow: 710 },
  { time: "20:00", inflow: 640, outflow: 650 },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  slate: "bg-slate-100 text-slate-600",
};

const tankStatusColor: Record<string, string> = {
  normal: "bg-emerald-500",
  low: "bg-amber-400",
  high: "bg-red-500",
};

const tankStatusLabel: Record<string, string> = {
  normal: "text-emerald-600",
  low: "text-amber-600",
  high: "text-red-600",
};

export default function StoragePage() {
  const [selectedTerminal, setSelectedTerminal] = useState(terminals[0]);

  const maxInOut = Math.max(...inflowOutflowData.flatMap((d) => [d.inflow, d.outflow]));

  return (
    <DashboardLayout
      title="Stock Opname · Storage"
      subtitle="Integrated Monitoring & Control Dashboard"
    >
      <div className="space-y-4">
        {/* Top banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Storage &amp; Distribution Dashboard</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Monitoring storage &amp; terminal BBM seluruh Indonesia · 14:52 WIB
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
            <span className="text-[11px] text-slate-400">May 3, 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 flex flex-col gap-1.5"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
                <card.icon size={15} />
              </div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {card.value}
                {card.unit && (
                  <span className="text-[10px] font-medium text-slate-400 ml-1">{card.unit}</span>
                )}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">{card.label}</p>
              {"sub" in card && card.sub && (
                <p className="text-[10px] text-slate-400">{card.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Terminal picker — horizontal scroll */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Pilih Depot / Terminal</span>
            </div>
            <span className="text-[11px] text-slate-400">{terminals.length} Lokasi</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            {terminals.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTerminal(t)}
                className={`flex-shrink-0 flex flex-col gap-1 px-3 py-2.5 rounded-xl border transition-all duration-150 min-w-[120px] ${
                  selectedTerminal.id === t.id
                    ? "bg-[#1e2d4d] border-[#1e2d4d] shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className={`text-[11px] font-semibold whitespace-nowrap ${
                  selectedTerminal.id === t.id ? "text-white" : "text-slate-700"
                }`}>
                  {t.name}
                </p>
                <p className={`text-[9px] whitespace-nowrap ${
                  selectedTerminal.id === t.id ? "text-white/70" : "text-slate-400"
                }`}>
                  {t.region}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {t.util > 0 && (
                    <div className={`flex-1 h-1 rounded-full overflow-hidden ${
                      selectedTerminal.id === t.id ? "bg-white/20" : "bg-slate-200"
                    }`}>
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${t.util}%` }}
                      />
                    </div>
                  )}
                  <span className={`text-[9px] font-semibold ${
                    selectedTerminal.id === t.id ? "text-white" : "text-slate-500"
                  }`}>
                    {t.util > 0 ? `${t.util}%` : "Maintenance"}
                  </span>
                </div>
                <span className={`text-[9px] font-medium self-start px-1.5 py-0.5 rounded-full ${
                  t.status === "Active"
                    ? selectedTerminal.id === t.id
                      ? "bg-emerald-400/30 text-emerald-100"
                      : "bg-emerald-100 text-emerald-600"
                    : selectedTerminal.id === t.id
                      ? "bg-amber-400/30 text-amber-100"
                      : "bg-amber-100 text-amber-600"
                }`}>
                  {t.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom 2-col */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left */}
          <div className="space-y-4">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    {selectedTerminal.name} — Lokasi Terminal
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  selectedTerminal.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {selectedTerminal.status}
                </span>
              </div>
              <div className="relative h-44 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute border border-slate-300"
                      style={{
                        left: `${(i % 4) * 25}%`,
                        top: `${Math.floor(i / 4) * 50}%`,
                        width: "25%",
                        height: "50%",
                      }}
                    />
                  ))}
                </div>
                <div className="relative flex flex-col items-center gap-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 bg-white/90 px-2 py-0.5 rounded-md shadow-sm">
                    {selectedTerminal.name}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {[
                    { label: "Terisi", value: `${selectedTerminal.util}%` },
                    { label: "Inflow", value: "1,250 KL/h" },
                    { label: "Outflow", value: "1.60 KL/h" },
                    { label: "Est. Full", value: "7 jam" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/90 rounded-lg px-2 py-1 text-center shadow-sm">
                      <p className="text-[11px] font-bold text-slate-800">{s.value}</p>
                      <p className="text-[9px] text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inflow vs Outflow chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    Inflow vs Outflow — {selectedTerminal.name}
                  </span>
                </div>
              </div>
              <div className="relative h-36">
                <svg className="w-full h-full" viewBox={`0 0 ${inflowOutflowData.length * 60} 100`} preserveAspectRatio="none">
                  {/* Inflow area */}
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e2d4d" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#1e2d4d" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#inflowGrad)"
                    points={[
                      `${0 * 60 + 30},100`,
                      ...inflowOutflowData.map((d, i) => `${i * 60 + 30},${100 - (d.inflow / maxInOut) * 85}`),
                      `${(inflowOutflowData.length - 1) * 60 + 30},100`,
                    ].join(" ")}
                  />
                  <polyline
                    fill="none"
                    stroke="#1e2d4d"
                    strokeWidth="2"
                    points={inflowOutflowData
                      .map((d, i) => `${i * 60 + 30},${100 - (d.inflow / maxInOut) * 85}`)
                      .join(" ")}
                  />
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    points={inflowOutflowData
                      .map((d, i) => `${i * 60 + 30},${100 - (d.outflow / maxInOut) * 85}`)
                      .join(" ")}
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                  {inflowOutflowData.map((d) => (
                    <span key={d.time} className="text-[9px] text-slate-400">{d.time}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-3 h-0.5 bg-[#1e2d4d] inline-block" />
                  Inflow
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
                  Outflow
                </span>
              </div>
            </div>

            {/* Tank level */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-800">
                  Level Tangki — {selectedTerminal.name}
                </span>
                <div className="flex gap-2">
                  {[
                    { color: "bg-emerald-500", label: "Normal" },
                    { color: "bg-amber-400", label: "Low" },
                    { color: "bg-red-500", label: "High" },
                  ].map((s) => (
                    <span key={s.label} className="flex items-center gap-1 text-[9px] text-slate-500">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2.5">
                {tankLevels.map((tank) => (
                  <div key={tank.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-600 w-8">{tank.id}</span>
                    <span className={`text-[10px] font-medium w-16 ${tankStatusLabel[tank.status]}`}>
                      {tank.product}
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${tankStatusColor[tank.status]}`}
                        style={{ width: `${tank.level}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 w-8 text-right">{tank.level}%</span>
                    <span className="text-[9px] text-slate-400 w-16 text-right">
                      {((tank.capacity * tank.level) / 100).toLocaleString()} KL
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Live CCTV */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    Live CCTV — {selectedTerminal.name}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                  <Radio size={10} className="animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {cctvFeeds.map((feed) => (
                  <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-800 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <div className="text-center">
                        <Video size={20} className="text-slate-500 mx-auto mb-1" />
                        <p className="text-[9px] text-slate-400 px-2 text-center leading-tight">{feed.label}</p>
                      </div>
                    </div>
                    {feed.live && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1.5 text-[8px] text-white/60">
                      {feed.id.toString().padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekonsiliasi */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">
                  Rekonsiliasi — {selectedTerminal.name}
                </span>
              </div>
              <div className="space-y-1.5">
                {rekonsiliasi.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-[12px] text-slate-600">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-slate-800">
                        {item.value.toLocaleString()} {item.unit}
                      </span>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.change > 0
                          ? "text-emerald-600 bg-emerald-50"
                          : item.change < 0
                          ? "text-red-600 bg-red-50"
                          : "text-slate-500 bg-slate-100"
                      }`}>
                        {item.change > 0 ? (
                          <ArrowUp size={9} />
                        ) : item.change < 0 ? (
                          <ArrowDown size={9} />
                        ) : null}
                        {item.change === 0 ? "0" : Math.abs(item.change)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
