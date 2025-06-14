import React, { useState } from "react";
import styles from "../../../../styles/DMToolkit/TokenPanel.module.css"; // reuse styles
import MapAssetCard from "../../MapAssets/MapAssetCard";
import { useContext } from "react";
import fetchMapAssets from "../../../../hooks/dmtoolkit/fetchMapAssets";
import { AuthContext } from "../../../../context/AuthContext";

export default function AssetPanel({
  onClose,
  onStartDrag,
  onDragMove,
  onEndDrag,
}) {
  const [searchTerm, setSearchTerm] = useState("");
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

  const { user } = useContext(AuthContext);
  const { mapAssets, loading, error } = fetchMapAssets(user);

  const filteredAssets = mapAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.panel}>Loading assets...</div>;
  if (error) return <div className={styles.panel}>Failed to load assets.</div>;

  return (
    <div
      className={styles.panel}
      style={{ top: dragOffset.y, left: dragOffset.x }}
    >
      <div className={styles.header} onMouseDown={handleDragStart}>
        <span>Map Assets</span>
        <button onClick={onClose} className={styles.closeBtn}>
          ✕
        </button>
      </div>

      <input
        type="text"
        className={styles.search}
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.tokenGrid}>
        {filteredAssets.map((asset) => (
          <div
            key={asset.name}
            className={styles.tokenDraggable}
            onMouseDown={(e) => {
              e.preventDefault();
              onStartDrag(asset);

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
            <MapAssetCard asset={asset} onClick={() => {}} readonly />
          </div>
        ))}
      </div>
    </div>
  );
}
