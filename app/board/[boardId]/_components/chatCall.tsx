"use client"
import { Hint } from '@/components/hint';
import { useVideoCall } from '@/providers/video-call-provider';
import { Video, VideoOff, MessageSquare, MessageSquareOff } from 'lucide-react';



export const ChatCalls = () => {
    const { isVideoCallExpanded, handleVideo, handleChat, isChatExpanded } = useVideoCall();

    return (
        <div className="absolute top-16 right-2 bg-white p-2 rounded-md flex items-center shadow-md">
            <div className="flex justify-center flex-col">
                <Hint label="Start Video Call" side="left" sideOffset={10} align="center" >
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={handleVideo}>
                        {isVideoCallExpanded ? <VideoOff size={25} /> : <Video size={25} />}
                    </div>
                </Hint>
                <Hint label="Open Chat" side="left" sideOffset={10} align="center" >
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={handleChat}>
                        {isChatExpanded ? <MessageSquareOff size={25} /> : <MessageSquare size={25} />}
                    </div>
                </Hint>
            </div>
        </div>
    )
}
