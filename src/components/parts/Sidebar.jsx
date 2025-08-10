import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Home,
  Laptop,
  Megaphone,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "tickets", label: "Tickets", icon: Laptop },
  { id: "equipment", label: "Equipment Requests", icon: Laptop },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "administration", label: "Administration", icon: Settings },
];

export function Sidebar({
  collapsed,
  onToggle,
  activeSection,
  onSectionChange,
}) {
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
                "w-full justify-start mb-1",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => onSectionChange(item.id)}
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
                  <AvatarFallback className="text-xs">TB</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Tuaño, Benley Earl
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrator
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
