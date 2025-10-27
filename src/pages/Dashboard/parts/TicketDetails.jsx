import { useState, useEffect } from "react";
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
  FileText,
  MessageSquare,
  Info,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axios from "../../../services/api";
import { formatDateToReadable } from "@/lib/utils";

export function TicketDetails({ ticket }) {
  const [ticketUpdates, setTicketUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current date/time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  console.log("Selected Ticket", ticket);

  // Fetch ticket updates when ticket is selected
  useEffect(() => {
    if (!ticket || !ticket.id) {
      setTicketUpdates([]);
      return;
    }

    const fetchUpdates = async () => {
      try {
        setLoadingUpdates(true);
        const response = await axios.get(`/tickets/${ticket.id}/updates`);
        setTicketUpdates(response.data || []);
      } catch (error) {
        console.error("Failed to fetch ticket updates:", error);
        setTicketUpdates([]);
      } finally {
        setLoadingUpdates(false);
      }
    };

    fetchUpdates();
  }, [ticket?.id]);

  // Post a new update
  const handlePostUpdate = async () => {
    if (!updateMessage.trim() || !ticket?.id) return;

    try {
      setPostingUpdate(true);
      const response = await axios.post(`/tickets/${ticket.id}/updates`, {
        message: updateMessage,
        type: "comment",
        is_internal: false,
      });

      // Add the new update to the list
      setTicketUpdates((prev) => [response.data, ...prev]);
      setUpdateMessage("");
    } catch (error) {
      console.error("Failed to post update:", error);
      alert(error?.response?.data?.message || "Failed to post update");
    } finally {
      setPostingUpdate(false);
    }
  };

  // Empty state fallback
  if (!ticket) {
    return (
      <div className="flex-1 bg-gray-50 min-w-0 flex flex-col h-full items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No Ticket Selected
          </h2>
          <p className="text-gray-500">
            Select a ticket from the list to view its details
          </p>
        </div>
      </div>
    );
  }

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

                    {!ticket.contact_number && !ticket.patient_name && !ticket.equipment_details ? (
                      <div className="flex items-center space-x-2 py-4 text-gray-500">
                        <Info className="h-5 w-5 text-gray-400" />
                        <p className="text-sm">No additional information provided by the user</p>
                      </div>
                    ) : (
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Contact (Messenger/Phone)
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {ticket.contact_number ? ticket.contact_number : "—"}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-xs font-medium text-gray-500">
                            Patient name (optional)
                          </dt>
                          <dd className="mt-1 text-sm text-gray-500">
                            {ticket.patient_name ? ticket.patient_name : "—"}
                          </dd>
                        </div>

                        <div className="md:col-span-2">
                          <dt className="text-xs font-medium text-gray-500">
                            Equipment (brand/model)
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {ticket.equipment_details ? ticket.equipment_details : "—"}
                          </dd>
                        </div>
                      </dl>
                    )}
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add Update</CardTitle>
                    <div className="text-xs text-gray-500">
                      {formatDateToReadable(currentDateTime)}
                    </div>
                  </div>
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
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      disabled={postingUpdate}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" disabled={postingUpdate}>
                        Save Draft
                      </Button>
                      <Button
                        onClick={handlePostUpdate}
                        disabled={postingUpdate || !updateMessage.trim()}
                      >
                        {postingUpdate ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Update"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Previous Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingUpdates ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                      <p className="ml-2 text-gray-500">Loading updates...</p>
                    </div>
                  ) : ticketUpdates && ticketUpdates.length > 0 ? (
                    <div className="space-y-4">
                      {ticketUpdates.map((update) => (
                        <div
                          key={update.id}
                          className={`border-l-4 pl-4 ${
                            update.type === "system"
                              ? "border-green-500"
                              : update.type === "initial"
                              ? "border-gray-300"
                              : "border-blue-500"
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {update.user?.first_name && update.user?.last_name
                              ? `${update.user.first_name} ${update.user.last_name}`
                              : update.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            {formatDateToReadable(update.created_at || update.timestamp)}
                          </p>
                          <p className="text-sm text-gray-700">
                            {update.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-1">
                        No Updates Yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Updates will appear here as the ticket progresses
                      </p>
                    </div>
                  )}
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
