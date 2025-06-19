// client/src/Session/Pages/DM/DMMapCanvas.jsx
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import { useEscapeDeselect } from "../../../hooks/tokens/useEscapeDeselect";
import { useKeyboardTokenControl } from "../../../hooks/tokens/useKeyboardTokenControl";
import { handleTokenMoveWithFog } from "../../../utils/token/tokenMoveWithFog";
import { getCellFromPointer } from "../../../utils/grid/coordinates";

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
  activeLayer,
  fogVisible,
  toolMode,
  setActiveNoteCell,
  activeNoteCell,
  selectedNoteCell,
  onSelectToken,
}) {
  const [mapImage] = useImage(map?.image, "anonymous");
  const imageReady = !!mapImage;

  const stageRef = useRef();
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);

  //console.log("DMMapCanvas toolMode:", toolMode);

  useEscapeDeselect(() => setSelectedTokenId(null));

  const stageWidth = map?.width * map?.gridSize || 0;
  const stageHeight = map?.height * map?.gridSize || 0;

  const handleTokenMove = (id, newPos) => {
    const tokenLayer = Object.entries(map.layers || {}).find(
      ([layerName, layerData]) =>
        (layerData.tokens || []).some((t) => t.id === id)
    )?.[0];

    const tokenData = { id, newPos, layer: tokenLayer };

    setMapData((prevMap) =>
      handleTokenMoveWithFog({
        map: prevMap,
        id,
        newPos,
        activeLayer: tokenLayer, // important!
      })
    );

    socket.emit("dmTokenMove", {
      sessionCode,
      tokenData,
    });
  };

  const handleCanvasMouseUp = (e) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();

    if (!pointer) return;

    const cell = getCellFromPointer(pointer, map.gridSize);
    if (!cell) return;
    onCanvasDrop(pointer);
  };

  useKeyboardTokenControl({
    selectedTokenId,
    map,
    activeLayer,
    onMove: handleTokenMove,
  });

  if (!map) {
    return <div className={styles.mapCanvas}>No map loaded.</div>;
  }

  return (
    <div className={styles.mapCanvas}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
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
            onMoveAsset={(id, newPos) => {
              setMapData((prev) => {
                const assets = prev.layers[activeLayer]?.assets || [];
                const updatedAssets = assets.map((a) =>
                  a.id === id ? { ...a, position: newPos } : a
                );

                return {
                  ...prev,
                  layers: {
                    ...prev.layers,
                    [activeLayer]: {
                      ...prev.layers[activeLayer],
                      assets: updatedAssets,
                    },
                  },
                };
              });
            }}
          />

          <SessionMapTokenLayer
            map={map}
            gridSize={map.gridSize}
            activeLayer={activeLayer}
            selectedTokenId={selectedTokenId}
            onOpenSettings={(token) => {
              setTokenSettingsTarget({
                ...token,
                _layer: Object.entries(map.layers || {}).find(([_, l]) =>
                  (l.tokens || []).some((t) => t.id === token.id)
                )?.[0],
              });
            }}
            disableInteraction={toolMode !== "select"}
            onSelectToken={(id) => {
              if (toolMode !== "select") return;
              setSelectedTokenId(id);
              if (typeof onSelectToken === "function") {
                const token = Object.entries(map.layers || {})
                  .flatMap(([layerKey, layer]) =>
                    (layer.tokens || []).map((t) => ({
                      ...t,
                      _layer: layerKey,
                    }))
                  )
                  .find((t) => t.id === id);
                onSelectToken(token || null);
              }
            }}
            onTokenMove={(id, newPos) => {
              if (toolMode !== "select") return; // Prevent movement if not in select mode
              handleTokenMove(id, newPos);
            }}
          />
        </Layer>

        <Layer>{/* Reserved for other Layers */}</Layer>
      </Stage>
      {tokenSettingsTarget && (
        <TokenSettingsPanel
          token={tokenSettingsTarget}
          isDM={true}
          onClose={() => setTokenSettingsTarget(null)}
          onChangeLayer={(token, newLayer) => {
            const oldLayer = token._layer;

            setMapData((prev) => {
              if (!prev.layers[oldLayer] || !prev.layers[newLayer]) return prev;

              const removed = prev.layers[oldLayer].tokens.filter(
                (t) => t.id !== token.id
              );
              const moved = [
                ...(prev.layers[newLayer].tokens || []),
                { ...token, _layer: newLayer },
              ];

              return {
                ...prev,
                layers: {
                  ...prev.layers,
                  [oldLayer]: {
                    ...prev.layers[oldLayer],
                    tokens: removed,
                  },
                  [newLayer]: {
                    ...prev.layers[newLayer],
                    tokens: moved,
                  },
                },
              };
            });

            socket.emit("dmTokenLayerChange", {
              sessionCode,
              tokenId: token.id,
              fromLayer: oldLayer,
              toLayer: newLayer,
            });

            setTokenSettingsTarget(null);
          }}
        />
      )}
    </div>
  );
}
