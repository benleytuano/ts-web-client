import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import {
  Home,
  Laptop,
  Megaphone,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";

const allNavigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin"], route: "/dashboard" },
  { id: "tickets", label: "Tickets", icon: Laptop, roles: ["admin", "agent"], route: "/dashboard" },
  { id: "equipment", label: "Equipment Requests", icon: Laptop, roles: ["admin"], route: "/dashboard" },
  { id: "announcements", label: "Announcements", icon: Megaphone, roles: ["admin"], route: "/dashboard" },
  { id: "administration", label: "Administration", icon: Settings, roles: ["admin"], route: "/dashboard/user-management" },
];

// Helper function to capitalize first letter of each word
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to get user initials
const getUserInitials = (user) => {
  if (!user) return "U";

  if (user.first_name && user.last_name) {
    return (user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase();
  }

  if (user.name) {
    const parts = user.name.split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  }

  return "U";
};

export function Sidebar({
  collapsed,
  onToggle,
  activeSection,
  onSectionChange,
  user,
}) {
  const navigate = useNavigate();

  // Get user role (handle both snake_case and camelCase)
  const userRole = user?.role?.name || user?.roleName || "agent";

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter((item) =>
    item.roles.includes(userRole.toLowerCase())
  );

  const handleNavigation = (item) => {
    // Update the active section dynamically
    onSectionChange(item.id);
    // Navigate to the item's route
    navigate(item.route);
  };

  return (
    <div
      className={cn(
        "bg-white border-r transition-all duration-300 flex flex-col h-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-bold text-blue-600 truncate">IHOMS</h1>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 cursor-pointer",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => handleNavigation(item)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-2 truncate">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Profile - Fixed positioning */}
      {!collapsed && (
        <div className="p-4 flex-shrink-0">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 min-w-0">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-blue-500 text-white font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {capitalizeWords(
                      user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.name || "User"
                    )}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {capitalizeWords(user?.role?.name || "User")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
