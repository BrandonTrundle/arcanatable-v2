import React, { useMemo } from "react";
import { Layer, Rect } from "react-konva";
import Konva from "konva";

export default function SessionFogAndBlockerLayer({
  width,
  height,
  gridSize,
  revealedCells,
  blockingCells = [],
  showFog,
  showBlockers,
}) {
  const fogRects = useMemo(() => {
    if (!showFog) return [];

    const revealedSet = new Set(revealedCells.map((c) => `${c.x},${c.y}`));
    const fullFog = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = `${x},${y}`;
        if (!revealedSet.has(key)) {
          fullFog.push({ x, y });
        }
      }
    }

    return fullFog;
  }, [width, height, gridSize, revealedCells, showFog]);

  const blockerRects = showBlockers
    ? blockingCells
        .filter(
          (cell) => typeof cell.x === "number" && typeof cell.y === "number"
        )
        .map((cell) => ({ ...cell }))
    : [];

  return (
    <Layer>
      {fogRects.map((cell) => (
        <Rect
          key={`fog-${cell.x}-${cell.y}`}
          x={cell.x * gridSize}
          y={cell.y * gridSize}
          width={gridSize}
          height={gridSize}
          fill="black"
          opacity={0}
          listening={false}
          ref={(node) => {
            if (node) {
              node.to({
                opacity: 1,
                duration: 0.25,
                easing: Konva.Easings.EaseInOut,
              });
            }
          }}
        />
      ))}
      {blockerRects.map((cell) => (
        <Rect
          key={`blocker-${cell.x}-${cell.y}`}
          x={cell.x * gridSize}
          y={cell.y * gridSize}
          width={gridSize}
          height={gridSize}
          fill="red"
          opacity={0.4}
          listening={false}
        />
      ))}
    </Layer>
  );
}
