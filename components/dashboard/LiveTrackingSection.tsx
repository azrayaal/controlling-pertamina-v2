"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { trucks, vessels } from "@/lib/mockData";
import {
  MessageSquare, Phone, Video, ChevronDown, AlertTriangle,
  Ship, MapPin, Navigation, Package,
} from "lucide-react";
import { useState, useCallback } from "react";

const LiveTrackingMap = dynamic(() => import("./LiveTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-slate-400 text-xs">Loading map…</span>
      </div>
    </div>
  ),
});

const supplySteps = [
  { label: "Oil Platform",     done: true,  color: "bg-emerald-500 border-emerald-500" },
  { label: "Refinery Unit",    done: true,  color: "bg-purple-500 border-purple-500" },
  { label: "Storage Terminal", done: true,  color: "bg-emerald-500 border-emerald-500" },
  { label: "Logistic Network", done: true,  color: "bg-blue-500 border-blue-500" },
  { label: "SPBU Depot",       done: false, color: "bg-slate-300 border-slate-300" },
];

const fuelColors: Record<string, string> = {
  Pertalite:           "bg-emerald-500",
  Pertamax:            "bg-blue-500",
  "Pertamax Turbo":    "bg-indigo-500",
  "Pertamina DEX":     "bg-amber-500",
  Solar:               "bg-yellow-500",
  "Bio Solar":         "bg-green-600",
};

const cargoColors: Record<string, string> = {
  Pertalite:           "#10b981",
  Pertamax:            "#3b82f6",
  "Pertamax Turbo":    "#f97316",
  Avtur:               "#06b6d4",
  Solar:               "#eab308",
  LPG:                 "#a78bfa",
};

const CCTV_VIDEOS = [
  "/cctv/cctvvid1.mp4", "/cctv/cctvid2.mp4", "/cctv/cctvid3.mp4",
  "/cctv/cctvid4.mp4",  "/cctv/cctvid5.mp4",
];

function CctvGrid({ cams }: { cams: { id: string; name: string; status: string }[] }) {
  return (
    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase">Live CCTV</p>
        <a
          href="/live-cctv"
          className="text-[9px] text-blue-500 font-semibold hover:underline flex items-center gap-0.5"
        >
          <Video size={8} /> Full View
        </a>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {cams.map((cam, i) => (
          <div
            key={cam.id}
            className="relative rounded-lg overflow-hidden bg-slate-900"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              src={CCTV_VIDEOS[i % CCTV_VIDEOS.length]}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)" }}
            />
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[6px] font-bold">LIVE</span>
            </div>
            {cam.status === "Alert" && (
              <div className="absolute top-1 left-1">
                <AlertTriangle size={8} className="text-amber-400" />
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 px-1 py-0.5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white/80 text-[6.5px] font-semibold truncate">{cam.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveTrackingSection() {
  const [selectedTruckId,  setSelectedTruckId]  = useState<string | null>(trucks[0].id);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);

  const handleTruckClick = useCallback((id: string) => {
    setSelectedTruckId((prev) => (prev === id ? null : id));
    setSelectedVesselId(null);
  }, []);

  const handleVesselClick = useCallback((id: string) => {
    setSelectedVesselId((prev) => (prev === id ? null : id));
    setSelectedTruckId(null);
  }, []);

  const truck  = trucks.find((t) => t.id === selectedTruckId) ?? trucks[0];
  const vessel = selectedVesselId ? vessels.find((v) => v.id === selectedVesselId) : null;

  // Legend items
  const infraLegend = [
    { label: "SPBU",      color: "#22c55e" },
    { label: "Kilang",    color: "#f97316" },
    { label: "Storage",   color: "#8b5cf6" },
    { label: "Terminal",  color: "#14b8a6" },
    { label: "Upstream",  color: "#3b82f6" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Live Tracking</h3>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
          {vessels.length} kapal · {trucks.length} truk
        </span>
        {/* Truck selector dots */}
        <div className="flex gap-1">
          {trucks.slice(0, 6).map((t) => (
            <button
              key={t.id}
              onClick={() => handleTruckClick(t.id)}
              title={t.plateNumber}
              className={`w-2 h-2 rounded-full transition-all ${
                t.id === selectedTruckId ? "bg-red-500 scale-125" : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
          {vessels.slice(0, 4).map((v) => (
            <button
              key={v.id}
              onClick={() => handleVesselClick(v.id)}
              title={v.name}
              className={`w-2 h-2 rounded-full transition-all ${
                v.id === selectedVesselId ? "bg-blue-500 scale-125" : "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body — stacked on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Map */}
        <div className="relative flex-1 min-w-0 overflow-hidden min-h-[260px] md:min-h-0">
          <LiveTrackingMap
            vessels={vessels}
            trucks={trucks}
            selectedVesselId={selectedVesselId}
            selectedTruckId={selectedTruckId}
            onVesselClick={handleVesselClick}
            onTruckClick={handleTruckClick}
            mapType="street"
            activeFilter="all"
            height="100%"
          />

          {/* Hint overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/55 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap z-[400]">
            Klik marker untuk detail
          </div>

          {/* Infrastructure legend */}
          <div className="absolute bottom-8 right-2 z-[400] bg-white/92 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-2.5 py-2 shadow-md border border-white/50 dark:border-slate-700">
            <p className="text-[7px] text-slate-400 uppercase font-bold tracking-wider mb-1">Infrastruktur</p>
            {infraLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[8px] text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-3 h-px flex-shrink-0" style={{ borderTop: "1.5px dashed #1e2d4d" }} />
                <span className="text-[8px] text-slate-500 dark:text-slate-400">Kapal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-px flex-shrink-0" style={{ borderTop: "1.5px dashed #e63946" }} />
                <span className="text-[8px] text-slate-500 dark:text-slate-400">Truk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel — shows vessel or truck info depending on selection */}
        <div className="md:w-[220px] flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 flex flex-col overflow-y-auto bg-white dark:bg-[#1e293b] max-h-[380px] md:max-h-none">

          {/* ── Vessel detail ── */}
          {vessel ? (
            <>
              {/* Vessel header */}
              <div className="relative w-full flex-shrink-0 overflow-hidden bg-[#1e2d4d]" style={{ height: 80 }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ship size={36} className="text-white/20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                <div className="absolute bottom-1.5 left-2">
                  <span className="text-white text-[10px] font-bold drop-shadow">{vessel.name}</span>
                </div>
              </div>

              <div className="px-3 pt-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{vessel.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {vessel.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{vessel.idCode} · {vessel.flag}</p>
              </div>

              {/* Vessel stats */}
              <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-700">
                {[
                  { label: "Kecepatan",  value: vessel.speed },
                  { label: "Heading",    value: vessel.heading },
                  { label: "DWT",        value: vessel.dwt },
                  { label: "ETA",        value: vessel.eta },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`px-2.5 py-1.5 ${i % 2 === 0 ? "border-r border-slate-100 dark:border-slate-700" : ""} ${i < 2 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}
                  >
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">{item.label}</p>
                    <p className="text-[12px] font-bold mt-0.5 text-slate-800 dark:text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Route */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1 mb-1">
                  <Navigation size={9} className="text-slate-400" />
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">Rute</p>
                </div>
                <div className="grid grid-cols-3 text-center gap-1">
                  <div>
                    <p className="text-[8px] text-slate-400">Dari</p>
                    <p className="text-[9px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">{vessel.port}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400">Jarak</p>
                    <p className="text-[9px] font-bold text-slate-800 dark:text-slate-100">{vessel.totalDistance}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400">Ke</p>
                    <p className="text-[9px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">{vessel.destPort}</p>
                  </div>
                </div>
                {/* Progress */}
                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${vessel.progress}%` }} />
                </div>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5 text-right">{vessel.progress}% selesai</p>
              </div>

              {/* Cargo breakdown */}
              {vessel.cargoBreakdown && vessel.cargoBreakdown.length > 0 && (
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Package size={9} className="text-slate-400" />
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">Muatan</p>
                    <span className="ml-auto text-[9px] font-bold text-slate-700 dark:text-slate-200">{vessel.cargoVolume}</span>
                  </div>
                  {vessel.cargoBreakdown.map((cb) => (
                    <div key={cb.type} className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cargoColors[cb.type] ?? cb.color }}
                        />
                        {cb.type}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{cb.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Kapten */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-1">Kapten</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1e2d4d] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                    {vessel.captain.split(" ").map((n) => n[0]).filter((_, i) => i < 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-100 truncate">{vessel.captain}</p>
                    <p className="text-[9px] text-slate-400">{vessel.captainId}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600">★{vessel.captainRating}</span>
                </div>
              </div>

              {/* CCTV */}
              {vessel.cctv && <CctvGrid cams={vessel.cctv} />}

              {/* Footer */}
              <div className="px-3 py-2.5 mt-auto flex-shrink-0">
                <a
                  href="/live-tracking"
                  className="block w-full py-2 rounded-lg bg-[#1e2d4d] text-[10px] text-white font-bold hover:bg-[#2a3f6d] transition-colors text-center"
                >
                  Detail Lengkap
                </a>
              </div>
            </>
          ) : (
            /* ── Truck detail (default) ── */
            <>
              {/* Truck photo */}
              <div className="relative w-full flex-shrink-0 overflow-hidden bg-slate-100" style={{ height: 100 }}>
                <Image
                  src="/truck1.png"
                  alt="Pertamina Tanker Truck"
                  fill
                  className="object-cover"
                  sizes="220px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div className="absolute bottom-1.5 left-2">
                  <span className="text-white text-[10px] font-bold drop-shadow">{truck.plateNumber}</span>
                </div>
              </div>

              {/* Plate & status */}
              <div className="px-3 pt-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{truck.plateNumber}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      truck.status === "Loading"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {truck.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Pertamina Tanker · 24KL</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500">{truck.origin}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-700">
                {[
                  { label: "Load Volume",    value: truck.speed },
                  { label: "Total Distance", value: truck.distance },
                  { label: "Drive Time",     value: truck.duration },
                  { label: "ETA",            value: truck.eta === "—" ? "Loading" : truck.eta },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`px-2.5 py-1.5 ${i % 2 === 0 ? "border-r border-slate-100 dark:border-slate-700" : ""} ${i < 2 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}
                  >
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                      {item.label} <ChevronDown size={8} className="text-slate-300" />
                    </p>
                    <p className="text-[12px] font-bold mt-0.5 text-slate-800 dark:text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Supply chain journey */}
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Supply Chain Journey</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold">
                    {truck.phase}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {supplySteps.map((step, i) => (
                    <div key={step.label} className="flex items-center">
                      {i > 0 && (
                        <div className={`h-px w-2 ${step.done ? "bg-blue-300" : "bg-slate-200 dark:bg-slate-600"}`} />
                      )}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${step.color}`}>
                          {step.done && (
                            <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                              <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[6.5px] text-slate-400 text-center leading-tight w-8">
                          {step.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-1.5">Driver</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 text-[10px] font-bold flex-shrink-0">
                    {truck.driver.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate">{truck.driver}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500">{truck.driverPhone ?? "—"}</p>
                  </div>
                  <div className="w-9 h-9 flex-shrink-0">
                    <svg viewBox="0 0 40 40" className="w-full h-full">
                      <circle cx="20" cy="20" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                      <circle cx="20" cy="20" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5"
                        strokeDasharray={`${(truck.rating / 5) * 87.96} 87.96`}
                        strokeLinecap="round" transform="rotate(-90 20 20)" />
                      <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">{truck.rating}</text>
                      <text x="20" y="30" textAnchor="middle" fontSize="5.5" fill="#94a3b8">Score</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chat / Call */}
              <div className="px-3 py-2 flex gap-1.5 border-b border-slate-100 dark:border-slate-700">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <MessageSquare size={10} /> Chat
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Phone size={10} /> Call
                </button>
              </div>

              {/* From / To / ETA */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="grid grid-cols-3 text-center gap-1 mb-1">
                  <div>
                    <p className="text-[8px] text-slate-400">From</p>
                    <p className="text-[9px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">{truck.origin}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400">ETA</p>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                      {truck.eta === "—" ? "Loading" : truck.eta}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400">To</p>
                    <p className="text-[9px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">{truck.destination}</p>
                  </div>
                </div>
              </div>

              {/* Fuel load */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                  <span>Load</span>
                  <span>Total {truck.speed}</span>
                </div>
                {truck.fuelLoad.map((f) => (
                  <div key={f.type} className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fuelColors[f.type] ?? "bg-slate-400"}`} />
                      {f.type}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{f.amount}</span>
                  </div>
                ))}
              </div>

              {/* CCTV */}
              {truck.cctv && <CctvGrid cams={truck.cctv} />}

              {/* Footer buttons */}
              <div className="px-3 py-2.5 mt-auto flex-shrink-0">
                <div className="flex gap-1.5">
                  <a
                    href="/live-cctv"
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg border border-slate-200 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-1"
                  >
                    <Video size={10} /> Live CCTV
                  </a>
                  <a
                    href="/live-tracking"
                    className="flex-1 py-2 rounded-lg bg-[#1e2d4d] text-[10px] text-white font-bold hover:bg-[#2a3f6d] transition-colors text-center"
                  >
                    Detail
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
