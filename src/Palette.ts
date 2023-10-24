import { createButton, setEventforButtons } from "./ToolManger";

// Related to Palette
export function createPalette() {
  const sidebar = setUpPalette(); // Add rounded corners

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
      dragStartY,
    )); // Change cursor style during dragging
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

  // Create buttons
  const sidebarButtons = [
    createButton("thin", "draw"),
    createButton("thick", "draw"),
    createButton("🤖", "sticker"),
    createButton("💀", "sticker"),
    createButton("🚀", "sticker"),
    createButton("+", "add"),
  ];

  sidebarButtons.forEach((button) => {
    // fix to make button function on click
    sidebar.append(button.buttonHtml);
    button = setEventforButtons(button, sidebar);
  });
}

function setUpPalette() {
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
  return sidebar;
}
function handleDrag(
  isDragging: boolean,
  e: MouseEvent,
  dragStartX: number,
  dragStartY: number,
  sidebar: HTMLElement,
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
  dragStartY: number,
) {
  isDragging = true;
  dragStartX = e.clientX - sidebar.getBoundingClientRect().left;
  dragStartY = e.clientY - sidebar.getBoundingClientRect().top;
  sidebar.style.cursor = "grabbing";
  return { isDragging, dragStartX, dragStartY };
}
