import { useState, useRef } from "react";
import styles from "../../../styles/MapsPanel.module.css";
import mapIcon from "../../../../assets/icons/mapIcon.png";
import socket from "../../../../socket";
import { getNextZIndex } from "../../../utils/zIndexManager";

export default function MapsPanel({
  maps,
  selectedMapId,
  setSelectedMapId,
  onLoadMap,
  onClosePanel,
  sessionCode,
}) {
  const panelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zIndex, setZIndex] = useState(getNextZIndex());
  const bringToFront = () => setZIndex(getNextZIndex());

  const startDrag = (e) => {
    bringToFront();
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
    <div
      className={styles.panel}
      ref={panelRef}
      style={{ position: "absolute", top: 80, left: 80, zIndex }}
      onMouseDown={bringToFront}
    >
      <div
        className={styles.header}
        onMouseDown={startDrag}
        onDoubleClick={() => setIsCollapsed((prev) => !prev)}
      >
        <img
          src={mapIcon}
          alt="Maps"
          className={styles.icon}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <span>Maps</span>
        <button onClick={onClosePanel}>×</button>
      </div>

      {!isCollapsed && (
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
                //        console.log("MAPS PANEL: CLICKED LOAD:", selectedMap);
                onLoadMap(selectedMap); // Call prop correctly

                // Emit map to players
                socket.emit("dmLoadMap", {
                  sessionCode,
                  map: selectedMap,
                });

                // NEW: Update session's current map in backend
                fetch(
                  `${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/sessions/${sessionCode}/set-active-map`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ mapId: selectedMap._id }),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    //              console.log("Session updated with new map:", data);
                  })
                  .catch((err) => {
                    console.error("Failed to update session's map:", err);
                  });
              }
            }}
          >
            Load Map
          </button>

          <button className={styles.createButton}>Create New Map</button>
        </div>
      )}
    </div>
  );
}
