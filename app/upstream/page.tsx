"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { wellPerformance, anomalyDetections, productionChartData } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { AlertTriangle, TrendingDown, Gauge, Zap } from "lucide-react";

const kpiCards = [
  { label: "Oil Production", value: "1.2 M BOPD", sub: "", color: "#22c55e", gauge: 75 },
  { label: "Gas Production", value: "4.5 BCFD", sub: "", color: "#3b82f6", gauge: 60 },
  { label: "Well Availability", value: "98.5%", sub: "Normal", color: "#22c55e", gauge: 98 },
  { label: "Pressure Integrity", value: "Normal", sub: "", color: "#22c55e", gauge: 85 },
  { label: "Flaring Status", value: "Minimal", sub: "", color: "#22c55e", gauge: 20 },
  { label: "Production Deviation", value: "+2.1%", sub: "", color: "#f59e0b", gauge: 55 },
];

const statusColors: Record<string, string> = {
  Normal: "text-emerald-600 bg-emerald-50",
  Warning: "text-amber-600 bg-amber-50",
  Critical: "text-red-600 bg-red-50",
};

const anomalySeverityConfig = {
  critical: { bg: "bg-red-50 border-red-200", icon: "text-red-500", title: "text-red-700" },
  warning: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", title: "text-amber-700" },
  info: { bg: "bg-blue-50 border-blue-200", icon: "text-blue-500", title: "text-blue-700" },
};

export default function UpstreamPage() {
  return (
    <DashboardLayout title="Upstream Production Dashboard" subtitle="Well Monitoring · Pressure · Flow · Anomaly Detection">
      <div className="space-y-4">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map((k) => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
              <p className="text-[10px] text-slate-400 font-medium">{k.label}</p>
              <p className="text-base font-bold mt-0.5" style={{ color: k.color }}>{k.value}</p>
              {k.sub && <p className="text-[10px] text-slate-400">{k.sub}</p>}
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${k.gauge}%`, background: k.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Well Performance Table */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Well Performance Table</h3>
            </div>
            <div className="overflow-y-auto max-h-72">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="px-3 py-2 text-left font-semibold">Well ID</th>
                    <th className="px-2 py-2 text-right font-semibold">Rate</th>
                    <th className="px-2 py-2 text-right font-semibold">PSI</th>
                    <th className="px-2 py-2 text-right font-semibold">°C</th>
                    <th className="px-2 py-2 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wellPerformance.map((w, i) => (
                    <tr key={i} className={`border-t border-slate-50 ${w.status === "Critical" ? "bg-red-50" : w.status === "Warning" ? "bg-amber-50" : ""}`}>
                      <td className="px-3 py-1.5 font-medium text-slate-700">{w.wellId}</td>
                      <td className="px-2 py-1.5 text-right text-slate-600">{w.productionRate}</td>
                      <td className="px-2 py-1.5 text-right text-slate-500">{w.pressure}</td>
                      <td className="px-2 py-1.5 text-right text-slate-500">{w.temperature}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusColors[w.status]}`}>{w.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Upstream Field Map placeholder */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Live Upstream Field Map</h3>
            </div>
            <div className="p-4 h-64 flex items-center justify-center">
              <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Offshore platform visualization */}
                  <svg viewBox="0 0 300 200" className="w-full h-full p-4">
                    <rect width="300" height="200" fill="#0f172a"/>
                    {/* Ocean */}
                    <rect y="120" width="300" height="80" fill="#164e63" opacity="0.6"/>
                    {/* Platform A */}
                    <rect x="30" y="80" width="40" height="40" fill="#334155" rx="2"/>
                    <rect x="40" y="60" width="20" height="20" fill="#475569" rx="1"/>
                    <line x1="50" y1="60" x2="50" y2="40" stroke="#94a3b8" strokeWidth="1"/>
                    <text x="30" y="75" fill="#94a3b8" fontSize="7">Platform A</text>
                    {/* Platform B */}
                    <rect x="120" y="70" width="40" height="40" fill="#334155" rx="2"/>
                    <rect x="130" y="50" width="20" height="20" fill="#475569" rx="1"/>
                    <line x1="140" y1="50" x2="140" y2="30" stroke="#94a3b8" strokeWidth="1"/>
                    <text x="120" y="65" fill="#94a3b8" fontSize="7">Platform B</text>
                    {/* Platform C */}
                    <rect x="220" y="85" width="40" height="35" fill="#334155" rx="2"/>
                    <rect x="230" y="65" width="20" height="20" fill="#ef4444" rx="1"/>
                    <line x1="240" y1="65" x2="240" y2="45" stroke="#ef4444" strokeWidth="1.5"/>
                    <text x="218" y="80" fill="#f87171" fontSize="7">Platform C ⚠</text>
                    {/* Pipelines */}
                    <path d="M70,110 Q95,115 120,110" stroke="#22c55e" strokeWidth="2" fill="none"/>
                    <path d="M160,110 Q190,115 220,115" stroke="#22c55e" strokeWidth="2" fill="none"/>
                    {/* Pressure indicators */}
                    <circle cx="95" cy="112" r="3" fill="#22c55e"/>
                    <circle cx="190" cy="113" r="3" fill="#f59e0b"/>
                    {/* Labels */}
                    <text x="78" y="108" fill="#6ee7b7" fontSize="6">Normal</text>
                    <text x="175" y="110" fill="#fbbf24" fontSize="6">High</text>
                    <text x="10" y="195" fill="#475569" fontSize="6">● Pressure Normal   ● Status Warning   ● Status Flaring</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Anomaly Detection</h3>
            </div>
            <div className="p-3 space-y-2">
              {anomalyDetections.map((a, i) => {
                const cfg = anomalySeverityConfig[a.severity];
                return (
                  <div key={i} className={`p-3 rounded-lg border ${cfg.bg} flex gap-2.5`}>
                    <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${cfg.icon}`} />
                    <div>
                      <p className={`text-xs font-semibold ${cfg.title}`}>{a.type}:</p>
                      <p className="text-[11px] text-slate-600">{a.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Executive Recommendations */}
            <div className="px-4 py-3 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Executive Action Recommendation</h4>
              {[
                "Optimize Choke Settings on Well A-12",
                "Inspect Pipeline B-4 Pressure Relief System",
                "Review Flaring Reduction Protocol on Platform C",
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-white bg-[#0d1b2a] rounded px-1.5 py-0.5 flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-[11px] text-slate-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Target vs Actual Production Chart</h3>
            <div className="flex gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-4 h-px bg-blue-500 inline-block" />Planned</span>
              <span className="flex items-center gap-1"><span className="w-4 h-px bg-emerald-500 inline-block" />Actual</span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionChartData}>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
