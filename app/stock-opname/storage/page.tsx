"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Database,
  MapPin,
  Wrench,
  LayoutGrid,
  Video,
  ArrowDown,
  ArrowUp,
  Radio,
  TrendingUp,
  BarChart2,
  AlertTriangle,
} from "lucide-react";

const statCards = [
  {
    label: "Total Kapasitas",
    value: "23.1",
    unit: "Jt KL",
    icon: Database,
    color: "blue",
  },
  {
    label: "Lokasi Aktif",
    value: "14",
    sub: "/ 15",
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
    label: "Avg. Utilisasi",
    value: "75%",
    unit: "Total",
    icon: BarChart2,
    color: "purple",
  },
  {
    label: "Terminal / Depot",
    value: "12 / 3",
    unit: "Unit",
    icon: LayoutGrid,
    color: "blue",
  },
];

const terminals = [
  { id: 1, name: "Terminal Plumpang", region: "Jakarta Utara", status: "Active", type: "Terminal", capacity: 6.0, util: 55, lat: -6.115, lng: 106.882 },
  { id: 2, name: "Terminal Tg. Gerem", region: "Cilegon, Banten", status: "Active", type: "Terminal", capacity: 2.4, util: 76, lat: -5.97, lng: 106.05 },
  { id: 3, name: "Terminal Pulau Sambu", region: "Kep. Riau", status: "Active", type: "Terminal", capacity: 2.2, util: 72, lat: 1.05, lng: 103.9 },
  { id: 4, name: "Terminal Medan", region: "Sumatera Utara", status: "Active", type: "Terminal", capacity: 1.8, util: 80, lat: 3.78, lng: 98.65 },
  { id: 5, name: "Terminal Surabaya", region: "Jawa Timur", status: "Active", type: "Terminal", capacity: 1.8, util: 85, lat: -7.2, lng: 112.73 },
  { id: 6, name: "Terminal Makassar", region: "Makassar, Sulsel", status: "Active", type: "Terminal", capacity: 1.4, util: 76, lat: -5.13, lng: 119.43 },
  { id: 7, name: "Terminal Balikpapan", region: "Balikpapan, Kaltim", status: "Maintenance", type: "Terminal", capacity: 1.2, util: 0, lat: -1.27, lng: 116.83 },
  { id: 8, name: "Terminal Ambon", region: "Maluku", status: "Active", type: "Terminal", capacity: 0.8, util: 68, lat: -3.69, lng: 128.18 },
  { id: 9, name: "Terminal Pontianak", region: "Kalimantan Barat", status: "Active", type: "Terminal", capacity: 0.9, util: 71, lat: -0.03, lng: 109.33 },
  { id: 10, name: "Terminal Panjang", region: "Lampung", status: "Active", type: "Terminal", capacity: 1.1, util: 74, lat: -5.47, lng: 105.30 },
  { id: 11, name: "Depot Plumpang", region: "Jakarta Utara", status: "Active", type: "Depot", capacity: 0.9, util: 88, lat: -6.12, lng: 106.875 },
  { id: 12, name: "Depot Cikampek", region: "Karawang, Jabar", status: "Active", type: "Depot", capacity: 0.7, util: 72, lat: -6.42, lng: 107.47 },
  { id: 13, name: "Depot Bandung", region: "Bandung, Jabar", status: "Active", type: "Depot", capacity: 0.5, util: 65, lat: -6.92, lng: 107.6 },
  { id: 14, name: "Depot Manado", region: "Sulawesi Utara", status: "Active", type: "Depot", capacity: 0.4, util: 58, lat: 1.49, lng: 124.84 },
  { id: 15, name: "Depot Jayapura", region: "Papua", status: "Active", type: "Depot", capacity: 0.3, util: 61, lat: -2.53, lng: 140.71 },
];

const cctvFeeds = [
  { id: 1, label: "Tank Farm North", live: true, cam: "01" },
  { id: 2, label: "Mops Loading Gate 1", live: true, cam: "02" },
  { id: 3, label: "Jetty Plumpang View", live: true, cam: "03" },
  { id: 4, label: "Main Entrance Gate", live: true, cam: "04" },
  { id: 5, label: "Pump House Control", live: true, cam: "05" },
  { id: 6, label: "Safety Inspection Gate", live: true, cam: "06" },
];

const tankLevels = [
  { id: "T-01", product: "MOGAS", level: 92, capacity: 11250, status: "normal" },
  { id: "T-02", product: "Solar", level: 78, capacity: 8500, status: "normal" },
  { id: "T-03", product: "Pertalite", level: 85, capacity: 14190, status: "normal" },
  { id: "T-04", product: "Pertamax", level: 71, capacity: 3650, status: "low" },
];

const rekonsiliasi = [
  { label: "Refinery Inflow", before: 5009, after: 5010, change: 10, unit: "KL", alert: false },
  { label: "Vessel Inflow", before: 7000, after: 6980, change: -20, unit: "KL", alert: false },
  { label: "Terminal Transfer", before: 3003, after: 2995, change: -8, unit: "KL", alert: false },
  { label: "Truck Loading Outflow", before: 12920, after: 12920, change: 20, unit: "KL", alert: true },
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

type FilterType = "All" | "Active" | "Maintenance" | "Terminal" | "Depot";
type PeriodType = "Hari Ini" | "7H" | "30H" | "3B";
type ChartView = "Keduanya" | "Inflow" | "Outflow";

export default function StoragePage() {
  const [selectedTerminal, setSelectedTerminal] = useState(terminals[0]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [period, setPeriod] = useState<PeriodType>("Hari Ini");
  const [chartView, setChartView] = useState<ChartView>("Keduanya");

  const filters: FilterType[] = ["All", "Active", "Maintenance", "Terminal", "Depot"];
  const periods: PeriodType[] = ["Hari Ini", "7H", "30H", "3B"];

  const filteredTerminals = terminals.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Active" || filter === "Maintenance") return t.status === filter;
    return t.type === filter;
  });

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
              Monitoring depot &amp; terminal BBM seluruh Indonesia · 14:52 WIB
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
            <span className="text-[11px] text-slate-400">May 7, 2026</span>
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
                {"sub" in card && card.sub && (
                  <span className="text-sm font-medium text-slate-400 ml-0.5">{card.sub}</span>
                )}
                {"unit" in card && card.unit && (
                  <span className="text-[10px] font-medium text-slate-400 ml-1">{card.unit}</span>
                )}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Terminal / Depot picker — vertical list */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Pilih Depot / Terminal</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {filteredTerminals.length}/{terminals.length} Lokasi
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Cari nama depot/terminal atau wilayah..."
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
            {filteredTerminals.map((t) => {
              const isSelected = selectedTerminal.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTerminal(t)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 ${
                    isSelected
                      ? "bg-[#1e2d4d] text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      <Database size={12} />
                    </div>
                    <div className="text-left">
                      <p className={`text-[12px] font-semibold ${isSelected ? "text-white" : "text-slate-800"}`}>
                        {t.name}
                      </p>
                      <p className={`text-[10px] ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                        {t.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>
                      {t.capacity.toFixed(1)}M
                    </span>
                    {t.util > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-14 h-1.5 rounded-full overflow-hidden ${
                          isSelected ? "bg-white/20" : "bg-slate-200"
                        }`}>
                          <div
                            className={`h-full rounded-full ${
                              t.util >= 85 ? "bg-red-400" : t.util >= 70 ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                            style={{ width: `${t.util}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold ${isSelected ? "text-white" : "text-slate-600"}`}>
                          {t.util}%
                        </span>
                      </div>
                    )}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      t.type === "Terminal"
                        ? isSelected ? "bg-blue-400/30 text-blue-100" : "bg-blue-100 text-blue-600"
                        : isSelected ? "bg-violet-400/30 text-violet-100" : "bg-violet-100 text-violet-600"
                    }`}>
                      {t.type}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      t.status === "Active"
                        ? isSelected ? "bg-emerald-400/30 text-emerald-100" : "bg-emerald-100 text-emerald-600"
                        : isSelected ? "bg-amber-400/30 text-amber-100" : "bg-amber-100 text-amber-600"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </button>
              );
            })}
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
              <LocationMap
                locations={terminals.map((t) => ({
                  id: t.id,
                  lat: t.lat,
                  lng: t.lng,
                  label: t.name,
                  status: t.status,
                  category: (t.type === "Depot" ? "Depot" : "Storage") as import("@/components/dashboard/LocationMap").LocationCategory,
                }))}
                selectedId={selectedTerminal.id}
                stats={[
                  { label: "Terisi", value: `${selectedTerminal.util}%` },
                  { label: "Inflow", value: "1,250 KL/h" },
                  { label: "Outflow", value: "1,160 KL/h" },
                  { label: "7 jenis", value: "Produk" },
                ]}
                height="176px"
              />
            </div>

            {/* Inflow vs Outflow chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={13} className="text-[#1e2d4d]" />
                  <span className="text-sm font-semibold text-slate-800">
                    Inflow vs Outflow — {selectedTerminal.name}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  + Surplus
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${
                        period === p
                          ? "bg-slate-700 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {(["Keduanya", "Inflow", "Outflow"] as ChartView[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${
                        chartView === v
                          ? "bg-[#1e2d4d] text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative h-36">
                <svg className="w-full h-full" viewBox={`0 0 ${inflowOutflowData.length * 60} 100`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {chartView !== "Outflow" && (
                    <>
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
                        stroke="#059669"
                        strokeWidth="2"
                        points={inflowOutflowData
                          .map((d, i) => `${i * 60 + 30},${100 - (d.inflow / maxInOut) * 85}`)
                          .join(" ")}
                      />
                    </>
                  )}
                  {chartView !== "Inflow" && (
                    <polyline
                      fill="none"
                      stroke="#1e2d4d"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      points={inflowOutflowData
                        .map((d, i) => `${i * 60 + 30},${100 - (d.outflow / maxInOut) * 85}`)
                        .join(" ")}
                    />
                  )}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                  {inflowOutflowData.map((d) => (
                    <span key={d.time} className="text-[9px] text-slate-400">{d.time}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
                    Inflow 1,229 KL/h
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-3 h-0.5 inline-block border-t-2 border-dashed border-slate-400" />
                    Outflow 1,164 KL/h
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">+85 KL/h net</span>
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
                    <span className="text-[9px] text-slate-400 w-20 text-right">
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
                  <span className="text-[10px] text-slate-400">6 unit · 0 offline</span>
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
                    <div className="absolute bottom-1 right-1.5 text-[8px] text-white/50">
                      {feed.cam}
                    </div>
                    <div className="absolute bottom-1 left-2 text-[8px] text-white/40">
                      14:52 WIB
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
              <div className="mb-2 flex items-center justify-between px-3">
                <span className="text-[10px] text-slate-400 w-40">Komponen</span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-400 text-right w-16">Sebelumnya</span>
                  <span className="text-[10px] text-slate-400 text-right w-16">Sekarang</span>
                  <span className="text-[10px] text-slate-400 text-right w-10">Delta</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {rekonsiliasi.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-[11px] text-slate-600 w-40 truncate">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-slate-400 w-16 text-right">
                        {item.before.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 w-16 text-right">
                        {item.after.toLocaleString()}
                      </span>
                      <span className={`flex items-center justify-end gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded w-10 ${
                        item.alert
                          ? "text-amber-600 bg-amber-50"
                          : item.change > 0
                          ? "text-emerald-600 bg-emerald-50"
                          : item.change < 0
                          ? "text-red-600 bg-red-50"
                          : "text-slate-500 bg-slate-100"
                      }`}>
                        {item.change > 0 ? (
                          <ArrowUp size={9} />
                        ) : item.change < 0 ? (
                          <ArrowDown size={9} />
                        ) : item.alert ? (
                          <AlertTriangle size={9} />
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
