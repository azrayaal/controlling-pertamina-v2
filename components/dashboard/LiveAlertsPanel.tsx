import { liveAlerts } from "@/lib/mockData";
import Badge from "@/components/ui/Badge";

const statusColors: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  yellow: "text-amber-600 bg-amber-50",
  green: "text-emerald-600 bg-emerald-50",
  orange: "text-orange-500 bg-orange-50",
  red: "text-red-600 bg-red-50",
};

const levelBorder: Record<string, string> = {
  CRITICAL: "border-l-red-500",
  WARNING: "border-l-amber-400",
  NORMAL: "border-l-emerald-400",
};

export default function LiveAlertsPanel() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Live Alert</h3>
        <div className="flex items-center gap-2">
          <button className="text-[11px] text-slate-500 hover:text-slate-700 font-medium border-b-2 border-[#0d1b2a]">Live Alert</button>
          <span className="text-slate-300">|</span>
          <button className="text-[11px] text-slate-400 hover:text-slate-600 font-medium">SEVERITY</button>
          <button className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">ALL</button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {liveAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`px-3 py-2.5 border-b border-slate-50 border-l-4 ${levelBorder[alert.level] ?? "border-l-slate-300"}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <Badge level={alert.level} size="xs" />
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${statusColors[alert.statusColor] ?? "text-slate-500 bg-slate-50"}`}>
                {alert.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-tight">{alert.title}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{alert.subtitle}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-1">{alert.severity}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Status: <span className={`font-semibold ${statusColors[alert.statusColor]?.split(" ")[0]}`}>{alert.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
