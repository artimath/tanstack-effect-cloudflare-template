import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, Loader2, MailPlus, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import CopyButton from "@/components/copy-button";
import { FormField } from "@/components/form/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function OrganizationCard(props: {
  session: AuthClient["$Infer"]["Session"] | null;
  activeOrganization: ActiveOrganization | null;
}) {
  const { t } = useTranslation();
  const { data: organizations } = useOrganizations();
  const setActiveOrganization = useSetActiveOrganization();
  const createOrganization = useCreateOrganization();
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();
  const cancelInvitation = useCancelInvitation();

  const optimisticOrg =
    // TODO: Fix this type
    // @ts-expect-error
    props.activeOrganization as typeof setActiveOrganization.data.data;

  const [isRevoking, setIsRevoking] = useState<string[]>([]);
  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const { data } = useSession();
  const session = data || props.session;

  const currentMember = optimisticOrg?.members?.find((member) => member.userId === session?.user.id);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("ORGANIZATION")}</CardTitle>
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-1">
                <p className="text-sm">
                  <span className="font-bold" /> {optimisticOrg?.name || t("PERSONAL")}
                </p>

                <ChevronDownIcon />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className=" py-1"
                onClick={async () => {
                  setActiveOrganization.mutate({
                    organizationId: null,
                  });
                }}
              >
                <p className="sm text-sm">{t("PERSONAL")}</p>
              </DropdownMenuItem>
              {organizations?.map((org) => (
                <DropdownMenuItem
                  className=" py-1"
                  key={org.id}
                  onClick={async () => {
                    if (org.id === optimisticOrg?.id) {
                      return;
                    }

                    setActiveOrganization.mutate({
                      organizationId: org.id,
                    });
                  }}
                >
                  <p className="sm text-sm">{org.name}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <CreateOrganizationDialog />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="rounded-none">
            <AvatarImage className="h-full w-full rounded-none object-cover" src={optimisticOrg?.logo || ""} />
            <AvatarFallback className="rounded-none">{optimisticOrg?.name?.charAt(0) || "P"}</AvatarFallback>
          </Avatar>
          <div>
            <p>{optimisticOrg?.name || t("PERSONAL")}</p>
            <p className="text-muted-foreground text-xs">
              {optimisticOrg?.members.length || 1} {t("MEMBERS")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">{t("MEMBERS")}</p>
            <div className="flex flex-col gap-2">
              {optimisticOrg?.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 sm:flex">
                      <AvatarImage src={member.user.image || ""} className="object-cover" />
                      <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{member.user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {member.role === "owner" ? t("OWNER") : member.role === "member" ? t("MEMBER") : t("ADMIN")}
                      </p>
                    </div>
                  </div>
                  {member.role !== "owner" && (currentMember?.role === "owner" || currentMember?.role === "admin") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        removeMember.mutate({
                          userId: member.id,
                        });
                      }}
                    >
                      {currentMember?.id === member.id ? t("LEAVE") : t("REMOVE")}
                    </Button>
                  )}
                </div>
              ))}
              {!optimisticOrg?.id && (
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={session?.user.image || ""} />
                      <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{session?.user.name}</p>
                      <p className="text-muted-foreground text-xs">{t("OWNER")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-grow flex-col gap-2">
            <p className="border-b-2 border-b-foreground/10 font-medium">{t("INVITES")}</p>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {optimisticOrg?.invitations
                  .filter((invitation) => invitation.status === "pending")
                  .map((invitation) => (
                    <motion.div
                      key={invitation.id}
                      className="flex items-center justify-between"
                      variants={inviteVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <div>
                        <p className="text-sm">{invitation.email}</p>
                        <p className="text-muted-foreground text-xs">
                          {invitation.role === "owner"
                            ? t("OWNER")
                            : invitation.role === "member"
                              ? t("MEMBER")
                              : t("ADMIN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={isRevoking.includes(invitation.id)}
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setIsRevoking([...isRevoking, invitation.id]);
                            cancelInvitation.mutate(
                              {
                                invitationId: invitation.id,
                              },
                              {
                                onSuccess: () => {
                                  toast.message("Invitation revoked successfully");
                                  setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
                                },
                                onError: () => {
                                  setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
                                },
                              },
                            );
                          }}
                        >
                          {isRevoking.includes(invitation.id) ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            t("REVOKE")
                          )}
                        </Button>
                        <div>
                          <CopyButton textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {optimisticOrg?.invitations.length === 0 && (
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t("NO_ACTIVE_INVITATIONS")}
                </motion.p>
              )}
              {!optimisticOrg?.id && (
                <Label className="text-muted-foreground text-xs">{t("CANT_INVITE_PERSONAL")}</Label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <div>
            <div>{optimisticOrg?.id && <InviteMemberDialog />}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  logo: z.instanceof(File).optional(),
});

function CreateOrganizationDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const createOrganization = useCreateOrganization();

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined as File | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const result = createOrganizationSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        let logoBase64: string | undefined;
        if (value.logo) {
          logoBase64 = await convertImageToBase64(value.logo);
        }

        createOrganization.mutate(
          {
            name: value.name,
            slug: value.slug,
            logo: logoBase64,
          },
          {
            onSuccess: () => {
              toast.success("Organization created successfully");
              setOpen(false);
              form.reset();
              setLogoPreview(null);
              setIsSlugEdited(false);
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        );
      } catch (error) {
        toast.error("An error occurred while creating organization");
      }
    },
  });

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!isSlugEdited && form.state.values.name) {
      const generatedSlug = form.state.values.name.trim().toLowerCase().replace(/\s+/g, "-");
      form.setFieldValue("slug", generatedSlug);
    }
  }, [form.state.values.name, isSlugEdited]);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    form.setFieldValue("logo", undefined);
    setLogoPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="default">
          <PlusIcon />
          <p>{t("NEW_ORGANIZATION")}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("NEW_ORGANIZATION")}</DialogTitle>
          <DialogDescription>{t("CREATE_ORGANIZATION")}</DialogDescription>
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
                name="name"
                children={(field) => <FormField field={field} label={t("ORGANIZATION_NAME")} placeholder={t("NAME")} />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <form.Field
                name="slug"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name}>{t("ORGANIZATION_SLUG")}</Label>
                    <Input
                      className="mt-1"
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setIsSlugEdited(true);
                      }}
                      placeholder="organization-slug"
                    />
                    {field.state.meta.errors && (
                      <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("LOGO")}</Label>
              <Input type="file" accept="image/*" onChange={handleLogoChange} />
              {logoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 rounded object-cover"
                    width={16}
                    height={16}
                  />
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="text-destructive text-sm hover:text-destructive/80"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
        <DialogFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting || createOrganization.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                {createOrganization.isPending || isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  t("CREATE")
                )}
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
        <Button size="sm" className="w-full gap-2" variant="secondary">
          <MailPlus size={16} />
          <p>{t("INVITE_MEMBER")}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("INVITE_MEMBER")}</DialogTitle>
          <DialogDescription>{t("INVITE_MEMBER_DESC")}</DialogDescription>
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
                  <FormField field={field} label={t("EMAIL")} type="email" placeholder={t("EMAIL")} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("ROLE")}</Label>
              <form.Field
                name="role"
                children={(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as "admin" | "member")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`${t("SELECT_USER")}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("ADMIN")}</SelectItem>
                      <SelectItem value="member">{t("MEMBER")}</SelectItem>
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
                    t("INVITE")
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
