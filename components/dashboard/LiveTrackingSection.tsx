"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { trucks } from "@/lib/mockData";
import { MessageSquare, Phone, Video, ChevronDown } from "lucide-react";

const JakartaMap = dynamic(() => import("./JakartaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-xs">Loading map…</span>
    </div>
  ),
});

// Supply chain steps matching the reference image
const supplySteps = [
  { label: "Oil Platform",      done: true,  color: "bg-emerald-500 border-emerald-500" },
  { label: "Refinery Unit",     done: true,  color: "bg-purple-500 border-purple-500" },
  { label: "Storage Terminal",  done: true,  color: "bg-emerald-500 border-emerald-500" },
  { label: "Logistic Network",  done: true,  color: "bg-blue-500 border-blue-500" },
  { label: "SPBU Depot",        done: false, color: "bg-slate-300 border-slate-300" },
];

const fuelColors: Record<string, string> = {
  Pertalite:       "bg-emerald-500",
  Pertamax:        "bg-blue-500",
  "Pertamina DEX": "bg-amber-500",
  Solar:           "bg-amber-400",
};

export default function LiveTrackingSection() {
  const truck = trucks[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-800">Live Tracking</h3>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* ── Map (left) ── */}
        <div className="relative flex-1 min-w-0 overflow-hidden">
          <JakartaMap height="100%" zoom={12} truckLat={-6.2266} truckLng={106.8061} />
        </div>

        {/* ── Vehicle Detail Panel (right) ── */}
        <div className="w-[220px] flex-shrink-0 border-l border-slate-100 flex flex-col overflow-y-auto bg-white">

          {/* Truck photo — top of panel, full width */}
          <div className="relative w-full h-[110px] flex-shrink-0 overflow-hidden bg-slate-100">
            <Image
              src="/truck1.png"
              alt="Pertamina Tanker Truck"
              fill
              className="object-cover"
              sizes="220px"
              priority
            />
          </div>

          {/* Plate & status */}
          <div className="px-3 pt-2 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{truck.plateNumber}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Pertamina Tanker · 24KL</p>
            <p className="text-[9px] text-slate-300">ID: 2020-LG-8868127</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            {[
              { label: "Load Volume",    value: "32.000 F" },
              { label: "Total Distance", value: truck.distance },
              { label: "Drive Time",     value: truck.duration },
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

          {/* Supply Chain Journey */}
          <div className="px-3 py-2.5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-600">Supply Chain Journey</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">In Transit</span>
            </div>
            <div className="flex items-center justify-between">
              {supplySteps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  {i > 0 && (
                    <div className={`h-px w-2 ${step.done ? "bg-blue-300" : "bg-slate-200"}`} />
                  )}
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.color}`}>
                      {step.done && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3">
                          <path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold flex-shrink-0">
                {truck.driver.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{truck.driver}</p>
                <p className="text-[9px] text-slate-400">86720455</p>
              </div>
              {/* Gauge */}
              <div className="w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5"
                    strokeDasharray={`${(truck.rating / 5) * 87.96} 87.96`}
                    strokeLinecap="round" transform="rotate(-90 20 20)"
                  />
                  <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">{truck.rating}</text>
                  <text x="20" y="30" textAnchor="middle" fontSize="6" fill="#94a3b8">Safety Score</text>
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
                <p className="text-[10px] font-semibold text-slate-700 leading-tight">Terminal Pelumpung</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-400">Estimated time</p>
                <p className="text-[11px] font-bold text-slate-800">{truck.eta}</p>
              </div>
              <div>
                <p className="text-[8px] text-slate-400">To</p>
                <p className="text-[10px] font-semibold text-slate-700 leading-tight">SPBU Pertamina</p>
              </div>
            </div>
          </div>

          {/* Fuel load */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
              <span>Load</span>
              <span>Total 32.000 F</span>
            </div>
            {truck.fuelLoad.map((f) => (
              <div key={f.type} className="flex items-center justify-between text-[10px] mb-1">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fuelColors[f.type] ?? "bg-slate-400"}`} />
                  {f.type}
                </span>
                <span className="text-slate-700 font-medium">{f.amount}</span>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="px-3 py-2.5 mt-auto flex-shrink-0">
            <div className="flex gap-1.5">
              <button className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-50 transition-colors flex-1">
                <Video size={10} /> Live CCTV
              </button>
              <button className="flex-1 py-2 rounded-lg bg-[#1e2d4d] text-[10px] text-white font-bold hover:bg-[#2a3f6d] transition-colors">
                Detail
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
