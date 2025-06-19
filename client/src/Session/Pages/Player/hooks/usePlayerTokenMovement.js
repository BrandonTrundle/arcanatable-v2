import { useCallback } from "react";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function usePlayerTokenMovement(
  map,
  setActiveMap,
  sessionCode,
  user
) {
  return useCallback(
    (id, newPos) => {
      const layer = "player";
      const allTokens = Object.values(map.layers || {}).flatMap(
        (l) => l.tokens || []
      );
      const token = allTokens.find((t) => t.id === id);
      const ownerId = token?.ownerId;
      const ownerIds = token?.ownerIds;
      const authToken = user?.token;

      setActiveMap((prev) => {
        const updatedTokens = prev.layers[layer].tokens.map((token) =>
          token.id === id ? { ...token, position: newPos } : token
        );

        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layer]: {
              ...prev.layers[layer],
              tokens: updatedTokens,
            },
          },
        };

        debounceSave(() => saveMap(updatedMap, authToken));

        return updatedMap; // ✅ Don't forget this
      });

      socket.emit("playerMoveToken", {
        sessionCode,
        tokenData: { id, newPos, layer, ownerId, ownerIds },
      });
    },
    [map, setActiveMap, sessionCode, user]
  );
}
