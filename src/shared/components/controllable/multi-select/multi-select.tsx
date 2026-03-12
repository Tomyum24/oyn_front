import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/shared/components/ui/multi-selector";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
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
  className,
}: FormMultiSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value)
          ? field.value.map((val: string) => {
              const found = options.find((o) => o.value === val);
              return found || { value: val, label: val };
            })
          : [];

        return (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <MultiSelector
                values={value}
                onValuesChange={(vals) => {
                  const onlyValues = vals.map((v) => v.value);
                  field.onChange(onlyValues);
                }}
                className="w-full"
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput
                    disabled={isLoading || disabled}
                    placeholder={placeholder}
                  />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-2">
                        Загрузка...
                      </div>
                    ) : (
                      options.map((option) => (
                        <MultiSelectorItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          disabled={disabled}
                        >
                          {option.label}
                        </MultiSelectorItem>
                      ))
                    )}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
