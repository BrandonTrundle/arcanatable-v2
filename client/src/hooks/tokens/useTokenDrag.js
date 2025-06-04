import { useState } from "react";

export function useTokenDrag({ token, gridSize, onTokenMove }) {
  const [ghostPos, setGhostPos] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = () => {
    const { x, y } = token.position;
    console.log("🟡 Starting ghost drag from:", x, y);
    setStartCell({ x, y });
    setGhostPos({ x, y });
    setIsDragging(true);
  };

  const moveGhost = (e) => {
    const x = Math.round(e.target.x() / gridSize);
    const y = Math.round(e.target.y() / gridSize);
    console.log("🟢 Drag move:", x, y);
    setGhostPos({ x, y });
  };

  const endDrag = (groupRef) => {
    console.log("🔴 Drag ended");

    if (
      ghostPos &&
      startCell &&
      (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y)
    ) {
      console.log("🚚 Moving token from", startCell, "to", ghostPos);

      if (groupRef.current) {
        groupRef.current.setAttrs({
          x: startCell.x * gridSize,
          y: startCell.y * gridSize,
        });
      }

      requestAnimationFrame(() => {
        onTokenMove(token.id, ghostPos);
      });
    } else {
      console.log("⛔ Cancelled — no movement");
    }

    setGhostPos(null);
    setStartCell(null);
    setIsDragging(false);
  };

  return {
    ghostPos,
    startCell,
    isDragging,
    startDrag,
    moveGhost,
    endDrag,
    setStartCell,
    setGhostPos,
    setIsDragging,
  };
}
