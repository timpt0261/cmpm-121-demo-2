import { CursorCommand } from "./CursorCommand";
import { LineCommand } from "./LineCommand";
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

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.background = "lightgrey";
canvas.style.boxShadow = "1rem 1rem 10px black";
canvas.style.borderRadius = "45px";
canvas.style.border = "3px solid black";
canvas.style.cursor = "none";
canvasContainer.append(canvas);

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const commands: LineCommand[] = [];
const redoCommands: LineCommand[] = [];

let cursorCommand: CursorCommand | null = null;

const bus = new EventTarget();

function notify(name: string) {
  bus.dispatchEvent(new Event(name));
}

function redraw() {
  ctx.clearRect(FIRST_ITERATION, FIRST_ITERATION, canvas.width, canvas.height);

  commands.forEach((cmd) => cmd.display());

  if (cursorCommand) {
    cursorCommand.execute();
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

// make new comand line
// set thickness
// draw

const THIN_PEN_WIDTH = 4;
const THICK_PEN_WIDTH = 10;
let currentLineWidth = THIN_PEN_WIDTH;

// Create a sidebar for tools
const sidebar = document.createElement("nav");
sidebar.style.width = "100px"; // Adjust the width as needed
sidebar.style.height = "400px"; // Adjust the height as needed
sidebar.style.background = "lightgray";
sidebar.style.padding = "10px";
sidebar.style.position = "absolute"; // Set the position to absolute
sidebar.style.top = "0"; // Initial top position
sidebar.style.left = "0"; // Initial left position
sidebar.style.cursor = "grab"; // Set the cursor style to "grab" for indicating it's draggable
sidebar.style.borderRadius = "10px"; // Add rounded corners

// Variables to store the drag information
let isDragging = false;
let dragStartX: number;
let dragStartY: number;

// Event listener to handle the drag start
sidebar.addEventListener("mousedown", (e: MouseEvent) => {
  isDragging = true;
  dragStartX = e.clientX - sidebar.getBoundingClientRect().left;
  dragStartY = e.clientY - sidebar.getBoundingClientRect().top;
  sidebar.style.cursor = "grabbing"; // Change cursor style during dragging
});

// Event listener to handle the drag end
document.addEventListener("mouseup", () => {
  isDragging = false;
  sidebar.style.cursor = "grab";
});

// Event listener to handle the drag movement
document.addEventListener("mousemove", (e: MouseEvent) => {
  if (isDragging) {
    const newLeft = e.clientX - dragStartX;
    const newTop = e.clientY - dragStartY;
    sidebar.style.left = `${newLeft}px`;
    sidebar.style.top = `${newTop}px`;
  }
});

// Append the sidebar to the document
document.body.appendChild(sidebar);

// Create buttons
const thin = document.createElement("button");
thin.innerHTML = "thin";
const thick = document.createElement("button");
thick.innerHTML = "thick";

// Append buttons to the sidebar
sidebar.appendChild(thin);
sidebar.appendChild(thick);

// Apply margin to the buttons
thin.style.marginBottom = "5px";
thick.style.marginTop = "5px";

thin.addEventListener("click", () => {
  currentLineWidth = THIN_PEN_WIDTH;
  notify("drawing-changed");
});

thick.addEventListener("click", () => {
  currentLineWidth = THICK_PEN_WIDTH;
  notify("drawing-changed");
});

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

  if (e.buttons === SINGLE) {
    if (currentLineCommand) {
      currentLineCommand.grow(e.offsetX, e.offsetY);
      notify("drawing-changed");
    }
  }
});

canvas.addEventListener("mousedown", (e) => {
  currentLineCommand = new LineCommand(
    ctx,
    e.offsetX,
    e.offsetY,
    currentLineWidth,
  );
  console.log(`${currentLineWidth}`);
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
  if (commands.length) {
    redoCommands.push(commands.pop()!);
    notify("drawing-changed");
  }
});

const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
buttonContainer.append(redoButton);

redoButton.addEventListener("click", () => {
  if (redoCommands.length) {
    commands.push(redoCommands.pop()!);
    notify("drawing-changed");
  }
});
