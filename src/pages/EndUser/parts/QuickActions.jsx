// src/components/parts/Dashboard/QuickActions.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Printer, Monitor, Wifi, Phone, Mail, Shield } from "lucide-react"

export function QuickActions({ categories, onActionClick }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription>Get help quickly with common issues</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((action) => {
            const Icon = action.icon
            return (
              <Card
                key={action.id}
                className={`cursor-pointer transition-all hover:shadow-md border ${action.color}`}
                onClick={() => onActionClick(action)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs opacity-75 mt-1">{action.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
