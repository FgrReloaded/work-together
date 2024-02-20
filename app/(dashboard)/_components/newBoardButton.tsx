"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
};

export const NewBoardButton = ({
  orgId,
  disabled,
}: NewBoardButtonProps) => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.boards.create);

  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled"
    })
      .then((id) => {
        toast.success("Board created");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  }

  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        " bg-[#ff8200] rounded-lg hover:bg-[#ff8400ca] flex items-center justify-center py-1 px-3",
        (pending || disabled) && "opacity-75 hover:bg-[#ff8200] cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="h-8 w-8 text-white stroke-1" />
      <p className="text-sm text-white font-light">
        New board
      </p>
    </button>
  );
};