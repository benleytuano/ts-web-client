import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  Bell,
  Plus,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { logout } from "../../services/auth";

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

// Helper function to generate breadcrumb items from pathname
const generateBreadcrumbs = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  // Always add Dashboard as first item
  breadcrumbs.push({ label: "Dashboard", path: "/dashboard", isHome: true });

  // Map segments to breadcrumb labels
  const segmentLabels = {
    "user-management": "User Management",
    tickets: "Tickets",
    equipment: "Equipment Requests",
    announcements: "Announcements",
  };

  segments.forEach((segment, index) => {
    if (segment === "dashboard") return; // Skip dashboard as it's already added

    const label = segmentLabels[segment] || capitalizeWords(segment.replace(/-/g, " "));
    const path = "/" + segments.slice(0, index + 1).join("/");

    breadcrumbs.push({ label, path, isLast: index === segments.length - 1 });
  });

  return breadcrumbs;
};

export function Header({ ticketId, user }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <header className="bg-white border-b px-6 py-4 h-16 flex-shrink-0">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <>
                  <BreadcrumbItem key={`item-${crumb.path}`}>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => navigate(crumb.path)}
                        className="cursor-pointer"
                      >
                        {crumb.isHome ? <Home className="h-4 w-4" /> : crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator key={`sep-${crumb.path}`} />}
                </>
              ))}
              {ticketId && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>#{ticketId}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Bell className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Ticket</span>
          </Button>

          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4" />
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-500"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {capitalizeWords(
                      user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.name || "User"
                    )}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {capitalizeWords(user?.role?.name || "User")}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                  console.log("Logging out...");
                  await logout();
                }}
                className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
