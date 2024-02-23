"use client";

import { toast } from "sonner";
import { Copy, Edit, Trash2 } from "lucide-react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ConfirmModal } from "./confirmModal";
import { useRenameModal } from "@/store/useRenameModal";
import { Hint } from "./hint";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ActionsProps {
  children?: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
  home?: boolean;
};

export const Actions = ({
  id,
  title,
  home,
}: ActionsProps) => {
  const navigation = useRouter();
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.boards.remove);

  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/board/${id}`,
    )
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"))
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => { toast.success("Board deleted"); navigation.push("/") })
      .catch(() => toast.error("Failed to delete board"));
  };
  return (
    <div className="flex items-center justify-start my-4 rounded-md p-2 gap-x-2 ">
      <Hint label="Copy link" side="top" sideOffset={10} align="end" >
        <span onClick={onCopyLink} className={cn("flex items-center px-2 py-1 text-xs font-semibold text-green-500 rounded-md bg-green-50 cursor-pointer", !home && "text-black bg-transparent hover:bg-gray-100")}>
          <Copy />
        </span>
      </Hint>
      {
        home &&
        <Hint label="Rename" side="top" sideOffset={10} align="end" >
          <span onClick={() => onOpen(id, title)} className="flex items-center px-2 py-1 text-xs font-semibold text-green-500 rounded-md bg-green-50 cursor-pointer">
            <Edit />
          </span>
        </Hint>
      }
      <Hint label="Delete" side="top" sideOffset={10} align="end" >
        <span className="flex items-center px-2 py-1 text-xs font-semibold text-green-500 rounded-md cursor-pointer">
          <ConfirmModal
            header="Delete board?"
            description="This will delete the board and all of its contents."
            disabled={pending}
            onConfirm={onDelete}
          >
            <span className={cn("flex items-center px-2 py-1 text-xs font-semibold text-green-500 rounded-md bg-green-50 cursor-pointer", !home && "text-black bg-transparent hover:bg-gray-100")}>
              <Trash2 />
            </span>
          </ConfirmModal>
        </span>
      </Hint>
    </div>
  )



};

