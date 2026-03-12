import { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface RowProps {
  label?: string;
  value?: string | ReactNode;
  className?: string;
}

export const Row = ({ label, value, className }: RowProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between gap-1.5 text-sm",
        className,
      )}
    >
      {label && <span className="text-muted-foreground">{label}</span>}
      {value && (
        <div className="text-foreground w-1/2 truncate font-medium">
          {value ?? "-"}
        </div>
      )}
    </div>
  );
};
