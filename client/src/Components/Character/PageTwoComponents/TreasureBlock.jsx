import React from "react";
import styles from "../../../styles/Characters/TreasureBlock.module.css";

const TreasureBlock = ({ value = "", onChange }) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Treasure</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Record any important loot, treasure, or valuables..."
      />
    </div>
  );
};

export default TreasureBlock;
