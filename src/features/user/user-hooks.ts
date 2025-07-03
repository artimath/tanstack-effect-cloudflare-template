import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

const userQueryKeys = {
  all: ["users"] as const,
  list: () => [...userQueryKeys.all, "list"] as const,
  sessions: () => ["sessions"] as const,
  passkeys: () => ["passkeys"] as const,
  twoFactor: () => ["twoFactor"] as const,
};

export const useUsers = () => {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: async () => {
      const data = await authClient.admin.listUsers(
        {
          query: {
            limit: 10,
            sortBy: "createdAt",
            sortDirection: "desc",
          },
        },
        {
          throw: true,
        },
      );

      return data?.users || [];
    },
    retry: (failureCount, error: Error) => {
      // Don't retry if it's a permission error
      if (error?.message?.includes("forbidden")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: userQueryKeys.sessions(),
    queryFn: async () => {
      const getSession = authClient.getSession();
      const getSessions = authClient.listSessions();
      const getOrganization = authClient.organization.getFullOrganization();
      const [session, organization, sessions] = await Promise.all([getSession, getOrganization, getSessions]);
      return { session, organization, sessions } as const;
    },
    retry: (failureCount, error: Error) => {
      if (error?.message?.includes("forbidden")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const usePasskeys = () => {
  const passkeys = authClient.useListPasskeys();
  return passkeys;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const result = await authClient.admin.createUser({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to create user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Create user error:", error);
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.removeUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to remove user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Remove user error:", error);
    },
  });
};

export const useRevokeUserSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.revokeUserSessions({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to revoke user sessions");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error("Revoke user sessions error:", error);
    },
  });
};

export const useImpersonateUser = () => {
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.impersonateUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to impersonate user");
      }

      return result;
    },
    onError: (error: Error) => {
      console.error("Impersonate user error:", error);
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.banUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to ban user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Ban user error:", error);
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const result = await authClient.admin.unbanUser({
        userId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to unban user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Unban user error:", error);
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const result = await authClient.revokeSession({
        token,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to revoke session");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error("Revoke session error:", error);
    },
  });
};

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await authClient.sendVerificationEmail(
        {
          email: "test@test.com",
        },
        {
          throw: true,
        },
      );

      if (!result.status) {
        throw new Error("Failed to send verification email");
      }

      return result;
    },
    onError: (error: Error) => {
      console.error("Send verification email error:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, image }: { name?: string; image?: string }) => {
      const result = await authClient.updateUser({
        name,
        image,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to update user");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: Error) => {
      console.error("Update user error:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      revokeOtherSessions,
    }: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to change password");
      }

      return result;
    },
    onError: (error: Error) => {
      console.error("Change password error:", error);
    },
  });
};

export const useAddPasskey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const result = await authClient.passkey.addPasskey({
        name,
      });

      if (result?.error) {
        throw new Error(result.error.message || "Failed to add passkey");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.passkeys() });
    },
    onError: (error: Error) => {
      console.error("Add passkey error:", error);
    },
  });
};

export const useDeletePasskey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ passkeyId }: { passkeyId: string }) => {
      const result = await authClient.passkey.deletePasskey({
        id: passkeyId,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to delete passkey");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.passkeys() });
    },
    onError: (error: Error) => {
      console.error("Delete passkey error:", error);
    },
  });
};

// Two Factor Authentication hooks
export const useGetTotpUri = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const result = await authClient.twoFactor.getTotpUri({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to get TOTP URI");
      }

      return result;
    },
    onError: (error: Error) => {
      console.error("Get TOTP URI error:", error);
    },
  });
};

export const useEnableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { totp?: string; password: string }) => {
      const result = await authClient.twoFactor.enable({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to enable two-factor authentication");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.twoFactor() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error("Enable two-factor error:", error);
    },
  });
};

export const useDisableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const result = await authClient.twoFactor.disable({
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to disable two-factor authentication");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.twoFactor() });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions() });
    },
    onError: (error: Error) => {
      console.error("Disable two-factor error:", error);
    },
  });
};

export const useVerifyTwoFactor = () => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const result = await authClient.twoFactor.verifyTotp({
        code,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to verify two-factor authentication");
      }

      return result;
    },
    onError: (error: Error) => {
      console.error("Verify two-factor error:", error);
    },
  });
};
