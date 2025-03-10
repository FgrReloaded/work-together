"use client"
import React from 'react'
import { Canvas } from './_components/canvas'
import { Room } from '@/components/room'
import { Loading } from './_components/canvasLoading'
import VideoChat from '@/components/videoCall'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useVideoCall } from '@/providers/video-call-provider'

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  const { isVideoCallExpanded, isChatExpanded } = useVideoCall();

  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-screen-2xl border"
      >
        <ResizablePanel defaultSize={70}>
          <Canvas boardId={params.boardId} />
        </ResizablePanel>
        {
          (isVideoCallExpanded || isChatExpanded) && (isVideoCallExpanded ?
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={isVideoCallExpanded ? 30 : 0}>
                <VideoChat roomId={params.boardId} video={true} audio={true} />
              </ResizablePanel>
            </> :
            <>
              <ResizableHandle withHandle />
              <ResizablePanel maxSize={30} defaultSize={isChatExpanded ? 30 : 0}>
                <VideoChat roomId={params.boardId} video={false} audio={false} />
              </ResizablePanel>
            </>)
        }
      </ResizablePanelGroup>

    </Room >
  )
}

export default BoardIdPage