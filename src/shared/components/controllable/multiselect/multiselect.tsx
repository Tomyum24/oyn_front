import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Badge } from "@/shared/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { CheckIcon, Loader2, XIcon } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Выберите значения",
  required = false,
  isLoading = false,
  disabled = false,
}: FormMultiSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : [];
        const allSelected = selectedValues.length === options?.length;

        const handleSelect = (value: string) => {
          if (value === "__all__") {
            if (allSelected) {
              field.onChange([]);
            } else {
              field.onChange(options?.map((opt) => opt.value));
            }
            return;
          }

          const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v: string) => v !== value)
            : [...selectedValues, value];
          field.onChange(newValues);
        };

        const handleRemove = (valueToRemove: string) => {
          const newValues = selectedValues.filter(
            (v: string) => v !== valueToRemove,
          );
          field.onChange(newValues);
        };

        const getOptionLabel = (value: string) => {
          return options?.find((opt) => opt.value === value)?.label || value;
        };

        return (
          <FormItem>
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <div className="flex flex-col gap-2">
              <Select
                value=""
                onValueChange={handleSelect}
                disabled={isLoading || disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue placeholder={placeholder} />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <SelectItem value="__all__" hideCheckIcon>
                        {allSelected ? "Снять все" : "Выбрать все"}
                      </SelectItem>
                      {options?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          hideCheckIcon
                          className="relative flex w-full items-center justify-between"
                        >
                          {option.label}
                          {selectedValues.includes(option.value) && (
                            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                              <CheckIcon className="size-4" />
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedValues.map((value: string) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <span className="text-sm">{getOptionLabel(value)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(value)}
                        className="hover:text-destructive rounded-sm transition-colors"
                        disabled={disabled || isLoading}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
