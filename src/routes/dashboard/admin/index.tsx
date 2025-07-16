import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/features/admin/admin-overview";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminOverview,
});