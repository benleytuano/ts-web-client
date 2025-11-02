import { useState } from "react";
import { Outlet, useRouteLoaderData } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
import { Header } from "../components/shared/Header";

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("tickets");
  const user = useRouteLoaderData("root");

  return (
    <>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Main Layout */}
        <div className="flex flex-1 min-h-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            user={user}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <Header user={user} />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
