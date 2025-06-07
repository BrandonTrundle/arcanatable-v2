import React from "react";
import styles from "../../../styles/DMToolkit/MapAssetDetail.module.css";

export default function MapAssetDetail({ asset, onClose }) {
  if (!asset) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <img src={asset.image} alt={asset.name} className={styles.image} />
        <h1>{asset.name}</h1>
        <p>
          <strong>Size:</strong> {asset.width}x{asset.height}
        </p>
        <p>
          <strong>Description:</strong> {asset.description || "—"}
        </p>
        <p>
          <strong>Tags:</strong> {asset.tags?.join(", ") || "—"}
        </p>
      </div>
    </div>
  );
}
