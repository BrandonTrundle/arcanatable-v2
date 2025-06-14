import React from "react";
import { Group } from "react-konva";
import MapAssetSprite from "../MapAssets/MapAssetSprite";

export default function MapAssetLayer({
  map,
  gridSize,
  activeLayer,
  selectedAssetId,
  onSelectAsset,
  onMoveAsset,
}) {
  return (
    <Group>
      {Object.entries(map.layers || {}).flatMap(([layerKey, layerData]) =>
        (layerData.assets || []).map((asset) => (
          <MapAssetSprite
            key={asset.id}
            asset={asset}
            gridSize={gridSize}
            isSelected={asset.id === selectedAssetId}
            onSelect={onSelectAsset}
            onMove={onMoveAsset}
            opacity={layerKey === "dm" ? 0.5 : 1}
          />
        ))
      )}
    </Group>
  );
}
