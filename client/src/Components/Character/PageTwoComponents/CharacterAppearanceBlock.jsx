import React from "react";
import styles from "../../../styles/Characters/CharacterAppearanceBlock.module.css";
import defaultPortrait from "../../../assets/defaultav.png";

const CharacterAppearanceBlock = ({
  value = "",
  onChange,
  image = null,
  onImageChange,
}) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(URL.createObjectURL(file)); // local preview
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Character Appearance</label>
      <div className={styles.flexRow}>
        <div className={styles.imageSection}>
          <img
            src={image || defaultPortrait}
            alt="Character portrait"
            className={styles.portrait}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
        </div>

        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your character's appearance..."
        />
      </div>
    </div>
  );
};

export default CharacterAppearanceBlock;
