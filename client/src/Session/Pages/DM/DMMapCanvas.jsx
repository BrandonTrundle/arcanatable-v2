import { useRef, useState } from "react";
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
import { useAoEControl } from "./hooks/useAoEControl";
import { useRulerControl } from "./hooks/useRulerControl";
import { getSnappedPointer } from "./utils/snapUtils";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import MeasurementLayer from "../../MapLayers/MeasurementLayer";
import SessionAoELayer from "../../MapLayers/SessionAoELayer";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";
import styles from "../../styles/MapCanvas.module.css";

const getStageDimensions = (map) => ({
  width: map?.width * map?.gridSize || 0,
  height: map?.height * map?.gridSize || 0,
});

const getSnappedPointerPos = (e, stageRef, gridSize, snapMode) => {
  const pointer = e.target.getStage().getPointerPosition();
  return getSnappedPointer(pointer, stageRef.current, gridSize, snapMode);
};

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
  measurementColor,
  snapMode,
  lockMeasurement,
  broadcastEnabled,
  setLockedMeasurements,
  lockedMeasurements,
}) {
  const stageRef = useRef();
  const { stageScale, stagePos, setStagePos, handleWheel } =
    useZoomAndPan(stageRef);
  useTokenDropHandler(stageRef, map, setMapData, activeLayer, sessionCode);
  const allPlayers = campaign?.players || [];
  const { mapImage, imageReady } = useMapImage(map);
  const { handleCanvasMouseUp } = useMapDropHandler(map, onCanvasDrop);
  const [selectedShape, setSelectedShape] = useState("circle");
  const [shapeSettings, setShapeSettings] = useState({});

  const {
    isDraggingAoE,
    aoeDragOrigin,
    aoeDragTarget,
    startAoEDrag,
    updateAoEDragTarget,
    finalizeAoE,
    deleteAoE,
  } = useAoEControl({
    map,
    selectedShape,
    shapeSettings,
    setAoes,
    sessionCode,
    snapMode,
  });

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
    useTokenSettings({
      map,
      setMapData,
      sessionCode,
      setTokenSettingsTarget,
    });

  const { width: stageWidth, height: stageHeight } = getStageDimensions(map);
  usePingBroadcast(stageRef, map);

  if (!map) return <div className={styles.mapCanvas}>No map loaded.</div>;

  return (
    <div className={styles.mapCanvas}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        draggable={!isDraggingAoE && !isMeasuring}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        onWheel={handleWheel}
        onMouseDown={(e) => {
          const snapped = getSnappedPointerPos(
            e,
            stageRef,
            map.gridSize,
            snapMode
          );
          if (toolMode === "aoe" && e.evt.button === 0) startAoEDrag(snapped);
          if (toolMode === "ruler" && e.evt.button === 0)
            startMeasurement(snapped);
        }}
        onMouseMove={(e) => {
          const snapped = getSnappedPointerPos(
            e,
            stageRef,
            map.gridSize,
            snapMode
          );
          if (isDraggingAoE) updateAoEDragTarget(snapped);
          if (isMeasuring) updateMeasurementTarget(snapped);
        }}
        onMouseUp={(e) => {
          handleCanvasMouseUp(e);
          const snapped = getSnappedPointerPos(
            e,
            stageRef,
            map.gridSize,
            snapMode
          );
          if (isDraggingAoE) finalizeAoE(snapped);
          if (isMeasuring && e.evt.button === 0) finalizeMeasurement(snapped);
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
          onRightClickAoE={(aoe) => deleteAoE(aoe.id)}
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
