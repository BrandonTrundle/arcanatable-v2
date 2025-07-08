import { useState } from "react";

export function useAoEDragState() {
  const [isDraggingAoE, setIsDraggingAoE] = useState(false);
  const [aoeDragOrigin, setAoeDragOrigin] = useState(null);
  const [aoeDragTarget, setAoeDragTarget] = useState(null);

  const resetAoEDrag = () => {
    setIsDraggingAoE(false);
    setAoeDragOrigin(null);
    setAoeDragTarget(null);
  };

  return {
    isDraggingAoE,
    setIsDraggingAoE,
    aoeDragOrigin,
    setAoeDragOrigin,
    aoeDragTarget,
    setAoeDragTarget,
    resetAoEDrag,
  };
}
