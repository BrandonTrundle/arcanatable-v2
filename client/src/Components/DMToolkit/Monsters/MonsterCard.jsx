import React from "react";
import styles from "../../../styles/DMToolkit/MonsterCard.module.css";

export default function MonsterCard({ monster, onClick, onEdit, onDelete }) {
  const data = monster.content || {};

  return (
    <div className={styles.card} onClick={onClick}>
      <img src={data.image} alt={data.name} className={styles.image} />
      <h3 className={styles.name}>{data.name}</h3>
      <p className={styles.info}>
        <strong>Type:</strong> {data.size} {data.type}, {data.alignment}
      </p>
      <p className={styles.info}>
        <strong>HP:</strong> {data.hitPoints} | <strong>AC:</strong>{" "}
        {data.armorClass}
      </p>
      <p className={styles.info}>
        <strong>CR:</strong> {data.challengeRating}
      </p>
      <div className={styles.cardbuttons}>
        <button onClick={onClick}>View</button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(monster);
          }}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(monster._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
