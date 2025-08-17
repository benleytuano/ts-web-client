import { useState, useMemo } from "react";
import { useRouteLoaderData, useLoaderData } from "react-router";
import { TicketList } from "./parts/TicketList";
import { TicketDetails } from "./parts/TicketDetails";
import { TicketInfoPanel } from "./parts/TicketInfoPanel";

const mockTickets = [
  {
    id: "61676",
    title: "WEBSITE UPDATE",
    description:
      "DOCUMENT CONTROL CENTER needs website updates for new compliance requirements",
    requester: "Regis Saamit",
    department: "Multimedia",
    category: "System Request",
    priority: "Medium",
    status: "Open",
    createdAt: "2025-05-27T12:20:00Z",
    updatedAt: "2025-05-27T12:20:00Z",
    location: "DOCUMENT CONTROL CENTER",
  },
];

// --- helpers ---
const mapPriority = (p) => {
  const m = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
  return m[String(p || "").toLowerCase()] || "Low";
};

const mapStatus = (s) => {
  const m = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return m[String(s || "").toLowerCase()] || "Open";
};

const fullName = (u) => {
  if (!u) return "";
  const first = (u.first_name || "").trim();
  const last = (u.last_name || "").trim();
  const name = `${first} ${last}`.trim();
  return name || u.email || "Unassigned";
};

/**
 * Normalize one server ticket -> UI ticket
 * Server shape (example):
 * {
 *   id, title, description, priority: "high", status: "open",
 *   created_at, updated_at,
 *   user: { first_name, last_name, email },
 *   category: { name }, department: { name }, location: { name }
 * }
 *
 * UI shape expected by TicketList:
 * {
 *   id, title, description, requester, department, category,
 *   priority: "High"|"Medium"..., status: "Open"|"In Progress"...,
 *   createdAt, updatedAt, assignedTo?, location
 * }
 */
export const normalizeTicket = (t) => {
  return {
    id: String(t.id),
    title: t.title ?? "Untitled",
    description: t.description ?? "",
    requester: fullName(t.user),
    department: t.department?.name ?? "",
    category: t.category?.name ?? "",
    priority: mapPriority(t.priority),
    status: mapStatus(t.status),
    createdAt: t.created_at ?? null,
    updatedAt: t.updated_at ?? t.created_at ?? null,
    // Your current API sample has no assignee field; leave undefined
    assignedTo: undefined,
    // Use location name; or combine with department if you prefer
    location: t.location?.name ?? t.department?.name ?? "",
  };
};

export const normalizeTickets = (arr) => (Array.isArray(arr) ? arr.map(normalizeTicket) : []);


export default function Dashboard() {
  const data = useLoaderData();
  const serverTickets = data.tickets;
  const tickets = useMemo(() => normalizeTickets(serverTickets), [serverTickets]);
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const user = useRouteLoaderData('root');

  console.log("Data received from loader:", serverTickets);
  console.log("User :", user);
  

  return ( 
    <>
      <div className="flex-1 flex min-h-0 relative">
        {/* Ticket List */}
        <TicketList
          tickets={tickets}
          selectedTicket={selectedTicket}
          onTicketSelect={setSelectedTicket}
        />

        {/* Middle + Right Panel */}
        {/* 👇 OVERFLOW GOES HERE */}
        <div className="flex flex-1 min-h-0 min-w-0 overflow-auto">
          {/* Ticket Details */}
          <div className="flex-1 min-w-0 p-6 ">
            {selectedTicket && <TicketDetails ticket={selectedTicket} />}
          </div>
          {/* Info Panel - Sticky */}
          {selectedTicket && (
            <div className="sticky top-0 p-4">
              <TicketInfoPanel ticket={selectedTicket} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
