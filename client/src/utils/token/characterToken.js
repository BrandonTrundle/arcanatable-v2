export function characterToToken(character) {
  const ownerId = character.creator;
  return {
    acitveToken: false,
    effects: [],
    id: crypto.randomUUID(),
    name: character.name,
    image: character.portraitImage || character.image || "",
    size: { width: 1, height: 1 },
    position: { x: 0, y: 0 },
    hp: character.currenthp || character.maxHp || 1,
    maxHp: character.maxHp || 1,
    isVisible: true,
    lightEmit: null,
    rotation: 0,
    isPC: true,
    entityType: "PC",
    pcId: character._id || character.id,
    initiative: character.initiative || 0,
    ownerId,
    ownerIds: [ownerId],
  };
}
