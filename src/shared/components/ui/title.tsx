/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { Skeleton } from "./skeleton";

interface WrapperProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

function Wrapper({ children, className, isLoading }: WrapperProps) {
  if (isLoading) {
    return <Skeleton className="h-8 w-64" />;
  }
  return (
    <div
      className={cn(
        "bg-muted border-border w-full rounded-md border p-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TitleProps {
  children: ReactNode;
  className?: string;
}

function Title({ children, className }: TitleProps) {
  return <div className={cn("text-xl font-medium", className)}>{children}</div>;
}

interface DescriptionProps {
  children: ReactNode;
  className?: string;
}

function Description({ children, className }: DescriptionProps) {
  return (
    <div className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </div>
  );
}

export const PageTitle = {
  Wrapper,
  Title,
  Description,
};
