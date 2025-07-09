import { useState } from "react";

export function useAssetDrag({ asset, gridSize, onAssetMove }) {
  const [ghostPos, setGhostPos] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = () => {
    setStartCell(asset.position);
    setGhostPos(asset.position);
    setIsDragging(true);
  };

  const moveGhost = (e) => {
    const raw = e.target.position();
    const scaled = {
      x: raw.x / gridSize,
      y: raw.y / gridSize,
    };
    setGhostPos(scaled);
  };

  const endDrag = (groupRef) => {
    if (
      ghostPos &&
      startCell &&
      (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y)
    ) {
      console.log("[HOOK] Calling onAssetMove with:", asset.id, ghostPos);
      onAssetMove(asset.id, ghostPos); // ✅ FIXED
    }

    setIsDragging(false);
    setStartCell(null);
    setGhostPos(null);
  };

  return {
    ghostPos,
    startCell,
    isDragging,
    startDrag,
    moveGhost,
    endDrag,
    setGhostPos,
    setStartCell,
    setIsDragging,
  };
}
