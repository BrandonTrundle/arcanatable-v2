import React, { useEffect, useState } from "react";
import styles from "../../../styles/Characters/AlliesOrganizationsBlock.module.css";
import defaultSymbol from "../../../assets/defaultav.png";

const AlliesOrganizationsBlock = ({
  value = "",
  onChange,
  image = null, // File or string
  onImageChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // cleanup
    } else {
      setPreviewUrl(image);
    }
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file); // forward File to parent
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Allies & Organizations</label>
      <div className={styles.row}>
        <div className={styles.symbolSection}>
          <img
            src={previewUrl || defaultSymbol}
            alt="Organization Symbol"
            className={styles.symbol}
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
          placeholder="List any allies, factions, or organizations your character is affiliated with..."
        />
      </div>
    </div>
  );
};

export default AlliesOrganizationsBlock;
