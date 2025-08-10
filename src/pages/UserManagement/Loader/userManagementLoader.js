import axios from "../../../services/api";

export default async function userManagementLoader() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return { posts: response.data };
  } catch (error) {
    // React Router will catch and show an error boundary if you throw here
    throw new Error("Failed to fetch posts: " + error.message);
  }
}
