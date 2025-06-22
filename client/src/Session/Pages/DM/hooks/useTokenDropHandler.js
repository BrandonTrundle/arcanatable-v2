import { useEffect } from "react";
import socket from "../../../../socket";

export function useTokenDropHandler(
  stageRef,
  map,
  setMapData,
  activeLayer,
  sessionCode
) {
  useEffect(() => {
    if (!map) return;

    const handleDrop = (e) => {
      e.preventDefault();

      const json = e.dataTransfer.getData("application/json");
      if (!json) return;

      const droppedToken = JSON.parse(json);

      const stage = stageRef.current.getStage();
      const rect = stage.container().getBoundingClientRect();
      const scale = stage.scaleX();

      const pointerX = (e.clientX - rect.left - stage.x()) / scale;
      const pointerY = (e.clientY - rect.top - stage.y()) / scale;

      const cellX = Math.floor(pointerX / map.gridSize);
      const cellY = Math.floor(pointerY / map.gridSize);

      droppedToken.position = { x: cellX, y: cellY };
      droppedToken.id = crypto.randomUUID();
      droppedToken._layer = activeLayer;

      const updatedMap = { ...map };
      if (!updatedMap.layers[activeLayer].tokens) {
        updatedMap.layers[activeLayer].tokens = [];
      }
      updatedMap.layers[activeLayer].tokens.push(droppedToken);
      setMapData(updatedMap);

      socket.emit("dmDropToken", {
        sessionCode,
        mapId: map._id,
        token: droppedToken,
      });
    };

    const container = stageRef.current?.container();
    if (!container) return;

    const preventDefault = (e) => e.preventDefault();

    container.addEventListener("dragover", preventDefault);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", preventDefault);
      container.removeEventListener("drop", handleDrop);
    };
  }, [stageRef, map, setMapData, activeLayer, sessionCode]);
}
