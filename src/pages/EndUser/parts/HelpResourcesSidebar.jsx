// src/components/parts/Dashboard/HelpResourcesSidebar.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, ExternalLink, Phone, Mail } from "lucide-react"

export function HelpResourcesSidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-500" />
          <span>Help Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            IT Support Guide
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Emergency: Ext. 2847
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email IT Support
          </Button>
        </div>
        <div className="pt-3 border-t">
          <p className="text-xs text-gray-600">
            <strong>Office Hours:</strong>
            <br />
            Mon-Fri: 7:00 AM - 7:00 PM
            <br />
            Sat-Sun: 8:00 AM - 5:00 PM
          </p>
        </div>
      </CardContent>
    </Card>
  )
}