import { useState, useCallback, useRef } from "react";

export function useTokenDrag({ token, gridSize, onTokenMove }) {
  const [ghostPos, setGhostPos] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const rafIdRef = useRef(null);

  const startDrag = useCallback(() => {
    const { x, y } = token.position;
    setStartCell({ x, y });
    setGhostPos({ x, y });
    setIsDragging(true);
  }, [token]);

  const throttleRef = useRef(null);

  const moveGhost = useCallback(
    (e) => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        const x = Math.round(e.target.x() / gridSize);
        const y = Math.round(e.target.y() / gridSize);
        setGhostPos({ x, y });
        throttleRef.current = null;
      }, 50); // Update every 50ms
    },
    [gridSize]
  );

  const endDrag = useCallback(
    (groupRef) => {
      if (
        ghostPos &&
        startCell &&
        (ghostPos.x !== startCell.x || ghostPos.y !== startCell.y)
      ) {
        if (groupRef?.current) {
          groupRef.current.setAttrs({
            x: startCell.x * gridSize,
            y: startCell.y * gridSize,
          });
        }

        requestAnimationFrame(() => {
          onTokenMove(token.id, ghostPos);
        });
      }

      setGhostPos(null);
      setStartCell(null);
      setIsDragging(false);
    },
    [ghostPos, startCell, gridSize, onTokenMove, token.id]
  );

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
