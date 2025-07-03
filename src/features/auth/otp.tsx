import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthHelpers } from "@/features/auth/auth-hooks";
import { useTranslation } from "@/lib/intl/react";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
});

export default function Component() {
  const { t } = useTranslation();
  const { sendOtp, verifyOtp } = useAuthHelpers();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const router = useRouter();

  // In a real app, this email would come from your authentication context
  const userEmail = "user@example.com";

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = otpSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await verifyOtp.mutateAsync({
          code: value.otp,
        });
        if (res.data) {
          setMessage(t("OTP_VALIDATED"));
          setIsError(false);
          setIsValidated(true);
          router.navigate({ to: "/" });
        } else {
          setIsError(true);
          setMessage(t("INVALID_OTP"));
        }
      } catch (error) {
        setIsError(true);
        setMessage(t("INVALID_OTP"));
      }
    },
  });

  const requestOTP = async () => {
    await sendOtp.mutateAsync();
    setMessage(t("OTP_SENT"));
    setIsError(false);
    setIsOtpSent(true);
  };
  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("TWO_FACTOR_AUTH")}</CardTitle>
          <CardDescription>{t("VERIFY_IDENTITY")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {!isOtpSent ? (
              <Button onClick={requestOTP} className="w-full">
                <Mail className="mr-2 h-4 w-4" /> {t("SEND_OTP_EMAIL")}
              </Button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="flex flex-col space-y-1.5">
                  <span className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t("ONE_TIME_PASSWORD")}
                  </span>
                  <span className="py-2 text-muted-foreground text-sm">
                    {t("CHECK_EMAIL_OTP")} {userEmail}
                  </span>
                  <form.Field
                    name="otp"
                    children={(field) => (
                      <FormField field={field} label="" type="text" placeholder={t("ENTER_6_DIGIT")} />
                    )}
                  />
                </div>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="mt-4 w-full" disabled={!canSubmit || isSubmitting || isValidated}>
                      {t("VALIDATE_OTP")}
                    </Button>
                  )}
                />
              </form>
            )}
          </div>
          {message && (
            <div className={`mt-4 flex items-center gap-2 ${isError ? "text-red-500" : "text-primary"}`}>
              {isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <p className="text-sm">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
