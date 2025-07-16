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
import { ac, admin as adminRole, superadmin as superAdminRole, user as userRole } from "./permissions";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    twoFactorClient(),
    passkeyClient(),
    adminClient({
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superAdminRole,
      },
    }),
    organizationClient(),
    emailOTPClient(),
    magicLinkClient(),
    multiSessionClient(),
  ],
});

export type AuthClient = ReturnType<typeof createAuthClient>;
