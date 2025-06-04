import React, { useState } from "react";
import styles from "../../../../styles/DMToolkit/MapSizePanel.module.css";

export default function MapSizePanel({ map, onUpdateSize, onClose }) {
  const [width, setWidth] = useState(map.width);
  const [height, setHeight] = useState(map.height);

  const handleApply = () => {
    onUpdateSize({ width, height });
    onClose();
  };

  return (
    <div className={styles.panel}>
      <h3>Adjust Map Size</h3>

      <label>
        Width (squares):
        <input
          type="number"
          min="1"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>

      <label>
        Height (squares):
        <input
          type="number"
          min="1"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </label>

      <div className={styles.buttons}>
        <button onClick={handleApply}>Apply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
