import React, { createContext, useContext, useState } from 'react';

interface VideoCallContextType {
  isVideoCallExpanded: boolean;
  handleVideo: () => void;
  isChatExpanded: boolean;
  handleChat: () => void;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVideoCallExpanded, setVideoCallExpanded] = useState(false);
  const [isChatExpanded, setChatExpanded] = useState(false);

  const handleChat = () => {
    setChatExpanded(!isChatExpanded);
    setVideoCallExpanded(false);
  }

  const handleVideo = () => {
    setVideoCallExpanded(!isVideoCallExpanded);
    setChatExpanded(false);
  }

  return (
    <VideoCallContext.Provider value={{ isVideoCallExpanded, isChatExpanded, handleChat, handleVideo}}>
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (context === undefined) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};