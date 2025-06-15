import React, { useEffect, useState } from "react";
import styles from "../../../styles/Characters/CharacterAppearanceBlock.module.css";
import defaultPortrait from "../../../assets/defaultav.png";

const CharacterAppearanceBlock = ({
  value = "",
  onChange,
  image = null, // Expect a File or a URL string
  onImageChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url); // clean up on unmount or change
    } else {
      setPreviewUrl(image); // already a URL string
    }
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file); // send File to parent
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Character Appearance</label>
      <div className={styles.flexRow}>
        <div className={styles.imageSection}>
          <img
            src={previewUrl || defaultPortrait}
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
