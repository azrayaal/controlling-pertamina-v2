import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#ECECEC" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-[19px]">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-4" style={{ background: "#ECECEC" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
