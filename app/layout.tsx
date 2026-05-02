import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase is required so relative OG image URLs become absolute
  // (WhatsApp, Telegram, etc. only follow absolute URLs)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),

  title: "Pertamina Oil Monitoring – Integrated Control Dashboard",
  description:
    "Pertamina integrated monitoring & control system for upstream, logistics, distribution, live tracking, and CCTV.",

  icons: {
    icon: "/icon_small.png",
    apple: "/icon_small.png",
    shortcut: "/icon_small.png",
    other: { rel: "icon", url: "/icon_small.png" },
  },

  openGraph: {
    title: "Pertamina Oil Monitoring – Integrated Control Dashboard",
    description:
      "Pertamina integrated monitoring & control system for upstream, logistics, distribution, live tracking, and CCTV.",
    url: "/",
    siteName: "Pertamina Oil Monitoring",
    images: [
      {
        url: "/icon_small.png",
        width: 512,
        height: 512,
        alt: "Pertamina Oil Monitoring",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Pertamina Oil Monitoring – Integrated Control Dashboard",
    description:
      "Pertamina integrated monitoring & control system for upstream, logistics, distribution, live tracking, and CCTV.",
    images: ["/icon_small.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
