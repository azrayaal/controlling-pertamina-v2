"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";

const monthlyData = [
  { month: "Jan", production: 2200, distribution: 7800, revenue: 380 },
  { month: "Feb", production: 2350, distribution: 8100, revenue: 405 },
  { month: "Mar", production: 2180, distribution: 7900, revenue: 390 },
  { month: "Apr", production: 2400, distribution: 8400, revenue: 420 },
  { month: "May", production: 2450, distribution: 8900, revenue: 450 },
  { month: "Jun", production: 2300, distribution: 8200, revenue: 410 },
  { month: "Jul", production: 2500, distribution: 9100, revenue: 460 },
];

const productBreakdown = [
  { product: "Pertalite", volume: 2800, revenue: 180 },
  { product: "Pertamax", volume: 1900, revenue: 140 },
  { product: "Solar", volume: 1600, revenue: 95 },
  { product: "Pertamax Turbo", volume: 950, revenue: 80 },
  { product: "Bio Solar", volume: 700, revenue: 45 },
  { product: "Avtur", volume: 400, revenue: 60 },
];

const lossData = [
  { day: "Mon", loss: 1.2 }, { day: "Tue", loss: 0.8 }, { day: "Wed", loss: 1.5 },
  { day: "Thu", loss: 0.9 }, { day: "Fri", loss: 1.1 }, { day: "Sat", loss: 0.7 }, { day: "Sun", loss: 0.5 },
];

const reportCards = [
  { title: "Weekly Production Report", date: "2026-04-28", type: "Production", status: "Ready" },
  { title: "Distribution Efficiency Q1", date: "2026-03-31", type: "Distribution", status: "Ready" },
  { title: "Anomaly Incident Log", date: "2026-04-25", type: "Incident", status: "Ready" },
  { title: "Subsidy Allocation Report", date: "2026-04-20", type: "Finance", status: "Ready" },
  { title: "Fleet Performance Analysis", date: "2026-04-15", type: "Logistics", status: "Ready" },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics & Report" subtitle="Performance Insights · Trend Analysis · Downloadable Reports">
      <div className="space-y-4">
        {/* Overview KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Avg Daily Production", value: "2.45 MBOE", change: "+2.7%", up: true },
            { label: "Monthly Revenue", value: "IDR 450 T", change: "+5.2%", up: true },
            { label: "Distribution Efficiency", value: "94.8%", change: "+1.2%", up: true },
            { label: "Total Loss This Month", value: "IDR 1.2 B", change: "-8.3%", up: false },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-[11px] text-slate-400 font-medium">{k.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{k.value}</p>
              <p className={`text-[11px] font-semibold mt-1 ${k.up ? "text-emerald-600" : "text-red-500"}`}>
                {k.up ? "▲" : "▼"} {k.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Monthly Production & Distribution Trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="production" stroke="#3b82f6" fill="url(#colorProd)" strokeWidth={2} name="Production (MBOE)" />
                  <Area type="monotone" dataKey="distribution" stroke="#22c55e" fill="url(#colorDist)" strokeWidth={2} name="Distribution (MMKL)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Product Volume & Revenue Breakdown</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productBreakdown} barSize={16}>
                  <XAxis dataKey="product" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Volume (KL)" />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[3, 3, 0, 0]} name="Revenue (IDR T)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Loss trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Estimated Daily Loss (IDR Billion)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ fontSize: 11, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} name="Loss (IDR B)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Available Reports</h3>
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0d1b2a] text-white font-medium">+ Generate</button>
            </div>
            <div>
              {reportCards.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-blue-600">{r.type[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{r.title}</p>
                    <p className="text-[10px] text-slate-400">{r.type} · {r.date}</p>
                  </div>
                  <button className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors flex-shrink-0">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
