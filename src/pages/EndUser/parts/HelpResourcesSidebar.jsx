// src/components/parts/Dashboard/HelpResourcesSidebar.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, ExternalLink, Phone, Mail } from "lucide-react"

export function HelpResourcesSidebar() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Help & Support</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1.5">
          <Button
            variant="ghost"
            className="w-full justify-start h-8 text-xs px-2"
            size="sm"
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            IT Support Guide
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-8 text-xs px-2"
            size="sm"
          >
            <Phone className="h-3 w-3 mr-2" />
            Emergency: Ext. 2847
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-8 text-xs px-2"
            size="sm"
          >
            <Mail className="h-3 w-3 mr-2" />
            Email IT Support
          </Button>
        </div>
        <div className="pt-2 border-t mt-2">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="block mb-1">Office Hours:</strong>
            <span className="block">Mon-Fri: 7:00 AM - 7:00 PM</span>
            <span className="block">Sat-Sun: 8:00 AM - 5:00 PM</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}