import DashboardLayout from "@/components/layout/DashboardLayout";
import { controllingCabangData } from "@/lib/mockData";
import { Building2, Activity, AlertTriangle, TrendingUp } from "lucide-react";

const statusBadge: Record<string, string> = {
  Normal: "bg-emerald-100 text-emerald-700",
  Warning: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

export default function ControllingCabangPage() {
  const totalSPBU = controllingCabangData.reduce((s, r) => s + r.spbu, 0);
  const activeSPBU = controllingCabangData.reduce((s, r) => s + r.activeSpbu, 0);
  const totalAnomalies = controllingCabangData.reduce((s, r) => s + r.anomaly, 0);

  return (
    <DashboardLayout title="Controlling Cabang" subtitle="Branch Performance Monitoring · SPBU Status · Sales Analytics">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Branches", value: controllingCabangData.length, icon: Building2, color: "blue" },
            { label: "Total SPBU", value: totalSPBU, icon: Activity, color: "blue" },
            { label: "Active SPBU", value: activeSPBU, icon: TrendingUp, color: "green" },
            { label: "Active Anomalies", value: totalAnomalies, icon: AlertTriangle, color: "orange" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                c.color === "blue" ? "bg-blue-50" : c.color === "green" ? "bg-emerald-50" : "bg-orange-50"
              }`}>
                <c.icon size={18} className={
                  c.color === "blue" ? "text-blue-500" : c.color === "green" ? "text-emerald-500" : "text-orange-500"
                } />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{c.value.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Branch Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Branch Performance</h3>
            <div className="flex gap-2">
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0d1b2a] text-white font-medium">Export</button>
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium">Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500">
                  <th className="px-4 py-2.5 text-left font-semibold">Branch</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Region</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Total SPBU</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Active</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Avg Sales</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Anomalies</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {controllingCabangData.map((row, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">{row.cabang}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{row.region}</td>
                    <td className="px-4 py-3 text-xs text-right text-slate-700 font-medium">{row.spbu}</td>
                    <td className="px-4 py-3 text-xs text-right text-emerald-600 font-semibold">{row.activeSpbu}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{row.avgSales}</td>
                    <td className="px-4 py-3 text-center">
                      {row.anomaly > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-amber-600 font-semibold text-xs">
                          <AlertTriangle size={12} /> {row.anomaly}
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-[10px] px-2 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
