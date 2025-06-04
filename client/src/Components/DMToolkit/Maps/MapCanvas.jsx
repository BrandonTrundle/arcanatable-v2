import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";
import TokenSprite from "./MapTokens/TokenSprite";
import { moveTokenOnMap } from "../../../utils/token/tokenMovement";
import { useEscapeDeselect } from "../../../hooks/tokens/useEscapeDeselect";

export default function MapCanvas({
  map,
  gridVisible,
  onCanvasDrop,
  setMapData,
  activeLayer,
}) {
  const isFirefox =
    typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
  const scaleFactor = isFirefox ? 1 : 1;

  const [mapImage] = useImage(map.image, "anonymous");
  const imageReady = !!mapImage;

  const stageRef = useRef();
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  useEscapeDeselect(() => setSelectedTokenId(null));

  const stageWidth = map.width * map.gridSize * scaleFactor;
  const stageHeight = map.height * map.gridSize * scaleFactor;

  const handleTokenMove = (id, newPos) => {
    setMapData((prevMap) => moveTokenOnMap(prevMap, id, newPos));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedTokenId) return;

      const currentToken = map.layers?.[activeLayer]?.tokens.find(
        (t) => t.id === selectedTokenId
      );

      if (!currentToken) return;

      const delta = { x: 0, y: 0 };

      switch (e.key) {
        case "ArrowUp":
          delta.y = -1;
          break;
        case "ArrowDown":
          delta.y = 1;
          break;
        case "ArrowLeft":
          delta.x = -1;
          break;
        case "ArrowRight":
          delta.x = 1;
          break;
        default:
          return;
      }

      const newPos = {
        x: currentToken.position.x + delta.x,
        y: currentToken.position.y + delta.y,
      };

      handleTokenMove(selectedTokenId, newPos);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTokenId, map, activeLayer]);

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={1 / scaleFactor}
      scaleY={1 / scaleFactor}
      ref={stageRef}
      style={{ border: "2px solid #444" }}
      onMouseUp={(e) => {
        const pointer = e.target.getStage().getPointerPosition();
        onCanvasDrop(pointer);
      }}
    >
      {/* Background Map Layer */}
      <Layer>
        {imageReady && (
          <KonvaImage
            image={mapImage}
            width={stageWidth}
            height={stageHeight}
            perfectDrawEnabled={false}
          />
        )}
      </Layer>

      {/* Flattened Grid + Token Layer */}
      {gridVisible && (
        <GridLayer
          width={map.width}
          height={map.height}
          gridSize={map.gridSize}
          color="#444"
          opacity={1}
        />
      )}

      <Layer>
        {(map.layers?.[activeLayer]?.tokens || []).map((token) => (
          <TokenSprite
            key={token.id}
            token={token}
            gridSize={map.gridSize}
            isSelected={token.id === selectedTokenId}
            onSelect={setSelectedTokenId}
            onTokenMove={handleTokenMove}
            immediatePositionOverride={
              token.id === selectedTokenId ? token.position : null
            }
          />
        ))}
      </Layer>

      {/* Placeholder: AoE Layer */}
      <Layer>{/* TODO: drawing tools */}</Layer>

      {/* Optional FX Layer */}
      {/* <Layer></Layer> */}
    </Stage>
  );
}
