import React from "react";
import { Group } from "react-konva";
import SessionMapAssetSprite from "./Sprites/SessionMapAssetSprite";

export default function SessionMapAssetLayer({
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
          <SessionMapAssetSprite
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
