"use client";

import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";
import { useTheme } from "./theme-provider";

type ThemeSwitcherProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export const ThemeSwitcher = ({
  children,
  className,
  ...props
}: ThemeSwitcherProps) => {
  if (!props.variant) props.variant = "outline";
  if (!props.size) props.size = "icon";
  const { setTheme, theme } = useTheme();
  console.log(theme);
  return (
    <Button
      {...props}
      className={cn(className, "cursor-pointer mx-2")}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
