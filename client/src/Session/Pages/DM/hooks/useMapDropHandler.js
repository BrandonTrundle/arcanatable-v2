import { getCellFromPointer } from "../../../../utils/grid/coordinates";

export function useMapDropHandler(map, onCanvasDrop) {
  const handleCanvasMouseUp = (e) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    const cell = getCellFromPointer(pointer, map.gridSize);
    if (!cell) return;

    onCanvasDrop(pointer);
  };

  return { handleCanvasMouseUp };
}
