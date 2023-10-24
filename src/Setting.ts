export type EventName = "drawing-changed" | "tool-moved";
export type ToolTypeName = "draw" | "sticker" | "add";

export const smallLineWidth = 4;
export const largeLineWidth = 10;

export type FontSize = "32px monospace" | "64px monospace";

interface Setting {
  currentLineWidth: number;
  currentCursorFontSize: FontSize;
  currentCursor: string;
  stickerMode: boolean;
}
export const currentSetting: Setting = {
  currentLineWidth: smallLineWidth,
  currentCursorFontSize: "32px monospace",
  currentCursor: ".",
  stickerMode: false,
};

export const bus = new EventTarget();
export function notify(name: EventName) {
  bus.dispatchEvent(new Event(name));
}
