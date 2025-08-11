import axios from "../../../services/api";

/**
 * Simple loader that fetches tickets from the backend
 * Returns a generic shape: { tickets, loading, error }
 */
export default async function dashboardLoader() {
  try {
    const response = await axios.get("/tickets");
    console.log("Tickets API Response:", response.data);

    // Ensure HTTP status is OK
    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error(`Unexpected status: ${response.status}`);
    }

    // Normalize tickets from common API shapes
    let tickets;
    if (typeof response.data === "object" && "success" in response.data) {
      // e.g. { success: true, data: [...] }
      tickets = response.data.success ? response.data.data ?? [] : [];
    } else if (Array.isArray(response.data)) {
      // e.g. [ ...tickets ]
      tickets = response.data;
    } else {
      // e.g. { data: [...] } or { tickets: [...] }
      tickets = response.data?.data ?? response.data?.tickets ?? [];
    }

    return {
      tickets,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return {
      tickets: [],
      loading: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch tickets",
    };
  }
}
