import { statsCards } from "@/lib/mockData";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Shield, DollarSign } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  production: TrendingUp,
  distribution: TrendingUp,
  energy: DollarSign,
  alerts: AlertTriangle,
  integrity: Shield,
  loss: TrendingDown,
};

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  red: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-500", dot: "bg-orange-500" },
};

const changeColorMap = {
  positive: "text-emerald-600",
  negative: "text-red-500",
  live: "text-blue-600",
  warning: "text-amber-600",
};

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statsCards.map((card) => {
        const Icon = iconMap[card.id] ?? Activity;
        const c = colorMap[card.color as keyof typeof colorMap] ?? colorMap.blue;
        const changeColor = changeColorMap[card.changeType];
        return (
          <div key={card.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium leading-tight">{card.label}</span>
              <div className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center`}>
                <Icon size={12} className={c.text} />
              </div>
            </div>
            <p className={`text-lg font-bold leading-tight ${card.color === "red" ? "text-red-600" : card.color === "orange" ? "text-orange-500" : "text-slate-800"}`}>
              {card.value}
              {card.unit && <span className="text-xs font-semibold text-slate-400 ml-1">{card.unit}</span>}
            </p>
            <p className={`text-[10px] font-medium flex items-center gap-1 ${changeColor}`}>
              {card.changeType === "live" && <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />}
              {card.change}
            </p>
          </div>
        );
      })}
    </div>
  );
}
