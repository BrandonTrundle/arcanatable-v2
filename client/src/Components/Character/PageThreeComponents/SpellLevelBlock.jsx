import React from "react";
import styles from "../../../styles/Characters/SpellLevelBlock.module.css";

const SpellLevelBlock = ({ data, onChange }) => {
  const { level, slotsMax, slotsUsed, spells } = data;

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSpellChange = (index, value) => {
    const updated = [...spells];
    updated[index] = value;
    onChange({ spells: updated });
  };

  const addSpell = () => {
    onChange({ spells: [...spells, ""] });
  };

  const removeSpell = (index) => {
    const updated = spells.filter((_, i) => i !== index);
    onChange({ spells: updated });
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Level {level} Spells</h3>

      {level !== 0 && (
        <div className={styles.slotsRow}>
          <label className={styles.SLBlabel}>
            Slots Total
            <input
              type="number"
              name="slotsMax"
              className={styles.SLBinput}
              value={slotsMax || ""}
              onChange={handleSlotChange}
            />
          </label>
          <label className={styles.SLBlabel}>
            Slots Expended
            <input
              type="number"
              name="slotsUsed"
              className={styles.SLBinput}
              value={slotsUsed || ""}
              onChange={handleSlotChange}
            />
          </label>
        </div>
      )}

      <div className={styles.spellList}>
        {spells.map((spell, idx) => (
          <div key={idx} className={styles.spellRow}>
            <input
              type="text"
              className={styles.spellInput}
              value={spell}
              onChange={(e) => handleSpellChange(idx, e.target.value)}
              placeholder="Spell Name"
            />
            <button
              className={styles.deleteButton}
              onClick={() => removeSpell(idx)}
            >
              ×
            </button>
          </div>
        ))}
        <button className={styles.addButton} onClick={addSpell}>
          + Add Spell
        </button>
      </div>
    </div>
  );
};

export default SpellLevelBlock;
