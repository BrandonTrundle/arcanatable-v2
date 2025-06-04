import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ToolkitMapEditorToolbar from "../../../Components/DMToolkit/Maps/ToolkitMapEditorToolbar";
import MapCanvas from "../../../Components/DMToolkit/Maps/MapCanvas";
import MapSizePanel from "../../../Components/DMToolkit/Maps/Panels/MapSizePanel";
import styles from "../../../styles/DMToolkit/ToolkitMapEditor.module.css";

export default function ToolkitMapEditor() {
  const { state } = useLocation();
  const map = state?.map;

  const [mapData, setMapData] = useState(map); // editable map state
  const [gridVisible, setGridVisible] = useState(true);
  const [showSizePanel, setShowSizePanel] = useState(false);

  const handleSizeUpdate = (newSize) => {
    setMapData((prev) => ({
      ...prev,
      ...newSize,
    }));
  };

  return (
    <div className={styles.editorWrapper}>
      <ToolkitMapEditorToolbar
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        onSizeClick={() => setShowSizePanel(true)}
      />

      {showSizePanel && (
        <MapSizePanel
          map={mapData}
          onUpdateSize={handleSizeUpdate}
          onClose={() => setShowSizePanel(false)}
        />
      )}

      <div className={styles.canvasArea}>
        {mapData ? (
          <>
            <h2 className={styles.mapTitle}>{mapData.name}</h2>
            <MapCanvas map={mapData} gridVisible={gridVisible} />
          </>
        ) : (
          <p>No map loaded.</p>
        )}
      </div>
    </div>
  );
}
