import React from "react";
import styles from "../../../styles/DMToolkit/ItemDetail.module.css";
import parchment from "../../../assets/ParchmentPaper.png";

export default function ItemDetail({ item, onClose }) {
  if (!item) return null;

  const renderEffect = (effect, i) => (
    <div key={i} className={styles.entryBlock}>
      <h3>{effect.name}</h3>
      <p>{effect.desc}</p>
    </div>
  );

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
            <h1>{item.name}</h1>
            <p>
              <em>
                {item.type} — {item.rarity}
              </em>
            </p>
          </div>

          <div className={styles.statBlock}>
            <p>
              <strong>Magical:</strong> {item.isMagical ? "Yes" : "No"}
            </p>
            <p>
              <strong>Attunement:</strong>{" "}
              {item.attunementRequired ? "Required" : "None"}
            </p>
            <p>
              <strong>Damage:</strong> {item.damage || "—"}
            </p>
            <p>
              <strong>Properties:</strong> {item.properties || "—"}
            </p>
            <p>
              <strong>Charges:</strong> {item.charges}
            </p>
            <p>
              <strong>Weight:</strong> {item.weight || "—"}
            </p>
            <p>
              <strong>Value:</strong> {item.value || "—"}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{item.description}</p>
          </div>

          {item.effects.length > 0 && (
            <div className={styles.section}>
              <h2>Effects</h2>
              {item.effects.map(renderEffect)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
