import * as React from "react";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/shared/lib/utils";

interface SwitchProps extends React.ComponentProps<
  typeof SwitchPrimitive.Root
> {
  isLoading?: boolean;
}

function Switch({ className, isLoading = false, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 data-[state=unchecked]:bg-input inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-violet-500",
        isLoading && "cursor-not-allowed opacity-70",
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          isLoading && "animate-pulse",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
