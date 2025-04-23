// Create a grid map dynamically
export function createGridMap(cellSize, rows, cols, containerId) {
    const container = document.getElementById(containerId);
    container.style.display = "grid";

    // Set grid dimensions
    container.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`; // Set row height
    container.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`; // Set column width
    container.style.gap = "0"; // No gap between cells

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.dataset.tags = `row-${row},col-${col}`; // Add tags to the cell
            container.appendChild(cell);
        }
    }
}

// Initialize the grid
export function initializeGrid(cellSize, rows, cols) {
    const containerId = "grid-container";
    let container = document.getElementById(containerId);

    // Check if the container already exists
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);

        // Set container size (optional, if not already set in CSS)
        container.style.width = `${cols * cellSize}px`;
        container.style.height = `${rows * cellSize}px`;
    }

    createGridMap(cellSize, rows, cols, containerId); // Create the grid
}