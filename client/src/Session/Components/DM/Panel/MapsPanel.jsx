import { useRef, useEffect } from "react";
import styles from "../../../styles/MapsPanel.module.css";
import mapIcon from "../../../../assets/icons/mapIcon.png";

export default function MapsPanel({
  maps,
  selectedMapId,
  setSelectedMapId,
  onLoadMap,
}) {
  const panelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    const panel = panelRef.current;
    pos.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop,
    };
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };

  const drag = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - pos.current.x}px`;
    panel.style.top = `${e.clientY - pos.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div className={styles.panel} ref={panelRef} style={{ top: 80, left: 80 }}>
      <div className={styles.header} onMouseDown={startDrag}>
        <img src={mapIcon} alt="Maps" className={styles.icon} />
        <span>Maps</span>
        <button onClick={() => setSelectedMapId("")}>×</button>
      </div>
      <div className={styles.content}>
        <select
          value={selectedMapId}
          onChange={(e) => setSelectedMapId(e.target.value)}
        >
          <option value="">Select a map</option>
          {maps.map((map) => (
            <option key={map._id} value={map._id}>
              {map.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const selectedMap = maps.find((m) => m._id === selectedMapId);
            if (selectedMap) {
              console.log("MAPS PANEL: CLICKED LOAD:", selectedMap);
              onLoadMap(selectedMap);
            }
          }}
        >
          Load Map
        </button>
        <button className={styles.createButton}>Create New Map</button>
      </div>
    </div>
  );
}
