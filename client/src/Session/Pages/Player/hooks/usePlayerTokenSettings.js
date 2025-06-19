import { useCallback } from "react";
import socket from "../../../../socket";

export default function usePlayerTokenSettings(
  map,
  setActiveMap,
  sessionCode,
  setTokenSettingsTarget
) {
  const handleChangeOwner = useCallback(
    (token, newOwnerIds) => {
      const layer = Object.entries(map.layers).find(([_, l]) =>
        (l.tokens || []).some((t) => t.id === token.id)
      )?.[0];

      if (!layer) return;

      const updatedTokens = map.layers[layer].tokens.map((t) =>
        t.id === token.id ? { ...t, ownerIds: newOwnerIds } : t
      );

      const updatedMap = {
        ...map,
        layers: {
          ...map.layers,
          [layer]: {
            ...map.layers[layer],
            tokens: updatedTokens,
          },
        },
      };

      const updatedToken = updatedTokens.find((t) => t.id === token.id);
      setActiveMap(updatedMap);
      setTokenSettingsTarget({ ...updatedToken, _layer: layer });

      socket.emit("playerTokenOwnershipChange", {
        sessionCode,
        tokenId: token.id,
        newOwnerIds,
      });
    },
    [map, setActiveMap, sessionCode, setTokenSettingsTarget]
  );

  const handleChangeShowNameplate = useCallback(
    (token, show) => {
      const layer = Object.entries(map.layers).find(([_, l]) =>
        (l.tokens || []).some((t) => t.id === token.id)
      )?.[0];

      if (!layer) return;

      const updatedTokens = map.layers[layer].tokens.map((t) =>
        t.id === token.id ? { ...t, showNameplate: show } : t
      );

      const updatedMap = {
        ...map,
        layers: {
          ...map.layers,
          [layer]: {
            ...map.layers[layer],
            tokens: updatedTokens,
          },
        },
      };

      const updatedToken = updatedTokens.find((t) => t.id === token.id);
      setActiveMap(updatedMap);
      setTokenSettingsTarget({ ...updatedToken, _layer: layer });
    },
    [map, setActiveMap, setTokenSettingsTarget]
  );

  return {
    handleChangeOwner,
    handleChangeShowNameplate,
  };
}
