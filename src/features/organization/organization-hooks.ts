import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

const organizationQueryKeys = {
  all: ["organizations"] as const,
  list: () => [...organizationQueryKeys.all, "list"] as const,
  active: () => [...organizationQueryKeys.all, "active"] as const,
  full: () => [...organizationQueryKeys.all, "full"] as const,
  invitations: () => [...organizationQueryKeys.all, "invitations"] as const,
  members: () => [...organizationQueryKeys.all, "members"] as const,
};

export const useOrganizations = () => {
  const organizations = authClient.useListOrganizations();
  return organizations;
};

export const useActiveOrganization = () => {
  const activeOrganization = authClient.useActiveOrganization();
  return activeOrganization;
};

export const useFullOrganization = () => {
  return useQuery({
    queryKey: organizationQueryKeys.full(),
    queryFn: async () => {
      const data = await authClient.organization.getFullOrganization();
      return data;
    },
    retry: (failureCount, error: Error) => {
      if (error?.message?.includes("forbidden")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSetActiveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId }: { organizationId: string | null }) => {
      const result = await authClient.organization.setActive({
        organizationId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to set active organization");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch organization data
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error: Error) => {
      console.error("Set active organization error:", error);
    },
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, slug, logo }: { name: string; slug: string; logo?: string }) => {
      const result = await authClient.organization.create({
        name,
        slug,
        logo,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to create organization");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
    },
    onError: (error: Error) => {
      console.error("Create organization error:", error);
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      role,
    }: {
      email: string;
      role: "admin" | "member" | "owner" | ("admin" | "member" | "owner")[];
    }) => {
      const result = await authClient.organization.inviteMember({
        email,
        role,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to invite member");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.members(),
      });
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.invitations(),
      });
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.full() });
    },
    onError: (error: Error) => {
      console.error("Invite member error:", error);
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.organization.removeMember({
        memberIdOrEmail: userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to remove member");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.members(),
      });
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.full() });
    },
    onError: (error: Error) => {
      console.error("Remove member error:", error);
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ invitationId }: { invitationId: string }) => {
      const result = await authClient.organization.cancelInvitation({
        invitationId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to cancel invitation");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.invitations(),
      });
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.full() });
    },
    onError: (error: Error) => {
      console.error("Cancel invitation error:", error);
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ invitationId }: { invitationId: string }) => {
      const result = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to accept invitation");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      router.navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => {
      console.error("Accept invitation error:", error);
    },
  });
};

export const useRejectInvitation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ invitationId }: { invitationId: string }) => {
      const result = await authClient.organization.rejectInvitation({
        invitationId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to reject invitation");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.invitations(),
      });
      router.navigate({ to: "/dashboard" });
    },
    onError: (error: Error) => {
      console.error("Reject invitation error:", error);
    },
  });
};

export const useGetInvitation = (invitationId: string) => {
  return useQuery({
    queryKey: [...organizationQueryKeys.invitations(), invitationId],
    queryFn: async () => {
      const data = await authClient.organization.getInvitation({
        query: {
          id: invitationId,
        },
      });

      if (data.error) {
        throw new Error(data.error.message || "Failed to get invitation");
      }

      return data;
    },
    retry: (failureCount, error: Error) => {
      if (error?.message?.includes("not found")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
