import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ToolkitMapEditorToolbar from "../../../Components/DMToolkit/Maps/ToolkitMapEditorToolbar";
import MapCanvas from "../../../Components/DMToolkit/Maps/MapCanvas";
import MapSizePanel from "../../../Components/DMToolkit/Maps/Panels/MapSizePanel";
import TokenPanel from "../../../Components/DMToolkit/Maps/Panels/TokenPanel";
import styles from "../../../styles/DMToolkit/ToolkitMapEditor.module.css";
import { createTokenOnDrop } from "../../../utils/token/tokenCreation";
import { getCellFromPointer } from "../../../utils/grid/coordinates";
import MapTokenDragGhost from "../../../Components/Shared/Tokens/MapTokenDragGhost";
import NotesPanel from "../../../Components/DMToolkit/Maps/Panels/NotesPanel";
import AssetPanel from "../../../Components/DMToolkit/Maps/Panels/AssetPanel";

export default function ToolkitMapEditor() {
  const { state } = useLocation();
  const map = state?.map;
  const [activeNoteCell, setActiveNoteCell] = useState(null);
  const [selectedNoteCell, setSelectedNoteCell] = useState(null);
  const [showAssetPanel, setShowAssetPanel] = useState(false);
  const [draggingAsset, setDraggingAsset] = useState(null);

  const [mapData, setMapData] = useState(() => ({
    ...map,
    fogOfWar: map.fogOfWar || { revealedCells: [] },
    notes: [
      {
        id: "note-001",
        name: "Hidden Trap",
        body: "A pressure plate activates a dart trap from the far wall.",
        cell: { x: 3, y: 5 },
      },
      {
        id: "note-002",
        name: "Secret Door",
        body: "The mossy wall at this spot hides a hinged secret passage.",
        cell: { x: 7, y: 2 },
      },
      {
        id: "note-003",
        name: "Treasure Cache",
        body: "Behind loose stones is a pouch with 75gp and a potion of climbing.",
        cell: { x: 11, y: 6 },
      },
    ],
  }));

  const [gridVisible, setGridVisible] = useState(true);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [draggingToken, setDraggingToken] = useState(null); // token object
  const draggingPositionRef = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0); // dummy state to force render
  const [activeLayer, setActiveLayer] = useState("player"); // "player" | "dm" | "hidden"
  const [fogVisible, setFogVisible] = useState(true);
  const [toolMode, setToolMode] = useState("select");

  useEffect(() => {
    if (toolMode !== "notes") setSelectedNoteCell(null);
  }, [toolMode]);

  const handleSizeUpdate = (newSize) => {
    setMapData((prev) => ({
      ...prev,
      ...newSize,
    }));
  };

  const handleCanvasDrop = (pointer) => {
    if (draggingToken) {
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
      return;
    }

    if (draggingAsset) {
      const cell = getCellFromPointer(pointer, mapData.gridSize);
      const newAsset = {
        id: `asset-${Date.now()}`,
        image: draggingAsset.image,
        name: draggingAsset.name,
        position: cell,
        size: {
          width: parseInt(draggingAsset.width, 10),
          height: parseInt(draggingAsset.height, 10),
        },
        rotation: 0,
      };

      setMapData((prev) => {
        const updatedAssets = [...prev.layers[activeLayer].assets, newAsset];
        return {
          ...prev,
          layers: {
            ...prev.layers,
            [activeLayer]: {
              ...prev.layers[activeLayer],
              assets: updatedAssets,
            },
          },
        };
      });

      setDraggingAsset(null);
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <ToolkitMapEditorToolbar
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        onSizeClick={() => setShowSizePanel(true)}
        onTokenClick={() => setShowTokenPanel(true)}
        onAssetClick={() => setShowAssetPanel(true)}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        fogVisible={fogVisible}
        setFogVisible={setFogVisible}
        toolMode={toolMode}
        setToolMode={setToolMode}
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
          onDragMove={(pos) => {
            draggingPositionRef.current = pos;
            requestAnimationFrame(() => forceUpdate((n) => n + 1));
          }}
          onEndDrag={() => setDraggingToken(null)}
        />
      )}

      {showAssetPanel && (
        <AssetPanel
          onClose={() => setShowAssetPanel(false)}
          onStartDrag={(asset) => setDraggingAsset(asset)}
          onDragMove={(pos) => {
            draggingPositionRef.current = pos;
            requestAnimationFrame(() => forceUpdate((n) => n + 1));
          }}
          onEndDrag={() => setDraggingAsset(null)}
        />
      )}

      {toolMode === "notes" && (
        <NotesPanel
          notes={mapData.notes}
          activeNoteCell={activeNoteCell}
          onClose={() => setToolMode("select")}
          onUpdateNotes={(updatedNotes) => {
            //      console.log("📋 Notes updated in editor:", updatedNotes);
            setMapData((prev) => ({ ...prev, notes: updatedNotes }));
            setActiveNoteCell(null);
          }}
          onSelectNote={(note) => {
            if (note.cell) {
              //S       console.log("🟥 Selected note from list:", note);
              setSelectedNoteCell(note.cell);
            }
          }}
        />
      )}

      <div className={styles.canvasArea}>
        {mapData ? (
          <>
            <h2 className={styles.mapTitle}>{mapData.name}</h2>
            <MapCanvas
              map={mapData}
              notes={mapData.notes}
              gridVisible={gridVisible}
              onCanvasDrop={handleCanvasDrop}
              setMapData={setMapData}
              activeLayer={activeLayer}
              fogVisible={fogVisible}
              toolMode={toolMode}
              setActiveNoteCell={setActiveNoteCell}
              activeNoteCell={activeNoteCell}
              selectedNoteCell={selectedNoteCell}
            />
          </>
        ) : (
          <p>No map loaded.</p>
        )}
      </div>
      {draggingToken && (
        <MapTokenDragGhost
          token={draggingToken}
          positionRef={draggingPositionRef}
        />
      )}
    </div>
  );
}
