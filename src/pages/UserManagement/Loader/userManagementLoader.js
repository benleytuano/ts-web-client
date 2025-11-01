import axios from "../../../services/api";

/**
 * Deduplicate departments by id
 */
function deduplicateDepartments(departments) {
  const seen = new Set();
  return departments.filter((dept) => {
    const id = dept.id || dept.name;
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
}

/**
 * Loader for User Management page
 * Fetches roles, departments, and users from the API
 */
export default async function userManagementLoader() {
  try {
    const [rolesRes, departmentsRes, usersRes] = await Promise.all([
      axios.get("/roles"),
      axios.get("/departments"),
      axios.get("/users"),
    ]);

    let roles = rolesRes.data?.data || rolesRes.data || [];
    let departments = departmentsRes.data?.data || departmentsRes.data || [];
    let users = usersRes.data?.data || usersRes.data || [];

    console.log("Raw departments from API:", departments);

    // Deduplicate departments
    departments = deduplicateDepartments(departments);

    console.log("Deduplicated departments:", departments);
    console.log("Users from API:", users);

    return {
      roles,
      departments,
      users,
      error: null
    };
  } catch (error) {
    console.error("UserManagement loader error:", error);
    return {
      roles: [],
      departments: [],
      users: [],
      error: error?.response?.data?.message || error?.message || "Failed to load data",
    };
  }
}
