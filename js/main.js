// Import necessary modules
import { initializeGrid } from './systems/map.js';
import { timeSystem } from './core/timeSystem.js';
import { UIManager } from './UIManager.js';

// Wait for the DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded."); // Debugging

    initializeGrid(128, 5, 9); // Create a 7x11 grid with 128px square cells




    // Event listener for the "Next Phase" button
    document.getElementById("nextPhaseButton").addEventListener("click", () => {
        console.log("Next Phase button clicked."); // Debugging
        timeSystem.advanceTime();
    });

    // Example: Add initial gold
    // resourceSystem.essentialResourceChange("gold", 100, "add");
});