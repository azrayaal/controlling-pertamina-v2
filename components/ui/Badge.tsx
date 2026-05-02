interface BadgeProps {
  level: "CRITICAL" | "WARNING" | "NORMAL" | string;
  size?: "sm" | "xs";
}

const levelConfig = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  WARNING: "bg-amber-100 text-amber-700 border-amber-200",
  NORMAL: "bg-green-100 text-green-700 border-green-200",
};

export default function Badge({ level, size = "sm" }: BadgeProps) {
  const cls = levelConfig[level as keyof typeof levelConfig] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      className={`inline-flex items-center border rounded font-semibold tracking-wide ${
        size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
      } ${cls}`}
    >
      ★ {level}
    </span>
  );
}
