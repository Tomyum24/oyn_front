import { Control, Controller, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";

import { cn } from "@/shared/lib/utils";

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  required = false,
  className,
}: FormSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm",
            className,
          )}
        >
          <div className="space-y-0.5">
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
