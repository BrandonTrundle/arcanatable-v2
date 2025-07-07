import React, { useState, useRef } from "react";
import styles from "../../styles/MeasurementPanel.module.css";
import { getNextZIndex } from "../../utils/zIndexManager";

export default function MeasurementPanel({
  broadcastEnabled,
  setBroadcastEnabled,
  measurementColor,
  setMeasurementColor,
  snapSetting,
  setSnapSetting,
  lockMeasurement,
  setLockMeasurement,
  lockedMeasurements,
  setLockedMeasurements,
  isDM,
  mapId,
  userId,
  socket,
  onClose,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(getNextZIndex());

  const handleMouseDown = (e) => {
    setZIndex(getNextZIndex());
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const clearMyMeasurements = () => {
    socket.emit("measurement:clearLocked", { mapId, userId });
    setLockedMeasurements((prev) => prev.filter((m) => m.userId !== userId));
  };

  const clearAllMeasurements = () => {
    socket.emit("measurement:clearAll", { mapId });
  };

  return (
    <div
      className={styles.panel}
      style={{ left: position.x, top: position.y, zIndex }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span>Measurement Tool</span>
        <div className={styles.controls}>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "+" : "-"}
          </button>
          <button onClick={onClose}>x</button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          {lockedMeasurements.length > 0 && (
            <button className={styles.button} onClick={clearMyMeasurements}>
              Clear My Measurements
            </button>
          )}

          {isDM && (
            <button
              className={`${styles.button} ${styles.clearAll}`}
              onClick={clearAllMeasurements}
            >
              Clear All Measurements
            </button>
          )}

          <label className={styles.label}>
            <input
              type="checkbox"
              checked={broadcastEnabled}
              onChange={(e) => setBroadcastEnabled(e.target.checked)}
            />
            Broadcast to Room
          </label>

          <label className={styles.label}>
            Color:
            <input
              type="color"
              value={measurementColor}
              onChange={(e) => setMeasurementColor(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Snap:
            <select
              value={snapSetting}
              onChange={(e) => setSnapSetting(e.target.value)}
            >
              <option value="center">Center</option>
              <option value="corner">Corner</option>
              <option value="none">None</option>
            </select>
          </label>

          <label className={styles.label}>
            <input
              type="checkbox"
              checked={lockMeasurement}
              onChange={(e) => setLockMeasurement(e.target.checked)}
            />
            Lock Measurement
          </label>
        </div>
      )}
    </div>
  );
}
