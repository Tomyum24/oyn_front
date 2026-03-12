import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

import { Loader2 } from "lucide-react";

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: RadioOption[];
  required?: boolean;
  description?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
  description,
  disabled = false,
  isLoading = false,
  className,
  orientation = "vertical",
}: FormRadioGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {isLoading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Загрузка...
                </span>
              </div>
            ) : (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
                className={
                  orientation === "horizontal" ? "flex flex-row gap-4" : ""
                }
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${name}-${option.value}`}
                    />
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
