"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { logisticsKPI, dispatchVolumeData } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Ship, Camera, AlertTriangle, Activity } from "lucide-react";

const routeComplianceData = [
  { day: "Sun", value: 88 }, { day: "Mon", value: 92 }, { day: "Tue", value: 85 },
  { day: "Wed", value: 95 }, { day: "Thu", value: 90 }, { day: "Fri", value: 93 }, { day: "Sat", value: 89 },
];

const pipelineData = [
  { t: "10:00", v: 75 }, { t: "11:00", v: 78 }, { t: "12:00", v: 82 }, { t: "13:00", v: 76 },
  { t: "14:00", v: 89 }, { t: "15:00", v: 84 }, { t: "16:00", v: 80 }, { t: "17:00", v: 83 },
];

const kpiColors: Record<string, string> = {
  green: "text-emerald-500",
  red: "text-red-500",
  white: "text-slate-800",
};

export default function LogisticsPage() {
  return (
    <DashboardLayout title="Logistics Control Dashboard" subtitle="GPS Tracking · Pipeline · Vessel · Reconciliation Engine">
      <div className="space-y-4">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {logisticsKPI.map((k) => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
              <p className="text-[10px] text-slate-500 font-medium">{k.label}</p>
              <p className={`text-xl font-bold mt-1 ${kpiColors[k.color] ?? "text-slate-800"}`}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Truck GPS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Truck GPS & E-Seal Status</h3>
              <p className="text-[10px] text-slate-400">Live GPS & Cargo Status</p>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[1,2,3,4].map(n => (
                  <div key={n} className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                    <Camera size={20} className="text-slate-600" />
                    <span className="absolute top-1 left-1 text-[8px] text-white bg-black/50 px-1 rounded">CCTV</span>
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Route Compliance</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={routeComplianceData}>
                      <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[70, 100]} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-700 mb-1.5">Dispatch vs Delivery Volume</p>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="text-left pb-1">Volume</th>
                      <th className="text-right pb-1">Dispatch</th>
                      <th className="text-right pb-1">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchVolumeData.map((r, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-1 text-slate-600">{r.label}</td>
                        <td className="py-1 text-right text-slate-700 font-medium">{r.dispatch}</td>
                        <td className="py-1 text-right text-slate-700 font-medium">{r.delivery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-full min-h-80 relative">
              <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="320" fill="#1a365d"/>
                {/* Indonesia silhouette simplified */}
                <path d="M20,80 Q60,60 100,68 Q140,60 165,75 Q185,88 180,100 Q172,115 155,118 Q135,125 110,118 Q88,124 65,116 Q42,112 28,98 Q18,88 20,80Z" fill="#2d6a4f" opacity="0.8"/>
                <path d="M95,170 Q135,155 175,160 Q215,155 255,162 Q295,157 335,165 Q360,162 375,172 Q385,183 380,197 Q370,210 350,212 Q328,218 305,212 Q282,219 258,213 Q235,220 210,214 Q185,221 160,215 Q138,222 115,215 Q98,210 92,196 Q88,183 95,170Z" fill="#2d6a4f" opacity="0.8"/>
                <path d="M245,45 Q280,32 325,40 Q368,48 388,68 Q398,85 385,100 Q368,112 340,108 Q318,115 295,107 Q275,114 258,104 Q242,112 235,98 Q228,82 232,65 Q238,52 245,45Z" fill="#2d6a4f" opacity="0.8"/>
                {/* Route lines */}
                <path d="M115,180 Q145,175 165,200 Q190,220 220,215 Q250,210 270,195 Q300,185 330,190" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
                <path d="M100,90 Q130,150 160,175" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
                {/* Dots */}
                <circle cx="115" cy="180" r="5" fill="#e63946"/>
                <circle cx="330" cy="190" r="5" fill="#e63946"/>
                <circle cx="220" cy="215" r="4" fill="#fbbf24"/>
                <circle cx="165" cy="200" r="4" fill="#fbbf24"/>
                {/* Ship markers */}
                <polygon points="195,140 200,155 195,150 190,155" fill="#60a5fa"/>
                <polygon points="280,130 285,145 280,140 275,145" fill="#60a5fa"/>
                {/* Labels */}
                <text x="100" y="178" fill="#e2e8f0" fontSize="8">Merak</text>
                <text x="318" y="188" fill="#e2e8f0" fontSize="8">Surabaya</text>
                <text x="206" y="230" fill="#e2e8f0" fontSize="8">Jakarta</text>
                {/* Legend */}
                <rect x="10" y="270" width="380" height="40" rx="4" fill="#0f172a" opacity="0.6"/>
                <text x="18" y="285" fill="#94a3b8" fontSize="7">── GPS Trails</text>
                <text x="18" y="297" fill="#fbbf24" fontSize="7">── Pipeline Route</text>
                <text x="110" y="285" fill="#ef4444" fontSize="7">● Pipeline Depots</text>
                <text x="110" y="297" fill="#60a5fa" fontSize="7">● Delivery Points</text>
              </svg>
            </div>
          </div>

          {/* Vessel & Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Vessel & Pipeline Monitoring</h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AIS tracking
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Vessel AIS Positions</p>
            </div>
            <div className="p-3 space-y-3">
              {/* Vessel image */}
              <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                <Ship size={32} className="text-slate-500" />
                <span className="absolute top-1 left-1 text-[8px] text-white bg-black/50 px-1 rounded">CCTV</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-slate-400">Cargo Volume</p>
                  <p className="font-bold text-slate-800">500,000 kL</p>
                  <p className="text-slate-400 mt-1">Cargo Vs:</p>
                  <p className="font-semibold text-slate-700">30,000 kL</p>
                  <p className="text-slate-400 mt-1">Depots:</p>
                  <p className="font-semibold text-slate-700">78 Bar</p>
                </div>
                <div>
                  <p className="text-slate-400">ETA</p>
                  <p className="font-bold text-slate-800">25 hrs</p>
                  <p className="text-slate-400 mt-1">Update 1:</p>
                  <p className="font-semibold text-slate-700">24 hrs</p>
                  <p className="text-slate-400 mt-1">Update 2:</p>
                  <p className="font-semibold text-slate-700">38 mats</p>
                </div>
              </div>
              {/* Pipeline pressure */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold text-slate-700">Pipeline Pressure</p>
                  <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                    <AlertTriangle size={10} /> Leak Detection Alerts
                  </span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pipelineData}>
                      <XAxis dataKey="t" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Pipeline Pressure Alerts</p>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2].map(n => (
                    <div key={n} className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative">
                      <Activity size={16} className="text-slate-500" />
                      <span className="absolute top-1 left-1 text-[8px] text-white bg-black/50 px-1 rounded">CCTV</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reconciliation Engine */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Reconciliation Engine</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Dispatched Volume", value: "500,000 KL", change: "Variance", changeType: "down" },
              { label: "In-Transit Volume", value: "200,000 KL", change: "Variance", changeType: "up" },
              { label: "Received Volume", value: "495,000 KL", change: "Variance", changeType: "down" },
            ].map((r) => (
              <div key={r.label} className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">{r.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{r.value}</p>
                <p className={`text-[11px] font-semibold mt-1 flex items-center justify-center gap-1 ${r.changeType === "down" ? "text-red-500" : "text-emerald-500"}`}>
                  {r.changeType === "down" ? "▼" : "▲"} {r.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
