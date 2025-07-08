import { useState, useContext } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import { AuthContext } from "../../../context/AuthContext";
import { usePingBroadcast } from "../DM/hooks/usePingBroadcast";
import { useRulerControl } from "../DM/hooks/useRulerControl";
import { getSnappedPointer } from "../DM/utils/snapUtils";
import { useAoEPlacement } from "./hooks/useAoEPlacement";
import { useRulerMouseHandlers } from "./hooks/useRulerMouseHandlers";
import { useAoEDragState } from "./hooks/useAoEDragState";
import usePlayerMapZoomHandler from "./hooks/usePlayerZoomHandler";
import usePlayerMapClickHandler from "./hooks/usePlayerMapClickHandler";
import usePlayerTokenSelection from "./hooks/usePlayerTokenSelection";
import usePlayerTokenDropHandler from "./hooks/usePlayerTokenDropHandler";
import usePlayerTokenMovement from "./hooks/usePlayerTokenMovement";
import usePlayerTokenDeletion from "./hooks/usePlayerTokenDeletion";
import usePlayerTokenSettings from "./hooks/usePlayerTokenSettings";
import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import MeasurementLayer from "../../MapLayers/MeasurementLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import SessionAoELayer from "../../MapLayers/SessionAoELayer";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";
import socket from "../../../socket";
import styles from "../../styles/MapCanvas.module.css";

export default function PlayerMapCanvas({
  sessionCode,
  map,
  fogVisible,
  setActiveMap,
  toolMode,
  campaign,
  stageRef,
  selectorMode,
  activeTurnTokenId,
  aoes,
  setAoes,
  selectedShape,
  shapeSettings,
  snapMode,
  measurementColor,
  broadcastEnabled,
  lockMeasurement,
  setLockedMeasurements,
  lockedMeasurements,
}) {
  const { user } = useContext(AuthContext);
  const {
    isMeasuring,
    measureOrigin,
    measureTarget,
    startMeasurement,
    updateMeasurementTarget,
    finalizeMeasurement,
  } = useRulerControl({
    map,
    measurementColor,
    user,
    lockMeasurement,
    broadcastEnabled,
    setLockedMeasurements,
    sessionCode,
  });

  const [mapImage] = useImage(map?.image, "anonymous");
  const imageReady = !!mapImage;
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState(null);

  const placeAoE = useAoEPlacement(
    map,
    shapeSettings,
    selectedShape,
    sessionCode,
    setAoes
  );

  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const {
    isDraggingAoE,
    setIsDraggingAoE,
    aoeDragOrigin,
    setAoeDragOrigin,
    aoeDragTarget,
    setAoeDragTarget,
    resetAoEDrag,
  } = useAoEDragState();

  const isAoEToolActive = ["cone", "circle", "square", "rectangle"].includes(
    selectedShape
  );

  const handleZoom = usePlayerMapZoomHandler(setStageScale, setStagePos);
  usePingBroadcast(stageRef, map, stageScale, stagePos, sessionCode);

  const handleMapClick = usePlayerMapClickHandler({
    toolMode,
    selectorMode,
    map,
    sessionCode,
  });

  const handleDrop = usePlayerTokenDropHandler(
    map,
    setActiveMap,
    sessionCode,
    user,
    stageRef
  );

  const handleTokenMove = usePlayerTokenMovement(
    map,
    setActiveMap,
    sessionCode,
    user
  );

  const handleDeleteToken = usePlayerTokenDeletion(
    map,
    setActiveMap,
    sessionCode,
    setTokenSettingsTarget
  );

  const { handleChangeOwner, handleChangeShowNameplate } =
    usePlayerTokenSettings(
      map,
      setActiveMap,
      sessionCode,
      setTokenSettingsTarget
    );

  const { selectedTokenId, handleSelectToken } = usePlayerTokenSelection(
    map,
    user
  );

  const {
    onMouseDown: handleRulerMouseDown,
    onMouseMove: handleRulerMouseMove,
    onMouseUp: handleRulerMouseUp,
  } = useRulerMouseHandlers({
    toolMode,
    isMeasuring,
    startMeasurement,
    updateMeasurementTarget,
    finalizeMeasurement,
    stageRef,
    map,
    snapMode,
  });

  const allPlayers = campaign?.players || [];
  const stageWidth = map?.width * map?.gridSize || 0;
  const stageHeight = map?.height * map?.gridSize || 0;

  if (!map) {
    return <div className={styles.mapCanvas}>No map loaded.</div>;
  }

  return (
    <div
      className={styles.mapCanvas}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        draggable={!isAoEToolActive && !isMeasuring}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
        onWheel={handleZoom}
        onClick={handleMapClick}
        onMouseDown={(e) => {
          const snapped = getSnappedPointer(
            e.target.getStage().getPointerPosition(),
            stageRef.current,
            map.gridSize,
            snapMode
          );

          if (!toolMode && e.evt.button === 0) {
            setIsPanning(true);
            setLastPointerPosition(e.target.getStage().getPointerPosition());
          }

          if (toolMode === "aoe" && e.evt.button === 0) {
            setIsDraggingAoE(true);
            setAoeDragOrigin(snapped);
            setAoeDragTarget(snapped);
          }

          if (toolMode === "ruler") {
            handleRulerMouseDown(e);
          }
        }}
        onMouseMove={(e) => {
          const snapped = getSnappedPointer(
            e.target.getStage().getPointerPosition(),
            stageRef.current,
            map.gridSize,
            snapMode
          );

          if (isDraggingAoE) setAoeDragTarget(snapped);
          if (toolMode === "ruler") handleRulerMouseMove(e);

          if (isPanning && lastPointerPosition) {
            const stage = stageRef.current;
            const pointer = stage.getPointerPosition();
            const dx = pointer.x - lastPointerPosition.x;
            const dy = pointer.y - lastPointerPosition.y;

            stage.x(stage.x() + dx);
            stage.y(stage.y() + dy);
            setStagePos({ x: stage.x(), y: stage.y() });

            setLastPointerPosition(pointer);
          }
        }}
        onMouseUp={(e) => {
          const snapped = getSnappedPointer(
            e.target.getStage().getPointerPosition(),
            stageRef.current,
            map.gridSize,
            snapMode
          );

          if (isDraggingAoE && e.evt.button === 0)
            placeAoE(snapped, aoeDragOrigin);
          if (isDraggingAoE) {
            resetAoEDrag();
          }

          if (toolMode === "ruler") handleRulerMouseUp(e);

          if (isPanning) {
            setIsPanning(false);
            setLastPointerPosition(null);
          }
        }}
      >
        <SessionStaticMapLayer
          mapImage={mapImage}
          imageReady={imageReady}
          gridVisible={true}
          map={map}
          notes={map.notes || []}
        />

        <SessionFogAndBlockerLayer
          width={map.width}
          height={map.height}
          gridSize={map.gridSize}
          revealedCells={map.fogOfWar?.revealedCells || []}
          blockingCells={map.fogOfWar?.blockingCells || []}
          showFog={fogVisible}
          showBlockers={false}
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
            map={{
              ...map,
              layers: {
                player: map.layers?.player,
                hidden: map.layers?.hidden,
              },
            }}
            gridSize={map.gridSize}
            activeLayer="player"
            selectedAssetId={null}
            onSelectAsset={() => {}}
            onMoveAsset={() => {}}
          />

          <SessionMapTokenLayer
            map={{
              ...map,
              layers: {
                player: map.layers?.player,
                hidden: map.layers?.hidden,
              },
            }}
            gridSize={map.gridSize}
            activeLayer="player"
            selectedTokenId={selectedTokenId}
            onOpenSettings={setTokenSettingsTarget}
            disableInteraction={toolMode !== "select"}
            onSelectToken={handleSelectToken}
            onTokenMove={handleTokenMove}
            currentUserId={user.id}
            activeTurnTokenId={activeTurnTokenId}
          />
        </Layer>

        <MeasurementLayer
          lockedMeasurements={lockedMeasurements}
          activeMeasurement={
            isMeasuring && measureOrigin && measureTarget
              ? {
                  origin: measureOrigin,
                  target: measureTarget,
                  color: measurementColor,
                }
              : null
          }
          gridSize={map.gridSize}
        />

        <Layer>{/* Reserved for other layers */}</Layer>
      </Stage>

      {tokenSettingsTarget && (
        <TokenSettingsPanel
          token={tokenSettingsTarget}
          currentUserId={user.id}
          allPlayers={allPlayers}
          onClose={() => setTokenSettingsTarget(null)}
          onDeleteToken={handleDeleteToken}
          onChangeShowNameplate={handleChangeShowNameplate}
          onChangeOwner={handleChangeOwner}
        />
      )}
    </div>
  );
}
