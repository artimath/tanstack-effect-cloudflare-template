import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OrganizationCard } from "@/features/organization/organization-card";
import AdminDashboard from "@/features/user/admin";
import UserCard from "@/features/user/user-card";
import { useSessions } from "@/features/user/user-hooks";
import { useTranslation } from "@/lib/intl/react";

export const Route = createFileRoute("/dashboard/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useSessions();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive text-sm">Error loading settings</p>
          <p className="text-muted-foreground text-xs">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">{t("SETTINGS")}</h1>
        <p className="text-muted-foreground">Manage your account, organization, and security settings</p>
      </div>

      <Separator />

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-semibold text-xl">{t("ORGANIZATION")}</h2>
            <p className="text-muted-foreground text-sm">Manage your organization settings and member access</p>
          </div>
          <OrganizationCard session={data?.session?.data || null} activeOrganization={data?.organization?.data} />
        </section>

        <Separator />

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-semibold text-xl">Account</h2>
            <p className="text-muted-foreground text-sm">
              Manage your personal account settings and security preferences
            </p>
          </div>
          <UserCard activeSessions={data?.sessions?.data || []} />
        </section>

        {/* Only show admin section if user has admin role */}
        {data?.session?.data?.user?.role === "admin" && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-semibold text-xl">{t("ADMIN_DASHBOARD")}</h2>
                <p className="text-muted-foreground text-sm">Administrative tools and user management (admin only)</p>
              </div>
              <AdminDashboard />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
