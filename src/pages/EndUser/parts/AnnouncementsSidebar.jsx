// src/components/parts/Dashboard/AnnouncementsSidebar.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Info } from "lucide-react"

export function AnnouncementsSidebar({ announcements }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <span>Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <Alert
            key={announcement.id}
            className={announcement.type === "warning" ? "border-orange-200 bg-orange-50" : ""}
          >
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium text-sm">{announcement.title}</p>
                <p className="text-sm">{announcement.message}</p>
                <p className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}