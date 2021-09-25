import Maze from "./modules/maze.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const maze = new Maze(canvas, ctx, 20, 20);

// Want to access grid from browser console
window.maze = maze;

// Start animation
maze.animateMaze();
