import React, { useState } from "react";
import styles from "../../../../styles/DMToolkit/TokenPanel.module.css";
import TokenCard from "../../Tokens/TokenCard";

export default function TokenPanel({
  availableTokens = [],
  onClose,
  onStartDrag,
  onDragMove,
  onEndDrag,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTokens = availableTokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [dragOffset, setDragOffset] = useState({ x: 100, y: 100 });

  const handleDragStart = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = dragOffset.x;
    const origY = dragOffset.y;

    const onMouseMove = (moveEvent) => {
      setDragOffset({
        x: origX + moveEvent.clientX - startX,
        y: origY + moveEvent.clientY - startY,
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className={styles.panel}
      style={{ top: dragOffset.y, left: dragOffset.x }}
    >
      <div className={styles.header} onMouseDown={handleDragStart}>
        <span>Token Library</span>
        <button onClick={onClose} className={styles.closeBtn}>
          ✕
        </button>
      </div>

      <input
        type="text"
        className={styles.search}
        placeholder="Search tokens..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.tokenGrid}>
        {filteredTokens.map((token) => (
          <div
            key={token.id}
            draggable={false}
            className={styles.tokenDraggable}
            onMouseDown={(e) => {
              e.preventDefault();
              onStartDrag(token);

              const onMouseMove = (moveEvent) => {
                onDragMove({ x: moveEvent.clientX, y: moveEvent.clientY });
              };

              const onMouseUp = () => {
                onEndDrag();
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              };

              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
          >
            <TokenCard token={token} onClick={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}
