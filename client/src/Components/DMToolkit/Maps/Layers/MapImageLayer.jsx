import React from "react";
import { Layer, Image as KonvaImage } from "react-konva";

export default function MapImageLayer({ image, width, height, imageReady }) {
  if (!imageReady) return null;

  return (
    <Layer>
      <KonvaImage
        image={image}
        width={width}
        height={height}
        perfectDrawEnabled={false}
      />
    </Layer>
  );
}
