import React from "react";
import styles from "../../../styles/DMToolkit/CheatEntryCard.module.css";

export default function CheatEntryCard({ entry, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <h3 className={styles.title}>{entry.title}</h3>
      <p className={styles.tags}>{entry.tags?.slice(0, 3).join(", ") || "—"}</p>
      <div className={styles.cardbuttons}>
        <button className="btn-primary">Edit</button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
