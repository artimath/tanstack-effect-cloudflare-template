import type { AnyFieldApi } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import FormFieldInfo from "@/components/form-field-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
}

export function PasswordField({ field, label, placeholder }: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <div className="relative flex w-full items-center justify-end">
        <Input
          className="mt-1"
          id={field.name}
          name={field.name}
          type={isPasswordVisible ? "text" : "password"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          autoComplete="new-password"
          placeholder={placeholder}
        />
        <Button
          className="absolute mr-2 h-7 w-7 rounded-full"
          type="button"
          tabIndex={-1}
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </div>
      <FormFieldInfo field={field} />
    </>
  );
}
