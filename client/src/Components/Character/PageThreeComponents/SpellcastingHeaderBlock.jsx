import React from "react";
import styles from "../../../styles/Characters/SpellcastingHeaderBlock.module.css";

const SpellcastingHeaderBlock = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <label className={styles.SHBlabel}>
          Spellcasting Class
          <input
            className={styles.SHBinput}
            type="text"
            name="class"
            value={data.class}
            onChange={handleChange}
          />
        </label>

        <label className={styles.SHBlabel}>
          Spellcasting Ability
          <input
            className={styles.SHBinput}
            type="text"
            name="ability"
            value={data.ability}
            onChange={handleChange}
          />
        </label>

        <label className={styles.SHBlabel}>
          Spell Save DC
          <input
            className={styles.SHBinput}
            type="number"
            name="saveDC"
            value={data.saveDC}
            onChange={handleChange}
          />
        </label>

        <label className={styles.SHBlabel}>
          Spell Attack Bonus
          <input
            className={styles.SHBinput}
            type="number"
            name="attackBonus"
            value={data.attackBonus}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default SpellcastingHeaderBlock;
