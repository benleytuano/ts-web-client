import { CloudCog } from "lucide-react";
import axios from "../../../services/api";

/**
 * Fetches tickets from the backend API
 */
export default async function dashboardLoader() {
  try {
    const response = await axios.get("/tickets");
    
    console.log(response)

    // Extract tickets from various API response formats
    const tickets = response.data?.data || response.data?.tickets || response.data || [];
    
    return { tickets, error: null };
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        "Failed to fetch tickets";
    
    return { tickets: [], error: errorMessage };
  }
}