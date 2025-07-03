import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";
import { PasswordField } from "@/components/form/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslation } from "@/lib/intl/react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The two passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = resetPasswordSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.resetPassword({
          newPassword: value.password,
          token: new URLSearchParams(window.location.search).get("token")!,
        });
        if (res.error) {
          toast.error(res.error.message);
        } else {
          router.navigate({ to: "/login" });
        }
      } catch (error) {
        toast.error("An error occurred during password reset");
      }
    },
  });
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("RESET_PASSWORD")}</CardTitle>
          <CardDescription>{t("RESET_PASSWORD_DESC")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid w-full items-center gap-2">
              <div className="flex flex-col space-y-1.5">
                <form.Field
                  name="password"
                  children={(field) => (
                    <PasswordField field={field} label={t("NEW_PASSWORD")} placeholder={t("PASSWORD")} />
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <form.Field
                  name="confirmPassword"
                  children={(field) => (
                    <PasswordField field={field} label={t("CONFIRM_NEW_PASSWORD")} placeholder={t("PASSWORD")} />
                  )}
                />
              </div>
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button className="mt-4 w-full" type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? t("RESETTING") : t("RESET_PASSWORD_BUTTON")}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
