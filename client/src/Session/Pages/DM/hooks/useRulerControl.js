import { useState } from "react";
import socket from "../../../../socket";
import { applySnap } from "../utils/snapUtils";

export function useRulerControl({
  map,
  measurementColor,
  user,
  lockMeasurement,
  broadcastEnabled,
  setLockedMeasurements,
  sessionCode,
}) {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureOrigin, setMeasureOrigin] = useState(null);
  const [measureTarget, setMeasureTarget] = useState(null);

  const startMeasurement = (pointer, snapMode) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);
    setIsMeasuring(true);
    setMeasureOrigin(snapped);
    setMeasureTarget(snapped);
  };

  const updateMeasurementTarget = (pointer, snapMode) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);
    setMeasureTarget(snapped);
  };

  const finalizeMeasurement = (pointer, snapMode) => {
    const snapped = applySnap(pointer.x, pointer.y, map.gridSize, snapMode);

    const measurement = {
      id: Date.now(),
      origin: measureOrigin,
      target: snapped,
      color: measurementColor,
      userId: user.id,
      locked: lockMeasurement,
    };

    if (lockMeasurement) {
      setLockedMeasurements((prev) => [...prev, measurement]);
    }

    if (broadcastEnabled) {
      console.log(
        "Emitting measurement:",
        measurement,
        "Session:",
        sessionCode
      );
      socket.emit("measurement:placed", { sessionCode, measurement });
    }

    cancelMeasurement();
  };

  const cancelMeasurement = () => {
    setIsMeasuring(false);
    setMeasureOrigin(null);
    setMeasureTarget(null);
  };

  const clearMyMeasurements = () => {
    socket.emit("measurement:clearLocked", { sessionCode, userId: user.id });
    setLockedMeasurements((prev) => prev.filter((m) => m.userId !== user.id));
  };

  const clearAllMeasurements = () => {
    socket.emit("measurement:clearAll", { sessionCode });
  };

  return {
    isMeasuring,
    measureOrigin,
    measureTarget,
    startMeasurement,
    updateMeasurementTarget,
    finalizeMeasurement,
    cancelMeasurement,
    clearMyMeasurements,
    clearAllMeasurements,
  };
}
