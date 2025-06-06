// hooks/tokens/useKeyboardTokenControl.js
import { useEffect } from "react";

export function useKeyboardTokenControl({
  map,
  activeLayer,
  selectedTokenId,
  onMove,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedTokenId) return;

      const currentToken = map.layers?.[activeLayer]?.tokens.find(
        (t) => t.id === selectedTokenId
      );

      if (!currentToken) return;

      const delta = { x: 0, y: 0 };

      switch (e.key) {
        case "ArrowUp":
          delta.y = -1;
          break;
        case "ArrowDown":
          delta.y = 1;
          break;
        case "ArrowLeft":
          delta.x = -1;
          break;
        case "ArrowRight":
          delta.x = 1;
          break;
        default:
          return;
      }

      const newPos = {
        x: currentToken.position.x + delta.x,
        y: currentToken.position.y + delta.y,
      };

      onMove(selectedTokenId, newPos);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTokenId, map, activeLayer, onMove]);
}
