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
  const assets = map.layers?.[activeLayer]?.assets || [];

  return (
    <Group>
      {assets.map((asset) => (
        <MapAssetSprite
          key={asset.id}
          asset={asset}
          gridSize={gridSize}
          isSelected={asset.id === selectedAssetId}
          onSelect={onSelectAsset}
          onMove={onMoveAsset}
        />
      ))}
    </Group>
  );
}
