function positionsEqual(p1, p2) {
  return (p1[0] === p2[0]) && (p1[1] === p2[1]);
}

function offset(at, dx, dy, maze) {
  return (at[1] + dy) * maze.gridX + (at[0] + dx);
}

function getNeighbors(at, maze) {
  let neighbors = [];
  let node = maze.nodes[offset(at, 0, 0, maze)];

  if (node & maze.states.CELL_PATH_N) {
    neighbors.push([at[0], at[1] - 1]);
  }
  if (node & maze.states.CELL_PATH_E) {
    neighbors.push([at[0] + 1, at[1]]);
  }
  if (node & maze.states.CELL_PATH_S) {
    neighbors.push([at[0], at[1] + 1]);
  }
  if (node & maze.states.CELL_PATH_W) {
    neighbors.push([at[0] - 1, at[1]]);
  }

  return neighbors;
}

function findPath(maze, from = [0, 0], to = [maze.gridX - 1, maze.gridY - 1]) {

  let work = [{at : from, route : [from]}];

  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    let neighbors = getNeighbors(at, maze);
    for (let neighbor of neighbors) {
      if (positionsEqual(neighbor, to)) {
        return route.concat([neighbor]);
      }
      if (!work.some(w => positionsEqual(w.at, neighbor))) {
        work.push({at : neighbor, route : route.concat([neighbor])})
      }
    }
  }
}
export {findPath};