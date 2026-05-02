import { aiDecisionCards } from "@/lib/mockData";
import { Zap, MoreHorizontal, TrendingUp } from "lucide-react";

const confidenceColors = {
  green: { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  orange: { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
  blue: { bar: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
};

const progressColors = {
  green: "bg-emerald-500",
  orange: "bg-amber-500",
  blue: "bg-blue-500",
};

const statusColors = {
  blue: "text-blue-600 bg-blue-50",
  yellow: "text-amber-600 bg-amber-50",
  green: "text-emerald-600 bg-emerald-50",
};

const cardBorders = ["border-t-emerald-400", "border-t-amber-400", "border-t-blue-400"];

export default function AIDecisionEngine() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-800">AI Decision Engine</h3>
        <span className="px-2 py-0.5 rounded-full bg-[#0d1b2a] text-white text-[10px] font-semibold">3 Active Actions</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {aiDecisionCards.map((card, i) => {
          const cc = confidenceColors[card.confidenceColor];
          const pc = progressColors[card.progressColor];
          const sc = statusColors[card.statusColor];
          return (
            <div key={card.id} className={`bg-white rounded-xl shadow-sm border border-slate-100 border-t-4 ${cardBorders[i]} p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${cc.bg} flex items-center justify-center`}>
                    <Zap size={14} className={cc.text} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{card.title}</p>
                    <p className={`text-[10px] font-semibold ${cc.text}`}>{card.confidence}% Confidence</p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-slate-500">
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Unit: {card.unit}</span>
                <span>{card.updatedAt}</span>
              </div>
              <div className="flex justify-between text-[10px] font-medium mb-1.5">
                <span className="text-slate-600">{card.leftLabel}</span>
                <span className="text-slate-600">{card.rightLabel}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mb-3">
                <div
                  className={`h-2 rounded-full ${pc} transition-all`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div>
                  <p className="text-[9px] text-slate-400">Savings</p>
                  <p className="text-[11px] font-bold text-slate-700">{card.savings}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">Steps</p>
                  <p className="text-[11px] font-bold text-slate-700">{card.steps}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">Status</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc}`}>{card.status}</span>
                </div>
              </div>
              <div className={`rounded-lg ${cc.bg} p-2.5`}>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  <span className={`font-semibold ${cc.text} flex items-center gap-1 mb-0.5`}>
                    <TrendingUp size={10} /> AI Insight
                  </span>
                  {card.insight}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
