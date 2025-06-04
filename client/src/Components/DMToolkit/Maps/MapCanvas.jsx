import React, { useRef, useState } from "react";
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
