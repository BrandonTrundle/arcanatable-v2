// components/Map/MapTokenLayer.jsx
import React from "react";
import TokenSprite from "./../MapTokens/TokenSprite";

export default function MapTokenLayer({
  map,
  gridSize,
  activeLayer,
  selectedTokenId,
  onSelectToken,
  onTokenMove,
}) {
  return (
    <>
      {Object.entries(map.layers || {}).flatMap(([layerKey, layerData]) =>
        (layerData.tokens || []).map((token) => (
          <TokenSprite
            key={token.id}
            token={token}
            gridSize={gridSize}
            isSelected={token.id === selectedTokenId}
            onSelect={layerKey === activeLayer ? onSelectToken : () => {}}
            onTokenMove={layerKey === activeLayer ? onTokenMove : () => {}}
            immediatePositionOverride={
              token.id === selectedTokenId ? token.position : null
            }
            opacity={layerKey === "dm" ? 0.5 : 1}
          />
        ))
      )}
    </>
  );
}
