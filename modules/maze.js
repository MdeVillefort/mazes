class Maze {
  constructor(canvas, ctx, gridX, gridY) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridX = gridX;
    this.gridY = gridY;
    this.nodeX = Math.floor(this.canvas.width / this.gridX);
    this.nodeY = Math.floor(this.canvas.height / this.gridY);
    this.pixelX = [];
    this.pixelY = [];
    for (let col = 0; col < this.gridX; col++) {
      this.pixelX.push(col * this.nodeX);
    }
    for (let row = 0; row < this.gridY; row++) {
      this.pixelY.push(row * this.nodeY);
    }
    this.states = {
      'CELL_PATH_N' : 0x01,   // 00001
      'CELL_PATH_E' : 0x02,   // 00010
      'CELL_PATH_S' : 0x04,   // 00100
      'CELL_PATH_W' : 0x08,   // 01000
      'CELL_VISITED' : 0x10   // 10000
    };
    Object.freeze(this.states);

    this.initMaze();
  }

  initMaze() {
    // Initialize starting conditions
    this.nodes = [];
    this.stack = [];
    for (let i = 0; i < this.gridX * this.gridY; i++) {
      this.nodes.push(0x00);  // row oriented
    }
    this.stack[0] = [0, 0];
    this.nodes[0] = this.states.CELL_VISITED;
    this.nVisited = 1;

    this.drawInitialMaze();
  }

  drawMaze() {
   let {CELL_PATH_N,
        CELL_PATH_E,
        CELL_PATH_S,
        CELL_PATH_W,
        CELL_VISITED} = this.states;

    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    this.ctx.lineWidth = 3;

    // Get stack size
    let N = this.stack.length;

    for (let y = 0; y < this.gridY; y++) {

      for (let x = 0; x < this.gridX; x++) {

        let node = this.nodes[y * this.gridX + x];

        if (this.nVisited < this.gridX * this.gridY)
            this.ctx.fillStyle = 'rgb(0, 255, 0)';

        if ((x === this.stack[N - 1][0] && y === this.stack[N - 1][1]) && this.nVisited < this.gridX * this.gridY) {
          this.ctx.fillStyle = 'rgb(0, 255, 0)';
        } else if (node & CELL_VISITED) {
          this.ctx.fillStyle = 'rgb(255, 255, 255)';
        } else {
          this.ctx.fillStyle = 'rgb(0, 0, 255)';
        }
        this.ctx.fillRect(x * this.nodeX, y * this.nodeY, this.nodeX, this.nodeY);
        this.ctx.fill();

        this.ctx.beginPath();
        if (!(node & CELL_PATH_N)) {
          this.ctx.moveTo(x * this.nodeX, y * this.nodeY);
          this.ctx.lineTo((x + 1) * this.nodeX, y * this.nodeY);
        }
        if (!(node & CELL_PATH_E)) {
          this.ctx.moveTo((x + 1) * this.nodeX, y * this.nodeY);
          this.ctx.lineTo((x + 1) * this.nodeX, (y + 1) * this.nodeY);
        }
        if (!(node & CELL_PATH_S)) {
          this.ctx.moveTo(x * this.nodeX, (y + 1) * this.nodeY);
          this.ctx.lineTo((x + 1) * this.nodeX, (y + 1) * this.nodeY);
        }
        if (!(node & CELL_PATH_W)) {
          this.ctx.moveTo(x * this.nodeX, y * this.nodeY);
          this.ctx.lineTo(x * this.nodeX, (y + 1) * this.nodeY);
        }
        this.ctx.stroke();
      }
    }
    this.drawBorder();
  }

  updateMaze() {
   let {CELL_PATH_N,
        CELL_PATH_E,
        CELL_PATH_S,
        CELL_PATH_W,
        CELL_VISITED} = this.states

    // Create set of unvisited neighbors
    let offset = (x, y) => {
      return (this.stack[this.stack.length - 1][1] + y) * this.gridX + (this.stack[this.stack.length - 1][0] + x);
    };

    let neighbors = [];

    // North neighbor
    if (this.stack[this.stack.length - 1][1] > 0 && (this.nodes[offset(0, -1)] & CELL_VISITED) === 0) {
      neighbors.push(0);
    }

    // East neighbor
    if (this.stack[this.stack.length - 1][0] < this.gridX - 1 && (this.nodes[offset(1, 0)] & CELL_VISITED) === 0) {
      neighbors.push(1);
    }

    // South neighbor
    if (this.stack[this.stack.length - 1][1] < this.gridY - 1 && (this.nodes[offset(0, 1)] & CELL_VISITED) === 0) {
      neighbors.push(2);
    }

    // West neighbor
    if (this.stack[this.stack.length - 1][0] > 0 && (this.nodes[offset(-1, 0)] & CELL_VISITED) === 0) {
      neighbors.push(3);
    }

    if (neighbors.length !== 0) {
      // Select neighbor at random
      let nextNode = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Create path between nodes
      switch(nextNode) {
        case 0: // North
          this.nodes[offset(0, 0)] |= CELL_PATH_N;
          this.nodes[offset(0, -1)] |= CELL_PATH_S;
          this.stack.push([this.stack[this.stack.length - 1][0] + 0, this.stack[this.stack.length - 1][1] - 1]);
          break
        case 1: // East
          this.nodes[offset(0, 0)] |= CELL_PATH_E;
          this.nodes[offset(1, 0)] |= CELL_PATH_W;
          this.stack.push([this.stack[this.stack.length - 1][0] + 1, this.stack[this.stack.length - 1][1] + 0]);
          break;
        case 2: // South
          this.nodes[offset(0, 0)] |= CELL_PATH_S;
          this.nodes[offset(0, 1)] |= CELL_PATH_N;
          this.stack.push([this.stack[this.stack.length - 1][0] + 0, this.stack[this.stack.length - 1][1] + 1]);
          break;
        case 3: // West
          this.nodes[offset(0, 0)] |= CELL_PATH_W;
          this.nodes[offset(-1, 0)] |= CELL_PATH_E;
          this.stack.push([this.stack[this.stack.length - 1][0] - 1, this.stack[this.stack.length - 1][1] + 0]);
          break;
      }

      // Indicate that current node has been visited
      this.nodes[offset(0, 0)] |= CELL_VISITED;
      this.nVisited++;

    } else {
      // Backtrack if no unvisited neighbors
      this.stack.pop();
    }
  }

  drawInitialMaze() {
    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    this.ctx.lineWidth = 3;

    // Color background
    this.ctx.fillStyle = 'rgb(0, 0, 255)';
    this.ctx.fillRect(0, 0, this.gridX * this.nodeX, this.gridY * this.nodeY);
    this.ctx.fill();
    
    // Draw grid
    this.ctx.beginPath();
    for (let y = 1; y < this.gridY; y++) {
      this.ctx.moveTo(0, y * this.nodeY);
      this.ctx.lineTo(this.canvas.width, y * this.nodeY);
    }
    for (let x = 1; x < this.gridX; x++) {
      this.ctx.moveTo(x * this.nodeX, 0);
      this.ctx.lineTo(x * this.nodeX, this.canvas.height);
    }
    this.ctx.stroke();

    this.drawBorder();
  }

  drawBorder() {
    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    this.ctx.lineWidth = 6;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createMaze() {
    while (this.nVisited < this.gridX * this.gridY) {
      this.updateMaze();
    }
  }
}
export default Maze;
