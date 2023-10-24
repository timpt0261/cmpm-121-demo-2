export type EventName = "drawing-changed" | "tool-moved";


export const smallLineWidth = 1;
export const largeLineWidth = 10;

interface Setting {
  currentLineWidth: number;
  currentCursorFontSize: string;
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
