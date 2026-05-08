"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Droplets,
  Flame,
  CheckCircle2,
  ShieldCheck,
  BarChart2,
  TrendingUp,
  MapPin,
  Video,
  AlertTriangle,
  ChevronRight,
  Radio,
  Sparkles,
} from "lucide-react";

const statCards = [
  {
    label: "Total Oil Production",
    value: "1.2M",
    unit: "BOPD",
    change: "+2.1% vs yesterday",
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
    label: "Active Blocks",
    value: "10",
    unit: "",
    change: "12 Blok Total",
    positive: true,
    icon: BarChart2,
    color: "purple",
  },
  {
    label: "Production Deviation",
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
    lat: 0.88,
    lng: 101.38,
    wells: 144,
    tags: [
      { label: "+4 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
      { label: "+2 idle", color: "slate" },
      { label: "18 lainnya", color: "slate" },
    ],
  },
  {
    id: 2,
    name: "Blok Cepu",
    region: "Jawa Tengah",
    type: "Onshore",
    rate: 25000,
    status: "Active",
    lat: -7.15,
    lng: 111.58,
    wells: 97,
    tags: [
      { label: "+4 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
      { label: "+2 idle", color: "slate" },
      { label: "18 lainnya", color: "slate" },
    ],
  },
  {
    id: 3,
    name: "Blok Mahakam",
    region: "Kalimantan Timur",
    type: "Onshore",
    rate: 18000,
    status: "Active",
    lat: -0.30,
    lng: 117.40,
    wells: 103,
    tags: [
      { label: "+2 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
      { label: "+3 idle", color: "slate" },
    ],
  },
  {
    id: 4,
    name: "Blok OSEB",
    region: "Sumatera Selatan",
    type: "Offshore",
    rate: 22000,
    status: "Active",
    lat: -3.0,
    lng: 105.8,
    wells: 53,
    tags: [
      { label: "+4 aktif", color: "emerald" },
      { label: "+4 idle", color: "slate" },
    ],
  },
  {
    id: 5,
    name: "Blok WMO",
    region: "Jawa Timur",
    type: "Offshore",
    rate: 15000,
    status: "Active",
    lat: -6.8,
    lng: 112.52,
    wells: 32,
    tags: [
      { label: "+3 aktif", color: "emerald" },
      { label: "+2 idle", color: "slate" },
    ],
  },
  {
    id: 6,
    name: "Blok Corridor",
    region: "Sumatera Selatan",
    type: "Onshore",
    rate: 12000,
    status: "Maintenance",
    lat: -3.5,
    lng: 103.5,
    wells: 28,
    tags: [
      { label: "+2 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
    ],
  },
  {
    id: 7,
    name: "Blok Kampar",
    region: "Riau, Sumatera",
    type: "Onshore",
    rate: 9500,
    status: "Active",
    lat: 0.42,
    lng: 101.15,
    wells: 64,
    tags: [
      { label: "+3 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
      { label: "+2 idle", color: "slate" },
    ],
  },
  {
    id: 8,
    name: "Blok Siak",
    region: "Riau, Sumatera",
    type: "Onshore",
    rate: 8200,
    status: "Active",
    lat: 0.85,
    lng: 102.1,
    wells: 58,
    tags: [
      { label: "+3 aktif", color: "emerald" },
      { label: "+2 idle", color: "slate" },
    ],
  },
  {
    id: 9,
    name: "Blok Masela",
    region: "Maluku",
    type: "Offshore",
    rate: 6800,
    status: "Active",
    lat: -8.32,
    lng: 130.27,
    wells: 21,
    tags: [
      { label: "+2 aktif", color: "emerald" },
      { label: "+1 idle", color: "slate" },
    ],
  },
  {
    id: 10,
    name: "Blok Arafura",
    region: "Papua",
    type: "Offshore",
    rate: 5400,
    status: "Active",
    lat: -6.5,
    lng: 135.0,
    wells: 18,
    tags: [
      { label: "+2 aktif", color: "emerald" },
      { label: "+1 idle", color: "slate" },
    ],
  },
  {
    id: 11,
    name: "Blok Kepala Burung",
    region: "Papua Barat",
    type: "Onshore",
    rate: 4200,
    status: "Maintenance",
    lat: -1.02,
    lng: 132.55,
    wells: 15,
    tags: [
      { label: "+1 aktif", color: "emerald" },
      { label: "+1 warn", color: "amber" },
    ],
  },
  {
    id: 12,
    name: "Blok Rimau",
    region: "Sumatera Selatan",
    type: "Onshore",
    rate: 7100,
    status: "Active",
    lat: -3.8,
    lng: 104.6,
    wells: 44,
    tags: [
      { label: "+3 aktif", color: "emerald" },
      { label: "+1 idle", color: "slate" },
    ],
  },
];

const cctvFeeds = [
  { id: 1, label: "Pump Area — WMG-01A", live: true, cam: "C1" },
  { id: 2, label: "Pipeline Junction B-5", live: true, cam: "C2" },
  { id: 3, label: "Wellhead Gate C-13", live: true, cam: "C3" },
  { id: 4, label: "Security Gate North", live: false, cam: "C4" },
  { id: 5, label: "Storage Tank D-12", live: false, cam: "C5", signalLost: true },
  { id: 6, label: "Flare Stack Monitor", live: true, cam: "C6" },
];

const CCTV_VIDEOS = [
  "/cctv/cctvvid1.mp4", "/cctv/cctvid2.mp4", "/cctv/cctvid3.mp4",
  "/cctv/cctvid4.mp4",  "/cctv/cctvid5.mp4",
];

const anomalies = [
  {
    type: "warning",
    title: "Pressure Drop",
    detail: "Blok Rokan, Well A-11 (13%)",
    aiSuggestion:
      "Instalasi pompa dan perapatan jalur pipa dari WA-A.11. Rekomendasi: monitor tekanan dalam 24 jam untuk membantu mengikuti pemantauan pabuda ICPH tinggi.",
  },
  {
    type: "alert",
    title: "Flaring Anomaly",
    detail: "Upstream C — above +44%",
    aiSuggestion:
      "Kurangi injeksi gas konvension dan aktifkan flare management system. Koordinasi dengan operasion Platform C untuk menjaga kecepatan air valve.",
  },
  {
    type: "info",
    title: "Production Deviation",
    detail: "+2.1% above target",
    aiSuggestion:
      "Pertahankan kondisi operasi optimal. Manfaatkan surplus (excess) kerja mempersiapkan persyaratan buffer storage Terminal Salangan.",
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
  { time: "01 Mar", target: 128, actual: 120 },
  { time: "Mar W1", target: 130, actual: 125 },
  { time: "Mar W2", target: 132, actual: 130 },
  { time: "Mar W3", target: 131, actual: 132 },
  { time: "Apr M1", target: 133, actual: 128 },
  { time: "Apr W1", target: 134, actual: 135 },
  { time: "Apr W2", target: 135, actual: 133 },
  { time: "Mai W1", target: 136, actual: 134 },
  { time: "Mai W2", target: 135, actual: 136 },
  { time: "Mai W3", target: 134, actual: 134 },
  { time: "Mai W4", target: 135, actual: 135 },
  { time: "01 Jun", target: 136, actual: 134 },
];

const supplyDistribution = [
  { name: "RU II Dumai", pct: 40, value: "7.26 Jt BBL", secondary: "116 MBL", type: "Kilang", color: "#1e2d4d" },
  { name: "RU IV Cilacap", pct: 30, value: "5.46 Jt BBL", secondary: "MBL", type: "Kilang", color: "#2563eb" },
  { name: "Ekspor Asia", pct: 20, value: "2.61 Jt BBL", secondary: "5167 A.U.", type: "Ekspor", color: "#f59e0b" },
  { name: "Terminal Dumai", pct: 10, value: "1.57 Jt BBL", secondary: "2.9x", type: "Terminal", color: "#8b5cf6" },
];

type FilterType = "All" | "Active" | "Maintenance" | "Offshore" | "Onshore";
type PeriodType = "Hari Ini" | "7H" | "30H" | "3B";
type ChartView = "Keduanya" | "Target" | "Aktual";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
};

const tagColorMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  slate: "bg-slate-100 text-slate-500",
};

const tagColorMapSelected: Record<string, string> = {
  emerald: "bg-emerald-400/30 text-emerald-100",
  amber: "bg-amber-400/30 text-amber-100",
  slate: "bg-white/10 text-white/60",
};

export default function ProductionPage() {
  const [selectedBlock, setSelectedBlock] = useState(upstreamBlocks[0]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [period, setPeriod] = useState<PeriodType>("3B");
  const [chartView, setChartView] = useState<ChartView>("Keduanya");

  const filters: FilterType[] = ["All", "Active", "Maintenance", "Offshore", "Onshore"];
  const periods: PeriodType[] = ["Hari Ini", "7H", "30H", "3B"];

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
            <span className="text-[11px] text-slate-400">May 2, 2025</span>
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
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlock.id === block.id;
              return (
                <button
                  key={block.id}
                  onClick={() => setSelectedBlock(block)}
                  className={`w-full flex flex-col px-4 py-2.5 rounded-xl transition-all duration-150 text-left ${
                    isSelected
                      ? "bg-[#1e2d4d] text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {block.id}
                      </div>
                      <div>
                        <p className={`text-[12px] font-semibold ${isSelected ? "text-white" : "text-slate-800"}`}>
                          {block.name}
                        </p>
                        <p className={`text-[10px] ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                          {block.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>
                        {block.rate.toLocaleString()}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        block.type === "Offshore"
                          ? isSelected ? "bg-blue-400/30 text-blue-100" : "bg-blue-100 text-blue-600"
                          : isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {block.type}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        block.status === "Active"
                          ? isSelected ? "bg-emerald-400/30 text-emerald-100" : "bg-emerald-100 text-emerald-600"
                          : isSelected ? "bg-amber-400/30 text-amber-100" : "bg-amber-100 text-amber-600"
                      }`}>
                        {block.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 ml-8 flex-wrap">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                      isSelected ? "bg-white/10 text-white/60" : "bg-slate-200 text-slate-500"
                    }`}>
                      #{block.wells} sumur
                    </span>
                    {block.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          isSelected ? tagColorMapSelected[tag.color] : tagColorMap[tag.color]
                        }`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Supply Report */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Supply Report</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Flas Notice
              </span>
              <span className="text-[11px] text-slate-400">PTB and 4th, 2025</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 grid grid-cols-3 gap-3 border-r border-slate-100 pr-4">
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Total Tersedia</p>
                <p className="text-xl font-bold text-slate-800">
                  350K <span className="text-xs font-medium text-slate-400">BBL</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">0 Nomika Sipres</p>
                <p className="text-[10px] text-slate-400">1 Jan 2025</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Total Dana &lt;TY&gt;</p>
                <p className="text-xl font-bold text-emerald-600">
                  18.20 Jt <span className="text-xs font-medium text-slate-400">BBL</span>
                </p>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-0.5">
                  <TrendingUp size={9} /> 2.4% vs target
                </p>
                <p className="text-[10px] text-slate-400">PT Nomika Sipres</p>
                <p className="text-[10px] text-slate-400">1 Jan 2025</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Pengiriman Berjalan</p>
                <p className="text-xl font-bold text-[#1e2d4d]">
                  380K <span className="text-xs font-medium text-slate-400">BBL</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PT Nomika 5</p>
                <p className="text-[10px] text-slate-400">01/03/2025</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <p className="text-[10px] font-semibold text-slate-500 mb-2">Distribusi ke:</p>
              <div className="space-y-2">
                {supplyDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] text-slate-600 w-20 truncate">{item.name}</span>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 w-6 text-right">{item.pct}%</span>
                    <span className="text-[10px] text-slate-500 w-16 text-right truncate">{item.value}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                      item.type === "Kilang"
                        ? "bg-blue-50 text-blue-600"
                        : item.type === "Ekspor"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-purple-50 text-purple-600"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
              <LocationMap
                locations={upstreamBlocks.map((b) => ({
                  id: b.id,
                  lat: b.lat,
                  lng: b.lng,
                  label: b.name,
                  status: b.status,
                  category: "Upstream" as const,
                }))}
                selectedId={selectedBlock.id}
                stats={[
                  { label: "Wells", value: String(selectedBlock.wells) },
                  { label: "PSI", value: "2,450" },
                  { label: "BOPD", value: selectedBlock.rate.toLocaleString() },
                  { label: "MMSCFD", value: "4.2" },
                ]}
                height="176px"
              />
            </div>

            {/* Target vs Actual chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">
                  Target vs Actual — {selectedBlock.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  On Target
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
                  {(["Keduanya", "Target", "Aktual"] as ChartView[]).map((v) => (
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
              <div className="relative h-32">
                <svg className="w-full h-full" viewBox={`0 0 ${targetActualData.length * 50} 100`} preserveAspectRatio="none">
                  {chartView !== "Aktual" && (
                    <polyline
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      points={targetActualData
                        .map((d, i) => `${i * 50 + 25},${100 - (d.target / maxTarget) * 85}`)
                        .join(" ")}
                    />
                  )}
                  {chartView !== "Target" && (
                    <polyline
                      fill="none"
                      stroke="#1e2d4d"
                      strokeWidth="2"
                      points={targetActualData
                        .map((d, i) => `${i * 50 + 25},${100 - (d.actual / maxTarget) * 85}`)
                        .join(" ")}
                    />
                  )}
                  {chartView !== "Target" &&
                    targetActualData.map((d, i) => (
                      <circle
                        key={i}
                        cx={i * 50 + 25}
                        cy={100 - (d.actual / maxTarget) * 85}
                        r="3"
                        fill="#1e2d4d"
                      />
                    ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                  {targetActualData.map((d) => (
                    <span key={d.time} className="text-[8px] text-slate-400">{d.time}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-4 h-0.5 inline-block border-t-2 border-dashed border-slate-300" />
                  Target
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-4 h-0.5 bg-[#1e2d4d] inline-block" />
                  Aktual
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
                        <td className="px-4 py-2.5">
                          <span className="text-[11px] font-bold text-[#1e2d4d]">{well.rate.toFixed(2)}</span>
                          <span className="text-[9px] text-slate-400 ml-0.5">BOPD</span>
                        </td>
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
                  LIVE FEED
                </span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {cctvFeeds.map((feed, i) => (
                  <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-900 h-24">
                    {!feed.signalLost && (
                      <video
                        src={CCTV_VIDEOS[i % CCTV_VIDEOS.length]}
                        autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)" }} />
                    {feed.signalLost && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mb-1">
                          <AlertTriangle size={14} className="text-red-400" />
                        </div>
                        <p className="text-[8px] text-red-400 font-semibold">SIGNAL LOST</p>
                      </div>
                    )}
                    {feed.live && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    {!feed.signalLost && (
                      <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white/80 text-[7px] font-semibold truncate">{feed.label}</p>
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 text-[7px] text-white/50 font-mono">{feed.cam}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anomali Terdeteksi */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800">Anomali Terdeteksi</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  AI Active
                </span>
              </div>
              <div className="space-y-3">
                {anomalies.map((a, i) => (
                  <div
                    key={i}
                    className={`rounded-xl overflow-hidden ${
                      a.type === "warning"
                        ? "bg-amber-50"
                        : a.type === "alert"
                        ? "bg-red-50"
                        : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 p-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        a.type === "warning"
                          ? "bg-amber-400"
                          : a.type === "alert"
                          ? "bg-red-400"
                          : "bg-blue-400"
                      }`} />
                      <div className="flex-1 min-w-0">
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
                      <ChevronRight size={14} className="text-slate-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className={`mx-3 mb-3 rounded-lg p-2.5 ${
                      a.type === "warning"
                        ? "bg-amber-100/60"
                        : a.type === "alert"
                        ? "bg-red-100/60"
                        : "bg-blue-100/60"
                    }`}>
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={10} className={
                          a.type === "warning"
                            ? "text-amber-600"
                            : a.type === "alert"
                            ? "text-red-600"
                            : "text-blue-600"
                        } />
                        <span className={`text-[9px] font-bold ${
                          a.type === "warning"
                            ? "text-amber-700"
                            : a.type === "alert"
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}>
                          AI Suggestion
                        </span>
                      </div>
                      <p className={`text-[10px] leading-relaxed ${
                        a.type === "warning"
                          ? "text-amber-600"
                          : a.type === "alert"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}>
                        {a.aiSuggestion}
                      </p>
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
