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
      if (!json) {
        return;
      }

      let payload;
      try {
        payload = JSON.parse(json);
      } catch (err) {
        console.error("Failed to parse drop payload:", err);
        return;
      }

      // Skip if it's a mapAsset — let another hook handle it
      if (payload?.type === "mapAsset") {
        console.log("Drop payload is a mapAsset — skipping token handling.");
        return;
      }

      const droppedToken = payload;

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
        const allTokens = Object.values(prevMap.layers || {}).flatMap(
          (layer) => layer.tokens || []
        );

        const tokens = [...(prevMap.layers?.[activeLayer]?.tokens || [])];

        const baseName = droppedToken.name.trim();
        let highestSuffix = -1;

        allTokens.forEach((token) => {
          const regex = new RegExp(`^${baseName}(?:\\s(\\d+))?$`);
          const match = token.name.match(regex);
          if (match) {
            const suffix = match[1] ? parseInt(match[1], 10) : 0;
            if (suffix > highestSuffix) highestSuffix = suffix;
          }
        });

        if (highestSuffix >= 0) {
          droppedToken.name = `${baseName} ${highestSuffix + 1}`;
          console.log(`Adjusted token name to: ${droppedToken.name}`);
        } else {
          console.log(`Token name remains: ${droppedToken.name}`);
        }

        tokens.push(droppedToken);

        const updatedMap = {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [activeLayer]: {
              ...prevMap.layers[activeLayer],
              tokens,
            },
          },
        };

        //     console.log("Tokens after drop:", tokens);
        //     console.log("Updated map state with new token:", updatedMap);

        socket.emit("dmDropToken", {
          sessionCode,
          mapId: updatedMap._id,
          token: droppedToken,
        });

        //       console.log("Token drop emitted to server:", {
        //         sessionCode,
        //         mapId: updatedMap._id,
        //         token: droppedToken,
        //       });

        return updatedMap;
      });
    };

    const container = stageRef.current?.container();
    if (!container) return;

    const preventDefault = (e) => e.preventDefault();

    container.addEventListener("dragover", preventDefault);
    container.addEventListener("drop", handleDrop);

    //   console.log("Token drop handler registered");

    return () => {
      container.removeEventListener("dragover", preventDefault);
      container.removeEventListener("drop", handleDrop);
      //     console.log("Token drop handler unregistered");
    };
  }, [stageRef, map, setMapData, activeLayer, sessionCode]);
}
