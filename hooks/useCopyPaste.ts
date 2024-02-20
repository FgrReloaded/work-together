// Create a hook for coping and pasting svg elements

import { useMutation } from '@/liveblocks.config';
import { LayerType } from '@/types/canvas';
import { useState } from 'react';

export const useCopyPaste = () => {

    const copyElement = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0]);
        const type = layer?.get("type");
        let layerType = type as LayerType.Ellipse | LayerType.Rectangle | LayerType.Note | LayerType.Text;
        setMyPresence({ copiedElement: { element: self.presence.selection[0], layerType } }, { addToHistory: true });
    }, []);


    return { copyElement };
};
