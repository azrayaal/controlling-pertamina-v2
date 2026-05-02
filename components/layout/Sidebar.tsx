"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Settings, LogOut, ChevronLeft, ChevronRight, Layers } from "lucide-react";
// Note: icon_logo uses plain <img> for reliable rendering; nav icons use next/image
import { useState } from "react";

const navItems = [
  { label: "Dashboard",              icon: "/dashboard.png",                href: "/dashboard" },
  { label: "Stock Opname",           icon: "/stockopname.png",              href: "/stock-opname" },
  { label: "Controlling Cabang",     icon: "/controlling_cabang.png",       href: "/controlling-cabang" },
  { label: "Controlling Distribusi", icon: "/controlling_distribution.png", href: "/controlling-distribusi" },
  { label: "Live Tracking",          icon: "/live_tracking.png",            href: "/live-tracking" },
  { label: "Live CCTV",              icon: "/live_cctv.png",                href: "/live-cctv" },
  { label: "Analitics & Report",     icon: "/analyhtic_report.png",         href: "/analytics" },
];

const subModules = [
  { label: "Upstream",     href: "/upstream" },
  { label: "Logistics",    href: "/logistics" },
  { label: "Distribution", href: "/distribution" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col h-full transition-all duration-300 bg-white border-r border-slate-200 ${
        collapsed ? "w-16" : "w-[200px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-3 py-4 border-b border-slate-100 min-h-[64px]">
        {collapsed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/icon_small.png"
            alt="Pertamina"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/icon_logo.png"
            alt="Pertamina Oil Monitoring"
            style={{ width: "100%", maxWidth: 172, height: "auto", objectFit: "contain", display: "block" }}
          />
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[46px] z-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto px-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 ${
                active
                  ? "bg-[#1e2d4d] shadow-sm"
                  : "hover:bg-slate-100"
              }`}
            >
              {/* PNG icon — invert to white when active */}
              <div className="w-[18px] h-[18px] flex-shrink-0 relative">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  className="object-contain"
                  style={{ filter: active ? "brightness(0) invert(1)" : "brightness(0) saturate(0) opacity(0.65)" }}
                  sizes="18px"
                />
              </div>
              {!collapsed && (
                <span className={`text-[13px] leading-tight whitespace-nowrap font-medium ${active ? "text-white" : "text-slate-700"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sub modules */}
      {!collapsed && (
        <div className="px-2 pb-2 border-t border-slate-100 pt-2">
          <p className="px-2 text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-1">Modules</p>
          {subModules.map((m) => {
            const active = pathname === m.href;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-0.5 transition-colors ${
                  active
                    ? "bg-[#1e2d4d] text-white font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <Layers size={12} className="flex-shrink-0" />
                <span className="text-xs">{m.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom */}
      <div className="border-t border-slate-100 py-2 px-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-[13px]">Settings</span>}
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span className="text-[13px]">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
