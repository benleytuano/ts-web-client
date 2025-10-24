// src/components/parts/Dashboard/DashboardHeader.jsx
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { logout } from "../../../services/auth";


export function DashboardHeader({ onNewTicket, userName = "RP" }) {
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
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
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
                    {userName}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">this should be the name of the login user</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    this should be the the role of the login user
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
      </div>
    </div>
  )
}
