"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";

export function TicketInfoPanel({ ticket }) {
  return (
    <div className="w-80 bg-white border-l flex-shrink-0 h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Requester
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {ticket.requester
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{ticket.requester}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Department
              </Label>
              <p className="text-sm mt-1">{ticket.department}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Location
              </Label>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{ticket.location}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Category
              </Label>
              <Badge variant="secondary" className="mt-1 block w-fit">
                {ticket.category}
              </Badge>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Created
              </Label>
              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {ticket.assignedTo && (
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Assigned To
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {ticket.assignedTo
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.assignedTo}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Assign Ticket
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Change Priority
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
