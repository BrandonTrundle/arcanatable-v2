// ./hooks/useMapClickHandler.js
import usePlayerMapClickHandler from "./usePlayerMapClickHandler";

export default function useMapClickHandler({
  toolMode,
  selectorMode,
  map,
  sessionCode,
}) {
  return usePlayerMapClickHandler({
    toolMode,
    selectorMode,
    map,
    sessionCode,
  });
}
