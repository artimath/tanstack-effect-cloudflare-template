import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { ErrorContext } from "better-auth/react";
import type { SocialProvider } from "better-auth/social-providers";

const authQueryKeys = {
  session: ["session"],
};

export const useSession = () => {
  const session = authClient.useSession();
  return session;
};

export const useLogin = () => {
  const router = useRouter();
  const loginWithCredentials = useMutation({
    mutationFn: async ({
      email,
      password,
      rememberMe,
    }: { email: string; password: string; rememberMe: boolean }) => {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });
      
      if (result.error) {
        throw new Error(result.error.message || "Authentication failed");
      }
      
      return result;
    },
    onSuccess(response) {
      if (response.data?.user.id) {
        router.navigate({ to: "/dashboard" });
      }
    },
    onError(error: any) {
      console.error("Login error:", error);
    },
  });

  const loginWithPasskey = useMutation({
    mutationFn: async () => {
      const result = await authClient.signIn.passkey();
      if (result?.error) {
        throw new Error(result.error.message || "Passkey authentication failed");
      }
      return result;
    },
    onSuccess: () => {
      router.navigate({ to: "/dashboard" });
    },
    onError(error: any) {
      console.error("Passkey login error:", error);
    },
  });

  const loginWithSocial = useMutation({
    mutationFn: async ({
      provider,
      callbackURL,
    }: { provider: SocialProvider; callbackURL: string }) => {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: callbackURL || "/dashboard",
      });
      
      if (result.error) {
        throw new Error(result.error.message || "Social authentication failed");
      }
      
      return result;
    },
    onError(error: any) {
      console.error("Social login error:", error);
    },
  });

  return {
    loginWithCredentials,
    loginWithPasskey,
    loginWithSocial,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.session });
      await router.navigate({ to: "/login" });
    },
  });
};

export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorContext) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: { email: string; password: string; name: string }) =>
      await authClient.signUp.email(
        { email, password, name },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: (error: ErrorContext) => {
            onError(error);
          },
        },
      ),
  });
};

export const useAuthHelpers = () => {
  const forgotPassword = useMutation({
    mutationFn: async ({ email }: { email: string }) =>
      await authClient.forgetPassword({ email, redirectTo: "/reset-password" }),
  });

  const sendOtp = useMutation({
    mutationFn: async () => await authClient.twoFactor.sendOtp(),
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ code }: { code: string }) =>
      await authClient.twoFactor.verifyOtp({ code }),
  });

  const resetPassword = useMutation({
    mutationFn: async ({
      newPassword,
      token,
    }: { newPassword: string; token: string }) =>
      await authClient.resetPassword({ newPassword, token }),
  });

  const verifyTwoFactor = useMutation({
    mutationFn: async ({ code }: { code: string }) =>
      await authClient.twoFactor.verifyTotp({ code }),
  });

  return {
    forgotPassword,
    sendOtp,
    verifyOtp,
    resetPassword,
    verifyTwoFactor,
  };
};
