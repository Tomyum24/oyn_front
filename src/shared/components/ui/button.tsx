import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

import { Loader2Icon } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        "destructive-outline":
          "border border-destructive bg-background shadow-xs text-destructive hover:bg-accent hover:text-destructive-foreground",
        "destructive-dashed":
          "border border-destructive bg-background shadow-xs text-destructive hover:bg-destructive/10 hover:text-destructive-foreground border-dashed",
        outline:
          "border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "outline-dashed":
          "border border-dashed bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 md:h-9 px-4 py-2 has-[>svg]:px-3",
        xxs: "h-5 md:h-4 rounded gap-1 px-1.5 has-[>svg]:px-1",
        xs: "h-8 md:h-7 rounded-md gap-1.5 px-2 has-[>svg]:px-1.5",
        sm: "h-9 md:h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 md:h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-6 rounded",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      isLoading?: boolean;
      prefixIcon?: React.ReactNode;
      suffixIcon?: React.ReactNode;
    }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      prefixIcon,
      suffixIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        disabled={isLoading || disabled}
      >
        {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
        {!isLoading && prefixIcon}
        {!(isLoading && size === "icon") && props.children}
        {!isLoading && suffixIcon}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
