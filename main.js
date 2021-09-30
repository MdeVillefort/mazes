import Maze from "./modules/maze.js";
import {findPath} from './modules/path-finders.js';
import DraggableDiv from './modules/draggable-div.js';

// HTML elements
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mazeDiv = document.querySelector('.maze');
const mazeSizeSelector = document.getElementById('maze-size');
const animateMazeCheckBox = document.getElementById('animate-maze');
const createMazeBtn = document.getElementById('create-maze');
const playPauseMazeBtn = document.getElementById('play-pause-maze');
const resetMazeBtn = document.getElementById('reset-maze');
const solveMazeBtn = document.getElementById('solve-maze');

// Create initial maze
let size = Number(mazeSizeSelector.value);
let maze = new Maze(canvas, ctx, size, size);

// Resize maze div
mazeDiv.style.width = maze.canvas.width + 'px';
mazeDiv.style.height = maze.canvas.height + 'px';

// Animation request id to allow pausing maze creation
let animationId = null;

// The div elements indicating maze solution endpoints
let startDiv = document.createElement('div');
let endDiv = document.createElement('div');
let startPoint = null;
let endPoint = null;

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
    solveMazeBtn.disabled = false;
    startPoint = new DraggableDiv(startDiv, 0, 0, 'rgba(255, 0, 0, 0.5', maze);
    endPoint = new DraggableDiv(endDiv,
                                (maze.gridX - 1),
                                (maze.gridY - 1),
                                'rgba(0, 255, 0, 0.5)', maze);
    mazeDiv.appendChild(startDiv);
    mazeDiv.appendChild(endDiv);
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
  solveMazeBtn.disabled = true;
  mazeDiv.removeChild(startDiv);
  mazeDiv.removeChild(endDiv);
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
    solveMazeBtn.disabled = false;
    animationId = null;
    startPoint = new DraggableDiv(startDiv, 0, 0, 'rgba(255, 0, 0, 0.5', maze);
    endPoint = new DraggableDiv(endDiv,
                                (maze.gridX - 1),
                                (maze.gridY - 1),
                                'rgba(0, 255, 0, 0.5)', maze);
    mazeDiv.appendChild(startDiv);
    mazeDiv.appendChild(endDiv);
  }
}

function drawMazeSolution() {
  maze.drawMaze();
  ctx.strokeStyle = 'rgb(255, 0, 0)';
  ctx.beginPath();
  ctx.moveTo((startPoint.col + 0.5) * maze.nodeX, (startPoint.row + 0.5) * maze.nodeY);
  ctx.lineWidth = 1;

  let path = findPath(maze, [startPoint.col, startPoint.row], [endPoint.col, endPoint.row]);
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