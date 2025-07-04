import {
  Download,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ComponentOverlayLoader } from "@/components/ui/overlay-loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers } from "@/features/user/user-hooks";

// Extended user interface for display purposes
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  banned: boolean;
  createdAt: Date;
  image?: string;
}

// Mock data to match the style from shadcn-admin repository
// This can be replaced with actual API data later
const mockUsers: ExtendedUser[] = [
  {
    id: "1",
    name: "Chauncey Smith",
    email: "chauncey_koepp@yahoo.com",
    phone: "+15136612218",
    role: "superadmin",
    status: "inactive",
    emailVerified: true,
    banned: false,
    createdAt: new Date("2023-10-15"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Bailey Simonis",
    email: "bailey49@hotmail.com",
    phone: "+14313356550",
    role: "manager",
    status: "inactive",
    emailVerified: true,
    banned: false,
    createdAt: new Date("2023-09-20"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Lavonne Heathcote",
    email: "lavonne_effertz39@yahoo.com",
    phone: "+19903231269",
    role: "superadmin",
    status: "invited",
    emailVerified: false,
    banned: false,
    createdAt: new Date("2023-11-01"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "4",
    name: "Efren Homenick",
    email: "efren.emard@gmail.com",
    phone: "+16469122542",
    role: "manager",
    status: "inactive",
    emailVerified: true,
    banned: false,
    createdAt: new Date("2023-08-12"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "5",
    name: "Chloe Reichert",
    email: "chloe.little86@hotmail.com",
    phone: "+14732106127",
    role: "superadmin",
    status: "suspended",
    emailVerified: true,
    banned: true,
    createdAt: new Date("2023-07-25"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "6",
    name: "Juliet Witting",
    email: "juliet_hodkiewicz@hotmail.com",
    phone: "+16463662634",
    role: "superadmin",
    status: "invited",
    emailVerified: false,
    banned: false,
    createdAt: new Date("2023-12-03"),
    image: "/placeholder-user.jpg",
  },
  {
    id: "7",
    name: "Lura Murazik",
    email: "lura.hyatt88@yahoo.com",
    phone: "+13872638574",
    role: "admin",
    status: "active",
    emailVerified: true,
    banned: false,
    createdAt: new Date("2023-09-14"),
    image: "/placeholder-user.jpg",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 font-medium">
          Active
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-medium">
          Inactive
        </Badge>
      );
    case "invited":
      return (
        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-medium">
          Invited
        </Badge>
      );
    case "suspended":
      return (
        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 font-medium">
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-medium">
          {status}
        </Badge>
      );
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case "superadmin":
      return (
        <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 font-medium">
          <Shield className="w-3 h-3 mr-1" />
          Superadmin
        </Badge>
      );
    case "admin":
      return (
        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-medium">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    case "manager":
      return (
        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 font-medium">
          <Settings className="w-3 h-3 mr-1" />
          Manager
        </Badge>
      );
    case "user":
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-medium">
          User
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-medium">
          {role}
        </Badge>
      );
  }
}

function UserTableSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => `skeleton-${Date.now()}-${i}`);

  return (
    <div className="space-y-4">
      {skeletonItems.map((key) => (
        <div key={key} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
          <div className="ml-auto space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to normalize user data for display
function normalizeUserData(users: any[]): ExtendedUser[] {
  return users.map((user) => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email,
    phone: user.phone || "N/A",
    role: user.role || "user",
    status: user.banned ? "suspended" : user.emailVerified ? "active" : "inactive",
    emailVerified: user.emailVerified || false,
    banned: user.banned || false,
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    image: user.image || undefined,
  }));
}

export function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Use actual users data when available, fallback to mock data
  const { data: actualUsers, isLoading } = useUsers();
  const users = actualUsers && actualUsers.length > 0 ? normalizeUserData(actualUsers) : mockUsers;

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleUserAction = (action: string, userId: string) => {
    console.log(`${action} user ${userId}`);
    // TODO: Implement actual user actions with Better-auth
  };

  return (
    <div className="container mx-auto py-6 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User List</h1>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              {/* View Options */}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[70px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.email}
                      {user.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUserAction("view", user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("activity", user.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUserAction("email", user.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("reset", user.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.banned ? (
                          <DropdownMenuItem onClick={() => handleUserAction("unban", user.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUserAction("ban", user.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleUserAction("delete", user.id)}
                          className="text-destructive"
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

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length === 0 ? "0 of 0 row(s) selected." : `0 of ${filteredUsers.length} row(s) selected.`}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={usersPerPage.toString()}
                  onValueChange={(value) => {
                    // Handle rows per page change
                    console.log("Rows per page:", value);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={usersPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>⇤
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>←
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to next page</span>→
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to last page</span>⇥
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Loader */}
      <ComponentOverlayLoader isLoading={isLoading} message="Loading users..." size="md" />
    </div>
  );
}
