class DraggableDiv {
  constructor(element, row, col, color, maze) {
    this.element = element;
    this.maze = maze;
    this.element.style.width = this.maze.nodeX + 'px';
    this.element.style.height = this.maze.nodeY + 'px';
    this.element.style.background = color;
    this.element.className = 'draggable';
    this.mazeX = Number(this.maze.canvas.style.left.match(/^\d+/));
    this.mazeY = Number(this.maze.canvas.style.top.match(/^\d+/));
    this.row = row;
    this.col = col;
    this.x = this.col * this.maze.nodeX;
    this.y = this.row * this.maze.nodeY;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.dragStartX = null;
    this.dragStartY = null;
    this.pointerDownX = null;
    this.pointerDownY = null;
    this.element.addEventListener('mousedown', this);
  }

  handleEvent(event) {
    let method = 'on' + event.type;
    if (this[method]) {
      this[method](event);
    }
  }

  onmousedown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    this.dragStartX = this.x;
    this.dragStartY = this.y;
    this.pointerDownX = event.pageX;
    this.pointerDownY = event.pageY;
    // Add this as event listener, trigger handleEvent
    window.addEventListener('mousemove', this);
    window.addEventListener('mouseup', this);
  }

  onmousemove(event) {
    // How much has the div moved
    let moveX = event.pageX - this.pointerDownX;
    let moveY = event.pageY - this.pointerDownY;

    // Add movement to position
    this.x = this.dragStartX + moveX;
    this.y = this.dragStartY + moveY;

    // Keep div position inside canvas
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > (this.maze.gridX - 1) * this.maze.nodeX) {
      this.x = (this.maze.gridX - 1) * this.maze.nodeX;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > (this.maze.gridY - 1) * this.maze.nodeY) {
      this.y = (this.maze.gridY - 1) * this.maze.nodeY;
    }

    // Position element
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  onmouseup(event) {
    // Remove move & up event listeners
    window.removeEventListener('mousemove', this);
    window.removeEventListener('mouseup', this);

    // Fit div inside the maze grid
    let closestX = this.maze.pixelX.reduce((prev, curr) => {
      return Math.abs(curr - this.x) < Math.abs(prev - this.x) ? curr : prev;
    });
    let closestY = this.maze.pixelY.reduce((prev, curr) => {
      return Math.abs(curr - this.y) < Math.abs(prev - this.y) ? curr : prev;
    });
    this.x = closestX;
    this.y = closestY;
    this.col = this.maze.pixelX.indexOf(this.x);
    this.row = this.maze.pixelY.indexOf(this.y);
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}
export default DraggableDiv;
