import { useEffect } from "react";
import socket from "../../../../socket";
import useChatSocketHandlers from "./useChatSocketHandlers";
import useMusicSocketHandlers from "./useMusicSocketHandlers";
import useAoEMeasurementHandlers from "./useAoEMeasurementHandlers";
import useMapAssetSocketHandlers from "./useMapAssetSocketHandlers";
import useMapTokenSocketHandlers from "./useMapTokenSocketHandlers";

export default function usePlayerSocketHandlers(
  inviteCode,
  user,
  setActiveMap,
  onChatMessage,
  stageRef,
  map,
  setActiveTurnTokenId,
  setAoes,
  setLockedMeasurements,
  music,
  musicConsent
) {
  const authToken = user?.token;

  // Delegated socket event hooks
  useChatSocketHandlers(user, onChatMessage);
  useMusicSocketHandlers(music, musicConsent);
  useAoEMeasurementHandlers(setAoes, setLockedMeasurements);
  useMapAssetSocketHandlers(setActiveMap, stageRef, authToken);
  useMapTokenSocketHandlers(setActiveMap, setActiveTurnTokenId, authToken);

  // Ping and teleport remain here because they are short and map/stage specific
  useEffect(() => {
    if (!map || !stageRef?.current) return;

    const handlePing = ({ cell }) => {
      const stage = stageRef.current.getStage();
      const layer = stage.findOne("#PingLayer");
      if (!layer) {
        console.warn("[Player] PingLayer not found.");
        return;
      }

      const { gridSize } = map;
      const x = cell.x * gridSize + gridSize / 2;
      const y = cell.y * gridSize + gridSize / 2;

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
        radius: gridSize * 1.5,
        opacity: 0,
        duration: 1,
        easing: Konva.Easings.EaseOut,
        onFinish: () => ring.destroy(),
      });

      layer.batchDraw();
    };

    socket.on("dm:pingCell", handlePing);
    return () => socket.off("dm:pingCell", handlePing);
  }, [map, stageRef]);

  useEffect(() => {
    if (!map || !stageRef?.current) return;

    const handleTeleport = ({ cell }) => {
      const stage = stageRef.current.getStage();
      const gridSize = map.gridSize;
      const scale = stage.scaleX();

      const centerX = (cell.x + 0.5) * gridSize * scale;
      const centerY = (cell.y + 0.5) * gridSize * scale;

      const containerWidth = stage.container().offsetWidth;
      const containerHeight = stage.container().offsetHeight;

      const newX = containerWidth / 2 - centerX;
      const newY = containerHeight / 2 - centerY;

      stage.to({
        x: newX,
        y: newY,
        duration: 1,
        easing: Konva.Easings.EaseInOut,
      });
    };

    socket.on("dm:teleportPlayerView", handleTeleport);
    return () => socket.off("dm:teleportPlayerView", handleTeleport);
  }, [map, stageRef]);

  // Join session
  useEffect(() => {
    if (inviteCode && user?.id) {
      socket.emit("joinSession", { sessionCode: inviteCode, userId: user.id });
    }
  }, [inviteCode, user?.id]);
}

// Separate export remains for emitting chat messages
export function usePlayerChatEmitter(sessionCode) {
  return (message) => {
    socket.emit("chatMessageSent", { sessionCode, message });
  };
}
