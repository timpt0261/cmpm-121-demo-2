import "./style.css";

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

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.background = "lightgrey";
canvas.style.boxShadow = "black 1rem 1rem 10px";
canvas.style.borderRadius = "45px";
canvas.style.border = "3px solid black";
canvasContainer.append(canvas);

const ctx = canvas.getContext("2d");

interface Coordinates {
  x: number;
  y: number;
}

const lines: Coordinates[][] = [];
const redoLines: Coordinates[][] = [];

let currentLine: Coordinates[] | null = null;

const cursor = { active: false, x: 0, y: 0 };
const drawingChanged = new Event("drawing-changed");
const firstIteration = 0;

canvas.addEventListener("mousedown", (e: MouseEvent) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;

  currentLine = [];
  lines.push(currentLine);
  redoLines.splice(firstIteration, redoLines.length);
  currentLine.push({ x: cursor.x, y: cursor.y });

  canvas.dispatchEvent(drawingChanged);
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (cursor.active) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
    currentLine?.push({ x: cursor.x, y: cursor.y });

    canvas.dispatchEvent(drawingChanged);
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currentLine = null;

  canvas.dispatchEvent(drawingChanged);
});

const origin = { x: 0, y: 0 };
const single = 1;
function redraw() {
  ctx?.clearRect(origin.x, origin.y, canvas.width, canvas.height);
  for (const line of lines) {
    if (line.length > single) {
      ctx?.beginPath();
      const { x, y } = line[firstIteration];
      ctx?.moveTo(x, y);
      for (const { x, y } of line) {
        ctx?.lineTo(x, y);
      }
      ctx?.stroke();
    }
  }
}

const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "center";
canvasContainer.append(buttonContainer);

const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
buttonContainer.append(clearButton);

clearButton.addEventListener("click", () => {
  if (canvas && ctx) {
    lines.splice(firstIteration, lines.length);
    canvas.dispatchEvent(drawingChanged);
  }
});

canvas.addEventListener("drawing-changed", () => {
  redraw();
});
