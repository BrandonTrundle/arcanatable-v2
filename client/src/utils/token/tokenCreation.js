export function createTokenOnDrop({
  baseToken,
  pointer,
  gridSize,
  activeLayer,
}) {
  const gridX = Math.floor(pointer.x / gridSize);
  const gridY = Math.floor(pointer.y / gridSize);

  return {
    ...baseToken,
    id: `token-${Date.now()}`,
    position: { x: gridX, y: gridY },
    hp: baseToken.hp,
    maxHp: baseToken.maxHp,
    statusConditions: [],
    effects: [],
    initiative: 0,
    notes: "",
    activeToken: false,
    rotation: 0,
    isVisible: activeLayer === "player",
  };
}
