import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslation } from "@/lib/intl/react";

const twoFactorSchema = z.object({
  totpCode: z
    .string()
    .length(6, "TOTP code must be exactly 6 digits")
    .regex(/^\d+$/, "TOTP code must contain only digits"),
});

export default function Component() {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      totpCode: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = twoFactorSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.twoFactor.verifyTotp({
          code: value.totpCode,
        });
        if (res.data?.token) {
          setSuccess(true);
        }
      } catch (error) {
        // Error handling is done via form validation
      }
    },
  });

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("TOTP_VERIFICATION")}</CardTitle>
          <CardDescription>{t("ENTER_TOTP")}</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="space-y-2">
                <form.Field
                  name="totpCode"
                  children={(field) => (
                    <FormField
                      field={field}
                      label={t("TOTP_CODE")}
                      type="text"
                      placeholder={t("ENTER_6_DIGIT_CODE")}
                      className="mt-1"
                    />
                  )}
                />
              </div>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="mt-4 w-full" disabled={!canSubmit || isSubmitting}>
                    {t("VERIFY")}
                  </Button>
                )}
              />
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-semibold text-lg">{t("VERIFICATION_SUCCESSFUL")}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2 text-muted-foreground text-sm">
          <Link to="/two-factor/otp">
            <Button variant="link" size="sm">
              {t("SWITCH_EMAIL_VERIFICATION")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
