import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Monitor,
  Bold,
  Italic,
  Underline,
  List,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function TicketDetails({ ticket }) {
  console.log("Selected Ticket", ticket);
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

  return (
    <div className="flex-1 bg-gray-50 min-w-0 flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(ticket.category)}
            <h1 className="text-2xl font-bold">#{ticket.id}</h1>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            {getStatusIcon(ticket.status)}
            <span>{ticket.status}</span>
          </Badge>
          <div
            className={`w-3 h-3 rounded-full ${getPriorityColor(
              ticket.priority
            )}`}
          />
          <span className="text-sm font-medium">
            {ticket.priority} Priority
          </span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">Update</Button>
          <Button>Resolve</Button>
        </div>
      </div>

      {/* Fixed Tabs */}
      <div className="bg-white border-b px-6 flex-shrink-0">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-transparent border-b-0 h-12">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="attachments"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Attachments
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content Area */}
          <div className="h-full overflow-auto">
            <TabsContent value="details" className="mt-0 p-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <CardTitle>Issue Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {ticket.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{ticket.description}</p>
                  </div>

                  {/* Additional Information (no location) */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Additional information</h4>

                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Contact (Messenger/Phone)
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {ticket.contact_number ?? "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Patient name (optional)
                        </dt>
                        <dd className="mt-1 text-sm text-gray-500">
                          {ticket.patient_name ? ticket.patient_name : "Not applicable"}
                        </dd>
                      </div>

                      <div className="md:col-span-2">
                        <dt className="text-xs font-medium text-gray-500">
                          Equipment (brand/model)
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {ticket.equipment_details ?? "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                      <Button size="sm" variant="ghost">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button size="sm" variant="ghost">
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Add your update, solution, or comment..."
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Post Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extra content to demonstrate scrolling */}
              <Card>
                <CardHeader>
                  <CardTitle>Previous Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm font-medium">
                        Update from John Paul Mendoza
                      </p>
                      <p className="text-xs text-gray-500 mb-2">2 hours ago</p>
                      <p className="text-sm text-gray-700">
                        Investigating the printer issue. Will check the network
                        connection and driver status.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="text-sm font-medium">System Update</p>
                      <p className="text-xs text-gray-500 mb-2">3 hours ago</p>
                      <p className="text-sm text-gray-700">
                        Ticket assigned to John Paul Mendoza from IT Support.
                      </p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                      <p className="text-sm font-medium">Initial Report</p>
                      <p className="text-xs text-gray-500 mb-2">4 hours ago</p>
                      <p className="text-sm text-gray-700">
                        Ticket created by Rheenamel Pacamara. Printer in NURSING
                        - OPD not responding to print jobs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            Ticket assigned to {ticket.assignedTo}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">System</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Ticket created</p>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {ticket.requester}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="mt-0 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>No attachments found</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attachment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
