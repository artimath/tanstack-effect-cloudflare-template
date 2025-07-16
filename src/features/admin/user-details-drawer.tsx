import { format } from "date-fns";
import {
  Calendar,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/auth-client";
import {
  canBanUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canSetUserRoles,
  getAssignableRoles,
  type UserRole,
} from "@/lib/auth/permissions";
import {
  useBanUser,
  useResetUserPassword,
  useRevokeUserSessions,
  useSetUserRole,
  useUnbanUser,
} from "@/features/user/user-hooks";

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

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: UserRole;
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

function getStatusBadge(user: User) {
  if (user.banned) {
    return (
      <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50 font-medium">
        <X className="w-3 h-3 mr-1" />
        Banned
      </Badge>
    );
  }
  if (user.emailVerified) {
    return (
      <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 font-medium">
        <Check className="w-3 h-3 mr-1" />
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

function ChangeRoleDialog({ 
  user, 
  open, 
  onOpenChange, 
  currentUserRole 
}: { 
  user: User | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  currentUserRole: UserRole;
}) {
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || "user");
  const { mutate: setUserRole, isPending } = useSetUserRole();

  const assignableRoles = getAssignableRoles(currentUserRole);

  const handleRoleChange = () => {
    if (!user) return;
    
    setUserRole(
      { userId: user.id, role: selectedRole },
      {
        onSuccess: () => {
          toast.success("User role updated successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update user role");
        },
      }
    );
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'User';
      case 'admin':
        return 'Admin';
      case 'superadmin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'Basic access with limited permissions';
      case 'admin':
        return 'Can manage users and organization settings';
      case 'superadmin':
        return 'Full system access including user deletion and impersonation';
      default:
        return '';
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex flex-col">
                      <span className="font-medium">{getRoleDisplayName(role)}</span>
                      <span className="text-xs text-muted-foreground">
                        {getRoleDescription(role)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedRole && selectedRole !== user.role && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">
                {selectedRole === 'superadmin' && 'Granting Super Admin access'}
                {selectedRole === 'admin' && 'Granting Admin access'}
                {selectedRole === 'user' && 'Removing admin privileges'}
              </p>
              <p className="text-xs text-muted-foreground">
                {getRoleDescription(selectedRole as UserRole)}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRoleChange} 
              disabled={isPending || selectedRole === user.role}
            >
              {isPending ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ 
  user, 
  open, 
  onOpenChange 
}: { 
  user: User | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate: resetPassword, isPending } = useResetUserPassword();

  const handleResetPassword = () => {
    if (!user) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    resetPassword(
      { userId: user.id, password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          setPassword("");
          setConfirmPassword("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reset password");
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset the password for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword} 
              disabled={isPending || !password || password !== confirmPassword}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BanUserDialog({ 
  user, 
  open, 
  onOpenChange 
}: { 
  user: User | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState("");
  const { mutate: banUser, isPending } = useBanUser();

  const handleBanUser = () => {
    if (!user) return;
    
    banUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("User banned successfully");
          setReason("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to ban user");
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban {user.name} ({user.email}) from the platform
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Ban</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for banning this user"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleBanUser} 
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Banning..." : "Ban User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UserDetailsDrawer({ user, open, onOpenChange, currentUserRole }: UserDetailsDrawerProps) {
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [banUserOpen, setBanUserOpen] = useState(false);
  
  const { mutate: revokeUserSessions, isPending: isRevokingSessions } = useRevokeUserSessions();
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser();

  const copyUserId = () => {
    if (user) {
      navigator.clipboard.writeText(user.id);
      toast.success("User ID copied to clipboard");
    }
  };

  const copyUserEmail = () => {
    if (user) {
      navigator.clipboard.writeText(user.email);
      toast.success("Email copied to clipboard");
    }
  };

  const handleRevokeAllSessions = () => {
    if (!user) return;
    revokeUserSessions(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("All user sessions revoked");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to revoke sessions");
        },
      }
    );
  };

  const handleUnbanUser = () => {
    if (!user) return;
    unbanUser(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("User unbanned successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to unban user");
        },
      }
    );
  };

  if (!user) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              Comprehensive information and actions for {user.name}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* User Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      {getStatusBadge(user)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role</span>
                      {getRoleBadge(user.role)}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">User ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {user.id.slice(0, 8)}...
                          </code>
                          <Button size="sm" variant="ghost" onClick={copyUserId}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium">Member Since</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(user.createdAt, "MMM dd, yyyy")}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">Email</p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            {user.email}
                          </span>
                          <Button size="sm" variant="ghost" onClick={copyUserEmail}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">Email Verified</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          {user.emailVerified ? (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              Verified
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 text-red-600" />
                              Not Verified
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      User activity and session information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>Activity tracking coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Administrative Actions</CardTitle>
                    <CardDescription>
                      Manage this user's account and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    
                    {/* Session Management */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Revoke All Sessions</h4>
                        <p className="text-sm text-muted-foreground">
                          Sign out user from all devices
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRevokeAllSessions}
                        disabled={isRevokingSessions}
                      >
                        {isRevokingSessions ? "Revoking..." : "Revoke"}
                      </Button>
                    </div>

                    {/* Role Management */}
                    {canSetUserRoles(currentUserRole) && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Change Role</h4>
                          <p className="text-sm text-muted-foreground">
                            Modify user permissions and access level
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setChangeRoleOpen(true)}
                        >
                          Change Role
                        </Button>
                      </div>
                    )}

                    {/* Password Reset */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Reset Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Set a new password for this user
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setResetPasswordOpen(true)}
                      >
                        Reset Password
                      </Button>
                    </div>

                    {/* Ban/Unban User */}
                    {canBanUsers(currentUserRole) && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">
                            {user.banned ? "Unban User" : "Ban User"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {user.banned 
                              ? "Restore user access to the platform" 
                              : "Restrict user access to the platform"
                            }
                          </p>
                        </div>
                        {user.banned ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleUnbanUser}
                            disabled={isUnbanning}
                          >
                            {isUnbanning ? "Unbanning..." : "Unban"}
                          </Button>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setBanUserOpen(true)}
                          >
                            Ban User
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Impersonate (Super Admin only) */}
                    {canImpersonateUsers(currentUserRole) && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Impersonate User</h4>
                          <p className="text-sm text-muted-foreground">
                            Login as this user (super admin only)
                          </p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Impersonate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <ChangeRoleDialog 
        user={user} 
        open={changeRoleOpen} 
        onOpenChange={setChangeRoleOpen}
        currentUserRole={currentUserRole}
      />
      <ResetPasswordDialog 
        user={user} 
        open={resetPasswordOpen} 
        onOpenChange={setResetPasswordOpen}
      />
      <BanUserDialog 
        user={user} 
        open={banUserOpen} 
        onOpenChange={setBanUserOpen}
      />
    </>
  );
}