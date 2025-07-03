import {
  adminClient,
  emailOTPClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env.client";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    twoFactorClient(),
    passkeyClient(),
    adminClient(),
    organizationClient(),
    emailOTPClient(),
    magicLinkClient(),
    multiSessionClient(),
  ],
});

export type AuthClient = ReturnType<typeof createAuthClient>;
