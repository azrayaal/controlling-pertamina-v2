"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LocationMap from "@/components/dashboard/LocationMap";
import { useState } from "react";
import {
  TrendingUp, Droplets, Receipt, BarChart2, AlertTriangle,
  Video, Radio, Sparkles, ChevronRight, ShieldCheck,
} from "lucide-react";

const statCards = [
  { label: "Total Revenue", value: "IDR 124.5 B", sub: "Hari B · 390 customers", change: "+2% kemarin", positive: true, color: "blue" },
  { label: "Total Volume", value: "18,500 kL", sub: "kL Pertalite", change: "+0%  14.5%", positive: true, color: "emerald" },
  { label: "Transactions", value: "1,250,000", sub: "Trx Perhari", change: "+13%", positive: true, color: "purple" },
  { label: "Premium Ratio", value: "500 kL", sub: "Trx Kg Solar", change: "+3%", positive: true, color: "amber" },
  { label: "Issue Rate", value: "0.05%", sub: "All", change: "45  4-Hour Trading", positive: false, color: "red" },
];

const spbuLocations = [
  { id: 1, name: "SPBU Jakarta Selatan", status: "Active", lat: -6.21, lng: 106.84 },
  { id: 2, name: "SPBU Surabaya Timur", status: "Active", lat: -7.25, lng: 112.80 },
  { id: 3, name: "SPBU Bandung", status: "Active", lat: -6.92, lng: 107.60 },
  { id: 4, name: "SPBU Medan", status: "Active", lat: 3.58, lng: 98.67 },
  { id: 5, name: "SPBU Makassar", status: "Active", lat: -5.13, lng: 119.43 },
  { id: 6, name: "SPBU Semarang", status: "Active", lat: -6.97, lng: 110.42 },
  { id: 7, name: "SPBU Yogyakarta", status: "Active", lat: -7.80, lng: 110.37 },
  { id: 8, name: "SPBU Denpasar", status: "Active", lat: -8.67, lng: 115.22 },
  { id: 9, name: "SPBU Palembang", status: "Active", lat: -2.92, lng: 104.75 },
  { id: 10, name: "SPBU Pontianak", status: "Active", lat: -0.03, lng: 109.33 },
  { id: 11, name: "SPBU Pekanbaru", status: "Active", lat: 0.51, lng: 101.44 },
  { id: 12, name: "SPBU Balikpapan", status: "Active", lat: -1.27, lng: 116.83 },
  { id: 13, name: "SPBU Manado", status: "Maintenance", lat: 1.49, lng: 124.84 },
  { id: 14, name: "SPBU Jayapura", status: "Active", lat: -2.53, lng: 140.71 },
  { id: 15, name: "SPBU Kupang", status: "Active", lat: -10.17, lng: 123.61 },
];

const cctvFeeds = [
  { id: 1, label: "SPBU 3112345 — Nozzle A", live: true },
  { id: 2, label: "SPBU 3112345 — Kanopi", live: true },
  { id: 3, label: "SPBU 3112345 — Tangki", live: true },
  { id: 4, label: "SPBU 3112345 — Pintu Masuk", live: false },
  { id: 5, label: "SPBU 3112345 — Forecourt", live: true },
];

const CCTV_VIDEOS = [
  "/cctv/cctvvid1.mp4", "/cctv/cctvid2.mp4", "/cctv/cctvid3.mp4",
  "/cctv/cctvid4.mp4",  "/cctv/cctvid5.mp4",
];

const reconciliation = [
  { label: "Sisa Stok", value: "11,200.2 kL", change: "+2.1%", detail: "dari 11,977 kL TY", positive: true },
  { label: "Jumlah Jual", value: "18,500 kL", change: "-0.75%", detail: "dari 18,240 kL", positive: false },
  { label: "Trx Per Hari", value: "1,250,000", change: "+13%", detail: "dari 960 kL TY", positive: true },
  { label: "Potensi Rugi", value: "110,280 kL", change: "+0.05%", detail: "Potensi Kerugian", positive: false },
];

const nozzleSales = [
  { product: "Pertalite", icon: "🟢", sales: "+31.5M", trx: "41K", sta: "—", status: "Online" },
  { product: "Pertamax", icon: "🔵", sales: "+31.5M", trx: "19K", sta: "—", status: "Online" },
  { product: "Pertamax+", icon: "🟡", sales: "+14.6M", trx: "83K", sta: "—", status: "Online" },
  { product: "Solar", icon: "🟠", sales: "+23.1M", trx: "31K", sta: "—", status: "Online" },
  { product: "Bio Solar", icon: "🔶", sales: "+4.3M", trx: "67K", sta: "—", status: "Offline" },
  { product: "Pertamina DEX", icon: "🔴", sales: "+3.6M", trx: "48K", sta: "—", status: "Online" },
];

const subsidyData = [
  { month: "Jan", value: 82 }, { month: "Feb", value: 75 }, { month: "Mar", value: 88 },
  { month: "Apr", value: 70 }, { month: "Mei", value: 85 }, { month: "Jun", value: 78 },
  { month: "Jul", value: 90 }, { month: "Agu", value: 83 }, { month: "Sep", value: 76 },
  { month: "Okt", value: 89 }, { month: "Nov", value: 92 }, { month: "Des", value: 86 },
];

const aiFlagging = [
  { branch: "Jawa Selatan", alert: "error", issue: "Pencairan subsidi yang belum terkonfirmasi di 3 SPBU", suggestion: "Lakukan verifikasi data nozzle dan konfirmasi penyaluran subsidi ke pusat distribusi terdekat." },
  { branch: "Surabaya Timur", alert: "warning", issue: "Selisih volume antara meter fisik dan sistem POS", suggestion: "Lakukan kalibrasi ulang meter nozzle dan rekonsiliasi manual di 5 SPBU yang teridentifikasi." },
  { branch: "Medan Utara", alert: "info", issue: "Stok solar hampir habis, estimasi 6 jam lagi", suggestion: "Koordinasi pengiriman tanker dari Terminal Medan untuk pengisian stok darurat segera." },
  { branch: "Surabaya Barat", alert: "error", issue: "3 SPBU tidak mengirimkan laporan harian 2 hari berturut", suggestion: "Aktifkan protokol inspeksi lapangan dan notifikasi kepala cabang area barat." },
  { branch: "Semarang", alert: "warning", issue: "Ratio premium vs subsidi melebihi threshold 15%", suggestion: "Review kebijakan alokasi dan lakukan audit sampling di SPBU kategori A dan B wilayah ini." },
];

const maxSubsidy = Math.max(...subsidyData.map((d) => d.value));

export default function SpbuPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeView, setActiveView] = useState<"Bulan" | "Kuartal" | "Tahun">("Bulan");

  const selectedSpbu = spbuLocations.find((s) => s.id === selectedId) ?? spbuLocations[0];

  return (
    <DashboardLayout title="Controlling Cabang · SPBU" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Distribution &amp; Retail Control — SPBU</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Monitoring 4,121 SPBU se-nusantara · Diperbarui 14:52 WIB</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Feed
            </span>
            <span className="text-[11px] text-slate-400">May 2, 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3.5 flex flex-col gap-1">
              <p className="text-base font-bold text-slate-800 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-400">{card.label}</p>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
              <p className={`text-[10px] font-semibold ${card.positive ? "text-emerald-600" : "text-red-500"}`}>{card.change}</p>
            </div>
          ))}
        </div>

        {/* Map + CCTV */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Map */}
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">SPBU Network — Indonesia</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Aktif</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" />Maintenance</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full" />Offline</span>
                <span className="text-slate-400 ml-1">{spbuLocations.length} unit</span>
              </div>
            </div>
            <LocationMap
              locations={spbuLocations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name, status: s.status }))}
              selectedId={selectedId}
              height="280px"
            />
          </div>

          {/* Live CCTV */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video size={13} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Live CCTV — SPBU 3112345</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                <Radio size={10} className="animate-pulse" />LIVE
              </span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {cctvFeeds.slice(0, 4).map((feed, i) => (
                <div key={feed.id} className="relative rounded-lg overflow-hidden bg-slate-900 h-24">
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
              {cctvFeeds[4] && (
                <div className="col-span-2 relative rounded-lg overflow-hidden bg-slate-900 h-20">
                  <video
                    src={CCTV_VIDEOS[4 % CCTV_VIDEOS.length]}
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)" }} />
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse" />LIVE
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white/80 text-[7px] font-semibold truncate">{cctvFeeds[4].label}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reconciliation + Eligibility */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-800">Stock vs Sales Reconciliation</span>
              <span className="text-[10px] text-slate-400">Real-time · PTB and 4th, KKa</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reconciliation.map((r) => (
                <div key={r.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400 mb-1">{r.label}</p>
                  <p className="text-base font-bold text-slate-800 leading-tight">{r.value}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${r.positive ? "text-emerald-600" : "text-red-500"}`}>{r.change}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-[#1e2d4d]" />
              <span className="text-sm font-semibold text-slate-800">Eligibility Status</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "High", value: 82, color: "bg-emerald-500", pct: 82 },
                { label: "Medium", value: 115, color: "bg-amber-400", pct: 100 },
                { label: "Low", value: 48, color: "bg-red-500", pct: 48 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 w-14">{item.label}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 w-6 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subsidy Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={14} className="text-[#1e2d4d]" />
              <div>
                <span className="text-sm font-semibold text-slate-800">Subsidy Control Panel</span>
                <p className="text-[10px] text-slate-400">Quota Usage 5% da · Payut</p>
              </div>
            </div>
            <div className="flex gap-1">
              {(["Bulan", "Kuartal", "Tahun"] as const).map((v) => (
                <button key={v} onClick={() => setActiveView(v)} className={`text-[10px] px-2.5 py-1 rounded font-medium transition-colors ${activeView === v ? "bg-[#1e2d4d] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{v}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {subsidyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end" style={{ height: "100px" }}>
                  <div className="w-full rounded-t-md bg-[#1e2d4d]" style={{ height: `${(d.value / maxSubsidy) * 100}%` }} />
                </div>
                <span className="text-[8px] text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nozzle Sales + AI Flagging */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Nozzle Sales Monitor */}
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-[#1e2d4d]" />
                <span className="text-sm font-semibold text-slate-800">Nozzle Sales Monitor</span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <button className="bg-[#1e2d4d] text-white px-2 py-0.5 rounded-full font-medium">All</button>
                <button className="text-slate-500 px-2 py-0.5 rounded-full">Online</button>
                <button className="text-slate-500 px-2 py-0.5 rounded-full">Offline</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-500">
                    <th className="px-4 py-2.5 text-left font-semibold">PRODUK</th>
                    <th className="px-4 py-2.5 text-left font-semibold">SALES</th>
                    <th className="px-4 py-2.5 text-left font-semibold">TRX</th>
                    <th className="px-4 py-2.5 text-left font-semibold">STA</th>
                    <th className="px-4 py-2.5 text-left font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {nozzleSales.map((row) => (
                    <tr key={row.product} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 text-[11px] font-semibold text-slate-800 flex items-center gap-2">
                        <span>{row.icon}</span>{row.product}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] font-bold text-emerald-600">{row.sales}</td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-600">{row.trx}</td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-400">{row.sta}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${row.status === "Online" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <div className="flex items-start gap-2 p-3 pb-2">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${item.alert === "error" ? "bg-red-400" : item.alert === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold ${item.alert === "error" ? "text-red-700" : item.alert === "warning" ? "text-amber-700" : "text-blue-700"}`}>{item.branch}</p>
                      <p className={`text-[10px] leading-tight mt-0.5 ${item.alert === "error" ? "text-red-600" : item.alert === "warning" ? "text-amber-600" : "text-blue-600"}`}>{item.issue}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-300 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className={`mx-3 mb-3 p-2 rounded-lg ${item.alert === "error" ? "bg-red-100/60" : item.alert === "warning" ? "bg-amber-100/60" : "bg-blue-100/60"}`}>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
