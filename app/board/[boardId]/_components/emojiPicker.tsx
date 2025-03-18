"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";
import { ToolButton } from "./toolButton";
import { CanvasState, LayerType, canvasMode } from "@/types/canvas";

interface EmojiPickerProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
}

const EMOJI_OPTIONS = [
  "👍", "👎", "👏", "🙌", "👋", "✅", "❌", "❓", "❗",
  "🔥", "⭐", "🚀", "💯", "💡", "📌", "📝", "🧠", "💭",
  "👀", "🎉", "🎯", "⚠️", "🛑", "🔄", "📊", "📈", "📉"
];

export const EmojiPicker = ({ canvasState, setCanvasState }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectEmoji = (emoji: string) => {
    setCanvasState({
      mode: canvasMode.Inserting,
      layerType: LayerType.Emoji,
      emoji: emoji
    });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <ToolButton
            label="Emoji [E]"
            icon={SmilePlus}
            onClick={() => setIsOpen(true)}
            isActive={
              canvasState.mode === canvasMode.Inserting &&
              canvasState.layerType === LayerType.Emoji
            }
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 flex flex-wrap gap-1 justify-center" side="top">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            className="hover:bg-neutral-100 rounded-md p-2 text-xl"
            onClick={() => handleSelectEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
