import { useRef, useState, useContext } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import { AuthContext } from "../../../context/AuthContext";
import { usePingBroadcast } from "../DM/hooks/usePingBroadcast";
import usePlayerMapZoomHandler from "./hooks/usePlayerZoomHandler";
import usePlayerMapClickHandler from "./hooks/usePlayerMapClickHandler";
import usePlayerTokenSelection from "./hooks/usePlayerTokenSelection";
import usePlayerTokenDropHandler from "./hooks/usePlayerTokenDropHandler";
import usePlayerTokenMovement from "./hooks/usePlayerTokenMovement";
import usePlayerTokenDeletion from "./hooks/usePlayerTokenDeletion";
import usePlayerTokenSettings from "./hooks/usePlayerTokenSettings";

import SessionStaticMapLayer from "../../MapLayers/SessionStaticMapLayer";
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
}) {
  const { user } = useContext(AuthContext);
  const [mapImage] = useImage(map?.image, "anonymous");
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);
  const imageReady = !!mapImage;

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
  const [selectedShape, setSelectedShape] = useState("circle");
  const [shapeSettings, setShapeSettings] = useState({});
  const [isAnchored, setIsAnchored] = useState(false);
  const [snapMode, setSnapMode] = useState("center");

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
        draggable={!isDraggingAoE}
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
        onMouseUp={(e) => {
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

        <Layer>{/* Reserved for other layers */}</Layer>
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
