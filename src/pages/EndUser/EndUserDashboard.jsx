// src/pages/EndUser/EndUserDashboard.jsx
import { useState } from "react"
import { NewTicketModal } from "../../components/shared/NewTicketModal"
import { DashboardHeader } from "./parts/DashboardHeader"
import { TicketStats } from "./parts/TicketStats"
import { QuickActions } from "./parts/QuickActions"
import { TicketList } from "./parts/TicketList"
import { AnnouncementsSidebar } from "./parts/AnnouncementsSidebar"
import { HelpResourcesSidebar } from "./parts/HelpResourcesSidebar"
import { useLoaderData } from "react-router"
import {
  Printer,
  Monitor,
  Wifi,
  Shield,
  Mail,
  Phone,
} from "lucide-react"


const announcementsData = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    message: "Planned maintenance on Sunday, Jan 21st from 2:00 AM - 4:00 AM. Email services may be temporarily unavailable.",
    type: "warning",
    date: "2025-01-19T10:00:00Z",
  },
  {
    id: 2,
    title: "New Printer Installed",
    message: "A new printer has been installed in the Emergency Department. Please contact IT if you need setup assistance.",
    type: "info",
    date: "2025-01-18T14:30:00Z",
  },
  {
    id: 3,
    title: "Password Policy Update",
    message: "New password requirements are now in effect. Passwords must be changed every 90 days.",
    type: "info",
    date: "2025-01-17T09:00:00Z",
  },
  {
    id: 4,
    title: "IT Training Session",
    message: "Basic cybersecurity training scheduled for Jan 25th at 2:00 PM in Conference Room A. All staff are encouraged to attend.",
    type: "info",
    date: "2025-01-16T08:00:00Z",
  },
  {
    id: 5,
    title: "Email Phishing Alert",
    message: "Several phishing emails detected. Please do not click on suspicious links. Report any suspicious emails to IT immediately.",
    type: "warning",
    date: "2025-01-15T15:45:00Z",
  }
]

// Category metadata keyed by database ID
const CATEGORY_METADATA = {
  1: { // Printer Issues
    description: "Printer not working, paper jams, toner issues",
    icon: Printer,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    examples: [
      "Printer won't turn on or respond",
      "Paper keeps jamming in the feeder",
      "Printed pages have streaks or are faded",
      "Error message: 'Replace toner cartridge'",
      "Unable to print from my computer"
    ]
  },
  2: { // Computer/Hardware
    description: "Slow performance, crashes, hardware issues",
    icon: Monitor,
    color: "bg-green-50 text-green-600 border-green-200",
    examples: [
      "Computer running extremely slow",
      "Blue screen of death errors",
      "Keyboard keys not working properly",
      "Computer randomly shuts down",
      "External monitor not displaying"
    ]
  },
  3: { // Network/Internet
    description: "Internet problems, connection issues",
    icon: Wifi,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    examples: [
      "Can't connect to WiFi network",
      "Internet connection keeps dropping",
      "Very slow internet speeds",
      "Unable to access company network drives",
      "VPN connection failing"
    ]
  },
  4: { // Software Issues
    description: "Application problems, login issues",
    icon: Shield,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    examples: [
      "Microsoft Office keeps crashing",
      "Can't log into company software",
      "Application won't open or install",
      "Error: 'License has expired'",
      "Lost access to shared folders"
    ]
  },
  5: { // Email Problems
    description: "Can't access email, sending issues",
    icon: Mail,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    examples: [
      "Can't send or receive emails",
      "Outlook won't open",
      "Email stuck in outbox",
      "Mailbox is full error",
      "Missing emails from inbox"
    ]
  },
  6: { // Phone/Communication
    description: "Phone not working, call quality problems",
    icon: Phone,
    color: "bg-red-50 text-red-600 border-red-200",
    examples: [
      "Desk phone has no dial tone",
      "Can't hear callers clearly",
      "Voicemail not working",
      "Phone keeps dropping calls",
      "Conference call feature not working"
    ]
  },
};

export default function EndUserDashboard() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [selectedQuickAction, setSelectedQuickAction] = useState(null)

  // Get data from loader
  const { categories, tickets, user, loading, error } = useLoaderData()

  console.log('Raw categories from loader:', categories)
  console.log('Raw Tickets from loader', tickets);
  console.log("User : ", user);
  // ✅ Map API categories with metadata
  const mappedCategories = categories?.map(dbCategory => {
    const metadata = CATEGORY_METADATA[dbCategory.id]
    
    if (!metadata) {
      console.warn(`No metadata found for category ID: ${dbCategory.id} (${dbCategory.name})`)
      return null
    }
    
    return {
      id: dbCategory.id,      // Database ID becomes form ID
      title: dbCategory.name, // Database name becomes display title
      ...metadata,            // Spread icon, description, color
    }
  }).filter(Boolean) || [] // Remove null entries and handle undefined rawCategories

  console.log('Mapped categories:', mappedCategories)

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  // For now, using the mock data directly
  // const tickets = userTickets
  const announcements = announcementsData

  // ✅ Mock locations (replace with real data from loader later)
  const mockLocations = [
    { id: 1, name: "NURSING - OPD" },
    { id: 2, name: "NURSING - ICU" },
    { id: 3, name: "EMERGENCY DEPARTMENT" },
    { id: 4, name: "PHARMACY" },
    { id: 5, name: "LABORATORY" },
  ]

  // ✅ Mock user (replace with real data from loader later)
  const mockUser = {
    id: 1,
    name: "RP",
    department: {
      id: 1,
      name: "NURSING - OPD"
    }
  }

  const handleNewTicket = (ticketData) => {
    console.log("New ticket submitted:", ticketData)
    setIsNewTicketOpen(false)
    // Note: Actual submission is handled by useFetcher in the modal
  }

  const handleQuickAction = (action) => {
    setSelectedQuickAction(action)
    setIsNewTicketOpen(true)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <DashboardHeader
        onNewTicket={() => setIsNewTicketOpen(true)}
        user={user}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden gap-6">
        {/* Left Column: Stats + Quick Actions + Ticket List (70%) */}
        <div className="flex-[7] flex flex-col min-w-0 p-6 space-y-4">
          <TicketStats tickets={tickets} />
          <QuickActions categories={mappedCategories} onActionClick={handleQuickAction} />
          <div className="flex-1 min-h-0">
            <TicketList tickets={tickets} />
          </div>
        </div>

        {/* Right Column: Announcements + Help (30%) */}
        <div className="flex-[3] flex flex-col min-h-0 space-y-6 pt-3 pb-6 pr-6">
          <div className="flex-1 overflow-y-auto">
            <AnnouncementsSidebar announcements={announcements} />
          </div>
          <div className="flex-shrink-0">
            <HelpResourcesSidebar />
          </div>
        </div>
      </div>

      {/* Debug info for development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-3 text-xs max-w-sm z-50">
          <h4 className="font-semibold mb-1">Debug Info</h4>
          <div>Raw categories: {categories?.length || 0}</div>
          <div>Mapped categories: {mappedCategories.length}</div>
          <div>Locations: {mockLocations.length}</div>
          <div>User: {mockUser.name}</div>
        </div>
      )} */}

      {/* ✅ Updated NewTicketModal with all required props */}
      <NewTicketModal
        open={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
        onSubmit={handleNewTicket}
        preselectedCategory={selectedQuickAction?.id}
        categories={mappedCategories}  // ✅ Pass mapped categories with icons/colors
        locations={mockLocations}      // ✅ Pass locations array
        user={mockUser}               // ✅ Pass user with department info
      />
    </div>
  )
}