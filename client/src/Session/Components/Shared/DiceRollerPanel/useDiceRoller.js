import { useState } from "react";

export function useDiceRoller({
  isDM,
  sendMessage,
  selectedToken,
  defaultSender,
  defaultSenderId,
}) {
  const [modifier, setModifier] = useState(0);
  const [diceCount, setDiceCount] = useState(1);
  const [selectedDie, setSelectedDie] = useState("d20");

  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  const handleRoll = (type, mode, label = null) => {
    const sender =
      selectedToken?.name || defaultSender || (isDM ? "DM" : "Player");
    const image = selectedToken?.image || null;

    // Parse complex formulas like "2d6 + 3"
    const match = type.match(/(\d+)d(\d+)(?:\s*([\+\-])\s*(\d+))?/);
    if (!match) {
      console.error("Invalid roll formula:", type);
      return;
    }

    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const op = match[3];
    const modVal = match[4] ? parseInt(match[4], 10) : 0;
    const mod = op === "-" ? -modVal : modVal;

    if (mode === "advantage" || mode === "disadvantage") {
      const firstSet = Array.from({ length: count }, () => rollDie(sides));
      const secondSet = Array.from({ length: count }, () => rollDie(sides));
      const total1 = firstSet.reduce((a, b) => a + b, 0);
      const total2 = secondSet.reduce((a, b) => a + b, 0);
      const selected =
        mode === "advantage"
          ? Math.max(total1, total2)
          : Math.min(total1, total2);
      const total = selected + mod;

      const message = `${sender}:
Rolled ${
        label || `${count}d${sides}`
      } with ${mode}: ${firstSet} vs ${secondSet} ⇒ ${selected} + ${mod} = ${total}`;

      sendMessage({
        sender,
        text: message,
        image,
        broadcast: mode !== "secret",
        senderId: defaultSenderId,
      });
      return;
    }

    const rolls = Array.from({ length: count }, () => rollDie(sides));
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + mod;
    const message = `${sender}:
Rolled ${label || `${count}d${sides}`} + ${mod}: [${rolls.join(
      ", "
    )}] = ${total}`;

    sendMessage({
      sender,
      text: message,
      image,
      _local: isDM && mode === "secret",
      senderId: defaultSenderId,
    });
  };

  return {
    modifier,
    setModifier,
    diceCount,
    setDiceCount,
    selectedDie,
    setSelectedDie,
    handleRoll,
  };
}
