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
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ComponentOverlayLoader } from '@/components/ui/overlay-loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBanUser, useDeleteUser, useUnbanUser, useUsers } from '@/features/user/user-hooks';
import { canBanUsers, canDeleteUsers, canManageUsers, type UserRole } from '@/lib/auth/permissions';
import { useSession } from '../auth/auth-hooks';

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

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700" variant="outline">
          Active
        </Badge>
      );
    case 'inactive':
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
          Inactive
        </Badge>
      );
    case 'invited':
      return (
        <Badge className="border-blue-200 bg-blue-50 font-medium text-blue-700" variant="outline">
          Invited
        </Badge>
      );
    case 'suspended':
      return (
        <Badge className="border-red-200 bg-red-50 font-medium text-red-700" variant="outline">
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
          {status}
        </Badge>
      );
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'superadmin':
      return (
        <Badge className="border-purple-200 bg-purple-50 font-medium text-purple-700" variant="outline">
          <Shield className="mr-1 h-3 w-3" />
          Superadmin
        </Badge>
      );
    case 'admin':
      return (
        <Badge className="border-indigo-200 bg-indigo-50 font-medium text-indigo-700" variant="outline">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    case 'user':
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
          User
        </Badge>
      );
    default:
      return (
        <Badge className="border-slate-200 bg-slate-50 font-medium text-slate-600" variant="outline">
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
        <div className="flex items-center space-x-4 p-4" key={key}>
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
    name: user.name || 'Unknown',
    email: user.email,
    phone: user.phone || 'N/A',
    role: user.role || 'user',
    status: user.banned ? 'suspended' : user.emailVerified ? 'active' : 'inactive',
    emailVerified: user.emailVerified,
    banned: user.banned,
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    image: user.image || undefined,
  }));
}

export function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const { data: actualUsers, isLoading } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: banUser } = useBanUser();
  const { mutate: unbanUser } = useUnbanUser();
  const { data: session } = useSession();

  const currentUserRole = (session?.user?.role as UserRole) || 'user';
  const users = actualUsers ? normalizeUserData(actualUsers) : [];

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'ban':
        if (canBanUsers(currentUserRole)) {
          banUser({ userId });
        }
        break;
      case 'unban':
        if (canBanUsers(currentUserRole)) {
          unbanUser({ userId });
        }
        break;
      case 'delete':
        if (canDeleteUsers(currentUserRole)) {
          deleteUser({ userId });
        }
        break;
      default:
        console.log(`${action} user ${userId}`);
    }
  };

  return (
    <div className="container relative mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">User List</h1>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
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
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="w-[300px] pl-8"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter users..."
                  value={searchTerm}
                />
              </div>

              {/* Status Filter */}
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
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
              <Select onValueChange={setRoleFilter} value={roleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              {/* View Options */}
              <Button size="sm" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
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
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={6}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage alt={user.name} src={user.image} />
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-sm">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.email}
                        {user.emailVerified && (
                          <Badge className="text-xs" variant="outline">
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
                          <Button className="h-8 w-8 p-0" variant="ghost">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserAction('view', user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction('activity', user.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {canManageUsers(currentUserRole) && (
                            <>
                              <DropdownMenuItem onClick={() => handleUserAction('email', user.id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction('reset', user.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {canBanUsers(currentUserRole) &&
                            (user.banned ? (
                              <DropdownMenuItem onClick={() => handleUserAction('unban', user.id)}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUserAction('ban', user.id)}>
                                <UserX className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            ))}
                          {canDeleteUsers(currentUserRole) && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleUserAction('delete', user.id)}
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

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground text-sm">
              {filteredUsers.length === 0 ? '0 of 0 row(s) selected.' : `0 of ${filteredUsers.length} row(s) selected.`}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">Rows per page</p>
                <Select
                  onValueChange={(value) => {
                    // Handle rows per page change
                    console.log('Rows per page:', value);
                  }}
                  value={usersPerPage.toString()}
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
              <div className="flex w-[100px] items-center justify-center font-medium text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  className="h-8 w-8 p-0"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  variant="outline"
                >
                  <span className="sr-only">Go to first page</span>⇤
                </Button>
                <Button
                  className="h-8 w-8 p-0"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  variant="outline"
                >
                  <span className="sr-only">Go to previous page</span>←
                </Button>
                <Button
                  className="h-8 w-8 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  variant="outline"
                >
                  <span className="sr-only">Go to next page</span>→
                </Button>
                <Button
                  className="h-8 w-8 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  variant="outline"
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
