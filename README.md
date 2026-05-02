# Pertamina Oil Monitoring – Integrated Control Dashboard

Prototype dashboard for Pertamina's integrated oil monitoring system covering upstream, logistics, distribution, live tracking, CCTV, and analytics.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Recharts** (charts & graphs)
- **Lucide React** (icons)

## Pages / Modules

| Route | Description |
|---|---|
| `/dashboard` | Main overview: KPI stats, distribution chart, live tracking, alerts, AI engine |
| `/stock-opname` | Real-time fuel inventory across depots |
| `/controlling-cabang` | Branch performance monitoring |
| `/controlling-distribusi` | Delivery route tracking |
| `/live-tracking` | Vessel & truck AIS/GPS map |
| `/live-cctv` | 360° CCTV feeds (vessel, truck, driver, SPBU, pipeline) |
| `/analytics` | Charts, trend analysis, downloadable reports |
| `/upstream` | Upstream production dashboard (wells, anomaly detection) |
| `/logistics` | Logistics control dashboard (GPS, pipeline, reconciliation) |
| `/distribution` | Distribution & retail dashboard (SPBU, nozzle sales, subsidy) |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) – it will auto-detect Next.js.

## Maintainability

- All mock data is centralized in `lib/mockData.ts` – update data there
- Components are modular in `components/` folder
- Add a new page: create `app/<name>/page.tsx` and add to sidebar `navItems`
- Charts use Recharts `ResponsiveContainer` for auto-sizing
# controlling-pertamina-v2
