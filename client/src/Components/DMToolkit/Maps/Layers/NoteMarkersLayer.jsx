// components/DMToolkit/Maps/Layers/NoteMarkersLayer.jsx
import React from "react";
import { Layer, Line } from "react-konva";

export default function NoteMarkersLayer({ notes, gridSize }) {
  return (
    <Layer listening={false}>
      {notes
        .filter((n) => n.cell)
        .map((note) => {
          const { x, y } = note.cell;
          const gx = x * gridSize;
          const gy = y * gridSize;

          // Small triangle in bottom-right corner
          const triangleSize = gridSize * 0.25;

          return (
            <Line
              key={`note-marker-${note.id}`}
              points={[
                gx + gridSize,
                gy + gridSize, // bottom-right
                gx + gridSize - triangleSize,
                gy + gridSize, // bottom-left of triangle
                gx + gridSize,
                gy + gridSize - triangleSize, // top-right of triangle
              ]}
              closed
              fill="orange"
              opacity={0.8}
            />
          );
        })}
    </Layer>
  );
}
