
import axios from "../../../services/api"
import { isAuthenticated } from "../../../services/auth"


/** Normalize common Laravel API shapes -> array */
function normalizeArray(res){
  const d = res?.data;
  if (!d) return [];
  if (Array.isArray(d)) return d;              // pure array
  if (Array.isArray(d.data)) return d.data;    // { data: [...] } or paginated
  if (d.success && Array.isArray(d.data)) return d.data; // { success, data: [...] }
  return [];
}

/**
 * Simple loader that fetches categories, CURRENT USER'S tickets, and user data
 * Requires Sanctum token attached to axios (via interceptor or headers)
 */
export async function endUserDashboardLoader() {
  try {
    // ⚠️ If you DON'T have a global axios auth interceptor, uncomment next 3 lines:
    // const token = localStorage.getItem("token");
    // if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const [catRes, ticketRes, authRes] = await Promise.all([
      axios.get("/categories"),   // public or protected depending on your API
      axios.get("/tickets"),      // protected (auth:sanctum) — returns THIS user's tickets
      isAuthenticated(),          // get current user data
    ]);

    const categories = normalizeArray(catRes);
    const tickets    = normalizeArray(ticketRes);
    const user = authRes?.user || null;

    return { categories, tickets, user, loading: false, error: null };
  } catch (error) {
    console.error("EndUserDashboard loader error:", error);
    return {
      categories: [],
      tickets: [],
      user: null,
      loading: false,
      error: error?.response?.data?.message || error?.message || "Failed to load dashboard",
    };
  }
}
