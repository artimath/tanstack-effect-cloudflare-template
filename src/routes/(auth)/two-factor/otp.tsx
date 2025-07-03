import { createFileRoute, Link } from "@tanstack/react-router";
import OtpForm from "@/features/auth/otp";
import { useTranslation } from "@/lib/intl/react";

export const Route = createFileRoute("/(auth)/two-factor/otp")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-2 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-elevated p-4 md:p-8">
        <OtpForm />

        <div className="mt-4 text-center">
          {t("DONT_HAVE_ACCOUNT")}{" "}
          <Link to="/login" className="underline">
            {t("LOGIN")}
          </Link>
          !
        </div>
      </div>
    </div>
  );
}
