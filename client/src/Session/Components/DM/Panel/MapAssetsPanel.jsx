import React, { useState, useEffect } from "react";
import styles from "../../../styles/MapAssetsPanel.module.css";

export default function MapAssetsPanel({
  assets = [],
  onSearch,
  onSelectAsset,
  onCreateNew,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {}, [searchTerm]);

  useEffect(() => {}, [assets]);

  const filteredAssets = assets.filter((asset) => {
    const match = asset.name.toLowerCase().includes(searchTerm.toLowerCase());

    return match;
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Map Assets</span>
        <div className={styles.controls}>
          <button
            onClick={() => {
              onCreateNew?.();
            }}
          >
            + New
          </button>
          <button
            onClick={() => {
              onClose?.();
            }}
          >
            X
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;

            setSearchTerm(value);
            onSearch?.(value);
          }}
        />

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            borderTop: "1px solid #555",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          {filteredAssets.length === 0 && (
            <div style={{ fontStyle: "italic", color: "#888" }}>
              [DEBUG] No matching assets found.
            </div>
          )}

          {filteredAssets.map((asset) => {
            return (
              <div
                key={asset.id}
                className={styles.assetItem}
                onClick={() => {
                  onSelectAsset?.(asset);
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({
                      type: "mapAsset",
                      asset,
                    })
                  );
                }}
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  className={styles.assetImage}
                  onError={() =>
                    console.warn(
                      `[WARN] Asset image failed to load for asset: ${asset.name}`
                    )
                  }
                />
                <span>{asset.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
