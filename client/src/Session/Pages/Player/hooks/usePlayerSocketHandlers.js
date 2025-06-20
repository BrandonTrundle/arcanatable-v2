import { useEffect } from "react";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function usePlayerSocketHandlers(
  inviteCode,
  user,
  setActiveMap
) {
  const authToken = user?.token;

  useEffect(() => {
    if (inviteCode) {
      console.log("[Player] Joining session:", inviteCode);
      socket.emit("joinSession", { sessionCode: inviteCode });
    }
  }, [inviteCode]);

  useEffect(() => {
    const handleReceiveMap = (map) => {
      console.log("[Player] Received map update:", map);
      setActiveMap(() => {
        debounceSave(() => saveMap(map, authToken));
        return map;
      });
    };

    const handleTokenOwnershipChange = ({ tokenId, newOwnerIds }) => {
      console.log("[Player] Token ownership change:", { tokenId, newOwnerIds });
      setActiveMap((prev) => {
        if (!prev) return prev;

        const layerKey = Object.entries(prev.layers).find(([_, l]) =>
          (l.tokens || []).some((t) => t.id === tokenId)
        )?.[0];
        if (!layerKey) {
          console.warn("[Player] Token not found for ownership change.");
          return prev;
        }

        const updatedTokens = prev.layers[layerKey].tokens.map((t) =>
          t.id === tokenId ? { ...t, ownerIds: newOwnerIds } : t
        );

        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layerKey]: {
              ...prev.layers[layerKey],
              tokens: updatedTokens,
            },
          },
        };

        debounceSave(() => saveMap(updatedMap, authToken));
        return updatedMap;
      });
    };

    const handleTokenMove = ({ id, newPos, layer }) => {
      console.log("[Player] Token move:", { id, newPos, layer });
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) {
          console.warn("[Player] Layer not found for token move:", layer);
          return prev;
        }

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
        return updatedMap;
      });
    };

    const handleTokenLayerChange = ({ tokenId, fromLayer, toLayer }) => {
      console.log("[Player] Token layer change:", {
        tokenId,
        fromLayer,
        toLayer,
      });
      setActiveMap((prev) => {
        if (!prev?.layers?.[fromLayer] || !prev.layers[toLayer]) {
          console.warn("[Player] Missing fromLayer or toLayer.");
          return prev;
        }

        const token = prev.layers[fromLayer].tokens.find(
          (t) => t.id === tokenId
        );
        if (!token) {
          console.warn("[Player] Token not found in fromLayer:", fromLayer);
          return prev;
        }

        const fromTokens = prev.layers[fromLayer].tokens.filter(
          (t) => t.id !== tokenId
        );
        const toTokens = [...(prev.layers[toLayer].tokens || []), token];

        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [fromLayer]: {
              ...prev.layers[fromLayer],
              tokens: fromTokens,
            },
            [toLayer]: {
              ...prev.layers[toLayer],
              tokens: toTokens,
            },
          },
        };

        console.log("[Player] Token successfully moved between layers.");
        debounceSave(() => saveMap(updatedMap, authToken));
        return updatedMap;
      });
    };

    const handlePlayerDropToken = ({ mapId, token }) => {
      console.log("[Player] Player drop token event:", token);
      setActiveMap((prev) => {
        if (!prev || prev._id !== mapId) {
          console.warn("[Player] Map ID mismatch on playerDropToken.");
          return prev;
        }

        const layerKey = token._layer || "player";
        console.log("[Player] Adding token to layer:", layerKey);

        const currentLayer = prev.layers[layerKey] || {
          tokens: [],
          assets: [],
        };

        const updatedTokens = [...(currentLayer.tokens || []), token];

        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layerKey]: {
              ...currentLayer,
              tokens: updatedTokens,
            },
          },
        };

        debounceSave(() => saveMap(updatedMap, authToken));
        return updatedMap;
      });
    };

    const handleDMTokenDrop = ({ sessionCode, mapId, token }) => {
      console.log("[Player] Received dmDropToken:", token);

      setActiveMap((prev) => {
        if (!prev || prev._id !== mapId) {
          console.warn("[Player] Map ID mismatch. Ignored token drop.");
          return prev;
        }

        const layerKey = token._layer || "player";
        console.log("[Player] Adding token to layer:", layerKey);

        const currentLayer = prev.layers[layerKey] || {
          tokens: [],
          assets: [],
        };
        const updatedTokens = [...(currentLayer.tokens || []), token];

        const updatedMap = {
          ...prev,
          layers: {
            ...prev.layers,
            [layerKey]: {
              ...currentLayer,
              tokens: updatedTokens,
            },
          },
        };

        debounceSave(() => saveMap(updatedMap, authToken));
        return updatedMap;
      });
    };

    const handleTokenDelete = ({ tokenId, layer }) => {
      console.log("[Player] Token delete event:", { tokenId, layer });
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) {
          console.warn("[Player] Layer not found for token delete:", layer);
          return prev;
        }

        const updatedTokens = prev.layers[layer].tokens.filter(
          (t) => t.id !== tokenId
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
        return updatedMap;
      });
    };

    socket.on("playerReceiveMap", handleReceiveMap);
    socket.on("playerReceiveTokenOwnershipChange", handleTokenOwnershipChange);
    socket.on("playerReceiveTokenMove", handleTokenMove);
    socket.on("playerReceiveTokenLayerChange", handleTokenLayerChange);
    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);
    socket.on("dmTokenMove", handleTokenMove);
    socket.on("dmDropToken", handleDMTokenDrop);

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
      socket.off("dmDropToken", handleDMTokenDrop);
    };
  }, [inviteCode, setActiveMap, user]);
}
