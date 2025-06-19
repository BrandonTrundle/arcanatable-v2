import { useEffect } from "react";
import socket from "../../../../socket";

export default function usePlayerSocketHandlers(
  inviteCode,
  user,
  setActiveMap
) {
  useEffect(() => {
    if (inviteCode) {
      socket.emit("joinSession", { sessionCode: inviteCode });
    }
  }, [inviteCode]);

  useEffect(() => {
    const handleReceiveMap = (map) => {
      setActiveMap(map);
    };

    const handleTokenOwnershipChange = ({ tokenId, newOwnerIds }) => {
      setActiveMap((prev) => {
        if (!prev) return prev;

        const layerKey = Object.entries(prev.layers).find(([_, l]) =>
          (l.tokens || []).some((t) => t.id === tokenId)
        )?.[0];

        if (!layerKey) return prev;

        const updatedTokens = prev.layers[layerKey].tokens.map((t) =>
          t.id === tokenId ? { ...t, ownerIds: newOwnerIds } : t
        );

        return {
          ...prev,
          layers: {
            ...prev.layers,
            [layerKey]: {
              ...prev.layers[layerKey],
              tokens: updatedTokens,
            },
          },
        };
      });
    };

    const handleTokenMove = ({ id, newPos, layer }) => {
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) return prev;

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
    };

    const handleTokenLayerChange = ({ tokenId, fromLayer, toLayer }) => {
      setActiveMap((prev) => {
        if (!prev?.layers?.[fromLayer] || !prev.layers[toLayer]) return prev;

        const token = prev.layers[fromLayer].tokens.find(
          (t) => t.id === tokenId
        );
        if (!token) return prev;

        const fromTokens = prev.layers[fromLayer].tokens.filter(
          (t) => t.id !== tokenId
        );
        const toTokens = [...(prev.layers[toLayer].tokens || []), token];

        return {
          ...prev,
          layers: {
            ...prev.layers,
            [fromLayer]: { ...prev.layers[fromLayer], tokens: fromTokens },
            [toLayer]: { ...prev.layers[toLayer], tokens: toTokens },
          },
        };
      });
    };

    const handlePlayerDropToken = ({ mapId, token }) => {
      setActiveMap((prev) => {
        if (!prev || prev._id !== mapId) return prev;

        const playerLayer = prev.layers.player || { tokens: [], assets: [] };
        const updatedTokens = [...(playerLayer.tokens || []), token];

        return {
          ...prev,
          layers: {
            ...prev.layers,
            player: {
              ...playerLayer,
              tokens: updatedTokens,
            },
          },
        };
      });
    };

    const handleTokenDelete = ({ tokenId, layer }) => {
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) return prev;
        const updatedTokens = prev.layers[layer].tokens.filter(
          (t) => t.id !== tokenId
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
    };

    socket.on("playerReceiveMap", handleReceiveMap);
    socket.on("playerReceiveTokenOwnershipChange", handleTokenOwnershipChange);
    socket.on("playerReceiveTokenMove", handleTokenMove);
    socket.on("playerReceiveTokenLayerChange", handleTokenLayerChange);
    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);
    socket.on("dmTokenMove", handleTokenMove);

    return () => {
      socket.off("playerReceiveMap", handleReceiveMap);
      socket.off(
        "playerReceiveTokenOwnershipChange",
        handleTokenOwnershipChange
      );
      socket.off("playerReceiveTokenMove", handleTokenMove);
      socket.off("playerReceiveTokenLayerChange", handleTokenLayerChange);
      socket.off("playerDropToken", handlePlayerDropToken);
      socket.off("playerReceiveTokenDelete", handleTokenDelete);
      socket.off("dmTokenMove", handleTokenMove);
    };
  }, [inviteCode, setActiveMap]);
}
