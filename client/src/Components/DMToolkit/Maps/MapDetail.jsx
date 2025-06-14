import React from "react";
import styles from "../../../styles/DMToolkit/MapDetail.module.css";

export default function MapDetail({ map, onClose }) {
  if (!map) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h1 className={styles.title}>{map.name}</h1>
        <img src={map.image} alt={map.name} className={styles.image} />

        <div className={styles.details}>
          <p>
            <strong>Dimensions:</strong> {map.width} × {map.height} tiles
          </p>
          <p>
            <strong>Grid:</strong> {map.gridSize}px {map.gridType}
          </p>
          <p>
            <strong>Fog of War:</strong>{" "}
            {map.fogOfWarEnabled ? "Enabled" : "Disabled"}
          </p>
          <p>
            <strong>Snap to Grid:</strong> {map.snapToGrid ? "Yes" : "No"}
          </p>
          <p>
            <strong>Campaign:</strong> {map.campaignId || "—"}
          </p>
        </div>

        {Array.isArray(map.notes) && map.notes.length > 0 && (
          <div className={styles.notes}>
            <strong>Notes:</strong>
            <ul>
              {map.notes.map((note) => (
                <li key={note.id}>
                  <strong>{note.name}:</strong> {note.body}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
