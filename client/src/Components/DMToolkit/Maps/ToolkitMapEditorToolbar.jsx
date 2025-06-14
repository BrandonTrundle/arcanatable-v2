import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/DMToolkit/ToolkitMapEditorToolbar.module.css";

export default function ToolkitMapEditorToolbar({
  gridVisible,
  setGridVisible,
  onSizeClick,
  onTokenClick,
  activeLayer,
  setActiveLayer,
  fogVisible,
  setFogVisible,
  toolMode,
  setToolMode,
  onAssetClick,
  onSave,
}) {
  const navigate = useNavigate();
  const [showGridMenu, setShowGridMenu] = useState(false);
  const toggleGridMenu = () => setShowGridMenu((prev) => !prev);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showFogMenu, setShowFogMenu] = useState(false);

  const toggleLayerMenu = () => setShowLayerMenu((prev) => !prev);

  const toggleGridVisibility = () => {
    setGridVisible((prev) => !prev);
    setShowGridMenu(false);
  };

  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => navigate("/dmtoolkit/maps")}
        className={styles.toolButton}
      >
        ← Back
      </button>

      <div className={styles.dropdownWrapper}>
        <button onClick={toggleGridMenu} className={styles.toolButton}>
          Grid ▾
        </button>

        {showGridMenu && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={toggleGridVisibility}
            >
              {gridVisible ? "Hide Grid" : "Show Grid"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.dropdownWrapper}>
        <button onClick={toggleLayerMenu} className={styles.toolButton}>
          Layer ▾
        </button>

        {showLayerMenu && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setActiveLayer("player");
                setShowLayerMenu(false);
              }}
            >
              Player {activeLayer === "player" && "✓"}
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setActiveLayer("dm");
                setShowLayerMenu(false);
              }}
            >
              DM {activeLayer === "dm" && "✓"}
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setActiveLayer("hidden");
                setShowLayerMenu(false);
              }}
            >
              Hidden {activeLayer === "hidden" && "✓"}
            </button>
          </div>
        )}
      </div>

      <button onClick={onSizeClick} className={styles.toolButton}>
        Size
      </button>

      <button className={styles.toolButton}>Select</button>
      <button onClick={onTokenClick} className={styles.toolButton}>
        Token
      </button>
      <button onClick={onAssetClick} className={styles.toolButton}>
        Assets
      </button>
      <div className={styles.dropdownWrapper}>
        <button
          onClick={() => setShowFogMenu((prev) => !prev)}
          className={styles.toolButton}
        >
          Fog ▾
        </button>

        {showFogMenu && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setFogVisible((prev) => !prev);
                setShowFogMenu(false);
              }}
            >
              {fogVisible ? "Hide Fog" : "Show Fog"}
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                setToolMode((prev) =>
                  prev === "paint-blockers" ? "select" : "paint-blockers"
                );
                setShowFogMenu(false);
              }}
            >
              {toolMode === "paint-blockers" ? "✓ " : ""}Paint Blockers
            </button>
          </div>
        )}
      </div>

      <button
        className={styles.toolButton}
        onClick={() =>
          setToolMode((prev) => (prev === "notes" ? "select" : "notes"))
        }
      >
        {toolMode === "notes" ? "✓ " : ""}Notes
      </button>

      <button className={styles.toolButton} onClick={onSave}>
        Save
      </button>
    </div>
  );
}
