export function characterToToken(character) {
  return {
    id: crypto.randomUUID(), // or any unique method you already use
    name: character.name,
    image: character.portraitImage,
    size: { width: 1, height: 1 },
    position: { x: 0, y: 0 }, // this will be overridden on drop
    hp: character.currenthp || character.maxHp || 1,
    maxHp: character.maxHp || 1,
    isVisible: true,
    rotation: 0,
    isPC: true,
    pcId: character._id,
    initiative: character.initiative || 0,
    ownerId: character.creator,
  };
}
