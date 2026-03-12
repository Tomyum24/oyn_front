import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { InputGroup, InputGroupInput } from "../../ui/input-group";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: "text" | "number" | "email" | "password" | "date";
  parseAsNumber?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
  addon?: any;
  /** For type="number": use "any" to allow any decimal (e.g. 0.3), or e.g. "0.01" for 2 decimals */
  step?: string | number;
  min?: string | number;
  max?: string | number;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  parseAsNumber = false,
  disabled = false,
  placeholder,
  required = false,
  description,
  className,
  addon,
  step,
  min,
  max,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupInput
                id={field.name}
                type={type}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                {...field}
                step={step}
                min={min}
                max={max}
                onChange={(e) => {
                  const value = e.target.value;
                  if (parseAsNumber) {
                    field.onChange(value === "" ? undefined : Number(value));
                  } else {
                    field.onChange(value);
                  }
                }}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? `${name}-error` : undefined
                }
              />
              {addon}
            </InputGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
