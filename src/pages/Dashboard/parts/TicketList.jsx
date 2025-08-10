"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Printer,
  Monitor,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

export function TicketList({ tickets, selectedTicket, onTicketSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Closed":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    if (category.toLowerCase().includes("printer")) {
      return <Printer className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && ticket.status === "Open") ||
      (activeTab === "assigned" && ticket.assignedTo);

    const matchesPriority =
      priorityFilter === "all" ||
      ticket.priority.toLowerCase() === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      ticket.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesTab && matchesPriority && matchesCategory;
  });

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full overflow-auto">
      {/* Fixed Header */}
      <div className="p-4 border-b flex-shrink-0 space-y-4 bg-white sticky top-0 z-10">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Priority</p>
                <div className="space-y-1">
                  {["all", "critical", "high", "medium", "low"].map(
                    (priority) => (
                      <DropdownMenuItem
                        key={priority}
                        onClick={() => setPriorityFilter(priority)}
                        className={
                          priorityFilter === priority ? "bg-accent" : ""
                        }
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </DropdownMenuItem>
                    )
                  )}
                </div>
              </div>
              <div className="p-2 border-t">
                <p className="text-sm font-medium mb-2">Category</p>
                <div className="space-y-1">
                  {["all", "printer", "system"].map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={categoryFilter === category ? "bg-accent" : ""}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="open" className="text-xs">
              Open
            </TabsTrigger>
            <TabsTrigger value="assigned" className="text-xs">
              Assigned
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Ticket List */}
      <div className="p-2 space-y-2 min-h-full">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              selectedTicket?.id === ticket.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : ""
            }`}
            onClick={() => onTicketSelect(ticket)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(ticket.category)}
                  <span className="text-sm font-medium text-blue-600">
                    #{ticket.id}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(ticket.status)}
                  <div
                    className={`w-2 h-2 rounded-full ${getPriorityColor(
                      ticket.priority
                    )}`}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {ticket.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1 min-w-0">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{ticket.requester}</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
