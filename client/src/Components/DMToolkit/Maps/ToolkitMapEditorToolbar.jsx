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
}) {
  const navigate = useNavigate();
  const [showGridMenu, setShowGridMenu] = useState(false);
  const toggleGridMenu = () => setShowGridMenu((prev) => !prev);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

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
      <button className={styles.toolButton}>Fog</button>
      <button className={styles.toolButton}>Notes</button>
      <button className={styles.toolButton}>Save</button>
    </div>
  );
}
