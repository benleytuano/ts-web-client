import { useState } from "react";
import { Outlet, useRouteLoaderData, useNavigation } from "react-router";
import { Sidebar } from "../components/shared/Sidebar";
import { Header } from "../components/shared/Header";
import { Toaster } from "../components/ui/sonner";
import UserManagementSkeleton from "../pages/UserManagement/UserManagementSkeleton";

export default function RootLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const user = useRouteLoaderData("root");
  const navigation = useNavigation();

  // Determine which skeleton to show based on the route being loaded
  const getLoadingSkeleton = () => {
    if (navigation.state === "loading" && navigation.location) {
      const pathname = navigation.location.pathname;

      if (pathname === "/dashboard/user-management") {
        return <UserManagementSkeleton />;
      }
    }
    return null;
  };

  const loadingSkeleton = getLoadingSkeleton();

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
            {loadingSkeleton || <Outlet />}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
