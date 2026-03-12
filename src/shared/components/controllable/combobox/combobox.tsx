import { Control, FieldPath, FieldValues } from "react-hook-form";

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

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

interface ComboboxOption {
  label: string;
  value: string;
}

interface FormComboboxProps<T extends FieldValues> {
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
  currentValue?: string;
}

export function FormCombobox<T extends FieldValues>({
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
  currentValue,
}: FormComboboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = options.find((opt) => opt.value === field.value);
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
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {selected?.label ? (
                      selected.label
                    ) : (
                      <div className="text-muted-foreground">
                        {currentValue ?? placeholder}
                      </div>
                    )}
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
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            field.onChange(option.value);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
