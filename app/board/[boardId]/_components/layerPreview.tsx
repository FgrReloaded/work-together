"use client"

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";
import { ContextMenuBox } from "@/components/contextMenu";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string;
}

export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((s) => s.layers.get(id));

    if (!layer) {
        return null;
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <ContextMenuBox>
                    <Rectangle
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                </ContextMenuBox>
            )
        case LayerType.Ellipse:
            return (
                <ContextMenuBox>
                    <Ellipse
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
                </ContextMenuBox>
            )
        case LayerType.Text:
            return (

                <Text
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}

                />
            )
        case LayerType.Note:
            return (
                <Note
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Path:
            return (
                <Path
                    key={id}
                    points={layer.points}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    x={layer.x}
                    y={layer.y}
                    fill={layer.fill ? colorToCss(layer.fill) : "#000"}
                    stroke={selectionColor}
                />
            )
        case LayerType.Emoji:
            return (
                <foreignObject
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    height={layer.height}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    style={{
                        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: `${Math.min(layer.width, layer.height) * 0.7}px`,
                            userSelect: "none",
                        }}
                    >
                        {layer.emoji}
                    </div>
                </foreignObject>
            )
        default:
            return null;
    }
});

LayerPreview.displayName = "LayerPreview";