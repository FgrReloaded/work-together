"use client";

import { EmptyBoards } from "./emptyBoards";
import { EmptyFavorites } from "./emptyFavourite";
import { EmptySearch } from "./emptySearch";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { BoardCard } from "./boardcard";

import { NewBoardButton } from "./newBoardButton";



interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
};

export const BoardList = ({
  orgId,
  query,
}: BoardListProps) => {
  const data = useQuery(api.boardAction.get, {
    orgId, 
    ...query,
  });

  if (data === undefined) {
    return (
      <div>
        <div className="flex gap-x-4 items-center">
        <h2 className="text-3xl">
          {query.favorites ? "Favorite boards" : "Team boards"}
        </h2>
          {!query.favorites &&
            <NewBoardButton orgId={orgId} disabled  />
          }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    )

  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data?.length) {
    return <EmptyBoards />
  }

  return (
    <div>
       <div className="flex gap-x-4 items-center">
        <h2 className="text-3xl">
          {query.favorites ? "Favorite boards" : "Team boards"}
        </h2>
          {!query.favorites &&
            <NewBoardButton orgId={orgId}  />
          }
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5 mt-8 pb-10 ">
        {data?.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorImg={board.authorImg}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorited}
          />
        ))}
      </div>
    </div>
  );
};