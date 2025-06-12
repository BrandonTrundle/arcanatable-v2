import React from "react";
import styles from "../../../styles/DMToolkit/MapAssetCard.module.css";

export default function MapAssetCard({
  asset,
  onClick,
  onDelete,
  readonly = false,
}) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={asset.image} alt={asset.name} className={styles.image} />
      <h3 className={styles.name}>{asset.name}</h3>
      <p className={styles.info}>
        <strong>Size:</strong> {asset.width}x{asset.height}
      </p>
      <p className={styles.info}>
        <strong>Tags:</strong> {asset.tags?.join(", ") || "—"}
      </p>
      {!readonly && (
        <div className={styles.cardbuttons}>
          <button className="btn-primary" onClick={onClick}>
            View
          </button>
          <button className="btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
