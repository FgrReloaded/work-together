"use client"

import { Camera, CanvasState, Color, LayerType, canvasMode, Point, Side, XYWH, Layer } from "@/types/canvas"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"


import { useCanRedo, useCanUndo, useHistory, useSelf, useMutation, useStorage, useOthersMapped } from "@/liveblocks.config"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CursorPresence } from "./cursorPresence"
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils"

import { nanoid } from "nanoid"
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from "./layerPreview"
import { SelectionBox } from "./selectionBox"
import { SelectionTools } from "./selectionTool"
import { Path } from "./path"
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce"
import { useDeleteLayers } from "@/hooks/useDeleteLayers"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useCopyPaste } from "@/hooks/useCopyPaste"

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const layersIds = useStorage((s) => s.layerIds);
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);
    const elementCopied = useSelf((me) => me.presence.copiedElement);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: canvasMode.None,
    })
    const [elementSelected, setElementSelected] = useState<boolean>(false);
    const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

    const { copyElement } = useCopyPaste();

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 249,
        b: 177,
    })

    useDisableScrollBounce();
    const history = useHistory();
    const canRedo = useCanRedo();
    const canUndo = useCanUndo();



    const insertLayer = useMutation(({ storage, setMyPresence },
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Note | LayerType.Text,
        position: Point
    ) => {
        const liveLayers = storage.get("layers");

        if (liveLayers.size >= MAX_LAYERS) {
            return;
        }
        let layer: LiveObject<Layer>;

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        if (layerType === LayerType.Text || layerType === LayerType.Note) {
            layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100,
                width: 100,
                fill: lastUsedColor,
                value: "Text",
            })
        } else {
            layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100,
                width: 100,
                fill: lastUsedColor,
            })
        }

        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setCanvasState({ mode: canvasMode.None });
    }, [lastUsedColor]);

    const handlePaste = useMutation(({ self }) => {
        let copiedElement = self.presence.copiedElement;
        if (copiedElement) {
            insertLayer(copiedElement.layerType, currentPoint!);
        }
    }, [currentPoint]);


    const continueDrawing = useMutation((
        { self, setMyPresence },
        point: Point,
        e: React.PointerEvent,
    ) => {
        const { pencilDraft } = self.presence;

        if (
            canvasState.mode !== canvasMode.Pencil ||
            e.buttons !== 1 ||
            pencilDraft == null
        ) {
            return;
        }

        setMyPresence({
            cursor: point,
            pencilDraft:
                pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                    ? pencilDraft
                    : [...pencilDraft, [point.x, point.y, e.pressure]],
        });
    }, [canvasState.mode]);

    const insertPath = useMutation((
        { storage, self, setMyPresence }
    ) => {
        const liveLayers = storage.get("layers");
        const { pencilDraft } = self.presence;

        if (
            pencilDraft == null ||
            pencilDraft.length < 2 ||
            liveLayers.size >= MAX_LAYERS
        ) {
            setMyPresence({ pencilDraft: null });
            return;
        }

        const id = nanoid();
        liveLayers.set(
            id,
            new LiveObject(penPointsToPathLayer(
                pencilDraft,
                lastUsedColor,
            )),
        );

        const liveLayerIds = storage.get("layerIds");
        liveLayerIds.push(id);

        setMyPresence({ pencilDraft: null });
        setCanvasState({ mode: canvasMode.Pencil });
    }, [lastUsedColor]);

    const startDrawing = useMutation((
        { setMyPresence },
        point: Point,
        pressure: number,
    ) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor,
        })
    }, [lastUsedColor]);

    const resizeSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== canvasMode.Resizing) {
            return;
        }

        const bounce = resizeBounds(canvasState.initialBounds, canvasState.corner, point);

        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0]);

        if (layer) {
            layer.update(bounce);
        }

    }, [canvasState]);

    const translateSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== canvasMode.Translating) {
            return;
        }
        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        }

        const liveLayers = storage.get("layers");

        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id);
            if (layer) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                })
            }

        }

        setCanvasState({ mode: canvasMode.Translating, current: point })

    }, [canvasState]);

    const unselectLayers = useMutation((
        { self, setMyPresence }
    ) => {
        if (self.presence.selection.length > 0) {
            setElementSelected(false)
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const updateSelectionNet = useMutation((
        { storage, setMyPresence },
        current: Point,
        origin: Point,
    ) => {
        const layers = storage.get("layers").toImmutable();

        setCanvasState({
            mode: canvasMode.SelectionNet,
            origin,
            current,
        });

        const ids = findIntersectingLayersWithRectangle(
            layersIds,
            layers,
            origin,
            current,
        );

        setMyPresence({ selection: ids });

    }, [layersIds]);

    const startMultiSelection = useCallback((
        current: Point,
        origin: Point,
    ) => {
        if (
            Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5
        ) {
            setCanvasState({ mode: canvasMode.SelectionNet, origin, current });
        }
    }, []);

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause();
        setCanvasState({ mode: canvasMode.Resizing, corner, initialBounds });
    }, [history])


    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerDown = useCallback((
        e: React.PointerEvent,
    ) => {
        const point = pointerEventToCanvasPoint(e, camera);


        if (canvasState.mode === canvasMode.Inserting) {
            return;
        }

        if (canvasState.mode === canvasMode.Pencil) {
            startDrawing(point, e.pressure);
            return;
        }
        setCanvasState({ origin: point, mode: canvasMode.Pressing });
    }, [camera, canvasState.mode, setCanvasState]);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();
        const current = pointerEventToCanvasPoint(e, camera);
        if (canvasState.mode === canvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        } else if (canvasState.mode === canvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin);
        }
        else if (canvasState.mode === canvasMode.Translating) {
            translateSelectedLayer(current);
        } else if (canvasState.mode === canvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === canvasMode.Pencil) {
            continueDrawing(current, e);
        }

        setMyPresence({ cursor: current })
    }, [continueDrawing,
        camera,
        canvasState,
        resizeSelectedLayer,
        translateSelectedLayer,
        startMultiSelection,
        updateSelectionNet,])

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);


    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (
            canvasState.mode === canvasMode.None ||
            canvasState.mode === canvasMode.Pressing
        ) {
            unselectLayers();
            setCanvasState({
                mode: canvasMode.None,
            })
            setCurrentPoint(point);
        } else if (canvasState.mode === canvasMode.Pencil) {
            insertPath();
        } else if (canvasState.mode === canvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        }
        else {
            setCanvasState({ mode: canvasMode.None });
        }

        history.resume();
    }, [setCanvasState,
        camera,
        canvasState,
        history,
        insertLayer,
        unselectLayers,
        insertPath])


    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {
        if (
            canvasState.mode === canvasMode.Pencil ||
            canvasState.mode === canvasMode.Inserting
        ) {
            return;
        }

        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setElementSelected(true)
            setMyPresence({ selection: [layerId] }, { addToHistory: true });

        }
        setCanvasState({ mode: canvasMode.Translating, current: point });
    },
        [
            setCanvasState,
            camera,
            history,
            canvasState.mode,
        ]);

    const selections = useOthersMapped((other) => other.presence.selection);


    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection;
    }, [selections])

    const deleteLayers = useDeleteLayers();

    const cutElement = () => {
        copyElement();
        deleteLayers();
    }

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            switch (e.key) {
                case "Delete":
                    deleteLayers();
                    break;
                case "z" || "Z": {
                    if (e.ctrlKey || e.metaKey) {
                        history.undo();
                        break;
                    }
                }
                case "y" || "Y": {
                    if (e.ctrlKey || e.metaKey) {
                        history.redo();
                        break;
                    }
                }
                case "c" || "C": {
                    if (e.ctrlKey || e.metaKey) {
                        copyElement();
                        break;
                    }
                }
                case "x" || "X": {
                    if (e.ctrlKey || e.metaKey) {
                        cutElement();
                        break;
                    }
                }
                case "v" || "V": {
                    if (e.ctrlKey || e.metaKey) {
                        handlePaste();
                        break;
                    }
                }
                case "s" || "S": {
                    setCanvasState({ mode: canvasMode.None });
                    break;
                }
                case "t" || "T": {
                    setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Text });
                    break;
                }
                case "n" || "N": {
                    setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Note });
                    break;
                }
                case "r" || "R": {
                    setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Rectangle });
                    break;
                }
                case "e" || "E": {
                    setCanvasState({ mode: canvasMode.Inserting, layerType: LayerType.Ellipse });
                    break;
                }
                case "p" || "P": {
                    setCanvasState({ mode: canvasMode.Pencil });
                    break;
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [deleteLayers, history]);

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info boardId={boardId} />
            <Participants />
            <Toolbar canvasState={canvasState} setCanvasState={setCanvasState} canRedo={canRedo} canUndo={canUndo} undo={history.undo} redo={history.redo} />
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
                lastUsedColor={lastUsedColor}
            />
            <ContextMenu>
                <ContextMenuTrigger>
                    <svg className="h-[100vh] w-[100vw] svgCanvas"
                        onWheel={onWheel}
                        onPointerMove={onPointerMove}
                        onPointerLeave={onPointerLeave}
                        onPointerUp={onPointerUp}
                        onPointerDown={onPointerDown}
                    >
                        <g
                            style={{
                                transform: `translate(${camera.x}px, ${camera.y}px)`
                            }}
                        >
                            {layersIds.map((layerId) => (
                                <LayerPreview key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown} selectionColor={layerIdsToColorSelection[layerId]} />
                            ))}
                            <SelectionBox
                                onResizeHandlePointerDown={onResizeHandlePointerDown}
                            />
                            {canvasState.mode === canvasMode.SelectionNet && canvasState.current != null && (
                                <rect
                                    className="fill-blue-500/5 stroke-blue-500 stroke-1"
                                    x={Math.min(canvasState.origin.x, canvasState.current.x)}
                                    y={Math.min(canvasState.origin.y, canvasState.current.y)}
                                    width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                                    height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                                />
                            )}
                            <CursorPresence />
                            {pencilDraft != null && pencilDraft.length > 0 && (
                                <Path
                                    points={pencilDraft}
                                    fill={colorToCss(lastUsedColor)}
                                    x={0}
                                    y={0}
                                />
                            )}
                        </g>
                    </svg>

                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={copyElement} disabled={!elementSelected}>Copy <ContextMenuShortcut className="w-12 h-6 flex items-center justify-center  bg-blue-200 text-xs rounded-lg">⌘ C</ContextMenuShortcut></ContextMenuItem>
                    <ContextMenuItem onClick={cutElement} disabled={!elementSelected}>Cut <ContextMenuShortcut className="w-12 h-6 flex items-center justify-center  bg-blue-200 text-xs rounded-lg">⌘ X</ContextMenuShortcut></ContextMenuItem>
                    <ContextMenuItem onPointerUp={handlePaste} disabled={elementSelected || elementCopied == null}>Paste <ContextMenuShortcut className="w-12 h-6 flex items-center justify-center  bg-blue-200 text-xs rounded-lg">⌘ V</ContextMenuShortcut></ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </main>
    )
}