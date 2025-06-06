// utils/grid/coordinates.js
export function getCellFromPointer(pointer, gridSize) {
  return {
    x: Math.floor(pointer.x / gridSize),
    y: Math.floor(pointer.y / gridSize),
  };
}
