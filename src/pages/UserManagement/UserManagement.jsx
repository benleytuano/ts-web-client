import { useState, useEffect, useCallback } from "react";
import { useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
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
  Trash2,
  Shield,
  Users,
  UserCheck,
  UserX,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Mock data with more users for pagination
const generateMockUsers = () => {
  const baseUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Mendoza",
      email: "john.mendoza@ihoms.com",
      role: "IT Support",
      department: "IT DEPARTMENT",
      location: "SERVER ROOM",
      status: "Active",
      lastLogin: "2025-01-07T10:30:00Z",
      createdAt: "2024-12-01T08:00:00Z",
      permissions: [
        "view_tickets",
        "edit_tickets",
        "assign_tickets",
        "resolve_tickets",
      ],
      avatar: null,
    },
    {
      id: 2,
      firstName: "Rheenamel",
      lastName: "Pacamara",
      email: "rheenamel.pacamara@ihoms.com",
      role: "Nurse",
      department: "NURSING - OPD",
      location: "NURSING - OPD",
      status: "Active",
      lastLogin: "2025-01-07T09:15:00Z",
      createdAt: "2024-11-15T10:30:00Z",
      permissions: ["view_tickets", "create_tickets"],
      avatar: null,
    },
    {
      id: 3,
      firstName: "Tuaño",
      lastName: "Benley Earl",
      email: "tuano.benley@ihoms.com",
      role: "Administrator",
      department: "ADMINISTRATION",
      location: "ADMINISTRATION",
      status: "Active",
      lastLogin: "2025-01-07T11:45:00Z",
      createdAt: "2024-10-01T09:00:00Z",
      permissions: ["all_permissions"],
      avatar: null,
    },
  ];

  // Generate additional mock users for pagination testing
  const additionalUsers = Array.from({ length: 47 }, (_, i) => ({
    id: i + 4,
    firstName: `User${i + 4}`,
    lastName: `Test${i + 4}`,
    email: `user${i + 4}@ihoms.com`,
    role: ["Nurse", "Doctor", "Staff", "IT Support"][i % 4],
    department: [
      "NURSING - OPD",
      "EMERGENCY DEPARTMENT",
      "IT DEPARTMENT",
      "PHARMACY",
    ][i % 4],
    location: [
      "NURSING - OPD",
      "EMERGENCY DEPARTMENT",
      "SERVER ROOM",
      "PHARMACY DEPARTMENT",
    ][i % 4],
    status: ["Active", "Inactive", "Pending"][i % 3],
    lastLogin:
      i % 3 === 0
        ? null
        : new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    permissions: ["view_tickets", "create_tickets"],
    avatar: null,
  }));

  return [...baseUsers, ...additionalUsers];
};

const rolePermissions = {
  Administrator: ["all_permissions"],
  "IT Support": [
    "view_tickets",
    "edit_tickets",
    "assign_tickets",
    "resolve_tickets",
    "manage_users",
  ],
  Supervisor: [
    "view_tickets",
    "create_tickets",
    "assign_tickets",
    "view_reports",
  ],
  Doctor: ["view_tickets", "create_tickets", "priority_tickets"],
  Nurse: ["view_tickets", "create_tickets"],
  Staff: ["view_tickets", "create_tickets"],
};

const allPermissions = [
  {
    id: "view_tickets",
    label: "View Tickets",
    description: "Can view all tickets",
  },
  {
    id: "create_tickets",
    label: "Create Tickets",
    description: "Can create new tickets",
  },
  {
    id: "edit_tickets",
    label: "Edit Tickets",
    description: "Can edit ticket details",
  },
  {
    id: "assign_tickets",
    label: "Assign Tickets",
    description: "Can assign tickets to users",
  },
  {
    id: "resolve_tickets",
    label: "Resolve Tickets",
    description: "Can resolve and close tickets",
  },
  {
    id: "priority_tickets",
    label: "Priority Tickets",
    description: "Can create high priority tickets",
  },
  {
    id: "manage_users",
    label: "Manage Users",
    description: "Can manage user accounts",
  },
  {
    id: "view_reports",
    label: "View Reports",
    description: "Can access system reports",
  },
  {
    id: "system_settings",
    label: "System Settings",
    description: "Can modify system settings",
  },
];

const departments = [
  "IT DEPARTMENT",
  "NURSING - OPD",
  "NURSING - ICU",
  "NURSING - PEDIATRICS",
  "EMERGENCY DEPARTMENT",
  "CARDIOLOGY",
  "PHARMACY",
  "PUBLIC HEALTH UNIT",
  "MULTIMEDIA",
  "ADMINISTRATION",
];

export default function UserManagement() {
  const { posts } = useLoaderData();

  useEffect(() => {
    console.log("Posts loaded:", posts);
  }, []); // Only runs once per mount

  const [allUsers] = useState(generateMockUsers());
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    location: "",
    permissions: [],
  });

  // Simulate server-side data fetching
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filteredUsers = allUsers.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.department.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = filters.role === "all" || user.role === filters.role;
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
    setIsLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Inactive":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

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

  const handleAddUser = async () => {
    const user = {
      id: allUsers.length + 1,
      ...newUser,
      status: "Active",
      lastLogin: null,
      createdAt: new Date().toISOString(),
      avatar: null,
    };

    allUsers.push(user);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      department: "",
      location: "",
      permissions: [],
    });
    setIsAddUserOpen(false);
    fetchUsers();
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    const index = allUsers.findIndex((user) => user.id === selectedUser.id);
    if (index !== -1) {
      allUsers[index] = selectedUser;
    }
    setIsEditUserOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const index = allUsers.findIndex((user) => user.id === userId);
      if (index !== -1) {
        allUsers.splice(index, 1);
      }
      fetchUsers();
    }
  };

  const handleToggleUserStatus = async (userId) => {
    const index = allUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      allUsers[index].status =
        allUsers[index].status === "Active" ? "Inactive" : "Active";
    }
    fetchUsers();
  };

  const handleRoleChange = (role) => {
    const permissions = rolePermissions[role] || [];
    setNewUser({ ...newUser, role, permissions });
  };

  const stats = getStats();
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Users",
            value: stats.total,
            icon: Users,
            color: "text-blue-500",
          },
          {
            title: "Active Users",
            value: stats.active,
            icon: UserCheck,
            color: "text-green-500",
          },
          {
            title: "Inactive Users",
            value: stats.inactive,
            icon: UserX,
            color: "text-red-500",
          },
          {
            title: "Administrators",
            value: stats.admins,
            icon: Shield,
            color: "text-purple-500",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-50">
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {Object.keys(rolePermissions).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                handleFiltersChange({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl">Users</CardTitle>
          <CardDescription>
            Manage user accounts and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Login</TableHead>
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
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleColor(user.role)}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {user.department}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <Badge
                            variant="outline"
                            className={getStatusColor(user.status)}
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : "Never"}
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
                            <DropdownMenuItem
                              onClick={() => handleToggleUserStatus(user.id)}
                              className="cursor-pointer"
                            >
                              {user.status === "Active" ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 cursor-pointer focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-lg shadow-sm">
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

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate permissions.
            </DialogDescription>
          </DialogHeader>
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
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(rolePermissions).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={newUser.department}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newUser.location}
                onChange={(e) =>
                  setNewUser({ ...newUser, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
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
              {selectedUser?.firstName} {selectedUser?.lastName}
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
                    value={selectedUser.firstName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
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
                    value={selectedUser.lastName}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
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

              {/* Role and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role *</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => {
                      const permissions = rolePermissions[value] || [];
                      setSelectedUser({
                        ...selectedUser,
                        role: value,
                        permissions,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(rolePermissions).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) =>
                      setSelectedUser({ ...selectedUser, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDepartment">Department *</Label>
                  <Select
                    value={selectedUser.department}
                    onValueChange={(value) =>
                      setSelectedUser({ ...selectedUser, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLocation">Location</Label>
                  <Input
                    id="editLocation"
                    value={selectedUser.location}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        location: e.target.value,
                      })
                    }
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {selectedUser.permissions.includes("all_permissions") ? (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <Badge className="bg-purple-100 text-purple-800">
                        All Permissions Granted
                      </Badge>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {allPermissions
                        .filter((p) => p.id !== "all_permissions")
                        .map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`edit-${permission.id}`}
                              checked={selectedUser.permissions.includes(
                                permission.id
                              )}
                              onChange={(e) => {
                                const updatedPermissions = e.target.checked
                                  ? [...selectedUser.permissions, permission.id]
                                  : selectedUser.permissions.filter(
                                      (p) => p !== permission.id
                                    );
                                setSelectedUser({
                                  ...selectedUser,
                                  permissions: updatedPermissions,
                                });
                              }}
                              className="mt-1 rounded border-gray-300"
                            />
                            <div className="min-w-0">
                              <Label
                                htmlFor={`edit-${permission.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {permission.label}
                              </Label>
                              <p className="text-xs text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm text-gray-900">
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Login:</span>
                    <p className="font-medium">
                      {selectedUser.lastLogin
                        ? new Date(selectedUser.lastLogin).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
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
