export function createTokenOnDrop({
  baseToken,
  pointer,
  gridSize,
  activeLayer,
}) {
  const gridX = Math.floor(pointer.x / gridSize);
  const gridY = Math.floor(pointer.y / gridSize);

  const max = baseToken.hp?.max ?? baseToken.maxHp ?? 10;
  const current = baseToken.hp?.current ?? max;

  const newToken = {
    id: `token-${Date.now()}`,
    entityId: baseToken.id,
    entityType: baseToken.entityType || "Token",
    name: baseToken.name,
    displayName: baseToken.displayName || baseToken.name,
    image: baseToken.image,
    position: { x: gridX, y: gridY },
    size: baseToken.size || { width: 1, height: 1 },
    rotation: 0,
    hp: {
      current,
      max,
    },
    initiative: baseToken.initiative || 0,
    statusConditions: baseToken.statusConditions || [],
    effects: baseToken.effects || [],
    ownerIds: baseToken.ownerIds || [],
    isVisible: activeLayer === "player",
    activeToken: false,
    lightEmit: baseToken.lightEmit || null,
    notes: baseToken.notes || "",
  };

  console.log("✅ Created new token:", newToken);

  return newToken;
}
