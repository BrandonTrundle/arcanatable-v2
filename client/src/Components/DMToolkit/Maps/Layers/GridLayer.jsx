import React from "react";
import { Layer, Line } from "react-konva";

export default function GridLayer({
  width,
  height,
  gridSize,
  color = "#444",
  opacity = 1,
}) {
  const verticalLines = Array.from({ length: width + 1 }).map((_, i) => (
    <Line
      key={`v-${i}`}
      points={[i * gridSize, 0, i * gridSize, height * gridSize]}
      stroke={color}
      strokeWidth={1}
    />
  ));

  const horizontalLines = Array.from({ length: height + 1 }).map((_, i) => (
    <Line
      key={`h-${i}`}
      points={[0, i * gridSize, width * gridSize, i * gridSize]}
      stroke={color}
      strokeWidth={1}
    />
  ));

  return (
    <Layer opacity={opacity}>{[...verticalLines, ...horizontalLines]}</Layer>
  );
}
