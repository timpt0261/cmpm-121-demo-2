import { CursorCommand } from "./CursorCommand";
import { LineCommand } from "./LineCommand";
import { createPalette } from "./Palette";
import { bus, currentSetting, notify } from "./Setting";
import "./style.css";

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 256;
const FIRST_ITERATION = 0;
const SINGLE = 1;

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Dibujo";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvasContainer = document.createElement("div");
canvasContainer.style.display = "flex";
canvasContainer.style.flexDirection = "column";
app.append(canvasContainer);

const canvas: HTMLCanvasElement = setUpCanvs();

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let cursorCommand: CursorCommand | null = null;
let currentLineCommand: LineCommand | null = null;

function setUpCanvs() {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  canvas.style.background = "lightgrey";
  canvas.style.boxShadow = "1rem 1rem 1FIRST_ITERATIONpx black";
  canvas.style.borderRadius = "45px";
  canvas.style.border = "3px solid black";
  canvas.style.cursor = "none";
  canvasContainer.append(canvas);
  return canvas;
}

function redraw() {
  ctx.clearRect(FIRST_ITERATION, FIRST_ITERATION, canvas.width, canvas.height);

  commands.forEach((cmd) => cmd.display());

  if (cursorCommand) {
    cursorCommand.draw();
  }
}

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("tool-moved", redraw);

function tick() {
  redraw();
  requestAnimationFrame(tick);
}

tick();

// Create a sidebar for tools
createPalette();

// Set Mouse function
setMouseEventsToCanvas();

setUpButtonsToCanvas();

// Sets up Mouse to Canvas
function setMouseEventsToCanvas() {
  canvas.addEventListener("mouseout", () => {
    onMouseOut();
  });

  canvas.addEventListener("mouseenter", (e: MouseEvent) => {
    onMouseEnter(e);
  });

  canvas.addEventListener("mousemove", (e) => {
    onMouseMove(e);
  });

  canvas.addEventListener("mousedown", (e) => {
    onMouseDown(e);
  });

  canvas.addEventListener("mouseup", () => {
    onMouseUp();
  });
}

function onMouseUp() {
  currentLineCommand = null;
  notify("drawing-changed");
}

function onMouseDown(e: MouseEvent) {
  currentLineCommand = new LineCommand(
    ctx,
    e.offsetX,
    e.offsetY,
    currentSetting.currentLineWidth,
    currentSetting.stickerMode,
    currentSetting.currentCursor,
  );
  console.log(`${currentSetting.currentLineWidth}`);
  commands.push(currentLineCommand);
  redoCommands.splice(FIRST_ITERATION, redoCommands.length);
  notify("drawing-changed");
}

function onMouseMove(e: MouseEvent) {
  cursorCommand = new CursorCommand(
    ctx,
    e.offsetX,
    e.offsetY,
    currentSetting.currentCursorFontSize,
    currentSetting.currentCursor,
  );
  notify("tool-moved");

  if (e.buttons === SINGLE) {
    if (currentLineCommand) {
      currentLineCommand.grow(e.offsetX, e.offsetY);
      notify("drawing-changed");
    }
  }
}

function onMouseEnter(e: MouseEvent) {
  cursorCommand = new CursorCommand(
    ctx,
    e.offsetX,
    e.offsetY,
    currentSetting.currentCursorFontSize,
    currentSetting.currentCursor,
  );
  notify("tool-moved");
}

function onMouseOut() {
  cursorCommand = null;
  notify("tool-moved");
}

// Sets up the Clear, Undo, Redo buttons
function setUpButtonsToCanvas() {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  canvasContainer.append(buttonContainer);

  createClearButton(buttonContainer);
  createUndoRedoButton("Undo", buttonContainer, commands, redoCommands);
  createUndoRedoButton("Redo", buttonContainer, redoCommands, commands);
  createExportButton(buttonContainer);
}

function createClearButton(buttonContainer: HTMLDivElement) {
  const clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  buttonContainer.append(clearButton);
  clearButton.addEventListener("click", clearCommands);
}

function clearCommands() {
  if (canvas && ctx) {
    commands.splice(FIRST_ITERATION, commands.length);
    notify("drawing-changed");
  }
}

function createUndoRedoButton(
  name: string,
  buttonContainer: HTMLDivElement,
  commands: LineCommand[],
  redoCommands: LineCommand[],
) {
  const undoButton = document.createElement("button");
  undoButton.innerHTML = name;
  buttonContainer.append(undoButton);

  undoButton.addEventListener("click", () => {
    if (commands.length) {
      redoCommands.push(commands.pop()!);
      notify("drawing-changed");
    }
  });
}

function createExportButton(buttonContainer: HTMLDivElement) {
  const exportButton = document.createElement("button");
  exportButton.innerHTML = "Export";
  buttonContainer.append(exportButton);
  exportButton.addEventListener("click", exportFeature);
}
function exportFeature() {
  const exportedDimension = 1024;

  const exportCanvas = document.createElement("canvas");

  exportCanvas.width = exportedDimension;
  exportCanvas.height = exportedDimension;

  const exportContext = exportCanvas.getContext("2d");

  // Copy the drawings from the original canvas to the export canvas
  exportContext!.drawImage(
    canvas,
    FIRST_ITERATION,
    FIRST_ITERATION,
    canvas.width,
    canvas.height,
    FIRST_ITERATION,
    FIRST_ITERATION,
    exportCanvas.width,
    exportCanvas.height,
  );

  // Scale the export canvas
  const scale = 4;
  exportContext!.scale(scale, scale);

  // Trigger a file download with the contents of the export canvas as a PNG
  const dataURL = exportCanvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = dataURL;
  anchor.download = "exportedImage.png";
  anchor.click();
}
