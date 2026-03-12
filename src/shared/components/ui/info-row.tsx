import { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { Skeleton } from "./skeleton";

interface InfoRowProps {
  label: string;
  value: ReactNode;
  valueRightIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

function BaseInfoRow({
  label,
  value,
  valueRightIcon,
  className,
  onClick,
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col justify-between text-sm md:flex-row",
        className,
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "font-medium",
            value === "-" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {value}
        </span>
        {valueRightIcon && <span>{valueRightIcon}</span>}
      </div>
    </div>
  );
}

function InfoRowSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export const InfoRow = {
  Root: BaseInfoRow,
  Skeleton: InfoRowSkeleton,
};
