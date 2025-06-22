import React, { useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import socket from "../../../socket";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
import SessionFogAndBlockerLayer from "../../MapLayers/SessionFogAndBlockerLayer";
import SessionMapAssetLayer from "../../MapLayers/SessionMapAssetLayer";
import SessionMapTokenLayer from "../../MapLayers/SessionMapTokenLayer";
import TokenSettingsPanel from "../../Components/Shared/TokenSettingsPanel";

import usePlayerTokenDropHandler from "./hooks/usePlayerTokenDropHandler";
import usePlayerTokenMovement from "./hooks/usePlayerTokenMovement";
import usePlayerTokenDeletion from "./hooks/usePlayerTokenDeletion";
import usePlayerTokenSettings from "./hooks/usePlayerTokenSettings";

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
}) {
  const { user } = useContext(AuthContext);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [mapImage] = useImage(map?.image, "anonymous");
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);
  const imageReady = !!mapImage;

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

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
      onDrop={handleDrop}
    >
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
        onClick={(e) => {
          if (toolMode === "select") {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            const scale = stage.scaleX();

            const cellX = Math.floor(
              (pointer.x - stage.x()) / (map.gridSize * scale)
            );
            const cellY = Math.floor(
              (pointer.y - stage.y()) / (map.gridSize * scale)
            );

            if (selectorMode === "point") {
              console.log(`[Player] Teleporting view to (${cellX}, ${cellY})`);
              stage.to({
                x: -cellX * map.gridSize * scale + stage.width() / 2,
                y: -cellY * map.gridSize * scale + stage.height() / 2,
                duration: 0.5,
                easing: Konva.Easings.EaseInOut,
              });
            }

            if (selectorMode === "ring") {
              console.log(`[Player] Pinging cell at (${cellX}, ${cellY})`);

              const layer = stage.findOne("#PingLayer");
              if (layer) {
                const x = cellX * map.gridSize + map.gridSize / 2;
                const y = cellY * map.gridSize + map.gridSize / 2;

                const ring = new Konva.Circle({
                  x,
                  y,
                  radius: 0,
                  stroke: "blue",
                  strokeWidth: 4,
                  opacity: 0.8,
                });

                layer.add(ring);
                ring.to({
                  radius: map.gridSize * 1.5,
                  opacity: 0,
                  duration: 1,
                  easing: Konva.Easings.EaseOut,
                  onFinish: () => ring.destroy(),
                });

                layer.batchDraw();
                socket.emit("player_ping", { sessionCode, cellX, cellY });
              }
            }
          }
        }}
        style={{ border: "2px solid #444" }}
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
            onSelectToken={handleSelectToken}
            onOpenSettings={setTokenSettingsTarget}
            onTokenMove={handleTokenMove}
            disableInteraction={toolMode !== "select"}
            currentUserId={user.id}
          />
        </Layer>

        <Layer>{/* Reserved for future layers */}</Layer>
      </Stage>

      {tokenSettingsTarget && (
        <TokenSettingsPanel
          token={tokenSettingsTarget}
          currentUserId={user.id}
          allPlayers={campaign?.players || []}
          onClose={() => setTokenSettingsTarget(null)}
          onDeleteToken={handleDeleteToken}
          onChangeShowNameplate={handleChangeShowNameplate}
          onChangeOwner={handleChangeOwner}
        />
      )}
    </div>
  );
}
