// src/components/parts/Dashboard/DashboardHeader.jsx
import { useState, useEffect } from "react"
import { useFetcher } from "react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { logout } from "../../../services/auth";
import { toast } from "sonner";


export function DashboardHeader({ onNewTicket, user }) {
  const fetcher = useFetcher()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [settingsData, setSettingsData] = useState({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  })

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success(fetcher.data.message || "Profile updated successfully")
        setIsSettingsOpen(false)
      } else {
        toast.error(fetcher.data.error || "Failed to update profile")
      }
    }
  }, [fetcher.state, fetcher.data])

  // Get user initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const userInitials = getInitials(user?.first_name, user?.last_name)
  const userName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim()

  const handleSettingsOpen = () => {
    // Use setTimeout to ensure dropdown closes first
    setTimeout(() => {
      setSettingsData({
        email: user?.email || "",
        password: "",
        confirmPassword: "",
      })
      setShowPassword(false)
      setIsSettingsOpen(true)
    }, 0)
  }

  const handleSaveSettings = () => {
    // Validate inputs
    if (!settingsData.email) {
      toast.error("Email is required")
      return
    }

    if (settingsData.password && settingsData.password !== settingsData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (settingsData.password && settingsData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    // Submit using fetcher
    const formData = new FormData()
    formData.append("email", settingsData.email)
    if (settingsData.password) {
      formData.append("password", settingsData.password)
      formData.append("password_confirmation", settingsData.confirmPassword)
    }

    fetcher.submit(formData, { method: "post" })
  }

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IT Support Dashboard</h1>
              <p className="text-gray-600">Welcome back! Manage your support tickets and requests.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
          
            <Button onClick={onNewTicket}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-500"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName}</p>
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

          <div className="space-y-4 py-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email Address</Label>
              <Input
                id="settings-email"
                type="email"
                value={settingsData.email}
                onChange={(e) =>
                  setSettingsData({ ...settingsData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
              <p className="text-xs text-gray-500">
                Current email: {user?.email}
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="settings-password">New Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="settings-password"
                  type={showPassword ? "text" : "password"}
                  value={settingsData.password}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, password: e.target.value })
                  }
                  placeholder="Leave blank to keep current password"
                  className="pr-10"
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
                <Label htmlFor="settings-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="settings-confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={settingsData.confirmPassword}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm your new password"
                    className="pr-10"
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
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
              disabled={fetcher.state !== "idle"}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} disabled={fetcher.state !== "idle"}>
              {fetcher.state !== "idle" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
