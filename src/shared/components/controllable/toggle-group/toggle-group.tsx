import { Control, FieldPath, FieldValues } from "react-hook-form";

import { type VariantProps } from "class-variance-authority";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { toggleVariants } from "@/shared/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

interface FormToggleGroupProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "value" | "onValueChange" | "defaultValue"
> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
  spacing?: number;
  children: React.ReactNode;
  className?: string;
}

export function FormToggleGroup<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  description,
  disabled = false,
  variant,
  size,
  spacing,
  children,
  className,
  ...props
}: FormToggleGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <ToggleGroup
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              variant={variant}
              size={size}
              spacing={spacing}
              {...props}
            >
              {children}
            </ToggleGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { ToggleGroupItem };
