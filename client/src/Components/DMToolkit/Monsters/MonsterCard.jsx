import React from "react";
import styles from "../../../styles/DMToolkit/MonsterCard.module.css";

export default function MonsterCard({ monster, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={monster.image} alt={monster.name} className={styles.image} />
      <h3 className={styles.name}>{monster.name}</h3>
      <p className={styles.info}>
        <strong>Type:</strong> {monster.size} {monster.type},{" "}
        {monster.alignment}
      </p>
      <p className={styles.info}>
        <strong>HP:</strong> {monster.hitPoints} | <strong>AC:</strong>{" "}
        {monster.armorClass}
      </p>
      <p className={styles.info}>
        <strong>CR:</strong> {monster.challengeRating}
      </p>
      <div className={styles.cardbuttons}>
        <button class="btn-primary">Edit</button>
        <button class="btn-danger">Delete</button>
      </div>
    </div>
  );
}
