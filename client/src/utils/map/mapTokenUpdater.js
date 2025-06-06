// utils/map/mapTokenUpdater.js
import { moveTokenOnMap } from "../token/tokenMovement";
import { calculateVisibleCells } from "../fogOfWar/calculateVisibleCells";

export function updateTokenPosition(map, tokenId, newPos, layer = "player") {
  const updatedMap = moveTokenOnMap(map, tokenId, newPos);
  const token = updatedMap.layers?.[layer]?.tokens?.find(
    (t) => t.id === tokenId
  );

  if (!token || token.type !== "player") return updatedMap;

  return revealFogAroundToken(updatedMap, token);
}

export function revealFogAroundToken(map, token) {
  const visibleCells = calculateVisibleCells(
    token,
    map.width,
    map.height,
    map.fogOfWar?.blockingCells || []
  );

  const cellKey = (c) => `${c.x},${c.y}`;
  const existing = map.fogOfWar?.revealedCells || [];
  const combined = new Map(existing.map((c) => [cellKey(c), c]));

  for (const cell of visibleCells) {
    combined.set(cellKey(cell), cell);
  }

  return {
    ...map,
    fogOfWar: {
      ...map.fogOfWar,
      revealedCells: Array.from(combined.values()),
      blockingCells: map.fogOfWar?.blockingCells || [],
    },
  };
}
