import React, { useState, useRef } from "react";
import styles from "../../styles/SettingsPanel.module.css";
import { getNextZIndex } from "../../utils/zIndexManager";

export default function SettingsPanel({
  gridVisible,
  setGridVisible,
  gridColor,
  setGridColor,
  onClose,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 200, y: 200 });
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

  return (
    <div
      className={styles.panel}
      style={{ left: position.x, top: position.y, zIndex }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span>Settings</span>
        <div className={styles.controls}>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "+" : "-"}
          </button>
          <button onClick={onClose}>x</button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
            />
            Show Grid
          </label>
          <label className={styles.label}>
            Grid Color:
            <input
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
