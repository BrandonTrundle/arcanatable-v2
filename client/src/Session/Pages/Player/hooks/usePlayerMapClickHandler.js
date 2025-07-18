import Konva from "konva";
import { useCallback } from "react";
import socket from "../../../../socket";

export default function usePlayerMapClickHandler({
  toolMode,
  selectorMode,
  map,
  sessionCode,
}) {
  return useCallback(
    (e) => {
      if (toolMode !== "select") return;

      const stage = e.target.getStage();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const pointer = transform.point(stage.getPointerPosition());

      const cellX = Math.floor(pointer.x / map.gridSize);
      const cellY = Math.floor(pointer.y / map.gridSize);

      if (selectorMode === "point") {
        stage.to({
          x: -cellX * map.gridSize * stage.scaleX() + stage.width() / 2,
          y: -cellY * map.gridSize * stage.scaleY() + stage.height() / 2,
          duration: 0.5,
          easing: Konva.Easings.EaseInOut,
        });
      }

      if (selectorMode === "ring") {
        const layer = stage.findOne("#PingLayer");
        if (layer) {
          const x = cellX * map.gridSize + map.gridSize / 2;
          const y = cellY * map.gridSize + map.gridSize / 2;

          const ring = new Konva.Circle({
            x,
            y,
            radius: 0,
            stroke: "blue",
            strokeWidth: 4,
            opacity: 0.8,
          });

          layer.add(ring);
          ring.to({
            radius: map.gridSize * 1.5,
            opacity: 0,
            duration: 1,
            easing: Konva.Easings.EaseOut,
            onFinish: () => ring.destroy(),
          });

          layer.batchDraw();
        }

        // Emit player ping event
        socket.emit("player_ping", { sessionCode, cellX, cellY });
      }
    },
    [toolMode, selectorMode, map, sessionCode]
  );
}
