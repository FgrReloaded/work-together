"use client";

import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { ArrowRightSquare, Copy, MoreHorizontal, MoreVertical, Pencil, Star, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";
import { UserAvatar } from "@/components/userAvatar";
import { cn } from "@/lib/utils";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  authorImg?: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
};

export const BoardCard = ({
  id,
  title,
  authorId,
  authorName,
  authorImg,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const {
    mutate: onFavorite,
    pending: pendingFavorite,
  } = useApiMutation(api.boards.favorite);

  const {
    mutate: onUnfavorite,
    pending: pendingUnfavorite,
  } = useApiMutation(api.boards.unfavorite);

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id })
        .catch(() => toast.error("Failed to unfavorite"))
    } else {
      onFavorite({ id, orgId })
        .catch(() => toast.error("Failed to favorite"))
    }
  };

  return (

    <div className="w-full aspect-[100/110] p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="relative px-4 py-2 font-extrabold text-2xl bg-blue-100 rounded-xl">
            <Image
              src={imageUrl}
              alt={title}
              width={30}
              height={30}
              className="object-fit"
            />
          </span>
          <div className="flex flex-col">
            <span className="ml-2 font-bold text-black text-md dark:text-white">
              {title}
            </span>
            {/* <span className="ml-2 text-sm text-gray-500 dark:text-white">
                Todo: Type of board
            </span> */}
          </div>
        </div>
        <div className="flex items-center relative">
          <button className={cn("p-1 border border-gray-200 rounded-full", (pendingFavorite || pendingUnfavorite) && "cursor-not-allowed opacity-75")} onClick={toggleFavorite} disabled={pendingFavorite || pendingUnfavorite}>
            <Star
              className={cn(
                "h-4 w-4",
                isFavorite && "fill-yellow-500 text-yellow-500"
              )}
            />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 space-x-12">
        <span className="flex items-center px-2 py-1 text-xs font-semibold text-green-700 rounded-md bg-green-50">
          BOARD
        </span>
        <Link href={`/board/${id}`} className="flex items-center px-4 py-2 text-xs font-semibold text-[#f7a752] bg-white border border-[#FDBA74] rounded-md hover:text-white hover:bg-[#FDBA74] transition-all">
          Open <ArrowRightSquare className="w-4 h-4 ml-1" />
        </Link>
      </div>
      <div className="block m-auto">
        <div>
                <Actions home={true} id={id} title={title}   />
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-start my-4 space-x-4 ">
        <span className="flex items-center gap-x-2 px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-200 rounded-md">
          Author: <UserAvatar borderColor="border-gray-200" name={authorLabel} src={authorImg} fallback={authorName[0]} />
        </span>
      </div>
      <span className="flex items-center px-2 py-1 mt-4 text-xs font-semibold text-yellow-200-500 bg-yellow-100 rounded-md w-full">
        Created at : {createdAtLabel}
      </span>
    </div>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};