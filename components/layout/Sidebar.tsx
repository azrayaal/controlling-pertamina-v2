"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface SubItem {
  label: string;
  icon: string;
  href: string;
}

interface NavItem {
  label: string;
  /** Path to a PNG/image in /public. Set to "" when using lucideIcon. */
  icon: string;
  href: string;
  /** If true, opens in a new browser tab (external page). */
  external?: boolean;
  /** Lucide icon component — used instead of `icon` when provided. */
  lucideIcon?: LucideIcon;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: "/dashboard.png",
    href: "/dashboard",
  },
  {
    label: "Stock Opname",
    icon: "/stockopname.png",
    href: "/stock-opname",
    subItems: [
      { label: "Production", icon: "/poduction.png", href: "/stock-opname/production" },
      { label: "Refinery", icon: "/refinery.png", href: "/stock-opname/refinery" },
      { label: "Storage", icon: "/storage.png", href: "/stock-opname/storage" },
      { label: "Logistics", icon: "/logistic.png", href: "/stock-opname/logistics" },
    ],
  },
  {
    label: "Controlling Cabang",
    icon: "/controlling_cabang.png",
    href: "/controlling-cabang",
    subItems: [
      { label: "SPBU", icon: "/spbu.png", href: "/controlling-cabang/spbu" },
      { label: "SPKLU", icon: "/spklu.png", href: "/controlling-cabang/spklu" },
      { label: "SPBE", icon: "/spbe.png", href: "/controlling-cabang/spbe" },
    ],
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
  {
    label: "Security",
    icon: "",
    lucideIcon: ShieldCheck,
    href: "/security/dashboard.html",
    external: true,
  }
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    // Auto-open the submenu whose route matches the current path on first render
    const initial: Record<string, boolean> = {};
    // pathname is stable at init time via closure captured in the factory fn
    return initial;
  });

  // Auto-open the correct submenu when the path changes (e.g. on first load or navigation)
  // We derive the open state from the pathname so it's always correct
  const activeParent = navItems.find(
    (item) => item.subItems && pathname.startsWith(item.href)
  )?.href ?? null;

  const toggleMenu = (href: string) => {
    // Accordion behaviour: close every other submenu, toggle only the clicked one
    setOpenMenus((prev) => ({ [href]: !prev[href] }));
  };

  // A submenu is open if it was explicitly opened OR if it is the active parent route
  const isMenuOpen = (href: string) =>
    openMenus[href] !== undefined ? openMenus[href] : href === activeParent;

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
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = isMenuOpen(item.href);

            return (
              <div key={item.href}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.href)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 ${
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
                      <>
                        <span
                          className={`flex-1 text-left text-[13px] leading-tight whitespace-nowrap font-medium ${
                            active ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {item.label}
                        </span>
                        <ChevronDown
                          size={13}
                          className={`flex-shrink-0 transition-transform duration-200 ${
                            active ? "text-white" : "text-slate-400"
                          } ${isOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                ) : item.external ? (
                  /* External link — opens in a new tab */
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={collapsed ? item.label : undefined}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 hover:bg-slate-100`}
                  >
                    <div className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center">
                      {item.lucideIcon ? (
                        <item.lucideIcon
                          size={17}
                          className="text-slate-500"
                          style={{ flexShrink: 0 }}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.icon}
                            alt={item.label}
                            fill
                            sizes="18px"
                            className="object-contain"
                            style={{ filter: "brightness(0) saturate(0) opacity(0.65)" }}
                          />
                        </div>
                      )}
                    </div>
                    {!collapsed && (
                      <span className="text-[13px] leading-tight whitespace-nowrap font-medium text-slate-700 flex-1">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && (
                      <svg viewBox="0 0 12 12" width="10" height="10" className="text-slate-400 flex-shrink-0">
                        <path d="M2 2h8v8M10 2 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    )}
                  </a>
                ) : (
                  <Link
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
                )}

                {/* Submenu */}
                {hasSubItems && isOpen && !collapsed && (
                  <div className="ml-2 mb-1 pl-3 border-l border-slate-200">
                    {item.subItems!.map((sub) => {
                      const subActive = pathname === sub.href || pathname.startsWith(sub.href + "/");
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onMobileClose}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-all duration-150 ${
                            subActive
                              ? "bg-[#EEEDFA] text-[#1e2d4d]"
                              : "hover:bg-slate-50 text-slate-500"
                          }`}
                        >
                          <div className="relative w-[14px] h-[14px] flex-shrink-0">
                            <Image
                              src={sub.icon}
                              alt={sub.label}
                              fill
                              sizes="14px"
                              className="object-contain"
                              style={{
                                filter: subActive
                                  ? "brightness(0) saturate(100%) invert(13%) sepia(60%) saturate(500%) hue-rotate(200deg)"
                                  : "brightness(0) saturate(0) opacity(0.5)",
                              }}
                            />
                          </div>
                          <span
                            className={`text-[12px] leading-tight whitespace-nowrap font-medium ${
                              subActive ? "text-[#1e2d4d]" : "text-slate-500"
                            }`}
                          >
                            {sub.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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