import { useState } from "react";

export function useDMAssetControl(setMapData, activeLayer) {
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const handleMoveAsset = (id, newPos) => {
    setMapData((prev) => {
      const assets = prev.layers[activeLayer]?.assets || [];
      const updatedAssets = assets.map((a) =>
        a.id === id ? { ...a, position: newPos } : a
      );

      return {
        ...prev,
        layers: {
          ...prev.layers,
          [activeLayer]: {
            ...prev.layers[activeLayer],
            assets: updatedAssets,
          },
        },
      };
    });
  };

  return {
    selectedAssetId,
    setSelectedAssetId,
    handleMoveAsset,
  };
}
