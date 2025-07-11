import Konva from "konva";
import socket from "../../../../socket";

export function handleMapClickAction({
  e,
  map,
  sessionCode,
  toolMode,
  selectorMode,
}) {
  if (toolMode !== "select") return;

  const stage = e.target.getStage();
  const pointer = stage.getPointerPosition();
  const scale = stage.scaleX();

  const cellX = Math.floor((pointer.x - stage.x()) / (map.gridSize * scale));
  const cellY = Math.floor((pointer.y - stage.y()) / (map.gridSize * scale));

  if (selectorMode === "point") {
    socket.emit("dm:teleportPlayerView", {
      sessionCode,
      cell: { x: cellX, y: cellY },
    });
  }

  if (selectorMode === "ring") {
    socket.emit("dm:pingCell", {
      sessionCode,
      cell: { x: cellX, y: cellY },
    });

    const layer = stage.findOne("#PingLayer");
    if (!layer) return;

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
}
