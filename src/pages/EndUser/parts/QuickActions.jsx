// src/components/parts/Dashboard/QuickActions.jsx
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function QuickActions({ categories, onActionClick }) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onActionClick(action)}
                  className="flex items-center gap-2 text-xs h-8"
                  title={action.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{action.title}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
