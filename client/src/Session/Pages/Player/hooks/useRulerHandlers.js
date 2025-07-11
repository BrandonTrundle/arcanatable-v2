// ./hooks/useRulerHandlers.js
import { useRulerMouseHandlers } from "./useRulerMouseHandlers";

export default function useRulerHandlers({
  toolMode,
  isMeasuring,
  startMeasurement,
  updateMeasurementTarget,
  finalizeMeasurement,
  stageRef,
  map,
  snapMode,
}) {
  const {
    onMouseDown: handleRulerMouseDown,
    onMouseMove: handleRulerMouseMove,
    onMouseUp: handleRulerMouseUp,
  } = useRulerMouseHandlers({
    toolMode,
    isMeasuring,
    startMeasurement,
    updateMeasurementTarget,
    finalizeMeasurement,
    stageRef,
    map,
    snapMode,
  });

  return {
    handleRulerMouseDown,
    handleRulerMouseMove,
    handleRulerMouseUp,
  };
}
