import { useEffect } from "react";
import socket from "../../../../socket";

export default function useAoEMeasurementHandlers(
  setAoes,
  setLockedMeasurements
) {
  useEffect(() => {
    const handleAoEPlaced = ({ aoe }) => {
      setAoes((prev) => [...prev, aoe]);
    };

    const handleAoEDeleted = ({ aoeId }) => {
      setAoes((prev) => prev.filter((a) => a.id !== aoeId));
    };

    const handleMeasurementPlaced = (measurement) => {
      setLockedMeasurements((prev) => [...prev, measurement]);
    };

    const handleMeasurementClearLocked = ({ userId }) => {
      setLockedMeasurements((prev) => prev.filter((m) => m.userId !== userId));
    };

    const handleMeasurementClearAll = () => {
      setLockedMeasurements([]);
    };

    socket.on("aoePlaced", handleAoEPlaced);
    socket.on("aoeDeleted", handleAoEDeleted);
    socket.on("measurement:placed", handleMeasurementPlaced);
    socket.on("measurement:clearLocked", handleMeasurementClearLocked);
    socket.on("measurement:clearAll", handleMeasurementClearAll);

    return () => {
      socket.off("aoePlaced", handleAoEPlaced);
      socket.off("aoeDeleted", handleAoEDeleted);
      socket.off("measurement:placed", handleMeasurementPlaced);
      socket.off("measurement:clearLocked", handleMeasurementClearLocked);
      socket.off("measurement:clearAll", handleMeasurementClearAll);
    };
  }, [setAoes, setLockedMeasurements]);
}
