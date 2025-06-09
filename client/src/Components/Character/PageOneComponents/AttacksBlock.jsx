import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const AttacksBlock = ({ attacks, handleChange, addAttack, removeAttack }) => {
  return (
    <div className={styles.attacks_section}>
      <div className={styles.attack_header}>Attacks</div>
      {attacks.map((attack, index) => (
        <div key={index} className={styles.attack_row}>
          <input
            type="text"
            className={styles.attack_input}
            placeholder="Name"
            value={attack.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            className={styles.attack_input}
            placeholder="Bonus"
            value={attack.bonus}
            onChange={(e) => handleChange(index, "bonus", e.target.value)}
          />
          <input
            type="text"
            className={styles.attack_input}
            placeholder="Damage / Type"
            value={attack.damage}
            onChange={(e) => handleChange(index, "damage", e.target.value)}
          />
          <button
            className={styles.delete_equipment_button}
            onClick={() => removeAttack(index)}
          >
            ✕
          </button>
        </div>
      ))}
      <button className={styles.add_attack_button} onClick={addAttack}>
        + Add Attack
      </button>
    </div>
  );
};

export default AttacksBlock;
