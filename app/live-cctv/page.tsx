"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cctvLocations } from "@/lib/mockData";
import type { CctvCategory, CctvRegion, CctvLocation } from "@/lib/mockData";
import { Camera, Search, RefreshCw, X, WifiOff, AlertTriangle } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

const CctvMap = dynamic(() => import("@/components/dashboard/CctvMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-slate-400 text-sm font-medium">Loading Map…</span>
      </div>
    </div>
  ),
});

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES: { key: string; label: string; icon: string; pinpoint: string; color: string }[] = [
  { key: "Semua",    label: "Semua",    icon: "",                       pinpoint: "",                          color: "#64748b" },
  { key: "SPBU",     label: "SPBU",     icon: "/spbuicon.png",          pinpoint: "/spbuiconpinpoint.png",     color: "#22c55e" },
  { key: "Kilang",   label: "Kilang",   icon: "/kilangicon.png",        pinpoint: "/kilangiconpinpoint.png",   color: "#f97316" },
  { key: "Storage",  label: "Storage",  icon: "/storageicon.png",       pinpoint: "/storageiconpinpoint.png",  color: "#8b5cf6" },
  { key: "Terminal", label: "Terminal", icon: "/terminalicon.png",      pinpoint: "/terminaliconpinpoint.png", color: "#14b8a6" },
  { key: "Upstream", label: "Upstream", icon: "/upstreamicon.png",      pinpoint: "/upstreamiconpinpoint.png", color: "#3b82f6" },
];

const CAT_COLOR: Record<string, string> = {
  SPBU:     "bg-emerald-100 text-emerald-700",
  Kilang:   "bg-orange-100 text-orange-700",
  Storage:  "bg-violet-100 text-violet-700",
  Terminal: "bg-teal-100 text-teal-700",
  Upstream: "bg-blue-100 text-blue-700",
};

const REGIONS: { key: string; label: string }[] = [
  { key: "Semua",      label: "Semua" },
  { key: "Jawa",       label: "Jawa" },
  { key: "Sumatera",   label: "Sumatera" },
  { key: "Kalimantan", label: "Kalimantan" },
  { key: "Sulawesi",   label: "Sulawesi" },
  { key: "Bali & NTT", label: "Bali & NTT" },
  { key: "Maluku",     label: "Maluku" },
  { key: "Papua",      label: "Papua" },
];

const CCTV_IMAGES = [
  "/cctv/cctv1.png", "/cctv/cctv2.png", "/cctv/cctv3.png",
  "/cctv/cctv4.png", "/cctv/cctv5.png", "/cctv/cctv6.png",
  "/cctv/cctv7.png", "/cctv/cctv8.png", "/cctv/cctv9.png",
];

// ── Camera feed simulation ────────────────────────────────────────────────────
function CamFeed({ cam, locationName }: { cam: { id: string; name: string; status: string }; locationName: string }) {
  const idx     = parseInt(cam.id.replace(/\D/g, "")) % CCTV_IMAGES.length;
  const imgSrc  = CCTV_IMAGES[idx];
  const isAlert   = cam.status === "Alert";
  const isOffline = cam.status === "Offline";
  const ts = `${String(10 + idx).padStart(2, "0")}:${String(idx * 7 % 60).padStart(2, "0")}:${String(idx * 13 % 60).padStart(2, "0")}`;

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-slate-900"
      style={{ aspectRatio: "16/9" }}
    >
      {/* CCTV image feed */}
      {!isOffline && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={cam.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isAlert ? 0.75 : 0.88 }}
        />
      )}

      {/* Scanline overlay for realism */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.4) 2px,rgba(0,0,0,.4) 4px)" }} />

      {isOffline ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90">
          <WifiOff size={22} className="text-slate-500 mb-2" />
          <p className="text-slate-400 text-sm font-medium">Offline</p>
        </div>
      ) : (
        <>
          {/* Alert red tint */}
          {isAlert && <div className="absolute inset-0 bg-red-900/25 pointer-events-none" />}

          {/* Top-left badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md font-bold text-xs"
            style={{ background: isAlert ? "rgba(220,38,38,.92)" : "rgba(16,185,129,.92)", color: "#fff" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {isAlert ? "ALERT" : "LIVE"}
          </div>

          {/* Timestamp top-right */}
          <div className="absolute top-2 right-2 font-mono text-xs text-emerald-300 font-semibold drop-shadow">
            {ts}
          </div>

          {/* Alert overlay icon */}
          {isAlert && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AlertTriangle size={28} className="text-red-400 drop-shadow-lg opacity-80" />
            </div>
          )}
        </>
      )}

      {/* Bottom labels */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs font-semibold truncate">{cam.name}</p>
        <p className="text-white/60 text-[11px] truncate">{locationName}</p>
      </div>
    </div>
  );
}

// ── Location list item ────────────────────────────────────────────────────────
function LocationRow({
  loc,
  isSelected,
  onClick,
}: { loc: CctvLocation; isSelected: boolean; onClick: () => void }) {
  const online  = loc.cameras.filter((c) => c.status === "Live").length;
  const alerts  = loc.cameras.filter((c) => c.status === "Alert").length;
  const offline = loc.cameras.filter((c) => c.status === "Offline").length;
  const catCfg  = CATEGORIES.find((c) => c.key === loc.type);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-50 transition-colors text-left group ${
        isSelected
          ? "bg-blue-50 border-l-2 border-l-blue-500"
          : "hover:bg-slate-50 border-l-2 border-l-transparent"
      }`}
    >
      {/* Category icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-50">
        {catCfg?.icon ? (
          <div className="relative w-5 h-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={catCfg.icon} alt={loc.type} className="w-full h-full object-contain" />
          </div>
        ) : (
          <Camera size={14} className="text-slate-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-[12px] font-semibold truncate ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
          {loc.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {/* Region badge */}
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {loc.region}
          </span>
          {/* Type badge */}
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${CAT_COLOR[loc.type] ?? "bg-slate-100 text-slate-600"}`}>
            {loc.type}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-[9px]">
          {online > 0  && <span className="text-emerald-600 font-semibold">● {online} online</span>}
          {alerts > 0  && <span className="text-red-500 font-semibold">⚠ {alerts} alert</span>}
          {offline > 0 && <span className="text-slate-400">◯ {offline} off</span>}
        </div>
      </div>

      {/* Camera count + arrow */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="flex items-center gap-0.5 text-slate-400">
          <Camera size={10} />
          <span className="text-[10px] font-semibold">{loc.cameras.length}</span>
        </div>
        <svg viewBox="0 0 8 12" width="6" height="10" className="text-slate-300 group-hover:text-slate-400">
          <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LiveCCTVPage() {
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [catFilter,   setCatFilter]   = useState("Semua");
  const [regFilter,   setRegFilter]   = useState("Semua");
  const [searchQ,     setSearchQ]     = useState("");

  const selectedLoc = useMemo(
    () => cctvLocations.find((l) => l.id === selectedId) ?? null,
    [selectedId]
  );

  // Global stats
  const totalCams   = cctvLocations.reduce((s, l) => s + l.cameras.length, 0);
  const totalOnline = cctvLocations.reduce((s, l) => s + l.cameras.filter((c) => c.status === "Live").length, 0);
  const totalAlert  = cctvLocations.reduce((s, l) => s + l.cameras.filter((c) => c.status === "Alert").length, 0);
  const totalOff    = cctvLocations.reduce((s, l) => s + l.cameras.filter((c) => c.status === "Offline").length, 0);

  // Filtered locations for list
  const filteredLocs = useMemo(() => {
    return cctvLocations.filter((l) => {
      const catOk = catFilter === "Semua" || l.type === catFilter;
      const regOk = regFilter === "Semua" || l.region === regFilter;
      const srchOk = searchQ === "" ||
        l.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        l.location.toLowerCase().includes(searchQ.toLowerCase());
      return catOk && regOk && srchOk;
    });
  }, [catFilter, regFilter, searchQ]);

  // Region counts
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cctvLocations.forEach((l) => {
      counts[l.region] = (counts[l.region] ?? 0) + 1;
    });
    return counts;
  }, []);

  return (
    <DashboardLayout title="Live CCTV · Monitor Lokasi & Cabang" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="flex flex-col gap-3 h-full" style={{ minHeight: 0 }}>

        {/* ── Stats header ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Camera size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Live CCTV Monitoring</p>
              <p className="text-[10px] text-slate-400">Pantau seluruh lokasi Pertamina secara real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Kamera",  value: totalCams,   color: "text-slate-700",   dot: "bg-slate-400" },
              { label: "Online",  value: totalOnline, color: "text-emerald-600", dot: "bg-emerald-500" },
              { label: "Alert",   value: totalAlert,  color: "text-red-600",     dot: "bg-red-500" },
              { label: "Offline", value: totalOff,    color: "text-slate-400",   dot: "bg-slate-300" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
                <span className="text-[10px] text-slate-400">{s.label}</span>
              </div>
            ))}
            <button className="flex items-center gap-1.5 px-3 h-7 rounded-lg border border-slate-200 text-slate-500 text-[11px] font-semibold hover:bg-slate-50 transition-colors">
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-1 min-h-0">

          {/* ── Left panel: location list ─────────────────────────────────── */}
          <div className="w-[330px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
            {/* Search */}
            <div className="px-3 pt-3 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 h-8 bg-slate-50 rounded-lg">
                <Search size={12} className="text-slate-400 flex-shrink-0" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Cari lokasi, kota, pulau..."
                  className="flex-1 text-[11px] bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="px-3 pb-2 flex-shrink-0">
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCatFilter(cat.key)}
                    className={`flex items-center gap-1 px-2.5 h-6 rounded-full text-[10px] font-semibold transition-colors ${
                      catFilter === cat.key
                        ? "bg-[#1e2d4d] text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {cat.icon && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cat.icon} alt={cat.label} className="w-3 h-3 object-contain" />
                    )}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="px-4 pb-2 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] text-slate-400">
                <span className="font-bold text-slate-600">{filteredLocs.length}</span> lokasi ditemukan
              </span>
              <span className="text-[10px] text-slate-400">
                <span className="font-bold text-slate-600">
                  {filteredLocs.reduce((s, l) => s + l.cameras.length, 0)}
                </span> kamera
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredLocs.map((loc) => (
                <LocationRow
                  key={loc.id}
                  loc={loc}
                  isSelected={selectedId === loc.id}
                  onClick={() => setSelectedId(selectedId === loc.id ? null : loc.id)}
                />
              ))}
              {filteredLocs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                  <Camera size={24} className="mb-2 opacity-30" />
                  <p className="text-xs">Tidak ada lokasi ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: map + CCTV panel ───────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0">

            {/* Map area */}
            <div className={`relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100 flex-shrink-0 ${selectedLoc ? "flex-none" : "flex-1"}`}
              style={{ height: selectedLoc ? "calc(100% - 268px)" : undefined, minHeight: selectedLoc ? 280 : undefined }}
            >
              <CctvMap
                locations={cctvLocations}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
                categoryFilter={catFilter}
                regionFilter={regFilter}
                height="100%"
              />

              {/* Region filter tabs (inside map, top overlay) */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-1 flex-nowrap overflow-x-auto max-w-[90%]"
                style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-md flex-nowrap">
                  {REGIONS.map((r) => {
                    const cnt = r.key === "Semua"
                      ? cctvLocations.length
                      : (regionCounts[r.key as CctvRegion] ?? 0);
                    return (
                      <button
                        key={r.key}
                        onClick={() => setRegFilter(r.key)}
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap ${
                          regFilter === r.key
                            ? "bg-[#1e2d4d] text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {r.label}
                        {cnt > 0 && (
                          <span className={`text-[9px] px-1 py-0.5 rounded-full font-bold ${
                            regFilter === r.key ? "bg-white/20" : "bg-slate-100 text-slate-500"
                          }`}>{cnt}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend (bottom-right) */}
              <div className="absolute bottom-10 right-3 z-[400] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">KATEGORI</p>
                {CATEGORIES.filter((c) => c.key !== "Semua").map((cat) => (
                  <div key={cat.key} className="flex items-center gap-1.5 mb-1 last:mb-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-[9px] text-slate-600 font-medium">{cat.label}</span>
                  </div>
                ))}
              </div>

              {/* Hint (when no selection) */}
              {!selectedId && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[400] bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none">
                  Klik pin atau pilih lokasi dari daftar
                </div>
              )}
            </div>

            {/* ── CCTV Panel (conditional) ─────────────────────────────────── */}
            {selectedLoc && (
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-0">
                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Category icon */}
                    {CATEGORIES.find((c) => c.key === selectedLoc.type)?.icon && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={CATEGORIES.find((c) => c.key === selectedLoc.type)!.icon}
                        alt={selectedLoc.type}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{selectedLoc.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {selectedLoc.region}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CAT_COLOR[selectedLoc.type] ?? "bg-slate-100 text-slate-600"}`}>
                      {selectedLoc.type}
                    </span>
                    {selectedLoc.cameras.some((c) => c.status === "Alert") && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                        <AlertTriangle size={8} />
                        {selectedLoc.cameras.filter((c) => c.status === "Alert").length} Alert
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Camera dots */}
                    <div className="flex items-center gap-1">
                      {selectedLoc.cameras.slice(0, 4).map((cam) => (
                        <span
                          key={cam.id}
                          className={`w-2 h-2 rounded-full ${
                            cam.status === "Live"    ? "bg-emerald-500" :
                            cam.status === "Alert"   ? "bg-red-500"     :
                            "bg-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {selectedLoc.cameras.filter((c) => c.status !== "Offline").length} live
                    </span>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <X size={12} className="text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Camera grid */}
                <div className="flex-1 p-3 min-h-0">
                  <div className="grid grid-cols-4 gap-2 h-full">
                    {selectedLoc.cameras.slice(0, 4).map((cam) => (
                      <CamFeed key={cam.id} cam={cam} locationName={selectedLoc.name} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
