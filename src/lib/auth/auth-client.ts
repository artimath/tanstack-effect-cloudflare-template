import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { InferAuth } from "better-auth/client";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env.client";
import { ac, admin as adminRole, superadmin as superAdminRole, user as userRole } from "./permissions";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
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
  $InferAuth: InferAuth<typeof auth>(),
});

export type AuthClient = typeof authClient;
export type Session = AuthClient["$Infer"]["Session"];
export type SessionUser = Session["user"];
export type Organization = AuthClient["$Infer"]["Organization"];
export type ActiveOrganization = AuthClient["$Infer"]["ActiveOrganization"];
