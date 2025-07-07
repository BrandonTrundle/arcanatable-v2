import { useRef, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useDMTokenControl } from "./hooks/useDMTokenControl";
import { useDMAssetControl } from "./hooks/useDMAssetControl";
import { useTokenSettings } from "./hooks/useTokenSettings";
import { useMapDropHandler } from "./hooks/useMapDropHandler";
import { useMapImage } from "./hooks/useMapImage";
import { useZoomAndPan } from "./hooks/useZoomAndPan";
import { useTokenDropHandler } from "./hooks/useTokenDropHandler";
import { usePingBroadcast } from "./hooks/usePingBroadcast";
import { handleMapClickAction } from "./utils/handleMapClickAction";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import SessionAoELayer from "../../MapLayers/SessionAoELayer";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";
import AoEControlPanel from "../../Components/Shared/AoEControlPanel";
import styles from "../../styles/MapCanvas.module.css";
import socket from "../../../socket";

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
  selectorMode,
  user,
  activeTurnTokenId,
  aoes,
  setAoes,
}) {
  const stageRef = useRef();
  const { stageScale, stagePos, setStagePos, handleWheel } =
    useZoomAndPan(stageRef);
  useTokenDropHandler(stageRef, map, setMapData, activeLayer, sessionCode);
  const allPlayers = campaign?.players || [];
  const { mapImage, imageReady } = useMapImage(map);
  const { handleCanvasMouseUp } = useMapDropHandler(map, onCanvasDrop);

  const [isDraggingAoE, setIsDraggingAoE] = useState(false);
  const [aoeDragOrigin, setAoeDragOrigin] = useState(null);
  const [aoeDragTarget, setAoeDragTarget] = useState(null);
  const [selectedShape, setSelectedShape] = useState("circle");
  const [shapeSettings, setShapeSettings] = useState({});
  const [isAnchored, setIsAnchored] = useState(false);
  const [snapMode, setSnapMode] = useState("center");

  const snapToGrid = (value, gridSize) =>
    Math.round(value / gridSize) * gridSize;

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

  const { selectedAssetId, setSelectedAssetId, handleMoveAsset } =
    useDMAssetControl(setMapData, activeLayer);
  const { deleteToken, changeTokenLayer, changeShowNameplate, changeOwner } =
    useTokenSettings({ map, setMapData, sessionCode, setTokenSettingsTarget });

  const stageWidth = map?.width * map?.gridSize || 0;
  const stageHeight = map?.height * map?.gridSize || 0;

  usePingBroadcast(stageRef, map);

  if (!map) return <div className={styles.mapCanvas}>No map loaded.</div>;

  return (
    <div className={styles.mapCanvas}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        draggable={!isDraggingAoE}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        onWheel={handleWheel}
        onMouseUp={(e) => {
          handleCanvasMouseUp(e);
          if (isDraggingAoE) {
            if (e.evt.button === 0) {
              const pointer = e.target.getStage().getPointerPosition();
              const scale = stageRef.current.scaleX();
              let x = (pointer.x - stageRef.current.x()) / scale;
              let y = (pointer.y - stageRef.current.y()) / scale;

              if (snapMode === "center") {
                x = snapToGrid(x, map.gridSize) + map.gridSize / 2;
                y = snapToGrid(y, map.gridSize) + map.gridSize / 2;
              } else if (snapMode === "corner") {
                x = snapToGrid(x, map.gridSize);
                y = snapToGrid(y, map.gridSize);
              }

              const newAoE = {
                id: Date.now(),
                x,
                y,
                type: selectedShape,
                color: shapeSettings[selectedShape]?.color || "#ff0000",
                opacity: 0.4,
              };

              const ftToPx = (ft) => (map.gridSize / 5) * ft;

              if (selectedShape === "circle")
                newAoE.radius = ftToPx(
                  shapeSettings[selectedShape]?.radius || 20
                );
              if (selectedShape === "cone") {
                newAoE.radius = ftToPx(
                  shapeSettings[selectedShape]?.radius || 30
                );
                newAoE.angle = shapeSettings[selectedShape]?.angle || 60;

                const dx = x - aoeDragOrigin.x;
                const dy = y - aoeDragOrigin.y;
                newAoE.direction = (Math.atan2(dy, dx) * 180) / Math.PI;
              }
              if (selectedShape === "square")
                newAoE.width = ftToPx(
                  shapeSettings[selectedShape]?.width || 30
                );
              if (selectedShape === "rectangle") {
                newAoE.width = ftToPx(
                  shapeSettings[selectedShape]?.width || 40
                );
                newAoE.height = ftToPx(
                  shapeSettings[selectedShape]?.height || 20
                );
              }

              setAoes((prev) => [...prev, newAoE]);
              socket.emit("aoePlaced", { sessionCode, aoe: newAoE });
            }

            setIsDraggingAoE(false);
            setAoeDragOrigin(null);
            setAoeDragTarget(null);
          }
        }}
        onMouseDown={(e) => {
          if (toolMode === "aoe" && e.evt.button === 0) {
            const pointer = e.target.getStage().getPointerPosition();
            const scale = stageRef.current.scaleX();
            let x = (pointer.x - stageRef.current.x()) / scale;
            let y = (pointer.y - stageRef.current.y()) / scale;

            if (snapMode === "center") {
              x = snapToGrid(x, map.gridSize) + map.gridSize / 2;
              y = snapToGrid(y, map.gridSize) + map.gridSize / 2;
            } else if (snapMode === "corner") {
              x = snapToGrid(x, map.gridSize);
              y = snapToGrid(y, map.gridSize);
            }

            setIsDraggingAoE(true);
            setAoeDragOrigin({ x, y });
            setAoeDragTarget({ x, y });
          }
        }}
        onMouseMove={(e) => {
          if (isDraggingAoE) {
            const pointer = e.target.getStage().getPointerPosition();
            const scale = stageRef.current.scaleX();
            let x = (pointer.x - stageRef.current.x()) / scale;
            let y = (pointer.y - stageRef.current.y()) / scale;

            if (snapMode === "center") {
              x = snapToGrid(x, map.gridSize) + map.gridSize / 2;
              y = snapToGrid(y, map.gridSize) + map.gridSize / 2;
            } else if (snapMode === "corner") {
              x = snapToGrid(x, map.gridSize);
              y = snapToGrid(y, map.gridSize);
            }

            setAoeDragTarget({ x, y });
          }
        }}
        onClick={(e) =>
          handleMapClickAction({ e, map, sessionCode, toolMode, selectorMode })
        }
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

        <SessionAoELayer
          aoes={aoes}
          isDraggingAoE={isDraggingAoE}
          aoeDragOrigin={aoeDragOrigin}
          aoeDragTarget={aoeDragTarget}
          selectedShape={selectedShape}
          shapeSettings={shapeSettings}
          cellSize={map.gridSize}
          onRightClickAoE={(aoe) => {
            setAoes((prev) => prev.filter((a) => a.id !== aoe.id));
            socket.emit("aoeDeleted", { sessionCode, aoeId: aoe.id });
          }}
        />

        <Layer id="PingLayer">
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
            disableInteraction={
              toolMode !== "select" || selectorMode !== "selector"
            }
            onSelectToken={handleSelectToken}
            onTokenMove={(id, newPos) => {
              if (toolMode !== "select") return;
              handleTokenMove(id, newPos);
            }}
            activeTurnTokenId={activeTurnTokenId}
          />
        </Layer>
      </Stage>

      {toolMode === "aoe" && (
        <AoEControlPanel
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          isAnchored={isAnchored}
          setIsAnchored={setIsAnchored}
          shapeSettings={shapeSettings}
          setShapeSettings={setShapeSettings}
          snapMode={snapMode}
          setSnapMode={setSnapMode}
        />
      )}

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
