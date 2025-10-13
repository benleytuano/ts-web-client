import { useState, useEffect, useMemo } from "react";
import { useRouteLoaderData, useLoaderData } from "react-router";
import axios from "../../services/api"; // your configured axios instance
import { TicketList } from "./parts/TicketList";
import { TicketDetails } from "./parts/TicketDetails";
import { TicketInfoPanel } from "./parts/TicketInfoPanel";

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
// assumes: mapPriority, mapStatus, fullName exist in scope

export const normalizeTicket = (t = {}) => {
  return {
    // --- UI-friendly fields (your current names) ---
    id: String(t.id ?? ""),
    title: t.title ?? "Untitled",
    description: t.description ?? "",
    requester: fullName(t.user),
    department: t.department?.name ?? "",
    category: t.category?.name ?? "",
    location: t.location?.name ?? t.department?.name ?? "",
    priority: mapPriority(t.priority),          // "high" -> "High"
    status: mapStatus(t.status),                // "in_progress" -> "In Progress"
    createdAt: t.created_at ?? null,
    updatedAt: t.updated_at ?? t.created_at ?? null,

    // NEW: assignment fields (for Info Panel buttons/labels)
    assignedTo: t.assignee ? fullName(t.assignee) : undefined,
    assignee_id: t.assignee?.id ?? t.assignee_id ?? null,
    assignedAt: t.assigned_at ?? null,

    // --- Original scalars (keep for edits/filters) ---
    user_id: t.user_id ?? null,
    category_id: t.category_id ?? null,
    department_id: t.department_id ?? null,
    location_id: t.location_id ?? null,
    contact_number: t.contact_number ?? "",
    patient_name: t.patient_name ?? "",
    equipment_details: t.equipment_details ?? "",

    // --- Preserve nested objects (no clobbering UI strings) ---
    userObj: t.user ?? null,
    assigneeObj: t.assignee ?? null,
    categoryObj: t.category ?? null,
    departmentObj: t.department ?? null,
    locationObj: t.location ?? null,
  };
};


export const normalizeTickets = (arr) => (Array.isArray(arr) ? arr.map(normalizeTicket) : []);


export default function Dashboard() {
  const data = useLoaderData();
  const serverTickets = data.tickets || [];

  // keep tickets in local state so we can surgically replace one
  const initial = useMemo(() => normalizeTickets(serverTickets), [serverTickets]);
  const [tickets, setTickets] = useState(initial);
  const [selectedTicket, setSelectedTicket] = useState(initial[0] || null);
  const user = useRouteLoaderData("root");

  console.log("User", user);

// after you read `user`
const currentUserId =
  Number(user?.id ?? user?.user?.id ?? user?.data?.id ?? null);

const roleName =
  (user?.role?.name || user?.role || "").toString().toLowerCase();

const canAssignOrUnassign = roleName === "admin" || roleName === "agent";
const canReassign = roleName === "admin";

  // sync local state when loader data changes
  useEffect(() => {
    setTickets(initial);
    setSelectedTicket((prev) => {
      if (!prev) return initial[0] || null;
      const still = initial.find((t) => String(t.id) === String(prev.id));
      return still ?? (initial[0] || null);
    });
  }, [initial]);

  // helper to replace a ticket in list + selection
  const replaceTicket = (updated) => {
    const norm = normalizeTicket(updated);
    setTickets((prev) => prev.map((t) => (String(t.id) === String(norm.id) ? norm : t)));
    setSelectedTicket((prev) => (prev && String(prev.id) === String(norm.id) ? norm : prev));
  };

  // --- ASSIGN TO ME ---
  const assignToMe = async (ticketId) => {
    try {
      const res = await axios.post(`/tickets/${ticketId}/assign`);
      replaceTicket(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        alert("Someone already took this ticket. Please refresh.");
      } else {
        alert(err?.response?.data?.message || "Assign failed.");
      }
      console.error(err);
    }
  };

  // --- UNASSIGN ---
  const unassign = async (ticketId, expectedAssigneeId = null) => {
    try {
      const res = await axios.post(`/tickets/${ticketId}/unassign`, {
        expected_assignee_id: expectedAssigneeId,
      });
      replaceTicket(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        alert("Assignment changed while you were viewing it. Please refresh.");
      } else {
        alert(err?.response?.data?.message || "Unassign failed.");
      }
      console.error(err);
    }
  };

  // resolve ticket

  const resolveTicket = async (ticketId) => {
    try {
      const res = await axios.post(`/tickets/${ticketId}/resolve`);
      replaceTicket(res.data); // keep your list + selection in sync
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        alert("Only the current assignee can resolve this ticket.");
      } else if (status === 409) {
        alert("Ticket state changed or already resolved/closed. Please refresh.");
      } else {
        alert(err?.response?.data?.message || "Resolve failed.");
      }
      console.error(err);
    }
  };


  return (
    <div className="flex-1 flex min-h-0 relative">
      <TicketList
        tickets={tickets}
        selectedTicket={selectedTicket}
        onTicketSelect={setSelectedTicket}
      />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-auto">
        <div className="flex-1 min-w-0 p-6 ">
          {selectedTicket && <TicketDetails ticket={selectedTicket} />}
        </div>

        {selectedTicket && (
          <div className="sticky top-0 p-4">
            <TicketInfoPanel
              ticket={selectedTicket}
              currentUserId={currentUserId}
              canAssignOrUnassign={canAssignOrUnassign}
              canReassign={canReassign}
              onAssignToMe={() => assignToMe(selectedTicket.id)}
              onUnassign={() =>
                unassign(selectedTicket.id, selectedTicket.assignee_id ?? null)
              }
              onResolve={() => resolveTicket(selectedTicket.id)}   // 👈 NEW
            />
          </div>
        )}


      </div>
    </div>
  );
}