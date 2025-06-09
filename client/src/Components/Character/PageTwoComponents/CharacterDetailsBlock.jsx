import React from "react";
import styles from "../../../styles/Characters/CharacterDetailsBlock.module.css";

const CharacterDetailsBlock = ({ details = {}, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <label className={styles.CDLabel}>
          Age
          <input
            className={styles.input}
            name="age"
            value={details.age || ""}
            onChange={handleChange}
          />
        </label>
        <label className={styles.CDLabel}>
          Height
          <input
            className={styles.CDinput}
            name="height"
            value={details.height || ""}
            onChange={handleChange}
          />
        </label>
        <label className={styles.CDLabel}>
          Weight
          <input
            className={styles.CDinput}
            name="weight"
            value={details.weight || ""}
            onChange={handleChange}
          />
        </label>
        <label className={styles.CDLabel}>
          Eyes
          <input
            className={styles.CDinput}
            name="eyes"
            value={details.eyes || ""}
            onChange={handleChange}
          />
        </label>
        <label className={styles.CDLabel}>
          Skin
          <input
            className={styles.CDinput}
            name="skin"
            value={details.skin || ""}
            onChange={handleChange}
          />
        </label>
        <label className={styles.CDLabel}>
          Hair
          <input
            className={styles.CDinput}
            name="hair"
            value={details.hair || ""}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default CharacterDetailsBlock;
