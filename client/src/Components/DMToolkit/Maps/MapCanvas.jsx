import React, { useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";

export default function MapCanvas({ map, gridVisible }) {
  const [image] = useImage(map.image);
  const stageRef = useRef();

  const stageWidth = map.width * map.gridSize;
  const stageHeight = map.height * map.gridSize;

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      ref={stageRef}
      style={{ border: "2px solid #444" }}
    >
      {/* 1. Map Image Layer */}
      <Layer>
        {image && (
          <KonvaImage image={image} width={stageWidth} height={stageHeight} />
        )}
      </Layer>

      {/* 2. Grid Layer */}
      <GridLayer
        width={map.width}
        height={map.height}
        gridSize={map.gridSize}
        color="#444"
        opacity={gridVisible ? 1 : 0}
      />

      {/* 3. DM Token Layer */}
      <Layer>{/* TODO: render hidden tokens */}</Layer>

      {/* 4. Player Token Layer */}
      <Layer>{/* TODO: render visible tokens */}</Layer>

      {/* 5. AoE Layer */}
      <Layer>{/* TODO: drawing tools */}</Layer>

      {/* 6. FX Layer (optional) */}
      {/* <Layer></Layer> */}
    </Stage>
  );
}
