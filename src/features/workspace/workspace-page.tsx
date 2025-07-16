import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ChevronDownIcon, 
  Copy, 
  Loader2, 
  MailPlus, 
  MoreHorizontal, 
  PlusIcon, 
  RefreshCw, 
  Settings, 
  Shield, 
  Trash2, 
  UserMinus, 
  Users, 
  UserX 
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import CopyButton from "@/components/copy-button";
import { FormField } from "@/components/form/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { useSession } from "@/features/auth/auth-hooks";
import {
  useCancelInvitation,
  useCreateOrganization,
  useInviteMember,
  useOrganizations,
  useRemoveMember,
  useSetActiveOrganization,
} from "@/features/organization/organization-hooks";
import type { AuthClient } from "@/lib/auth/auth-client";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslation } from "@/lib/intl/react";

type ActiveOrganization = Awaited<ReturnType<typeof authClient.organization.getFullOrganization>>;

const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "member"], {
    required_error: "Please select a role",
  }),
});

function InviteMemberDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const inviteMember = useInviteMember();

  const form = useForm({
    defaultValues: {
      email: "",
      role: "member" as "admin" | "member",
    },
    validators: {
      onChange: ({ value }) => {
        const result = inviteMemberSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      inviteMember.mutate(
        {
          email: value.email,
          role: value.role,
        },
        {
          onSuccess: () => {
            toast.success("Member invited successfully");
            form.reset();
            setOpen(false);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <MailPlus size={16} />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <form.Field
                name="email"
                children={(field) => (
                  <FormField field={field} label="Email" type="email" placeholder="Enter email address" />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <form.Field
                name="role"
                children={(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as "admin" | "member")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <DialogClose asChild>
                <Button
                  disabled={!canSubmit || isSubmitting || inviteMember.isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  {inviteMember.isPending || isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </DialogClose>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspacePage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { data: organizations } = useOrganizations();
  const { data: activeOrgData } = authClient.organization.useGetFullOrganization();
  const setActiveOrganization = useSetActiveOrganization();
  const removeMember = useRemoveMember();
  const cancelInvitation = useCancelInvitation();

  const [isRevoking, setIsRevoking] = useState<string[]>([]);

  const optimisticOrg = activeOrgData?.data;
  const currentMember = optimisticOrg?.members?.find((member) => member.userId === session?.user.id);

  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const stats = {
    totalMembers: optimisticOrg?.members?.length || 0,
    pendingInvitations: optimisticOrg?.invitations?.filter(inv => inv.status === "pending").length || 0,
    adminMembers: optimisticOrg?.members?.filter(member => member.role === "admin" || member.role === "owner").length || 0,
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate({
      userId: memberId,
    });
  };

  const handleCancelInvitation = (invitationId: string) => {
    setIsRevoking([...isRevoking, invitationId]);
    cancelInvitation.mutate(
      {
        invitationId: invitationId,
      },
      {
        onSuccess: () => {
          toast.success("Invitation revoked successfully");
          setIsRevoking(isRevoking.filter((id) => id !== invitationId));
        },
        onError: () => {
          setIsRevoking(isRevoking.filter((id) => id !== invitationId));
        },
      },
    );
  };

  const copyInvitationLink = (invitationId: string) => {
    const link = `${window.location.origin}/accept-invitation/${invitationId}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
          <p className="text-muted-foreground">
            Manage your organization members and invitations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <span className="mr-2">{optimisticOrg?.name || "Personal"}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setActiveOrganization.mutate({ organizationId: null });
                }}
              >
                Personal
              </DropdownMenuItem>
              {organizations?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => {
                    if (org.id !== optimisticOrg?.id) {
                      setActiveOrganization.mutate({ organizationId: org.id });
                    }
                  }}
                >
                  {org.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {optimisticOrg?.id && <InviteMemberDialog />}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <MailPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvitations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminMembers}</div>
          </CardContent>
        </Card>
      </div>

      {!optimisticOrg?.id ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personal Workspace</h3>
              <p className="text-muted-foreground mb-4">
                Create an organization to collaborate with team members
              </p>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="members" className="space-y-4">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Members</CardTitle>
                <CardDescription>
                  Manage your organization members and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimisticOrg?.members?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.user.image || ""} />
                              <AvatarFallback>
                                {member.user.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.user.name}</div>
                              <div className="text-sm text-muted-foreground">{member.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={member.role === "owner" ? "default" : "outline"}
                            className={
                              member.role === "owner" 
                                ? "bg-purple-100 text-purple-800 border-purple-200" 
                                : member.role === "admin"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : ""
                            }
                          >
                            {member.role === "owner" ? "Owner" : member.role === "admin" ? "Admin" : "Member"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(member.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.role !== "owner" && (currentMember?.role === "owner" || currentMember?.role === "admin") && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-destructive"
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  {currentMember?.id === member.id ? "Leave" : "Remove"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Manage and track your organization invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimisticOrg?.invitations?.filter(inv => inv.status === "pending").length === 0 ? (
                  <div className="text-center py-8">
                    <MailPlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No pending invitations</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[140px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {optimisticOrg?.invitations
                          ?.filter((invitation) => invitation.status === "pending")
                          .map((invitation) => (
                            <motion.tr
                              key={invitation.id}
                              variants={inviteVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                            >
                              <TableCell>
                                <div className="font-medium">{invitation.email}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {invitation.role === "admin" ? "Admin" : "Member"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(invitation.createdAt).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">Pending</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyInvitationLink(invitation.id)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    disabled={isRevoking.includes(invitation.id)}
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleCancelInvitation(invitation.id)}
                                  >
                                    {isRevoking.includes(invitation.id) ? (
                                      <Loader2 className="animate-spin h-3 w-3" />
                                    ) : (
                                      <UserX className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}