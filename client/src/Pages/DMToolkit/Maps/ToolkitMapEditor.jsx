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
import fetchTokens from "../../../hooks/dmtoolkit/fetchTokens";
import { useOutletContext } from "react-router-dom";
import TokenControlPanel from "../../../Components/DMToolkit/Maps/Panels/TokenControlPanel";

export default function ToolkitMapEditor() {
  const { state } = useLocation();
  const { currentCampaign } = useOutletContext();
  const map = state?.map;

  const [mapData, setMapData] = useState(() => ({
    ...map,
    fogOfWar: map.fogOfWar || { revealedCells: [] },
  }));

  const [activeNoteCell, setActiveNoteCell] = useState(null);
  const [selectedNoteCell, setSelectedNoteCell] = useState(null);
  const [showAssetPanel, setShowAssetPanel] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [draggingAsset, setDraggingAsset] = useState(null);
  const [gridVisible, setGridVisible] = useState(true);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [draggingToken, setDraggingToken] = useState(null);
  const draggingPositionRef = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0);
  const [activeLayer, setActiveLayer] = useState("player");
  const [fogVisible, setFogVisible] = useState(true);
  const [toolMode, setToolMode] = useState("select");

  const {
    tokens: availableTokens,
    loading,
    error,
  } = fetchTokens(currentCampaign);

  useEffect(() => {
    if (toolMode !== "notes") setSelectedNoteCell(null);
  }, [toolMode]);

  useEffect(() => {
    console.log("Available tokens:", availableTokens);
  }, [availableTokens]);

  useEffect(() => {
    const allTokens = Object.values(mapData.layers || {}).flatMap(
      (layer) => layer.tokens || []
    );
    console.log("🧩 All tokens on map:", allTokens);
  }, [mapData]);

  const handleSizeUpdate = (newSize) => {
    setMapData((prev) => ({
      ...prev,
      ...newSize,
    }));
  };

  const handleCanvasDrop = (pointer) => {
    if (draggingToken) {
      console.log("📋 draggingToken:", draggingToken);
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

  const handleUpdateToken = (updatedToken) => {
    const sourceLayer = updatedToken._layer;
    const targetLayer = updatedToken._targetLayer || sourceLayer;

    setMapData((prevMap) => {
      const prevTokens = prevMap.layers?.[sourceLayer]?.tokens || [];

      if (updatedToken._delete) {
        return {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [sourceLayer]: {
              ...prevMap.layers[sourceLayer],
              tokens: prevTokens.filter((t) => t.id !== updatedToken.id),
            },
          },
        };
      }

      if (updatedToken._moveToLayer && targetLayer !== sourceLayer) {
        const movedToken = { ...updatedToken, _layer: targetLayer };
        delete movedToken._moveToLayer;
        delete movedToken._targetLayer;

        // ⬇️ Clear selected token after moving it
        setSelectedToken(null);

        return {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [sourceLayer]: {
              ...prevMap.layers[sourceLayer],
              tokens: prevMap.layers[sourceLayer].tokens.filter(
                (t) => t.id !== movedToken.id
              ),
            },
            [targetLayer]: {
              ...prevMap.layers[targetLayer],
              tokens: [
                ...(prevMap.layers[targetLayer]?.tokens || []),
                movedToken,
              ],
            },
          },
        };
      }

      const updatedTokens = prevTokens.map((t) =>
        t.id === updatedToken.id ? updatedToken : t
      );

      return {
        ...prevMap,
        layers: {
          ...prevMap.layers,
          [sourceLayer]: {
            ...prevMap.layers[sourceLayer],
            tokens: updatedTokens,
          },
        },
      };
    });
  };

  useEffect(() => {
    const allIds = Object.values(mapData.layers || {})
      .flatMap((layer) => layer.tokens || [])
      .map((t) => t.id);

    const duplicates = allIds.filter((id, i, arr) => arr.indexOf(id) !== i);
    if (duplicates.length > 0) {
      console.warn("🚨 Duplicate token IDs detected:", duplicates);
    }
  }, [mapData]);

  const handleSaveMap = async () => {
    try {
      // Ensure all tokens and assets have required entityId and entityType
      const sanitizeToken = (token) => ({
        ...token,
        entityId: token.entityId || token.id,
        entityType: token.entityType || "Token",
      });

      const sanitizeAsset = (asset) => ({
        ...asset,
        entityId: asset.entityId || asset.id,
        entityType: asset.entityType || "MapAsset",
      });

      const sanitizedLayers = {};
      for (const [layerKey, layerData] of Object.entries(mapData.layers)) {
        sanitizedLayers[layerKey] = {
          tokens: (layerData.tokens || []).map(sanitizeToken),
          assets: (layerData.assets || []).map(sanitizeAsset),
        };
      }

      const payload = {
        ...mapData,
        layers: sanitizedLayers,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/maps/${mapData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save map");

      console.log("✅ Map saved successfully:", data);
    } catch (err) {
      console.error("❌ Failed to save map:", err);
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
        onSave={handleSaveMap}
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
          availableTokens={availableTokens}
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
          mapId={mapData._id}
          notes={mapData.notes}
          activeNoteCell={activeNoteCell}
          onClose={() => setToolMode("select")}
          onUpdateNotes={(updatedNotes) => {
            setMapData((prev) => ({ ...prev, notes: updatedNotes }));
            setActiveNoteCell(null);
          }}
          onSelectNote={(note) => {
            if (note.cell) {
              setSelectedNoteCell(note.cell);
            }
          }}
        />
      )}

      <div className={styles.canvasArea}>
        {mapData ? (
          <div className={styles.mapContainer}>
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
              onSelectToken={setSelectedToken}
            />
            {selectedToken && (
              <TokenControlPanel
                token={selectedToken}
                onUpdateToken={handleUpdateToken}
              />
            )}
          </div>
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
