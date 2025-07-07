import { useEffect } from "react";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";
import { saveMap } from "../../../utils/saveMap";

export default function usePlayerSocketHandlers(
  inviteCode,
  user,
  setActiveMap,
  onChatMessage,
  stageRef,
  map,
  setActiveTurnTokenId,
  setAoes
) {
  const authToken = user?.token;

  useEffect(() => {
    if (!map || !stageRef?.current) return;

    const handlePing = ({ cell }) => {
      const stage = stageRef.current.getStage();
      const layer = stage.findOne("#PingLayer");
      if (!layer) {
        console.warn("[Player] PingLayer not found.");
        return;
      }

      const { gridSize } = map;
      const x = cell.x * gridSize + gridSize / 2;
      const y = cell.y * gridSize + gridSize / 2;

      const ring = new Konva.Circle({
        x,
        y,
        radius: 0,
        stroke: "blue",
        strokeWidth: 4,
        opacity: 0.8,
      });

      layer.add(ring);
      ring.to({
        radius: gridSize * 1.5,
        opacity: 0,
        duration: 1,
        easing: Konva.Easings.EaseOut,
        onFinish: () => ring.destroy(),
      });

      layer.batchDraw();
    };

    socket.on("dm:pingCell", handlePing);
    return () => socket.off("dm:pingCell", handlePing);
  }, [map, stageRef]);

  useEffect(() => {
    if (!map || !stageRef?.current) return;

    const handleTeleport = ({ cell }) => {
      console.log("[Player] Received teleport to cell:", cell);

      const stage = stageRef.current.getStage();
      const gridSize = map.gridSize;
      const scale = stage.scaleX();

      const centerX = (cell.x + 0.5) * gridSize * scale;
      const centerY = (cell.y + 0.5) * gridSize * scale;

      const containerWidth = stage.container().offsetWidth;
      const containerHeight = stage.container().offsetHeight;

      const newX = containerWidth / 2 - centerX;
      const newY = containerHeight / 2 - centerY;

      console.log("[Player] Teleport Debug:", {
        gridSize,
        scale,
        cell,
        centerX,
        centerY,
        containerWidth,
        containerHeight,
        newX,
        newY,
        stagePosition: {
          x: stage.x(),
          y: stage.y(),
        },
        stageScale: stage.scale(),
      });

      stage.to({
        x: newX,
        y: newY,
        duration: 1,
        easing: Konva.Easings.EaseInOut,
      });
    };

    socket.on("dm:teleportPlayerView", handleTeleport);

    return () => {
      socket.off("dm:teleportPlayerView", handleTeleport);
    };
  }, [map, stageRef]);

  useEffect(() => {
    if (inviteCode && user?.id) {
      console.log("[Player] Joining session:", inviteCode, "as", user.id);
      socket.emit("joinSession", { sessionCode: inviteCode, userId: user.id });
    }
  }, [inviteCode, user?.id]);

  useEffect(() => {
    const handleChatMessageReceived = ({ sessionCode: code, message }) => {
      if (message.sender === user?.username) return; // Skip local echo
      console.log("[Player Socket] Received chat message:", message);
      onChatMessage(message);
    };

    socket.on("chatMessageReceived", handleChatMessageReceived);

    return () => {
      socket.off("chatMessageReceived", handleChatMessageReceived);
    };
  }, [onChatMessage, user]);

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

    const handleTokenHPUpdated = ({ tokenId, hp, maxHp }) => {
      console.log("[Player] Token HP updated:", { tokenId, hp, maxHp });
      setActiveMap((prev) => {
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
    };

    const handleActiveTurnChanged = ({ tokenId }) => {
      console.log("[Player] Active turn updated:", tokenId);
      setActiveTurnTokenId(tokenId);
    };

    const handleAoEPlaced = ({ aoe }) => {
      console.log("[Player] Received AoE placement:", aoe);
      setAoes((prev) => [...prev, aoe]);
    };

    socket.on("aoeDeleted", ({ aoeId }) => {
      setAoes((prev) => prev.filter((a) => a.id !== aoeId));
    });

    socket.on("playerReceiveMap", handleReceiveMap);
    socket.on("playerReceiveTokenOwnershipChange", handleTokenOwnershipChange);
    socket.on("playerReceiveTokenMove", handleTokenMove);
    socket.on("playerReceiveTokenLayerChange", handleTokenLayerChange);
    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);
    socket.on("dmTokenMove", handleTokenMove);
    socket.on("dmDropToken", handleDMTokenDrop);
    socket.on("tokenHPUpdated", handleTokenHPUpdated);
    socket.on("activeTurnChanged", handleActiveTurnChanged);
    socket.on("aoePlaced", handleAoEPlaced);
    socket.on("updateTokenStatus", ({ tokenId, statusConditions }) => {
      setActiveMap((prevMap) => {
        const updatedMap = { ...prevMap };
        for (const layerKey of Object.keys(updatedMap.layers || {})) {
          const layer = updatedMap.layers[layerKey];
          if (layer?.tokens) {
            const tokenIndex = layer.tokens.findIndex((t) => t.id === tokenId);
            if (tokenIndex !== -1) {
              const token = layer.tokens[tokenIndex];
              const updatedToken = { ...token, statusConditions };
              updatedMap.layers[layerKey] = {
                ...layer,
                tokens: [
                  ...layer.tokens.slice(0, tokenIndex),
                  updatedToken,
                  ...layer.tokens.slice(tokenIndex + 1),
                ],
              };
            }
          }
        }
        return updatedMap;
      });
    });

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
      socket.off("updateTokenStatus");
      socket.off("tokenHPUpdated", handleTokenHPUpdated);
      socket.off("activeTurnChanged", handleActiveTurnChanged);
      socket.off("aoePlaced", handleAoEPlaced);
    };
  }, [inviteCode, setActiveMap, user]);
}

export function usePlayerChatEmitter(sessionCode) {
  return (message) => {
    socket.emit("chatMessageSent", { sessionCode, message });
  };
}
