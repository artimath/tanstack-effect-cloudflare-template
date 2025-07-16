import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/features/admin/admin-users-page";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: AdminUsersPage,
});