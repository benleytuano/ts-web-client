import { redirect } from "react-router";
import { isAuthenticated } from "../../../services/auth";

export default async function rootLayoutLoader() {
  const response = await isAuthenticated();
  if (!response.isAuthenticated) {
    // Optional: Can pass state/query for "return to" redirect after login
    return redirect("/");
  }
  // If authenticated, you can fetch and return dashboard data if needed
  // return { ... } or just return null
  return response.user;
}
