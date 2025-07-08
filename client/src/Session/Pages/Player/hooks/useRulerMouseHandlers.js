// client/src/Player/hooks/useRulerMouseHandlers.js
import { getSnappedPointer } from "../../DM/utils/snapUtils";

export function useRulerMouseHandlers({
  toolMode,
  isMeasuring,
  startMeasurement,
  updateMeasurementTarget,
  finalizeMeasurement,
  stageRef,
  map,
  snapMode,
}) {
  const getSnappedPointerPos = (e) => {
    const pointer = e.target.getStage().getPointerPosition();
    return getSnappedPointer(pointer, stageRef.current, map.gridSize, snapMode);
  };

  const onMouseDown = (e) => {
    if (toolMode === "ruler" && e.evt.button === 0) {
      const snapped = getSnappedPointerPos(e);
      startMeasurement(snapped);
    }
  };

  const onMouseMove = (e) => {
    if (!isMeasuring) return;

    const snapped = getSnappedPointerPos(e);
    updateMeasurementTarget(snapped);
  };

  const onMouseUp = (e) => {
    if (isMeasuring && e.evt.button === 0) {
      const snapped = getSnappedPointerPos(e);
      finalizeMeasurement(snapped);
    }
  };

  return { onMouseDown, onMouseMove, onMouseUp };
}
