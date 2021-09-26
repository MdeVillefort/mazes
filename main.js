import Maze from "./modules/maze.js";

// HTML elements
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mazeSizeSelector = document.getElementById('maze-size');
const animateMazeCheckBox = document.getElementById('animate-maze');
const createMazeBtn = document.getElementById('create-maze');
const playPauseMazeBtn = document.getElementById('play-pause-maze');
const resetMazeBtn = document.getElementById('reset-maze');

// Create initial maze
let size = Number(mazeSizeSelector.value);
let maze = new Maze(canvas, ctx, size, size);

// Animation request id to allow pausing maze creation
let animationId = null;

// Set up event listeners
mazeSizeSelector.addEventListener('change', (e) => {
  size = Number(mazeSizeSelector.value);
  maze = new Maze(canvas, ctx, size, size);
});
createMazeBtn.addEventListener('click', (e) => {
  if (animateMazeCheckBox.checked) {
    mazeSizeSelector.disabled = true;
    createMazeBtn.disabled = true;
    playPauseMazeBtn.disabled = false;
    resetMazeBtn.disabled = true;
    animateMazeCreation();
  } else {
    maze.createMaze();
    maze.drawMaze();
    mazeSizeSelector.disabled = true;
    createMazeBtn.disabled = true;
    playPauseMazeBtn.disabled = true;
    resetMazeBtn.disabled = false;
  }
});
playPauseMazeBtn.addEventListener('click', (e) => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
    resetMazeBtn.disabled = false;
  } else {
    resetMazeBtn.disabled = true;
    animateMazeCreation();
  }
});
resetMazeBtn.addEventListener('click', (e) => {
  let size = Number(mazeSizeSelector.value);
  maze = new Maze(canvas, ctx, size, size);
  mazeSizeSelector.disabled = false;
  createMazeBtn.disabled = false;
  resetMazeBtn.disabled = true;
})

function animateMazeCreation() {
  if (maze.nVisited < maze.gridX * maze.gridY) {
    maze.drawMaze();
    maze.updateMaze();
    animationId = requestAnimationFrame(animateMazeCreation);
  } else {
    maze.drawMaze();
    playPauseMazeBtn.disabled = true;
    resetMazeBtn.disabled = false;
    animationId = null;
  }
}

function animateMazeSolution() {
  ;
}