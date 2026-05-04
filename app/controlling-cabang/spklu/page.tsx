"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Zap, Activity, Gauge, TrendingUp, AlertTriangle,
  Video, Radio, Sparkles, DollarSign,
} from "lucide-react";

const statCards = [
  { label: "Stasiun Aktif", value: "342", sub: "/ 360", change: "+5 minggu ini", positive: true, color: "emerald" },
  { label: "Total Konektor", value: "1,245", sub: "online", change: "+1.4%", positive: true, color: "blue" },
  { label: "Energi Tersalur", value: "45,600", unit: "kWh", sub: "Hari ini", change: "+7%", positive: true, color: "purple" },
  { label: "Availability Rate", value: "78%", sub: "online", change: "+2.1%", positive: true, color: "teal" },
  { label: "Fault Rate", value: "5%", sub: "faults", change: "-3.4%", positive: true, color: "amber" },
  { label: "Total Revenue", value: "IDR 15.5M", sub: "Hari ini", change: "+8.2%", positive: true, color: "emerald" },
];

const spkluLocations = [
  { id: 1, name: "SPKLU Jakarta Selatan", status: "Active", lat: -6.22, lng: 106.82 },
  { id: 2, name: "SPKLU Jakarta Pusat", status: "Active", lat: -6.18, lng: 106.83 },
  { id: 3, name: "SPKLU Surabaya", status: "Active", lat: -7.26, lng: 112.75 },
  { id: 4, name: "SPKLU Bandung", status: "Active", lat: -6.91, lng: 107.61 },
  { id: 5, name: "SPKLU Medan", status: "Active", lat: 3.59, lng: 98.68 },
  { id: 6, name: "SPKLU Makassar", status: "Active", lat: -5.14, lng: 119.44 },
  { id: 7, name: "SPKLU Semarang", status: "Maintenance", lat: -6.96, lng: 110.41 },
  { id: 8, name: "SPKLU Yogyakarta", status: "Active", lat: -7.80, lng: 110.36 },
  { id: 9, name: "SPKLU Bali — Denpasar", status: "Active", lat: -8.66, lng: 115.21 },
  { id: 10, name: "SPKLU Palembang", status: "Active", lat: -2.93, lng: 104.74 },
  { id: 11, name: "SPKLU Balikpapan", status: "Active", lat: -1.28, lng: 116.84 },
  { id: 12, name: "SPKLU Pekanbaru", status: "Active", lat: 0.50, lng: 101.45 },
  { id: 13, name: "SPKLU Pontianak", status: "Active", lat: -0.02, lng: 109.32 },
  { id: 14, name: "SPKLU Manado", status: "Active", lat: 1.48, lng: 124.83 },
  { id: 15, name: "SPKLU Jayapura", status: "Maintenance", lat: -2.54, lng: 140.72 },
];

const cctvFeeds = [
  { id: 1, label: "SPKLU 3112345 — Bay A", live: true },
  { id: 2, label: "SPKLU 3112345 — Bay B", live: true },
  { id: 3, label: "SPKLU 3112345 — Parkir", live: true },
  { id: 4, label: "SPKLU 3112345 — Pintu", live: false },
];

const usagePerHour = [
  { time: "06:00", kwh: 120 }, { time: "08:00", kwh: 280 },
  { time: "10:00", kwh: 350 }, { time: "12:00", kwh: 420 },
  { time: "14:00", kwh: 390 }, { time: "16:00", kwh: 460 },
  { time: "18:00", kwh: 510 }, { time: "20:00", kwh: 480 },
  { time: "22:00", kwh: 340 }, { time: "00:00", kwh: 160 },
];

const evUsageYear = [
  { month: "Jan", val: 30 }, { month: "Feb", val: 45 }, { month: "Mar", val: 38 },
  { month: "Apr", val: 55 }, { month: "Mei", val: 48 }, { month: "Jun", val: 62 },
];

const stationPerformance = [
  { lokasi: "Jakarta SPKLU 1-B1", tipe: "FC 150kW/150kWe", avl: "2/4", ses: "148", kwh: "8,376", revenue: "Rp 1,306,636", status: "Online" },
  { lokasi: "Jakarta SPKLU 1-B2", tipe: "DC Fas: 50kW", avl: "7d", ses: "148", kwh: "8,576", revenue: "Rp 1,284,040", status: "Yellowline" },
  { lokasi: "Surabaya SPKLU02", tipe: "AC 44 kW/KW", avl: "3/4", ses: "148", kwh: "3,826", revenue: "Rp 1,369,040", status: "Online" },
  { lokasi: "Surabaya SPKLU04", tipe: "AC 3/4s", avl: "3/4", ses: "148", kwh: "4,376", revenue: "Rp 786,700", status: "Yellowline" },
  { lokasi: "Bandung SPKLU 1-B5", tipe: "FC 22kW/22kWe", avl: "4/4", ses: "148", kwh: "7,624", revenue: "Rp 187,290", status: "Online" },
];

const maxUsage = Math.max(...usagePerHour.map((d) => d.kwh));
const maxEvYear = Math.max(...evUsageYear.map((d) => d.val));

export default function SpkluPage() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <DashboardLayout title="Controlling Cabang · SPKLU" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">SPKLU EV Charging Dashboard</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Monitoring 580 Stasiun Pengisian Kendaraan Listrik · 14:52 WIB</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live Feed
            </span>
            <span className="text-[11px] text-slate-400">May 2, 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((card) => {
            const iconMap: Record<string, React.ReactNode> = {
              emerald: <Zap size={15} className="text-emerald-600" />, blue: <Activity size={15} className="text-blue-600" />,
              purple: <Zap size={15} className="text-purple-600" />, teal: <Gauge size={15} className="text-teal-600" />,
              amber: <AlertTriangle size={15} className="text-amber-600" />,
            };
            const bgMap: Record<string, string> = {
              emerald: "bg-emerald-50", blue: "bg-blue-50", purple: "bg-purple-50",
              teal: "bg-teal-50", amber: "bg-amber-50",
            };
            return (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 flex flex-col gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgMap[card.color] ?? "bg-slate-50"}`}>{iconMap[card.color] ?? <Zap size={15} />}</div>
                <p className="text-base font-bold text-slate-800 leading-tight">
                  {card.value}{"sub" in card && card.sub && <span className="text-sm font-medium text-slate-400 ml-0.5">{card.sub}</span>}
                  {"unit" in card && card.unit && <span className="text-[10px] font-medium text-slate-400 ml-1">{card.unit}</span>}
                </p>
                <p className="text-[10px] text-slate-400">{card.label}</p>
                <p className={`text-[10px] font-semibold ${card.positive ? "text-emerald-600" : "text-red-500"}`}>{card.change}</p>
              </div>
            );
          })}
        </div>

        {/* Map + CCTV */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">SPKLU Network — Indonesia</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Aktif</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />Maintenance</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full" />Offline</span>
                <span className="text-slate-400 ml-1">{spkluLocations.length} unit</span>
              </div>
            </div>
            <LocationMap
              locations={spkluLocations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, status: s.status }))}
              selectedId={selectedId}
              height="280px"
            />
          </div>

          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Live CCTV — SPKLU 3112345</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                <Radio size={10} className="animate-pulse" />LIVE
              </span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {cctvFeeds.map((feed) => (
                <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-800 h-28">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <div className="text-center"><Video size={18} className="text-slate-500 mx-auto mb-1" /><p className="text-[8px] text-slate-400 px-1 leading-tight">{feed.label}</p></div>
                  </div>
                  {feed.live && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1.5 text-[8px] text-white/40">14:52 WIB</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Usage Per Hour */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-slate-800">Usage Per Hour</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Live</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">kWh · Hari ini</p>
            <div className="relative h-24">
              <svg className="w-full h-full" viewBox={`0 0 ${usagePerHour.length * 40} 80`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e2d4d" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1e2d4d" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon fill="url(#usageGrad)" points={[
                  `${0 * 40 + 20},80`,
                  ...usagePerHour.map((d, i) => `${i * 40 + 20},${80 - (d.kwh / maxUsage) * 70}`),
                  `${(usagePerHour.length - 1) * 40 + 20},80`,
                ].join(" ")} />
                <polyline fill="none" stroke="#1e2d4d" strokeWidth="2"
                  points={usagePerHour.map((d, i) => `${i * 40 + 20},${80 - (d.kwh / maxUsage) * 70}`).join(" ")} />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {usagePerHour.filter((_, i) => i % 3 === 0).map((d) => (
                  <span key={d.time} className="text-[8px] text-slate-400">{d.time}</span>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2">Puncak: <span className="font-bold text-slate-700">510 kWh</span> · Rata-rata: <span className="font-bold text-slate-700">361 kWh</span></p>
          </div>

          {/* Peak Demand gauge */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-slate-800 mb-4">Peak Demand</span>
            <div className="relative w-32 h-20">
              <svg viewBox="0 0 120 70" className="w-full">
                <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#1e2d4d" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="157" strokeDashoffset={157 - (157 * 0.85)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <p className="text-2xl font-bold text-slate-800">85%</p>
                <p className="text-[9px] text-slate-400">kapasitas</p>
              </div>
            </div>
            <div className="flex gap-3 mt-3 text-[10px] text-slate-500">
              <span>0 <span className="text-slate-400">kW</span></span>
              <span className="flex-1 text-center text-slate-300">—</span>
              <span>100 <span className="text-slate-400">kW</span></span>
            </div>
          </div>

          {/* EV Usage Year */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-800">EV Usage / Year</span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <div className="flex items-end gap-2 h-20">
              {evUsageYear.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm bg-[#1e2d4d]" style={{ height: `${(d.val / maxEvYear) * 60}px` }} />
                  <span className="text-[8px] text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Station Performance + Energy Cost */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Station Performance Table</span>
              </div>
              <span className="text-[10px] text-slate-400">15 lokasi</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-500">
                    <th className="px-4 py-2.5 text-left font-semibold">LOKASI</th>
                    <th className="px-4 py-2.5 text-left font-semibold">TIPE</th>
                    <th className="px-4 py-2.5 text-left font-semibold">AVL</th>
                    <th className="px-4 py-2.5 text-left font-semibold">SES</th>
                    <th className="px-4 py-2.5 text-left font-semibold">KWH</th>
                    <th className="px-4 py-2.5 text-left font-semibold">REVENUE</th>
                    <th className="px-4 py-2.5 text-left font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {stationPerformance.map((row, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 text-[11px] font-semibold text-slate-800">{row.lokasi}</td>
                      <td className="px-4 py-2.5 text-[10px] text-slate-500">{row.tipe}</td>
                      <td className="px-4 py-2.5 text-[11px] font-bold text-[#1e2d4d]">{row.avl}</td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-600">{row.ses}</td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-600">{row.kwh}</td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-700 font-medium">{row.revenue}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${row.status === "Online" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Energy Cost Estimate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Energy Cost Estimate</span>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 mb-3">
              <p className="text-[10px] text-blue-500 font-semibold mb-2">Cost Calculation</p>
              <p className="text-base font-bold text-slate-800">IDR 1,500,000 <span className="text-slate-400 font-normal">= </span><span className="text-blue-600">IDR 5,244.30</span></p>
              <p className="text-sm font-bold text-slate-800 mt-1">IDR 15,500,000</p>
              <p className="text-[10px] text-slate-500 mt-1">Total Revenue Hari ini</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles size={10} className="text-purple-600" />
                <span className="text-[9px] font-bold text-purple-700">AI Insight</span>
              </div>
              <p className="text-[10px] text-purple-600 leading-relaxed">
                Utilisasi per konektor mencapai 125% di siang hari. Pertimbangkan penambahan 10 unit SPKLU di area puncak untuk meningkatkan revenue harian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
