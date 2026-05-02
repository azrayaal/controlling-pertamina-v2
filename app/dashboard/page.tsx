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

        {/* Live Tracking + Live Alerts — same height row */}
        <div className="flex gap-4" style={{ height: 660 }}>
          {/* Tracking card fills remaining width */}
          <div className="flex-1 min-w-0 flex flex-col">
            <LiveTrackingSection />
          </div>
          {/* Alerts panel fixed width, same height */}
          <div className="w-72 flex-shrink-0 flex flex-col">
            <LiveAlertsPanel />
          </div>
        </div>

        <AIDecisionEngine />
      </div>
    </DashboardLayout>
  );
}
