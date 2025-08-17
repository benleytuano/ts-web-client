import axios from "./api";

export async function isAuthenticated() {
  try {
    const response = await axios.get("/auth/me");
    // Your backend returns user object? Adapt this check as needed.
    if (response.status === 200 && response.data.user) {
      console.log("Authenctication Checker Data: ", response);
      return {
        isAuthenticated: true,
        user:  response.data.user
      };
    }
    return false;
  } catch (error) {
    // Any 401/403 means not authenticated
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return false;
    }
    // Other errors: could be network/server, treat as unauthenticated or log for debugging
    console.error("Auth check error:", error);
    return false;
  }
}
