"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: "/dashboard.png",
    href: "/dashboard",
  },
  {
    label: "Stock Opname",
    icon: "/stockopname.png",
    href: "/stock-opname",
  },
  {
    label: "Controlling Cabang",
    icon: "/controlling_cabang.png",
    href: "/controlling-cabang",
  },
  {
    label: "Controlling Distribusi",
    icon: "/controlling_distribution.png",
    href: "/controlling-distribusi",
  },
  {
    label: "Live Tracking",
    icon: "/live_tracking.png",
    href: "/live-tracking",
  },
  {
    label: "Live CCTV",
    icon: "/live_cctv.png",
    href: "/live-cctv",
  },
  {
    label: "Analitics & Report",
    icon: "/analyhtic_report.png",
    href: "/analytics",
  },
];

const subModules = [
  { label: "Upstream", href: "/upstream" },
  { label: "Logistics", href: "/logistics" },
  { label: "Distribution", href: "/distribution" },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col gap-3 min-h-screen">
      {/* Main Sidebar */}
      <aside
        className={`ml-0 mt-0 md:ml-[19px] md:mt-[27px] min-h-[calc(100vh-20vh)] bg-white rounded-xl relative flex flex-col transition-all duration-300  border-r border-slate-200 ${
          collapsed ? "w-16" : "w-[210px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-3 py-4 border-b border-slate-100 min-h-[64px]">
          {collapsed ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/icon_small.png"
              alt="Pertamina"
              className="w-8 h-8 object-contain"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/icon_logo.png"
              alt="Pertamina Oil Monitoring"
              className="w-full max-w-[172px] h-auto object-contain block"
            />
          )}
        </div>

        {/* Collapse Button — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-6 top-[45%] z-20 hidden lg:flex items-center justify-center text-slate-500 transition-colors"
        >
          {collapsed ? (
            <img
            src="/menu_open.png"
            alt="menu"
            className="h-full object-contain"
          />
          ) : (
            <img
            src="/menu_close.png"
            alt="menu"
            className="h-full object-contain"
          />
          )}
        </button>

        {/* Navigation */}
        <nav className="py-3 px-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 ${
                  active
                    ? "bg-[#1e2d4d] shadow-sm"
                    : "hover:bg-slate-100"
                }`}
              >
                <div className="relative w-[18px] h-[18px] flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    sizes="18px"
                    className="object-contain"
                    style={{
                      filter: active
                        ? "brightness(0) invert(1)"
                        : "brightness(0) saturate(0) opacity(0.65)",
                    }}
                  />
                </div>

                {!collapsed && (
                  <span
                    className={`text-[13px] leading-tight whitespace-nowrap font-medium ${
                      active ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Modules & Bottom */}
      <div
        className={`ml-0 md:ml-[19px] rounded-xl bg-white  transition-all duration-300 ${
          collapsed ? "w-16" : "w-[210px]"
        }`}
      >
        {/* Sub Modules */}
        {/* {!collapsed && (
          <div className="px-2 pt-3 pb-2">
            <p className="px-2 mb-2 text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
              Modules
            </p>

            {subModules.map((module) => {
              const active = pathname === module.href;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                    active
                      ? "bg-[#1e2d4d] text-white font-semibold"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  <Layers size={13} className="flex-shrink-0" />
                  <span className="text-xs">{module.label}</span>
                </Link>
              );
            })}
          </div>
        )} */}

     {/* Bottom */}
        <div className="border-t border-slate-100 py-2 px-2">
          <Link
            href="/settings"
            title={collapsed ? "Settings" : undefined}
            className={`flex items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors ${
              collapsed
                ? "justify-center px-2 py-3"
                : "gap-3 px-3 py-2"
            }`}
          >
            <Settings size={17} className="flex-shrink-0" />

            {!collapsed && (
              <span className="text-[13px]">Settings</span>
            )}
          </Link>

          <button
            title={collapsed ? "Log Out" : undefined}
            className={`w-full flex items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors ${
              collapsed
                ? "justify-center px-2 py-3"
                : "gap-3 px-3 py-2"
            }`}
          >
            <LogOut size={17} className="flex-shrink-0" />

            {!collapsed && (
              <span className="text-[13px]">Log Out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}