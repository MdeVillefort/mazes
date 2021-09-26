import Maze from "./modules/maze.js";

// HTML elements
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mazeSizeSelector = document.getElementById('maze-size');
const createMazeBtn = document.getElementById('create-maze');
const playPauseMazeBtn = document.getElementById('play-pause-maze');
const resetMazeBtn = document.getElementById('reset-maze');

// Create initial maze
let maze = new Maze(canvas, ctx, 20, 20);

// Animation request id to allow pausing maze creation
let animationId = null;

// Set up event listeners
mazeSizeSelector.addEventListener('change', (e) => {
  let size = Number(mazeSizeSelector.value);
  maze = new Maze(canvas, ctx, size, size);
});
createMazeBtn.addEventListener('click', (e) => {
  mazeSizeSelector.disabled = true;
  createMazeBtn.disabled = true;
  playPauseMazeBtn.disabled = false;
  resetMazeBtn.disabled = true;
  animateMaze();
});
playPauseMazeBtn.addEventListener('click', (e) => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
    resetMazeBtn.disabled = false;
  } else {
    resetMazeBtn.disabled = true;
    animateMaze();
  }
});
resetMazeBtn.addEventListener('click', (e) => {
  let size = Number(mazeSizeSelector.value);
  maze = new Maze(canvas, ctx, size, size);
  mazeSizeSelector.disabled = false;
  createMazeBtn.disabled = false;
  resetMazeBtn.disabled = true;
})

function animateMaze() {
  maze.drawMaze();
  maze.updateMaze();
  if (maze.nVisited < maze.gridX * maze.gridY) {
    animationId = requestAnimationFrame(animateMaze);
  } else {
    maze.drawMaze();
    playPauseMazeBtn.disabled = true;
    resetMazeBtn.disabled = false;
    animationId = null;
  }
}
