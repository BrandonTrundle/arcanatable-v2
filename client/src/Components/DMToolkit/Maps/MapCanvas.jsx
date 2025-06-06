import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { moveTokenOnMap } from "../../../utils/token/tokenMovement";
import { useEscapeDeselect } from "../../../hooks/tokens/useEscapeDeselect";
import { calculateVisibleCells } from "../../../utils/fogOfWar/calculateVisibleCells";
import { getCellFromPointer } from "../../../utils/grid/coordinates";
import { useKeyboardTokenControl } from "../../../hooks/tokens/useKeyboardTokenControl";
import { handleTokenMoveWithFog } from "../../../utils/token/tokenMoveWithFog";
import { placeNoteAtCell } from "../../../utils/notes/placeNoteAtCell";
import useImage from "use-image";
import GridLayer from "./Layers/GridLayer";
import TokenSprite from "./MapTokens/TokenSprite";
import FogLayer from "./Layers/FogLayer";
import MapTokenLayer from "../Maps/Layers/MapTokenLayer";
import MapImageLayer from "./Layers/MapImageLayer";
import BlockerLayer from "./Layers/BlockerLayer";

export default function MapCanvas({
  map,
  notes,
  gridVisible,
  onCanvasDrop,
  setMapData,
  activeLayer,
  fogVisible,
  toolMode,
  setActiveNoteCell,
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
    setMapData((prevMap) =>
      handleTokenMoveWithFog({
        map: prevMap,
        id,
        newPos,
        activeLayer,
      })
    );
  };

  useKeyboardTokenControl({
    selectedTokenId,
    map,
    activeLayer,
    onMove: handleTokenMove,
  });

  const handleCanvasMouseUp = (e) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();

    if (
      !pointer ||
      typeof pointer.x !== "number" ||
      typeof pointer.y !== "number"
    ) {
      console.warn("Invalid pointer position", pointer);
      return;
    }

    const cell = getCellFromPointer(pointer, map.gridSize);

    if (!cell || typeof cell.x !== "number" || typeof cell.y !== "number") {
      console.warn("Invalid cell derived from pointer", cell);
      return;
    }

    if (toolMode === "paint-blockers") {
      console.log("🛠 Tool mode: paint-blockers");

      console.log("📍 Cell to toggle:", cell);

      setMapData((prevMap) => {
        const blocking = prevMap.fogOfWar?.blockingCells || [];
        console.log("📦 Existing blocking cells:", blocking);

        const key = `${cell.x},${cell.y}`;
        const existing = new Set(blocking.map((c) => `${c.x},${c.y}`));
        const isAlreadyBlocked = existing.has(key);
        console.log(`🔍 Is cell already blocked?`, isAlreadyBlocked);

        let updated;
        if (isAlreadyBlocked) {
          updated = blocking.filter((c) => !(c.x === cell.x && c.y === cell.y));
        } else {
          updated = [...blocking, { x: cell.x, y: cell.y }];
        }

        console.log("✅ Updated blocking cells:", updated);

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

    if (toolMode === "notes") {
      setMapData((prevMap) => {
        const updated = placeNoteAtCell({ map: prevMap, cell });
        if (updated !== prevMap && setActiveNoteCell) {
          setActiveNoteCell(cell);
        }
        return updated;
      });
      return;
    }

    onCanvasDrop(pointer);
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={1 / scaleFactor}
      scaleY={1 / scaleFactor}
      ref={stageRef}
      style={{ border: "2px solid #444" }}
      onMouseUp={handleCanvasMouseUp}
    >
      <MapImageLayer
        image={mapImage}
        width={stageWidth}
        height={stageHeight}
        imageReady={imageReady}
      />

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
        <BlockerLayer
          blockingCells={map.fogOfWar?.blockingCells}
          gridSize={map.gridSize}
        />
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
        <MapTokenLayer
          map={map}
          gridSize={map.gridSize}
          activeLayer={activeLayer}
          selectedTokenId={selectedTokenId}
          onSelectToken={setSelectedTokenId}
          onTokenMove={handleTokenMove}
        />
      </Layer>

      <Layer>{/* TODO: drawing tools */}</Layer>
    </Stage>
  );
}
