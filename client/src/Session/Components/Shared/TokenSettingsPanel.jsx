import React from "react";
import styles from "../../styles/TokenSettingsPanel.module.css";

export default function TokenSettingsPanel({
  token,
  onClose,
  isDM = false,
  currentUserId,
  onChangeShowNameplate = () => {},
  onChangeLayer = () => {},
}) {
  console.log("Token in panel:", token);
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
        <div>
          <span className={styles.labelInline}>Name:</span>{" "}
          <span>{token.name || "Unnamed Token"}</span>
        </div>

        {isDM && (
          <div className={styles.settingGroup}>
            <label className={styles.sectionTitle}>Layer</label>
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

        <div className={styles.settingGroup}>
          <label className={styles.labelRow}>
            <span className={styles.labelInline}>Show Nameplate:</span>
            <input
              type="checkbox"
              checked={!!token.showNameplate}
              onChange={(e) => {
                e.stopPropagation();
                onChangeShowNameplate(token, e.target.checked);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
