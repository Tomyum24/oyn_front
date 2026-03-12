import * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/shared/lib/utils";

import { CheckIcon, MinusIcon } from "lucide-react";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean;
  }
>(({ className, indeterminate, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      {...props}
      className={cn(
        "peer focus-visible:ring-ring data-[state=checked]:text-violet-500-foreground h-4 w-4 shrink-0 rounded border border-violet-500 shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-violet-500 data-[state=indeterminate]:bg-violet-500 data-[state=indeterminate]:text-white",
        className,
      )}
      checked={indeterminate ? "indeterminate" : props.checked}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none">
        {indeterminate ? (
          <MinusIcon className="size-3.5 text-white" />
        ) : (
          <CheckIcon className="size-3.5 text-white" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
