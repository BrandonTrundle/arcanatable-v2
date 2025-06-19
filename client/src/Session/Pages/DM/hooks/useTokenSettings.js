import { useState } from "react";
import socket from "../../../../socket";

export function useTokenSettings({ map, setMapData, sessionCode }) {
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);

  const updateTokenInLayer = (tokenId, updater) => {
    setMapData((prev) => {
      const layer = Object.entries(prev.layers).find(([_, l]) =>
        (l.tokens || []).some((t) => t.id === tokenId)
      )?.[0];
      if (!layer) return prev;

      const updatedTokens = prev.layers[layer].tokens.map((t) =>
        t.id === tokenId ? updater(t) : t
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

      const updatedToken = updatedTokens.find((t) => t.id === tokenId);
      setTokenSettingsTarget({ ...updatedToken, _layer: layer });

      return updatedMap;
    });
  };

  const deleteToken = (token) => {
    const layer = token._layer;
    if (!layer) return;

    setMapData((prev) => {
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

    socket.emit("dmDeleteToken", {
      sessionCode,
      tokenId: token.id,
      layer,
    });

    setTokenSettingsTarget(null);
  };

  const changeTokenLayer = (token, newLayer) => {
    const oldLayer = token._layer;

    setMapData((prev) => {
      if (!prev.layers[oldLayer] || !prev.layers[newLayer]) return prev;

      const removed = prev.layers[oldLayer].tokens.filter(
        (t) => t.id !== token.id
      );
      const moved = [
        ...(prev.layers[newLayer].tokens || []),
        { ...token, _layer: newLayer },
      ];

      return {
        ...prev,
        layers: {
          ...prev.layers,
          [oldLayer]: {
            ...prev.layers[oldLayer],
            tokens: removed,
          },
          [newLayer]: {
            ...prev.layers[newLayer],
            tokens: moved,
          },
        },
      };
    });

    socket.emit("dmTokenLayerChange", {
      sessionCode,
      tokenId: token.id,
      fromLayer: oldLayer,
      toLayer: newLayer,
    });

    setTokenSettingsTarget(null);
  };

  const changeShowNameplate = (token, show) => {
    updateTokenInLayer(token.id, (t) => ({ ...t, showNameplate: show }));
  };

  const changeOwner = (token, newOwnerIds) => {
    updateTokenInLayer(token.id, (t) => ({ ...t, ownerIds: newOwnerIds }));

    socket.emit("dmTokenOwnershipChange", {
      sessionCode,
      tokenId: token.id,
      newOwnerIds,
    });
  };

  return {
    tokenSettingsTarget,
    setTokenSettingsTarget,
    deleteToken,
    changeTokenLayer,
    changeShowNameplate,
    changeOwner,
  };
}
