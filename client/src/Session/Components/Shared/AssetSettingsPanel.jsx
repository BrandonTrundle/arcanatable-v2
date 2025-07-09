import React from "react";
import styles from "../../styles/TokenSettingsPanel.module.css"; // reuse styling

export default function AssetSettingsPanel({
  asset,
  onClose,
  isDM = false,
  onChangeLayer = () => {},
  onDeleteAsset = () => {},
}) {
  const availableLayers = ["dm", "player", "hidden"];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>⚙️ Asset Settings</span>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
      </div>

      <div className={styles.body}>
        <div>
          <span className={styles.labelInline}>Name:</span>{" "}
          <span>{asset.name || "Unnamed Asset"}</span>
        </div>

        {isDM && (
          <div className={styles.settingGroup}>
            <label className={styles.sectionTitle}>Layer</label>
            <select
              value={asset._layer}
              onChange={(e) => onChangeLayer(asset, e.target.value)}
            >
              {availableLayers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {isDM && (
          <div className={styles.settingGroup}>
            <button
              onClick={() => onDeleteAsset(asset)}
              className={styles.deleteButton}
            >
              Delete Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
