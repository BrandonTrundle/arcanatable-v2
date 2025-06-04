import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ToolkitMapEditorToolbar from "../../../Components/DMToolkit/Maps/ToolkitMapEditorToolbar";
import MapCanvas from "../../../Components/DMToolkit/Maps/MapCanvas";
import MapSizePanel from "../../../Components/DMToolkit/Maps/Panels/MapSizePanel";
import TokenPanel from "../../../Components/DMToolkit/Maps/Panels/TokenPanel";
import styles from "../../../styles/DMToolkit/ToolkitMapEditor.module.css";

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

    const baseToken = draggingToken;

    console.log("📦 Dragging Base Token:", baseToken);
    console.log("📍 Drop Position (pixels):", pointer);

    const gridX = Math.floor(pointer.x / mapData.gridSize);
    const gridY = Math.floor(pointer.y / mapData.gridSize);

    const newToken = {
      ...baseToken,
      id: `token-${Date.now()}`,
      position: {
        x: gridX,
        y: gridY,
      },
      hp: baseToken.hp,
      maxHp: baseToken.maxHp,
      statusConditions: [],
      effects: [],
      initiative: 0,
      notes: "",
      activeToken: false,
      rotation: 0,
      isVisible: activeLayer === "player",
    };

    console.log("🧠 New Token to Add:", newToken);

    setMapData((prev) => {
      const updatedTokens = [...prev.layers[activeLayer].tokens, newToken];

      console.log(
        `📋 Updated Token List for "${activeLayer}" layer:`,
        updatedTokens
      );

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
        <img
          src={draggingToken.image}
          alt={draggingToken.name}
          style={{
            position: "fixed",
            top: draggingPosition.y + 10,
            left: draggingPosition.x + 10,
            pointerEvents: "none",
            width: 48,
            height: 48,
            opacity: 0.75,
            zIndex: 10000,
          }}
        />
      )}
    </div>
  );
}
