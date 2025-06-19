import { useEffect } from "react";
import socket from "../../../../socket";

export function useDMSocketEvents(setActiveMap, sessionCode) {
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

    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);
    socket.on("playerReceiveTokenMove", handlePlayerTokenMove);

    return () => {
      socket.off("playerDropToken", handlePlayerDropToken);
      socket.off("playerReceiveTokenDelete", handleTokenDelete);
      socket.off("playerReceiveTokenMove", handlePlayerTokenMove);
    };
  }, [setActiveMap]);
}
