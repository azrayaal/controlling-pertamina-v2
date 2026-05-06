"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#ECECEC] dark:bg-[#0f172a] transition-colors duration-200">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, normal flow on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-[#ECECEC] dark:bg-[#0f172a] overflow-y-auto
          lg:relative lg:z-auto lg:inset-auto lg:overflow-visible
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar onMobileClose={() => setMobileOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-[19px]">
        <Header title={title} subtitle={subtitle} onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 bg-[#ECECEC] dark:bg-[#0f172a] transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
