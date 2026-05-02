import DashboardLayout from "@/components/layout/DashboardLayout";
import { Truck, Package, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const routes = [
  { id: "R-001", origin: "Depot Plumpang", destination: "SPBU Cikini", driver: "Ahmad Ridwan", truck: "B 9531 PD", status: "In Transit", product: "Pertalite", volume: "8,000 L", eta: "14:45", progress: 65 },
  { id: "R-002", origin: "Depot Cikampek", destination: "SPBU Bekasi Barat", driver: "Budi Santoso", truck: "D 7823 GH", status: "Delivered", product: "Solar", volume: "12,000 L", eta: "Done", progress: 100 },
  { id: "R-003", origin: "Depot Padalarang", destination: "SPBU Bandung Kota", driver: "Candra Wijaya", truck: "D 4521 KL", status: "Loading", product: "Pertamax", volume: "6,000 L", eta: "16:30", progress: 15 },
  { id: "R-004", origin: "Depot Plumpang", destination: "SPBU Tangerang", driver: "Deni Pratama", truck: "B 1234 PQ", status: "In Transit", product: "Pertalite", volume: "9,500 L", eta: "15:10", progress: 42 },
  { id: "R-005", origin: "Depot Semarang", destination: "SPBU Solo", driver: "Eko Saputra", truck: "H 5678 RS", status: "Delayed", product: "Bio Solar", volume: "10,000 L", eta: "18:00", progress: 28 },
  { id: "R-006", origin: "Depot Surabaya", destination: "SPBU Malang", driver: "Fajar Nugraha", truck: "L 9012 TU", status: "In Transit", product: "Pertamax Turbo", volume: "4,000 L", eta: "17:20", progress: 55 },
];

const statusStyle: Record<string, string> = {
  "In Transit": "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Loading: "bg-amber-100 text-amber-700",
  Delayed: "bg-red-100 text-red-700",
};

const statusProgress: Record<string, string> = {
  "In Transit": "bg-blue-500",
  Delivered: "bg-emerald-500",
  Loading: "bg-amber-500",
  Delayed: "bg-red-500",
};

export default function ControllingDistribusiPage() {
  const inTransit = routes.filter(r => r.status === "In Transit").length;
  const delivered = routes.filter(r => r.status === "Delivered").length;
  const delayed = routes.filter(r => r.status === "Delayed").length;
  const loading = routes.filter(r => r.status === "Loading").length;

  return (
    <DashboardLayout title="Controlling Distribusi" subtitle="Delivery Route Control · Volume Tracking · Driver Monitoring">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "In Transit", value: inTransit, icon: Truck, color: "blue" },
            { label: "Delivered Today", value: delivered, icon: CheckCircle, color: "green" },
            { label: "Loading", value: loading, icon: Package, color: "amber" },
            { label: "Delayed", value: delayed, icon: AlertTriangle, color: "red" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                c.color === "blue" ? "bg-blue-50" : c.color === "green" ? "bg-emerald-50" : c.color === "amber" ? "bg-amber-50" : "bg-red-50"
              }`}>
                <c.icon size={18} className={
                  c.color === "blue" ? "text-blue-500" : c.color === "green" ? "text-emerald-500" : c.color === "amber" ? "text-amber-500" : "text-red-500"
                } />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                <p className="text-[11px] text-slate-400">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Route Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Active Distribution Routes</h3>
            <div className="flex gap-2">
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0d1b2a] text-white font-medium">+ Dispatch</button>
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium">Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500">
                  <th className="px-4 py-2.5 text-left font-semibold">Route ID</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Origin → Destination</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Driver</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Truck</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Product</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Volume</th>
                  <th className="px-4 py-2.5 text-left font-semibold min-w-[100px]">Progress</th>
                  <th className="px-4 py-2.5 text-center font-semibold">ETA</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-slate-700">{r.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <span className="font-medium">{r.origin}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="font-medium">{r.destination}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.driver}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">{r.truck}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.product}</td>
                    <td className="px-4 py-3 text-xs text-right font-medium text-slate-700">{r.volume}</td>
                    <td className="px-4 py-3 min-w-[100px]">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                          <div className={`h-1.5 rounded-full ${statusProgress[r.status]}`} style={{ width: `${r.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400">{r.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center font-medium text-slate-600">{r.eta}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
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
