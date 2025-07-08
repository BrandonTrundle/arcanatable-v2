import { useRef, useState, useContext } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import { AuthContext } from "../../../context/AuthContext";
import { usePingBroadcast } from "../DM/hooks/usePingBroadcast";
import { useRulerControl } from "../DM/hooks/useRulerControl";
import { getSnappedPointer } from "../DM/utils/snapUtils";
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
import AoEControlPanel from "../../Components/Shared/AoEControlPanel";
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
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);
  const imageReady = !!mapImage;
  const getSnappedPointerPos = (e) => {
    const pointer = e.target.getStage().getPointerPosition();
    return getSnappedPointer(pointer, stageRef.current, map.gridSize, snapMode);
  };

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
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

  const [isDraggingAoE, setIsDraggingAoE] = useState(false);
  const [aoeDragOrigin, setAoeDragOrigin] = useState(null);
  const [aoeDragTarget, setAoeDragTarget] = useState(null);

  const [isAnchored, setIsAnchored] = useState(false);

  const snapToGrid = (value, gridSize) =>
    Math.round(value / gridSize) * gridSize;

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
        draggable={!isDraggingAoE && !isMeasuring}
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
          if (toolMode === "ruler" && e.evt.button === 0) {
            const snapped = getSnappedPointerPos(e);
            startMeasurement(snapped);
          }
        }}
        onMouseMove={(e) => {
          const snapped = getSnappedPointerPos(e);

          if (isDraggingAoE) {
            setAoeDragTarget(snapped);
          }

          if (toolMode === "ruler" && isMeasuring) {
            updateMeasurementTarget(snapped);
          }
        }}
        onMouseUp={(e) => {
          const snapped = getSnappedPointerPos(e);

          if (isDraggingAoE && e.evt.button === 0) {
            const newAoE = {
              id: Date.now(),
              x: snapped.x,
              y: snapped.y,
              type: selectedShape,
              color: shapeSettings[selectedShape]?.color || "#ff0000",
              opacity: 0.4,
            };

            const ftToPx = (ft) => (map.gridSize / 5) * ft;

            if (selectedShape === "circle") {
              newAoE.radius = ftToPx(
                shapeSettings[selectedShape]?.radius || 20
              );
            }

            if (selectedShape === "cone") {
              newAoE.radius = ftToPx(
                shapeSettings[selectedShape]?.radius || 30
              );
              newAoE.angle = shapeSettings[selectedShape]?.angle || 60;

              const dx = snapped.x - aoeDragOrigin.x;
              const dy = snapped.y - aoeDragOrigin.y;
              newAoE.direction = (Math.atan2(dy, dx) * 180) / Math.PI;
            }

            if (selectedShape === "square") {
              newAoE.width = ftToPx(shapeSettings[selectedShape]?.width || 30);
            }

            if (selectedShape === "rectangle") {
              newAoE.width = ftToPx(shapeSettings[selectedShape]?.width || 40);
              newAoE.height = ftToPx(
                shapeSettings[selectedShape]?.height || 20
              );
            }

            setAoes((prev) => [...prev, newAoE]);
            socket.emit("aoePlaced", { sessionCode, aoe: newAoE });
          }

          if (isDraggingAoE) {
            setIsDraggingAoE(false);
            setAoeDragOrigin(null);
            setAoeDragTarget(null);
          }

          if (isMeasuring && e.evt.button === 0) {
            finalizeMeasurement(snapped);
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
