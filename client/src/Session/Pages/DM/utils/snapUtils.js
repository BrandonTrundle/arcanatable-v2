export const snapToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};

export const applySnap = (x, y, gridSize, mode) => {
  if (mode === "center") {
    x = snapToGrid(x, gridSize) + gridSize / 2;
    y = snapToGrid(y, gridSize) + gridSize / 2;
  } else if (mode === "corner") {
    x = snapToGrid(x, gridSize);
    y = snapToGrid(y, gridSize);
  }
  return { x, y };
};

export const getSnappedPointer = (pointer, stage, gridSize, mode) => {
  const scale = stage.scaleX();
  const offsetX = stage.x();
  const offsetY = stage.y();

  let x = (pointer.x - offsetX) / scale;
  let y = (pointer.y - offsetY) / scale;

  return applySnap(x, y, gridSize, mode);
};
