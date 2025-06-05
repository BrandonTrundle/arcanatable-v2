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
  const visible = new Set();
  const blocked = new Set(blockingCells.map((c) => `${c.x},${c.y}`));
  const radius = viewableDistance;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = position.x + dx;
      const y = position.y + dy;

      if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) continue;

      const line = bresenhamLine(position.x, position.y, x, y);

      for (const { x: lx, y: ly } of line) {
        visible.add(`${lx},${ly}`);
        if (blocked.has(`${lx},${ly}`)) break;
      }
    }
  }

  return Array.from(visible).map((s) => {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
  });
}
