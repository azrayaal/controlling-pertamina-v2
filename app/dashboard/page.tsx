import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import DistributionChart from "@/components/dashboard/DistributionChart";
import LiveTrackingSection from "@/components/dashboard/LiveTrackingSection";
import LiveAlertsPanel from "@/components/dashboard/LiveAlertsPanel";
import AIDecisionEngine from "@/components/dashboard/AIDecisionEngine";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Welcome" subtitle="Integrated Monitoring & Control Dashboard">
      <div className="space-y-4">
        <StatsCards />
        <DistributionChart />

        {/* Live Tracking + Live Alerts — stacked on mobile, side-by-side on xl */}
        <div className="flex flex-col xl:flex-row gap-4 xl:h-[660px]">
          {/* Tracking card fills remaining width */}
          <div className="flex-1 min-w-0 flex flex-col min-h-[420px] xl:min-h-0">
            <LiveTrackingSection />
          </div>
          {/* Alerts panel: full-width on mobile, fixed sidebar on xl */}
          <div className="xl:w-72 flex-shrink-0 flex flex-col min-h-[320px] xl:min-h-0">
            <LiveAlertsPanel />
          </div>
        </div>

        <AIDecisionEngine />
      </div>
    </DashboardLayout>
  );
}
