import {
  Ban,
  CheckCircle,
  Download,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import {
  canBanUsers,
  canCreateUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canManageUsers,
  canSetUserRoles,
  type UserRole,
} from "@/lib/auth/permissions";
import {
  useBanUser,
  useCreateUser,
  useDeleteUser,
  useImpersonateUser,
  useResetUserPassword,
  useRevokeUserSessions,
  useSetUserRole,
  useUnbanUser,
  useUsers,
} from "@/features/user/user-hooks";
import { UserDetailsDrawer } from "@/features/admin/user-details-drawer";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  createdAt: Date;
  image?: string;
}

function getStatusBadge(user: User) {
  if (user.banned) {
    return (
      <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 font-medium">
        <Ban className="w-3 h-3 mr-1" />
        Banned
      </Badge>
    );
  }
  if (user.emailVerified) {
    return (
      <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 font-medium">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 font-medium">
      Pending
    </Badge>
  );
}

function getRoleBadge(role: string) {
  switch (role) {
    case "superadmin":
      return (
        <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 font-medium">
          <Shield className="w-3 h-3 mr-1" />
          Super Admin
        </Badge>
      );
    case "admin":
      return (
        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-medium">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    case "user":
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-medium">
          <UserCheck className="w-3 h-3 mr-1" />
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

function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const { data: users, isLoading, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mutate: banUser } = useBanUser();
  const { mutate: unbanUser } = useUnbanUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: setUserRole } = useSetUserRole();
  const { mutate: impersonateUser } = useImpersonateUser();
  const { mutate: revokeUserSessions } = useRevokeUserSessions();
  const { mutate: resetPassword } = useResetUserPassword();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';

  if (!canManageUsers(currentUserRole)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Access Denied</h3>
          <p className="text-sm text-muted-foreground">You don't have permission to access admin features.</p>
        </div>
      </div>
    );
  }

  const normalizedUsers: User[] = users?.map(user => ({
    id: user.id,
    name: user.name || "Unknown",
    email: user.email,
    role: user.role || "user",
    emailVerified: user.emailVerified || false,
    banned: user.banned || false,
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    image: user.image || undefined,
  })) || [];

  const filteredUsers = normalizedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.emailVerified && !user.banned) ||
      (statusFilter === "pending" && !user.emailVerified && !user.banned) ||
      (statusFilter === "banned" && user.banned);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (action: string, userId: string, userRole?: string) => {
    const user = normalizedUsers.find(u => u.id === userId);
    
    switch (action) {
      case "view":
        if (user) {
          setSelectedUser(user);
          setDrawerOpen(true);
        }
        break;
      case "ban":
        if (canBanUsers(currentUserRole)) {
          banUser({ userId });
        }
        break;
      case "unban":
        if (canBanUsers(currentUserRole)) {
          unbanUser({ userId });
        }
        break;
      case "delete":
        if (canDeleteUsers(currentUserRole)) {
          deleteUser({ userId });
        }
        break;
      case "setRole":
        if (canSetUserRoles(currentUserRole) && userRole) {
          setUserRole({ userId, role: userRole });
        }
        break;
      case "impersonate":
        if (canImpersonateUsers(currentUserRole)) {
          impersonateUser({ userId });
        }
        break;
      case "revokeSession":
        if (canManageUsers(currentUserRole)) {
          revokeUserSessions({ userId });
        }
        break;
    }
  };

  const stats = {
    total: normalizedUsers.length,
    active: normalizedUsers.filter(u => u.emailVerified && !u.banned).length,
    pending: normalizedUsers.filter(u => !u.emailVerified && !u.banned).length,
    banned: normalizedUsers.filter(u => u.banned).length,
    admins: normalizedUsers.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canCreateUsers(currentUserRole) && <CreateUserDialog />}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.banned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
          </CardContent>
        </Card>
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
                  placeholder="Search users..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.createdAt.toLocaleDateString()}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleUserAction("revokeSession", user.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Revoke Sessions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          
                          {canSetUserRoles(currentUserRole) && (
                            <DropdownMenuItem onClick={() => handleUserAction("setRole", user.id, "admin")}>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          {canBanUsers(currentUserRole) && (
                            user.banned ? (
                              <DropdownMenuItem onClick={() => handleUserAction("unban", user.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUserAction("ban", user.id)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            )
                          )}
                          
                          {canImpersonateUsers(currentUserRole) && (
                            <DropdownMenuItem onClick={() => handleUserAction("impersonate", user.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Impersonate
                            </DropdownMenuItem>
                          )}
                          
                          {canDeleteUsers(currentUserRole) && (
                            <DropdownMenuItem
                              onClick={() => handleUserAction("delete", user.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Drawer */}
      <UserDetailsDrawer
        user={selectedUser}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}