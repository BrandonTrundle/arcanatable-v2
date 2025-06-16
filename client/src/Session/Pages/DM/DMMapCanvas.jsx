// client/src/Session/Pages/DM/DMMapCanvas.jsx
import React from "react";
import styles from "../../styles/MapCanvas.module.css";

const DMMapCanvas = ({ map }) => {
  return (
    <div className={styles.mapCanvas}>
      {map ? (
        <p>Map Loaded: {map.name}</p>
      ) : (
        <p>No map loaded. Please select a map.</p>
      )}
    </div>
  );
};

export default DMMapCanvas;
