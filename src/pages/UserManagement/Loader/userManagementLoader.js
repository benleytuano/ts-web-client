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
    const [rolesRes, departmentsRes, usersRes, permissionsRes] = await Promise.all([
      axios.get("/roles"),
      axios.get("/departments"),
      axios.get("/users"),
      axios.get("/permissions"),
    ]);

    let roles = rolesRes.data?.data || rolesRes.data || [];
    let departments = departmentsRes.data?.data || departmentsRes.data || [];
    let users = usersRes.data?.data || usersRes.data || [];
    let permissions = permissionsRes.data?.data || permissionsRes.data || [];

    console.log("Raw departments from API:", departments);

    // Deduplicate departments
    departments = deduplicateDepartments(departments);

    console.log("Deduplicated departments:", departments);
    console.log("Users from API:", users);
    console.log("Permissions from API:", permissions);

    return {
      roles,
      departments,
      users,
      permissions,
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
