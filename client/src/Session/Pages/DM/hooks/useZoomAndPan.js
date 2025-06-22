import { useEffect, useCallback, useState } from "react";

export function useZoomAndPan(stageRef) {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // For Konva's <Stage onWheel={handleWheel}> prop
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: (stage.getPointerPosition().x - stage.x()) / oldScale,
      y: (stage.getPointerPosition().y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);
    setStagePos({
      x: stage.getPointerPosition().x - mousePointTo.x * newScale,
      y: stage.getPointerPosition().y - mousePointTo.y * newScale,
    });
  }, []);

  // Optional: fallback if someone scrolls directly on the container
  useEffect(() => {
    const stage = stageRef.current?.getStage();
    const container = stage?.container();
    if (!container) return;

    const listener = (e) => handleWheel({ evt: e, target: stage });

    container.addEventListener("wheel", listener);
    return () => container.removeEventListener("wheel", listener);
  }, [stageRef, handleWheel]);

  return { stageScale, stagePos, setStagePos, handleWheel };
}
