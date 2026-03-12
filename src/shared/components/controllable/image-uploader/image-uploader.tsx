import { ChangeEvent, useRef, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Empty, EmptyContent, EmptyMedia } from "@/shared/components/ui/empty";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { toast } from "sonner";

import { ImageIcon, Loader2, X } from "lucide-react";

export type FormImageUploaderUploadFn = (file: File) => Promise<string | null>;

interface FormImageUploaderProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  /** Called when user selects a file. Should upload and return the image URL, or null on error. */
  onUpload: FormImageUploaderUploadFn;
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Preview aspect ratio, e.g. "1" for square, "16/9" for wide */
  aspectRatio?: string;
  className?: string;
}

export function FormImageUploader<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  onUpload,
  accept = "image/*",
  maxSizeMB = 5,
  aspectRatio = "1",
  className,
}: FormImageUploaderProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = async (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Выберите файл изображения");
      return;
    }

    if (file.size > maxSizeBytes) {
      toast.error(`Файл слишком большой. Максимум: ${maxSizeMB} МБ`);
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        onChange(url);
        toast.success("Изображение загружено");
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClear = (
    onChange: (value: string) => void,
    currentValue: string,
  ) => {
    if (currentValue?.startsWith("blob:")) {
      URL.revokeObjectURL(currentValue);
    }
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              {!value ? (
                <Empty className="border border-dashed">
                  <EmptyContent className="flex flex-col gap-3">
                    <EmptyMedia variant="icon">
                      {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
                    </EmptyMedia>
                    <input
                      ref={inputRef}
                      type="file"
                      accept={accept}
                      className="sr-only"
                      disabled={isUploading}
                      onChange={(e) => handleFileSelect(e, onChange)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => inputRef.current?.click()}
                    >
                      {isUploading ? "Загрузка..." : "Выберите изображение"}
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div
                  className="bg-muted relative mx-auto aspect-square h-54 w-54 overflow-hidden rounded-lg border"
                  style={{ aspectRatio }}
                >
                  <img
                    src={value}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    disabled={isUploading}
                    onClick={() => handleClear(onChange, value)}
                    className="absolute top-2 right-2 rounded-full shadow-sm"
                    aria-label="Удалить изображение"
                  >
                    <X className="size-4" />
                  </Button>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="size-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
