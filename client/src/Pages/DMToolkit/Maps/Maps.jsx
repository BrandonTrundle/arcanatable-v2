import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Maps.module.css";
import mapTemplate from "../../../Mock/Map.json";
import MapForm from "../../../Components/DMToolkit/Maps/MapForm";
import MapCard from "../../../Components/DMToolkit/Maps/MapCard";
import MapDetail from "../../../Components/DMToolkit/Maps/MapDetail";

export default function Maps() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMap, setSelectedMap] = useState(null);

  const handleMapSubmit = (formData, campaign) => {
    console.log("Submitting Map:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Connect to backend or local state
  };

  return (
    <div className={styles.maps}>
      <h1 className={styles.title}>Maps – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Map"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search maps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <MapForm
          currentCampaign={currentCampaign}
          onSubmit={handleMapSubmit}
          defaultValues={mapTemplate}
        />
      )}

      <div className={styles.cardGrid}>
        {Array.from({ length: 8 })
          .map(() => mapTemplate)
          .filter((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((map, i) => (
            <MapCard key={i} map={map} onClick={() => setSelectedMap(map)} />
          ))}
      </div>

      {selectedMap && (
        <MapDetail map={selectedMap} onClose={() => setSelectedMap(null)} />
      )}
    </div>
  );
}
