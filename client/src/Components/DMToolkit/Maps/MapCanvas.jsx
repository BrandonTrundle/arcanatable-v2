import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { moveTokenOnMap } from "../../../utils/token/tokenMovement";
import { useEscapeDeselect } from "../../../hooks/tokens/useEscapeDeselect";
import { calculateVisibleCells } from "../../../utils/fogOfWar/calculateVisibleCells";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";
import TokenSprite from "./MapTokens/TokenSprite";
import FogLayer from "./Layers/FogLayer";

export default function MapCanvas({
  map,
  gridVisible,
  onCanvasDrop,
  setMapData,
  activeLayer,
  fogVisible,
  toolMode,
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
    setMapData((prevMap) => {
      // Move token on the map
      const updatedMap = moveTokenOnMap(prevMap, id, newPos);

      const layerTokens = updatedMap.layers?.[activeLayer]?.tokens || [];
      const token = layerTokens.find((t) => t.id === id);

      // Only update vision for player tokens
      if (!token || token.type !== "player") return updatedMap;

      const visibleCells = calculateVisibleCells(
        token,
        updatedMap.width,
        updatedMap.height,
        updatedMap.fogOfWar?.blockingCells || []
      );

      const cellKey = (c) => `${c.x},${c.y}`;
      const existing = updatedMap.fogOfWar?.revealedCells || [];
      const combined = new Map(existing.map((c) => [cellKey(c), c]));

      for (const cell of visibleCells) {
        combined.set(cellKey(cell), cell);
      }

      return {
        ...updatedMap,
        fogOfWar: {
          ...updatedMap.fogOfWar,
          revealedCells: visibleCells,
          blockingCells: updatedMap.fogOfWar?.blockingCells || [],
        },
      };
    });
  };

  const getCellFromPointer = (pointer) => {
    return {
      x: Math.floor(pointer.x / map.gridSize),
      y: Math.floor(pointer.y / map.gridSize),
    };
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
        const cell = getCellFromPointer(pointer);
        console.log("Pointer position:", pointer);
        console.log("Grid cell:", cell);
        console.log("Tool mode:", toolMode);

        if (toolMode === "paint-blockers") {
          setMapData((prevMap) => {
            const blocking = prevMap.fogOfWar?.blockingCells || [];
            const key = `${cell.x},${cell.y}`;
            const existing = new Set(blocking.map((c) => `${c.x},${c.y}`));
            console.log("Blocking before update:", blocking);

            let updated;
            if (existing.has(key)) {
              updated = blocking.filter(
                (c) => !(c.x === cell.x && c.y === cell.y)
              );
            } else {
              updated = [...blocking, { x: cell.x, y: cell.y }];
            }

            console.log("Blocking after update:", updated);

            return {
              ...prevMap,
              fogOfWar: {
                ...prevMap.fogOfWar,
                blockingCells: updated,
              },
            };
          });

          return;
        }

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

      {toolMode === "paint-blockers" && (
        <Layer>
          {(map.fogOfWar?.blockingCells || []).map((cell) => (
            <Rect
              key={`blocker-${cell.x}-${cell.y}`}
              x={cell.x * map.gridSize}
              y={cell.y * map.gridSize}
              width={map.gridSize}
              height={map.gridSize}
              fill="red"
              opacity={0.4}
              listening={false}
            />
          ))}
        </Layer>
      )}

      {fogVisible && (
        <FogLayer
          width={map.width}
          height={map.height}
          gridSize={map.gridSize}
          revealedCells={map.fogOfWar?.revealedCells || []}
        />
      )}

      <Layer>
        {Object.entries(map.layers || {}).flatMap(([layerKey, layerData]) =>
          (layerData.tokens || []).map((token) => (
            <TokenSprite
              key={token.id}
              token={token}
              gridSize={map.gridSize}
              isSelected={token.id === selectedTokenId}
              onSelect={
                layerKey === activeLayer ? setSelectedTokenId : () => {}
              }
              onTokenMove={
                layerKey === activeLayer ? handleTokenMove : () => {}
              }
              immediatePositionOverride={
                token.id === selectedTokenId ? token.position : null
              }
              opacity={layerKey === "dm" ? 0.5 : 1}
            />
          ))
        )}
      </Layer>

      {/* Placeholder: AoE Layer */}
      <Layer>{/* TODO: drawing tools */}</Layer>

      {/* Optional FX Layer */}
      {/* <Layer></Layer> */}
    </Stage>
  );
}
