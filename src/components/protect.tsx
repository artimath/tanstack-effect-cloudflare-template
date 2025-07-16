'use client';

import React from 'react';
import { useSession } from '@/features/auth/auth-hooks';
// Import the statement type to get dynamic resource and action types
import {
  canBanUsers,
  canCreateUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canManageBilling,
  canManageOrganizations,
  canManageUsers,
  canSetUserRoles,
  hasPermission,
  statement,
  type UserRole,
} from '@/lib/auth/permissions';

// Dynamic types derived from your actual permissions configuration
type ResourceType = keyof typeof statement;
type ActionType = (typeof statement)[keyof typeof statement][number];

// Session type based on better-auth
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  image?: string | null;
}

export interface BetterAuthSession {
  user?: SessionUser;
}

// Types for authorization checks
export interface AuthorizationContext {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  session: BetterAuthSession | null;
}

export interface HasParams {
  userRole?: UserRole;
  permission?: {
    resource: ResourceType;
    action: ActionType;
  };
}

export type ConditionFunction = (context: AuthorizationContext) => boolean;

export interface ProtectProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;

  // Authentication props
  requireAuth?: boolean;

  // Authorization props
  userRole?: UserRole;
  permission?: {
    resource: ResourceType;
    action: ActionType;
  };

  // Custom condition function for complex logic
  condition?: ConditionFunction;

  // Loading state
  loading?: React.ReactNode;
}

// Helper function to create authorization context
function createAuthContext(session: BetterAuthSession | null): AuthorizationContext {
  const user = session?.user || null;

  return {
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role || 'user') as UserRole,
        }
      : null,
    session,
  };
}

// Helper function to check permission-based authorization
function checkPermissionAuthorization(
  user: SessionUser | null,
  permission: {
    resource: ResourceType;
    action: ActionType;
  }
): boolean {
  if (!user) {
    return false;
  }

  const userRole = (user.role || 'user') as UserRole;
  return hasPermission(userRole, permission.resource, permission.action);
}

/**
 * Protect component for better-auth
 *
 * Similar to Clerk's Protect component, this component protects content based on:
 * - Authentication: whether the user is signed in
 * - Authorization: whether the user has the required role, permission, or meets custom conditions
 *
 * @example
 * // Basic authentication check
 * <Protect fallback={<SignInPrompt />}>
 *   <DashboardContent />
 * </Protect>
 *
 * @example
 * // Role-based authorization
 * <Protect userRole="admin" fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </Protect>
 *
 * @example
 * // Permission-based authorization
 * <Protect
 *   permission={{ resource: 'project', action: 'create' }}
 *   fallback={<p>You need project creation permissions</p>}
 * >
 *   <CreateProjectButton />
 * </Protect>
 *
 * @example
 * // Custom condition
 * <Protect
 *   condition={(ctx) => ctx.user?.role === 'admin' || ctx.user?.role === 'superadmin'}
 *   fallback={<AccessDenied />}
 * >
 *   <AdvancedSettings />
 * </Protect>
 */
export function Protect({
  children,
  fallback = null,
  requireAuth = true,
  userRole,
  permission,
  condition,
  loading = <div>Loading...</div>,
}: ProtectProps) {
  const { data: session, isPending } = useSession();

  // Show loading state while checking authentication
  if (isPending) {
    return <>{loading}</>;
  }

  // Get user from session
  const user = session?.user || null;

  // Check authentication if required
  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // Check role-based authorization
  if (userRole && (!user || user.role !== userRole)) {
    return <>{fallback}</>;
  }

  // Check permission-based authorization
  if (permission && !checkPermissionAuthorization(user, permission)) {
    return <>{fallback}</>;
  }

  // Check custom condition
  if (condition) {
    const authContext = createAuthContext(session || null);
    if (!condition(authContext)) {
      return <>{fallback}</>;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Helper hook for programmatic authorization checks
 *
 * @example
 * const { isAuthenticated, hasRole, hasPermission, checkCondition } = useAuth()
 *
 * if (hasRole('admin')) {
 *   // Show admin content
 * }
 */
export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user || null;

  const isAuthenticated = !!user;

  const checkRole = (requiredRole: UserRole): boolean => {
    if (!user) {
      return false;
    }
    return user.role === requiredRole;
  };

  const checkPermissionHelper = (
    sessionUser: SessionUser | null,
    permissionCheck: {
      resource: ResourceType;
      action: ActionType;
    }
  ): boolean => {
    if (!sessionUser?.role) {
      return false;
    }

    const userRole = sessionUser.role as UserRole;
    return hasPermission(userRole, permissionCheck.resource, permissionCheck.action);
  };

  const checkCondition = (condition: ConditionFunction): boolean => {
    const authContext = createAuthContext(session || null);
    return condition(authContext);
  };

  // Helper functions using our permission system
  const canManageUsersCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canManageUsers((user.role || 'user') as UserRole);
  };

  const canBanUsersCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canBanUsers((user.role || 'user') as UserRole);
  };

  const canDeleteUsersCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canDeleteUsers((user.role || 'user') as UserRole);
  };

  const canImpersonateUsersCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canImpersonateUsers((user.role || 'user') as UserRole);
  };

  const canSetUserRolesCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canSetUserRoles((user.role || 'user') as UserRole);
  };

  const canCreateUsersCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canCreateUsers((user.role || 'user') as UserRole);
  };

  const canManageOrganizationsCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canManageOrganizations((user.role || 'user') as UserRole);
  };

  const canManageBillingCheck = (): boolean => {
    if (!user) {
      return false;
    }
    return canManageBilling((user.role || 'user') as UserRole);
  };

  return {
    isLoading: isPending,
    isAuthenticated,
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role || 'user') as UserRole,
        }
      : null,
    session,

    // Core authorization functions
    hasRole: checkRole,
    hasPermission: (resource: ResourceType, action: ActionType) => checkPermissionHelper(user, { resource, action }),
    checkCondition,

    // Convenience permission functions
    canManageUsers: canManageUsersCheck,
    canBanUsers: canBanUsersCheck,
    canDeleteUsers: canDeleteUsersCheck,
    canImpersonateUsers: canImpersonateUsersCheck,
    canSetUserRoles: canSetUserRolesCheck,
    canCreateUsers: canCreateUsersCheck,
    canManageOrganizations: canManageOrganizationsCheck,
    canManageBilling: canManageBillingCheck,
  };
}
