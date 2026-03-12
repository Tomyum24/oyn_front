import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils";

export function FieldError({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  if (!children) {
    return null;
  }

  return (
    <p className={cn("text-destructive text-sm", className)} {...props}>
      {children}
    </p>
  );
}
