// ./hooks/useStageControls.js
import { useState } from "react";
import usePlayerMapZoomHandler from "./usePlayerZoomHandler";

export default function useStageControls() {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const handleZoom = usePlayerMapZoomHandler(setStageScale, setStagePos);

  return {
    stageScale,
    setStageScale,
    stagePos,
    setStagePos,
    handleZoom,
  };
}
