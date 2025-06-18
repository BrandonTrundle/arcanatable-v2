// client/src/Session/Pages/Player/PlayerMapCanvas.jsx
import React, { useRef } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import socket from "../../../socket";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import { characterToToken } from "../../../utils/token/characterToken";

import styles from "../../styles/MapCanvas.module.css";

export default function PlayerMapCanvas({
  sessionCode,
  map,
  fogVisible,
  setActiveMap,
}) {
  const [mapImage] = useImage(map?.image, "anonymous");
  const imageReady = !!mapImage;

  const stageRef = useRef();

  if (!map) {
    return (
      <div className={styles.mapCanvas}>Waiting for DM to load map...</div>
    );
  }

  const stageWidth = map.width * map.gridSize;
  const stageHeight = map.height * map.gridSize;

  return (
    <div
      className={styles.mapCanvas}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const json = e.dataTransfer.getData("application/json");
        if (!json) return;

        try {
          const char = JSON.parse(json);

          const stage = stageRef.current.getStage();
          const boundingRect = stage.container().getBoundingClientRect();
          const x = e.clientX - boundingRect.left;
          const y = e.clientY - boundingRect.top;

          const cellX = Math.floor(x / map.gridSize);
          const cellY = Math.floor(y / map.gridSize);

          const token = characterToToken(char);
          token.position = { x: cellX, y: cellY };

          const updatedMap = { ...map };
          const playerLayer = updatedMap.layers.player || {
            tokens: [],
            assets: [],
          };
          playerLayer.tokens = [...(playerLayer.tokens || []), token];
          updatedMap.layers.player = playerLayer;

          setActiveMap(updatedMap);
          socket.emit("playerDropToken", {
            sessionCode,
            mapId: map._id,
            token,
          });
        } catch (err) {
          console.error("Failed to parse character drop:", err);
        }
      }}
    >
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        style={{ border: "2px solid #444" }}
      >
        <SessionStaticMapLayer
          mapImage={mapImage}
          imageReady={imageReady}
          gridVisible={true} // Always visible for players?
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
          showBlockers={false} // Maybe only DM sees blockers?
        />

        <Layer>
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
            selectedTokenId={null}
            onSelectToken={() => {}}
            onTokenMove={() => {}}
          />
        </Layer>

        <Layer>{/* Reserved for future layers */}</Layer>
      </Stage>
    </div>
  );
}
