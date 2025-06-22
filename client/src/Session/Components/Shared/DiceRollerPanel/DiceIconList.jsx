import React from "react";
import styles from "../../../styles/DiceRollerPanel.module.css";

export default function DiceIconList({
  diceTypes,
  selectedDie,
  setSelectedDie,
}) {
  return (
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
  );
}
