import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";
import TokenSprite from "./MapTokens/TokenSprite";
import { moveTokenOnMap } from "../../../utils/token/tokenMovement";

export default function MapCanvas({
  map,
  gridVisible,
  onCanvasDrop,
  setMapData,
}) {
  const [image] = useImage(map.image);
  const stageRef = useRef();
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const stageWidth = map.width * map.gridSize;
  const stageHeight = map.height * map.gridSize;

  const handleTokenMove = (id, newPos) => {
    console.log(`🔁 Attempting to move token: ${id} to new position:`, newPos);

    setMapData((prevMap) => {
      const updatedMap = moveTokenOnMap(prevMap, id, newPos);
      console.log(`🗺️ Updated map state returned.`);
      return updatedMap;
    });
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      ref={stageRef}
      style={{ border: "2px solid #444" }}
      onMouseUp={(e) => {
        const pointer = e.target.getStage().getPointerPosition();
        onCanvasDrop(pointer);
      }}
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
      <Layer>
        {map.layers?.dm?.tokens?.map((token) => (
          <TokenSprite
            key={token.id}
            token={token}
            gridSize={map.gridSize}
            isSelected={token.id === selectedTokenId}
            onSelect={setSelectedTokenId}
            onTokenMove={handleTokenMove}
          />
        ))}
      </Layer>

      {/* 4. Player Token Layer */}
      <Layer>
        {map.layers?.player?.tokens?.map((token) => (
          <TokenSprite
            key={token.id}
            token={token}
            gridSize={map.gridSize}
            isSelected={token.id === selectedTokenId}
            onSelect={setSelectedTokenId}
            onTokenMove={handleTokenMove}
          />
        ))}
      </Layer>

      {/* 5. AoE Layer */}
      <Layer>{/* TODO: drawing tools */}</Layer>

      {/* 6. FX Layer (optional) */}
      {/* <Layer></Layer> */}
    </Stage>
  );
}
