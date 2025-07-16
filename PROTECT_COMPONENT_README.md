# Better Auth Protect Component

A powerful authorization component for Better Auth that provides declarative access control similar to Clerk's `<Protect>` component. This component enables you to conditionally render content based on user authentication status, roles, permissions, and custom authorization logic.

## 🎯 Key Feature: Dynamic Type Safety

**All permission types (resources and actions) are automatically derived from your permissions configuration!**

When you modify the `statement` object in `src/lib/auth/permissions.ts`, the Protect component immediately supports the new permissions with full TypeScript type safety. No hardcoded types means no maintenance overhead.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Comparison with Clerk](#comparison-with-clerk)
- [Best Practices](#best-practices)

## Installation

The Protect component is already included in your project. Simply import it from the components directory:

```tsx
import { Protect, useAuth } from '@/components/protect';
```

## Basic Usage

### Authentication Check

The most basic use case is to protect content behind authentication:

```tsx
import { Protect } from '@/components/protect';

function Dashboard() {
  return (
    <Protect fallback={<SignInPrompt />}>
      <DashboardContent />
    </Protect>
  );
}
```

### Role-based Authorization

Protect content based on user roles:

```tsx
<Protect userRole="admin" fallback={<AccessDenied />}>
  <AdminPanel />
</Protect>
```

### Permission-based Authorization

Use fine-grained permissions for more flexible access control:

```tsx
<Protect
  permission={{ resource: 'project', action: 'create' }}
  fallback={<p>You need project creation permissions</p>}
>
  <CreateProjectButton />
</Protect>
```

### Custom Conditions

For complex authorization logic, use the condition prop:

```tsx
<Protect
  condition={(ctx) => {
    return ctx.user?.role === 'admin' || ctx.user?.role === 'superadmin';
  }}
  fallback={<AccessDenied />}
>
  <AdvancedSettings />
</Protect>
```

## API Reference

### Protect Component Props

| Prop          | Type                | Default                 | Description                                              |
| ------------- | ------------------- | ----------------------- | -------------------------------------------------------- |
| `children`    | `React.ReactNode`   | -                       | Content to render when authorized                        |
| `fallback`    | `React.ReactNode`   | `null`                  | Content to render when unauthorized                      |
| `requireAuth` | `boolean`           | `true`                  | Whether authentication is required                       |
| `userRole`    | `UserRole`          | -                       | Required user role (`'user'`, `'admin'`, `'superadmin'`) |
| `permission`  | `PermissionObject`  | -                       | Required permission object                               |
| `condition`   | `ConditionFunction` | -                       | Custom authorization function                            |
| `loading`     | `React.ReactNode`   | `<div>Loading...</div>` | Loading state component                                  |

### Permission Object

```tsx
{
  resource: 'project' | 'billing' | 'user' | 'session';
  action: 'create' | 'read' | 'update' | 'delete' | 'share' | 'manage';
}
```

### Condition Function

```tsx
type ConditionFunction = (context: AuthorizationContext) => boolean;

interface AuthorizationContext {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  session: BetterAuthSession | null;
}
```

### useAuth Hook

The `useAuth` hook provides programmatic access to authorization checks:

```tsx
const {
  isLoading,
  isAuthenticated,
  user,
  session,
  hasRole,
  hasPermission,
  checkCondition,
  canManageUsers,
  canBanUsers,
  canDeleteUsers,
  // ... other permission helpers
} = useAuth();
```

## Examples

### Navigation Menu with Role-based Items

```tsx
function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>

      <Protect userRole="admin">
        <Link href="/admin">Admin Panel</Link>
      </Protect>

      <Protect userRole="superadmin">
        <Link href="/system">System Settings</Link>
      </Protect>
    </nav>
  );
}
```

### Conditional Buttons

```tsx
function UserActions({ userId }: { userId: string }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline">View Profile</Button>

      <Protect
        permission={{ resource: 'user', action: 'update' }}
        fallback={<Button disabled>Edit (No Permission)</Button>}
      >
        <Button>Edit User</Button>
      </Protect>

      <Protect userRole="admin">
        <Button variant="destructive">Ban User</Button>
      </Protect>
    </div>
  );
}
```

### Complex Business Logic

```tsx
function ProjectSettings({ project }: { project: Project }) {
  return (
    <Protect
      condition={(ctx) => {
        // User must be admin OR project owner
        return ctx.user?.role === 'admin' || project.ownerId === ctx.user?.id;
      }}
      fallback={<AccessDenied />}
    >
      <ProjectSettingsForm project={project} />
    </Protect>
  );
}
```

### Using the useAuth Hook

```tsx
function UserDashboard() {
  const { user, hasRole, canManageUsers, canDeleteUsers } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      {hasRole('admin') && <AdminQuickActions />}

      {canManageUsers() && <UserManagementWidget />}

      {canDeleteUsers() && <DangerZone />}
    </div>
  );
}
```

### Custom Loading States

```tsx
<Protect
  loading={
    <div className="flex items-center justify-center p-8">
      <Spinner />
      <span>Checking permissions...</span>
    </div>
  }
  fallback={<AccessDenied />}
>
  <ProtectedContent />
</Protect>
```

## Comparison with Clerk

This Better Auth Protect component provides similar functionality to Clerk's `<Protect>` component with some key differences:

### Similarities

- ✅ Declarative authorization
- ✅ Role-based access control
- ✅ Permission-based access control
- ✅ Custom condition functions
- ✅ Fallback UI for unauthorized users
- ✅ Loading states
- ✅ TypeScript support

### Differences

| Feature              | Better Auth                    | Clerk                   |
| -------------------- | ------------------------------ | ----------------------- |
| Prop names           | `userRole`                     | `role`                  |
| Permission format    | `{ resource, action }`         | String format           |
| Custom roles         | Configurable in permissions.ts | Dashboard configuration |
| Organization support | Custom implementation          | Built-in                |
| Billing/Plans        | Custom implementation          | Built-in                |

### Migration from Clerk

If migrating from Clerk, the main changes needed are:

```tsx
// Clerk
<Protect role="org:admin" fallback={<AccessDenied />}>

// Better Auth
<Protect userRole="admin" fallback={<AccessDenied />}>
```

```tsx
// Clerk
<Protect permission="org:projects:create" fallback={<AccessDenied />}>

// Better Auth
<Protect
  permission={{ resource: 'project', action: 'create' }}
  fallback={<AccessDenied />}
>
```

## Best Practices

### 1. Use Permission-based over Role-based Authorization

```tsx
// ❌ Less flexible
<Protect userRole="admin">

// ✅ More flexible
<Protect permission={{ resource: 'user', action: 'manage' }}>
```

### 2. Provide Meaningful Fallback UI

```tsx
// ❌ Generic fallback
<Protect fallback={<div>Access denied</div>}>

// ✅ Specific and helpful
<Protect fallback={
  <div className="text-center p-4">
    <Shield className="h-8 w-8 mx-auto mb-2" />
    <p>You need admin permissions to manage users.</p>
    <Button onClick={requestAccess}>Request Access</Button>
  </div>
}>
```

### 3. Handle Loading States

```tsx
<Protect loading={<LoadingSkeleton />} fallback={<AccessDenied />}>
  <ExpensiveComponent />
</Protect>
```

### 4. Use useAuth for Imperative Checks

```tsx
function UserTable() {
  const { canDeleteUsers } = useAuth();

  return (
    <Table>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>
            {canDeleteUsers() && <DeleteButton userId={user.id} />}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

### 5. Combine with Server-side Checks

Remember that the Protect component only provides client-side protection. Always implement server-side authorization checks as well:

```tsx
// Client-side protection
<Protect permission={{ resource: 'user', action: 'delete' }}>
  <DeleteUserButton userId={userId} />
</Protect>;

// Server-side protection (in your API)
export async function deleteUser(userId: string) {
  const { user } = await getSession();
  if (!canDeleteUsers(user.role)) {
    throw new Error('Insufficient permissions');
  }
  // Proceed with deletion
}
```

## Security Considerations

⚠️ **Important**: The Protect component only provides **visual protection** on the client-side. The content is still accessible in the browser's source code. For truly sensitive data:

1. Always implement server-side authorization
2. Don't rely solely on client-side protection
3. Fetch sensitive data only after authorization checks
4. Use the component primarily for UX improvements

## Contributing

To extend the Protect component with new features:

1. Update the `permissions.ts` file for new roles or permissions
2. Modify the `ProtectProps` interface for new props
3. Add helper functions to the `useAuth` hook
4. Update this documentation with examples

## Troubleshooting

### Common Issues

1. **"User is null" errors**: Ensure the component is wrapped in an authentication provider
2. **Permissions not working**: Check that user roles are correctly assigned in your database
3. **TypeScript errors**: Ensure you're using the correct `UserRole` type from `permissions.ts`

### Debug Mode

Use the browser's React DevTools to inspect the component state and verify authorization context.

## Dynamic Permission System

### How It Works

The Protect component automatically derives its TypeScript types from your Better Auth permissions configuration:

```typescript
// In src/lib/auth/permissions.ts
export const statement = {
  ...defaultStatements, // Built-in: 'user', 'session'
  project: ['create', 'read', 'update', 'delete', 'share'],
  billing: ['read', 'update', 'manage'],
  // Add more resources here...
} as const;
```

The Protect component automatically knows about:

- **Resources**: `'user' | 'session' | 'project' | 'billing'`
- **Actions**: `'create' | 'read' | 'update' | 'delete' | 'share' | 'manage'`

### Adding New Permissions

To add new permissions, simply update your `statement` object:

```typescript
// Add new resources and actions
export const statement = {
  ...defaultStatements,
  project: ['create', 'read', 'update', 'delete', 'share'],
  billing: ['read', 'update', 'manage'],
  analytics: ['view', 'export', 'admin'], // ← New resource
  settings: ['read', 'update'], // ← New resource
} as const;
```

The Protect component immediately supports these new permissions:

```tsx
// TypeScript will autocomplete and validate these new permissions!
<Protect permission={{ resource: 'analytics', action: 'export' }}>
  <ExportButton />
</Protect>

<Protect permission={{ resource: 'settings', action: 'update' }}>
  <SettingsForm />
</Protect>
```

### Benefits

✅ **No maintenance overhead** - Add permissions once, use everywhere  
✅ **Full TypeScript safety** - Invalid permissions caught at compile time  
✅ **Automatic IntelliSense** - IDE autocomplete for all valid permissions  
✅ **Future-proof** - Component evolves with your permission system
