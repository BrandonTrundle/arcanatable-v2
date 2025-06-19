import { useCallback } from "react";
import socket from "../../../../socket";

export default function usePlayerTokenDeletion(
  map,
  setActiveMap,
  sessionCode,
  setTokenSettingsTarget
) {
  return useCallback(
    (token) => {
      const layer = Object.entries(map.layers).find(([_, l]) =>
        (l.tokens || []).some((t) => t.id === token.id)
      )?.[0];

      if (!layer) return;

      setActiveMap((prev) => {
        const updatedTokens = prev.layers[layer].tokens.filter(
          (t) => t.id !== token.id
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

      socket.emit("playerDeleteToken", {
        sessionCode,
        tokenId: token.id,
        layer,
      });

      setTokenSettingsTarget(null);
    },
    [map, setActiveMap, sessionCode, setTokenSettingsTarget]
  );
}
