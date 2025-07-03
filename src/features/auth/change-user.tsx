import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Edit, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { FormField } from "@/components/form/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/features/auth/auth-hooks";
import { authClient } from "@/lib/auth/auth-client";
import { convertImageToBase64 } from "@/lib/utils";

const changeUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.instanceof(File).optional(),
});

export function ChangeUser() {
  const { t } = useTranslation();
  const { data } = useSession();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      name: "",
      image: undefined as File | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const result = changeUserSchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.updateUser({
          image: value.image ? await convertImageToBase64(value.image) : undefined,
          name: value.name ? value.name : undefined,
          fetchOptions: {
            onSuccess: () => {
              toast.success("User updated successfully");
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        });
        form.reset();
        router.invalidate();
        setImagePreview(null);
        setOpen(false);
      } catch (error) {
        toast.error("An error occurred while updating user");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2" variant="secondary">
          <Edit size={13} />
          {t("EDIT_USER")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("EDIT_USER")}</DialogTitle>
          <DialogDescription>{t("EDIT_USER_DESC")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <form.Field
            name="name"
            children={(field) => (
              <FormField field={field} label={t("FULL_NAME")} type="text" placeholder={data?.user.name} />
            )}
          />
          <div className="grid gap-2">
            <Label htmlFor="image">{t("PROFILE_IMAGE")}</Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                  <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex w-full items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-muted-foreground"
                />
                {imagePreview && <X className="cursor-pointer" onClick={clearImage} />}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : t("UPDATE")}
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
