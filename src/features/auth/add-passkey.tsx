import { useForm } from "@tanstack/react-form";
import { Fingerprint, Loader2, Plus } from "lucide-react";
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
import { authClient } from "@/lib/auth/auth-client";

const addPasskeySchema = z.object({
  passkeyName: z.string().min(1, "Passkey name is required"),
});

export function AddPasskey() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      passkeyName: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = addPasskeySchema.safeParse(value);
        if (!result.success) {
          return result.error.formErrors.fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.passkey.addPasskey({
          name: value.passkeyName,
        });
        if (res?.error) {
          toast.error(res?.error.message);
        } else {
          setIsOpen(false);
          form.reset();
          toast.success("Passkey added successfully. You can now use it to login.");
        }
      } catch (error) {
        toast.error("An error occurred while adding passkey");
      }
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-xs md:text-sm">
          <Plus size={15} />
          {t("ADD_NEW_PASSKEY")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("ADD_NEW_PASSKEY")}</DialogTitle>
          <DialogDescription>{t("ADD_PASSKEY_DESC")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <form.Field
            name="passkeyName"
            children={(field) => <FormField field={field} label={t("PASSKEY_NAME")} type="text" />}
          />
        </div>
        <DialogFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="w-full"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    {t("CREATE_PASSKEY")}
                  </>
                )}
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
