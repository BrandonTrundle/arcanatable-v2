import React from "react";
import SessionTokenSprite from "./Sprites/SessionTokenSprite";

export default function SessionMapTokenLayer({
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
          <SessionTokenSprite
            key={token.id}
            token={token}
            gridSize={gridSize}
            isSelected={token.id === selectedTokenId}
            onSelect={onSelectToken}
            onTokenMove={onTokenMove}
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
