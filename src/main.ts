import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "SketchPad";

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.style.background = "lightgrey";
canvas.style.boxShadow = "black 1rem 1rem 10px";
canvas.style.borderRadius = "45px";
canvas.style.border = "3px solid black";
app.append(canvas);

const ctx = canvas.getContext("2d");

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active) {
    ctx?.beginPath();
    ctx?.moveTo(cursor.x, cursor.y);
    ctx?.lineTo(e.offsetX, e.offsetY);
    ctx?.stroke();
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
app.append(clearButton);

clearButton.addEventListener("click", clear);

const origin = { x: 0, y: 0 };

function clear() {
  if (canvas && ctx) {
    ctx.clearRect(origin.x, origin.y, canvas.width, canvas.height);
  }
}
