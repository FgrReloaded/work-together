"use client"

import { Actions } from "@/components/actions"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useRenameModal } from "@/store/useRenameModal"
import { useQuery } from "convex/react"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Export from "./export"


interface InfoProps {
    boardId: string
}

const TabSeparator = () => {
    return (
      <div className="text-neutral-300 px-1.5">
        |
      </div>
    );
  };
  

export const Info = ({boardId}: InfoProps) => {
    const {onOpen} = useRenameModal();
    const data = useQuery(api.boards.get, {id: boardId as Id<"boards">})

    if(!data){
        return <InfoSkeleton />
    }

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            <Hint label="Go to Home" side="bottom" sideOffset={10}>
                <Button asChild variant="board" className="px-2 hover:bg-gray-100">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Board logo"
                            height={40}
                            width={100}
                        />
                     
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Edit title" side="bottom" sideOffset={10}>
                <Button
                    variant="board"
                    className="text-base font-normal px-2 hover:bg-gray-100 hover:text-black"
                    onClick={() => onOpen(data._id, data.title)}
                >
                    {data.title}
                </Button>
            </Hint>
            <TabSeparator />
            <Actions
                id={data._id}
                title={data.title}
                side="bottom"
                sideOffset={10}
                home={false}
            >
                <div>
                    <Hint label="Main menu" side="bottom" sideOffset={10}>
                        <Button size="icon" variant="board">
                            <Menu />
                        </Button>
                    </Hint>
                </div>
            </Actions>
            <TabSeparator />
            <Export boardId={boardId} />
        </div>
    )
}

export const InfoSkeleton = () => {
    return (
      <div 
        className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]"
      />
    );
  };