"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import {
  Droplets,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  TrendingUp,
  MapPin,
  Video,
  AlertTriangle,
  ChevronRight,
  Radio,
} from "lucide-react";

const statCards = [
  {
    label: "Total Oil Production",
    value: "1.2M",
    unit: "BOPD",
    change: "+2.1% vs preferred",
    positive: true,
    icon: Droplets,
    color: "blue",
  },
  {
    label: "Gas Production",
    value: "4.5",
    unit: "BCFD",
    change: "+0.8%",
    positive: true,
    icon: Flame,
    color: "amber",
  },
  {
    label: "Plant Availability",
    value: "98.5%",
    unit: "",
    change: "2 offline",
    positive: false,
    icon: CheckCircle2,
    color: "emerald",
  },
  {
    label: "Pressure Integrity",
    value: "Normal",
    unit: "",
    change: "All Zones OK",
    positive: true,
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    label: "Active Weeks",
    value: "10",
    unit: "",
    change: "112 Total",
    positive: true,
    icon: Calendar,
    color: "purple",
  },
  {
    label: "Production vs Deviation",
    value: "+2.1%",
    unit: "",
    change: "Above Target",
    positive: true,
    icon: TrendingUp,
    color: "emerald",
  },
];

const upstreamBlocks = [
  {
    id: 1,
    name: "Blok Rokan",
    region: "Riau, Sumatera",
    type: "Onshore",
    rate: 165000,
    status: "Active",
  },
  {
    id: 2,
    name: "Blok Cepu",
    region: "Jawa Tengah",
    type: "Onshore",
    rate: 25000,
    status: "Active",
  },
  {
    id: 3,
    name: "Blok Mahakam",
    region: "Kalimantan",
    type: "Onshore",
    rate: 18000,
    status: "Active",
  },
  {
    id: 4,
    name: "Blok ONBES",
    region: "Sumatera Selatan",
    type: "Offshore",
    rate: 22000,
    status: "Active",
  },
  {
    id: 5,
    name: "Blok WMO",
    region: "Jawa Timur",
    type: "Offshore",
    rate: 15000,
    status: "Active",
  },
  {
    id: 6,
    name: "Blok Corridor",
    region: "Sumatera Selatan",
    type: "Onshore",
    rate: 12000,
    status: "Maintenance",
  },
];

const cctvFeeds = [
  { id: 1, label: "Pump Area — WMG-01A", live: true },
  { id: 2, label: "Pipeline Junction B-5", live: true },
  { id: 3, label: "Wellhead Gate C", live: false },
  { id: 4, label: "Security Gate North", live: true },
  { id: 5, label: "Storage Tank D-12", live: false },
  { id: 6, label: "Flare Stack Monitor", live: true },
];

const anomalies = [
  {
    type: "warning",
    title: "Pressure Drop",
    detail: "Blok Rokan, Well A-12 (13%)",
  },
  {
    type: "alert",
    title: "Flaring Anomaly",
    detail: "Upstream C — above +44%",
  },
  {
    type: "info",
    title: "Production Deviation",
    detail: "+2.1% above target",
  },
];

const wellPerformance = [
  { id: "Well A-11", rate: 1.20, pip: 2366, temp: 36.5, status: "Normal" },
  { id: "Well A-12", rate: 1.50, pip: 2366, temp: 36.5, status: "Warning" },
  { id: "Well A-13", rate: 4.18, pip: 2000, temp: 30.1, status: "Normal" },
  { id: "Well A-14", rate: 0.25, pip: 2366, temp: 34.9, status: "Normal" },
  { id: "Well B-01", rate: 2.80, pip: 2100, temp: 35.2, status: "Normal" },
];

const targetActualData = [
  { time: "06:00", target: 70, actual: 68 },
  { time: "08:00", target: 72, actual: 73 },
  { time: "10:00", target: 74, actual: 72 },
  { time: "12:00", target: 74, actual: 76 },
  { time: "14:00", target: 75, actual: 77 },
  { time: "16:00", target: 75, actual: 75 },
  { time: "18:00", target: 74, actual: 74 },
  { time: "20:00", target: 73, actual: 72 },
];

type FilterType = "All" | "Active" | "Maintenance" | "Offshore" | "Onshore";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function ProductionPage() {
  const [selectedBlock, setSelectedBlock] = useState(upstreamBlocks[0]);
  const [filter, setFilter] = useState<FilterType>("All");

  const filters: FilterType[] = ["All", "Active", "Maintenance", "Offshore", "Onshore"];

  const filteredBlocks = upstreamBlocks.filter((b) => {
    if (filter === "All") return true;
    if (filter === "Active" || filter === "Maintenance") return b.status === filter;
    return b.type === filter;
  });

  const maxTarget = Math.max(...targetActualData.map((d) => Math.max(d.target, d.actual)));

  return (
    <DashboardLayout
      title="Stock Opname · Production"
      subtitle="Integrated Monitoring & Control Dashboard"
    >
      <div className="space-y-4">
        {/* Top banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Upstream Production Dashboard</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Real-time upstream monitoring · Updated 14:52 WIB
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Feed
            </span>
            <span className="text-[11px] text-slate-400">May 3, 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
              <p className={`text-[10px] font-medium ${card.positive ? "text-emerald-600" : "text-red-500"}`}>
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Location picker */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Pilih Lokasi Upstream</span>
            </div>
            <span className="text-[11px] text-slate-400">{filteredBlocks.length}/{upstreamBlocks.length} Blok</span>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Cari nama blok atau wilayah..."
              className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 pl-8 focus:outline-none focus:border-[#1e2d4d] text-slate-600"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                  filter === f
                    ? "bg-[#1e2d4d] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {filteredBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 ${
                  selectedBlock.id === block.id
                    ? "bg-[#1e2d4d] text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    selectedBlock.id === block.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {block.id}
                  </div>
                  <div className="text-left">
                    <p className={`text-[12px] font-semibold ${selectedBlock.id === block.id ? "text-white" : "text-slate-800"}`}>
                      {block.name}
                    </p>
                    <p className={`text-[10px] ${selectedBlock.id === block.id ? "text-white/70" : "text-slate-400"}`}>
                      {block.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${selectedBlock.id === block.id ? "text-white" : "text-slate-700"}`}>
                    {block.rate.toLocaleString()}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    block.type === "Offshore"
                      ? selectedBlock.id === block.id
                        ? "bg-blue-400/30 text-blue-100"
                        : "bg-blue-100 text-blue-600"
                      : selectedBlock.id === block.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}>
                    {block.type}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    block.status === "Active"
                      ? selectedBlock.id === block.id
                        ? "bg-emerald-400/30 text-emerald-100"
                        : "bg-emerald-100 text-emerald-600"
                      : selectedBlock.id === block.id
                        ? "bg-amber-400/30 text-amber-100"
                        : "bg-amber-100 text-amber-600"
                  }`}>
                    {block.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom 2-col section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left col */}
          <div className="space-y-4">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    {selectedBlock.name} — Peta Lokasi
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  selectedBlock.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {selectedBlock.status}
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
                    {selectedBlock.name}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-3">
                  {[
                    { label: "Wells", value: "48" },
                    { label: "BOPD", value: selectedBlock.rate.toLocaleString() },
                    { label: "MMSCFD", value: "4.2" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/90 rounded-lg px-2 py-1 text-center shadow-sm">
                      <p className="text-[11px] font-bold text-slate-800">{s.value}</p>
                      <p className="text-[9px] text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target vs Actual chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-800">
                  Target vs Actual — {selectedBlock.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  On Target
                </span>
              </div>
              <div className="relative h-32">
                <svg className="w-full h-full" viewBox={`0 0 ${targetActualData.length * 60} 100`} preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    points={targetActualData
                      .map((d, i) => `${i * 60 + 30},${100 - (d.target / maxTarget) * 85}`)
                      .join(" ")}
                  />
                  <polyline
                    fill="none"
                    stroke="#1e2d4d"
                    strokeWidth="2"
                    points={targetActualData
                      .map((d, i) => `${i * 60 + 30},${100 - (d.actual / maxTarget) * 85}`)
                      .join(" ")}
                  />
                  {targetActualData.map((d, i) => (
                    <circle
                      key={i}
                      cx={i * 60 + 30}
                      cy={100 - (d.actual / maxTarget) * 85}
                      r="3"
                      fill="#1e2d4d"
                    />
                  ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                  {targetActualData.map((d) => (
                    <span key={d.time} className="text-[9px] text-slate-400">{d.time}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-4 h-0.5 bg-slate-300 inline-block" style={{ borderTop: "2px dashed #cbd5e1" }} />
                  Target
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-4 h-0.5 bg-[#1e2d4d] inline-block" />
                  Actual
                </span>
              </div>
            </div>

            {/* Well performance table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-800">
                  Well Performance — {selectedBlock.name}
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {wellPerformance.length} Wells
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-500">
                      <th className="px-4 py-2.5 text-left font-semibold">WELL ID</th>
                      <th className="px-4 py-2.5 text-left font-semibold">RATE</th>
                      <th className="px-4 py-2.5 text-left font-semibold">PIP</th>
                      <th className="px-4 py-2.5 text-left font-semibold">TEMP (°C)</th>
                      <th className="px-4 py-2.5 text-left font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wellPerformance.map((well) => (
                      <tr key={well.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 text-[11px] font-semibold text-slate-800">{well.id}</td>
                        <td className="px-4 py-2.5 text-[11px] font-bold text-[#1e2d4d]">{well.rate.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-[11px] text-slate-600">{well.pip.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-[11px] text-slate-600">{well.temp}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                            well.status === "Normal"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-amber-100 text-amber-600"
                          }`}>
                            {well.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-4">
            {/* Live CCTV */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    Live CCTV — {selectedBlock.name}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                  <Radio size={10} className="animate-pulse" />
                  4 LIVE
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

            {/* Anomali Terdeteksi */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">Anomali Terdeteksi</span>
              </div>
              <div className="space-y-2">
                {anomalies.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      a.type === "warning"
                        ? "bg-amber-50"
                        : a.type === "alert"
                        ? "bg-red-50"
                        : "bg-blue-50"
                    }`}
                  >
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      a.type === "warning"
                        ? "bg-amber-400"
                        : a.type === "alert"
                        ? "bg-red-400"
                        : "bg-blue-400"
                    }`} />
                    <div>
                      <p className={`text-[12px] font-semibold ${
                        a.type === "warning"
                          ? "text-amber-700"
                          : a.type === "alert"
                          ? "text-red-700"
                          : "text-blue-700"
                      }`}>
                        {a.title}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${
                        a.type === "warning"
                          ? "text-amber-600"
                          : a.type === "alert"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}>
                        {a.detail}
                      </p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-slate-300 flex-shrink-0 mt-0.5" />
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
