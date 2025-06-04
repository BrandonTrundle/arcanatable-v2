import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";
import TokenSprite from "./MapTokens/TokenSprite";

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
      const updatedMap = { ...prevMap };
      const clampedX = Math.max(0, Math.min(newPos.x, prevMap.width - 1));
      const clampedY = Math.max(0, Math.min(newPos.y, prevMap.height - 1));

      for (const layerKey of ["player", "dm", "hidden"]) {
        const tokens = updatedMap.layers[layerKey].tokens;
        const index = tokens.findIndex((t) => t.id === id);

        console.log(`🔍 Checking layer: "${layerKey}"... Token index:`, index);

        if (index !== -1) {
          const oldToken = tokens[index];

          if (
            oldToken.position.x === clampedX &&
            oldToken.position.y === clampedY
          ) {
            console.log(
              "⚠️ Token already at snapped position. Skipping update."
            );
            return prevMap;
          }

          const updatedToken = {
            ...oldToken,
            position: { x: clampedX, y: clampedY },
          };

          console.log(
            `✅ Found token in "${layerKey}" layer. Old:`,
            oldToken.position,
            "→ New:",
            updatedToken.position
          );

          const updatedTokens = [...tokens];
          updatedTokens[index] = updatedToken;

          updatedMap.layers[layerKey] = {
            ...updatedMap.layers[layerKey],
            tokens: updatedTokens,
          };

          console.log(`📦 Layer "${layerKey}" tokens updated.`);
          break;
        }
      }

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
