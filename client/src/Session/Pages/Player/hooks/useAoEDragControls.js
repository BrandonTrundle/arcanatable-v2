// ./hooks/useAoEDragControls.js
import { useAoEDragState } from "./useAoEDragState";

export default function useAoEDragControls() {
  const {
    isDraggingAoE,
    setIsDraggingAoE,
    aoeDragOrigin,
    setAoeDragOrigin,
    aoeDragTarget,
    setAoeDragTarget,
    resetAoEDrag,
  } = useAoEDragState();

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
