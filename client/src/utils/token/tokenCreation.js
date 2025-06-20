export function createTokenOnDrop({
  baseToken,
  pointer,
  gridSize,
  activeLayer,
}) {
  console.debug("📦 Received baseToken:", JSON.stringify(baseToken, null, 2));
  const gridX = Math.floor(pointer.x / gridSize);
  const gridY = Math.floor(pointer.y / gridSize);

  const newToken = {
    id: `token-${Date.now()}`,
    name: baseToken.name,
    image: baseToken.image,

    entityType: baseToken.entityType, // Should be "PC" | "NPC" | "Monster"
    entityId: baseToken.entityId,

    isPC: baseToken.entityType === "PC",
    pcId: baseToken.entityType === "PC" ? baseToken.entityId : undefined,
    npcId: baseToken.entityType === "NPC" ? baseToken.entityId : undefined,
    monsterId:
      baseToken.entityType === "Monster" ? baseToken.entityId : undefined,

    ownerId: baseToken.ownerId || null,
    ownerIds: baseToken.ownerIds || [],

    hp:
      typeof baseToken.hp === "number"
        ? baseToken.hp
        : baseToken.hp?.current ?? 10,
    maxHp: baseToken.maxHp ?? baseToken.hp?.max ?? 10,
    initiative: baseToken.initiative ?? 0,

    size: baseToken.size || { width: 1, height: 1 },
    position: { x: gridX, y: gridY },
    rotation: baseToken.rotation ?? 0,
    isVisible: activeLayer === "player",

    lightEmit: baseToken.lightEmit ?? null,
    effects: baseToken.effects ?? [],
    statusConditions: baseToken.statusConditions ?? [],
    notes: baseToken.notes ?? "",
  };

  console.debug("🆕 Token Created:", JSON.stringify(newToken, null, 2));

  return newToken;
}
