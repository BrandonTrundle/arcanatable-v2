import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/DMToolkit/MapCard.module.css";

export default function MapCard({ map, onClick }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/dmtoolkit/maps/editor`, {
      state: { map }, // we pass the whole map object here for now
    });
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <img src={map.image} alt={map.name} className={styles.image} />
      <h3 className={styles.name}>{map.name}</h3>
      <p className={styles.info}>
        <strong>Size:</strong> {map.width} × {map.height} tiles
      </p>
      <p className={styles.info}>
        <strong>Grid:</strong> {map.gridSize}px {map.gridType}
      </p>
      <div className={styles.cardbuttons}>
        <button onClick={handleEdit} className="btn-primary">
          Edit
        </button>
        <button className="btn-danger">Delete</button>
      </div>
    </div>
  );
}
