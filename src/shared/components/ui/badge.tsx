import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

export type TBadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "red"
  | "amber"
  | "lime"
  | "attended"
  | "finished"
  | "missed"
  | "canceled"
  | "upcoming"
  | "inProgress";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border-transparent",
        red: "border-transparent font-semibold bg-red-200 text-sidebar-primary [a&]:hover:bg-red-300",
        amber:
          "border-transparent font-semibold bg-amber-200 text-sidebar-primary [a&]:hover:bg-amber-300",
        lime: "border-transparent font-semibold bg-lime-200 text-sidebar-primary [a&]:hover:bg-lime-300",
        // Booking status
        attended:
          "bg-green-500/30 dark:bg-green-600/20 text-green-950 border-none",
        finished:
          "bg-green-500/30 dark:bg-green-600/20 text-green-950 border-none",
        missed: "bg-red-500/30 dark:bg-red-600/20 text-red-950 border-none",
        canceled:
          "bg-yellow-500/30 dark:bg-yellow-600/20 text-yellow-950 border-none",
        upcoming:
          "bg-purple-500/30 dark:bg-purple-600/20 text-purple-950 border-none",
        inProgress:
          "bg-purple-500/30 dark:bg-purple-600/20 text-purple-950 border-none",
        client_error:
          "bg-orange-500/30 dark:bg-orange-600/20 text-orange-950 border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
