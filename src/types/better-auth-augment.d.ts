import type { BetterAuthClient, SessionUser } from "better-auth/react";

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: "pending" | "accepted" | "rejected" | "expired";
  organizationId: string;
  invitedBy: string;
  createdAt: Date;
  expiresAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface BetterAuthApiResponse<T = any> {
  data: T | null;
  error: { message: string; status?: number } | null;
}

export interface BetterAuthErrorContext {
  error: Error;
  message: string;
}

declare module "better-auth/react" {
  interface SessionUser {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role?: string | null;
    twoFactorEnabled?: boolean | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
  }
  interface BetterAuthClient {
    twoFactor: {
      generate: (options?: { userId?: string }) => Promise<BetterAuthApiResponse<{ code: string; backupCodes: string[] }>>;
      verify: (options: { code: string; userId?: string }) => Promise<BetterAuthApiResponse<{ status: "verified" }>>;
      disable: (options?: { userId?: string }) => Promise<BetterAuthApiResponse<{ status: "disabled" }>>;
    };
    passkey: {
      deletePasskey: (options: { id: string }) => Promise<BetterAuthApiResponse<null>>;
    };
    organization: {
      getFullOrganization: (options?: { organizationId?: string }) => Promise<BetterAuthApiResponse<{
        organization: {
          id: string;
          name: string;
          slug?: string;
          createdAt: Date;
          updatedAt: Date;
          members: Array<{
            id: string;
            userId: string;
            role: "member" | "admin" | "owner";
            user: SessionUser;
          }>;
          invitations: OrganizationInvitation[];
        };
      }>>;
      setActive: (options: { organizationId: string | null }) => Promise<BetterAuthApiResponse<{ organizationId: string | null }>>;
      create: (options: { name: string; slug?: string; metadata?: Record<string, any> }) => Promise<BetterAuthApiResponse<{
        organization: {
          id: string;
          name: string;
          slug?: string;
          createdAt: Date;
          updatedAt: Date;
        };
      }>>;
      inviteMember: (options: { email: string; role: "member" | "admin" | "owner"; organizationId?: string }) => Promise<BetterAuthApiResponse<OrganizationInvitation>>;
      removeMember: (options: { memberId: string; organizationId?: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      cancelInvitation: (options: { invitationId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      acceptInvitation: (options: { invitationId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      rejectInvitation: (options: { invitationId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      getInvitation: (options: { invitationId: string }) => Promise<BetterAuthApiResponse<OrganizationInvitation>>;
    };
    admin: {
      listUsers: (options?: { limit?: number; offset?: number; query?: Record<string, any> }) => Promise<BetterAuthApiResponse<SessionUser[]>>;
      createUser: (options: { email: string; name?: string; password?: string; role?: string }) => Promise<BetterAuthApiResponse<SessionUser>>;
      removeUser: (options: { userId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      revokeUserSessions: (options: { userId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      impersonateUser: (options: { userId: string }) => Promise<BetterAuthApiResponse<{ token: string }>>;
      banUser: (options: { userId: string; banReason?: string; banExpires?: Date }) => Promise<BetterAuthApiResponse<{ success: true }>>;
      unbanUser: (options: { userId: string }) => Promise<BetterAuthApiResponse<{ success: true }>>;
    };
  }
}