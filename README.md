# Maze Generator & Path Finding
An exploration of maze generation in the browser using the canvas api.

## Maze Generation
Uses stack-based recursive backtracking algorithm to create mazes.

### Algorithm Steps
1. Create an array representing the nodes in the maze grid whose values
indicate open paths to neighboring nodes (North, East, South, and West)
and whether the cell has already been visited.
2. Create an array to function as a stack data structure to keep track
of where we are in the maze.
3. Push top left position, i.e. (0, 0), onto the stack.
4. Repeat the following until all nodes have been visited.
    * Choose neighboring node that has not yet been visited at random
    * Push its coordinates onto the stack
    * Increment number of nodes visited
    * Update the nodes array to reflect the open path for that node
    * Update the nodes array to reflect the current node has been visited
    * If all neighboring nodes have been visited, pop a value off the stack

## Path Finding
TODO

## Resources
https://www.youtube.com/watch?v=Y37-gB83HKE

https://en.wikipedia.org/wiki/Maze_generation_algorithm
