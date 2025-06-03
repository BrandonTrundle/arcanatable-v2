import React from "react";
import styles from "../../../styles/DMToolkit/PotionDetail.module.css";
import parchment from "../../../assets/ParchmentPaper.png";

export default function PotionDetail({ potion, onClose }) {
  if (!potion) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${parchment})` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1>{potion.name}</h1>
            <p className={styles.subtitle}>
              {potion.rarity} {potion.type}
            </p>
          </div>

          <div className={styles.statBlock}>
            <p>
              <strong>Effect:</strong> {potion.effect}
            </p>
            <p>
              <strong>Duration:</strong> {potion.duration}
            </p>
            {potion.sideEffects && (
              <p>
                <strong>Side Effects:</strong> {potion.sideEffects}
              </p>
            )}
            <p>
              <strong>Cost:</strong> {potion.cost}
            </p>
            <p>
              <strong>Weight:</strong> {potion.weight}
            </p>
            <p>
              <strong>Uses:</strong> {potion.uses}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{potion.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
