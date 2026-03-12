import { useEffect, useRef } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/shared/components/ui/command";
import {
  FormControl,
  FormDescription,
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

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

interface ComboboxOption {
  label: string;
  value: string;
}

interface FormMultiComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onSearch?: (value: string) => void;
  maxSelected?: number;
}

export function FormMultiCombobox<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Выберите...",
  description,
  required = false,
  className,
  disabled = false,
  isLoading = false,
  onSearch,
  maxSelected,
}: FormMultiComboboxProps<T>) {
  // Cache to store all selected options with their labels
  const selectedOptionsCache = useRef<Map<string, ComboboxOption>>(new Map());

  // Update cache when new options appear
  useEffect(() => {
    options?.forEach((option) => {
      if (!selectedOptionsCache.current.has(option.value)) {
        selectedOptionsCache.current.set(option.value, option);
      }
    });
  }, [options]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = (field.value as string[]) || [];

        // Get selected options from cache to preserve labels even when options change
        const selectedOptions = selectedValues
          .map((value) => selectedOptionsCache.current.get(value))
          .filter((opt): opt is ComboboxOption => opt !== undefined);

        const handleToggle = (optionValue: string, option: ComboboxOption) => {
          const currentValues = selectedValues || [];
          const isSelected = currentValues.includes(optionValue);

          if (isSelected) {
            // Remove from selection
            field.onChange(currentValues.filter((v) => v !== optionValue));
          } else {
            // Cache the selected option
            selectedOptionsCache.current.set(optionValue, option);
            // Add to selection if not at max limit
            if (!maxSelected || currentValues.length < maxSelected) {
              field.onChange([...currentValues, optionValue]);
            }
          }
        };

        const handleRemove = (optionValue: string) => {
          field.onChange(selectedValues.filter((v) => v !== optionValue));
        };

        return (
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={disabled || isLoading}
                    className={cn(
                      "h-auto min-h-10 w-full justify-between",
                      !selectedValues.length && "text-muted-foreground",
                    )}
                  >
                    <span className="text-muted-foreground">{placeholder}</span>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command className="w-full">
                  <CommandInput
                    placeholder="Поиск..."
                    className="h-9"
                    onValueChange={(value) => {
                      onSearch?.(value);
                    }}
                  />
                  <CommandList>
                    {isLoading && <CommandLoading />}
                    {!isLoading && <CommandEmpty>Не найдено</CommandEmpty>}
                    <CommandGroup>
                      {options?.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value,
                        );
                        const isDisabled =
                          !isSelected &&
                          maxSelected !== undefined &&
                          selectedValues.length >= maxSelected;

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              if (!isDisabled) {
                                handleToggle(option.value, option);
                              }
                            }}
                            disabled={isDisabled}
                            className={cn(
                              isDisabled && "cursor-not-allowed opacity-50",
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <div className="grid grid-cols-2 gap-1">
              {selectedOptions?.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                >
                  {option.label}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
