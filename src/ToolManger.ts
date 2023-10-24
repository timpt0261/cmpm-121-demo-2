import {
  FontSize,
  ToolTypeName,
  currentSetting,
  largeLineWidth,
  notify,
  smallLineWidth,
} from "./Setting";
const smallCursorFontSize: FontSize = "32px monospace";
const largeCursorFontSize: FontSize = "64px monospace";

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
  cursorFontSize: FontSize,
  mode: boolean,
) {
  currentSetting.currentCursor = mode ? cursor : ".";
  currentSetting.currentLineWidth = lineWidth;
  currentSetting.currentCursorFontSize = cursorFontSize;

  currentSetting.stickerMode = mode;
  notify("drawing-changed");
  notify("tool-moved");
}
function setEventForDrawButton(button: Button) {
  if (button.buttonHtml.innerHTML === "thin") {
    button.buttonHtml.addEventListener("click", () => {
      setCursor(
        button.buttonHtml.innerHTML,
        smallLineWidth,
        smallCursorFontSize,
        false,
      );
    });
  } else {
    button.buttonHtml.addEventListener("click", () => {
      setCursor(
        button.buttonHtml.innerHTML,
        largeLineWidth,
        largeCursorFontSize,
        false,
      );
    });
  }
  return button;
}
function setEventforStickerButton(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    setCursor(
      button.buttonHtml.innerHTML,
      smallLineWidth,
      smallCursorFontSize,
      true,
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
