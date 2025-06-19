import React, { useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import socket from "../../../socket";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import { characterToToken } from "../../../utils/token/characterToken";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";

import styles from "../../styles/MapCanvas.module.css";

export default function PlayerMapCanvas({
  sessionCode,
  map,
  fogVisible,
  setActiveMap,
  toolMode,
}) {
  const { user } = useContext(AuthContext);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [mapImage] = useImage(map?.image, "anonymous");
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);

  const imageReady = !!mapImage;

  const stageRef = useRef();

  const handleSelectToken = (id) => {
    setSelectedTokenId(id);
    const allTokens = Object.values(map.layers || {}).flatMap(
      (l) => l.tokens || []
    );
    const token = allTokens.find((t) => t.id === id);
    if (token) {
      console.log(`[Player ${user?.id}] selected token:`, token);
    } else {
      console.log(
        `[Player ${user?.id}] selected token ID: ${id}, but token not found`
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedTokenId(null);
        console.log("[Player] Deselected token via Escape key");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
            selectedTokenId={selectedTokenId}
            onSelectToken={handleSelectToken}
            onOpenSettings={setTokenSettingsTarget}
            onTokenMove={(id, newPos) => {
              console.log(
                "[Player] Attempting to move token:",
                id,
                "to",
                newPos
              );

              const layer = "player";
              const allTokens = Object.values(map.layers || {}).flatMap(
                (l) => l.tokens || []
              );
              const token = allTokens.find((t) => t.id === id);
              const ownerId = token?.ownerId;
              const ownerIds = token?.ownerIds;

              setActiveMap((prev) => {
                console.log("[Player] Updating map state for token:", id);
                const updatedTokens = prev.layers[layer].tokens.map((token) =>
                  token.id === id ? { ...token, position: newPos } : token
                );
                return {
                  ...prev,
                  layers: {
                    ...prev.layers,
                    [layer]: {
                      ...prev.layers[layer],
                      tokens: updatedTokens,
                    },
                  },
                };
              });

              socket.emit("playerMoveToken", {
                sessionCode,
                tokenData: { id, newPos, layer, ownerId, ownerIds },
              });
              console.log("[Player] Emitted playerMoveToken event for:", id);
            }}
            disableInteraction={toolMode !== "select"}
            currentUserId={user.id}
          />
        </Layer>

        <Layer>{/* Reserved for future layers */}</Layer>
      </Stage>
      {tokenSettingsTarget && (
        <TokenSettingsPanel
          token={tokenSettingsTarget}
          onClose={() => setTokenSettingsTarget(null)}
        />
      )}
    </div>
  );
}
