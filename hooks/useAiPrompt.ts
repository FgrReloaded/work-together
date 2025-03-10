import { useState } from "react";
import { generateCanvasContent } from "@/lib/gemini";
import { nanoid } from "nanoid";
import { LayerType } from "@/types/canvas";
import { useMutation } from "@/liveblocks.config";
import { LiveObject } from "@liveblocks/client";

export function useAiPrompt() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addElementsToCanvas = useMutation(({ storage, setMyPresence }, elements: any[]) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
    const newLayerIds: string[] = [];

    elements.forEach((element) => {
      const layerId = nanoid();
      newLayerIds.push(layerId);

      let layer;

      switch (element.type) {
        case "rectangle":
          layer = new LiveObject({
            type: LayerType.Rectangle,
            x: element.x || 100,
            y: element.y || 100,
            width: element.width || 200,
            height: element.height || 100,
            fill: element.color || { r: 255, g: 249, b: 177 },
          });
          break;

        case "ellipse":
          layer = new LiveObject({
            type: LayerType.Ellipse,
            x: element.x || 100,
            y: element.y || 100,
            width: element.width || 200,
            height: element.height || 100,
            fill: element.color || { r: 255, g: 249, b: 177 },
          });
          break;

        case "text":
          layer = new LiveObject({
            type: LayerType.Text,
            x: element.x || 100,
            y: element.y || 100,
            width: element.width || 200,
            height: element.height || 50,
            fill: element.color || { r: 0, g: 0, b: 0 },
            value: element.content || "Text",
          });
          break;

        case "note":
          layer = new LiveObject({
            type: LayerType.Note,
            x: element.x || 100,
            y: element.y || 100,
            width: element.width || 200,
            height: element.height || 200,
            fill: element.color || { r: 255, g: 242, b: 0 },
            value: element.content || "Note",
          });
          break;
      }

      if (layer) {
        // @ts-ignore
        liveLayers.set(layerId, layer);
        liveLayerIds.push(layerId);
      }
    });

    setMyPresence({ selection: newLayerIds }, { addToHistory: true });
  }, []);

  const generateContent = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateCanvasContent(prompt);
      if (data?.elements && data.elements.length > 0) {
        addElementsToCanvas(data.elements);
      }
    } catch (err) {
      console.error("Error generating content:", err);
      setError(err instanceof Error ? err.message : "Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    isLoading,
    error
  };
}
