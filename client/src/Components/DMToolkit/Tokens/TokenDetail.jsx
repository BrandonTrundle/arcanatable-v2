import React from "react";
import styles from "../../../styles/DMToolkit/TokenDetail.module.css";

export default function TokenDetail({ token, onClose, onDelete }) {
  if (!token) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        {token.type === "custom" && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete?.(token.id)}
          >
            🗑️ Delete
          </button>
        )}

        <h1 className={styles.title}>{token.name}</h1>
        <img src={token.image} alt={token.name} className={styles.image} />

        <div className={styles.details}>
          <p>
            <strong>Size:</strong> {token.size.width} × {token.size.height}
          </p>
          <p>
            <strong>HP:</strong> {token.maxHp}
          </p>
          <p>
            <strong>Initiative:</strong> {token.initiative}
          </p>
          <p>
            <strong>Rotation:</strong> {token.rotation}°
          </p>
          <p>
            <strong>Visible:</strong> {token.isVisible ? "Yes" : "No"}
          </p>
          <p>
            <strong>Light Radius:</strong> {token.lightEmit?.radius ?? "—"}
          </p>
        </div>

        {token.statusConditions?.length > 0 && (
          <div className={styles.section}>
            <strong>Status Conditions:</strong>
            <ul>
              {token.statusConditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
        )}

        {token.effects?.length > 0 && (
          <div className={styles.section}>
            <strong>Effects:</strong>
            <ul>
              {token.effects.map((eff, i) => (
                <li key={i}>
                  <img
                    src={eff.icon}
                    alt={eff.name}
                    className={styles.effectIcon}
                  />
                  {eff.name} ({eff.duration} rounds)
                </li>
              ))}
            </ul>
          </div>
        )}

        {token.notes && (
          <div className={styles.section}>
            <strong>Notes:</strong>
            <p>{token.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
