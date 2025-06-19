import { useCallback } from "react";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function usePlayerTokenDeletion(
  map,
  setActiveMap,
  sessionCode,
  setTokenSettingsTarget,
  user
) {
  return useCallback(
    (token) => {
      const layer = Object.entries(map.layers).find(([_, l]) =>
        (l.tokens || []).some((t) => t.id === token.id)
      )?.[0];

      if (!layer) return;

      let updatedMap = null;

      setActiveMap((prev) => {
        const updatedTokens = prev.layers[layer].tokens.filter(
          (t) => t.id !== token.id
        );

        updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layer]: {
              ...prev.layers[layer],
              tokens: updatedTokens,
            },
          },
        };

        return updatedMap;
      });

      socket.emit("playerDeleteToken", {
        sessionCode,
        tokenId: token.id,
        layer,
      });

      const authToken = user?.token;
      debounceSave(() => saveMap(updatedMap, authToken));

      setTokenSettingsTarget(null);
    },
    [map, setActiveMap, sessionCode, setTokenSettingsTarget, user]
  );
}
