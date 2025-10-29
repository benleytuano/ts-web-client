// src/components/parts/Dashboard/TicketList.jsx
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle } from "lucide-react"
import { TicketItem } from "./TicketItem"

export function TicketList({ tickets }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openTickets = filteredTickets.filter((t) => t.status === "open" || t.status === "In Progress")
  const closedTickets = filteredTickets.filter((t) => t.status === "resolved" || t.status === "closed")

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Support Tickets</CardTitle>
            <CardDescription>Track the status of your submitted tickets</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="open" className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0 sticky top-0 z-10">
            <TabsTrigger value="open">Open & In Progress ({openTickets.length})</TabsTrigger>
            <TabsTrigger value="closed">Resolved & Closed ({closedTickets.length})</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto pr-2">
            <TabsContent value="open" className="space-y-4 mt-4">
              {openTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No open tickets. Great job!</p>
                </div>
              ) : (
                openTickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
              )}
            </TabsContent>
            <TabsContent value="closed" className="space-y-4 mt-4">
              {closedTickets.map((ticket) => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}