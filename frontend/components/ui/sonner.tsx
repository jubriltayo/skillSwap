"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "!border-l-4 !border-l-green-500 !bg-green-50 text-green-900",
          error: "!border-l-4 !border-l-red-500 !bg-red-50 text-red-900",
          warning:
            "!border-l-4 !border-l-yellow-500 !bg-yellow-50 text-yellow-900",
          info: "!border-l-4 !border-l-blue-500 !bg-blue-50 text-blue-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
