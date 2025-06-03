import React from "react";
import styles from "../../../styles/DMToolkit/PotionCard.module.css";

export default function PotionCard({ potion, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={potion.image} alt={potion.name} className={styles.image} />
      <h3 className={styles.name}>{potion.name}</h3>
      <p className={styles.info}>
        <strong>Rarity:</strong> {potion.rarity}
      </p>
      <p className={styles.info}>
        <strong>Effect:</strong> {potion.effect}
      </p>
      <p className={styles.info}>
        <strong>Cost:</strong> {potion.cost}
      </p>
      <div className={styles.cardbuttons}>
        <button className="btn-primary">Edit</button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
