import { useState, useContext } from "react"; // React state and context
import { Stage, Layer } from "react-konva"; // Canvas stage and layer components
import useImage from "use-image"; // Hook to load map background image
import { AuthContext } from "../../../context/AuthContext"; // Auth context for current user
import { usePingBroadcast } from "../DM/hooks/usePingBroadcast"; // Broadcasts player ping location
import { useRulerControl } from "../DM/hooks/useRulerControl"; // Handles ruler measurement logic
import { getSnappedPointer } from "../DM/utils/snapUtils"; // Snaps pointer to grid
import useAoEPlacementHandler from "./hooks/useAoEPlacementHandler"; // Handles placing AoE shapes
import useStageControls from "./hooks/useStageControls"; // Controls zoom and panning
import useMapClickHandler from "./hooks/usePlayerMapClickHandler"; // Handles clicking on the map
import useTokenHandlers from "./hooks/useTokenHandlers"; // Handles token drop and move
import useRulerHandlers from "./hooks/useRulerHandlers"; // Handles mouse interaction for ruler
import usePlayerStageMouseHandlers from "./hooks/usePlayerStageMouseHandlers"; // Master mouse control (pan, AoE, ruler)
import useTokenSelection from "./hooks/usePlayerTokenSelection"; // Token selection logic
import useTokenSettings from "./hooks/useTokenSettings"; // Token settings panel logic
import useAoEDragControls from "./hooks/useAoEDragControls"; // Drag state for AoE shapes
import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer"; // Base map and grid layer
import MeasurementLayer from "../../MapLayers/MeasurementLayer"; // Ruler overlay
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer"; // Fog and blockers
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer"; // Props / decor
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer"; // Player tokens
import SessionAoELayer from "../../MapLayers/SessionAoELayer"; // AoE shape visuals
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel"; // Token editing popup
import socket from "../../../socket"; // Socket connection
import styles from "../../styles/MapCanvas.module.css"; // Component-specific styles

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
  gridVisible,
  gridColor,
}) {
  const { user } = useContext(AuthContext); // Get current user from context

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
  }); // Measurement logic

  const [mapImage] = useImage(map?.image, "anonymous"); // Load map background
  const imageReady = !!mapImage; // Boolean to ensure it's loaded
  const [isPanning, setIsPanning] = useState(false); // Track if we're panning
  const [lastPointerPosition, setLastPointerPosition] = useState(null); // For calculating pan delta

  const placeAoE = useAoEPlacementHandler({
    map,
    shapeSettings,
    selectedShape,
    sessionCode,
    setAoes,
  }); // Place AoE on drop

  const { stageScale, setStageScale, stagePos, setStagePos, handleZoom } =
    useStageControls(); // Zoom/pan control

  const {
    isDraggingAoE,
    setIsDraggingAoE,
    aoeDragOrigin,
    setAoeDragOrigin,
    aoeDragTarget,
    setAoeDragTarget,
    resetAoEDrag,
  } = useAoEDragControls(); // Drag state for AoEs

  const { handleRulerMouseDown, handleRulerMouseMove, handleRulerMouseUp } =
    useRulerHandlers({
      toolMode,
      isMeasuring,
      startMeasurement,
      updateMeasurementTarget,
      finalizeMeasurement,
      stageRef,
      map,
      snapMode,
    }); // Ruler mouse logic

  const { onMouseDown, onMouseMove, onMouseUp } = usePlayerStageMouseHandlers({
    stageRef,
    map,
    snapMode,
    toolMode,
    isDraggingAoE,
    setIsDraggingAoE,
    aoeDragOrigin,
    setAoeDragOrigin,
    aoeDragTarget,
    setAoeDragTarget,
    resetAoEDrag,
    placeAoE,
    handleRulerMouseDown,
    handleRulerMouseMove,
    handleRulerMouseUp,
  }); // Master mouse handler (AoE, pan, ruler)

  const {
    tokenSettingsTarget,
    setTokenSettingsTarget,
    handleDeleteToken,
    handleChangeOwner,
    handleChangeShowNameplate,
  } = useTokenSettings(map, setActiveMap, sessionCode); // Manage token edit panel

  const isAoEToolActive = ["cone", "circle", "square", "rectangle"].includes(
    selectedShape
  ); // Prevent drag if AoE tool active

  usePingBroadcast(stageRef, map, stageScale, stagePos, sessionCode); // Share current view/ping

  const handleMapClick = useMapClickHandler({
    toolMode,
    selectorMode,
    map,
    sessionCode,
  }); // Click to select

  const { handleDrop, handleTokenMove } = useTokenHandlers({
    map,
    setActiveMap,
    sessionCode,
    user,
    stageRef,
    setTokenSettingsTarget,
  }); // Drop/move tokens

  const { selectedTokenId, handleSelectToken } = useTokenSelection(map, user); // Track selected token

  const allPlayers = campaign?.players || []; // Get list of players
  const stageWidth = map?.width * map?.gridSize || 0; // Calculate canvas width
  const stageHeight = map?.height * map?.gridSize || 0; // Calculate canvas height

  if (!map) return <div className={styles.mapCanvas}>No map loaded.</div>; // Fail-safe

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
        onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
        onWheel={handleZoom}
        onClick={handleMapClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <SessionStaticMapLayer
          mapImage={mapImage}
          imageReady={imageReady}
          gridVisible={gridVisible}
          gridColor={gridColor}
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

        <Layer>{/* Placeholder for future layers */}</Layer>
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
