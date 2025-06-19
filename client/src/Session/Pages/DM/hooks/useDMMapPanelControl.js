import { useState } from "react";
import socket from "../../../../socket";

export function useDMMapPanelControl({
  maps,
  selectedMapId,
  setSelectedMapId,
  setActiveMap,
  sessionCode,
  user,
}) {
  const [showMapsPanel, setShowMapsPanel] = useState(false);

  const toggleMapsPanel = () => {
    setShowMapsPanel((prev) => !prev);
  };

  const handleLoadMap = async () => {
    const map = maps.find((m) => m._id === selectedMapId);
    if (!map) return;

    setActiveMap(map);

    socket.emit("dmLoadMap", { sessionCode, map });

    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/sessions/${sessionCode}/set-active-map`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ mapId: selectedMapId }),
        }
      );
    } catch (error) {
      console.error("Failed to set current map:", error);
    }
  };

  return {
    showMapsPanel,
    toggleMapsPanel,
    handleLoadMap,
  };
}
