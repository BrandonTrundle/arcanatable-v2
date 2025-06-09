import React from "react";
import styles from "../../../styles/Characters/AdditionalFeaturesBlock.module.css";

const AdditionalFeaturesBlock = ({ value = "", onChange }) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Additional Features & Traits</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter any additional features or traits your character has..."
      />
    </div>
  );
};

export default AdditionalFeaturesBlock;
