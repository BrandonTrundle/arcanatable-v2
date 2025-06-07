import React from "react";
import styles from "../../../styles/DMToolkit/CheatEntryDetail.module.css";

export default function CheatEntryDetail({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h1>{entry.title}</h1>
        <p className={styles.description}>{entry.description}</p>
        <p className={styles.tags}>
          <strong>Tags:</strong> {entry.tags?.join(", ") || "—"}
        </p>
      </div>
    </div>
  );
}
