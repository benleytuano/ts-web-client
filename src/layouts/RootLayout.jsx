import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../components/parts/Sidebar";
import { Header } from "../components/parts/Header";

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
  {
    id: "61674",
    title: "PRINTER NOT WORKING",
    description:
      "printer not working - urgent repair needed for patient documentation",
    requester: "Rheenamel Pacamara",
    department: "NURSING - OPD",
    category: "Printer Repair",
    priority: "High",
    status: "Open",
    createdAt: "2025-05-27T12:38:00Z",
    updatedAt: "2025-05-27T12:57:00Z",
    assignedTo: "John Paul Mendoza",
    location: "NURSING - OPD",
  },
  {
    id: "61670",
    title: "CENSUS OF ABTC PATIENTS",
    description: "Census report generation needed for monthly statistics",
    requester: "Juan Paulo Maturan",
    department: "PUBLIC HEALTH UNIT",
    category: "System Concerns",
    priority: "Medium",
    status: "Open",
    createdAt: "2025-05-27T11:51:00Z",
    updatedAt: "2025-05-27T11:51:00Z",
    location: "PUBLIC HEALTH UNIT",
  },
  {
    id: "61660",
    title: "PRINTER MAINTENANCE",
    description:
      "Printer maintenance required - toner replacement and cleaning",
    requester: "Ma. Corazon Uymasuy",
    department: "NURSING - PEDIATRICS",
    category: "Printer Repair",
    priority: "Low",
    status: "Open",
    createdAt: "2025-05-27T11:03:00Z",
    updatedAt: "2025-05-27T11:03:00Z",
    location: "NURSING - PEDIATRICS",
  },
  {
    id: "61659",
    title: "NETWORK CONNECTIVITY ISSUE",
    description: "Intermittent network connection in emergency department",
    requester: "Dr. Maria Santos",
    department: "EMERGENCY DEPARTMENT",
    category: "Network Issue",
    priority: "Critical",
    status: "In Progress",
    createdAt: "2025-05-27T10:30:00Z",
    updatedAt: "2025-05-27T14:15:00Z",
    assignedTo: "Tech Support Team",
    location: "EMERGENCY DEPARTMENT",
  },
  {
    id: "61658",
    title: "SOFTWARE UPDATE REQUEST",
    description: "EMR system needs security patches and feature updates",
    requester: "IT Administrator",
    department: "IT DEPARTMENT",
    category: "Software Update",
    priority: "High",
    status: "Open",
    createdAt: "2025-05-27T09:45:00Z",
    updatedAt: "2025-05-27T09:45:00Z",
    location: "IT DEPARTMENT",
  },
  {
    id: "61657",
    title: "COMPUTER SLOW PERFORMANCE",
    description: "Workstation running slowly affecting patient care workflow",
    requester: "Nurse Jennifer Cruz",
    department: "NURSING - ICU",
    category: "Hardware Issue",
    priority: "Medium",
    status: "Open",
    createdAt: "2025-05-27T08:20:00Z",
    updatedAt: "2025-05-27T08:20:00Z",
    location: "NURSING - ICU",
  },
  {
    id: "61656",
    title: "EMAIL ACCESS PROBLEM",
    description: "Unable to access email account - password reset needed",
    requester: "Dr. Robert Kim",
    department: "CARDIOLOGY",
    category: "Account Issue",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2025-05-26T16:30:00Z",
    updatedAt: "2025-05-27T08:00:00Z",
    assignedTo: "Help Desk",
    location: "CARDIOLOGY DEPARTMENT",
  },
  {
    id: "61655",
    title: "BARCODE SCANNER MALFUNCTION",
    description: "Barcode scanner not reading medication labels properly",
    requester: "Pharmacy Staff",
    department: "PHARMACY",
    category: "Hardware Issue",
    priority: "High",
    status: "Open",
    createdAt: "2025-05-26T14:15:00Z",
    updatedAt: "2025-05-26T14:15:00Z",
    location: "PHARMACY DEPARTMENT",
  },
  {
    id: "61654",
    title: "BACKUP SYSTEM FAILURE",
    description: "Daily backup process failed - need immediate attention",
    requester: "System Administrator",
    department: "IT DEPARTMENT",
    category: "System Critical",
    priority: "Critical",
    status: "In Progress",
    createdAt: "2025-05-26T07:00:00Z",
    updatedAt: "2025-05-26T15:30:00Z",
    assignedTo: "Senior IT Specialist",
    location: "SERVER ROOM",
  },
];

export default function RootLayout() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[1]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("tickets");

  return (
    <>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Main Layout */}
        <div className="flex flex-1 min-h-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <Header ticketId={selectedTicket?.id} />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
