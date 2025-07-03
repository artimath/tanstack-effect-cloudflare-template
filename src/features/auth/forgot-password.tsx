import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthHelpers } from "@/features/auth/auth-hooks";
import { useTranslation } from "@/lib/intl/react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordForm() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuthHelpers();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = forgotPasswordSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword.mutateAsync({ email: value.email });
        setIsSubmitted(true);
      } catch (err) {
        // Error handling is done via form validation
      }
    },
  });

  if (isSubmitted) {
    return (
      <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{t("CHECK_EMAIL")}</CardTitle>
            <CardDescription>{t("PASSWORD_RESET_LINK_SENT")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{t("CHECK_SPAM")}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("BACK_TO_RESET")}
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("FORGOT_PASSWORD")}</CardTitle>
          <CardDescription>{t("FORGOT_PASSWORD_DESC")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <form.Field
                  name="email"
                  children={(field) => (
                    <FormField field={field} label={t("EMAIL")} type="email" placeholder={t("ENTER_EMAIL")} />
                  )}
                />
              </div>
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button className="mt-4 w-full" type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? t("SENDING") : t("SEND_RESET_LINK")}
                </Button>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login">
            <Button variant="link" className="px-0">
              {t("BACK_TO_SIGN_IN")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
