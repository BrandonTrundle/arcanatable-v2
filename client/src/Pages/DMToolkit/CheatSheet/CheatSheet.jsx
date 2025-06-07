import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/CheatSheet.module.css";
import cheatTemplate from "../../../Mock/CheatEntry.json";
import CheatEntryForm from "../../../Components/DMToolkit/CheatSheet/CheatEntryForm";
import CheatEntryCard from "../../../Components/DMToolkit/CheatSheet/CheatEntryCard";
import CheatEntryDetail from "../../../Components/DMToolkit/CheatSheet/CheatEntryDetail";

export default function CheatSheet() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleCheatSubmit = (formData, campaign) => {
    setShowForm(false);
    // TODO: Persist to backend or local state
  };

  return (
    <div className={styles.sheet}>
      <h1 className={styles.title}>Cheat Sheet – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Entry"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search cheat entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <CheatEntryForm
          currentCampaign={currentCampaign}
          onSubmit={handleCheatSubmit}
          defaultValues={cheatTemplate.content}
        />
      )}

      <div className={styles.cardGrid}>
        {Array.from({ length: 5 }) // placeholder loop
          .map(() => cheatTemplate.content)
          .filter((entry) =>
            entry.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((entry, i) => (
            <CheatEntryCard
              key={i}
              entry={entry}
              onClick={() => setSelectedEntry(entry)}
            />
          ))}
      </div>

      {selectedEntry && (
        <CheatEntryDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
