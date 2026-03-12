import { useRef, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { Upload, X } from "lucide-react";

interface FormFileUploaderProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function FormFileUploader<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Выберите файл",
  required = false,
  description,
  className,
  accept = "image/*",
  maxSize = 10,
}: FormFileUploaderProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSize) {
        alert(`Файл слишком большой. Максимальный размер: ${maxSize}MB`);
        return;
      }

      setFileName(file.name);
      onChange(file);
    } else {
      setFileName("");
      onChange(null);
    }
  };

  const handleClearFile = (onChange: (file: File | null) => void) => {
    setFileName("");
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex min-w-0 flex-col gap-2">
              <input
                id={field.name}
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(e, onChange)}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  fieldState.error ? `${name}-error` : undefined
                }
                className="hidden"
              />
              <div className="flex min-w-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <Upload className="mr-2 h-4 w-4 shrink-0" />
                  <span className="block truncate">
                    {fileName || placeholder}
                  </span>
                </Button>
                {fileName && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleClearFile(onChange)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {fileName && (
                <div className="text-muted-foreground overflow-hidden text-sm break-words">
                  Выбранный файл:{" "}
                  <span className="font-medium">{fileName}</span>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
