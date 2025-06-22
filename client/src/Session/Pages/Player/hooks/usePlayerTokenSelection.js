import { useState, useEffect, useCallback } from "react";

export default function usePlayerTokenSelection(map, user) {
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const handleSelectToken = useCallback(
    (id) => {
      setSelectedTokenId(id);
      const allTokens = Object.values(map.layers || {}).flatMap(
        (l) => l.tokens || []
      );
      const token = allTokens.find((t) => t.id === id);
      if (token) {
        console.log(`[Player ${user?.id}] selected token:`, token);
      } else {
        console.log(
          `[Player ${user?.id}] selected token ID: ${id}, but token not found`
        );
      }
    },
    [map, user]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedTokenId(null);
        console.log("[Player] Deselected token via Escape key");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { selectedTokenId, handleSelectToken };
}
