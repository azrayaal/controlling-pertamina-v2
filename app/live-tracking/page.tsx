"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { vessels, trucks } from "@/lib/mockData";
import { Search, Ship, Truck, MessageSquare, Phone, Video, ChevronDown, X, LayoutGrid, Anchor } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";

const IndonesiaMap = dynamic(() => import("@/components/dashboard/IndonesiaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center rounded-xl">
      <span className="text-slate-400 text-sm">Loading map…</span>
    </div>
  ),
});

type ActiveTab = "all" | "vessel" | "truck";
type SelectedItem = { type: "vessel"; id: string } | { type: "truck"; id: string } | null;

const vesselTypeColor: Record<string, string> = {
  "Oil Tanker":     "bg-blue-100 text-blue-700",
  "Product Tanker": "bg-emerald-100 text-emerald-700",
  "LPG Tanker":     "bg-amber-100 text-amber-700",
  "VLCC":           "bg-purple-100 text-purple-700",
};

const statusBadge: Record<string, string> = {
  "En Route": "bg-emerald-100 text-emerald-700",
  "Delayed":  "bg-red-100 text-red-700",
  "Loading":  "bg-amber-100 text-amber-700",
  "Active":   "bg-emerald-100 text-emerald-700",
};

const fuelColors: Record<string, string> = {
  Pertalite:           "bg-emerald-500",
  Pertamax:            "bg-blue-500",
  "Pertamax Turbo":    "bg-indigo-500",
  "Pertamina DEX":     "bg-amber-500",
  Solar:               "bg-yellow-500",
  "Bio Solar":         "bg-green-600",
};

// ── Vessel Detail Panel ────────────────────────────────────────────────────────
function VesselDetailPanel({ vesselId, onClose }: { vesselId: string; onClose: () => void }) {
  const v = vessels.find((x) => x.id === vesselId);
  if (!v) return null;
  const typeColor = vesselTypeColor[v.type] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="w-[260px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      {/* Vessel image placeholder */}
      <div className="relative w-full h-[130px] bg-slate-800 flex-shrink-0 overflow-hidden">
        <svg viewBox="0 0 260 130" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="260" height="130" fill="#1e293b"/>
          {/* Sea */}
          <rect y="80" width="260" height="50" fill="#164e63" opacity="0.7"/>
          {/* Hull */}
          <path d="M20,75 L240,75 L250,90 L10,90 Z" fill="#dc2626"/>
          {/* Superstructure */}
          <rect x="30" y="45" width="60" height="30" rx="2" fill="#475569"/>
          <rect x="35" y="30" width="40" height="16" rx="2" fill="#334155"/>
          <rect x="45" y="20" width="5" height="12" fill="#94a3b8"/>
          <rect x="60" y="22" width="4" height="10" fill="#94a3b8"/>
          {/* Cargo deck */}
          <rect x="95" y="65" width="140" height="10" rx="1" fill="#dc2626"/>
          <circle cx="120" cy="68" r="4" fill="#fbbf24"/>
          <circle cx="150" cy="68" r="4" fill="#fbbf24"/>
          <circle cx="180" cy="68" r="4" fill="#fbbf24"/>
          <circle cx="210" cy="68" r="4" fill="#fbbf24"/>
          {/* Waterline reflection */}
          <path d="M10,92 Q60,96 130,92 Q200,88 250,92" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.5"/>
          {/* Text */}
          <text x="130" y="112" textAnchor="middle" fill="#94a3b8" fontSize="9">{v.name}</text>
        </svg>
        <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
          <X size={12} className="text-white" />
        </button>
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${typeColor}`}>{v.type}</span>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusBadge[v.status] ?? ""}`}>{v.status}</span>
        </div>
      </div>

      {/* Name & route */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-800">{v.name}</p>
        <p className="text-[10px] text-slate-400">IMO {v.imo} · MMSI {v.mmsi}</p>
        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
          <div className="flex-1">
            <p className="text-[9px] text-slate-400">FROM</p>
            <p className="font-semibold text-slate-700">{v.callSign} {v.port}</p>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex-1 text-right">
            <p className="text-[9px] text-slate-400">TO</p>
            <p className="font-semibold text-slate-700">{v.destCallSign} {v.destPort}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${v.progress}%` }} />
          </div>
          <span className="text-[9px] text-slate-500 font-medium">{v.progress}%</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 border-b border-slate-100 flex-shrink-0">
        {[
          { label: "Speed",    value: v.speed },
          { label: "Heading",  value: v.heading },
          { label: "ETA",      value: v.eta },
          { label: "Cargo",    value: v.cargoVolume },
        ].map((s, i) => (
          <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[9px] text-slate-400">{s.label}</p>
            <p className="text-[12px] font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cargo info */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1">CARGO</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Anchor size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-800">{v.cargo}</p>
            <p className="text-[10px] text-slate-500">{v.cargoVolume} · {v.dwt} DWT</p>
          </div>
        </div>
      </div>

      {/* Vessel specs */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1.5">VESSEL SPECS</p>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[
            { label: "Length", value: v.length },
            { label: "Beam",   value: v.beam },
            { label: "Built",  value: v.built },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-lg px-1 py-1.5">
              <p className="text-[9px] text-slate-400">{s.label}</p>
              <p className="text-[11px] font-bold text-slate-700">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Captain */}
      <div className="px-3 py-2 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1">CAPTAIN</p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {v.captain.replace("Capt. ", "").split(" ").map((n) => n[0]).join("").slice(0,2)}
          </div>
          <p className="text-[11px] font-semibold text-slate-800">{v.captain}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-2.5 mt-auto flex-shrink-0">
        <div className="flex gap-1.5 mb-1.5">
          <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
            <MessageSquare size={10} /> Contact
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Phone size={10} /> Call
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1e2d4d] text-[10px] text-white font-bold hover:bg-[#2a3f6d] transition-colors">
          <Video size={10} /> Live CCTV &nbsp; Detail
        </button>
      </div>
    </div>
  );
}

// ── Truck Detail Panel ─────────────────────────────────────────────────────────
function TruckDetailPanel({ truckId, onClose }: { truckId: string; onClose: () => void }) {
  const t = trucks.find((x) => x.id === truckId);
  if (!t) return null;

  const supplySteps = [
    { label: "Oil Platform",     done: true,  color: "bg-emerald-500" },
    { label: "Refinery Unit",    done: true,  color: "bg-purple-500" },
    { label: "Storage Terminal", done: true,  color: "bg-emerald-500" },
    { label: "Logistic Network", done: true,  color: "bg-blue-500" },
    { label: "SPBU Depot",       done: false, color: "bg-slate-300" },
  ];

  return (
    <div className="w-[260px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      {/* Truck photo */}
      <div className="relative w-full h-[130px] flex-shrink-0 overflow-hidden bg-slate-100">
        <Image src="/truck1.png" alt="Tanker Truck" fill className="object-cover" sizes="260px" priority />
        <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
          <X size={12} className="text-white" />
        </button>
        <span className={`absolute top-2 left-2 text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusBadge[t.status] ?? "bg-slate-100 text-slate-700"}`}>
          {t.status}
        </span>
      </div>

      {/* Plate & ID */}
      <div className="px-3 pt-2 pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">{t.plateNumber}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusBadge[t.status] ?? ""}`}>{t.status}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">Pertamina Tanker · 24KL</p>
        <p className="text-[9px] text-slate-300">ID: TRK-{t.id.toUpperCase()}-LGS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-b border-slate-100 flex-shrink-0">
        {[
          { label: "Load Volume",    value: t.speed },
          { label: "Total Distance", value: t.distance },
          { label: "Drive Time",     value: t.duration, noChevron: true },
          { label: "Warnings",       value: "1 ⚠", warn: true },
        ].map((item, i) => (
          <div key={item.label} className={`px-2.5 py-1.5 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[9px] text-slate-400 flex items-center gap-0.5">
              {item.label} <ChevronDown size={8} className="text-slate-300" />
            </p>
            <p className={`text-[12px] font-bold mt-0.5 ${item.warn ? "text-amber-500" : "text-slate-800"}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Supply chain */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-slate-600">Supply Chain Journey</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{t.phase}</span>
        </div>
        <div className="flex items-center justify-between">
          {supplySteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              {i > 0 && <div className={`h-px w-2 ${step.done ? "bg-blue-300" : "bg-slate-200"}`} />}
              <div className="flex flex-col items-center gap-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.done ? step.color + " border-transparent" : "border-slate-300 bg-slate-50"}`}>
                  {step.done && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[7px] text-slate-400 text-center leading-tight w-9">{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver */}
      <div className="px-3 py-2 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1.5">Driver</p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {t.driver.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-800 truncate">{t.driver}</p>
            <p className="text-[9px] text-slate-400">SBT{Math.floor(Math.random() * 90000 + 10000)}</p>
          </div>
          <div className="w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5"
                strokeDasharray={`${(t.rating / 5) * 87.96} 87.96`}
                strokeLinecap="round" transform="rotate(-90 20 20)"
              />
              <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">{t.rating}</text>
              <text x="20" y="30" textAnchor="middle" fontSize="5.5" fill="#94a3b8">Score</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Chat/Call */}
      <div className="px-3 py-2 flex gap-1.5 border-b border-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
          <MessageSquare size={10} /> Chat
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
          <Phone size={10} /> Call
        </button>
      </div>

      {/* From / To */}
      <div className="px-3 py-2 border-b border-slate-100">
        <div className="grid grid-cols-3 text-center gap-1">
          <div>
            <p className="text-[8px] text-slate-400">From</p>
            <p className="text-[10px] font-semibold text-slate-700 leading-tight">{t.origin}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-400">ETA</p>
            <p className="text-[12px] font-bold text-slate-800">{t.eta}</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-400">To</p>
            <p className="text-[10px] font-semibold text-slate-700 leading-tight">{t.destination}</p>
          </div>
        </div>
      </div>

      {/* Fuel load */}
      <div className="px-3 py-2 border-b border-slate-100">
        <div className="flex justify-between text-[9px] text-slate-400 mb-1">
          <span>Load</span>
          <span>Total {t.fuelLoad.reduce((s, f) => s + parseInt(f.amount), 0).toLocaleString()} F</span>
        </div>
        {t.fuelLoad.map((f) => (
          <div key={f.type} className="flex items-center justify-between text-[10px] mb-1">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fuelColors[f.type] ?? "bg-slate-400"}`} />
              {f.type}
            </span>
            <span className="text-slate-700 font-medium">{f.amount}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 mt-auto flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Video size={10} /> Live CCTV
          </button>
          <button className="flex-1 py-2 rounded-lg bg-[#1e2d4d] text-[10px] text-white font-bold hover:bg-[#2a3f6d] transition-colors">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function LiveTrackingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selected, setSelected] = useState<SelectedItem>({ type: "vessel", id: "v1" });

  const showVessels = activeTab === "all" || activeTab === "vessel";
  const showTrucks  = activeTab === "all" || activeTab === "truck";

  return (
    <DashboardLayout title="Live Tracking" subtitle="Vessel, Truck & Pipeline Monitoring – 360°">
      <div className="flex gap-4 h-[calc(100vh-120px)]">

        {/* ── Left list panel ── */}
        <div className="w-64 flex flex-col gap-2 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Cari kapal / truk / rute…"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            {([
              { id: "all",    icon: LayoutGrid, label: "Semua" },
              { id: "vessel", icon: Ship,        label: "Kapal" },
              { id: "truck",  icon: Truck,       label: "Truk" },
            ] as { id: ActiveTab; icon: React.ElementType; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  activeTab === tab.id ? "bg-[#1e2d4d] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">

            {/* Vessels */}
            {showVessels && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                  <Ship size={12} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">Kapal</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{vessels.length}</span>
                </div>
                {vessels.map((v) => {
                  const isSelected = selected?.type === "vessel" && selected.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelected({ type: "vessel", id: v.id })}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 text-left transition-colors ${
                        isSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Ship illustration thumbnail */}
                      <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 flex items-center justify-center">
                        <Ship size={16} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{v.name}</p>
                          <span className={`text-[8px] font-semibold px-1 py-0.5 rounded flex-shrink-0 ${statusBadge[v.status] ?? ""}`}>{v.status}</span>
                        </div>
                        <p className="text-[9px] text-slate-500">{v.callSign} → {v.destCallSign}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="flex-1 h-1 bg-slate-100 rounded-full">
                            <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${v.progress}%` }} />
                          </div>
                          <span className="text-[8px] text-slate-400">{v.eta}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Trucks */}
            {showTrucks && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                  <Truck size={12} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">Truk</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">{trucks.length}</span>
                </div>
                {trucks.map((t) => {
                  const isSelected = selected?.type === "truck" && selected.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelected({ type: "truck", id: t.id })}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 text-left transition-colors ${
                        isSelected ? "bg-emerald-50 border-l-2 border-l-emerald-500" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image src="/truck1.png" alt="Truck" fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[11px] font-bold text-slate-800">{t.plateNumber}</p>
                          <span className={`text-[8px] font-semibold px-1 py-0.5 rounded flex-shrink-0 ${statusBadge[t.status] ?? ""}`}>{t.status}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 truncate">{t.driver}</p>
                        <p className="text-[9px] text-slate-400">ETA {t.eta} · {t.distance}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Map ── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-w-0">
          <IndonesiaMap height="100%" />

          {/* Live badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 text-[11px] font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AIS Tracking Live
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
            <p className="text-[10px] font-semibold text-slate-700 mb-1.5">Legenda</p>
            {[
              { color: "bg-[#1e2d4d]", label: "Kapal Tanker" },
              { color: "bg-[#e63946]", label: "Truk Distribusi" },
              { color: "bg-amber-500", label: "LPG Tanker" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-600 mb-1">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel (vessel or truck) ── */}
        {selected?.type === "vessel" && (
          <VesselDetailPanel
            vesselId={selected.id}
            onClose={() => setSelected(null)}
          />
        )}
        {selected?.type === "truck" && (
          <TruckDetailPanel
            truckId={selected.id}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
