"use client";
import Image from "next/image";
import { Bell, User } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title = "Welcome", subtitle = "Integrated Monitoring & Control Dashboard" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100 sticky top-0 z-20">
      <div>
        <p className="text-[10px] text-slate-400">Homepage</p>
        <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full bg-[#1e2d4d] flex items-center justify-center shadow-sm">
          <Bell size={15} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e63946] rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
          <p className="text-xs font-semibold text-slate-700">Super Admin</p>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
            <User size={15} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
