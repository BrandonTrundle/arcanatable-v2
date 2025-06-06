import { moveTokenOnMap } from "./tokenMovement";
import { calculateVisibleCells } from "../fogOfWar/calculateVisibleCells";

/**
 * Handles player token movement and updates fog of war visibility.
 */
export function handleTokenMoveWithFog({ map, id, newPos, activeLayer }) {
  const updatedMap = moveTokenOnMap(map, id, newPos);

  const layerTokens = updatedMap.layers?.[activeLayer]?.tokens || [];
  const token = layerTokens.find((t) => t.id === id);

  if (!token || token.type !== "player") return updatedMap;

  const visibleCells = calculateVisibleCells(
    token,
    updatedMap.width,
    updatedMap.height,
    updatedMap.fogOfWar?.blockingCells || []
  );

  const cellKey = (c) => `${c.x},${c.y}`;
  const existing = updatedMap.fogOfWar?.revealedCells || [];
  const combined = new Map(existing.map((c) => [cellKey(c), c]));

  for (const cell of visibleCells) {
    combined.set(cellKey(cell), cell);
  }

  return {
    ...updatedMap,
    fogOfWar: {
      ...updatedMap.fogOfWar,
      revealedCells: visibleCells,
      blockingCells: updatedMap.fogOfWar?.blockingCells || [],
    },
  };
}
