import React from "react";
import styles from "../../../styles/DMToolkit/TokenCard.module.css";

export default function TokenCard({ token, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={token.image} alt={token.name} className={styles.image} />
      <h3 className={styles.name}>{token.displayName}</h3>
      <p className={styles.info}>
        <strong>Size:</strong> {token.size.width} × {token.size.height}
      </p>
      <p className={styles.info}>
        <strong>HP:</strong> {token.hp}/{token.maxHp}
      </p>
    </div>
  );
}
