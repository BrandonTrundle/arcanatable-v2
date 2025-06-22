import { useEffect } from "react";
import Konva from "konva";
import socket from "../../../../socket";

export function usePingBroadcast(stageRef, map) {
  useEffect(() => {
    if (!map) return;
    const stage = stageRef.current?.getStage();
    if (!stage) return;

    const handleBroadcastPing = ({ cellX, cellY }) => {
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
    };

    socket.on("broadcast_ping", handleBroadcastPing);
    return () => socket.off("broadcast_ping", handleBroadcastPing);
  }, [stageRef, map]);
}
