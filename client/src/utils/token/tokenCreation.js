export function createTokenOnDrop({
  baseToken,
  pointer,
  gridSize,
  activeLayer,
}) {
  const gridX = Math.floor(pointer.x / gridSize);
  const gridY = Math.floor(pointer.y / gridSize);

  return {
    id: `token-${Date.now()}`,
    entityId: baseToken.id,
    entityType: baseToken.entityType || "Token",
    name: baseToken.name,
    displayName: baseToken.displayName || baseToken.name,
    image: baseToken.image,
    position: { x: gridX, y: gridY },
    size: baseToken.size || { width: 1, height: 1 },
    rotation: 0,
    hp: baseToken.hitPoints ?? 0,
    maxHp: baseToken.hitPoints ?? 0,
    initiative: 0,
    statusConditions: [],
    effects: [],
    ownerIds: [],
    isVisible: activeLayer === "player",
    activeToken: false,
    lightEmit: null,
    notes: "",
  };
}
