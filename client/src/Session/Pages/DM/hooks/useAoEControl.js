import { useState } from "react";
import socket from "../../../../socket";
import { applySnap } from "../utils/snapUtils";
import { nanoid } from "nanoid";

export function useAoEControl({
  map,
  selectedShape,
  shapeSettings,
  setAoes,
  sessionCode,
  snapMode,
}) {
  const [isDraggingAoE, setIsDraggingAoE] = useState(false);
  const [aoeDragOrigin, setAoeDragOrigin] = useState(null);
  const [aoeDragTarget, setAoeDragTarget] = useState(null);

  const startAoEDrag = (pointer) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);
    setIsDraggingAoE(true);
    setAoeDragOrigin(snapped);
    setAoeDragTarget(snapped);
  };

  const updateAoEDragTarget = (pointer) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);
    setAoeDragTarget(snapped);
  };

  const finalizeAoE = (pointer) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);
    const ftToPx = (ft) => (map.gridSize / 5) * ft;

    const isCone = selectedShape === "cone";
    const origin = aoeDragOrigin;
    const target = snapped;

    const newAoE = {
      id: nanoid(),
      x: isCone ? origin.x : target.x,
      y: isCone ? origin.y : target.y,
      type: selectedShape,
      color: shapeSettings[selectedShape]?.color || "#ff0000",
      opacity: 0.4,
    };

    if (selectedShape === "circle") {
      newAoE.radius = ftToPx(shapeSettings.circle?.radius || 20);
    }

    if (selectedShape === "cone") {
      newAoE.radius = ftToPx(shapeSettings.cone?.radius || 30);
      newAoE.angle = shapeSettings.cone?.angle || 60;
      const dx = target.x - origin.x;
      const dy = target.y - origin.y;
      newAoE.direction = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    if (selectedShape === "square") {
      newAoE.width = ftToPx(shapeSettings.square?.width || 30);
    }

    if (selectedShape === "rectangle") {
      newAoE.width = ftToPx(shapeSettings.rectangle?.width || 40);
      newAoE.height = ftToPx(shapeSettings.rectangle?.height || 20);
    }

    setAoes((prev) => [...prev, newAoE]);
    socket.emit("aoePlaced", { sessionCode, aoe: newAoE });

    setIsDraggingAoE(false);
    setAoeDragOrigin(null);
    setAoeDragTarget(null);
  };

  const deleteAoE = (id) => {
    setAoes((prev) => prev.filter((a) => a.id !== id));
    socket.emit("aoeDeleted", { sessionCode, aoeId: id });
  };

  return {
    isDraggingAoE,
    aoeDragOrigin,
    aoeDragTarget,
    startAoEDrag,
    updateAoEDragTarget,
    finalizeAoE,
    deleteAoE, // <- You NEED this in your return block
  };
}
