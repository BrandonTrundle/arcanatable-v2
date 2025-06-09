import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const AbilitiesBlock = ({ abilities, onAbilityChange }) => {
  const calculateMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return (mod >= 0 ? "+" : "") + mod;
  };

  return (
    <div className={styles.ability_section}>
      {Object.entries(abilities).map(([ability, score]) => (
        <div key={ability} className={styles.ab_score}>
          <div>{ability}</div>
          <input
            type="number"
            className={styles.ab_stat}
            value={score}
            onChange={(e) => onAbilityChange(ability, e.target.value)}
          />
          <div className={styles.ab_mod}>{calculateMod(score)}</div>
        </div>
      ))}
    </div>
  );
};

export default AbilitiesBlock;
