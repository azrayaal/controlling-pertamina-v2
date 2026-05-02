import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="System Configuration">
      <div className="max-w-2xl space-y-4">
        {[
          { section: "Account", fields: [
            { label: "Full Name", value: "Super Admin", type: "text" },
            { label: "Email", value: "admin@pertamina.co.id", type: "email" },
            { label: "Role", value: "Super Administrator", type: "text" },
          ]},
          { section: "Notifications", fields: [
            { label: "Critical Alert Email", value: "enabled", type: "toggle" },
            { label: "Warning Alert SMS", value: "enabled", type: "toggle" },
            { label: "Daily Report", value: "enabled", type: "toggle" },
          ]},
        ].map((group) => (
          <div key={group.section} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">{group.section}</h3>
            <div className="space-y-3">
              {group.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between">
                  <label className="text-xs text-slate-600">{field.label}</label>
                  {field.type === "toggle" ? (
                    <div className="w-9 h-5 rounded-full bg-emerald-500 cursor-pointer relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="px-4 py-2 rounded-xl bg-[#0d1b2a] text-white text-xs font-semibold hover:bg-[#1a3a5c] transition-colors">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
