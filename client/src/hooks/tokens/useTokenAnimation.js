import { useEffect } from "react";
import Konva from "konva";

export function useTokenAnimation({
  groupRef,
  tokenPosition,
  isDragging,
  gridSize,
  visualPos,
  setVisualPos,
}) {
  useEffect(() => {
    const targetX = tokenPosition.x * gridSize;
    const targetY = tokenPosition.y * gridSize;

    if (
      groupRef.current &&
      !isDragging &&
      (visualPos.x !== targetX || visualPos.y !== targetY)
    ) {
      //   console.log("🎯 Animating token to:", tokenPosition);

      groupRef.current.to({
        x: targetX,
        y: targetY,
        duration: 0.25,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => {
          setVisualPos({ x: targetX, y: targetY });
        },
      });
    }
  }, [tokenPosition, isDragging, visualPos, gridSize]);
}
