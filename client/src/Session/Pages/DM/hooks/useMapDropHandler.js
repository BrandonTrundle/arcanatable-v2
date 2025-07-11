import { useEffect } from "react";
import { getCellFromPointer } from "../../../../utils/grid/coordinates";
import socket from "../../../../socket";

export function useMapDropHandler(
  map,
  setMapData,
  activeLayer,
  stageRef,
  sessionCode
) {
  useEffect(() => {
    if (!map || !stageRef?.current) return;

    const container = stageRef.current.container();
    if (!container) return;

    const handleDrop = (e) => {
      e.preventDefault();

      let payload;
      try {
        payload = JSON.parse(e.dataTransfer.getData("application/json"));
      } catch (err) {
        console.warn("Invalid JSON payload on drop.");
        return;
      }

      if (payload?.type !== "mapAsset") return;

      const asset = payload.asset;

      const stage = stageRef.current.getStage();
      const rect = stage.container().getBoundingClientRect();
      const scale = stage.scaleX();

      const pointerX = (e.clientX - rect.left - stage.x()) / scale;
      const pointerY = (e.clientY - rect.top - stage.y()) / scale;

      const cellX = Math.floor(pointerX / map.gridSize);
      const cellY = Math.floor(pointerY / map.gridSize);

      const newAsset = {
        ...asset,
        id: crypto.randomUUID(),
        position: { x: cellX, y: cellY },
        rotation: 0,
        _layer: activeLayer,
        entityId: asset.entityId ?? asset.id ?? crypto.randomUUID(),
        entityType: "mapAsset",
      };

      // Update local map state
      setMapData((prev) => {
        const updatedLayers = { ...prev.layers };
        const existingAssets = updatedLayers[activeLayer]?.assets || [];
        updatedLayers[activeLayer] = {
          ...updatedLayers[activeLayer],
          assets: [...existingAssets, newAsset],
        };

        return {
          ...prev,
          layers: updatedLayers,
        };
      });

      // Emit to socket
      socket.emit("mapAssetPlaced", {
        sessionCode,
        asset: newAsset,
        layer: activeLayer,
      });
    };

    const preventDefault = (e) => e.preventDefault();

    container.addEventListener("dragover", preventDefault);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", preventDefault);
      container.removeEventListener("drop", handleDrop);
    };
  }, [map, setMapData, activeLayer, stageRef, sessionCode]);
}
