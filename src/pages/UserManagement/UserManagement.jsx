import { useState, useEffect, useCallback } from "react";
import { useLoaderData, useFetcher } from "react-router";
import axios from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Shield,
  Users,
  UserCheck,
  UserX,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
} from "lucide-react";



export default function UserManagement() {
  const { roles: loaderRoles = [], departments: loaderDepartments = [], users: loaderUsers = [], permissions: loaderPermissions = [] } = useLoaderData();
  const fetcher = useFetcher();

  const [allUsers, setAllUsers] = useState(loaderUsers);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [lastProcessedUserId, setLastProcessedUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "securePassword123",
    role: "",
    department: "",
    permissions: [],
  });

  // Filter and paginate users
  const fetchUsers = useCallback(() => {
    const filteredUsers = allUsers.filter((user) => {
      const firstName = user.first_name || user.firstName || "";
      const lastName = user.last_name || user.lastName || "";
      const department = user.department?.name || user.department || "";
      const role = user.role?.name || user.role || "";

      const matchesSearch =
        firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(filters.search.toLowerCase()) ||
        department.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = filters.role === "all" || role === filters.role;
      const matchesStatus =
        filters.status === "all" || user.status === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    setUsers(paginatedUsers);
    setPagination((prev) => ({
      ...prev,
      total,
      totalPages,
    }));
  }, [allUsers, filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
  };

  const getStats = () => ({
    total: allUsers.length,
    active: allUsers.filter((u) => u.status === "Active").length,
    inactive: allUsers.filter((u) => u.status === "Inactive").length,
    admins: allUsers.filter((u) => u.role === "Administrator").length,
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "IT Support":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Doctor":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Nurse":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleAddUser = () => {
    setAddUserError(null);

    // Find role and department names from the selected values
    const selectedRole = loaderRoles.find(r => r.name === newUser.role);
    const selectedDept = loaderDepartments.find(d => d.name === newUser.department);

    if (!selectedRole || !selectedDept) {
      setAddUserError("Please select both role and department");
      return;
    }

    // Submit using fetcher
    const submitData = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      role_id: selectedRole.id,
      department_id: selectedDept.id,
    };

    console.log('Submitting user data:', submitData);
    fetcher.submit(submitData, { method: "post" });
  };

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        // Only process if we haven't already processed this user
        if (lastProcessedUserId !== fetcher.data.user.id) {
          // Add new user to the list
          const newUserData = {
            id: fetcher.data.user.id,
            first_name: fetcher.data.user.first_name,
            last_name: fetcher.data.user.last_name,
            email: fetcher.data.user.email,
            role_id: fetcher.data.user.role_id,
            department_id: fetcher.data.user.department_id,
            role: loaderRoles.find(r => r.id === fetcher.data.user.role_id),
            department: loaderDepartments.find(d => d.id === fetcher.data.user.department_id),
            status: "Active",
          };

          setAllUsers((prev) => [...prev, newUserData]);
          setLastProcessedUserId(fetcher.data.user.id);

          // Reset form
          setNewUser({
            firstName: "",
            lastName: "",
            email: "",
            password: "securePassword123",
            role: "",
            department: "",
            permissions: [],
          });
          setShowPassword(false);
          setAddUserError(null);
          setIsAddUserOpen(false);
        }
      } else {
        // Show error
        setAddUserError(fetcher.data.error || "Failed to create user");
      }
    }
  }, [fetcher.state, fetcher.data, lastProcessedUserId, loaderRoles, loaderDepartments]);

  const handleEditUser = async (user) => {
    // Use all permissions from loader
    setSelectedUserPermissions(loaderPermissions);

    // Fetch the user's role permissions
    try {
      const roleId = user.role_id || user.role?.id;
      if (roleId) {
        const response = await axios.get(`/roles/${roleId}`);
        const rolePermissions = response.data?.data?.permissions || [];
        // Extract permission IDs from the role
        const permissionIds = rolePermissions.map(p => p.id);

        setSelectedUser({
          ...user,
          permissions: permissionIds,
        });
      } else {
        setSelectedUser({
          ...user,
          permissions: user.permissions || [],
        });
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      setSelectedUser({
        ...user,
        permissions: user.permissions || [],
      });
    }

    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    setAllUsers((prevUsers) => {
      return prevUsers.map((user) =>
        user.id === selectedUser.id ? selectedUser : user
      );
    });
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };



  const stats = getStats();
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="shadow-sm" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats - Compact */}
      <div className="py-2 bg-white border-b border-gray-200 flex-shrink-0 mt-2">
        <div className="px-6 grid grid-cols-4 gap-4">
          {[
            {
              title: "Total",
              value: stats.total,
              icon: Users,
              color: "text-blue-500",
            },
            {
              title: "Active",
              value: stats.active,
              icon: UserCheck,
              color: "text-green-500",
            },
            {
              title: "Inactive",
              value: stats.inactive,
              icon: UserX,
              color: "text-red-500",
            },
            {
              title: "Admins",
              value: stats.admins,
              icon: Shield,
              color: "text-purple-500",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gray-50">
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-600">
                    {card.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="py-2 bg-white border-b border-gray-200 flex-shrink-0 mt-2">
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={filters.search}
                onChange={(e) =>
                  handleFiltersChange({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filters.role}
            onValueChange={(value) =>
              handleFiltersChange({ ...filters, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {loaderRoles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white mt-2">
        <div className="flex-1 overflow-y-auto px-6">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-medium">
                              {((user.first_name || user.firstName) || "U")[0]}
                              {((user.last_name || user.lastName) || "S")[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {(user.first_name || user.firstName || "")} {(user.last_name || user.lastName || "")}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleColor(user.role?.name || user.role || "")}
                        >
                          {user.role?.name || user.role || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {user.department?.name || user.department || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0 mt-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">Rows per page:</p>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) =>
                  handlePaginationChange({
                    ...pagination,
                    pageSize: Number.parseInt(value),
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePaginationChange({ ...pagination, page: 1 })
                  }
                  disabled={pagination.page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePaginationChange({
                      ...pagination,
                      page: pagination.page - 1,
                    })
                  }
                  disabled={pagination.page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePaginationChange({
                      ...pagination,
                      page: pagination.page + 1,
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlePaginationChange({
                      ...pagination,
                      page: pagination.totalPages,
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          {addUserError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {addUserError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Combobox
                options={loaderRoles}
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
                placeholder="Select role..."
                searchPlaceholder="Search roles..."
                maxItems={5}
                emptyMessage="No roles found."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Combobox
                options={loaderDepartments}
                value={newUser.department}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, department: value })
                }
                placeholder="Select department..."
                searchPlaceholder="Search departments..."
                maxItems={5}
                emptyMessage="No departments found."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
              disabled={fetcher.state === "submitting"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions for{" "}
              {selectedUser?.first_name || selectedUser?.firstName} {selectedUser?.last_name || selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={selectedUser.first_name || selectedUser.firstName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        first_name: e.target.value,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input
                    id="editLastName"
                    value={selectedUser.last_name || selectedUser.lastName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        last_name: e.target.value,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Enter last name"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="editEmail">Email Address *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Role and Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role *</Label>
                  <Combobox
                    options={loaderRoles}
                    value={selectedUser.role?.name || selectedUser.role || ""}
                    onValueChange={(value) => {
                      const selectedRole = loaderRoles.find(r => r.name === value);
                      setSelectedUser({
                        ...selectedUser,
                        role: selectedRole || { name: value },
                        role_id: selectedRole?.id,
                      });
                    }}
                    placeholder="Select role..."
                    searchPlaceholder="Search roles..."
                    maxItems={5}
                    emptyMessage="No roles found."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDepartment">Department *</Label>
                  <Combobox
                    options={loaderDepartments}
                    value={selectedUser.department?.name || selectedUser.department || ""}
                    onValueChange={(value) => {
                      const selectedDept = loaderDepartments.find(d => d.name === value);
                      setSelectedUser({
                        ...selectedUser,
                        department: selectedDept || { name: value },
                        department_id: selectedDept?.id,
                      });
                    }}
                    placeholder="Select department..."
                    searchPlaceholder="Search departments..."
                    maxItems={5}
                    emptyMessage="No departments found."
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <Label>Permissions (Read-only)</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {selectedUserPermissions.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No permissions assigned to this role
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedUserPermissions.map((permission) => {
                        const isChecked = (selectedUser.permissions || []).includes(
                          permission.id
                        );
                        return (
                          <div
                            key={permission.id}
                            className={`flex items-start space-x-2 p-2 rounded ${
                              isChecked ? "bg-blue-50" : "bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={`edit-${permission.id}`}
                              checked={isChecked}
                              disabled
                              className="mt-1 rounded border-gray-300 cursor-not-allowed"
                            />
                            <div className="min-w-0">
                              <Label
                                htmlFor={`edit-${permission.id}`}
                                className={`text-sm font-medium ${
                                  isChecked
                                    ? "text-blue-700 cursor-default"
                                    : "text-gray-600 cursor-default"
                                }`}
                              >
                                {permission.name || permission.label}
                              </Label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
