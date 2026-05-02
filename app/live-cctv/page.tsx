"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cctvCameras } from "@/lib/mockData";
import { Camera, WifiOff, AlertTriangle, Maximize2 } from "lucide-react";
import { useState } from "react";

const typeColors: Record<string, string> = {
  Nozzle: "bg-blue-50 text-blue-600",
  Gate: "bg-purple-50 text-purple-600",
  Vessel: "bg-cyan-50 text-cyan-600",
  Truck: "bg-amber-50 text-amber-700",
  Driver: "bg-orange-50 text-orange-600",
  Plant: "bg-red-50 text-red-600",
  Pipeline: "bg-emerald-50 text-emerald-700",
  Depot: "bg-slate-100 text-slate-600",
  SPLU: "bg-violet-50 text-violet-600",
  Upstream: "bg-teal-50 text-teal-600",
  Control: "bg-indigo-50 text-indigo-600",
};

const statusConfig = {
  Live: { dot: "bg-emerald-500", badge: "text-emerald-600 bg-emerald-50" },
  Alert: { dot: "bg-red-500", badge: "text-red-600 bg-red-50" },
  Offline: { dot: "bg-slate-400", badge: "text-slate-500 bg-slate-100" },
};

export default function LiveCCTVPage() {
  const [selected, setSelected] = useState(cctvCameras[0].id);
  const mainCam = cctvCameras.find(c => c.id === selected) ?? cctvCameras[0];

  return (
    <DashboardLayout title="Live CCTV" subtitle="360° Camera Monitoring · Vessel · Truck · SPBU · Pipeline · Driver">
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        {/* Camera list */}
        <div className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">All Cameras</h3>
            <p className="text-[10px] text-slate-400">{cctvCameras.filter(c => c.status === "Live").length} Live · {cctvCameras.filter(c => c.status === "Alert").length} Alert</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {cctvCameras.map((cam) => {
              const sc = statusConfig[cam.status as keyof typeof statusConfig];
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelected(cam.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left ${selected === cam.id ? "bg-slate-50 border-l-2 border-l-blue-500" : ""}`}
                >
                  <div className="w-10 h-7 rounded bg-slate-800 flex items-center justify-center flex-shrink-0 relative">
                    {cam.status === "Offline" ? (
                      <WifiOff size={10} className="text-slate-500" />
                    ) : (
                      <Camera size={10} className="text-slate-400" />
                    )}
                    <span className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${sc.dot} ${cam.status !== "Offline" ? "animate-pulse" : ""}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-700 truncate">{cam.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{cam.location}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${typeColors[cam.type] ?? "bg-slate-100 text-slate-600"}`}>{cam.type}</span>
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${sc.badge}`}>{cam.status}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main view */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Primary feed */}
          <div className="bg-slate-900 rounded-xl flex-1 overflow-hidden relative flex items-center justify-center shadow-sm border border-slate-700">
            {mainCam.status === "Offline" ? (
              <div className="text-center">
                <WifiOff size={40} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Camera Offline</p>
                <p className="text-slate-500 text-xs">{mainCam.name}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={48} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">{mainCam.name}</p>
                    <p className="text-slate-500 text-xs">{mainCam.location}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Overlay HUD */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${mainCam.status === "Alert" ? "bg-red-500/20 text-red-400 border border-red-500/40" : mainCam.status === "Offline" ? "bg-slate-700/60 text-slate-400" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${mainCam.status === "Alert" ? "bg-red-400 animate-pulse" : mainCam.status === "Offline" ? "bg-slate-500" : "bg-emerald-400 animate-pulse"}`} />
                {mainCam.status.toUpperCase()}
              </span>
              <span className="bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">{mainCam.type}</span>
            </div>
            <div className="absolute top-3 right-3">
              <button className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
                <Maximize2 size={13} className="text-white" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-lg">
              {mainCam.location} · Live
            </div>
            {mainCam.status === "Alert" && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] px-2 py-1 rounded-lg">
                <AlertTriangle size={10} /> Anomaly Detected
              </div>
            )}
          </div>

          {/* Thumbnail grid */}
          <div className="grid grid-cols-4 gap-2">
            {cctvCameras.filter(c => c.id !== mainCam.id).slice(0, 4).map((cam) => {
              const sc = statusConfig[cam.status as keyof typeof statusConfig];
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelected(cam.id)}
                  className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all"
                >
                  <Camera size={14} className="text-slate-600" />
                  <span className="absolute top-1 left-1 text-[7px] text-white bg-black/50 px-1 rounded">{cam.type}</span>
                  <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${sc.dot} ${cam.status !== "Offline" ? "animate-pulse" : ""}`} />
                  <p className="absolute bottom-1 left-1 text-[7px] text-slate-400 truncate max-w-[80%]">{cam.name.split(" – ")[0]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right info panel */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex-1">
            <h4 className="text-xs font-semibold text-slate-700 mb-3">Camera Info</h4>
            <div className="space-y-2.5 text-[11px]">
              <div>
                <p className="text-slate-400">Name</p>
                <p className="font-semibold text-slate-700">{mainCam.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="font-semibold text-slate-700">{mainCam.location}</p>
              </div>
              <div>
                <p className="text-slate-400">Type</p>
                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColors[mainCam.type] ?? ""}`}>{mainCam.type}</span>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusConfig[mainCam.status as keyof typeof statusConfig].badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[mainCam.status as keyof typeof statusConfig].dot}`} />
                  {mainCam.status}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-700 mb-2">Stats</p>
              {[
                { label: "Resolution", value: "1080p" },
                { label: "FPS", value: "30" },
                { label: "Uptime", value: "99.2%" },
                { label: "Bitrate", value: "4.2 Mbps" },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="font-medium text-slate-700">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
            <p className="text-[10px] font-semibold text-slate-700 mb-2">Recent Events</p>
            {[
              { event: "Motion detected", time: "14:32" },
              { event: "Vehicle entered", time: "14:28" },
              { event: "AI anomaly check", time: "14:20" },
            ].map((e, i) => (
              <div key={i} className="flex justify-between text-[10px] mb-1.5">
                <span className="text-slate-600">{e.event}</span>
                <span className="text-slate-400">{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
