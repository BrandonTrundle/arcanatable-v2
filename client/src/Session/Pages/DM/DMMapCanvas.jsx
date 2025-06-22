import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useDMTokenControl } from "./hooks/useDMTokenControl";
import { useDMAssetControl } from "./hooks/useDMAssetControl";
import { useTokenSettings } from "./hooks/useTokenSettings";
import { useMapDropHandler } from "./hooks/useMapDropHandler";
import { useMapImage } from "./hooks/useMapImage";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";
import socket from "../../../socket";

import styles from "../../styles/MapCanvas.module.css";

export default function DMMapCanvas({
  sessionCode,
  map,
  notes,
  gridVisible,
  onCanvasDrop,
  setMapData,
  campaign,
  activeLayer,
  fogVisible,
  toolMode,
  setActiveNoteCell,
  activeNoteCell,
  selectedNoteCell,
  onSelectToken,
  user,
}) {
  const stageRef = useRef();
  const allPlayers = campaign?.players || [];
  const { mapImage, imageReady } = useMapImage(map);
  const { handleCanvasMouseUp } = useMapDropHandler(map, onCanvasDrop);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const {
    selectedTokenId,
    handleSelectToken,
    handleTokenMove,
    tokenSettingsTarget,
    setTokenSettingsTarget,
    handleOpenSettings,
  } = useDMTokenControl({
    map,
    setMapData,
    sessionCode,
    toolMode,
    onSelectToken,
    user,
  });

  useEffect(() => {
    const stage = stageRef.current?.getStage();
    const container = stage?.container();

    const handleWheel = (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      setStageScale(newScale);

      setStagePos({
        x:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
          newScale,
      });
    };

    container?.addEventListener("wheel", handleWheel);
    return () => container?.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const handleDrop = (e) => {
      e.preventDefault();

      const json = e.dataTransfer.getData("application/json");
      if (!json) return;

      const droppedToken = JSON.parse(json);

      const stage = stageRef.current.getStage();
      const rect = stage.container().getBoundingClientRect();

      const scale = stage.scaleX();
      const pointerX = (e.clientX - rect.left - stage.x()) / scale;
      const pointerY = (e.clientY - rect.top - stage.y()) / scale;

      const cellX = Math.floor(pointerX / map.gridSize);
      const cellY = Math.floor(pointerY / map.gridSize);

      droppedToken.position = { x: cellX, y: cellY };
      droppedToken.id = crypto.randomUUID();
      droppedToken._layer = activeLayer; // ✅ Ensure player side knows the layer

      const updatedMap = { ...map };
      if (!updatedMap.layers[activeLayer].tokens) {
        updatedMap.layers[activeLayer].tokens = [];
      }
      updatedMap.layers[activeLayer].tokens.push(droppedToken);
      setMapData(updatedMap);

      socket.emit("dmDropToken", {
        sessionCode: sessionCode,
        mapId: map._id,
        token: droppedToken,
      });
    };

    const stage = stageRef.current?.container();
    if (stage) {
      stage.addEventListener("dragover", (e) => e.preventDefault());
      stage.addEventListener("drop", handleDrop);
    }

    return () => {
      if (stage) {
        stage.removeEventListener("dragover", (e) => e.preventDefault());
        stage.removeEventListener("drop", handleDrop);
      }
    };
  }, [map, activeLayer, setMapData, sessionCode]);

  const { selectedAssetId, setSelectedAssetId, handleMoveAsset } =
    useDMAssetControl(setMapData, activeLayer);

  const { deleteToken, changeTokenLayer, changeShowNameplate, changeOwner } =
    useTokenSettings({
      map,
      setMapData,
      sessionCode,
      setTokenSettingsTarget,
    });

  if (!map) {
    return <div className={styles.mapCanvas}>No map loaded.</div>;
  }

  const stageWidth = map?.width * map?.gridSize || 0;
  const stageHeight = map?.height * map?.gridSize || 0;

  return (
    <div className={styles.mapCanvas}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        draggable
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
        onWheel={(e) => {
          e.evt.preventDefault();
          const scaleBy = 1.05;
          const stage = e.target.getStage();
          const oldScale = stage.scaleX();

          const mousePointTo = {
            x: (stage.getPointerPosition().x - stage.x()) / oldScale,
            y: (stage.getPointerPosition().y - stage.y()) / oldScale,
          };

          const direction = e.evt.deltaY > 0 ? 1 : -1;
          const newScale =
            direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
          setStageScale(newScale);

          const newPos = {
            x: stage.getPointerPosition().x - mousePointTo.x * newScale,
            y: stage.getPointerPosition().y - mousePointTo.y * newScale,
          };
          setStagePos(newPos);
        }}
        onMouseUp={handleCanvasMouseUp}
        style={{ border: "2px solid #444" }}
      >
        <SessionStaticMapLayer
          mapImage={mapImage}
          imageReady={imageReady}
          gridVisible={gridVisible}
          map={map}
          notes={notes}
          activeNoteCell={toolMode === "notes" ? activeNoteCell : null}
          selectedNoteCell={toolMode === "notes" ? selectedNoteCell : null}
        />

        <SessionFogAndBlockerLayer
          width={map.width}
          height={map.height}
          gridSize={map.gridSize}
          revealedCells={map.fogOfWar?.revealedCells || []}
          blockingCells={map.fogOfWar?.blockingCells || []}
          showFog={fogVisible}
          showBlockers={toolMode === "paint-blockers"}
        />

        <Layer>
          <SessionMapAssetLayer
            map={map}
            gridSize={map.gridSize}
            activeLayer={activeLayer}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            onMoveAsset={handleMoveAsset}
          />

          <SessionMapTokenLayer
            map={map}
            gridSize={map.gridSize}
            activeLayer={activeLayer}
            selectedTokenId={selectedTokenId}
            onOpenSettings={handleOpenSettings}
            disableInteraction={toolMode !== "select"}
            onSelectToken={handleSelectToken}
            onTokenMove={(id, newPos) => {
              if (toolMode !== "select") return;
              handleTokenMove(id, newPos);
            }}
          />
        </Layer>

        <Layer>{/* Reserved for other Layers */}</Layer>
      </Stage>
      {tokenSettingsTarget && (
        <TokenSettingsPanel
          currentUserId={user._id}
          allPlayers={allPlayers}
          token={tokenSettingsTarget}
          isDM={true}
          onClose={() => setTokenSettingsTarget(null)}
          onDeleteToken={deleteToken}
          onChangeLayer={changeTokenLayer}
          onChangeShowNameplate={changeShowNameplate}
          onChangeOwner={changeOwner}
        />
      )}
    </div>
  );
}
