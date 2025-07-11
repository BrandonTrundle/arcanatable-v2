import { useRef, useState, useEffect } from "react";
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
import AssetSettingsPanel from "../../Components/Shared/AssetSettingsPanel";
import socket from "../../../socket";

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
  gridColor,
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
  selectedShape,
  shapeSettings,
  stagePos,
  setStagePos,
}) {
  const stageRef = useRef();
  const { stageScale, handleWheel } = useZoomAndPan(stageRef);
  useTokenDropHandler(stageRef, map, setMapData, activeLayer, sessionCode);
  const allPlayers = campaign?.players || [];
  const { mapImage, imageReady } = useMapImage(map);
  useMapDropHandler(map, setMapData, activeLayer, stageRef, sessionCode);
  const [assetSettingsTarget, setAssetSettingsTarget] = useState(null);

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
    useDMAssetControl(setMapData, sessionCode);
  const { deleteToken, changeTokenLayer, changeShowNameplate, changeOwner } =
    useTokenSettings({
      map,
      setMapData,
      sessionCode,
      setTokenSettingsTarget,
    });

  const { width: stageWidth, height: stageHeight } = getStageDimensions(map);
  usePingBroadcast(stageRef, map);

  //console.log("[RENDER] Stage with position:", stagePos);

  const findAssetLayer = (map, assetId) => {
    for (const [layerName, layer] of Object.entries(map.layers || {})) {
      if ((layer.assets || []).some((a) => a.id === assetId)) {
        return layerName;
      }
    }
    return "dm";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedAssetId(null); // Deselect the asset
        return;
      }

      if ((e.key === "q" || e.key === "e") && selectedAssetId) {
        setMapData((prev) => {
          const updated = { ...prev };

          for (const layerKey in updated.layers) {
            const layer = updated.layers[layerKey];
            if (!layer.assets) continue;

            const assetIndex = layer.assets.findIndex(
              (a) => a.id === selectedAssetId
            );
            if (assetIndex !== -1) {
              const current = layer.assets[assetIndex];
              const newRotation =
                e.key === "q"
                  ? (current.rotation || 0) - 15
                  : (current.rotation || 0) + 15;

              layer.assets[assetIndex] = {
                ...current,
                rotation: ((newRotation % 360) + 360) % 360, // wrap rotation
              };

              socket.emit("mapAssetRotated", {
                sessionCode,
                assetId: selectedAssetId,
                rotation: ((newRotation % 360) + 360) % 360,
              });

              break; // exit loop early once found
            }
          }

          return updated;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAssetId, setMapData]);

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
        onDragEnd={(e) => {
          const newPos = { x: e.target.x(), y: e.target.y() };

          setStagePos(newPos);
        }}
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
          gridColor={gridColor}
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
            onSelectAsset={(id) => {
              setSelectedAssetId(id);
            }}
            onOpenSettings={(asset) => {
              setAssetSettingsTarget({
                ...asset,
                _layer: findAssetLayer(map, asset.id),
              });
            }}
            onMoveAsset={handleMoveAsset}
            toolMode={toolMode}
            selectorMode={selectorMode}
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

      {assetSettingsTarget && (
        <AssetSettingsPanel
          asset={assetSettingsTarget}
          isDM={true}
          onClose={() => setAssetSettingsTarget(null)}
          onChangeLayer={(asset, newLayer) => {
            setMapData((prev) => {
              const updated = { ...prev };
              for (const layerKey in updated.layers) {
                const layer = updated.layers[layerKey];
                if (!layer.assets) continue;
                updated.layers[layerKey].assets = layer.assets.filter(
                  (a) => a.id !== asset.id
                );
                socket.emit("mapAssetLayerChanged", {
                  sessionCode,
                  assetId: asset.id,
                  fromLayer: asset._layer,
                  toLayer: newLayer,
                });
              }

              if (!updated.layers[newLayer].assets)
                updated.layers[newLayer].assets = [];

              updated.layers[newLayer].assets.push({ ...asset });
              return updated;
            });

            setAssetSettingsTarget(null); // auto-close for now
          }}
          onDeleteAsset={(asset) => {
            setMapData((prev) => {
              const updated = { ...prev };
              for (const layerKey in updated.layers) {
                if (!updated.layers[layerKey].assets) continue;
                updated.layers[layerKey].assets = updated.layers[
                  layerKey
                ].assets.filter((a) => a.id !== asset.id);
                socket.emit("mapAssetDeleted", {
                  sessionCode,
                  assetId: asset.id,
                  layer: asset._layer,
                });
              }
              return updated;
            });

            setAssetSettingsTarget(null);
          }}
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
