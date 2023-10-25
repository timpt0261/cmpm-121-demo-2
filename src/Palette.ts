import { bus } from "./Setting";
import {
  createButton,
  positionButtonsInCircle,
  setButtonRoundess,
  setEventforButtons,
} from "./ToolManger";

// Related to Palette
export function createPalette() {
  const sidebar = setUpPalette();

  // Variables to store the drag information
  let isDragging = false;
  let dragStartX: number;
  let dragStartY: number;

  // Event listener to handle the drag start
  sidebar.addEventListener("mousedown", (e: MouseEvent) => {
    ({ isDragging, dragStartX, dragStartY } = dragStart(
      isDragging,
      dragStartX,
      e,
      sidebar,
      dragStartY
    ));
  });

  // Event listener to handle the drag end
  document.addEventListener("mouseup", () => {
    isDragging = dragEnd(isDragging, sidebar);
  });

  // Event listener to handle the drag movement
  document.addEventListener("mousemove", (e: MouseEvent) => {
    handleDrag(isDragging, e, dragStartX, dragStartY, sidebar);
  });

  // Append the sidebar to the document
  document.body.appendChild(sidebar);

  // Create buttons for the outer circle
  createButtonsForSideBar(sidebar);
}

function createButtonsForSideBar(sidebar: HTMLElement) {
  // Create buttons for the outer circle
  const outerCircleButtons = [
    createButton("thin", "draw"),
    createButton("thick", "draw"),
    createButton("🤖", "sticker"),
    createButton("💀", "sticker"),
    createButton("🚀", "sticker"),
    createButton("Choose Color", "choose-color"),
    createButton("Random Color", "random-color"),
  ];

  // Create buttons for the center circle
  const centerCircleButtons = [createButton("+", "add")];

  // Create a div element for the center circle
  const centerCircle = document.createElement("div");
  centerCircle.className = "center-circle";

  const innerCircleRadius = 120;
  const centerCircleRadius = 30;
  // Append buttons to the outer circle and position them in a circular formation
  positionButtonsInCircle(outerCircleButtons, innerCircleRadius);

  outerCircleButtons.forEach((button) => {
    if (button.type === "choose-color" || button.type === "random-color")
      button.buttonHtml.style.fontSize = "12px";
    button = setEventforButtons(button, sidebar, outerCircleButtons);
    button = setButtonRoundess(button);
    sidebar.appendChild(button.buttonHtml);
  });

  bus.addEventListener("change-palette", () => { 
    positionButtonsInCircle(outerCircleButtons, innerCircleRadius);
  });
  // Append the center circle to the sidebar
  sidebar.appendChild(centerCircle);

  // Append buttons to the center circle and position them in a circular formation
  positionButtonsInCircle(centerCircleButtons, centerCircleRadius);

  centerCircleButtons.forEach((button) => {
    button = setEventforButtons(button, sidebar);
    button.buttonHtml.style.font = "12px monospace";
    centerCircle.appendChild(button.buttonHtml);
  });
}

function setUpPalette() {
  const sidebar = document.createElement("nav");
  sidebar.style.width = "320px"; // Adjust the width as needed
  sidebar.style.height = "320px"; // Adjust the height as needed
  sidebar.style.background = "lightgray";
  sidebar.style.padding = "10px";
  sidebar.style.position = "absolute"; // Set the position to absolute
  sidebar.style.top = "0"; // Initial top position
  sidebar.style.left = "0"; // Initial left position
  sidebar.style.cursor = "grab"; // Set the cursor style to "grab" for indicating it's draggable
  sidebar.style.borderRadius = "200px 200px  200px 200px"; // Create an oval shape
  sidebar.style.border = "2px solid black";
  return sidebar;
}

function handleDrag(
  isDragging: boolean,
  e: MouseEvent,
  dragStartX: number,
  dragStartY: number,
  sidebar: HTMLElement
) {
  if (isDragging) {
    const newLeft = e.clientX - dragStartX;
    const newTop = e.clientY - dragStartY;
    sidebar.style.left = `${newLeft}px`;
    sidebar.style.top = `${newTop}px`;
  }
}
function dragEnd(isDragging: boolean, sidebar: HTMLElement) {
  isDragging = false;
  sidebar.style.cursor = "grab";
  return isDragging;
}
function dragStart(
  isDragging: boolean,
  dragStartX: number,
  e: MouseEvent,
  sidebar: HTMLElement,
  dragStartY: number
) {
  isDragging = true;
  dragStartX = e.clientX - sidebar.getBoundingClientRect().left;
  dragStartY = e.clientY - sidebar.getBoundingClientRect().top;
  sidebar.style.cursor = "grabbing";
  return { isDragging, dragStartX, dragStartY };
}

