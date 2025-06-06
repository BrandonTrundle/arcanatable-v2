import React, { useState, useEffect } from "react";
import styles from "../../../../styles/DMToolkit/NotesPanel.module.css";

export default function NotesPanel({
  notes = [],
  activeNoteCell,
  onClose,
  onUpdateNotes,
  onSelectNote,
}) {
  const [newNote, setNewNote] = useState({ name: "", body: "" });
  const [mode, setMode] = useState("list");
  //  console.log("NotesPanel received notes:", notes);

  const handleSave = () => {
    if (!newNote.name.trim() || !activeNoteCell) return;

    const id = Date.now().toString();
    onUpdateNotes([...notes, { ...newNote, id, cell: activeNoteCell }]);
    setNewNote({ name: "", body: "" });
    setMode("list");
  };

  return (
    <div className={styles.panel} style={{ top: 100, left: 100 }}>
      <div className={styles.header}>
        <span>
          Map Notes
          {mode === "create" && (
            <span
              style={{
                fontWeight: "normal",
                marginLeft: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              –{" "}
              {activeNoteCell
                ? `Cell: ${activeNoteCell.x}, ${activeNoteCell.y}`
                : "(Click cell to place...)"}
            </span>
          )}
        </span>
        <button onClick={onClose} className={styles.closeBtn}>
          ✕
        </button>
      </div>

      <div className={styles.tabBar}>
        <button
          className={mode === "list" ? styles.activeTab : styles.tab}
          onClick={() => setMode("list")}
        >
          Our Notes
        </button>
        <button
          className={mode === "create" ? styles.activeTab : styles.tab}
          onClick={() => setMode("create")}
        >
          New Note
        </button>
      </div>

      {mode === "list" && (
        <div className={styles.noteList}>
          {notes.length === 0 && (
            <p style={{ padding: "0 1rem", color: "var(--color-muted)" }}>
              No notes yet.
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              className={styles.noteItem}
              onClick={() => onSelectNote?.(note)}
              style={{ cursor: note.cell ? "pointer" : "default" }}
            >
              <div className={styles.noteTitle}>{note.name}</div>
              <p>{note.body}</p>
              <div className={styles.noteMeta}>
                Cell:{" "}
                {note.cell ? `${note.cell.x}, ${note.cell.y}` : "Unplaced"}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "create" && (
        <div className={styles.noteList}>
          <input
            type="text"
            placeholder="Note title..."
            className={styles.inputField}
            value={newNote.name}
            onChange={(e) =>
              setNewNote((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <textarea
            className={styles.textArea}
            placeholder="Note body..."
            value={newNote.body}
            onChange={(e) =>
              setNewNote((prev) => ({ ...prev, body: e.target.value }))
            }
          />
          <button onClick={handleSave} className={styles.saveButton}>
            Save Note
          </button>
          <p
            style={{
              padding: "0 1rem",
              fontSize: "0.85rem",
              color: "var(--color-muted)",
            }}
          >
            After saving, click a cell on the map to place the note.
          </p>
        </div>
      )}
    </div>
  );
}
