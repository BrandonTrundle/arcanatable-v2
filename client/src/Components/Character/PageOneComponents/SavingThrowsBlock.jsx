import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const defaultEntry = { checked: false, bonus: "" };

const SavingThrowsBlock = ({ savingThrows, setSavingThrows }) => {
  const handleCheckboxChange = (stat, checked) => {
    const current = savingThrows[stat] ?? defaultEntry;
    setSavingThrows({
      ...savingThrows,
      [stat]: { ...current, checked },
    });
  };
  const handleBonusChange = (stat, bonus) => {
    const current = savingThrows[stat] ?? defaultEntry;
    setSavingThrows({
      ...savingThrows,
      [stat]: { ...current, bonus },
    });
  };

  const stats = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  return (
    <div className={styles.savingthrows_section}>
      <label className={styles.section_label}>Saving Throws</label>
      {stats.map((stat) => {
        const entry = savingThrows[stat] ?? defaultEntry;
        return (
          <div key={stat} className={styles.st_row}>
            <input
              type="checkbox"
              checked={!!entry.checked}
              onChange={(e) => handleCheckboxChange(stat, e.target.checked)}
            />
            <input
              type="text"
              className={styles.st_bonus_input}
              value={entry.bonus ?? ""}
              placeholder="+0"
              onChange={(e) => handleBonusChange(stat, e.target.value)}
            />
            <label className={styles.st_label}>{stat}</label>
          </div>
        );
      })}
    </div>
  );
};

export default SavingThrowsBlock;
