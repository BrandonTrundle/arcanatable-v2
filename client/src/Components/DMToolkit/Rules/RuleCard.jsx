import React from "react";
import styles from "../../../styles/DMToolkit/RuleCard.module.css";

export default function RuleCard({ rule, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      {rule.image && (
        <img src={rule.image} alt={rule.title} className={styles.image} />
      )}
      <h3 className={styles.title}>{rule.title}</h3>
      <p className={styles.tags}>{rule.tags?.slice(0, 3).join(", ") || "—"}</p>
      <div className={styles.cardbuttons}>
        <button className="btn-primary">Edit</button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
