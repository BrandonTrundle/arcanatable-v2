export function placeNoteAtCell({ map, cell }) {
  const unplacedIndex = map.notes.findIndex((n) => n.cell == null);
  if (unplacedIndex === -1) return map;

  const updatedNotes = [...map.notes];
  updatedNotes[unplacedIndex] = {
    ...updatedNotes[unplacedIndex],
    cell: { x: cell.x, y: cell.y },
  };

  return {
    ...map,
    notes: updatedNotes,
  };
}
