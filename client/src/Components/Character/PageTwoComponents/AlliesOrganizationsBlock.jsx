import React from "react";
import styles from "../../../styles/Characters/AlliesOrganizationsBlock.module.css";
import defaultSymbol from "../../../assets/defaultav.png"; // You can replace with a better placeholder if desired

const AlliesOrganizationsBlock = ({
  value = "",
  onChange,
  image = null,
  onImageChange,
}) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Allies & Organizations</label>
      <div className={styles.row}>
        <div className={styles.symbolSection}>
          <img
            src={image || defaultSymbol}
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
