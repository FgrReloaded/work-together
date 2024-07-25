"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import {
    LiveKitRoom,
    ControlBar,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
    VideoConference,
    Chat
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { ChatMessage } from './chat';

interface VideoCallProps {
    roomId: string;
    video: boolean;
    audio: boolean;
};

const VideoChat = ({
    roomId,
    video,
    audio
}: VideoCallProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;

        const name = `${user.firstName} ${user.lastName}`;

        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${roomId}&username=${name}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.log(e);
            }
        })()
    }, [user?.firstName, user?.lastName, roomId]);

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }


    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            {
                !(video && audio) ? (
                    <ChatMessage />
                ) :
                    (
                        <>
                            <MyVideoConference />
                            <RoomAudioRenderer />
                            <ControlBar variation='minimal' />
                        </>
                    )
            }

        </LiveKitRoom>
    )
}

export default VideoChat


function MyVideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );
    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}