import React from "react";
import styles from "../../../styles/DiceRollerPanel.module.css";

export default function RollControls({ isDM, selectedDie, handleRoll }) {
  return (
    <div className={styles.buttons}>
      <button onClick={() => handleRoll(selectedDie, "normal")}>Roll</button>
      <button onClick={() => handleRoll(selectedDie, "advantage")}>Adv</button>
      <button onClick={() => handleRoll(selectedDie, "disadvantage")}>
        Dis
      </button>
      {isDM && (
        <button onClick={() => handleRoll(selectedDie, "secret")}>
          Secret
        </button>
      )}
    </div>
  );
}
