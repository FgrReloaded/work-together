import type {
    MessageDecoder,
    MessageEncoder,
    WidgetState,
} from '@livekit/components-core';
import { isWeb, log } from '@livekit/components-core';
import * as React from 'react';
import {
    ConnectionStateToast,
    LayoutContextProvider,
    MessageFormatter,
    Chat,
    useCreateLayoutContext,
} from '@livekit/components-react';


export interface VideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
    chatMessageFormatter?: MessageFormatter;
    chatMessageEncoder?: MessageEncoder;
    chatMessageDecoder?: MessageDecoder;
    SettingsComponent?: React.ComponentType;
}

export function ChatMessage({
    chatMessageFormatter,
    chatMessageDecoder,
    chatMessageEncoder,
    SettingsComponent,
    ...props
}: VideoConferenceProps) {
    const [widgetState, setWidgetState] = React.useState<WidgetState>({
        showChat: true,
        unreadMessages: 0,
        showSettings: true,
    });


    const widgetUpdate = (state: WidgetState) => {
        log.debug('updating widget state', state);
        setWidgetState(state);
    };

    const layoutContext = useCreateLayoutContext();

    return (
        <div className="lk-video-conference"  {...props}>
            {isWeb() && (
                <LayoutContextProvider
                    value={layoutContext}
                    onWidgetChange={widgetUpdate}
                >
                    <Chat
                        messageFormatter={chatMessageFormatter}
                        messageEncoder={chatMessageEncoder}
                        messageDecoder={chatMessageDecoder}
                    />
                </LayoutContextProvider>
            )}
            <ConnectionStateToast />
        </div>
    );
}
