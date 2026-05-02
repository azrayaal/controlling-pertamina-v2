"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { trucks } from "@/lib/mockData";
import { MessageSquare, Phone, Video, ChevronDown, Camera, AlertTriangle } from "lucide-react";
import { useState, useCallback } from "react";

const JakartaMap = dynamic(() => import("./JakartaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-xs">Loading map…</span>
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

const camColors = ["#1e3a5f", "#0f3d2e", "#3b1f5e", "#3b2a00"];

function CctvGrid({ cams }: { cams: { id: string; name: string; status: string }[] }) {
  return (
    <div className="px-3 py-2 border-b border-slate-100">
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
            className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center"
            style={{ background: camColors[i % camColors.length], aspectRatio: "16/9" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              }}
            />
            <Camera size={11} className="text-white/60 mb-0.5" />
            <p className="text-white/80 text-[7px] font-semibold text-center leading-tight px-1">
              {cam.name}
            </p>
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[6px] font-bold">LIVE</span>
            </div>
            {cam.status === "Alert" && (
              <div className="absolute top-1 left-1">
                <AlertTriangle size={8} className="text-amber-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveTrackingSection() {
  const [selectedId, setSelectedId] = useState(trucks[0].id);

  const handleTruckClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const truck = trucks.find((t) => t.id === selectedId) ?? trucks[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-800">Live Tracking</h3>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
        <span className="text-[10px] text-slate-400 ml-auto">
          {trucks.length} truk aktif
        </span>
        {/* Truck selector dots */}
        <div className="flex gap-1">
          {trucks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              title={t.plateNumber}
              className={`w-2 h-2 rounded-full transition-all ${
                t.id === selectedId ? "bg-[#1e2d4d] scale-125" : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <JakartaMap
            trucks={trucks}
            selectedTruckId={selectedId}
            onTruckClick={handleTruckClick}
            height="100%"
            truckLat={-6.8}
            truckLng={110.0}
            zoom={7}
          />
          {/* Hint overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/55 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap">
            Klik marker untuk detail
          </div>
        </div>

        {/* Vehicle detail panel */}
        <div className="w-[220px] flex-shrink-0 border-l border-slate-100 flex flex-col overflow-y-auto bg-white">
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
          <div className="px-3 pt-2 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{truck.plateNumber}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  truck.status === "Loading"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {truck.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Pertamina Tanker · 24KL</p>
            <p className="text-[9px] text-slate-300">{truck.origin}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            {[
              { label: "Load Volume",    value: truck.speed },
              { label: "Total Distance", value: truck.distance },
              { label: "Drive Time",     value: truck.duration },
              { label: "ETA",            value: truck.eta === "—" ? "Loading" : truck.eta },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`px-2.5 py-1.5 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}
              >
                <p className="text-[9px] text-slate-400 flex items-center gap-0.5">
                  {item.label} <ChevronDown size={8} className="text-slate-300" />
                </p>
                <p className="text-[12px] font-bold mt-0.5 text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Supply chain journey */}
          <div className="px-3 py-2.5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-600">Supply Chain Journey</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                {truck.phase}
              </span>
            </div>
            <div className="flex items-center justify-between">
              {supplySteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  {i > 0 && (
                    <div className={`h-px w-2 ${step.done ? "bg-blue-300" : "bg-slate-200"}`} />
                  )}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${step.color}`}>
                      {step.done && (
                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
                          <path
                            d="M2 6 L5 9 L10 3"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[9px] text-slate-400 mb-1.5">Driver</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold flex-shrink-0">
                {truck.driver
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{truck.driver}</p>
                <p className="text-[9px] text-slate-400">{truck.driverPhone ?? "—"}</p>
              </div>
              <div className="w-9 h-9 flex-shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <circle
                    cx="20" cy="20" r="14"
                    fill="none" stroke="#22c55e" strokeWidth="3.5"
                    strokeDasharray={`${(truck.rating / 5) * 87.96} 87.96`}
                    strokeLinecap="round"
                    transform="rotate(-90 20 20)"
                  />
                  <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">
                    {truck.rating}
                  </text>
                  <text x="20" y="30" textAnchor="middle" fontSize="5.5" fill="#94a3b8">
                    Score
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Chat / Call */}
          <div className="px-3 py-2 flex gap-1.5 border-b border-slate-100">
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
              <MessageSquare size={10} /> Chat
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors">
              <Phone size={10} /> Call
            </button>
          </div>

          {/* From / To / ETA */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="grid grid-cols-3 text-center gap-1 mb-1">
              <div>
                <p className="text-[8px] text-slate-400">From</p>
                <p className="text-[9px] font-semibold text-slate-700 leading-tight">{truck.origin}</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-400">ETA</p>
                <p className="text-[11px] font-bold text-slate-800">
                  {truck.eta === "—" ? "Loading" : truck.eta}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-slate-400">To</p>
                <p className="text-[9px] font-semibold text-slate-700 leading-tight">{truck.destination}</p>
              </div>
            </div>
          </div>

          {/* Fuel load */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
              <span>Load</span>
              <span>Total {truck.speed}</span>
            </div>
            {truck.fuelLoad.map((f) => (
              <div key={f.type} className="flex items-center justify-between text-[10px] mb-0.5">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fuelColors[f.type] ?? "bg-slate-400"}`} />
                  {f.type}
                </span>
                <span className="text-slate-700 font-medium">{f.amount}</span>
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
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors flex-1"
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
        </div>
      </div>
    </div>
  );
}
