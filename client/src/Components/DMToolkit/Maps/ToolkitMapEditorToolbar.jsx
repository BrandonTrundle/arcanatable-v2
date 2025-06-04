import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/DMToolkit/ToolkitMapEditorToolbar.module.css";

export default function ToolkitMapEditorToolbar({
  gridVisible,
  setGridVisible,
  onSizeClick,
}) {
  const navigate = useNavigate();
  const [showGridMenu, setShowGridMenu] = useState(false);

  const toggleGridMenu = () => setShowGridMenu((prev) => !prev);

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

      <button onClick={onSizeClick} className={styles.toolButton}>
        Size
      </button>

      <button className={styles.toolButton}>Select</button>
      <button className={styles.toolButton}>Token</button>
      <button className={styles.toolButton}>Fog</button>
      <button className={styles.toolButton}>Notes</button>
      <button className={styles.toolButton}>Save</button>
    </div>
  );
}
