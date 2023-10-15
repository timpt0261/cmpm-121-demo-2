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