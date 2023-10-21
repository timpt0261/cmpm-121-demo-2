const THIN_PEN_WIDTH = 4;
const THICK_PEN_WIDTH = 10;

function createDraggableSidebar() {
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
  const thin = createButton("Thin", "black", THIN_PEN_WIDTH);
  const thick = createButton("Thick", "black", THICK_PEN_WIDTH);

  thin.buttonHtml.addEventListener("click", () => {
    console.log("change tools");
  });

  thick.buttonHtml.addEventListener("click", () => {
    console.log("change tools");
  });

  // Append buttons to the sidebar
  sidebar.appendChild(thin.buttonHtml);
  sidebar.appendChild(thick.buttonHtml);

  // Apply margin to the buttons
  thin.buttonHtml.style.marginBottom = "5px";
  thick.buttonHtml.style.marginTop = "5px";
}

function createButton(label: string, style: string, width: number) {
  const button = {
    buttonHtml: document.createElement("button"),
    marker: { style, width },
  };

  button.buttonHtml.innerHTML = label;

  button.buttonHtml.addEventListener("click", () => {
    // Set the marker's style and width when the button is clicked
    console.log(`Marker style changed to ${style}, width changed to ${width}`);
  });

  return button;
}
createDraggableSidebar();
