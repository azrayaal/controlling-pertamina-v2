"use client";
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { vessels, trucks } from "@/lib/mockData";
import {
  Search, Ship, Truck, MessageSquare, Phone, Video,
  X, Anchor, Camera, AlertTriangle, Filter, Layers,
  Navigation, MapPin, Clock, Package, ChevronRight,
  Activity, Zap,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useCallback, useMemo } from "react";

const LiveTrackingMap = dynamic(
  () => import("@/components/dashboard/LiveTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-slate-400 text-sm font-medium">Loading Map…</span>
        </div>
      </div>
    ),
  }
);

type ActiveTab = "all" | "vessel" | "truck";
type MapType   = "satellite" | "street";
type SelectedItem = { type: "vessel"; id: string } | { type: "truck"; id: string } | null;

// ── Status config ──────────────────────────────────────────────────────────────
const VESSEL_STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  "En Route":   { bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-500" },
  "Delayed":    { bg: "bg-red-100",     text: "text-red-600",    dot: "bg-red-500" },
  "Loading":    { bg: "bg-amber-100",   text: "text-amber-700",  dot: "bg-amber-500" },
  "In Transit": { bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-500" },
  "Alert":      { bg: "bg-red-100",     text: "text-red-600",    dot: "bg-red-500" },
  "On Route":   { bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-500" },
  "Idle":       { bg: "bg-slate-100",   text: "text-slate-500",  dot: "bg-slate-400" },
};

function trackingStatusLabel(v: (typeof vessels)[number]): { label: string; style: typeof VESSEL_STATUS_STYLE[string] } {
  if (v.trackingStatus === "alert") return { label: "Alert",      style: VESSEL_STATUS_STYLE["Alert"] };
  if (v.trackingStatus === "in-transit") return { label: "In Transit", style: VESSEL_STATUS_STYLE["In Transit"] };
  return { label: "In Transit", style: VESSEL_STATUS_STYLE["In Transit"] };
}
function truckStatusLabel(t: (typeof trucks)[number]): { label: string; style: typeof VESSEL_STATUS_STYLE[string] } {
  if (t.trackingStatus === "alert") return { label: "Alert",    style: VESSEL_STATUS_STYLE["Alert"] };
  if (t.trackingStatus === "idle")  return { label: "Idle",     style: VESSEL_STATUS_STYLE["Idle"] };
  return { label: "On Route", style: VESSEL_STATUS_STYLE["On Route"] };
}

const VESSEL_TYPE_BADGE: Record<string, string> = {
  "Oil Tanker":     "bg-[#1e2d4d]/10 text-[#1e2d4d]",
  "Product Tanker": "bg-teal-50 text-teal-700",
  "LPG Tanker":     "bg-amber-50 text-amber-700",
  "VLCC":           "bg-purple-50 text-purple-700",
};

const SUPPLY_CHAIN_STAGES = [
  { label: "Oil Platform",       short: "Oil" },
  { label: "Refinery Unit",      short: "Refinery" },
  { label: "Storage Terminal",   short: "Storage" },
  { label: "Logistics Express",  short: "Logistics" },
  { label: "SPBU Client",        short: "SPBU" },
];

// ── CCTV Grid ──────────────────────────────────────────────────────────────────
const CAM_COLORS = ["#1e3a5f", "#0f3d2e", "#3b1f5e", "#3b2a00"];
function CctvGrid({ cams }: { cams: { id: string; name: string; status: string }[] }) {
  return (
    <div className="px-4 py-3 border-b border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Live CCTV</p>
        <a href="/live-cctv" className="text-[9px] text-blue-500 font-semibold hover:underline flex items-center gap-0.5">
          <Video size={9} /> Full View
        </a>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {cams.map((cam, i) => (
          <div
            key={cam.id}
            className="relative rounded-lg overflow-hidden flex flex-col items-center justify-center"
            style={{ background: CAM_COLORS[i % CAM_COLORS.length], aspectRatio: "16/9" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)" }}
            />
            <Camera size={12} className="text-white/50 mb-0.5" />
            <p className="text-white/80 text-[7.5px] font-semibold text-center leading-tight px-1">{cam.name}</p>
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[6.5px] font-bold">LIVE</span>
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

// ── Map Popup — Vessel ─────────────────────────────────────────────────────────
function VesselMapPopup({
  vesselId,
  onClose,
  onDetailClick,
}: {
  vesselId: string;
  onClose: () => void;
  onDetailClick: () => void;
}) {
  const v = vessels.find((x) => x.id === vesselId);
  if (!v) return null;
  const { label: statusLabel, style: statusStyle } = trackingStatusLabel(v);
  const typeBadge = VESSEL_TYPE_BADGE[v.type] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="absolute inset-y-0 right-0 z-[500] w-[300px] bg-white shadow-2xl border-l border-slate-100 overflow-hidden flex flex-col overflow-y-auto">
      {/* Image header */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 130 }}>
        <Image src="/kapal1.png" alt={v.name} fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
        >
          <X size={11} className="text-white" />
        </button>
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-2 left-3">
          <p className="text-white font-bold text-sm drop-shadow">{v.name}</p>
          <p className="text-white/70 text-[9px]">{v.typeDesc}</p>
          <p className="text-white/50 text-[8px]">ID: 2026-L0-{v.idCode}</p>
        </div>
      </div>

      {/* Route */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="text-center">
            <p className="text-[8px] text-slate-400 uppercase">Depart</p>
            <p className="text-xs font-bold text-slate-800">{v.callSign}</p>
            <p className="text-[9px] text-slate-500">{v.port}</p>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="w-5 h-5 rounded-full bg-[#1e2d4d] flex items-center justify-center flex-shrink-0">
              <Navigation size={10} className="text-white" />
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="text-center">
            <p className="text-[8px] text-slate-400 uppercase">Arrival</p>
            <p className="text-xs font-bold text-slate-800">{v.destCallSign}</p>
            <p className="text-[9px] text-slate-500">{v.destPort}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${v.progress}%` }} />
          </div>
          <span className="text-[9px] text-slate-500 font-semibold">{v.progress}%</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 border-b border-slate-100">
        {[
          { label: "Load Volume",     value: v.cargoVolume },
          { label: "Total Distance",  value: v.totalDistance },
          { label: "Drive Time",      value: v.transitTime },
          { label: "ETA",             value: v.eta },
          { label: "Warnings",        value: v.warningCount.toString() },
          { label: "Speed",           value: v.speed },
        ].map((s, i) => (
          <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 4 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[8px] text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-[11px] font-bold ${s.label === "Warnings" && v.warningCount > 0 ? "text-red-600" : "text-slate-800"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Supply Chain */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Supply Chain Journey</p>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            ● {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {SUPPLY_CHAIN_STAGES.map((stage, idx) => {
            const isDone    = idx < v.supplyChainStage;
            const isCurrent = idx === v.supplyChainStage;
            return (
              <div key={stage.label} className="flex items-center gap-0.5 flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone    ? "bg-emerald-500" :
                    isCurrent ? "bg-blue-500" :
                    "bg-slate-200"
                  }`}>
                    {isDone ? (
                      <svg viewBox="0 0 10 10" width="10" height="10">
                        <path d="M2 5l2 2 4-3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    ) : isCurrent ? (
                      <Navigation size={9} className="text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <p className={`text-[7px] text-center mt-0.5 leading-tight font-semibold ${
                    isDone ? "text-emerald-600" : isCurrent ? "text-blue-600" : "text-slate-400"
                  }`}>{stage.short}</p>
                </div>
                {idx < SUPPLY_CHAIN_STAGES.length - 1 && (
                  <div className={`h-px flex-1 mb-3 ${isDone ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Captain */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {v.captain.replace("Capt. ","").split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">{v.captain}</p>
              <p className="text-[9px] text-slate-400">{v.captainId}</p>
            </div>
          </div>
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                strokeDasharray={`${v.captainRating / 5 * 94.25} 94.25`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-700 leading-none">{v.captainRating}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 flex items-center justify-center gap-1 h-7 rounded-lg border border-slate-200 text-slate-600 text-[10px] font-semibold hover:bg-slate-50">
            <MessageSquare size={10} /> Chat
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 h-7 rounded-lg border border-slate-200 text-slate-600 text-[10px] font-semibold hover:bg-slate-50">
            <Phone size={10} /> Call
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2 flex-shrink-0">
        <button
          onClick={onDetailClick}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-[#1e2d4d] text-white text-[11px] font-bold hover:bg-[#2d3f63] transition-colors"
        >
          <Layers size={12} /> 3D Detail View
        </button>
        <a href="/live-cctv" className="flex items-center justify-center gap-1 h-8 w-14 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-semibold hover:bg-slate-50 flex-shrink-0">
          <Video size={11} />
        </a>
      </div>
    </div>
  );
}

// ── 3D Detail Modal ────────────────────────────────────────────────────────────
function VesselDetailModal({
  vesselId,
  onClose,
}: {
  vesselId: string;
  onClose: () => void;
}) {
  const v = vessels.find((x) => x.id === vesselId);
  if (!v) return null;
  const { label: statusLabel, style: statusStyle } = trackingStatusLabel(v);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex">
      {/* Left detail panel */}
      <div className="w-[280px] flex-shrink-0 bg-white flex flex-col overflow-y-auto">
        {/* Header with ship photo */}
        <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 160 }}>
          <Image src="/kapal1.png" alt={v.name} fill style={{ objectFit: "cover" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={13} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-3">
            <div className="flex gap-1.5 mb-1">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                {statusLabel}
              </span>
            </div>
            <p className="text-white font-bold text-base drop-shadow">{v.name}</p>
            <p className="text-white/70 text-[9px]">{v.typeDesc}</p>
          </div>
        </div>

        {/* Route */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[8px] text-slate-400 uppercase">Depart</p>
              <p className="text-sm font-bold text-slate-800">{v.callSign}</p>
              <p className="text-[10px] text-slate-500">{v.port}</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-200 border-dashed" />
              <div className="w-5 h-5 rounded-full bg-[#1e2d4d] flex items-center justify-center">
                <Navigation size={9} className="text-white" />
              </div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="text-right">
              <p className="text-[8px] text-slate-400 uppercase">Arrival</p>
              <p className="text-sm font-bold text-slate-800">{v.destCallSign}</p>
              <p className="text-[10px] text-slate-500">{v.destPort}</p>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 mt-2">{v.typeDesc}</p>
          <p className="text-[9px] text-slate-400">ID: 2026-L0-{v.idCode}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-b border-slate-100">
          {[
            { label: "Speed", value: v.speed },
            { label: "ETA", value: v.eta },
            { label: "Drive Time", value: v.transitTime },
            { label: "Warnings", value: v.warningCount.toString() },
          ].map((s, i) => (
            <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
              <p className="text-[8px] text-slate-400 uppercase">{s.label}</p>
              <p className={`text-[12px] font-bold ${s.label === "Warnings" && v.warningCount > 0 ? "text-red-600" : "text-slate-800"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Supply chain */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Supply Chain Journey</p>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>● {statusLabel}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {SUPPLY_CHAIN_STAGES.map((stage, idx) => {
              const isDone    = idx < v.supplyChainStage;
              const isCurrent = idx === v.supplyChainStage;
              return (
                <div key={stage.label} className="flex items-center gap-0.5 flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isDone ? "bg-emerald-500" : isCurrent ? "bg-blue-500" : "bg-slate-200"
                    }`}>
                      {isDone ? <svg viewBox="0 0 10 10" width="9" height="9"><path d="M2 5l2 2 4-3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                        : isCurrent ? <Navigation size={8} className="text-white" />
                        : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                    </div>
                    <p className={`text-[7px] text-center mt-0.5 font-semibold ${isDone ? "text-emerald-600" : isCurrent ? "text-blue-600" : "text-slate-400"}`}>{stage.short}</p>
                  </div>
                  {idx < SUPPLY_CHAIN_STAGES.length - 1 && (
                    <div className={`h-px flex-1 mb-3 ${isDone ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Captain */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Captain</p>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {v.captain.replace("Capt. ","").split(" ").map((n) => n[0]).join("").slice(0,2)}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-slate-800">{v.captain}</p>
              <p className="text-[9px] text-slate-400">{v.captainId}</p>
            </div>
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                  strokeDasharray={`${v.captainRating / 5 * 94.25} 94.25`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-700">{v.captainRating}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 flex items-center justify-center gap-1 h-7 rounded-lg bg-slate-800 text-white text-[10px] font-semibold hover:bg-slate-700">
              <MessageSquare size={10} /> Chat
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 h-7 rounded-lg border border-slate-200 text-slate-600 text-[10px] font-semibold hover:bg-slate-50">
              <Phone size={10} /> Call
            </button>
          </div>
        </div>

        {/* Cargo breakdown */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Muatan BBM</p>
          <p className="text-xs font-bold text-slate-700 mb-1.5">Total {v.cargoVolume}</p>
          <div className="flex flex-col gap-1.5">
            {v.cargoBreakdown.map((c) => (
              <div key={c.type} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-[10px] text-slate-600">{c.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ background: c.color, width: "65%" }} />
                  </div>
                  <span className="text-[9px] font-semibold text-slate-700">{c.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vessel specs */}
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Vessel Specs</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[{ label: "Length", value: v.length }, { label: "Beam", value: v.beam }, { label: "Built", value: v.built }].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-lg px-1.5 py-2 text-center">
                <p className="text-[8px] text-slate-400">{s.label}</p>
                <p className="text-[10px] font-bold text-slate-700">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CCTV */}
        {v.cctv && <CctvGrid cams={v.cctv} />}

        <div className="px-4 py-3">
          <a href="/live-cctv" className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl bg-slate-800 text-white text-[11px] font-bold hover:bg-slate-700 transition-colors">
            <Video size={12} /> Live CCTV Full View
          </a>
        </div>
      </div>

      {/* 3D View area */}
      <div className="flex-1 relative bg-gradient-to-b from-[#0a2a4a] to-[#0d4f6c] flex flex-col">
        {/* Top badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
          <Layers size={14} className="text-white/80" />
          <div>
            <p className="text-white text-[10px] font-bold">3D Live View · {v.name}</p>
            <p className="text-white/60 text-[9px]">{v.port} → {v.destPort}</p>
          </div>
          <span className="flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[9px] font-bold">Live</span>
          </span>
        </div>

        {/* 3D Ship */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative">
            {/* Ocean waves */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[600px] h-16 opacity-30">
              <svg viewBox="0 0 600 64" className="w-full h-full">
                <path d="M0 32 Q75 8 150 32 Q225 56 300 32 Q375 8 450 32 Q525 56 600 32 L600 64 L0 64 Z" fill="#38bdf8" />
                <path d="M0 40 Q75 20 150 40 Q225 60 300 40 Q375 20 450 40 Q525 60 600 40 L600 64 L0 64 Z" fill="#0ea5e9" opacity="0.6" />
              </svg>
            </div>
            {/* Vessel image */}
            <div className="relative w-[480px] h-[280px] drop-shadow-2xl" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}>
              <Image src="/kapal3d.png" alt="3D Vessel View" fill style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>

        {/* CCTV bottom bar */}
        <div className="flex-shrink-0 bg-black/40 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-white/70" />
              <p className="text-white font-semibold text-sm">Live CCTV — {v.name}</p>
              <span className="text-[8px] text-white/50">{v.cctv?.length ?? 0} kamera aktif · 1 offline</span>
            </div>
            <a href="/live-cctv" className="flex items-center gap-1 text-[10px] text-red-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE FEED
            </a>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(v.cctv ?? []).slice(0, 4).map((cam, i) => (
              <div
                key={cam.id}
                className="relative rounded-lg overflow-hidden"
                style={{ background: CAM_COLORS[i % CAM_COLORS.length], aspectRatio: "16/9" }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  <Camera size={14} className="text-white/40 mb-1" />
                  <p className="text-white/70 text-[8px] font-semibold text-center">{cam.name}</p>
                </div>
                <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-red-600/90 rounded px-1 py-0.5">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-[6px] font-bold">{cam.status === "Alert" ? "ALRT" : "LIVE"}</span>
                </div>
                <div className="absolute bottom-1 left-1">
                  <span className="text-white/50 text-[7px]">Cam {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Truck Map Popup ────────────────────────────────────────────────────────────
function TruckMapPopup({
  truckId,
  onClose,
}: {
  truckId: string;
  onClose: () => void;
}) {
  const t = trucks.find((x) => x.id === truckId);
  if (!t) return null;
  const { label: statusLabel, style: statusStyle } = truckStatusLabel(t);

  return (
    <div className="absolute inset-y-0 right-0 z-[500] w-[280px] bg-white shadow-2xl border-l border-slate-100 overflow-hidden flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 110 }}>
        <Image src="/truck1.png" alt={t.plateNumber} fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <button onClick={onClose} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
          <X size={11} className="text-white" />
        </button>
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>{statusLabel}</span>
        </div>
        <div className="absolute bottom-2 left-3">
          <p className="text-white font-bold text-sm drop-shadow">{t.plateNumber}</p>
          <p className="text-white/70 text-[9px]">{t.idCode} · {t.origin}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-b border-slate-100">
        {[
          { label: "Load Volume",   value: t.load },
          { label: "Distance",      value: t.distance },
          { label: "Drive Time",    value: t.duration },
          { label: "ETA",           value: t.eta },
        ].map((s, i) => (
          <div key={s.label} className={`px-3 py-2 ${i % 2 === 0 ? "border-r border-slate-100" : ""} ${i < 2 ? "border-b border-slate-100" : ""}`}>
            <p className="text-[8px] text-slate-400 uppercase">{s.label}</p>
            <p className="text-[11px] font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Route */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1.5">Route</p>
        <div className="flex flex-col gap-1.5">
          {[
            { dot: "bg-emerald-500", label: "Origin", value: t.origin },
            { dot: "bg-blue-500", label: "In Transit", value: "En route" },
            { dot: "bg-slate-300", label: "Destination", value: t.destination },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${step.dot}`} />
              <p className="text-[9px] text-slate-400 w-14 flex-shrink-0">{step.label}</p>
              <p className="text-[10px] font-semibold text-slate-700 truncate">{step.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Driver */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {t.driver.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">{t.driver}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} viewBox="0 0 10 10" width="8" height="8">
                    <path d="M5 1l1.2 2.4L9 3.8l-2 1.9.5 2.7L5 7.1 2.5 8.4l.5-2.7L1 3.8l2.8-.4z"
                      fill={i < Math.round(t.rating) ? "#f59e0b" : "#e2e8f0"}/>
                  </svg>
                ))}
                <span className="text-[8px] text-slate-400 ml-0.5">{t.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100">
              <MessageSquare size={10} className="text-blue-500" />
            </button>
            <button className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100">
              <Phone size={10} className="text-emerald-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Fuel */}
      {t.fuelLoad.length > 0 && (
        <div className="px-3 py-2.5 border-b border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-1.5">Muatan BBM</p>
          {t.fuelLoad.map((f) => (
            <div key={f.type} className="flex items-center justify-between py-0.5">
              <span className="text-[10px] text-slate-600">{f.type}</span>
              <span className="text-[10px] font-semibold text-slate-700">{f.amount}</span>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 py-3">
        <a href="/live-cctv" className="w-full flex items-center justify-center gap-1.5 h-8 rounded-xl bg-slate-800 text-white text-[10px] font-bold hover:bg-slate-700">
          <Video size={11} /> Live CCTV
        </a>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function LiveTrackingPage() {
  const [activeTab, setActiveTab]   = useState<ActiveTab>("all");
  const [mapType, setMapType]       = useState<MapType>("street");
  const [searchQ, setSearchQ]       = useState("");
  const [selected, setSelected]     = useState<SelectedItem>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleVesselClick = useCallback((id: string) => {
    setSelected((prev) => (prev?.type === "vessel" && prev.id === id ? null : { type: "vessel", id }));
    setShowDetail(false);
  }, []);
  const handleTruckClick = useCallback((id: string) => {
    setSelected((prev) => (prev?.type === "truck" && prev.id === id ? null : { type: "truck", id }));
    setShowDetail(false);
  }, []);

  const selectedVesselId = selected?.type === "vessel" ? selected.id : null;
  const selectedTruckId  = selected?.type === "truck"  ? selected.id : null;

  // Status counts
  const counts = useMemo(() => {
    const vAlerts   = vessels.filter((v) => v.trackingStatus === "alert").length;
    const vTransit  = vessels.filter((v) => v.trackingStatus === "in-transit").length;
    const tOnRoute  = trucks.filter((t) => t.trackingStatus === "on-route").length;
    const tAlert    = trucks.filter((t) => t.trackingStatus === "alert").length;
    const tIdle     = trucks.filter((t) => t.trackingStatus === "idle").length;
    return {
      onRoute:   tOnRoute,
      inTransit: vTransit,
      alert:     vAlerts + tAlert,
      idle:      tIdle,
    };
  }, []);

  // Filtered fleet for table
  const fleetRows = useMemo(() => {
    const vRows = vessels
      .filter((v) =>
        (activeTab === "all" || activeTab === "vessel") &&
        (searchQ === "" || v.name.toLowerCase().includes(searchQ.toLowerCase()) || v.idCode.toLowerCase().includes(searchQ.toLowerCase()))
      )
      .map((v) => ({ type: "vessel" as const, v, t: null }));
    const tRows = trucks
      .filter((t) =>
        (activeTab === "all" || activeTab === "truck") &&
        (searchQ === "" || t.plateNumber.toLowerCase().includes(searchQ.toLowerCase()) || t.driver.toLowerCase().includes(searchQ.toLowerCase()))
      )
      .map((t) => ({ type: "truck" as const, v: null, t }));
    return [...vRows, ...tRows];
  }, [activeTab, searchQ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-3 h-full" style={{ minHeight: 0 }}>

        {/* ── Filter / Toolbar bar ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 h-8 bg-slate-50 rounded-lg min-w-[180px]">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Cari armada, plat, rute..."
              className="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400 min-w-0"
            />
          </div>
          <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors flex-shrink-0">
            <Filter size={13} className="text-slate-500" />
          </button>

          {/* Type tabs */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 flex-shrink-0">
            {([
              { key: "all",    label: "Semua", icon: null },
              { key: "truck",  label: "Truck",  icon: <Truck size={11}/> },
              { key: "vessel", label: "Kapal",  icon: <Ship size={11}/> },
            ] as { key: ActiveTab; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1 px-2.5 h-7 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === key ? "bg-[#1e2d4d] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Map type */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {(["satellite","street"] as const).map((mt) => (
              <button
                key={mt}
                onClick={() => setMapType(mt)}
                className={`px-2.5 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  mapType === mt ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {mt.charAt(0).toUpperCase() + mt.slice(1)}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 flex-shrink-0" />

          {/* Status counts */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "onRoute",   label: "On Route",   count: counts.onRoute,   color: "bg-emerald-100 text-emerald-700" },
              { key: "inTransit", label: "In Transit", count: counts.inTransit, color: "bg-blue-100 text-blue-700" },
              { key: "alert",     label: "Alert",      count: counts.alert,     color: "bg-red-100 text-red-600" },
              { key: "idle",      label: "Idle",       count: counts.idle,      color: "bg-slate-100 text-slate-500" },
            ].map(({ key, label, count, color }) => (
              <span key={key} className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${color}`}>
                {count} {label}
              </span>
            ))}
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
        </div>

        {/* ── Map Area ─────────────────────────────────────────────────────── */}
        <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm border border-slate-100 min-h-[380px] lg:min-h-0">
          <LiveTrackingMap
            vessels={vessels}
            trucks={trucks}
            selectedVesselId={selectedVesselId}
            selectedTruckId={selectedTruckId}
            onVesselClick={handleVesselClick}
            onTruckClick={handleTruckClick}
            mapType={mapType}
            activeFilter={activeTab}
            height="100%"
          />

          {/* Map overlays */}
          <div className="absolute bottom-10 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-white/50 flex items-center gap-1.5 text-xs text-slate-500 pointer-events-none z-[400]">
            <MapPin size={11} className="text-slate-400" />
            <span>Indonesia · Pertamina Live Tracker</span>
          </div>

          {/* Live badge — only when no detail panel is open */}
          {!selected && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm pointer-events-none z-[400]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </div>
          )}

          {!selected && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap z-[400]">
              Klik ikon kapal atau truk untuk melihat detail
            </div>
          )}

          {/* Vessel popup overlay */}
          {selected?.type === "vessel" && (
            <VesselMapPopup
              vesselId={selected.id}
              onClose={() => setSelected(null)}
              onDetailClick={() => setShowDetail(true)}
            />
          )}

          {/* Truck popup overlay */}
          {selected?.type === "truck" && (
            <TruckMapPopup
              truckId={selected.id}
              onClose={() => setSelected(null)}
            />
          )}
        </div>

        {/* ── Active Fleet Table ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800">Active Fleet</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {fleetRows.length} Unit
            </span>
          </div>

          <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
            <table className="w-full min-w-[620px] text-xs">
              <thead className="sticky top-0 bg-white border-b border-slate-100 z-10">
                <tr>
                  {["ID / TIPE", "ROUTE", "STATUS", "ETA", "LOAD"].map((h) => (
                    <th key={h} className="text-left px-5 py-2 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fleetRows.map(({ type, v, t }) => {
                  if (type === "vessel" && v) {
                    const { label, style } = trackingStatusLabel(v);
                    const isActive = selectedVesselId === v.id;
                    return (
                      <tr
                        key={v.id}
                        onClick={() => handleVesselClick(v.id)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${isActive ? "bg-blue-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#1e2d4d]/10 flex items-center justify-center flex-shrink-0">
                              <Ship size={13} className="text-[#1e2d4d]" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{v.name}</p>
                              <p className="text-[9px] text-slate-400">{v.idCode} · <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${VESSEL_TYPE_BADGE[v.type] ?? ""}`}>{v.type}</span></p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-semibold">{v.port}</span>
                            <ChevronRight size={10} className="text-slate-300" />
                            <span className="font-semibold">{v.destPort}</span>
                          </div>
                        </td>
                        <td className="px-5 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{label}</span>
                        </td>
                        <td className="px-5 py-2.5 font-semibold text-slate-700">{v.eta}</td>
                        <td className="px-5 py-2.5 font-semibold text-slate-700">{v.cargoVolume}</td>
                      </tr>
                    );
                  } else if (type === "truck" && t) {
                    const { label, style } = truckStatusLabel(t);
                    const isActive = selectedTruckId === t.id;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleTruckClick(t.id)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${isActive ? "bg-red-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                              <Truck size={13} className="text-red-500" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{t.plateNumber}</p>
                              <p className="text-[9px] text-slate-400">{t.idCode} · {t.driver}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-1 text-slate-600">
                            <span className="font-semibold truncate max-w-[140px]">{t.tableRoute}</span>
                          </div>
                        </td>
                        <td className="px-5 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{label}</span>
                        </td>
                        <td className="px-5 py-2.5 font-semibold text-slate-700">{t.eta}</td>
                        <td className="px-5 py-2.5 font-semibold text-slate-700">{t.load}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 3D Detail Modal ───────────────────────────────────────────────────── */}
      {showDetail && selectedVesselId && (
        <VesselDetailModal
          vesselId={selectedVesselId}
          onClose={() => { setShowDetail(false); setSelected(null); }}
        />
      )}
    </DashboardLayout>
  );
}
