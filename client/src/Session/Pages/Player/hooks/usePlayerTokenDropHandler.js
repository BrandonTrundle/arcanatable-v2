import { useCallback } from "react";
import socket from "../../../../socket";
import { characterToToken } from "../../../../utils/token/characterToken";

export default function usePlayerTokenDropHandler(
  map,
  setActiveMap,
  sessionCode
) {
  return useCallback(
    (e) => {
      e.preventDefault();
      const json = e.dataTransfer.getData("application/json");
      if (!json) return;

      try {
        const char = JSON.parse(json);

        const stage = document.querySelector("canvas");
        const boundingRect = stage.getBoundingClientRect();
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
    },
    [map, setActiveMap, sessionCode]
  );
}
