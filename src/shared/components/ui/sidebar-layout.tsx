import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

import { cn } from "@/shared/lib/utils";

import { Badge } from "./badge";
import { Spinner } from "./spinner";

interface ISidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SidebarLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarLayoutWrapper({
  children,
  className,
}: SidebarLayoutWrapperProps) {
  return (
    <div
      className={cn(
        "border-input relative flex h-full w-full flex-col border-t pt-4 xl:flex-row",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface SidebarLayoutSidebarProps {
  sidebarItems: ISidebarItem[];
  onSelect: (section: string) => void;
  defaultSection: string;
}

export function SidebarLayoutSidebar({
  sidebarItems,
  onSelect,
  defaultSection,
}: SidebarLayoutSidebarProps) {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const activeSection = useMemo(
    () => searchParams.get("section") || defaultSection,
    [searchParams, defaultSection],
  );

  const handleSelect = (section: string) => {
    const newParams = new URLSearchParams();
    newParams.set("section", section);
    onSelect(section);
    navigate(`?${newParams.toString()}`);
  };

  return (
    <>
      <aside className="border-border hidden w-64 shrink-0 border-r bg-white pr-4 xl:block">
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start pl-2 text-left font-medium",
                activeSection === item.href
                  ? "bg-neutral-100"
                  : "hover:bg-neutral-100",
              )}
              onClick={() => handleSelect(item.href)}
            >
              {item.icon}
              {item.label}
              {item?.count && (
                <Badge
                  variant="outline"
                  className="ml-auto h-fit w-fit rounded-full"
                >
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>
      </aside>

      <div className="w-full xl:hidden">
        <Label htmlFor="mobile-nav" className="sr-only">
          Раздел
        </Label>
        <Select
          value={activeSection}
          onValueChange={(value) => handleSelect(value)}
        >
          <SelectTrigger id="mobile-nav" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sidebarItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Separator className="my-4" />
      </div>
    </>
  );
}

interface SidebarLayoutContentProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function SidebarLayoutContent({
  children,
  className,
  isLoading,
}: SidebarLayoutContentProps) {
  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className={cn("h-full w-full flex-1 xl:pl-4", className)}>
      {children}
    </main>
  );
}

export function SidebarLayoutEmpty({
  message = "Ошибка загрузки данных",
}: {
  message?: string;
}) {
  return <div>{message}</div>;
}

export const SidebarLayout = {
  Wrapper: SidebarLayoutWrapper,
  Sidebar: SidebarLayoutSidebar,
  Content: SidebarLayoutContent,
  Empty: SidebarLayoutEmpty,
};
