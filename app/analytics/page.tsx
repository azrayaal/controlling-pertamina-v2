"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  CartesianGrid, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  ComposedChart,
} from "recharts";
import { Calendar, Filter, RefreshCw, FileDown, TrendingUp, TrendingDown } from "lucide-react";

/* ── Shared Chart Tooltip Style ──────────────────────────────────── */
const tooltipStyle = {
  fontSize: 12,
  border: "none",
  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  borderRadius: 8,
  backgroundColor: "#1e293b",
  color: "#f1f5f9",
};
const tooltipLabelStyle = { color: "#94a3b8", fontSize: 11 };

/* ── Mock Data ────────────────────────────────────────────────────── */

// Tab 1: Ringkasan Eksekutif
const salesVolumeData = [
  { month: "Jan", revenue: 32, volume: 7.2, target: 35 },
  { month: "Feb", revenue: 33, volume: 7.5, target: 35 },
  { month: "Mar", revenue: 34, volume: 7.8, target: 35 },
  { month: "Apr", revenue: 33.5, volume: 7.6, target: 35 },
  { month: "Mei", revenue: 35.5, volume: 8.1, target: 35 },
  { month: "Jun", revenue: 34, volume: 7.9, target: 35 },
  { month: "Jul", revenue: 35, volume: 8.0, target: 35 },
  { month: "Agu", revenue: 36, volume: 8.3, target: 35 },
  { month: "Sep", revenue: 35.5, volume: 8.2, target: 35 },
  { month: "Okt", revenue: 37, volume: 8.5, target: 35 },
  { month: "Nov", revenue: 38, volume: 8.8, target: 35 },
  { month: "Des", revenue: 45, volume: 10.5, target: 35 },
];

const marketShareData = [
  { name: "Pertalite", value: 38.4, color: "#22c55e" },
  { name: "Solar", value: 25.1, color: "#3b82f6" },
  { name: "Pertamax", value: 17.8, color: "#f97316" },
  { name: "Pertamax Turbo", value: 9.3, color: "#a855f7" },
  { name: "Bio Solar", value: 7.1, color: "#eab308" },
  { name: "Avtur", value: 4.8, color: "#06b6d4" },
  { name: "Pertamina DEX", value: 3.6, color: "#ec4899" },
];

const moduleSummary = [
  { modul: "Stock Opname", sub: "Production", kpi: "Total Lifting", nilai: "2.45 MBOEPD", target: "2.40 MBOEPD", status: "MELEBIHI", trend: "+2.1%" },
  { modul: "Stock Opname", sub: "Refinery", kpi: "Throughput Rate", nilai: "1.036 MBOPD", target: "1.036 MBOPD", status: "ON TRACK", trend: "±0%" },
  { modul: "Stock Opname", sub: "Storage", kpi: "Utilization", nilai: "73.4%", target: "<85%", status: "OK", trend: "-1.2%" },
  { modul: "Stock Opname", sub: "Logistic", kpi: "Fleet On-Time", nilai: "94.2%", target: ">90%", status: "MELEBIHI", trend: "+3.1%" },
  { modul: "Controlling", sub: "SPBU", kpi: "Avg Transaksi/SPBU", nilai: "58.2k/bln", target: "55k/bln", status: "MELEBIHI", trend: "+5.8%" },
  { modul: "Controlling", sub: "SPKLU", kpi: "Charging Sessions", nilai: "6.140/bln", target: "5.500/bln", status: "MELEBIHI", trend: "+11.6%" },
  { modul: "Controlling", sub: "SPBE", kpi: "LPG Volume", nilai: "142 MTPA", target: "140 MTPA", status: "MELEBIHI", trend: "+1.4%" },
  { modul: "Distribusi", sub: "Distribusi", kpi: "On-Time Delivery", nilai: "91.8%", target: ">90%", status: "OK", trend: "+0.8%" },
  { modul: "Live Tracking", sub: "GPS Fleet", kpi: "Active Units", nilai: "1.842", target: "1.800", status: "MELEBIHI", trend: "+2.3%" },
  { modul: "AI Engine", sub: "Decision", kpi: "Loss Avoided", nilai: "IDR 210.5 B", target: "IDR 180 B", status: "MELEBIHI", trend: "+16.9%" },
];

// Tab 2: Produksi & Stock
const produksiMingguan = [
  { week: "W1", minyak: 7.4, gas: 1.61, lifting: 9.0 },
  { week: "W2", minyak: 7.42, gas: 1.62, lifting: 9.04 },
  { week: "W3", minyak: 7.44, gas: 1.63, lifting: 9.07 },
  { week: "W4", minyak: 7.46, gas: 1.64, lifting: 9.1 },
  { week: "W5", minyak: 7.47, gas: 1.65, lifting: 9.12 },
  { week: "W6", minyak: 7.5, gas: 1.65, lifting: 9.15 },
  { week: "W7", minyak: 7.49, gas: 1.66, lifting: 9.15 },
  { week: "W8", minyak: 7.52, gas: 1.67, lifting: 9.19 },
];

const utilisasiKilang = [
  { name: "RU-IV Cilacap", actual: 324, kapasitas: 348, pct: 93 },
  { name: "RU-V Balikpapan", actual: 261, kapasitas: 280, pct: 93 },
  { name: "RU-II Dumai", actual: 158, kapasitas: 170, pct: 93 },
  { name: "RU-VI Balongan", actual: 116, kapasitas: 125, pct: 94 },
  { name: "RU-III Plaju", actual: 122, kapasitas: 133, pct: 92 },
];

const terminalStorage = [
  { name: "Plumpang (Jakarta)", volume: 220, kapasitas: 280 },
  { name: "Tanjung Gerem", volume: 165, kapasitas: 220 },
  { name: "Dumai", volume: 195, kapasitas: 240 },
  { name: "Balikpapan", volume: 170, kapasitas: 210 },
  { name: "Bitung", volume: 130, kapasitas: 180 },
  { name: "Sorong", volume: 115, kapasitas: 160 },
];

// Tab 3: Distribusi BBM
const distribusiData6 = [
  { month: "Jan", pertalite: 3.8, solar: 2.5, pertamax: 1.7, turbo: 0.9, biosolar: 0.7, avtur: 0.5 },
  { month: "Feb", pertalite: 3.9, solar: 2.6, pertamax: 1.8, turbo: 0.95, biosolar: 0.72, avtur: 0.52 },
  { month: "Mar", pertalite: 4.0, solar: 2.7, pertamax: 1.9, turbo: 1.0, biosolar: 0.75, avtur: 0.55 },
  { month: "Apr", pertalite: 4.1, solar: 2.8, pertamax: 2.0, turbo: 1.05, biosolar: 0.78, avtur: 0.57 },
  { month: "Mei", pertalite: 4.2, solar: 2.9, pertamax: 2.1, turbo: 1.1, biosolar: 0.8, avtur: 0.6 },
  { month: "Jun", pertalite: 4.0, solar: 2.7, pertamax: 1.95, turbo: 1.0, biosolar: 0.77, avtur: 0.58 },
];

const distribusiData12 = [
  ...distribusiData6,
  { month: "Jul", pertalite: 3.9, solar: 2.6, pertamax: 1.85, turbo: 0.98, biosolar: 0.75, avtur: 0.56 },
  { month: "Agu", pertalite: 4.1, solar: 2.75, pertamax: 2.0, turbo: 1.05, biosolar: 0.79, avtur: 0.59 },
  { month: "Sep", pertalite: 4.2, solar: 2.85, pertamax: 2.1, turbo: 1.08, biosolar: 0.8, avtur: 0.61 },
  { month: "Okt", pertalite: 4.3, solar: 2.9, pertamax: 2.15, turbo: 1.1, biosolar: 0.82, avtur: 0.62 },
  { month: "Nov", pertalite: 4.4, solar: 3.0, pertamax: 2.2, turbo: 1.12, biosolar: 0.84, avtur: 0.63 },
  { month: "Des", pertalite: 4.5, solar: 3.1, pertamax: 2.3, turbo: 1.15, biosolar: 0.86, avtur: 0.65 },
];

const performaSPBURegional = [
  { regional: "DKI Jakarta", transaksi: 1950, volume: 22, revenue: 30 },
  { regional: "Jawa Barat", transaksi: 1850, volume: 20, revenue: 28 },
  { regional: "Jawa Timur", transaksi: 1700, volume: 18, revenue: 26 },
  { regional: "Sumatra Utara", transaksi: 1200, volume: 12, revenue: 18 },
  { regional: "Kalimantan", transaksi: 800, volume: 9, revenue: 12 },
  { regional: "Sulawesi", transaksi: 600, volume: 7, revenue: 9 },
  { regional: "Papua", transaksi: 400, volume: 5, revenue: 6 },
];

// Tab 4: Controlling Cabang
const spkluTrendData = [
  { month: "Jul", sessions: 4200, energi: 1050 },
  { month: "Agu", sessions: 4400, energi: 1100 },
  { month: "Sep", sessions: 4500, energi: 1120 },
  { month: "Okt", sessions: 4700, energi: 1180 },
  { month: "Nov", sessions: 4900, energi: 1220 },
  { month: "Des", sessions: 6140, energi: 2456 },
];

const spbuRevenueRegional = [
  { regional: "DKI Jakarta", revenue: 28 },
  { regional: "Jawa Barat", revenue: 25 },
  { regional: "Jawa Timur", revenue: 18 },
  { regional: "Sumatra Utara", revenue: 15 },
  { regional: "Kalimantan", revenue: 10 },
  { regional: "Sulawesi", revenue: 8 },
  { regional: "Papua", revenue: 5 },
];

const spbeLPGData = [
  { month: "Jul", volume: 11.2 },
  { month: "Agu", volume: 11.4 },
  { month: "Sep", volume: 11.6 },
  { month: "Okt", volume: 11.5 },
  { month: "Nov", volume: 11.8 },
  { month: "Des", volume: 12.0 },
];

// Tab 5: Anomali & Alert
const anomaliBulanan = [
  { month: "Jan", critical: 8, warning: 22, resolved: 28 },
  { month: "Feb", critical: 7, warning: 20, resolved: 25 },
  { month: "Mar", critical: 6, warning: 18, resolved: 22 },
  { month: "Apr", critical: 5, warning: 15, resolved: 18 },
  { month: "Mei", critical: 7, warning: 20, resolved: 24 },
  { month: "Jun", critical: 6, warning: 17, resolved: 21 },
  { month: "Jul", critical: 5, warning: 14, resolved: 18 },
  { month: "Agu", critical: 4, warning: 12, resolved: 15 },
  { month: "Sep", critical: 6, warning: 16, resolved: 20 },
  { month: "Okt", critical: 5, warning: 14, resolved: 18 },
  { month: "Nov", critical: 4, warning: 11, resolved: 14 },
  { month: "Des", critical: 3, warning: 9, resolved: 11 },
];

const anomaliKategori = [
  { name: "Logistik / Armada", insiden: 34, resolved: 91 },
  { name: "Kilang / Refinery", insiden: 28, resolved: 88 },
  { name: "Storage / Terminal", insiden: 22, resolved: 91 },
  { name: "SPBU Offline", insiden: 41, resolved: 93 },
  { name: "Upstream / Sumur", insiden: 18, resolved: 87 },
  { name: "Pipeline Pressure", insiden: 19, resolved: 88 },
  { name: "SPKLU Outage", insiden: 11, resolved: 81 },
];

const logAnomali = [
  { id: "ALT-2026-0641", waktu: "04 Mei · 14:32", kategori: "Logistik", lokasi: "Tanker-3 · Selat Sunda", deskripsi: "Risiko tabrakan terdeteksi AI", severity: "CRITICAL", status: "Resolved", response: "4.2 mnt" },
  { id: "ALT-2026-0640", waktu: "04 Mei · 13:45", kategori: "Kilang", lokasi: "RU-IV Cilacap · Unit-4", deskripsi: "Temperature spike +12°C abnormal", severity: "WARNING", status: "Monitoring", response: "8.1 mnt" },
  { id: "ALT-2026-0639", waktu: "04 Mei · 12:18", kategori: "SPKLU", lokasi: "Tol Jagorawi Km 38", deskripsi: "SPKLU outage — koneksi terputus", severity: "WARNING", status: "Resolved", response: "11.3 mnt" },
  { id: "ALT-2026-0638", waktu: "04 Mei · 11:02", kategori: "Storage", lokasi: "Terminal Plumpang", deskripsi: "Level sensor C-7 offline", severity: "INFO", status: "Resolved", response: "6.4 mnt" },
  { id: "ALT-2026-0637", waktu: "04 Mei · 10:34", kategori: "SPBU", lokasi: "SPBU 3412 Plumpang", deskripsi: "Kamera CAM-03 signal loss", severity: "INFO", status: "Resolved", response: "3.8 mnt" },
  { id: "ALT-2026-0636", waktu: "04 Mei · 09:57", kategori: "Pipeline", lokasi: "Sektor 7 · Jawa Tengah", deskripsi: "Tekanan pipeline di bawah threshold", severity: "WARNING", status: "Resolved", response: "9.2 mnt" },
  { id: "ALT-2026-0635", waktu: "04 Mei · 09:12", kategori: "Upstream", lokasi: "Platform Mahakam Delta", deskripsi: "Flow meter anomali di sumur M-14", severity: "CRITICAL", status: "Resolved", response: "3.7 mnt" },
  { id: "ALT-2026-0634", waktu: "04 Mei · 08:44", kategori: "Logistik", lokasi: "Truk B 9531 PD", deskripsi: "Kecepatan melebihi batas 90 km/h", severity: "WARNING", status: "Resolved", response: "2.1 mnt" },
];

// Tab 6: AI Decision Engine
const aiImpactData = [
  { month: "Jul", loss: 22 }, { month: "Agu", loss: 26 }, { month: "Sep", loss: 30 },
  { month: "Okt", loss: 28 }, { month: "Nov", loss: 32 }, { month: "Des", loss: 35 },
];

const confidenceData = [
  { month: "Jul", confidence: 88, actions: 10 },
  { month: "Agu", confidence: 89, actions: 12 },
  { month: "Sep", confidence: 90, actions: 14 },
  { month: "Okt", confidence: 90, actions: 16 },
  { month: "Nov", confidence: 91, actions: 18 },
  { month: "Des", confidence: 92, actions: 22 },
];

const riwayatAksi = [
  { aksi: "Reroute Tanker-3", domain: "Logistik", trigger: "Collision Risk", resolution: "Safe Route", confidence: 92, loss: "IDR 10 B", progress: 90, status: "Completed", waktu: "14 Mei · 3:32" },
  { aksi: "Optimize Refinery-4 Cooling", domain: "Kilang", trigger: "Temp Spike", resolution: "Cool Down", confidence: 87, loss: "IDR 5 B", progress: 30, status: "In Progress", waktu: "14 Mei · 3:05" },
  { aksi: "Reallocate Supply Route", domain: "Distribusi", trigger: "Depot Overstock", resolution: "Re-route Flow", confidence: 79, loss: "IDR 3.2 B", progress: 50, status: "Monitoring", waktu: "14 Mei · 2:00" },
  { aksi: "Shutdown Alert Pipeline-7", domain: "Pipeline", trigger: "Pressure Drop", resolution: "Valve Adjust", confidence: 94, loss: "IDR 6.7 B", progress: 90, status: "Completed", waktu: "13 Mei · 8:31" },
  { aksi: "Prioritize Depot Sumatera", domain: "Storage", trigger: "Low Stock", resolution: "Supply Boost", confidence: 83, loss: "IDR 2.1 B", progress: 90, status: "Completed", waktu: "13 Mei · 3:45" },
  { aksi: "SPKLU Failover Jakarta", domain: "SPKLU", trigger: "Network Outage", resolution: "Backup Active", confidence: 91, loss: "IDR 0.8 B", progress: 90, status: "Completed", waktu: "13 Mei · 1:21" },
  { aksi: "Upstream Minas Pump Optimize", domain: "Upstream", trigger: "Flow Anomaly", resolution: "Pump Calibrated", confidence: 86, loss: "IDR 4.4 B", progress: 55, status: "In Progress", waktu: "13 Mei · 0:50" },
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function KPICard({ icon, label, value, unit, change, up, extra }: {
  icon: React.ReactNode; label: string; value: string; unit?: string;
  change: string; up: boolean; extra?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col gap-1.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">{icon}</div>
        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${up ? "text-emerald-500" : "text-red-500"}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {change}
        </span>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium mt-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
        {value} {unit && <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{unit}</span>}
      </p>
      {extra && <p className="text-[11px] text-slate-400 dark:text-slate-500">{extra}</p>}
    </div>
  );
}

const MAIN_TABS = [
  { id: "ringkasan", label: "Ringkasan Eksekutif", icon: "📊" },
  { id: "produksi", label: "Produksi & Stock", icon: "⚡" },
  { id: "distribusi", label: "Distribusi BBM", icon: "🚚" },
  { id: "controlling", label: "Controlling Cabang", icon: "🏪" },
  { id: "anomali", label: "Anomali & Alert", icon: "🔔" },
  { id: "ai", label: "AI Decision Engine", icon: "🤖" },
];

/* ── Main Component ──────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [activeCabangTab, setActiveCabangTab] = useState("spbu");
  const [distribusiPeriod, setDistribusiPeriod] = useState<6 | 12>(6);
  const [period, setPeriod] = useState("2025");

  const chartAxisStyle = { fontSize: 10, fill: "#94a3b8" };
  const darkTooltip = { contentStyle: tooltipStyle, labelStyle: tooltipLabelStyle };

  return (
    <DashboardLayout title="Analytics & Report" subtitle="Laporan komprehensif seluruh modal operasional Pertamina">
      <div className="space-y-4">
        {/* ── Page Header Controls ─────────────────────────────────── */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Title */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">📊</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Analytics & Report</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Laporan komprehensif seluruh modal operasional Pertamina</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Calendar size={12} />
                <span>Periode: {period}</span>
                <span className="text-slate-400">▾</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Filter size={12} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <RefreshCw size={12} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2d4d] text-xs text-white font-medium hover:bg-[#162440] transition-colors">
                <FileDown size={12} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="flex gap-1 mt-3 border-t border-slate-100 dark:border-slate-700 pt-3 overflow-x-auto">
            {MAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-[#1e2d4d] text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Ringkasan Eksekutif ─────────────────────────────── */}
        {activeTab === "ringkasan" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard icon={<TrendingUp size={18} className="text-blue-500" />} label="Total Pendapatan (YTD)" value="IDR 537.8 T" unit="triliun" change="+8.4% YoY" up={true} />
              <KPICard icon={<span className="text-lg">⛽</span>} label="Total Volume Distribusi" value="101.4" unit="MMKL" change="+5.2% YoY" up={true} />
              <KPICard icon={<span className="text-lg">🔔</span>} label="Total Anomali & Alert" value="213" unit="Insiden" change="483 diselesaikan" up={true} />
              <KPICard icon={<span className="text-lg">🤖</span>} label="Loss Avoided (AI)" value="IDR 210.5 B" change="+22% efisiensi" up={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Total Penjualan & Volume */}
              <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Revenue IDR Triliun vs Volume MMKL</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Total Penjualan & Volume (12 Bulan)</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={salesVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <Tooltip {...darkTooltip} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="left" dataKey="revenue" fill="#8b9dc3" radius={[3,3,0,0]} name="Revenue (IDR T)" />
                      <Line yAxisId="right" type="monotone" dataKey="target" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Share */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Porsi volume distribusi YTD</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Market Share BBM</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={marketShareData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                        {marketShareData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...darkTooltip} formatter={(v) => `${v} MMKL`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {marketShareData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{d.value} MMKL</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ringkasan Semua Modul */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <span className="text-base">📋</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Ringkasan Semua Modul</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Performa per menu — tahun berjalan</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      {["MODUL","SUB-MENU","KPI UTAMA","NILAI","TARGET","STATUS","TREND"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {moduleSummary.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">{row.modul}</td>
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.sub}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.kpi}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-100">{row.nilai}</td>
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.target}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === "MELEBIHI" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            row.status === "ON TRACK" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}>{row.status}</span>
                        </td>
                        <td className={`px-4 py-2.5 font-semibold ${row.trend.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : row.trend.startsWith("-") ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>
                          {row.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Produksi & Stock ─────────────────────────────────── */}
        {activeTab === "produksi" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard icon={<span className="text-lg">📈</span>} label="Lifting Minyak" value="2.45" unit="MBOEPD" change="+2.1%" up={true} />
              <KPICard icon={<span className="text-lg">🔥</span>} label="Lifting Gas" value="1.67" unit="MMSCFD" change="+1.8%" up={true} />
              <KPICard icon={<span className="text-lg">📊</span>} label="Throughput Kilang" value="1.036" unit="MBOPD" change="-1.2%" up={false} extra="5 Kilang aktif" />
              <KPICard icon={<span className="text-lg">🏭</span>} label="Storage Utilization" value="73.4%" change="-1.2%" up={false} extra="8 Terminal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Produksi Mingguan */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Minyak, Gas & Lifting (MBOEPD | MMSCFD)</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Produksi Mingguan</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={produksiMingguan}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="week" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} domain={[7.2, 7.6]} />
                      <Tooltip {...darkTooltip} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="minyak" stroke="#1e2d4d" strokeWidth={2} dot={{ r: 3, fill: "#1e2d4d" }} name="Minyak" />
                      <Line type="monotone" dataKey="gas" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} name="Gas" />
                      <Line type="monotone" dataKey="lifting" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Lifting" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Utilisasi Kilang */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Kapasitas vs Aktual (MBOPD)</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Utilisasi Kilang</h3>
                <div className="space-y-3 mt-2">
                  {utilisasiKilang.map((k) => (
                    <div key={k.name}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{k.name}</span>
                        <span className="font-bold text-red-500">{k.pct}%</span>
                      </div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${k.pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        <span>{k.actual} MBOPD actual</span>
                        <span>Kapasitas {k.kapasitas}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Storage */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Kapasitas vs Volume Tersimpan</p>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Utilization Terminal Storage</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={terminalStorage} layout="vertical" barSize={10}>
                    <XAxis type="number" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={chartAxisStyle} axisLine={false} tickLine={false} width={120} />
                    <Tooltip {...darkTooltip} />
                    <Bar dataKey="volume" fill="#1e2d4d" radius={[0,3,3,0]} name="Volume (000 KL)" />
                    <Bar dataKey="kapasitas" fill="#e2e8f0" radius={[0,3,3,0]} name="Kapasitas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Distribusi BBM ───────────────────────────────────── */}
        {activeTab === "distribusi" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard icon={<span className="text-lg">🚚</span>} label="Volume Distribusi (BLN)" value="10.1" unit="MMKL" change="+3.6%" up={true} />
              <KPICard icon={<span className="text-lg">📍</span>} label="Rute Aktif" value="2.847" unit="rute" change="+0.8%" up={true} extra="Seluruh Indonesia" />
              <KPICard icon={<span className="text-lg">✅</span>} label="On-Time Delivery" value="91.8%" change="+0.8%" up={true} />
              <KPICard icon={<span className="text-lg">🚛</span>} label="Armada Aktif" value="1.842" unit="unit" change="+2.3%" up={true} />
            </div>

            {/* Volume Distribusi per Jenis BBM */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">MMKL per bulan — semua jenis BBM</p>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Volume Distribusi per Jenis BBM</h3>
                </div>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-[11px]">
                  <button onClick={() => setDistribusiPeriod(6)} className={`px-3 py-1.5 font-medium transition-colors ${distribusiPeriod === 6 ? "bg-[#1e2d4d] text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>6 Bulan</button>
                  <button onClick={() => setDistribusiPeriod(12)} className={`px-3 py-1.5 font-medium transition-colors ${distribusiPeriod === 12 ? "bg-[#1e2d4d] text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>12 Bulan</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribusiPeriod === 6 ? distribusiData6 : distribusiData12} barSize={20}>
                    <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                    <Tooltip {...darkTooltip} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="pertalite" stackId="a" fill="#22c55e" name="Pertalite" />
                    <Bar dataKey="solar" stackId="a" fill="#3b82f6" name="Solar" />
                    <Bar dataKey="pertamax" stackId="a" fill="#f97316" name="Pertamax" />
                    <Bar dataKey="turbo" stackId="a" fill="#a855f7" name="Pertamax Turbo" />
                    <Bar dataKey="biosolar" stackId="a" fill="#eab308" name="Bio Solar" />
                    <Bar dataKey="avtur" stackId="a" fill="#06b6d4" radius={[3,3,0,0]} name="Avtur" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performa SPBU per Regional */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Transaksi, Volume & Revenue bulanan</p>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Performa SPBU per Regional</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performaSPBURegional}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                    <XAxis dataKey="regional" tick={{ ...chartAxisStyle, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                    <Tooltip {...darkTooltip} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="transaksi" fill="#8b9dc3" radius={[3,3,0,0]} name="Transaksi" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Revenue (IDR T)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Controlling Cabang ───────────────────────────────── */}
        {activeTab === "controlling" && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              {[
                { id: "spbu", label: "SPBU", icon: "⛽", color: "bg-emerald-500" },
                { id: "spklu", label: "SPKLU", icon: "⚡", color: "bg-[#1e2d4d]" },
                { id: "spbe", label: "SPBE", icon: "🔥", color: "bg-orange-500" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveCabangTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all border ${
                    activeCabangTab === t.id
                      ? `${t.color} text-white border-transparent shadow-sm`
                      : "bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {activeCabangTab === "spbu" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KPICard icon={<span className="text-lg">⛽</span>} label="Total SPBU Aktif" value="1.365" unit="outlet" change="+12 bin ini" up={true} />
                  <KPICard icon={<span className="text-lg">💳</span>} label="Avg Transaksi/SPBU" value="58.2k" unit="/bulan" change="+5.8%" up={true} />
                  <KPICard icon={<TrendingUp size={18} className="text-emerald-500" />} label="Revenue Total" value="IDR 117.4 T" change="+7.2%" up={true} />
                  <KPICard icon={<span className="text-lg">🔴</span>} label="SPBU Bermasalah" value="41" unit="outlet" change="-8%" up={true} extra="9% resolved" />
                </div>
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">IDR Triliun — perbandingan vs target</p>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Revenue SPBU per Regional</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spbuRevenueRegional} barSize={22}>
                        <XAxis dataKey="regional" tick={{ ...chartAxisStyle, fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                        <Tooltip {...darkTooltip} />
                        <Bar dataKey="revenue" radius={[3,3,0,0]} name="Revenue (IDR T)">
                          {spbuRevenueRegional.map((_, i) => (
                            <Cell key={i} fill={i === 0 ? "#22c55e" : "#bbf7d0"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeCabangTab === "spklu" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KPICard icon={<span className="text-lg">⚡</span>} label="Total SPKLU Aktif" value="894" unit="unit" change="+15% YoY" up={true} />
                  <KPICard icon={<span className="text-lg">🔌</span>} label="Charging Sessions" value="6.140" unit="/bulan" change="+11.8%" up={true} />
                  <KPICard icon={<span className="text-lg">⚡</span>} label="Energi Disalurkan" value="2.456" unit="MWh/bln" change="+8.2%" up={true} />
                  <KPICard icon={<TrendingUp size={18} className="text-blue-500" />} label="Revenue SPKLU" value="IDR 2.8 B" unit="/bulan" change="+9.3%" up={true} />
                </div>
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Charging sessions & Energi (MWh)</p>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Tren SPKLU — 6 Bulan Terakhir</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={spkluTrendData}>
                        <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                        <Tooltip {...darkTooltip} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar yAxisId="left" dataKey="sessions" radius={[3,3,0,0]} name="Charging Sessions">
                          {spkluTrendData.map((_, i) => (
                            <Cell key={i} fill={i === spkluTrendData.length - 1 ? "#1e2d4d" : "#c7d2fe"} />
                          ))}
                        </Bar>
                        <Line yAxisId="right" type="monotone" dataKey="energi" stroke="#818cf8" strokeWidth={2} dot={{ r: 3, fill: "#818cf8" }} name="Energi (MWh)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeCabangTab === "spbe" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KPICard icon={<span className="text-lg">🔥</span>} label="Total SPBE Aktif" value="412" unit="outlet" change="+6% YoY" up={true} />
                  <KPICard icon={<span className="text-lg">🛢️</span>} label="Volume LPG" value="142" unit="MTPA" change="+1.4%" up={true} />
                  <KPICard icon={<TrendingUp size={18} className="text-orange-500" />} label="Revenue LPG" value="IDR 8.4 T" change="+3.2%" up={true} />
                  <KPICard icon={<span className="text-lg">🛡️</span>} label="Insiden Safety" value="3" unit="insiden" change="+1.4%" up={true} extra="Semua resolved" />
                </div>
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Metrik ton — 6 bulan terakhir</p>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Volume LPG per Bulan (SPBE)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spbeLPGData}>
                        <defs>
                          <linearGradient id="spbeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} domain={[10, 13]} />
                        <Tooltip {...darkTooltip} />
                        <Area type="monotone" dataKey="volume" stroke="#f97316" fill="url(#spbeGrad)" strokeWidth={2} dot={{ r: 3, fill: "#f97316" }} name="Volume LPG (000 ton)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Anomali & Alert ─────────────────────────────────── */}
        {activeTab === "anomali" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard icon={<span className="text-lg">🔴</span>} label="Total Insiden YTD" value="847" unit="Insiden" change="Semua kategori" up={true} />
              <KPICard icon={<span className="text-lg">⚠️</span>} label="Critical Alerts" value="52" unit="Insiden" change="-12% vs thn lalu" up={true} />
              <KPICard icon={<span className="text-lg">✅</span>} label="Resolved" value="793" unit="insiden" change="93.6% resolution rate" up={true} />
              <KPICard icon={<span className="text-lg">⏱️</span>} label="Avg Response Time" value="14.2" unit="menit" change="-3.3 mnt vs Q3" up={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Tren Anomali Bulanan */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Critical, Warning & Resolved</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Tren Anomali Bulanan</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={anomaliBulanan}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <Tooltip {...darkTooltip} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} name="Critical" />
                      <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Warning" />
                      <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} name="Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Anomali per Kategori */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Total insiden & persentase resolved</p>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Anomali per Kategori</h3>
                <div className="space-y-2.5">
                  {anomaliKategori.map((item, i) => {
                    const colors = ["#3b82f6", "#f97316", "#8b5cf6", "#22c55e", "#eab308", "#06b6d4", "#a3e635"];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i] }} />
                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 dark:text-slate-400">{item.insiden} insiden</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.resolved}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.resolved}%`, backgroundColor: colors[i] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Log Anomali Terbaru */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Log Anomali Terbaru</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">50 insiden terakhir yang tercatat</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      {["ID","WAKTU","KATEGORI","LOKASI","DESKRIPSI","SEVERITY","STATUS","RESPONSE"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logAnomali.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.id}</td>
                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.waktu}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.kategori === "Logistik" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                            row.kategori === "Kilang" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" :
                            row.kategori === "SPKLU" ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" :
                            row.kategori === "Storage" ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" :
                            row.kategori === "SPBU" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            row.kategori === "Pipeline" ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                            "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}>{row.kategori}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.lokasi}</td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">{row.deskripsi}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            row.severity === "CRITICAL" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" :
                            row.severity === "WARNING" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400" :
                            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}>{row.severity}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`flex items-center gap-1 text-[11px] font-medium ${row.status === "Resolved" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Resolved" ? "bg-emerald-500" : "bg-blue-500"}`} />
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{row.response}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: AI Decision Engine ───────────────────────────────── */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPICard icon={<TrendingUp size={18} className="text-purple-500" />} label="Total Loss Avoided (H2)" value="IDR 210.5 B" change="+22% vs H1" up={true} />
              <KPICard icon={<span className="text-lg">🎯</span>} label="Actions Completed" value="92" unit="aksi" change="+18%" up={true} extra="Bln 2025" />
              <KPICard icon={<span className="text-lg">📊</span>} label="Avg Confidence Score" value="91.2%" change="+3.1 pts" up={true} />
              <KPICard icon={<span className="text-lg">⏱️</span>} label="Avg Resolution Time" value="6.8" unit="menit" change="-1.4 mnt" up={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI Impact */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🤖</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Impact — Loss Avoided</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">IDR triliun per bulan (H2 2025)</p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aiImpactData}>
                      <defs>
                        <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <Tooltip {...darkTooltip} formatter={(v) => `IDR ${v} T`} />
                      <Area type="monotone" dataKey="loss" stroke="#8b5cf6" fill="url(#aiGrad)" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} name="Loss Avoided" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📈</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Confidence Score & Actions Resolved</h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Tren bulanan kepercayaan aksi diambil</p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={confidenceData}>
                      <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={chartAxisStyle} axisLine={false} tickLine={false} domain={[85, 95]} />
                      <YAxis yAxisId="right" orientation="right" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                      <Tooltip {...darkTooltip} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar yAxisId="right" dataKey="actions" radius={[3,3,0,0]} name="Actions">
                        {confidenceData.map((_, i) => (
                          <Cell key={i} fill={i === confidenceData.length - 1 ? "#1e2d4d" : "#c7d2fe"} />
                        ))}
                      </Bar>
                      <Line yAxisId="left" type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} name="Confidence %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Riwayat Aksi */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <span className="text-base">🤖</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Riwayat Aksi AI Decision Engine</h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Semua keputusan otomatis & semi-otomatis</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      {["AKSI AI","DOMAIN","TRIGGER","RESOLUTION","CONFIDENCE","LOSS AVOIDED","PROGRESS","STATUS","WAKTU"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatAksi.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200 max-w-[160px]">{row.aksi}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{row.domain}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.trigger}</td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.resolution}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.confidence}%</td>
                        <td className="px-3 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{row.loss}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full min-w-[50px]">
                              <div className={`h-full rounded-full ${row.progress >= 80 ? "bg-emerald-500" : row.progress >= 50 ? "bg-blue-500" : "bg-purple-500"}`} style={{ width: `${row.progress}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{row.progress}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === "Completed" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            row.status === "In Progress" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                            "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          }`}>{row.status}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-400 dark:text-slate-500 whitespace-nowrap">{row.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Summary Report */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Summary Report — Desember 2025</h3>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">Generated by AI</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    title: "Efisiensi Distribusi",
                    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
                    titleColor: "text-blue-800 dark:text-blue-300",
                    textColor: "text-blue-700 dark:text-blue-400",
                    text: "AI berhasil mengidentifikasi 14 rute distribusi tidak efisien dan melakukan rerouting berdasarkan realitas — menghemat 8.4% biaya operasional distribusi bulan Desember.",
                  },
                  {
                    title: "Keamanan Armada",
                    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
                    titleColor: "text-orange-800 dark:text-orange-300",
                    textColor: "text-orange-700 dark:text-orange-400",
                    text: "Sistem AI memantau 21 insiden aktive armada secara real-time dan menganalisis rerouting sebelum terjadi kerugian. Rata-rata response time turun ke 6.8 menit.",
                  },
                  {
                    title: "Optimasi Kilang",
                    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
                    titleColor: "text-purple-800 dark:text-purple-300",
                    textColor: "text-purple-700 dark:text-purple-400",
                    text: "Penyesuaian otomatis pada 3 unit kilang meningkatkan throughput 3.2% tanpa penambahan kapasitas fisik. Loss avoided dari downtime mencapai IDR 45.3 B.",
                  },
                ].map((card) => (
                  <div key={card.title} className={`p-3 rounded-lg border ${card.color}`}>
                    <p className={`text-[12px] font-bold mb-1.5 ${card.titleColor}`}>{card.title}</p>
                    <p className={`text-[11px] leading-relaxed ${card.textColor}`}>{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
