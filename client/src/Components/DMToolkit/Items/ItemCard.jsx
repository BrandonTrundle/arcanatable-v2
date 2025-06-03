import React from "react";
import styles from "../../../styles/DMToolkit/ItemCard.module.css";

export default function ItemCard({ item, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={item.image} alt={item.name} className={styles.image} />
      <h3 className={styles.name}>{item.name}</h3>
      <p className={styles.info}>
        <strong>Type:</strong> {item.type} | <strong>Rarity:</strong>{" "}
        {item.rarity}
      </p>
      <p className={styles.info}>
        {item.isMagical ? "Magical" : "Non-Magical"}
        {item.attunementRequired && " | Requires Attunement"}
      </p>
      <p className={styles.description}>{item.description.slice(0, 100)}...</p>
      <div className={styles.cardbuttons}>
        <button className="btn-primary">Edit</button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
