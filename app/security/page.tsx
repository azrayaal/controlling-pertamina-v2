"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function SecurityPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#061224]">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 bg-[#ECECEC] overflow-y-auto
          lg:relative lg:z-auto lg:inset-auto lg:overflow-visible
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar onMobileClose={() => setMobileOpen(false)} />
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-[#0E2240] rounded-lg flex items-center justify-center shadow-lg"
      >
        <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
          <path d="M2 5h16M2 10h16M2 15h16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Full-height iframe — the HTML file has its own login + dashboard */}
      <div className="flex-1 overflow-hidden lg:ml-[19px]">
        <iframe
          src="/security/dashboard.html"
          className="w-full h-full border-0 block"
          title="Pertamina IOC — Endpoint Security Dashboard"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
