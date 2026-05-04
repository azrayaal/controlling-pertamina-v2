"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Factory,
  Activity,
  Gauge,
  Wrench,
  MapPin,
  Video,
  CheckCircle2,
  Radio,
  ChevronRight,
  Sparkles,
  HardHat,
} from "lucide-react";

const statCards = [
  {
    label: "Total Throughput",
    value: "1.05M",
    unit: "BPD",
    icon: Factory,
    color: "blue",
  },
  {
    label: "Kilang Running",
    value: "7",
    sub: "/ 10",
    icon: Activity,
    color: "emerald",
  },
  {
    label: "Rata-rata Utilisasi",
    value: "88%",
    unit: "Operational",
    icon: Gauge,
    color: "blue",
  },
  {
    label: "Maintenance",
    value: "1",
    unit: "Kilang",
    icon: Wrench,
    color: "amber",
  },
  {
    label: "Konstruksi",
    value: "1",
    unit: "RDMP",
    icon: HardHat,
    color: "purple",
  },
];

const refineries = [
  { id: 1, name: "RU II Dumai", region: "Dumai, Riau", cap: 170000, util: 84, status: "Running", lat: 1.67, lng: 101.43 },
  { id: 2, name: "RU III Plaju", region: "Palembang, Sumsel", cap: 133700, util: 91, status: "Running", lat: -2.97, lng: 104.76 },
  { id: 3, name: "RU IV Cilacap", region: "Cilacap, Jawa Tengah", cap: 348000, util: 96, status: "Running", lat: -7.73, lng: 109.00 },
  { id: 4, name: "RU V Balikpapan", region: "Balikpapan, Kaltim", cap: 260000, util: 85, status: "Running", lat: -1.27, lng: 116.83 },
  { id: 5, name: "RU VI Balongan", region: "Indramayu, Jawa Barat", cap: 125000, util: 0, status: "Maintenance", lat: -6.46, lng: 108.34 },
  { id: 6, name: "RU VII Kasim", region: "Sorong, Papua Barat", cap: 10000, util: 78, status: "Running", lat: -0.88, lng: 131.25 },
  { id: 7, name: "TPPI Tuban", region: "Tuban, Jawa Timur", cap: 100000, util: 72, status: "Running", lat: -6.9, lng: 112.05 },
  { id: 8, name: "GRR Tuban", region: "Tuban, Jawa Timur", cap: 300000, util: 0, status: "Construction", lat: -6.88, lng: 112.07 },
  { id: 9, name: "Kilang Plaju Ext", region: "Palembang, Sumsel", cap: 80000, util: 0, status: "Construction", lat: -3.0, lng: 104.78 },
  { id: 10, name: "Kilang Bontang", region: "Bontang, Kaltim", cap: 120000, util: 82, status: "Running", lat: 0.12, lng: 117.48 },
];

const processUnits = [
  { name: "CDU", efficiency: 97, color: "#1e2d4d" },
  { name: "FCCU", efficiency: 94, color: "#2563eb" },
  { name: "Hydrocracker", efficiency: 92, color: "#0891b2" },
  { name: "Bending", efficiency: 96, color: "#059669" },
  { name: "Utilities", efficiency: 109, color: "#7c3aed" },
];

const outputProducts = [
  { name: "Minyak", value: 248000, color: "#1e2d4d" },
  { name: "Solar", value: 148000, color: "#1e2d4d" },
  { name: "Avtur", value: 52000, color: "#0891b2" },
  { name: "LPG", value: 38000, color: "#f59e0b" },
  { name: "Residue", value: 62000, color: "#8b5cf6" },
];

const cctvFeeds = [
  { id: 1, label: "Cilacap CCU-1 Cam", live: true, cam: "01" },
  { id: 2, label: "Hydrocracker Unit", live: true, cam: "02" },
  { id: 3, label: "Control Room Ops", live: true, cam: "03" },
  { id: 4, label: "Port Access Gate", live: true, cam: "04" },
  { id: 5, label: "Ship Loading Arm", live: true, cam: "05" },
  { id: 6, label: "Portable Storage Tank", live: true, cam: "06" },
];

type FilterType = "All" | "Running" | "Maintenance" | "Construction";
type PeriodType = "Hari Ini" | "7H" | "30H" | "3B";
type ChartView = "Keduanya" | "Aktual" | "Target";

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

export default function RefineryPage() {
  const [selectedRefinery, setSelectedRefinery] = useState(refineries[2]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [period, setPeriod] = useState<PeriodType>("Hari Ini");
  const [chartView, setChartView] = useState<ChartView>("Keduanya");

  const filters: FilterType[] = ["All", "Running", "Maintenance", "Construction"];
  const periods: PeriodType[] = ["Hari Ini", "7H", "30H", "3B"];

  const filteredRefineries = refineries.filter((r) => {
    if (filter === "All") return true;
    return r.status === filter;
  });

  const maxOutput = Math.max(...outputProducts.map((p) => p.value));

  return (
    <DashboardLayout
      title="Stock Opname · Refinery"
      subtitle="Integrated Monitoring & Control Dashboard"
    >
      <div className="space-y-4">
        {/* Top banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Refinery Operations Dashboard</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Monitoring kilang Pertamina seluruh Indonesia · 14:52 WIB
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

        {/* Refinery picker */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Factory size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Pilih Kilang</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {filter === "All" ? refineries.length : filteredRefineries.length}/{refineries.length} Kilang
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Cari nama kilang atau wilayah..."
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
            {filteredRefineries.map((ref) => (
              <button
                key={ref.id}
                onClick={() => setSelectedRefinery(ref)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 ${
                  selectedRefinery.id === ref.id
                    ? "bg-[#1e2d4d] text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                    selectedRefinery.id === ref.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    <Factory size={13} />
                  </div>
                  <div className="text-left">
                    <p className={`text-[12px] font-semibold ${selectedRefinery.id === ref.id ? "text-white" : "text-slate-800"}`}>
                      {ref.name}
                    </p>
                    <p className={`text-[10px] ${selectedRefinery.id === ref.id ? "text-white/70" : "text-slate-400"}`}>
                      {ref.region}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold ${selectedRefinery.id === ref.id ? "text-white" : "text-slate-700"}`}>
                    {ref.cap.toLocaleString()}
                  </span>
                  {ref.util > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                        selectedRefinery.id === ref.id ? "bg-white/20" : "bg-slate-200"
                      }`}>
                        <div
                          className={`h-full rounded-full ${
                            ref.status === "Maintenance"
                              ? "bg-amber-400"
                              : ref.util >= 90
                              ? "bg-emerald-400"
                              : "bg-blue-400"
                          }`}
                          style={{ width: `${ref.util}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${selectedRefinery.id === ref.id ? "text-white" : "text-slate-600"}`}>
                        {ref.util}%
                      </span>
                    </div>
                  )}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    ref.status === "Running"
                      ? selectedRefinery.id === ref.id
                        ? "bg-emerald-400/30 text-emerald-100"
                        : "bg-emerald-100 text-emerald-600"
                      : ref.status === "Construction"
                        ? selectedRefinery.id === ref.id
                          ? "bg-blue-400/30 text-blue-100"
                          : "bg-blue-100 text-blue-600"
                        : selectedRefinery.id === ref.id
                          ? "bg-amber-400/30 text-amber-100"
                          : "bg-amber-100 text-amber-600"
                  }`}>
                    {ref.status}
                  </span>
                </div>
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
                    {selectedRefinery.name} — Lokasi Kilang
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  selectedRefinery.status === "Running" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {selectedRefinery.status}
                </span>
              </div>
              <LocationMap
                locations={refineries.map((r) => ({
                  id: r.id,
                  lat: r.lat,
                  lng: r.lng,
                  label: r.name,
                  status: r.status,
                }))}
                selectedId={selectedRefinery.id}
                stats={[
                  { label: "Kapasitas", value: `${(selectedRefinery.cap / 1000).toFixed(0)}K BPD` },
                  { label: "Utilisasi", value: `${selectedRefinery.util}%` },
                  { label: "CDU/U", value: "97%" },
                  { label: "RDMP", value: "94%" },
                ]}
                height="176px"
              />
            </div>

            {/* Process Unit Efficiency */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-800">
                  Efisiensi Unit Proses — {selectedRefinery.name}
                </span>
              </div>
              <div className="space-y-3">
                {processUnits.map((unit) => (
                  <div key={unit.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-600 font-medium">{unit.name}</span>
                      <span className="text-[11px] font-bold text-slate-800">{unit.efficiency}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(unit.efficiency, 100)}%`,
                          backgroundColor: unit.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Products bar chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-800">
                  Output Produk — {selectedRefinery.name}
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
                  {(["Keduanya", "Aktual", "Target"] as ChartView[]).map((v) => (
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
              <div className="flex items-end gap-3 h-28">
                {outputProducts.map((product) => {
                  const heightPct = (product.value / maxOutput) * 100;
                  return (
                    <div key={product.name} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[8px] text-slate-500">
                        {(product.value / 1000).toFixed(0)}K
                      </span>
                      <div className="w-full flex items-end" style={{ height: "72px" }}>
                        <div
                          className="w-full rounded-t-md transition-all duration-500"
                          style={{
                            height: `${heightPct}%`,
                            backgroundColor: product.color,
                          }}
                        />
                      </div>
                      <span className="text-[8px] text-slate-400 text-center leading-tight">
                        {product.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span className="w-2 h-2 bg-slate-800 rounded-sm inline-block" />
                    Aktual: 248,000 SPD
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-2 h-2 bg-slate-300 rounded-sm inline-block" />
                    Target: 343,287 BPD
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">+4,733 vs target</span>
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
                    Live CCTV — {selectedRefinery.name}
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

            {/* Status & Alert */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-800">
                    Status &amp; Alert — {selectedRefinery.name}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  AI Active
                </span>
              </div>
              <div className="rounded-xl overflow-hidden bg-emerald-50">
                <div className="flex items-start gap-3 p-3">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-emerald-700">AI Systems Normal</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      Operating at high efficiency
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0 mt-0.5" />
                </div>
                <div className="mx-3 mb-3 rounded-lg p-2.5 bg-emerald-100/60">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={10} className="text-emerald-600" />
                    <span className="text-[9px] font-bold text-emerald-700">AI Suggestion</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 leading-relaxed">
                    Pertahankan kondisi operasi optimal. Manfaatkan window efisiensi tinggi ini
                    untuk mempercepat batch blending produk premium.
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { label: "CDU-1 Heater Temp", value: "342°C", ok: true },
                  { label: "FCCU Catalyst Level", value: "87%", ok: true },
                  { label: "Hydrocracker Pressure", value: "142 bar", ok: true },
                  { label: "Flare Gas Recovery", value: "Active", ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-[11px] text-slate-500">{item.label}</span>
                    <span className={`text-[11px] font-semibold ${item.ok ? "text-emerald-600" : "text-red-600"}`}>
                      {item.value}
                    </span>
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
