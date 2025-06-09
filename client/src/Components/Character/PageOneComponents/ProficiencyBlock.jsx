import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const ProficiencyBlock = ({
  inspirationBonus,
  setInspirationBonus,
  proficiencyBonus,
  setProficiencyBonus,
}) => {
  return (
    <div className={styles.proficiency_section}>
      <div className={styles.prof_row}>
        <input
          type="number"
          className={styles.prof_value}
          value={inspirationBonus}
          onChange={(e) => setInspirationBonus(parseInt(e.target.value) || 0)}
        />
        <div className={styles.prof_box}>Inspiration</div>
      </div>
      <div className={styles.prof_row}>
        <input
          type="number"
          className={styles.prof_value}
          value={proficiencyBonus}
          onChange={(e) => setProficiencyBonus(parseInt(e.target.value) || 0)}
        />
        <div className={styles.prof_box}>Proficiency Bonus</div>
      </div>
    </div>
  );
};

export default ProficiencyBlock;
