// StaticMapLayer.jsx
import React from "react";
import { Layer, Line, Rect, Image as KonvaImage } from "react-konva";

export default function StaticMapLayer({
  mapImage,
  imageReady,
  gridVisible,
  map,
  notes,
  activeNoteCell,
  selectedNoteCell,
}) {
  if (!imageReady) return null;

  const { width, height, gridSize } = map;

  // Generate grid lines
  const gridLines = [];
  if (gridVisible) {
    for (let i = 0; i <= width; i++) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSize, 0, i * gridSize, height * gridSize]}
          stroke="#444"
          strokeWidth={1}
        />
      );
    }
    for (let i = 0; i <= height; i++) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * gridSize, width * gridSize, i * gridSize]}
          stroke="#444"
          strokeWidth={1}
        />
      );
    }
  }

  // Note markers
  const noteTriangles = notes
    .filter((n) => n.cell)
    .map((note) => {
      const { x, y } = note.cell;
      const gx = x * gridSize;
      const gy = y * gridSize;
      const triangleSize = gridSize * 0.25;

      return (
        <Line
          key={`note-marker-${note.id}`}
          points={[
            gx + gridSize,
            gy + gridSize,
            gx + gridSize - triangleSize,
            gy + gridSize,
            gx + gridSize,
            gy + gridSize - triangleSize,
          ]}
          closed
          fill="orange"
          opacity={0.8}
        />
      );
    });

  // Note highlight boxes
  const highlights = [];
  if (activeNoteCell) {
    highlights.push(
      <Rect
        key="activeNote"
        x={activeNoteCell.x * gridSize}
        y={activeNoteCell.y * gridSize}
        width={gridSize}
        height={gridSize}
        stroke="yellow"
        strokeWidth={2}
        dash={[4, 4]}
      />
    );
  }
  if (selectedNoteCell) {
    highlights.push(
      <Rect
        key="selectedNote"
        x={selectedNoteCell.x * gridSize}
        y={selectedNoteCell.y * gridSize}
        width={gridSize}
        height={gridSize}
        stroke="red"
        strokeWidth={2}
      />
    );
  }

  return (
    <Layer listening={false}>
      <KonvaImage
        image={mapImage}
        width={width * gridSize}
        height={height * gridSize}
        perfectDrawEnabled={false}
      />
      {gridLines}
      {noteTriangles}
      {highlights}
    </Layer>
  );
}
