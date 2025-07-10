import React, { useState, useRef } from "react";
import styles from "../../styles/NowPlayingPanel.module.css";
import { getNextZIndex } from "../../utils/zIndexManager";

export default function NowPlayingPanel({
  currentTrack,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  onToggleLoop,
  loop,
  volume,
  onVolumeChange,
  onClose,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(getNextZIndex());

  if (!currentTrack) return null;

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
        <span>Now Playing</span>
        <div className={styles.controls}>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "+" : "-"}
          </button>
          <button onClick={onClose}>x</button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          <div className={styles.trackName}>{currentTrack.name}</div>

          <div className={styles.playerControls}>
            <button onClick={onSkipPrev}>⏮</button>
            <button onClick={onPlayPause}>{isPlaying ? "⏸" : "▶️"}</button>
            <button onClick={onSkipNext}>⏭</button>
            <button
              onClick={onToggleLoop}
              className={loop ? styles.loopActive : ""}
            >
              🔁
            </button>
          </div>

          <div className={styles.volumeControl}>
            <label>Volume:</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
