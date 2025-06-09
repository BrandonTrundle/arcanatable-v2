import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const CharacterHeader = ({
  characterName,
  setCharacterName,
  headerFields,
  setHeaderFields,
}) => {
  const handleFieldChange = (field, value) => {
    setHeaderFields(field, value); // remove `prev =>` logic
  };

  return (
    <div className={styles.header_section}>
      <div className={styles.character_name_block}>
        <label>Character Name</label>
        <input
          type="text"
          className={styles.character_name_input}
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
      </div>

      <div className={styles.header_grid}>
        {[
          "Class",
          "Level",
          "Background",
          "Race",
          "Alignment",
          "Experience Points",
        ].map((label) => (
          <div key={label}>
            <label>{label}</label>
            <input
              type="text"
              className={styles.header_input}
              value={headerFields[label] || ""}
              onChange={(e) => handleFieldChange(label, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterHeader;
