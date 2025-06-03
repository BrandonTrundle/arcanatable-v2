import React from "react";
import styles from "../../../styles/DMToolkit/NPCCard.module.css";

export default function NPCCard({ npc, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={npc.image} alt={npc.name} className={styles.image} />
      <h3 className={styles.name}>{npc.name}</h3>
      <p className={styles.info}>
        <strong>Class:</strong> {npc.class} | <strong>Race:</strong> {npc.race}
      </p>
      <p className={styles.info}>
        <strong>HP:</strong> {npc.hitPoints} | <strong>AC:</strong>{" "}
        {npc.armorClass}
      </p>
      <p className={styles.info}>
        <strong>Role:</strong> {npc.occupation}
      </p>
      <div className={styles.cardbuttons}>
        <button className="btn-primary">Edit</button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
