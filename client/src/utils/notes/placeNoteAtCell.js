export function placeNoteAtCell({ map, cell }) {
  console.log("➡️ placeNoteAtCell called with cell:", cell);

  const unplacedIndex = map.notes.findIndex((n) => n.cell == null);
  if (unplacedIndex === -1) {
    console.warn("⚠️ No unplaced notes found.");
    return map;
  }

  const updatedNotes = [...map.notes];
  const targetNote = updatedNotes[unplacedIndex];
  updatedNotes[unplacedIndex] = {
    ...targetNote,
    cell: { x: cell.x, y: cell.y },
  };

  //  console.log(
  //    `✍️ Assigned cell to note [${targetNote.name}] at index ${unplacedIndex}`
  //  );
  //  console.log("🗒️ New notes array:", updatedNotes);

  return {
    ...map,
    notes: updatedNotes,
  };
}
