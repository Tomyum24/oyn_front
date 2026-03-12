import * as React from "react";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/shared/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  isLoading,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  isLoading?: boolean;
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full",
        isLoading && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  isLoading,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  isLoading?: boolean;
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        isLoading && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
