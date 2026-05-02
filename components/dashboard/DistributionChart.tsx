"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { distributionChartData } from "@/lib/mockData";
import { useState } from "react";

const periods = ["Hari", "Minggu", "Bulan", "Tahun"];

export default function DistributionChart() {
  const [activePeriod, setActivePeriod] = useState("Bulan");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Distribusi Jenis Minyak</h3>
          <p className="text-[11px] text-slate-400">Bulan Ini · Total: 8.9 MMKL</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                activePeriod === p
                  ? "bg-[#0d1b2a] text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionChartData} barSize={28}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}
              formatter={(v) => [`${v} KL`, "Volume"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {distributionChartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {distributionChartData.map((d) => (
          <span key={d.name} className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
