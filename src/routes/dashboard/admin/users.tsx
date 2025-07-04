import { createFileRoute } from "@tanstack/react-router";
import { AdminUserList } from "@/features/user/admin-user-list";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage your users, view activity, and configure user permissions</p>
        </div>
        <AdminUserList />
      </div>
    </div>
  );
}
