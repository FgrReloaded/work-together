"use client"

import { VideoCallProvider } from "@/providers/video-call-provider"

export default function BoardLayout({ children }: {children: React.ReactNode}){

    return (<VideoCallProvider>{children} </VideoCallProvider>)
}