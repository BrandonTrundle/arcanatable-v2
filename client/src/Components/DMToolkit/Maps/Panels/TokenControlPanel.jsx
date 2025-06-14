import React, { useState, useRef, useEffect } from "react";
import styles from "../../../../styles/DMToolkit/TokenControlPanel.module.css";

export default function TokenControlPanel({ token, onUpdateToken }) {
  const panelRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({});
  const initialHp =
    typeof token.hp === "object" ? token.hp.current : token.hp || 0;
  const maxHp = typeof token.hp === "object" ? token.hp.max : token.maxHp || 0;
  const [hp, setHp] = useState(initialHp);

  useEffect(() => {
    setHp(typeof token.hp === "object" ? token.hp.current : token.hp || 0);
  }, [token]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: offset.current.panelX + (e.clientX - offset.current.startX),
        y: offset.current.panelY + (e.clientY - offset.current.startY),
      });
    };
    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  if (!token) return null;

  const handleHpChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setHp(value);
    onUpdateToken?.({ ...token, maxHp: value });
  };

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={(e) => {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
          offset.current = {
            startX: e.clientX,
            startY: e.clientY,
            panelX: position.x,
            panelY: position.y,
          };
          setDragging(true);
        }
      }}
    >
      <button
        className={styles.toggleButton}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        {isCollapsed ? "▸" : "▾"}
      </button>

      {!isCollapsed && (
        <div>
          <h2 className={styles.tokenName}>{token.name}</h2>

          <div className={styles.hpControl}>
            <label className={styles.hpLabel} htmlFor="hp">
              HP:
            </label>
            <input
              id="hp"
              className={styles.hpInput}
              type="number"
              value={hp}
              min={0}
              max={maxHp}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setHp(value);
                onUpdateToken?.({
                  ...token,
                  hp: { ...token.hp, current: value },
                });
              }}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label} htmlFor="size">
              Size:
            </label>
            <select
              id="size"
              className={styles.select}
              value={
                JSON.stringify(token.size) ||
                JSON.stringify({ width: 1, height: 1 }) // fallback
              }
              onChange={(e) => {
                const { width, height } = JSON.parse(e.target.value);
                onUpdateToken?.({
                  ...token,
                  size: { width, height },
                });
              }}
            >
              <option value={JSON.stringify({ width: 0.5, height: 0.5 })}>
                Tiny (0.5x0.5)
              </option>
              <option value={JSON.stringify({ width: 1, height: 1 })}>
                Small / Medium (1x1)
              </option>
              <option value={JSON.stringify({ width: 2, height: 2 })}>
                Large (2x2)
              </option>
              <option value={JSON.stringify({ width: 3, height: 3 })}>
                Huge (3x3)
              </option>
              <option value={JSON.stringify({ width: 4, height: 4 })}>
                Gargantuan (4x4)
              </option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label} htmlFor="layer">
              Layer:
            </label>
            <select
              id="layer"
              className={styles.select}
              value={token._layer || "player"}
              onChange={(e) => {
                onUpdateToken?.({
                  ...token,
                  _targetLayer: e.target.value,
                  _moveToLayer: true,
                });
              }}
            >
              <option value="player">Player</option>
              <option value="dm">DM</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <button
              className={styles.deleteButton}
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete "${token.name}"?`
                  )
                ) {
                  onUpdateToken?.({
                    ...token,
                    _delete: true,
                  });
                }
              }}
            >
              🗑 Delete Token
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
