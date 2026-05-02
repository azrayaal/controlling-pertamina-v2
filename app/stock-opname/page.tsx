import DashboardLayout from "@/components/layout/DashboardLayout";
import { stockOpnameData } from "@/lib/mockData";
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const summaryCards = [
  { label: "Total Depots", value: "42", icon: Package, color: "blue" },
  { label: "Normal Stock", value: "36", icon: CheckCircle, color: "green" },
  { label: "Low Stock Alert", value: "4", icon: AlertTriangle, color: "orange" },
  { label: "Critical", value: "2", icon: AlertTriangle, color: "red" },
];

function StockBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  const colorMap: Record<string, string> = {
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-amber-500",
    purple: "bg-purple-500",
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
        <div className={`h-1.5 rounded-full ${colorMap[color]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-400 w-10 text-right">{(value / 1000).toFixed(0)}K</span>
    </div>
  );
}

export default function StockOpnamePage() {
  return (
    <DashboardLayout title="Stock Opname" subtitle="Real-time Fuel Inventory · All Depots">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryCards.map((c) => (
            <div key={c.label} className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                c.color === "red" ? "bg-red-50" : c.color === "orange" ? "bg-orange-50" : c.color === "green" ? "bg-emerald-50" : "bg-blue-50"
              }`}>
                <c.icon size={18} className={
                  c.color === "red" ? "text-red-500" : c.color === "orange" ? "text-orange-500" : c.color === "green" ? "text-emerald-500" : "text-blue-500"
                } />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{c.value}</p>
                <p className="text-[11px] text-slate-400">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Depot Stock Inventory</h3>
            <div className="flex gap-2">
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0d1b2a] text-white font-medium hover:bg-[#1a3a5c] transition-colors">Export</button>
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500">
                  <th className="px-4 py-2.5 text-left font-semibold">Depot</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Location</th>
                  <th className="px-4 py-2.5 text-left font-semibold min-w-[120px]">Pertalite</th>
                  <th className="px-4 py-2.5 text-left font-semibold min-w-[120px]">Pertamax</th>
                  <th className="px-4 py-2.5 text-left font-semibold min-w-[120px]">Solar</th>
                  <th className="px-4 py-2.5 text-left font-semibold min-w-[100px]">LPG</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Updated</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stockOpnameData.map((row, i) => {
                  const total = row.pertalite + row.pertamax + row.solar + row.lpg;
                  const status = total > 200000 ? "Normal" : total > 150000 ? "Warning" : "Critical";
                  return (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800">{row.depot}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{row.location}</td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <StockBar value={row.pertalite} max={100000} color="green" />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <StockBar value={row.pertamax} max={60000} color="blue" />
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <StockBar value={row.solar} max={80000} color="orange" />
                      </td>
                      <td className="px-4 py-3 min-w-[100px]">
                        <StockBar value={row.lpg} max={15000} color="purple" />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{row.lastUpdated}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          status === "Critical" ? "bg-red-100 text-red-600" :
                          status === "Warning" ? "bg-amber-100 text-amber-600" :
                          "bg-emerald-100 text-emerald-600"
                        }`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Product Legend</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { color: "bg-emerald-500", label: "Pertalite (RON 90)" },
              { color: "bg-blue-500", label: "Pertamax (RON 92)" },
              { color: "bg-amber-500", label: "Solar / Bio Solar" },
              { color: "bg-purple-500", label: "LPG 3Kg / 12Kg" },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-2 text-xs text-slate-600">
                <span className={`w-3 h-3 rounded ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
