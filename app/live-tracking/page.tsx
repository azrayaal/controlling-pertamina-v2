"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { vessels, trucks } from "@/lib/mockData";
import {
  Search, Ship, Truck, MessageSquare, Phone,
  Video, ChevronDown, X, Anchor, Camera,
  RadioTower, AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";

const LiveTrackingMap = dynamic(
  () => import("@/components/dashboard/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center rounded-xl">
        <span className="text-slate-400 text-sm">Loading map…</span>
      </div>
    ),
  }
);

type ActiveTab = "all" | "vessel" | "truck";
type SelectedItem = { type: "vessel"; id: string } | { type: "truck"; id: string } | null;

const vesselTypeColor: Record<string, string> = {
  "Oil Tanker":     "bg-blue-100 text-blue-700",
  "Product Tanker": "bg-emerald-100 text-emerald-700",
  "LPG Tanker":     "bg-amber-100 text-amber-700",
  "VLCC":           "bg-purple-100 text-purple-700",
};
const vesselDot: Record<string, string> = {
  "Oil Tanker":     "bg-[#1e2d4d]",
  "Product Tanker": "bg-teal-500",
  "LPG Tanker":     "bg-amber-500",
  "VLCC":           "bg-purple-600",
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

// ── CCTV Grid ─────────────────────────────────────────────────────────────────
const camColors = ["#1e3a5f","#0f3d2e","#3b1f5e","#3b2a00"];
function CctvGrid({ cams }: { cams: { id:string; name:string; status:string }[] }) {
  return (
    <div className="px-3 py-2.5 border-b border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase">Live CCTV</p>
        <a href="/live-cctv" className="text-[9px] text-blue-500 font-semibold hover:underline flex items-center gap-0.5">
          <Video size={9}/> Full View
        </a>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {cams.map((cam, i) => (
          <div
            key={cam.id}
            className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center"
            style={{ background: camColors[i % camColors.length], aspectRatio: "16/9" }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)" }}
            />
            <Camera size={14} className="text-white/60 mb-1" />
            <p className="text-white/80 text-[8px] font-semibold text-center leading-tight px-1">{cam.name}</p>
            {/* LIVE badge */}
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse"/>
              <span className="text-white text-[7px] font-bold">LIVE</span>
            </div>
            {cam.status === "Alert" && (
              <div className="absolute top-1 left-1">
                <AlertTriangle size={10} className="text-amber-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Vessel Detail Panel ────────────────────────────────────────────────────────
function VesselDetailPanel({ vesselId, onClose }: { vesselId: string; onClose: () => void }) {
  const v = vessels.find((x) => x.id === vesselId);
  if (!v) return null;
  const typeColor = vesselTypeColor[v.type] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="w-full lg:w-[270px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden overflow-y-auto" style={{ maxHeight: "100%" }}>
      {/* Ship illustration */}
      <div className="relative w-full flex-shrink-0" style={{ height: 120 }}>
        <svg viewBox="0 0 270 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0369a1"/>
              <stop offset="100%" stopColor="#0c4a6e"/>
            </linearGradient>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a"/>
              <stop offset="100%" stopColor="#1e3a5f"/>
            </linearGradient>
          </defs>
          <rect width="270" height="120" fill="url(#skyGrad)"/>
          <rect y="78" width="270" height="42" fill="url(#seaGrad)" opacity="0.9"/>
          {/* Stars */}
          {[[20,12],[60,8],[100,15],[145,6],[200,10],[240,14]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity="0.7"/>
          ))}
          {/* Hull */}
          <path d="M15,74 L255,74 L262,86 L8,86 Z" fill="#b91c1c"/>
          <rect x="15" y="68" width="240" height="6" fill="#dc2626"/>
          {/* Superstructure */}
          <rect x="25" y="44" width="70" height="30" rx="3" fill="#334155"/>
          <rect x="30" y="30" width="50" height="16" rx="2" fill="#1e293b"/>
          <rect x="40" y="22" width="5" height="10" fill="#94a3b8"/>
          <rect x="55" y="25" width="4" height="8" fill="#94a3b8"/>
          {/* Windows */}
          {[35,47,59,71].map((wx,i) => <rect key={i} x={wx} y="34" width="6" height="5" rx="1" fill="#38bdf8" opacity="0.8"/>)}
          {/* Cargo tanks */}
          <rect x="100" y="58" width="155" height="10" rx="1" fill="#475569"/>
          {[115,140,165,190,215,240].map((cx,i)=> <circle key={i} cx={cx} cy="65" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="0.5"/>)}
          {/* Waterline */}
          <path d="M8,88 Q70,93 135,88 Q200,83 262,88" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.6"/>
        </svg>
        <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
          <X size={11} className="text-white" />
        </button>
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${typeColor}`}>{v.type}</span>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusBadge[v.status] ?? ""}`}>{v.status}</span>
        </div>
      </div>

      {/* Name & route */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-800">{v.name}</p>
        <p className="text-[10px] text-slate-400">IMO {v.imo} · MMSI {v.mmsi} · Flag {v.flag}</p>
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
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${v.progress}%` }} />
          </div>
          <span className="text-[9px] text-slate-500 font-medium">{v.progress}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-b border-slate-100 flex-shrink-0">
        {[
          { label: "Speed",  value: v.speed },
          { label: "ETA",    value: v.eta },
          { label: "Heading",value: v.heading },
          { label: "Cargo",  value: v.cargoVolume },
        ].map((s, i) => (
          <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[9px] text-slate-400">{s.label}</p>
            <p className="text-[12px] font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cargo */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1">CARGO</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Anchor size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-800">{v.cargo}</p>
            <p className="text-[10px] text-slate-500">{v.cargoVolume} · DWT {v.dwt}</p>
          </div>
        </div>
      </div>

      {/* Vessel specs */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1.5">VESSEL SPECS</p>
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {[{ label: "Length", value: v.length },{ label: "Beam", value: v.beam },{ label: "Built", value: v.built }].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-lg px-1 py-1.5">
              <p className="text-[9px] text-slate-400">{s.label}</p>
              <p className="text-[11px] font-bold text-slate-700">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Captain */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1">CAPTAIN</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {v.captain.replace("Capt. ","").split(" ").map((n)=>n[0]).join("").slice(0,2)}
            </div>
            <p className="text-[11px] font-semibold text-slate-800">{v.captain}</p>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <MessageSquare size={11} className="text-blue-500"/>
            </button>
            <button className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors">
              <Phone size={11} className="text-emerald-500"/>
            </button>
          </div>
        </div>
      </div>

      {/* CCTV */}
      {v.cctv && <CctvGrid cams={v.cctv} />}

      {/* Actions */}
      <div className="px-3 py-3 flex gap-2 mt-auto">
        <a href="/live-cctv" className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg bg-slate-800 text-white text-[11px] font-semibold hover:bg-slate-700 transition-colors">
          <Video size={12}/>Live CCTV
        </a>
        <button className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors">
          <RadioTower size={12}/>Detail
        </button>
      </div>
    </div>
  );
}

// ── Truck Detail Panel ─────────────────────────────────────────────────────────
function TruckDetailPanel({ truckId, onClose }: { truckId: string; onClose: () => void }) {
  const t = trucks.find((x) => x.id === truckId);
  if (!t) return null;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(t.rating));

  return (
    <div className="w-full lg:w-[270px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden overflow-y-auto" style={{ maxHeight: "100%" }}>
      {/* Truck image */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 120 }}>
        <Image src="/truck1.png" alt={t.plateNumber} fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
          <X size={11} className="text-white" />
        </button>
        <div className="absolute bottom-2 left-2">
          <p className="text-white text-sm font-bold drop-shadow">{t.plateNumber}</p>
        </div>
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusBadge[t.status] ?? "bg-slate-100 text-slate-700"}`}>{t.status}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 border-b border-slate-100 flex-shrink-0">
        {[
          { label: "Load Volume", value: t.speed },
          { label: "Total Distance", value: t.distance === "—" ? "— km" : t.distance },
          { label: "Drive Time", value: t.duration === "—" ? "—" : t.duration },
          { label: "ETA", value: t.eta === "—" ? "Loading" : t.eta },
        ].map((s, i) => (
          <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[9px] text-slate-400">{s.label}</p>
            <p className="text-[12px] font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Route */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-2">ROUTE</p>
        <div className="flex flex-col gap-1.5">
          {[
            { dot: "bg-emerald-500", label: "Origin", value: t.origin, check: true },
            { dot: "bg-blue-500", label: "In Transit", value: "On the way", check: t.phase === "In Transit" },
            { dot: "bg-slate-300", label: "Destination", value: t.destination, check: false },
          ].map((step) => (
            <div key={step.label} className="flex items-start gap-2">
              <div className={`w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0 ${step.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-slate-400">{step.label}</p>
                <p className="text-[11px] font-semibold text-slate-700 truncate">{step.value}</p>
              </div>
              {step.check && <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 8 8" width="8" height="8"><path d="M1 4l2 2 4-3" stroke="white" strokeWidth="1.2" fill="none"/></svg>
              </div>}
            </div>
          ))}
        </div>
      </div>

      {/* Driver */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1">DRIVER</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              {t.driver.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">{t.driver}</p>
              <div className="flex gap-0.5 mt-0.5">
                {stars.map((filled, i) => (
                  <svg key={i} viewBox="0 0 10 10" width="10" height="10">
                    <path d="M5 1l1.2 2.4L9 3.8l-2 1.9.5 2.7L5 7.1 2.5 8.4l.5-2.7L1 3.8l2.8-.4z" fill={filled ? "#f59e0b" : "#e2e8f0"}/>
                  </svg>
                ))}
                <span className="text-[9px] text-slate-500 ml-1">{t.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
              <MessageSquare size={11} className="text-blue-500"/>
            </button>
            <button className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors">
              <Phone size={11} className="text-emerald-500"/>
            </button>
          </div>
        </div>
      </div>

      {/* Fuel load */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 mb-1.5">MUATAN BBM</p>
        <div className="flex flex-col gap-1">
          {t.fuelLoad.map((f) => (
            <div key={f.type} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${fuelColors[f.type] ?? "bg-slate-400"}`} />
                <span className="text-[10px] text-slate-600">{f.type}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-700">{f.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CCTV */}
      {t.cctv && <CctvGrid cams={t.cctv} />}

      {/* Actions */}
      <div className="px-3 py-3 flex gap-2 mt-auto">
        <a href="/live-cctv" className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg bg-slate-800 text-white text-[11px] font-semibold hover:bg-slate-700 transition-colors">
          <Video size={12}/>Live CCTV
        </a>
        <button className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-colors">
          <ChevronDown size={12}/>Detail
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function LiveTrackingPage() {
  const [activeTab, setActiveTab]   = useState<ActiveTab>("all");
  const [selected, setSelected]     = useState<SelectedItem>(null);
  const [searchQ, setSearchQ]       = useState("");

  const handleVesselClick = useCallback((id: string) => {
    setSelected((prev) => (prev?.type === "vessel" && prev.id === id ? null : { type: "vessel", id }));
  }, []);
  const handleTruckClick = useCallback((id: string) => {
    setSelected((prev) => (prev?.type === "truck" && prev.id === id ? null : { type: "truck", id }));
  }, []);

  const filteredVessels = vessels.filter((v) =>
    (activeTab === "all" || activeTab === "vessel") &&
    (v.name.toLowerCase().includes(searchQ.toLowerCase()) || v.captain.toLowerCase().includes(searchQ.toLowerCase()))
  );
  const filteredTrucks = trucks.filter((t) =>
    (activeTab === "all" || activeTab === "truck") &&
    (t.plateNumber.toLowerCase().includes(searchQ.toLowerCase()) || t.driver.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const selectedVesselId = selected?.type === "vessel" ? selected.id : null;
  const selectedTruckId  = selected?.type === "truck"  ? selected.id : null;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 h-full">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Live Tracking</h1>
            <p className="text-xs text-slate-500">
              {vessels.length} kapal · {trucks.length} truk aktif terpantau secara real-time
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e2d4d] inline-block"/>Oil Tanker
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"/>Product Tanker
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"/>LPG Tanker
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"/>VLCC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"/>Truck
            </span>
          </div>
        </div>

        {/* Main layout — column on mobile/tablet, 3-col row on lg+ */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0 lg:h-[calc(100vh-180px)]">

          {/* ── Left panel: list ─────────────────────────────────────────── */}
          <div className="lg:w-[240px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden max-h-[45vh] lg:max-h-none">
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center gap-2 px-3 h-8 bg-slate-50 rounded-lg">
                <Search size={13} className="text-slate-400 flex-shrink-0"/>
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Cari kapal / truk…"
                  className="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {(["all","vessel","truck"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs py-2 font-semibold transition-colors ${activeTab === tab ? "text-[#1e2d4d] border-b-2 border-[#1e2d4d]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {tab === "all" ? "Semua" : tab === "vessel" ? "Kapal" : "Truk"}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {/* Vessels */}
              {filteredVessels.length > 0 && (
                <>
                  {activeTab === "all" && (
                    <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
                      <Ship size={11} className="text-slate-400"/>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Kapal Tanker</span>
                    </div>
                  )}
                  {filteredVessels.map((v) => {
                    const isActive = selectedVesselId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVesselClick(v.id)}
                        className={`w-full text-left px-3 py-2.5 border-b border-slate-50 flex gap-2.5 transition-colors ${isActive ? "bg-[#1e2d4d]/5 border-l-2 border-l-[#1e2d4d]" : "hover:bg-slate-50"}`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <span className={`w-2.5 h-2.5 rounded-full block ${vesselDot[v.type] ?? "bg-slate-400"}`}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[12px] font-semibold text-slate-800 truncate">{v.name}</p>
                            <span className={`text-[8px] font-semibold px-1 py-0.5 rounded flex-shrink-0 ${statusBadge[v.status] ?? ""}`}>{v.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{v.port} → {v.destPort}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <div className="flex-1 h-1 bg-slate-100 rounded-full">
                              <div className="h-1 bg-blue-400 rounded-full" style={{ width: `${v.progress}%` }}/>
                            </div>
                            <span className="text-[8px] text-slate-400 flex-shrink-0">{v.progress}%</span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5">{v.speed} · ETA {v.eta}</p>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {/* Trucks */}
              {filteredTrucks.length > 0 && (
                <>
                  {activeTab === "all" && (
                    <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
                      <Truck size={11} className="text-slate-400"/>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Armada Truk</span>
                    </div>
                  )}
                  {filteredTrucks.map((t) => {
                    const isActive = selectedTruckId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTruckClick(t.id)}
                        className={`w-full text-left px-3 py-2.5 border-b border-slate-50 flex gap-2.5 transition-colors ${isActive ? "bg-red-50 border-l-2 border-l-red-400" : "hover:bg-slate-50"}`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image src="/truck1.png" alt={t.plateNumber} fill style={{ objectFit: "cover" }}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-[12px] font-bold text-slate-800">{t.plateNumber}</p>
                            <span className={`text-[8px] font-semibold px-1 py-0.5 rounded flex-shrink-0 ${statusBadge[t.status] ?? ""}`}>{t.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{t.driver}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{t.origin} → {t.destination}</p>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {filteredVessels.length === 0 && filteredTrucks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Search size={24} className="mb-2 opacity-40"/>
                  <p className="text-xs">Tidak ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Center: map ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative min-h-[320px] lg:min-h-0">
            <LiveTrackingMap
              vessels={vessels}
              trucks={trucks}
              selectedVesselId={selectedVesselId}
              selectedTruckId={selectedTruckId}
              onVesselClick={handleVesselClick}
              onTruckClick={handleTruckClick}
              height="100%"
            />
            {/* Map overlay info bar */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-white/50 flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"/>
                {vessels.length} kapal online
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"/>
                {trucks.length} truk aktif
              </span>
              {selected && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600 font-semibold">
                    {selected.type === "vessel"
                      ? vessels.find(v=>v.id===selected.id)?.name
                      : trucks.find(t=>t.id===selected.id)?.plateNumber
                    } selected
                  </span>
                  <button onClick={() => setSelected(null)} className="ml-0.5 text-slate-400 hover:text-red-500">
                    <X size={11}/>
                  </button>
                </>
              )}
            </div>
            {!selected && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-full pointer-events-none">
                Klik marker di peta untuk melihat detail
              </div>
            )}
          </div>

          {/* ── Right: detail panel ──────────────────────────────────────── */}
          {selected ? (
            selected.type === "vessel" ? (
              <VesselDetailPanel vesselId={selected.id} onClose={() => setSelected(null)} />
            ) : (
              <TruckDetailPanel truckId={selected.id} onClose={() => setSelected(null)} />
            )
          ) : (
            <div className="hidden lg:flex lg:w-[270px] flex-shrink-0 bg-white/60 rounded-2xl border border-dashed border-slate-200 flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Camera size={22} className="text-slate-300"/>
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-semibold text-slate-500">Pilih Kendaraan</p>
                <p className="text-xs mt-1 leading-relaxed">Klik marker di peta atau pilih dari daftar untuk melihat detail, driver, dan live CCTV.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
