"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  header: string;
  description?: string;
};

export const ConfirmModal = ({
  children,
  onConfirm,
  disabled,
  header,
  description,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {header}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#ff8200] rounded-lg hover:bg-[#ff8400ca] flex items-center justify-center py-1 px-3"
            disabled={disabled}
            onClick={handleConfirm}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};