import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, Calendar, CheckCircle, Shield, Loader2, Inbox } from "lucide-react";

export function TicketInfoPanel({
  ticket,
  currentUserId,
  // permissions from parent
  canAssignOrUnassign = false, // admin/agent
  canReassign = false,         // admin-only
  // handlers
  onAssignToMe = () => {},
  onUnassign = () => {},
  onReassign = () => {},
  onResolve = () => {},
}) {
  const [resolving, setResolving] = useState(false);

  const statusLabel = String((ticket && ticket.status) || "");
  const isAssigned = ticket && ticket.assignee_id != null;
  const isMine = isAssigned && Number(ticket.assignee_id) === Number(currentUserId);

  // Only "Open" / "In Progress" are actionable; hide Actions card otherwise
  const isActionable = ["Open", "In Progress"].includes(statusLabel);

  // Button visibility (gated by actionable)
  const showAssignToMe = isActionable && !isAssigned && canAssignOrUnassign;
  const showUnassign   = isActionable && isAssigned && isMine && canAssignOrUnassign;
  const showReassign   = isActionable && isAssigned && !isMine && canReassign;
  const canResolve     = isActionable && isMine;

  const hasAnyAction = showAssignToMe || showUnassign || showReassign || canResolve;

  const handleResolve = async () => {
    setResolving(true);
    try {
      // Works whether onResolve returns void or a Promise
      await Promise.resolve(onResolve());
    } finally {
      setResolving(false);
    }
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => (n && n[0]) || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Empty state fallback
  if (!ticket) {
    return (
      <div className="w-80 bg-white border-l flex-shrink-0 h-full flex items-center justify-center">
        <div className="text-center p-4">
          <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Ticket Selected
          </h3>
          <p className="text-sm text-gray-500">
            Select a ticket to view its information and take actions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l flex-shrink-0 h-full">
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Requester</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {initials((ticket && ticket.requester) || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{(ticket && ticket.requester) || "—"}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Department</Label>
              <p className="text-sm mt-1">{(ticket && ticket.department) || "—"}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Location</Label>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{(ticket && ticket.location) || "—"}</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Category</Label>
              <Badge variant="secondary" className="mt-1 w-fit">
                {(ticket && ticket.category) || "—"}
              </Badge>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {ticket && ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>

            {/* Assignment summary */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-600">Assignment</Label>
              {!isAssigned ? (
                <Badge variant="outline">Unassigned</Badge>
              ) : isMine ? (
                <Badge>Assigned to You</Badge>
              ) : (
                <Badge variant="secondary">
                  Assigned to {(ticket && ticket.assignedTo) || "—"}
                </Badge>
              )}
            </div>

            {isAssigned && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {initials((ticket && ticket.assignedTo) || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{(ticket && ticket.assignedTo) || "—"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions: render ONLY if there is at least one available action */}
        {hasAnyAction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {showAssignToMe && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={onAssignToMe}
                >
                  <User className="h-4 w-4 mr-2" />
                  Assign to Me
                </Button>
              )}

              {showUnassign && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={onUnassign}
                >
                  <User className="h-4 w-4 mr-2" />
                  Unassign
                </Button>
              )}

              {showReassign && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={onReassign}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Reassign…
                </Button>
              )}

              {canResolve && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleResolve}
                  disabled={resolving}
                >
                  {resolving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {resolving ? "Resolving…" : "Mark as Resolved"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
