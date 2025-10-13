
import axios from "../../../services/api"


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
 * Simple loader that fetches categories and CURRENT USER'S tickets
 * Requires Sanctum token attached to axios (via interceptor or headers)
 */
export async function endUserDashboardLoader() {
  try {
    // ⚠️ If you DON'T have a global axios auth interceptor, uncomment next 3 lines:
    // const token = localStorage.getItem("token");
    // if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const [catRes, ticketRes] = await Promise.all([
      axios.get("/categories"),   // public or protected depending on your API
      axios.get("/tickets"),      // protected (auth:sanctum) — returns THIS user's tickets
    ]);

    const categories = normalizeArray(catRes);
    const tickets    = normalizeArray(ticketRes);

    return { categories, tickets, loading: false, error: null };
  } catch (error) {
    console.error("EndUserDashboard loader error:", error);
    return {
      categories: [],
      tickets: [],
      loading: false,
      error: error?.response?.data?.message || error?.message || "Failed to load dashboard",
    };
  }
}
