import React from "react";
import styles from "../../styles/TokenSettingsPanel.module.css";

export default function TokenSettingsPanel({
  token,
  onClose,
  isDM = false,
  onChangeLayer = () => {},
}) {
  const availableLayers = ["dm", "player", "hidden"];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>⚙️ Token Settings</span>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
      </div>
      <div className={styles.body}>
        <p>
          <strong>Name:</strong> {token.name || "Unnamed Token"}
        </p>

        {isDM && (
          <div className={styles.settingGroup}>
            <label>Layer:</label>
            <select
              value={token._layer}
              onChange={(e) => onChangeLayer(token, e.target.value)}
            >
              {availableLayers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
