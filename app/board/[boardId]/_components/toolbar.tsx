"use client"

import {
    BoxSelect,
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2
} from "lucide-react";

import { ToolButton } from "./toolButton";
import { CanvasState, LayerType, canvasMode } from "@/types/canvas";


interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({ canvasState, setCanvasState, undo, redo, canRedo, canUndo }: ToolbarProps) => {
    return (
        <div className="absolute bottom-0 -translate-y-[50%] -translate-x-[50%]  flex items-center left-1/2 gap-x-4">
            <div className="bg-white rounded-md p-1.5 flex gap-x-1  justify-center shadow-md">
                <ToolButton
                    label="Select [S]"
                    icon={BoxSelect}
                    onClick={() => setCanvasState({ mode: canvasMode.None })}
                    isActive={
                        canvasState.mode === canvasMode.None ||
                        canvasState.mode === canvasMode.Translating ||
                        canvasState.mode === canvasMode.SelectionNet ||
                        canvasState.mode === canvasMode.Pressing ||
                        canvasState.mode === canvasMode.Resizing
                    }
                />
                <ToolButton
                    label="Text [T]"
                    icon={Type}
                    onClick={() => { setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Text }) }}

                    isActive={
                        canvasState.mode === canvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    label="Sticky note [N]"
                    icon={StickyNote}
                    onClick={() => { setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Note }) }}

                    isActive={
                        canvasState.mode === canvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }
                />
                <ToolButton
                    label="Rectangle [R]"
                    icon={Square}
                    onClick={() => { setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Rectangle }) }}

                    isActive={
                        canvasState.mode === canvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle

                    }
                />
                <ToolButton
                    label="Ellipse [E]"
                    icon={Circle}
                    onClick={() => { setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Ellipse }) }}

                    isActive={
                        canvasState.mode === canvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse

                    }

                />
                <ToolButton
                    label="Pen [P]"
                    icon={Pencil}
                    onClick={() => { setCanvasState({ mode: canvasMode.Pencil }) }}

                    isActive={
                        canvasState.mode === canvasMode.Pencil
                    }
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex  shadow-md">
                <ToolButton
                    label="Undo [Ctrl+Z]"
                    icon={Undo2}
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    label="Redo [Ctrl+Y]"
                    icon={Redo2}
                    onClick={redo}
                    isDisabled={!canRedo}
                />
            </div>
        </div>
    )
}

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute bottom-0 -translate-y-[50%] -translate-x-[50%]  flex items-center left-1/2 gap-x-4 bg-white h-[52px] w-[360px] shadow-md rounded-md" />
    );
};