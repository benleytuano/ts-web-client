// src/components/parts/Dashboard/AnnouncementsSidebar.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Info } from "lucide-react"

export function AnnouncementsSidebar({ announcements }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Bell className="h-4 w-4 text-orange-500" />
          <span>Announcements</span>
          {announcements.length > 0 && (
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {announcements.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Alert
              key={announcement.id}
              className={`p-3 ${
                announcement.type === "warning"
                  ? "border-orange-200 bg-orange-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <Info className="h-3 w-3 mt-0.5" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-xs leading-tight">{announcement.title}</p>
                  <p className="text-xs text-gray-700 line-clamp-2">{announcement.message}</p>
                  <p className="text-xs text-gray-500 pt-1">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <p className="text-xs text-center">No announcements at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}