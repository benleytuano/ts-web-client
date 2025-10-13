import { redirect } from "react-router";
import { isAuthenticated } from "../../../services/auth";

export default async function rootLayoutLoader() {
  const response = await isAuthenticated();
  
  console.log(response);

  if (response.isAuthenticated && response.user.role_id != 3) {
      // Optional: Can pass state/query for "return to" redirect after login
      return response.user;  
  }

  return redirect("/");
  // If authenticated, you can fetch and return dashboard data if needed
  // return { ... } or just return null

}
