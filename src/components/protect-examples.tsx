'use client';

import { Code2, CreditCard, Settings, Shield, Trash2, User, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopyButton from './copy-button';
import { Protect, useAuth } from './protect';

/**
 * Code block component for displaying formatted code with copy functionality
 */
const CodeBlock = ({ code, title }: { code: string; title: string }) => (
  <div className="relative">
    <div className="mb-2 flex items-center justify-between">
      <h5 className="font-medium text-muted-foreground text-sm">{title}</h5>
      <CopyButton textToCopy={code} />
    </div>
    <pre className="overflow-x-auto rounded-md border bg-muted p-4 text-sm">
      <code className="text-foreground">{code}</code>
    </pre>
  </div>
);

/**
 * Examples demonstrating how to use the Protect component with better-auth
 *
 * 🎯 IMPORTANT: All permission types (resources and actions) are now DYNAMICALLY
 * derived from your permissions configuration in src/lib/auth/permissions.ts
 *
 * When you add new resources or actions to the `statement` object,
 * the Protect component will automatically support them with full TypeScript type safety!
 *
 * This component showcases various authorization patterns similar to Clerk's Protect component
 *
 * Note: This component has high complexity due to its nature as a comprehensive example showcase.
 * In a real application, you would split this into smaller, focused components.
 */
export function ProtectExamples() {
  const authData = useAuth();
  const { user, isAuthenticated, hasRole, hasPermission, canManageUsers, canDeleteUsers } = authData;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-bold text-4xl">Protect Component Examples</h1>
        </div>
        <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
          Learn how to implement authorization in your React components using the Better Auth Protect component. All
          examples include working demos and copy-ready code snippets.
        </p>
      </div>

      {/* Current User Info */}
      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Status:</strong>{' '}
          {isAuthenticated ? `Signed in as ${user?.email} with role: ` : 'Not signed in '}
          {isAuthenticated && <Badge variant="outline">{user?.role || 'user'}</Badge>}
        </AlertDescription>
      </Alert>

      {/* Authentication Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            1. Authentication Examples
          </CardTitle>
          <CardDescription>Control content based on whether users are signed in or out</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="demo">
              {/* Signed in only content */}
              <div>
                <h4 className="mb-2 font-semibold">Signed In Only</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      Please sign in to view this content.
                    </div>
                  }
                >
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <p className="text-green-800 dark:text-green-200">
                      ✅ Welcome! You are signed in and can see this protected content.
                    </p>
                  </div>
                </Protect>
              </div>

              {/* Signed out only content */}
              <div>
                <h4 className="mb-2 font-semibold">Signed Out Only</h4>
                <Protect
                  condition={({ user: conditionUser }) => !conditionUser}
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">You're already signed in!</div>
                  }
                  requireAuth={false}
                >
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                    <p className="text-blue-800 dark:text-blue-200">👋 Sign in to access more features!</p>
                  </div>
                </Protect>
              </div>
            </TabsContent>

            <TabsContent className="space-y-4" value="code">
              <CodeBlock
                code={`// Show content only to signed-in users
<Protect fallback={<SignInPrompt />}>
  <DashboardContent />
</Protect>`}
                title="Basic Authentication Check"
              />

              <CodeBlock
                code={`// Show content only to signed-out users
<Protect 
  requireAuth={false}
  condition={({ user }) => !user}
  fallback={<AlreadySignedIn />}
>
  <LandingPageCTA />
</Protect>`}
                title="Signed Out Only Content"
              />

              <CodeBlock
                code={`// Custom loading spinner while checking auth
<Protect 
  loading={<CustomSpinner />}
  fallback={<AccessDenied />}
>
  <ProtectedContent />
</Protect>`}
                title="Custom Loading State"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Role-based Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            2. Role-Based Authorization
          </CardTitle>
          <CardDescription>Show content based on user roles (user, admin, superadmin)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="demo">
              {/* Admin only content */}
              <div>
                <h4 className="mb-2 font-semibold">Admin Only Section</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You need admin access to view this section.
                    </div>
                  }
                  userRole="admin"
                >
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                    <p className="text-blue-800 dark:text-blue-200">
                      🔐 Admin Dashboard - You have administrator privileges.
                    </p>
                  </div>
                </Protect>
              </div>

              {/* Superadmin only content */}
              <div>
                <h4 className="mb-2 font-semibold">Superadmin Only Section</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You need superadmin access to view this section.
                    </div>
                  }
                  userRole="superadmin"
                >
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
                    <p className="text-purple-800 dark:text-purple-200">
                      👑 Superadmin Panel - You have full system access.
                    </p>
                  </div>
                </Protect>
              </div>
            </TabsContent>

            <TabsContent className="space-y-4" value="code">
              <CodeBlock
                code={`// Only show to users with 'admin' role
<Protect 
  userRole="admin" 
  fallback={<AccessDenied />}
>
  <AdminDashboard />
</Protect>`}
                title="Admin Only Content"
              />

              <CodeBlock
                code={`// Only show to users with 'superadmin' role
<Protect 
  userRole="superadmin"
  fallback={<InsufficientPermissions />}
>
  <SystemSettings />
</Protect>`}
                title="Superadmin Only Content"
              />

              <CodeBlock
                code={`// Using the useAuth hook for role checking
const { hasRole } = useAuth()

return (
  <div>
    {hasRole('admin') && <AdminPanel />}
    {hasRole('superadmin') && <SuperAdminPanel />}
  </div>
)`}
                title="Multiple Role Check with useAuth"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Permission-based Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            3. Permission-Based Authorization
          </CardTitle>
          <CardDescription>Fine-grained access control using resource and action permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="demo">
              {/* Project management permission */}
              <div>
                <h4 className="mb-2 font-semibold">Project Creation</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You don't have permission to create projects.
                    </div>
                  }
                  permission={{ resource: 'project', action: 'create' }}
                >
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <p className="mb-2 text-green-800 dark:text-green-200">✅ You can create new projects!</p>
                    <Button size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                </Protect>
              </div>

              {/* Billing management permission */}
              <div>
                <h4 className="mb-2 font-semibold">Billing Management</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You don't have permission to manage billing.
                    </div>
                  }
                  permission={{ resource: 'billing', action: 'manage' }}
                >
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                    <p className="mb-2 text-yellow-800 dark:text-yellow-200">
                      💳 You can manage billing and subscriptions!
                    </p>
                    <Button size="sm" variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </Button>
                  </div>
                </Protect>
              </div>

              {/* User deletion permission */}
              <div>
                <h4 className="mb-2 font-semibold">User Deletion (Dangerous)</h4>
                <Protect
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You don't have permission to delete users.
                    </div>
                  }
                  permission={{ resource: 'user', action: 'delete' }}
                >
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <p className="mb-2 text-red-800 dark:text-red-200">⚠️ You can delete users - use with caution!</p>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </Button>
                  </div>
                </Protect>
              </div>
            </TabsContent>

            <TabsContent className="space-y-4" value="code">
              <CodeBlock
                code={`// Check for specific permission
<Protect 
  permission={{ resource: 'project', action: 'create' }}
  fallback={<InsufficientPermissions />}
>
  <CreateProjectButton />
</Protect>`}
                title="Resource-Action Permission Check"
              />

              <CodeBlock
                code={`// Check billing management permission
<Protect 
  permission={{ resource: 'billing', action: 'manage' }}
  fallback={<ContactAdmin />}
>
  <BillingDashboard />
</Protect>`}
                title="Billing Management Permission"
              />

              <CodeBlock
                code={`// Using the useAuth hook for permission checking
const { hasPermission } = useAuth()

const canCreateProject = hasPermission('project', 'create')
const canManageBilling = hasPermission('billing', 'manage')

return (
  <div>
    {canCreateProject && <CreateProjectForm />}
    {canManageBilling && <BillingSettings />}
  </div>
)`}
                title="Using hasPermission Hook"
              />

              <Alert>
                <Code2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dynamic Types:</strong> All resource and action types are automatically derived from your{' '}
                  <code>permissions.ts</code> configuration. Add new permissions there and they'll be available here
                  with full TypeScript support!
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Custom Conditions Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            4. Custom Authorization Logic
          </CardTitle>
          <CardDescription>Complex authorization rules using custom condition functions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="demo">
              {/* Custom condition example */}
              <div>
                <h4 className="mb-2 font-semibold">Custom Business Logic</h4>
                <Protect
                  condition={({ user: conditionUser }) => {
                    // Custom logic: User must be authenticated AND have a role
                    return Boolean(conditionUser && conditionUser.role && conditionUser.role !== 'user');
                  }}
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      You need elevated privileges (admin or superadmin) to access this.
                    </div>
                  }
                >
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950">
                    <p className="text-indigo-800 dark:text-indigo-200">
                      🎯 Custom Logic: You have elevated privileges!
                    </p>
                  </div>
                </Protect>
              </div>

              {/* Another custom condition */}
              <div>
                <h4 className="mb-2 font-semibold">Email Domain Check</h4>
                <Protect
                  condition={({ user: conditionUser }) => {
                    // Custom logic: Check if user email is from specific domain
                    return Boolean(conditionUser?.email?.endsWith('@company.com'));
                  }}
                  fallback={
                    <div className="rounded bg-muted p-3 text-muted-foreground text-sm">
                      This feature is only available to @company.com email addresses.
                    </div>
                  }
                >
                  <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950">
                    <p className="text-cyan-800 dark:text-cyan-200">🏢 Company Feature: Available to internal users!</p>
                  </div>
                </Protect>
              </div>
            </TabsContent>

            <TabsContent className="space-y-4" value="code">
              <CodeBlock
                code={`// Complex authorization logic
<Protect 
  condition={({ user, session }) => {
    // Multiple conditions
    return user?.role === 'admin' && 
           user?.email?.endsWith('@company.com') &&
           session?.user?.verified === true
  }}
  fallback={<AccessDenied />}
>
  <InternalTool />
</Protect>`}
                title="Custom Authorization Function"
              />

              <CodeBlock
                code={`// Combine role and permission checks
<Protect 
  condition={({ user }) => {
    const isAdmin = user?.role === 'admin'
    const hasSpecialAccess = user?.email?.includes('special')
    return isAdmin || hasSpecialAccess
  }}
>
  <SpecialFeature />
</Protect>`}
                title="Combining Multiple Checks"
              />

              <CodeBlock
                code={`// Time-based authorization
<Protect 
  condition={({ user }) => {
    const now = new Date()
    const isBusinessHours = now.getHours() >= 9 && now.getHours() <= 17
    return user?.role === 'admin' || isBusinessHours
  }}
  fallback={<OutsideBusinessHours />}
>
  <BusinessTool />
</Protect>`}
                title="Time-Based Access Control"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Helper Functions Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            5. Helper Functions & useAuth Hook
          </CardTitle>
          <CardDescription>Pre-built permission helpers and the useAuth hook for complex scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="demo">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Your Current Permissions:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={canManageUsers() ? 'default' : 'outline'}>
                        {canManageUsers() ? '✅' : '❌'} Manage Users
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={canDeleteUsers() ? 'default' : 'outline'}>
                        {canDeleteUsers() ? '✅' : '❌'} Delete Users
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasPermission('project', 'create') ? 'default' : 'outline'}>
                        {hasPermission('project', 'create') ? '✅' : '❌'} Create Projects
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasPermission('billing', 'manage') ? 'default' : 'outline'}>
                        {hasPermission('billing', 'manage') ? '✅' : '❌'} Manage Billing
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Role Checks:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={hasRole('user') ? 'default' : 'outline'}>
                        {hasRole('user') ? '✅' : '❌'} User Role
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasRole('admin') ? 'default' : 'outline'}>
                        {hasRole('admin') ? '✅' : '❌'} Admin Role
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasRole('superadmin') ? 'default' : 'outline'}>
                        {hasRole('superadmin') ? '✅' : '❌'} Superadmin Role
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent className="space-y-4" value="code">
              <CodeBlock
                code={`// Import and use the useAuth hook
import { useAuth } from '@/components/protect'

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    hasRole, 
    hasPermission,
    canManageUsers,
    canDeleteUsers 
  } = useAuth()

  return (
    <div>
      {isAuthenticated && <WelcomeMessage user={user} />}
      {hasRole('admin') && <AdminPanel />}
      {hasPermission('project', 'create') && <CreateButton />}
      {canManageUsers() && <UserManagement />}
    </div>
  )
}`}
                title="Using useAuth Hook"
              />

              <CodeBlock
                code={`// Multiple authorization checks
const { hasRole, hasPermission, canManageUsers } = useAuth()

return (
  <div>
    {/* Show different content based on role */}
    {hasRole('user') && <UserDashboard />}
    {hasRole('admin') && <AdminDashboard />}
    {hasRole('superadmin') && <SuperAdminDashboard />}
    
    {/* Permission-based features */}
    {hasPermission('billing', 'read') && <BillingInfo />}
    {hasPermission('billing', 'manage') && <BillingControls />}
    
    {/* Helper function usage */}
    {canManageUsers() && <UserManagementPanel />}
  </div>
)`}
                title="Conditional Rendering"
              />

              <CodeBlock
                code={`// Combining multiple checks
const { user, hasRole, hasPermission } = useAuth()

const canAccessFeature = useMemo(() => {
  return hasRole('admin') || 
         (hasRole('user') && hasPermission('project', 'create')) ||
         user?.email?.endsWith('@company.com')
}, [hasRole, hasPermission, user])

return (
  <div>
    {canAccessFeature && <SpecialFeature />}
  </div>
)`}
                title="Complex Authorization Logic"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Best Practices & Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security:</strong> Always implement server-side authorization checks. Client-side protection is
                for UX only, not security.
              </AlertDescription>
            </Alert>

            <Alert>
              <Code2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Performance:</strong> Use the useAuth hook for multiple checks in the same component to avoid
                redundant authorization calls.
              </AlertDescription>
            </Alert>

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Maintainability:</strong> Keep authorization logic in your permissions.ts file. The Protect
                component will automatically inherit changes.
              </AlertDescription>
            </Alert>

            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                <strong>UX:</strong> Always provide meaningful fallback content to guide users on what they need to
                access protected features.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
