import * as React from "react";

import { cn } from "@/shared/lib/utils";

import { Skeleton } from "./skeleton";

interface ITableProps extends React.HTMLAttributes<HTMLTableElement> {
  isLoading?: boolean;
  skeletonRows?: number;
  skeletonCols?: number;
  // When true, the table will not horizontally overflow its container.
  // Applies table-fixed layout and hides horizontal overflow on the wrapper.
  preventHorizontalOverflow?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, ITableProps>(
  (
    {
      className,
      isLoading = false,
      skeletonRows = 10,
      skeletonCols = 5,
      children,
      preventHorizontalOverflow = false,
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        "relative max-h-[calc(100vh-200px)] w-full rounded-md border",
        preventHorizontalOverflow
          ? "overflow-x-hidden overflow-y-auto"
          : "overflow-auto",
      )}
      style={{ background: "#fff" }} // Ensure scrolling area is white for sticky header contrast
    >
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          preventHorizontalOverflow && "table-fixed",
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: skeletonCols }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          children
        )}
      </table>
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const hasChildren = React.Children.count(children) > 0;

  if (!hasChildren) {
    return (
      <tbody ref={ref} className={className} {...props}>
        <tr>
          <td colSpan={1000} className="text-muted-foreground h-12 text-center">
            Нет данных :(
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b font-medium transition-colors",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "bg-muted text-muted-foreground h-10 border-b px-2 text-left align-middle font-medium",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "h-12 p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
