import { Control, FieldPath, FieldValues } from "react-hook-form";

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

import { Spinner } from "../../ui/spinner";

export interface SelectOption {
  labelImg?: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  emptyText?: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Выберите значение",
  required = false,
  isLoading = false,
  disabled = false,
  emptyText = "Нет значений",
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isLoading || disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Загрузка...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Spinner />
                </div>
              ) : options?.length > 0 ? (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.labelImg && (
                      <img
                        src={option.labelImg}
                        alt={option.label}
                        className="h-5 w-5"
                      />
                    )}
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  {emptyText}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
