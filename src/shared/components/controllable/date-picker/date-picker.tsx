import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { cn } from "@/shared/lib/utils";

import { CalendarIcon } from "lucide-react";

// dayjs to ru dates: swap dayjs for date-fns/format and ru locale
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Выберите дату",
  required = false,
  minDate = new Date("1900-01-01"),
  maxDate = new Date("2100-01-01"),
  className,
}: FormDatePickerProps<T>) {
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const parseDate = (value: any): Date | undefined => {
    if (isValidDate(value)) return value;
    if (typeof value === "string") {
      const parsed = new Date(value);
      return isValidDate(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const dateValue = parseDate(field.value);

        return (
          <FormItem className={cn("flex flex-col", className)}>
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger type="button">
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dateValue && "text-muted-foreground",
                      className,
                    )}
                    type="button"
                  >
                    {dateValue
                      ? format(dateValue, "dd.MM.yyyy", { locale: ru })
                      : placeholder}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={field.onChange}
                  captionLayout="dropdown"
                  startMonth={minDate}
                  endMonth={maxDate}
                  disabled={(date) => date < minDate || date > maxDate}
                  defaultMonth={dateValue}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
