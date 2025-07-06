import { useEffect } from "react";
import socket from "../../../../socket";

export function useDMSocketEvents(
  setActiveMap,
  sessionCode,
  onChatMessage,
  user
) {
  useEffect(() => {
    if (sessionCode) {
      socket.emit("joinSession", { sessionCode });
    }
  }, [sessionCode]);

  useEffect(() => {
    function handlePlayerDropToken({ mapId, token }) {
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
    }

    function handleTokenHPUpdated({ tokenId, hp, maxHp }) {
      setActiveMap((prev) => {
        if (!prev) return prev;

        const updatedMap = { ...prev };

        for (const layerKey of Object.keys(updatedMap.layers || {})) {
          const layer = updatedMap.layers[layerKey];
          if (layer?.tokens) {
            const updatedTokens = layer.tokens.map((t) =>
              t.id === tokenId ? { ...t, hp, maxHp } : t
            );

            updatedMap.layers[layerKey] = {
              ...layer,
              tokens: updatedTokens,
            };
          }
        }

        return updatedMap;
      });
    }

    function handleTokenDelete({ tokenId, layer }) {
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
    }

    function handlePlayerTokenMove({ id, newPos, layer }) {
      setActiveMap((prevMap) => {
        const updatedTokens = prevMap.layers[layer].tokens.map((token) =>
          token.id === id ? { ...token, position: newPos } : token
        );
        return {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [layer]: {
              ...prevMap.layers[layer],
              tokens: updatedTokens,
            },
          },
        };
      });
    }

    function handleChatMessageReceived({ sessionCode: code, message }) {
      if (message._local) return; // Skip local echo
      console.log("[DM Socket] Received chat message:", message);
      onChatMessage(message);
    }

    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);
    socket.on("playerReceiveTokenMove", handlePlayerTokenMove);
    socket.on("chatMessageReceived", handleChatMessageReceived);
    socket.on("tokenHPUpdated", handleTokenHPUpdated);

    return () => {
      socket.off("playerDropToken", handlePlayerDropToken);
      socket.off("playerReceiveTokenDelete", handleTokenDelete);
      socket.off("playerReceiveTokenMove", handlePlayerTokenMove);
      socket.off("chatMessageReceived", handleChatMessageReceived);
      socket.off("tokenHPUpdated", handleTokenHPUpdated);
    };
  }, [setActiveMap, sessionCode, onChatMessage, user]);
}

export function useDMChatEmitter(sessionCode) {
  return (message) => {
    socket.emit("dmChatMessageSent", { sessionCode, message });
  };
}
