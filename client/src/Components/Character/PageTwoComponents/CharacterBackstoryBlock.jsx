import React from "react";
import styles from "../../../styles/Characters/CharacterBackstoryBlock.module.css";

const CharacterBackstoryBlock = ({ value = "", onChange }) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Character Backstory</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your character's backstory here..."
      />
    </div>
  );
};

export default CharacterBackstoryBlock;
