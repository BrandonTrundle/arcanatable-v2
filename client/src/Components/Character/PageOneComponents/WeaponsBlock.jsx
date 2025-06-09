import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const WeaponsBlock = ({
  attacks,
  handleChange,
  addAttack,
  removeAttack,
  notes,
  setNotes,
}) => {
  return (
    <div className={styles.weapons_section}>
      <div className={styles.weapons_header_row}>
        <div className={styles.weapons_header_cell}>NAME</div>
        <div className={styles.weapons_header_cell}>ATK BONUS</div>
        <div className={styles.weapons_header_cell}>DAMAGE/TYPE</div>
      </div>

      {attacks.map((attack, index) => (
        <div key={index} className={styles.weapons_row}>
          <input
            className={styles.weapons_input}
            type="text"
            placeholder="Name"
            value={attack.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            className={styles.weapons_input}
            type="text"
            placeholder="Bonus"
            value={attack.bonus}
            onChange={(e) => handleChange(index, "bonus", e.target.value)}
          />
          <input
            className={styles.weapons_input}
            type="text"
            placeholder="Damage / Type"
            value={attack.damage}
            onChange={(e) => handleChange(index, "damage", e.target.value)}
          />
          <button
            className={styles.delete_weapons_button}
            onClick={() => removeAttack(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button className={styles.add_weapons_button} onClick={addAttack}>
        + Add Attack
      </button>

      <textarea
        className={styles.weapons_notes_area}
        placeholder="Spellcasting notes or extra attack details..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

export default WeaponsBlock;
