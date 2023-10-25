import { currentSetting, notify } from "./Setting";

type ToolTypeName =
  | "draw"
  | "sticker"
  | "add"
  | "choose-color"
  | "random-color";

const minLineWidth = 1;
const maxLineWidth = 10;
interface Button {
  buttonHtml: HTMLButtonElement;
  type: ToolTypeName;
}

// const DEFAULT = 0;
export function createButton(name: string, type: ToolTypeName) {
  const button: Button = {
    buttonHtml: document.createElement("button"),
    type: type,
  };
  button.buttonHtml.innerHTML = name;
  button.buttonHtml.style.marginTop = "5px";
  button.buttonHtml.onmouseenter = () => {
    button.buttonHtml.style.border = "1px dashed white";
  };
  button.buttonHtml.onmouseleave = () => {
    button.buttonHtml.style.border = "none";
  };

  return button;
}

const min = 200;
const max = 1000;

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function setButtonRoundess(button: Button) {
  button.buttonHtml.style.borderRadius = `${getRandomNumber(min, max)}% 
                                          ${getRandomNumber(min, max)}% 
                                          ${getRandomNumber(min, max)}% 
                                          ${getRandomNumber(min, max)}%`;
  return button;
}

// Function to position buttons in a circular formation
export function positionButtonsInCircle(buttons: Button[], radius: number) {
  const totalButtons = buttons.length;
  const two = 2;
  const angleStep = (two * Math.PI) / totalButtons;

  buttons.forEach((button, index) => {
    const angle = angleStep * index;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    button.buttonHtml.style.position = "absolute";
    button.buttonHtml.style.left = `calc(40% + ${x}px)`;
    button.buttonHtml.style.top = `calc(40% + ${y}px)`;
  });
}

function setCursor(
  cursor: string,
  lineWidth: number,
  color: string,
  cursorFontSize: string,
  mode: boolean
) {
  currentSetting.currentCursor = mode ? cursor : ".";
  currentSetting.currentColor = color;
  currentSetting.currentLineWidth = lineWidth;
  currentSetting.currentCursorFontSize = cursorFontSize;
  currentSetting.stickerMode = mode;
  notify("drawing-changed");
  notify("tool-moved");
}

export function setEventforButtons(
  button: Button,
  sidebar: HTMLElement,
  buttonsArray?: Button[]
) {
  switch (button.type) {
    case "draw":
      button = setEventForDrawButton(button);
      break;
    case "sticker":
      button = setEventforStickerButton(button);
      break;
    case "add":
      // setting add button to have
      button = setEventforAddButton(button, sidebar, buttonsArray!);
      break;
    case "choose-color":
      button = setEventforChoosingColor(button);
      break;
    case "random-color":
      button = setEventforRandomColor(button);
      break;
  }
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

function setEventForDrawButton(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    const name = button.buttonHtml.innerHTML;
    const currentLineWidth = currentSetting.currentLineWidth;
    const newLineWidth = setLineWidth(name, currentLineWidth);
    const newCursorWidth = setCursorWidth(newLineWidth);
    const newColor = currentSetting.currentColor;
    setCursor(
      button.buttonHtml.innerHTML,
      newLineWidth,
      newColor,
      newCursorWidth,
      false
    );
  });
  return button;
}

function setEventforStickerButton(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    setCursor(
      button.buttonHtml.innerHTML,
      minLineWidth,
      "black",
      "20px monospace",
      true
    );
  });
  return button;
}
function setEventforAddButton(
  button: Button,
  sidebar: HTMLElement,
  buttonsArray: Button[]
) {
  button.buttonHtml.addEventListener("click", () => {
    const emoji = window.prompt("Add new button");
    let newButton = createButton(emoji!, "sticker");
    newButton = setEventforStickerButton(newButton);
    sidebar.append(newButton.buttonHtml);
    buttonsArray.push(newButton);
    notify("change-palette");
  });
  return button;
}
function setEventforChoosingColor(button: Button): Button {
  button.buttonHtml.addEventListener("click", () => {
    const newColor = window.prompt("Choose a color");
    setCursor(
      currentSetting.currentCursor, // Reuse the current cursor
      currentSetting.currentLineWidth,
      newColor!,
      currentSetting.currentCursorFontSize,
      false
    );
  });
  return button;
}

function setEventforRandomColor(button: Button) {
  button.buttonHtml.addEventListener("click", () => {
    const newColor = setRandomColor();
    setCursor(
      currentSetting.currentCursor, // Reuse the current cursor
      currentSetting.currentLineWidth,
      newColor,
      currentSetting.currentCursorFontSize,
      false
    );
  });
  return button;
}

const minColor = 0;
const maxColor = 255;
function setRandomColor(): string {
  return `rgb(${Math.floor(getRandomNumber(minColor, maxColor))}, 
              ${Math.floor(getRandomNumber(minColor, maxColor))},
              ${Math.floor(getRandomNumber(minColor, maxColor))})`;
}
