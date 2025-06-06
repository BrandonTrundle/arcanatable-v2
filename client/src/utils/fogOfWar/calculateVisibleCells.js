function bresenhamLine(x0, y0, x1, y1) {
  const points = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}

export function calculateVisibleCells(
  token,
  mapWidth,
  mapHeight,
  blockingCells = []
) {
  const { position, viewableDistance = 6 } = token;
  const visible = [];
  const radius = viewableDistance;

  const centerX = position.x;
  const centerY = position.y;

  // Convert blockingCells into a Set for fast lookup
  const blockSet = new Set(blockingCells.map((cell) => `${cell.x},${cell.y}`));

  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) continue;

      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius) continue;

      const line = bresenhamLine(centerX, centerY, x, y);
      let blocked = false;

      for (const point of line) {
        if (blockSet.has(`${point.x},${point.y}`)) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        visible.push({ x, y });
      }
    }
  }

  return visible;
}
