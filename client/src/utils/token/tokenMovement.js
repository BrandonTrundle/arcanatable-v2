export function moveTokenOnMap(prevMap, id, newPos) {
  const updatedMap = { ...prevMap };
  const clampedX = Math.max(0, Math.min(newPos.x, prevMap.width - 1));
  const clampedY = Math.max(0, Math.min(newPos.y, prevMap.height - 1));

  for (const layerKey of ["player", "dm", "hidden"]) {
    const tokens = updatedMap.layers[layerKey].tokens;
    const index = tokens.findIndex((t) => t.id === id);

    if (index !== -1) {
      const oldToken = tokens[index];

      const updatedToken = {
        ...oldToken,
        position: { x: clampedX, y: clampedY },
      };

      const updatedTokens = [...tokens];
      updatedTokens[index] = updatedToken;

      updatedMap.layers[layerKey] = {
        ...updatedMap.layers[layerKey],
        tokens: updatedTokens,
      };

      break;
    }
  }

  return updatedMap;
}
