// ./hooks/usePlayerStageMouseHandlers.js
import { useState } from "react";
import { getSnappedPointer } from "../../DM/utils/snapUtils";

export default function usePlayerStageMouseHandlers({
  stageRef,
  map,
  snapMode,
  toolMode,
  isDraggingAoE,
  setIsDraggingAoE,
  aoeDragOrigin,
  setAoeDragOrigin,
  aoeDragTarget,
  setAoeDragTarget,
  resetAoEDrag,
  placeAoE,
  handleRulerMouseDown,
  handleRulerMouseMove,
  handleRulerMouseUp,
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState(null);

  const onMouseDown = (e) => {
    const snapped = getSnappedPointer(
      e.target.getStage().getPointerPosition(),
      stageRef.current,
      map.gridSize,
      snapMode
    );

    if (!toolMode && e.evt.button === 0) {
      setIsPanning(true);
      setLastPointerPosition(e.target.getStage().getPointerPosition());
    }

    if (toolMode === "aoe" && e.evt.button === 0) {
      setIsDraggingAoE(true);
      setAoeDragOrigin(snapped);
      setAoeDragTarget(snapped);
    }

    if (toolMode === "ruler") {
      handleRulerMouseDown(e);
    }
  };

  const onMouseMove = (e) => {
    const snapped = getSnappedPointer(
      e.target.getStage().getPointerPosition(),
      stageRef.current,
      map.gridSize,
      snapMode
    );

    if (isDraggingAoE) setAoeDragTarget(snapped);
    if (toolMode === "ruler") handleRulerMouseMove(e);

    if (isPanning && lastPointerPosition) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      const dx = pointer.x - lastPointerPosition.x;
      const dy = pointer.y - lastPointerPosition.y;

      stage.x(stage.x() + dx);
      stage.y(stage.y() + dy);
      setLastPointerPosition(pointer);
    }
  };

  const onMouseUp = (e) => {
    const snapped = getSnappedPointer(
      e.target.getStage().getPointerPosition(),
      stageRef.current,
      map.gridSize,
      snapMode
    );

    if (isDraggingAoE && e.evt.button === 0) {
      placeAoE(snapped, aoeDragOrigin);
    }

    if (isDraggingAoE) {
      resetAoEDrag();
    }

    if (toolMode === "ruler") {
      handleRulerMouseUp(e);
    }

    if (isPanning) {
      setIsPanning(false);
      setLastPointerPosition(null);
    }
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
