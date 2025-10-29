// src/components/parts/Dashboard/TicketItem.jsx
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"

export function TicketItem({ ticket }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Closed":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "In Progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200"
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const isResolved = ticket.status === "Resolved" || ticket.status === "Closed"

  return (
    <Card className={isResolved ? "opacity-75" : "hover:shadow-md transition-shadow"}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(ticket.status)}
              <span className={`font-medium ${isResolved ? "text-gray-600" : "text-blue-600"}`}>
                #{ticket.id}
              </span>
            </div>
            <Badge variant="outline" className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            {ticket.assignee && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Assigned</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} />
            <span className="text-sm text-gray-600">{ticket.priority}</span>
          </div>
        </div>
        <h3 className="font-semibold mb-2">{ticket.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" /> 
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {isResolved ? (
            <span className="text-green-600 font-medium">
              Resolved {new Date(ticket.updated_at).toLocaleDateString()}
            </span>
          ) : (
            ticket.assignee && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Assigned to {ticket.assignee.first_name} {ticket.assignee.last_name}</span>
              </div>
            )
          )}
        </div>
        {ticket.lastUpdate && (
          <div className={`mt-3 p-2 rounded-lg ${isResolved ? "bg-green-50" : "bg-blue-50"}`}>
            <p className={`text-sm ${isResolved ? "text-green-800" : "text-blue-800"}`}>
              <strong>{isResolved ? "Resolution:" : "Latest Update:"}</strong> {ticket.lastUpdate}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}