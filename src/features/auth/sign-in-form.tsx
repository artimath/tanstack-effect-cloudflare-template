import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Key, Loader2 } from "lucide-react";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "@/features/auth/auth-hooks";
import { useTranslation } from "@/lib/intl/react";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function SignInForm() {
  const { t } = useTranslation();
  const { loginWithCredentials, loginWithPasskey, loginWithSocial } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onChange: ({ value }) => {
        const result = signInSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      loginWithCredentials.mutate({
        email: value.email,
        password: value.password,
        rememberMe: value.rememberMe || false,
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("SIGN_IN")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">{t("SIGN_IN_DESC")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* Display login errors */}
          {loginWithCredentials.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginWithCredentials.error.message || "Login failed. Please check your credentials and try again."}
              </AlertDescription>
            </Alert>
          )}

          {loginWithPasskey.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginWithPasskey.error.message || "Passkey authentication failed. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {loginWithSocial.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginWithSocial.error.message || "Social login failed. Please try again."}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <form.Field
              name="email"
              children={(field) => (
                <FormField field={field} label={t("EMAIL")} type="email" placeholder="m@example.com" />
              )}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <span className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t("PASSWORD")}
              </span>
              <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                {t("FORGOT_YOUR_PASSWORD")}
              </Link>
            </div>
            <form.Field
              name="password"
              children={(field) => <PasswordField field={field} label="" placeholder="password" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <form.Field
              name="rememberMe"
              children={(field) => (
                <>
                  <Checkbox
                    id="remember"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("REMEMBER_ME")}
                  </label>
                </>
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || loginWithCredentials.isPending}>
                {loginWithCredentials.isPending ? <Loader2 size={16} className="animate-spin" /> : t("LOGIN")}
              </Button>
            )}
          />
        </form>

        <div className="mt-4 grid gap-4">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={async () => {
              loginWithPasskey.mutate();
            }}
          >
            <Key size={16} />
            {t("SIGN_IN_WITH_PASSKEY")}
            {loginWithPasskey.isPending && <Loader2 size={16} className="animate-spin" />}
          </Button>

          <div className={cn("flex w-full items-center gap-2", "flex-col justify-between")}>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              onClick={() => {
                loginWithSocial.mutate({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                <title>Google</title>
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              {t("SIGN_IN_WITH_GOOGLE")}
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              onClick={async () => {
                loginWithSocial.mutate({
                  provider: "github",
                  callbackURL: "/dashboard",
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <title>GitHub</title>
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                />
              </svg>
              {t("SIGN_IN_WITH_GITHUB")}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-neutral-500 text-xs">
            {t("POWERED_BY")}{" "}
            <a href="https://better-auth.com" className="underline" target="_blank" rel="noopener noreferrer">
              <span className="dark:text-orange-200/90">better-auth.</span>
            </a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
