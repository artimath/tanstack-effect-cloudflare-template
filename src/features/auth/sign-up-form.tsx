import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslation } from "@/lib/intl/react";
import { convertImageToBase64 } from "@/lib/utils";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
    image: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "The two passwords do not match.",
    path: ["passwordConfirmation"],
  });

export function SignUpForm() {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      image: undefined as File | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const result = signUpSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: `${value.firstName} ${value.lastName}`,
          image: value.image ? await convertImageToBase64(value.image) : "",
          callbackURL: "/dashboard",
          fetchOptions: {
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
            onSuccess: async () => {
              navigate({ to: "/dashboard" });
            },
          },
        });
      } catch (error) {
        toast.error("An error occurred during sign up");
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    form.setFieldValue("image", undefined);
    setImagePreview(null);
  };

  return (
    <Card className="z-50 max-w-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("SIGN_UP")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">{t("SIGN_UP_DESC")}</CardDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <form.Field
                name="firstName"
                children={(field) => <FormField field={field} label={t("FIRST_NAME")} placeholder="Max" className="" />}
              />
            </div>
            <div className="grid gap-2">
              <form.Field
                name="lastName"
                children={(field) => (
                  <FormField field={field} label={t("LAST_NAME")} placeholder="Robinson" className="" />
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <form.Field
              name="email"
              children={(field) => (
                <FormField field={field} label={t("EMAIL")} type="email" placeholder="m@example.com" className="" />
              )}
            />
          </div>
          <div className="grid gap-2">
            <form.Field
              name="password"
              children={(field) => <PasswordField field={field} label={t("PASSWORD")} placeholder={t("PASSWORD")} />}
            />
          </div>
          <div className="grid gap-2">
            <form.Field
              name="passwordConfirmation"
              children={(field) => (
                <PasswordField field={field} label={t("CONFIRM_PASSWORD")} placeholder={t("CONFIRM_PASSWORD")} />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">{t("PROFILE_IMAGE")}</Label>
            <div className="flex items-end gap-4">
              <div className="flex w-full items-center gap-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                {imagePreview && <X className="cursor-pointer" onClick={clearImage} />}
              </div>
            </div>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : t("CREATE_ACCOUNT")}
              </Button>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t py-4">
          <p className="text-center text-neutral-500 text-xs">
            {t("SECURED_BY")} <span className="text-orange-400">better-auth.</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
