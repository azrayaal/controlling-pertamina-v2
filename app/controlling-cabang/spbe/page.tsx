"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  Flame, Package, Activity, AlertTriangle, Gauge,
  Video, Radio, Sparkles, ChevronRight, ClipboardList,
  ShieldAlert, BarChart2,
} from "lucide-react";

const statCards = [
  { label: "Stasiun Aktif", value: "185", sub: "/ 201", change: "Beroperasi", positive: true, color: "emerald" },
  { label: "Total Volume", value: "4,250", unit: "MT", sub: "kgs distributed", change: "-3%", positive: false, color: "blue" },
  { label: "Tabung Tersalur", value: "18,750", unit: "unit", sub: "avg/hari", change: "+2.1%", positive: true, color: "purple" },
  { label: "Availability", value: "91.43%", sub: "Tdk Aktif: 3%", change: "Persentase", positive: true, color: "teal" },
  { label: "Active Alerts", value: "2", sub: "Alert", change: "Perlu Tindakan", positive: false, color: "red" },
  { label: "Total Revenue", value: "IDR 8.2 B", sub: "Bulan ini", change: "+5.1%", positive: true, color: "emerald" },
];

const spbeLocations = [
  { id: 1, name: "SPBE Jakarta Timur", status: "Active", lat: -6.23, lng: 106.90 },
  { id: 2, name: "SPBE Jakarta Barat", status: "Active", lat: -6.18, lng: 106.76 },
  { id: 3, name: "SPBE Surabaya", status: "Active", lat: -7.28, lng: 112.76 },
  { id: 4, name: "SPBE Bandung", status: "Active", lat: -6.93, lng: 107.58 },
  { id: 5, name: "SPBE Medan", status: "Active", lat: 3.56, lng: 98.66 },
  { id: 6, name: "SPBE Makassar", status: "Maintenance", lat: -5.15, lng: 119.42 },
  { id: 7, name: "SPBE Semarang", status: "Active", lat: -6.99, lng: 110.40 },
  { id: 8, name: "SPBE Yogyakarta", status: "Active", lat: -7.82, lng: 110.38 },
  { id: 9, name: "SPBE Bali", status: "Active", lat: -8.68, lng: 115.20 },
  { id: 10, name: "SPBE Palembang", status: "Active", lat: -2.95, lng: 104.73 },
  { id: 11, name: "SPBE Pekanbaru", status: "Active", lat: 0.52, lng: 101.46 },
  { id: 12, name: "SPBE Balikpapan", status: "Active", lat: -1.28, lng: 116.82 },
  { id: 13, name: "SPBE Pontianak", status: "Active", lat: -0.04, lng: 109.34 },
  { id: 14, name: "SPBE Manado", status: "Active", lat: 1.47, lng: 124.82 },
  { id: 15, name: "SPBE Kupang", status: "Maintenance", lat: -10.18, lng: 123.62 },
];

const cctvFeeds = [
  { id: 1, label: "SPBE U3112345 — Filling Bay", live: true },
  { id: 2, label: "SPBE U3112345 — Gudang", live: true },
  { id: 3, label: "SPBE U3112345 — Loading", live: true },
  { id: 4, label: "SPBE U3112345 — Security", live: false },
];

const CCTV_VIDEOS = [
  "/cctv/cctvvid1.mp4", "/cctv/cctvid2.mp4", "/cctv/cctvid3.mp4",
  "/cctv/cctvid4.mp4",  "/cctv/cctvid5.mp4",
];

const reconciliation = [
  { label: "Saldo Awal", value: "285,000", unit: "unit", change: "+1.2%", detail: "stok tabung masuk", positive: true },
  { label: "Penerimaan", value: "12,450", unit: "unit", change: "+0.75%", detail: "Trx distribusi", positive: true },
  { label: "Selisih", value: "54", unit: "unit", change: "+0%", detail: "unit tidak terdeteksi", positive: false },
  { label: "Saldo Akhir", value: "272,466", unit: "unit", change: "+0.2%", detail: "stok tersisa", positive: true },
];

const inspeksiData = [
  { spbe: "SPBE-22", lokasi: "SPBE Dep 22", tipe: "Pertim Audits", jadwal: "14:45 37:55", status: "Selesai" },
  { spbe: "SPBE-38", lokasi: "SPBE Dep 2", tipe: "Pertim Audits", jadwal: "22/03/2025", status: "Pending" },
  { spbe: "3.3 850", lokasi: "4-Way lik", tipe: "St Nicholas", jadwal: "24/05/2025", status: "Pending" },
  { spbe: "3.3 850", lokasi: "4-Way lik", tipe: "St Nicholas", jadwal: "25/06/2026", status: "Baru" },
];

const gasDispensingData = [
  { label: "LPG 3 kg", value: 2400, change: "+2,000", color: "#1e2d4d", positive: true },
  { label: "LPG 5.5 kg", value: 1860, change: "+3,200", color: "#2563eb", positive: true },
  { label: "LPG 12 kg", value: 2350, change: "-1,200", color: "#f59e0b", positive: false },
];

const gasVolumeData = [
  { label: "LPG 3kg", val: 60, color: "#1e2d4d" },
  { label: "LPG 5.5kg", val: 45, color: "#2563eb" },
  { label: "LPG 12kg", val: 80, color: "#f59e0b" },
  { label: "LPG 50kg", val: 30, color: "#059669" },
  { label: "Bulk", val: 55, color: "#7c3aed" },
];

const pressureMonitor = [
  { id: "SPBE Bali-01", level: 92, status: "Normal" },
  { id: "SPBE Bali-02", level: 78, status: "Normal" },
  { id: "SPBE Bali-03", level: 65, status: "Normal" },
  { id: "SPBE Bali-04", level: 35, status: "Alert" },
  { id: "SPBE Bali-05", level: 88, status: "Normal" },
];

const wilayahData = [
  { label: "Jawa", val: 345, color: "#1e2d4d" },
  { label: "Bali & NTT", val: 99, color: "#1e2d4d" },
  { label: "Sumatera", val: 45, color: "#1e2d4d" },
  { label: "Kalimantan", val: 55, color: "#1e2d4d" },
  { label: "Maluku", val: 41, color: "#1e2d4d" },
];

const aiFlagging = [
  { branch: "Jawa Selatan", alert: "error", issue: "Pengiriman tabung yang belum terkonfirmasi di 3 SPBE wilayah", suggestion: "Lakukan verifikasi data kiriman dan konfirmasi penerimaan tabung ke agen distribusi terdekat." },
  { branch: "Surabaya Timur", alert: "warning", issue: "Selisih tabung antara manifest fisik dan sistem ERP", suggestion: "Aktifkan audit sampling dan rekonsiliasi manual di 4 SPBE yang teridentifikasi selisih." },
  { branch: "Medan Utara", alert: "info", issue: "Stok LPG 3kg hampir habis, estimasi 8 jam lagi", suggestion: "Koordinasi pengiriman dari depo Belawan untuk pengisian stok darurat pagi hari ini." },
  { branch: "Semarang Tengah", alert: "error", issue: "2 SPBE tidak kirim laporan harian selama 3 hari", suggestion: "Aktifkan inspeksi lapangan dan hubungi pengelola SPBE serta kepala cabang setempat." },
];

const safetyPriority = [
  { id: "SPBE-20 pt.01", alamat: "Jalan Pantai Jl...", status: "Error", label: "Urgent" },
  { id: "SPBE-31 B8", alamat: "Sumber Kelola 5..", status: "Active", label: null },
  { id: "SPBE-Sby-01", alamat: "Jalan Brawijaya...", status: "Pending", label: null },
  { id: "SPBE-Sby-03", alamat: "Jalan Gatot Subroto...", status: "Error", label: null },
];

const maxGasVol = Math.max(...gasVolumeData.map((d) => d.val));
const maxWilayah = Math.max(...wilayahData.map((d) => d.val));

export default function SpbePage() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <DashboardLayout title="Controlling Cabang · SPBE" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">SPBE — Stasiun Pengisian Bahan Bakar Elpiji</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Monitoring 185/201 SPBE Aktif · Distribusi 18,750 unit/hari · 14:52 WIB</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live Feed
            </span>
            <span className="text-[11px] text-slate-400">May 9, 2025</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((card) => {
            const iconMap: Record<string, React.ReactNode> = {
              emerald: <Flame size={15} className="text-emerald-600" />, blue: <Package size={15} className="text-blue-600" />,
              purple: <Activity size={15} className="text-purple-600" />, teal: <Gauge size={15} className="text-teal-600" />,
              red: <AlertTriangle size={15} className="text-red-500" />,
            };
            const bgMap: Record<string, string> = {
              emerald: "bg-emerald-50", blue: "bg-blue-50", purple: "bg-purple-50",
              teal: "bg-teal-50", red: "bg-red-50",
            };
            return (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 flex flex-col gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgMap[card.color] ?? "bg-slate-50"}`}>{iconMap[card.color] ?? <Flame size={15} />}</div>
                <p className="text-base font-bold text-slate-800 leading-tight">
                  {card.value}{"sub" in card && card.color !== "teal" && card.sub && <span className="text-sm font-medium text-slate-400 ml-0.5">{card.sub}</span>}
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
              <span className="text-sm font-semibold text-slate-800">SPBE Network — Indonesia</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Aktif</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />Maintenance</span>
                <span className="text-slate-400 ml-1">{spbeLocations.length} unit</span>
              </div>
            </div>
            <LocationMap
              locations={spbeLocations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, status: s.status }))}
              selectedId={selectedId}
              height="280px"
            />
          </div>

          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Live CCTV — SPBE U3112345</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                <Radio size={10} className="animate-pulse" />LIVE FEED
              </span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {cctvFeeds.map((feed, i) => (
                <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-900 h-28">
                  <video
                    src={CCTV_VIDEOS[i % CCTV_VIDEOS.length]}
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)" }} />
                  {feed.live && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white/80 text-[7px] font-semibold truncate">{feed.label}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 text-[7px] text-white/50 font-mono">14:52</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supply Reconciliation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Supply &amp; Inventory Reconciliation — LPG 3 kg</span>
              </div>
              <span className="text-[10px] text-slate-400">Real-time · 14:52 WIB</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reconciliation.map((r) => (
                <div key={r.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400 mb-1">{r.label}</p>
                  <p className="text-base font-bold text-slate-800">{r.value} <span className="text-[10px] font-medium text-slate-400">{r.unit}</span></p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${r.positive ? "text-emerald-600" : "text-red-500"}`}>{r.change}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inspeksi + Gas Dispensing + Pressure Monitoring */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Jadwal Inspeksi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardList size={14} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Jadwal Inspeksi Keselamatan</span>
              </div>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">+ Jadwal Baru</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-500">
                    <th className="px-3 py-2 text-left font-semibold">SPBE</th>
                    <th className="px-3 py-2 text-left font-semibold">LOKASI</th>
                    <th className="px-3 py-2 text-left font-semibold">JADWAL</th>
                    <th className="px-3 py-2 text-left font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {inspeksiData.map((row, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-[10px] font-semibold text-slate-800">{row.spbe}</td>
                      <td className="px-3 py-2 text-[10px] text-slate-500">{row.lokasi}</td>
                      <td className="px-3 py-2 text-[10px] text-slate-500">{row.jadwal}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          row.status === "Selesai" ? "bg-emerald-100 text-emerald-600" :
                          row.status === "Baru" ? "bg-blue-100 text-blue-600" :
                          "bg-amber-100 text-amber-600"
                        }`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gas Dispensing Monitor */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Gas Dispensing Monitor</span>
            </div>
            <div className="space-y-2.5 mb-4">
              {gasDispensingData.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-slate-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800">{item.value.toLocaleString()}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${item.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-slate-800">Volume per Wilayah (MT)</span>
              <button className="text-[9px] bg-[#1e2d4d] text-white px-2 py-0.5 rounded ml-auto">+ Ekspor</button>
            </div>
            <div className="flex items-end gap-2 h-16">
              {gasVolumeData.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${(d.val / maxGasVol) * 50}px`, backgroundColor: d.color }} />
                  <span className="text-[7px] text-slate-400 text-center leading-tight">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pressure Monitoring */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Pressure Monitoring — Bali</span>
            </div>
            <div className="space-y-2.5">
              {pressureMonitor.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-slate-600">{item.id}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${item.status === "Alert" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>{item.status}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.status === "Alert" ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${item.level}%` }} />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[8px] text-slate-400">{item.level}%</span>
                    {item.status === "Alert" && (
                      <span className="text-[8px] text-red-500 font-medium">⚠ Perlu Perhatian</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selling per Wilayah + AI Flagging + Safety */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Selling per Wilayah */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Selling per Wilayah</span>
            </div>
            <div className="space-y-2.5">
              {wilayahData.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 w-20">{item.label}</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#1e2d4d]" style={{ width: `${(item.val / maxWilayah) * 100}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 w-8 text-right">{item.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-purple-50 p-3">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles size={9} className="text-purple-600" />
                <span className="text-[9px] font-bold text-purple-700">AI Insight</span>
              </div>
              <p className="text-[9px] text-purple-600 leading-relaxed">
                Distribusi di wilayah Jawa mencapai puncak tertinggi. Perlu penambahan 12% kapasitas tabung untuk bulan depan guna menghindari kelangkaan.
              </p>
            </div>
          </div>

          {/* AI Flagging Queue */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">AI Flagging Queue</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />{aiFlagging.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {aiFlagging.map((item, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${item.alert === "error" ? "bg-red-50" : item.alert === "warning" ? "bg-amber-50" : "bg-blue-50"}`}>
                  <div className="flex items-start gap-2 p-3 pb-1.5">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${item.alert === "error" ? "bg-red-400" : item.alert === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold ${item.alert === "error" ? "text-red-700" : item.alert === "warning" ? "text-amber-700" : "text-blue-700"}`}>{item.branch}</p>
                      <p className={`text-[10px] leading-tight mt-0.5 ${item.alert === "error" ? "text-red-600" : item.alert === "warning" ? "text-amber-600" : "text-blue-600"}`}>{item.issue}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-300 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className={`mx-3 mb-2.5 p-2 rounded-lg ${item.alert === "error" ? "bg-red-100/60" : item.alert === "warning" ? "bg-amber-100/60" : "bg-blue-100/60"}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles size={9} className={item.alert === "error" ? "text-red-600" : item.alert === "warning" ? "text-amber-600" : "text-blue-600"} />
                      <span className={`text-[9px] font-bold ${item.alert === "error" ? "text-red-700" : item.alert === "warning" ? "text-amber-700" : "text-blue-700"}`}>AI Suggestion</span>
                    </div>
                    <p className={`text-[9px] leading-relaxed ${item.alert === "error" ? "text-red-600" : item.alert === "warning" ? "text-amber-600" : "text-blue-600"}`}>{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Prioritized */}
          <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-red-500" />
                <span className="text-sm font-semibold text-slate-800">Safety Prioritized</span>
              </div>
              <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-semibold">7 aktif</span>
            </div>
            <div className="space-y-2">
              {safetyPriority.map((item, i) => (
                <div key={i} className={`p-2.5 rounded-lg ${item.status === "Error" ? "bg-red-50" : "bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-slate-800">{item.id}</span>
                    {item.label && <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{item.label}</span>}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">{item.alamat}</p>
                  <span className={`text-[8px] font-semibold mt-1 inline-block px-1.5 py-0.5 rounded-full ${
                    item.status === "Error" ? "bg-red-100 text-red-600" :
                    item.status === "Active" ? "bg-emerald-100 text-emerald-600" :
                    "bg-amber-100 text-amber-600"
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
