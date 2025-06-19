import { useCallback } from "react";
import socket from "../../../../socket";

export default function usePlayerTokenMovement(map, setActiveMap, sessionCode) {
  return useCallback(
    (id, newPos) => {
      const layer = "player";
      const allTokens = Object.values(map.layers || {}).flatMap(
        (l) => l.tokens || []
      );
      const token = allTokens.find((t) => t.id === id);
      const ownerId = token?.ownerId;
      const ownerIds = token?.ownerIds;

      setActiveMap((prev) => {
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
    },
    [map, setActiveMap, sessionCode]
  );
}
