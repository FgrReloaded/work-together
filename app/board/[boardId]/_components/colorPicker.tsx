"use client";

import { Color } from "@/types/canvas";
import { colorToCss, hexToRgb } from "@/lib/utils";

interface ColorPickerProps {
  onChange: (color: Color) => void;
  lastUsedColor: Color;
};

export const ColorPicker = ({
  onChange,lastUsedColor
}: ColorPickerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onChange(hexToRgb(color));
  }
  return (
    <div
      className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200"
    >
      <input type="color" value={colorToCss(lastUsedColor)} name="color" className="w-15 h-full" onChange={handleChange} />
    </div>
  )
};
