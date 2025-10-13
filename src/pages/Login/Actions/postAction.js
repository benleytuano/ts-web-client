import axios from "../../../services/api";
import { redirect } from "react-router";

export default async function loginPostAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const rememberMe = formData.get("rememberMe"); // Will be "on" if checked

  try {
    // Make the login request to your API
    const response = await axios.post("/auth/login", {
      email,
      password,
      rememberMe: !!rememberMe,
    });

    console.log(response);

    // Save the token, or do what you need
    const { token } = response.data;
    localStorage.setItem("authToken", token);

    // Redirect on successful login
    if(response.data.user.role.id != 3){
      return redirect("/dashboard");
    }else{
      return redirect("/end-user-dashboard")
    }
    

    
    
  } catch (error) {
    // Optionally log error for dev
    console.error(error);

    // Return error for useActionData
    return { error: error.response?.data?.message || "Login failed" };
  }
}
