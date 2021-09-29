import Maze from "./modules/maze.js";
import {findPath} from './modules/path-finders.js';

// HTML elements
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mazeSizeSelector = document.getElementById('maze-size');
const animateMazeCheckBox = document.getElementById('animate-maze');
const createMazeBtn = document.getElementById('create-maze');
const playPauseMazeBtn = document.getElementById('play-pause-maze');
const resetMazeBtn = document.getElementById('reset-maze');
const solveMazeBtn = document.getElementById('solve-maze');

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
});
solveMazeBtn.addEventListener('click', (e) => {
  drawMazeSolution();
});

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

function drawMazeSolution() {
  ctx.strokeStyle = 'rgb(255, 0, 0)';
  ctx.beginPath();
  ctx.moveTo(0.5 * maze.nodeX, 0.5 * maze.nodeY);
  ctx.lineWidth = 1;

  let path = findPath(maze);
  for (let i = 0; i < path.length - 1; i++) {
    let [x1, y1] = path[i];
    let [x2, y2] = path[i + 1];
    let dx, dy;

    if (x1 !== x2) {
      dx = x2 - x1;
      dy = 0;
    } else if (y1 !== y2) {
      dx = 0;
      dy = y2 - y1;
    }
    ctx.lineTo((x1 + dx + 0.5) * maze.nodeX, (y1 + dy + 0.5) * maze.nodeY);
  }
  ctx.stroke();
}