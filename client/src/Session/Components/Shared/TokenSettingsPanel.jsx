import React from "react";
import styles from "../../styles/TokenSettingsPanel.module.css";

export default function TokenSettingsPanel({
  token,
  onClose,
  isDM = false,
  currentUserId,
  allPlayers = [],
  onChangeShowNameplate = () => {},
  onChangeLayer = () => {},
  onChangeOwner = () => {},
  onDeleteToken = () => {},
}) {
  //  console.log("Token in panel:", token);
  const availableLayers = ["dm", "player", "hidden"];
  const safeOwnerIds = Array.isArray(token.ownerIds) ? token.ownerIds : [];

  if (token.ownerId && !safeOwnerIds.includes(token.ownerId)) {
    safeOwnerIds.push(token.ownerId);
  }

  //  console.log("TokenSettingsPanel - token.ownerIds:", token.ownerIds);
  //  console.log("TokenSettingsPanel - currentUserId:", currentUserId);
  //  console.log("TokenSettingsPanel - isDM:", isDM);
  //  console.log(
  //    "Show Ownership UI?",
  //    isDM || safeOwnerIds.includes(currentUserId)
  //  );

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

        {(isDM || safeOwnerIds.includes(currentUserId)) && (
          <div className={styles.settingGroup}>
            <label className={styles.sectionTitle}>Controlled By:</label>
            <select
              value=""
              onChange={(e) => {
                const selectedId = e.target.value;
                if (!selectedId) return;

                const newOwnerIds = [...safeOwnerIds];
                if (!newOwnerIds.includes(selectedId)) {
                  newOwnerIds.push(selectedId);
                  onChangeOwner(token, newOwnerIds);
                }
              }}
            >
              <option value="">Add owner...</option>
              {allPlayers
                .filter((p) => !safeOwnerIds.includes(p._id))
                .map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.username}
                  </option>
                ))}
            </select>

            <ul className={styles.ownerList}>
              {safeOwnerIds.map((id) => {
                const player = allPlayers.find((p) => p._id === id);
                if (!player) return null;
                return (
                  <li key={id} className={styles.ownerItem}>
                    {player.username}
                    <button
                      onClick={() => {
                        const updated = safeOwnerIds.filter(
                          (oid) => oid !== id
                        );
                        onChangeOwner(token, updated);
                      }}
                      className={styles.removeOwnerButton}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {(isDM || safeOwnerIds.includes(currentUserId)) && (
          <div className={styles.settingGroup}>
            <button
              onClick={() => onDeleteToken(token)}
              className={styles.deleteButton}
            >
              Delete Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
