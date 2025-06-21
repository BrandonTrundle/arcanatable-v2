import React, { useState, useRef } from "react";
import styles from "../../styles/DiceRollerPanel.module.css";
import d4Icon from "../../../assets/icons/d4Icon.png";
import d6Icon from "../../../assets/icons/d6Icon.png";
import d8Icon from "../../../assets/icons/d8Icon.png";
import d10Icon from "../../../assets/icons/d10Icon.png";
import d12Icon from "../../../assets/icons/d12Icon.png";
import d20Icon from "../../../assets/icons/d20Icon.png";
import d100Icon from "../../../assets/icons/d100Icon.png";

const diceTypes = [
  { type: "d4", icon: d4Icon },
  { type: "d6", icon: d6Icon },
  { type: "d8", icon: d8Icon },
  { type: "d10", icon: d10Icon },
  { type: "d12", icon: d12Icon },
  { type: "d20", icon: d20Icon },
  { type: "d100", icon: d100Icon },
];

export default function DiceRollerPanel({
  isDM,
  onClose,
  sendMessage,
  selectedToken,
  defaultSender,
  defaultSenderId, // ✅ added
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modifier, setModifier] = useState(0);
  const [diceCount, setDiceCount] = useState(1);
  const [selectedDie, setSelectedDie] = useState("d20");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  const handleRoll = (type, mode) => {
    const sender =
      selectedToken?.name || defaultSender || (isDM ? "DM" : "Player");
    const image = selectedToken?.image || null;

    const sides = parseInt(type.replace("d", ""));
    let rolls = [];

    if (mode === "advantage" || mode === "disadvantage") {
      const firstSet = Array.from({ length: diceCount }, () => rollDie(sides));
      const secondSet = Array.from({ length: diceCount }, () => rollDie(sides));
      const total1 = firstSet.reduce((a, b) => a + b, 0);
      const total2 = secondSet.reduce((a, b) => a + b, 0);
      const selected =
        mode === "advantage"
          ? Math.max(total1, total2)
          : Math.min(total1, total2);
      const total = selected + modifier;
      const message = `Rolled ${diceCount}${type} with ${mode}: ${firstSet} vs ${secondSet} ⇒ ${selected} + ${modifier} = ${total}`;

      sendMessage({
        sender,
        text: message,
        image,
        broadcast: mode !== "secret",
        senderId: defaultSenderId, // ✅ include ID
      });
      return;
    }

    rolls = Array.from({ length: diceCount }, () => rollDie(sides));
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + modifier;
    const message = `Rolled ${diceCount}${type} + ${modifier}: [${rolls.join(
      ", "
    )}]= ${total}`;
    sendMessage({
      sender,
      text: message,
      image,
      _local: isDM && mode === "secret",
      senderId: defaultSenderId, // ✅ include ID
    });
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleMouseDown = (e) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className={styles.panel}
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span>Dice Roller</span>
        <div className={styles.controls}>
          <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>
          <button onClick={onClose}>x</button>
        </div>
      </div>
      {!isCollapsed && (
        <div className={styles.content}>
          <div className={styles.diceList}>
            {diceTypes.map(({ type, icon }) => (
              <img
                key={type}
                src={icon}
                alt={type}
                className={`${styles.dieIcon} ${
                  selectedDie === type ? styles.selected : ""
                }`}
                onClick={() => setSelectedDie(type)}
              />
            ))}
          </div>

          <div className={styles.modifierRow}>
            <label>Dice:</label>
            <input
              type="number"
              min="1"
              value={diceCount}
              onChange={(e) =>
                setDiceCount(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
            />
            <label>Mod:</label>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className={styles.buttons}>
            <button onClick={() => handleRoll(selectedDie, "normal")}>
              Roll
            </button>
            <button onClick={() => handleRoll(selectedDie, "advantage")}>
              Adv
            </button>
            <button onClick={() => handleRoll(selectedDie, "disadvantage")}>
              Dis
            </button>
            {isDM && (
              <button onClick={() => handleRoll(selectedDie, "secret")}>
                Secret
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
