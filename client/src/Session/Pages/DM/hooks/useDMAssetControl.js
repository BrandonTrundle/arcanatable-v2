import { useState } from "react";
import socket from "../../../../socket";

export function useDMAssetControl(setMapData, sessionCode) {
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const handleMoveAsset = (id, newPos) => {
    setMapData((prev) => {
      const updated = { ...prev };
      let moved = false;

      for (const layerKey of Object.keys(updated.layers || {})) {
        const layer = updated.layers[layerKey];
        if (!layer.assets) continue;

        updated.layers[layerKey].assets = layer.assets.map((a) => {
          if (a.id === id) {
            moved = true;
            const updatedAsset = { ...a, position: newPos };
            // Emit move event
            socket.emit("mapAssetMoved", {
              sessionCode,
              assetId: id,
              position: newPos,
            });
            return updatedAsset;
          }
          return a;
        });

        if (moved) break;
      }

      return updated;
    });
  };

  return {
    selectedAssetId,
    setSelectedAssetId,
    handleMoveAsset,
  };
}
