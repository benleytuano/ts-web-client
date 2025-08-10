// src/components/parts/Dashboard/DashboardHeader.jsx
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Plus } from "lucide-react"

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
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white font-semibold">{userName}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
