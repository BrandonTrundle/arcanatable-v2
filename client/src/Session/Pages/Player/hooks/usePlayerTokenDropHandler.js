import { useCallback } from "react";
import socket from "../../../../socket";
import { characterToToken } from "../../../../utils/token/characterToken";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function usePlayerTokenDropHandler(
  map,
  setActiveMap,
  sessionCode,
  user,
  stageRef
) {
  return useCallback(
    (e) => {
      e.preventDefault();
      const json = e.dataTransfer.getData("application/json");
      if (!json) return;

      try {
        const char = JSON.parse(json);

        const stage = stageRef.current.getStage();
        const scale = stage.scaleX();
        const rect = stage.container().getBoundingClientRect();

        const pointerX = (e.clientX - rect.left - stage.x()) / scale;
        const pointerY = (e.clientY - rect.top - stage.y()) / scale;

        const cellX = Math.floor(pointerX / map.gridSize);
        const cellY = Math.floor(pointerY / map.gridSize);

        const token = characterToToken(char);
        if (!token.image || !token.image.startsWith("http")) {
          console.warn("Token image is invalid. Drop aborted.", token.image);
          return;
        }
        token.position = { x: cellX, y: cellY };
        token.entityId = char._id || char.id;
        token.entityType =
          char.entityType ||
          (char.isPC ? "PC" : char.isMonster ? "Monster" : "NPC");

        token.ownerId = user?.id;
        token.ownerIds = [user?.id];

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

        const authToken = user?.token;
        debounceSave(() => saveMap(updatedMap, authToken));
      } catch (err) {
        console.error("Failed to parse character drop:", err);
      }
    },
    [map, setActiveMap, sessionCode, user] // <-- include `user` here
  );
}
