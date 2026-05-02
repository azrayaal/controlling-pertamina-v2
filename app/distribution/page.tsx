"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { nozzleSalesData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { AlertTriangle, TrendingUp, MapPin } from "lucide-react";

const distributionKPI = [
  { label: "Total Retail Sales", value: "$124.5M", change: "+2.1%", color: "emerald" },
  { label: "Fuel Stock Position", value: "18,500 kL", change: "92% Capacity", color: "blue" },
  { label: "Nozzle Transactions", value: "1,250,000", change: "+1.5%", color: "blue" },
  { label: "Subsidy Allocation", value: "500 kL", change: "75% Used", color: "amber" },
  { label: "Stock vs Sales Variance", value: "0.05%", change: "Low", color: "emerald" },
  { label: "Abnormal Transactions", value: "45", change: "Alert", color: "red" },
];

const subsidyData = [
  { year: "2021", value: 120 }, { year: "2022", value: 140 }, { year: "2023", value: 110 }, { year: "2024", value: 150 },
];

const reconciliationItems = [
  { label: "Tank Stock", value: "$11200.2kL", sub: "Tank Stock: 11,200 kL", change: "+2.1%", dir: "up" },
  { label: "Delivery Receipt", value: "18,500.0kL", sub: "Delivery Receipt: 18,500 kL", change: "-0.7%", dir: "down" },
  { label: "Sales Transaction", value: "1,250,000 IL", sub: "Sales Transaction: 1,250,000", change: "+1.5%", dir: "up" },
  { label: "Remaining Balance", value: "$110,280.00", sub: "Remaining: $1,280.00", change: "+0.05%", dir: "up" },
];

const statusColor = { Online: "bg-emerald-100 text-emerald-700", Offline: "bg-red-100 text-red-700" };

export default function DistributionPage() {
  return (
    <DashboardLayout title="Distribution & Retail Control Dashboard" subtitle="SPBU Network · Nozzle Sales · Subsidy Control · Reconciliation">
      <div className="space-y-4">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {distributionKPI.map((k) => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{k.label}</p>
              <p className={`text-base font-bold mt-1 ${
                k.color === "red" ? "text-red-600" : k.color === "amber" ? "text-amber-600" : k.color === "emerald" ? "text-emerald-600" : "text-slate-800"
              }`}>{k.value}</p>
              <p className="text-[10px] text-slate-400">{k.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Nozzle Sales Monitor */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Nozzle Sales Monitor</h3>
              <button className="text-[10px] text-slate-400">⋯</button>
            </div>
            <div className="p-3 border-b border-slate-100 flex gap-3">
              <select className="text-[10px] border border-slate-200 rounded px-2 py-1 bg-white text-slate-600 flex-1">
                <option>SPBU Soetr Premium</option>
              </select>
              <select className="text-[10px] border border-slate-200 rounded px-2 py-1 bg-white text-slate-600 flex-1">
                <option>All</option>
              </select>
            </div>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="px-3 py-1.5 text-left font-semibold">Product</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Sales/Nozzle</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Trx</th>
                    <th className="px-2 py-1.5 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {nozzleSalesData.map((r, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${r.productType === "Premium" ? "bg-red-400" : r.productType === "Pertamax" ? "bg-blue-400" : "bg-green-400"}`} />
                          {r.productType}
                        </div>
                      </td>
                      <td className="px-2 py-1 text-right text-slate-700">{r.salesPerNozzle}</td>
                      <td className="px-2 py-1 text-right text-slate-500">{r.transactions}</td>
                      <td className="px-2 py-1 text-center">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusColor[r.status as keyof typeof statusColor]}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SPBU Network Map */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">SPBU Network</h3>
              <div className="flex gap-1 text-[10px] text-slate-500">
                <span>Status by:</span>
                <select className="border-b border-slate-300 text-[10px] bg-transparent text-slate-600">
                  <option>Air network</option>
                </select>
              </div>
            </div>
            <div className="relative">
              {/* Map */}
              <div className="h-52 bg-slate-50 relative overflow-hidden">
                <svg viewBox="0 0 350 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect width="350" height="200" fill="#e8f0f7"/>
                  {/* Indonesia outline simplified */}
                  <path d="M20,65 Q55,50 90,58 Q120,52 145,65 Q165,78 158,92 Q148,107 128,110 Q105,118 78,112 Q52,118 35,105 Q20,95 20,80 Z" fill="#c8e6b4" stroke="#a8d09a" strokeWidth="0.8"/>
                  <path d="M80,130 Q115,118 150,123 Q185,118 220,125 Q255,120 285,128 Q308,125 320,135 Q328,147 322,160 Q312,170 295,170 Q272,176 248,170 Q224,177 200,171 Q176,178 150,172 Q126,178 103,172 Q88,167 84,154 Q80,142 80,130Z" fill="#c8e6b4" stroke="#a8d09a" strokeWidth="0.8"/>
                  {/* Heatmap blobs */}
                  <circle cx="150" cy="145" r="25" fill="#ef4444" opacity="0.25"/>
                  <circle cx="150" cy="145" r="15" fill="#ef4444" opacity="0.3"/>
                  <circle cx="150" cy="145" r="8" fill="#ef4444" opacity="0.5"/>
                  {/* SPBU markers */}
                  {[[100,140],[130,133],[155,128],[170,145],[130,155],[185,140],[80,145],[220,138]].map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#ef4444" : "#fbbf24"} stroke="white" strokeWidth="0.8"/>
                  ))}
                  {/* Transaction AL */}
                  <rect x="230" y="100" width="110" height="60" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="0.8"/>
                  <text x="238" y="115" fill="#475569" fontSize="7" fontWeight="bold">Transaction AL</text>
                  <circle cx="240" cy="127" r="3" fill="#22c55e"/><text x="246" y="130" fill="#475569" fontSize="6">Status</text>
                  <circle cx="240" cy="137" r="3" fill="#ef4444"/><text x="246" y="140" fill="#475569" fontSize="6">High</text>
                  <circle cx="275" cy="127" r="3" fill="#fbbf24"/><text x="281" y="130" fill="#475569" fontSize="6">Medium</text>
                  <circle cx="275" cy="137" r="3" fill="#94a3b8"/><text x="281" y="140" fill="#475569" fontSize="6">Low</text>
                </svg>
                {/* CCTV overlay */}
                <div className="absolute bottom-2 left-2 bg-slate-900/80 rounded-lg overflow-hidden w-28 h-16 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[8px] text-white font-semibold">CCTV</p>
                    <p className="text-[7px] text-slate-400">SPBU Jakarta Pusat</p>
                    <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mt-1 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="px-3 py-2 flex gap-3 flex-wrap">
              {[
                { color: "bg-emerald-500", label: "Online" },
                { color: "bg-red-400", label: "Offline" },
                { color: "bg-amber-400", label: "Alert" },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} />{l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Subsidy Control Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Subsidy Control Panel</h3>
            </div>
            <div className="p-3 space-y-3">
              {/* Quota gauge */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Quota Usage</span>
                  <span className="font-semibold">75%</span>
                </div>
                <div className="relative w-24 h-12 mx-auto">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round"/>
                    <path d="M10,50 A40,40 0 0,1 70,15" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round"/>
                    <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">75</text>
                    <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#94a3b8">Eligibility</text>
                  </svg>
                </div>
              </div>
              {/* Bar chart */}
              <div>
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Eligibility Status</p>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subsidyData} barSize={18}>
                      <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Repeat Transactions */}
              <div>
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Repeat Transactions</p>
                <div className="flex gap-3">
                  {[{ label: "Quota", val: 70 }, { label: "Eligibility", val: 185 }, { label: "Repeat", val: 15 }].map(r => (
                    <div key={r.label} className="text-center">
                      <p className="text-sm font-bold text-slate-800">{r.val}</p>
                      <p className="text-[9px] text-slate-400">{r.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Alert list */}
              <div>
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Alert / Suspicious Cluster</p>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between py-0.5">
                    <span className="text-[10px] text-slate-600">Suspicious Cluster {i}</span>
                    <AlertTriangle size={10} className="text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stock vs Sales Reconciliation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Stock vs Sales Reconciliation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reconciliationItems.map((r) => (
              <div key={r.label} className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[11px] text-slate-500 font-medium">{r.label}</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{r.value}</p>
                <p className="text-[10px] text-slate-400">{r.sub}</p>
                <p className={`text-[11px] font-semibold mt-1 ${r.dir === "up" ? "text-emerald-600" : "text-red-500"}`}>
                  {r.dir === "up" ? "▲" : "▼"} {r.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
