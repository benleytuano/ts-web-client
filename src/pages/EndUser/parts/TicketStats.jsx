// src/components/parts/Dashboard/TicketStats.jsx
import { AlertCircle, Clock, CheckCircle, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TicketStats({ tickets }) {
  const stats = {
    open: tickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
    total: tickets.length
  }

  const statCards = [
    { label: "Open", value: stats.open, icon: AlertCircle, color: "blue" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "yellow" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green" },
    { label: "Total", value: stats.total, icon: MessageSquare, color: "gray" }
  ]

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: "text-blue-600",
              yellow: "text-yellow-600",
              green: "text-green-600",
              gray: "text-gray-600"
            }

            return (
              <div key={index} className="flex items-center gap-3 flex-1">
                <Icon className={`h-5 w-5 ${colorClasses[stat.color]}`} />
                <div className="min-w-0">
                  <p className={`text-lg font-bold ${colorClasses[stat.color]}`}>{stat.value}</p>
                  <p className="text-xs font-medium text-gray-600 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}