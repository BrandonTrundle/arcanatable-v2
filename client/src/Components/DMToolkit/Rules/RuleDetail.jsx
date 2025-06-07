import React from "react";
import styles from "../../../styles/DMToolkit/RuleDetail.module.css";

export default function RuleDetail({ rule, onClose }) {
  if (!rule) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {rule.image && (
          <img src={rule.image} alt={rule.title} className={styles.image} />
        )}

        <h1>{rule.title}</h1>
        <p className={styles.description}>{rule.description}</p>
        <p className={styles.tags}>
          <strong>Tags:</strong> {rule.tags?.join(", ") || "—"}
        </p>
      </div>
    </div>
  );
}
