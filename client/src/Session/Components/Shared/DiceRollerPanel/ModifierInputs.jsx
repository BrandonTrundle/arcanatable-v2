import React from "react";
import styles from "../../../styles/DiceRollerPanel.module.css";

export default function ModifierInputs({
  diceCount,
  setDiceCount,
  modifier,
  setModifier,
}) {
  return (
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
  );
}
