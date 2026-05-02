"use client";
import { Bell, User, Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export default function Header({
  title = "Welcome",
  subtitle = "Integrated Monitoring & Control Dashboard",
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="mx-3 lg:mx-[19px] mt-3 lg:mt-[27px] shadow-sm rounded-xl flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-slate-100 sticky top-0 z-20 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 flex-shrink-0 rounded-lg bg-[#1e2d4d] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu size={14} className="text-white" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 hidden sm:block">Homepage</p>
          <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="relative w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-[#1e2d4d] flex items-center justify-center shadow-sm">
          <Bell size={14} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e63946] rounded-xl text-[9px] text-white flex items-center justify-center font-bold">3</span>
        </button>
        <div className="flex items-center gap-2 pl-2 lg:pl-3 border-2 shadow-sm border-slate-100 rounded-xl px-2 lg:px-3 py-1">
          <p className="text-xs font-semibold text-slate-700 hidden sm:block">Super Admin</p>
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
            <User size={14} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
