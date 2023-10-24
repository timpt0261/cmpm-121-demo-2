import { currentSetting, notify } from "./Setting";

type ToolTypeName = "draw" | "sticker" | "add";
// Related to buttons
interface Button {
  buttonHtml: HTMLButtonElement;
  type: ToolTypeName;
}
export function createButton(name: string, type: ToolTypeName) {
  const button: Button = {
    buttonHtml: document.createElement("button"),
    type: type,
  };
  button.buttonHtml.innerHTML = name;
  button.buttonHtml.style.marginTop = "5px";
  return button;
}
function setCursor(
  cursor: string,
  lineWidth: number,
  cursorFontSize: string,
  mode: boolean
) {
  currentSetting.currentCursor = mode ? cursor : ".";
  currentSetting.currentLineWidth = lineWidth;
  currentSetting.currentCursorFontSize = cursorFontSize;

  currentSetting.stickerMode = mode;
  notify("drawing-changed");
  notify("tool-moved");
}

const minLineWidth = 1;
const maxLineWidth = 10;

function setEventForDrawButton(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    const name = button.buttonHtml.innerHTML;
    const currentLineWidth = currentSetting.currentLineWidth;
    const newLineWidth = setLineWidth(name, currentLineWidth);
    const newCursorWidth = setCursorWidth(newLineWidth);
    console.log(`Changed Line Width to ${newLineWidth}`);
    console.log(`Changed Cursor Font Size ${newCursorWidth}`);
    setCursor(button.buttonHtml.innerHTML, newLineWidth, newCursorWidth, false);
  });
  return button;
}

function setCursorWidth(width: number): string {
  const m = 7.11;
  const b = 8.89;
  return `${m * width + b}px monospace`;
}

function setLineWidth(name: string, currentLineWidth: number) {
  return name === "thin"
    ? Math.max(minLineWidth, currentLineWidth - minLineWidth)
    : Math.min(maxLineWidth, currentLineWidth + minLineWidth);
}

function setEventforStickerButton(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    setCursor(
      button.buttonHtml.innerHTML,
      minLineWidth,
      "32px monospace",
      true
    );
  });
  return button;
}
function setEventforAddButton(button: Button, sidebar: HTMLElement) {
  button.buttonHtml.addEventListener("click", () => {
    const emoji = window.prompt("Add new button");
    let newButton = createButton(emoji!, "sticker");
    newButton = setEventforStickerButton(newButton);
    sidebar.append(newButton.buttonHtml);
  });
  return button;
}
export function setEventforButtons(button: Button, sidebar: HTMLElement) {
  switch (button.type) {
    case "draw":
      button = setEventForDrawButton(button);
      break;
    case "sticker":
      button = setEventforStickerButton(button);
      break;
    case "add":
      // setting add button to have
      button = setEventforAddButton(button, sidebar);
  }
  return button;
}
