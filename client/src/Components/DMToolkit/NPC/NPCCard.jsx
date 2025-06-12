import React from "react";
import styles from "../../../styles/DMToolkit/NPCCard.module.css";

export default function NPCCard({ npc, onClick, onEdit, onDelete }) {
  const data = npc.content || npc;

  return (
    <div className={styles.card} onClick={onClick}>
      <img src={data.image} alt={data.name} className={styles.image} />
      <h3 className={styles.name}>{data.name}</h3>
      <p className={styles.info}>
        <strong>Class:</strong> {data.class} | <strong>Race:</strong>{" "}
        {data.race}
      </p>
      <p className={styles.info}>
        <strong>HP:</strong> {data.hitPoints} | <strong>AC:</strong>{" "}
        {data.armorClass}
      </p>
      <p className={styles.info}>
        <strong>Role:</strong> {data.occupation}
      </p>

      <p className={styles.info}>
        <strong>HP:</strong> {npc.hitPoints} | <strong>AC:</strong>{" "}
        {npc.armorClass}
      </p>
      <p className={styles.info}>
        <strong>Role:</strong> {npc.occupation}
      </p>
      <div className={styles.cardbuttons}>
        <button
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(); // trigger detail view
          }}
        >
          View
        </button>
        <button
          className="btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(npc);
          }}
        >
          Edit
        </button>
        <button
          className="btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(npc._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
