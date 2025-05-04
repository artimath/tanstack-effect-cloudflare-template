import { env } from "@/lib/env.client";
import {
  adminClient,
  emailOTPClient,
  magicLinkClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    passkeyClient(),
    adminClient(),
    organizationClient(),
    emailOTPClient(),
    magicLinkClient(),
  ],
});

export type AuthClient = ReturnType<typeof createAuthClient>;
