import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ToolkitMapEditorToolbar from "../../../Components/DMToolkit/Maps/ToolkitMapEditorToolbar";
import MapCanvas from "../../../Components/DMToolkit/Maps/MapCanvas";
import MapSizePanel from "../../../Components/DMToolkit/Maps/Panels/MapSizePanel";
import TokenPanel from "../../../Components/DMToolkit/Maps/Panels/TokenPanel";
import styles from "../../../styles/DMToolkit/ToolkitMapEditor.module.css";
import { createTokenOnDrop } from "../../../utils/token/tokenCreation";
import MapTokenDragGhost from "../../../Components/Shared/Tokens/MapTokenDragGhost";

export default function ToolkitMapEditor() {
  const { state } = useLocation();
  const map = state?.map;
  const [mapData, setMapData] = useState(map); // editable map state
  const [gridVisible, setGridVisible] = useState(true);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [draggingToken, setDraggingToken] = useState(null); // token object
  const [draggingPosition, setDraggingPosition] = useState({ x: 0, y: 0 }); // screen coords
  const [activeLayer, setActiveLayer] = useState("player"); // "player" | "dm" | "hidden"

  const handleSizeUpdate = (newSize) => {
    setMapData((prev) => ({
      ...prev,
      ...newSize,
    }));
  };

  const handleCanvasDrop = (pointer) => {
    if (!draggingToken) return;

    const newToken = createTokenOnDrop({
      baseToken: draggingToken,
      pointer,
      gridSize: mapData.gridSize,
      activeLayer,
    });

    setMapData((prev) => {
      const updatedTokens = [...prev.layers[activeLayer].tokens, newToken];

      return {
        ...prev,
        layers: {
          ...prev.layers,
          [activeLayer]: {
            ...prev.layers[activeLayer],
            tokens: updatedTokens,
          },
        },
      };
    });

    setDraggingToken(null);
  };

  return (
    <div className={styles.editorWrapper}>
      <ToolkitMapEditorToolbar
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        onSizeClick={() => setShowSizePanel(true)}
        onTokenClick={() => setShowTokenPanel(true)}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />

      {showSizePanel && (
        <MapSizePanel
          map={mapData}
          onUpdateSize={handleSizeUpdate}
          onClose={() => setShowSizePanel(false)}
        />
      )}

      {showTokenPanel && (
        <TokenPanel
          onClose={() => setShowTokenPanel(false)}
          onStartDrag={(token) => setDraggingToken(token)}
          onDragMove={(pos) => setDraggingPosition(pos)}
          onEndDrag={() => setDraggingToken(null)}
        />
      )}

      <div className={styles.canvasArea}>
        {mapData ? (
          <>
            <h2 className={styles.mapTitle}>{mapData.name}</h2>
            <MapCanvas
              map={mapData}
              gridVisible={gridVisible}
              onCanvasDrop={handleCanvasDrop}
              setMapData={setMapData}
            />
          </>
        ) : (
          <p>No map loaded.</p>
        )}
      </div>
      {draggingToken && (
        <MapTokenDragGhost token={draggingToken} position={draggingPosition} />
      )}
    </div>
  );
}
