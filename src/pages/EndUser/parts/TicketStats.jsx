// src/components/parts/Dashboard/TicketStats.jsx
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle, MessageSquare } from "lucide-react"

export function TicketStats({ tickets }) {
  const stats = {
    open: tickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
    total: tickets.length
  }

  const statCards = [
    { label: "Open Tickets", value: stats.open, icon: AlertCircle, color: "blue" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "yellow" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green" },
    { label: "Total Tickets", value: stats.total, icon: MessageSquare, color: "gray" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
                <Icon className={`h-8 w-8 text-${stat.color}-500`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}