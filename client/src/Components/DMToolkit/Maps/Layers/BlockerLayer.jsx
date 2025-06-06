import React from "react";
import { Layer, Rect } from "react-konva";

export default function BlockerLayer({ blockingCells = [], gridSize }) {
  return (
    <Layer>
      {blockingCells
        .filter(
          (cell) =>
            cell && typeof cell.x === "number" && typeof cell.y === "number"
        )
        .map((cell) => (
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
