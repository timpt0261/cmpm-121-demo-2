import { CursorCommand } from "./CursorCommand";
import { LineCommand } from "./LineCommand";
import "./style.css";

("use strict");

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

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = "lightgrey";
canvas.style.boxShadow = "1rem 1rem 10px black";
canvas.style.borderRadius = "45px";
canvas.style.border = "3px solid black";
canvas.style.cursor = "none";
canvasContainer.append(canvas);

const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let cursorCommand: CursorCommand | null = null;

const bus = new EventTarget();

function notify(name: string) {
  bus.dispatchEvent(new Event(name));
}

function redraw() {
  if (ctx) {
    ctx.clearRect(
      FIRST_ITERATION,
      FIRST_ITERATION,
      canvas.width,
      canvas.height
    );

    commands.forEach((cmd) => cmd.execute());

    if (cursorCommand) {
      cursorCommand.execute();
    }
  }
}

bus.addEventListener("drawing-changed", redraw);
bus.addEventListener("cursor-changed", redraw);

function tick() {
  redraw();
  requestAnimationFrame(tick);
}

tick();

let currentLineCommand: LineCommand | null = null;

canvas.addEventListener("mouseout", () => {
  cursorCommand = null;
  notify("cursor-changed");
});

canvas.addEventListener("mouseenter", (e: MouseEvent) => {
  cursorCommand = new CursorCommand(ctx, e.offsetX, e.offsetY);
  notify("cursor-changed");
});

canvas.addEventListener("mousemove", (e) => {
  cursorCommand = new CursorCommand(ctx, e.offsetX, e.offsetY);
  notify("cursor-changed");

  if (e.buttons == SINGLE) {
    if (currentLineCommand) {
      currentLineCommand.grow(e.offsetX, e.offsetY);
      notify("drawing-changed");
    }
  }
});

canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(ctx, e.offsetX, e.offsetY);
  commands.push(currentLineCommand);
  redoCommands.splice(FIRST_ITERATION, redoCommands.length);
  notify("drawing-changed");
});

canvas.addEventListener("mouseup", () => {
  currentLineCommand = null;
  notify("drawing-changed");
});

const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "center";
canvasContainer.append(buttonContainer);

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
buttonContainer.append(clearButton);

clearButton.addEventListener("click", () => {
  if (canvas && ctx) {
    commands.splice(FIRST_ITERATION, commands.length);
    notify("drawing-changed");
  }
});

const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
buttonContainer.append(undoButton);

undoButton.addEventListener("click", () => {
  if (commands.length > FIRST_ITERATION) {
    redoCommands.push(commands.pop()!);
    notify("drawing-changed");
  }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
buttonContainer.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoCommands.length > FIRST_ITERATION) {
    commands.push(redoCommands.pop()!);
    notify("drawing-changed");
  }
});
