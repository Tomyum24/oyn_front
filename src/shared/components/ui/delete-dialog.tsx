import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import { AlertTriangleIcon } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  confirmMessage?: string;
  description?: string;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  confirmMessage = "Вы уверены?",
  description = "Это действие нельзя отменить.",
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="w-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangleIcon className="!size-10 text-red-500" />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {confirmMessage}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full items-center justify-center">
          <AlertDialogCancel className="w-full flex-1">
            Нет, назад
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-full flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            Да, удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
