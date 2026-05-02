import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pertamina Oil Monitoring – Integrated Control Dashboard",
  description: "Pertamina integrated monitoring & control system for upstream, logistics, distribution, live tracking, and CCTV.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
