import { useState, useEffect } from "react";
import { useEscapeDeselect } from "../../../../hooks/tokens/useEscapeDeselect";
import { useKeyboardTokenControl } from "../../../../hooks/tokens/useKeyboardTokenControl";
import { handleTokenMoveWithFog } from "../../../../utils/token/tokenMoveWithFog";
import socket from "../../../../socket";
import { debounceSave } from "../../../utils/debounceSave";

export function useDMTokenControl({
  map,
  setMapData,
  sessionCode,
  toolMode,
  onSelectToken,
  user,
}) {
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [tokenSettingsTarget, setTokenSettingsTarget] = useState(null);

  useEscapeDeselect(() => setSelectedTokenId(null));

  const handleTokenMove = (id, newPos) => {
    const tokenLayer = Object.entries(map.layers || {}).find(([, layerData]) =>
      (layerData.tokens || []).some((t) => t.id === id)
    )?.[0];

    if (!tokenLayer) return;

    const tokenData = { id, newPos, layer: tokenLayer };

    setMapData((prevMap) => {
      const updatedMap = handleTokenMoveWithFog({
        map: prevMap,
        id,
        newPos,
        activeLayer: tokenLayer,
      });

      debounceSave(() => {
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/maps/${updatedMap._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`, // 👈 assuming user.token is available
            },
            body: JSON.stringify(updatedMap),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to save map");
            return res.json();
          })
          .then((data) => {})
          .catch((err) => {
            console.error("Error saving DM map:", err);
          });
      });

      return updatedMap;
    });

    socket.emit("dmTokenMove", { sessionCode, tokenData });
  };

  useKeyboardTokenControl({
    selectedTokenId,
    map,
    activeLayer: null,
    onMove: handleTokenMove,
  });

  const handleSelectToken = (id) => {
    if (toolMode !== "select") return;
    setSelectedTokenId(id);
    if (typeof onSelectToken === "function") {
      const token = Object.entries(map.layers || {})
        .flatMap(([layerKey, layer]) =>
          (layer.tokens || []).map((t) => ({ ...t, _layer: layerKey }))
        )
        .find((t) => t.id === id);
      onSelectToken(token || null);
    }
  };

  const handleOpenSettings = (token) => {
    const layer = Object.entries(map.layers || {}).find(([_, l]) =>
      (l.tokens || []).some((t) => t.id === token.id)
    )?.[0];
    setTokenSettingsTarget({ ...token, _layer: layer });
  };

  return {
    selectedTokenId,
    handleSelectToken,
    handleTokenMove,
    tokenSettingsTarget,
    setTokenSettingsTarget,
    handleOpenSettings,
  };
}
