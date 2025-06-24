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

      console.log("Drop event detected");

      const json = e.dataTransfer.getData("application/json");
      if (!json) {
        console.log("No JSON payload found in drop event");
        return;
      }

      const droppedToken = JSON.parse(json);
      console.log("Dropped token payload:", droppedToken);

      const stage = stageRef.current.getStage();
      const rect = stage.container().getBoundingClientRect();
      const scale = stage.scaleX();

      const pointerX = (e.clientX - rect.left - stage.x()) / scale;
      const pointerY = (e.clientY - rect.top - stage.y()) / scale;

      const cellX = Math.floor(pointerX / map.gridSize);
      const cellY = Math.floor(pointerY / map.gridSize);

      console.log(`Calculated drop cell: (${cellX}, ${cellY})`);

      droppedToken.position = { x: cellX, y: cellY };
      droppedToken.id = crypto.randomUUID();
      droppedToken._layer = activeLayer;

      setMapData((prevMap) => {
        const updatedMap = {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [activeLayer]: {
              ...prevMap.layers[activeLayer],
              tokens: [...(prevMap.layers[activeLayer].tokens || [])],
            },
          },
        };

        console.log(
          "Existing tokens before drop:",
          updatedMap.layers[activeLayer].tokens
        );

        const existingTokens = updatedMap.layers[activeLayer].tokens;
        const baseName = droppedToken.name;
        let count = 1;

        existingTokens.forEach((token) => {
          const regex = new RegExp(`^${baseName}(?:\\s(\\d+))?$`);
          const match = token.name.match(regex);
          if (match) {
            const suffix = match[1] ? parseInt(match[1], 10) : 1;
            if (suffix >= count) count = suffix + 1;
          }
        });

        if (count > 1) {
          droppedToken.name = `${baseName} ${count}`;
          console.log(`Adjusted token name to: ${droppedToken.name}`);
        } else {
          console.log(`Token name remains: ${droppedToken.name}`);
        }

        updatedMap.layers[activeLayer].tokens.push(droppedToken);

        console.log(
          "Tokens after drop:",
          updatedMap.layers[activeLayer].tokens
        );
        console.log("Updated map state with new token:", updatedMap);

        socket.emit("dmDropToken", {
          sessionCode,
          mapId: updatedMap._id,
          token: droppedToken,
        });

        console.log("Token drop emitted to server:", {
          sessionCode,
          mapId: updatedMap._id,
          token: droppedToken,
        });

        return updatedMap;
      });
    };

    const container = stageRef.current?.container();
    if (!container) return;

    const preventDefault = (e) => e.preventDefault();

    container.addEventListener("dragover", preventDefault);
    container.addEventListener("drop", handleDrop);

    console.log("Token drop handler registered");

    return () => {
      container.removeEventListener("dragover", preventDefault);
      container.removeEventListener("drop", handleDrop);
      console.log("Token drop handler unregistered");
    };
  }, [stageRef, map, setMapData, activeLayer, sessionCode]);
}
