// ./hooks/useAoEPlacementHandler.js
import { useAoEPlacement } from "./useAoEPlacement";

export default function useAoEPlacementHandler({
  map,
  shapeSettings,
  selectedShape,
  sessionCode,
  setAoes,
}) {
  return useAoEPlacement(
    map,
    shapeSettings,
    selectedShape,
    sessionCode,
    setAoes
  );
}
