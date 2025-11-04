import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useFetcher } from "react-router";
import { logout } from "../../services/auth";
import { toast } from "sonner";

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
  const fetcher = useFetcher();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsData, setSettingsData] = useState({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message || "Profile updated successfully");
        setIsSettingsOpen(false);
      } else {
        toast.error(fetcher.data.error || "Failed to update profile");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleSettingsOpen = () => {
    // Use setTimeout to ensure dropdown closes first
    setTimeout(() => {
      setSettingsData({
        email: user?.email || "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setIsSettingsOpen(true);
    }, 0);
  };

  const handleSaveSettings = () => {
    // Validate inputs
    if (!settingsData.email) {
      toast.error("Email is required");
      return;
    }

    if (settingsData.password && settingsData.password !== settingsData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (settingsData.password && settingsData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Submit using fetcher
    const formData = new FormData();
    formData.append("email", settingsData.email);
    if (settingsData.password) {
      formData.append("password", settingsData.password);
      formData.append("password_confirmation", settingsData.confirmPassword);
    }

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <header className="bg-white border-b px-6 py-4 h-16 flex-shrink-0">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={`crumb-${index}-${crumb.path}`} className="flex items-center">
                  <BreadcrumbItem>
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
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </div>
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
              <DropdownMenuItem onClick={handleSettingsOpen}>
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

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Update your email and password
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={settingsData.email}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, email: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current password"
                  value={settingsData.password}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            {settingsData.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={settingsData.confirmPassword}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
