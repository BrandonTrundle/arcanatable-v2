import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Maps.module.css";
import MapForm from "../../../Components/DMToolkit/Maps/MapForm";
import MapCard from "../../../Components/DMToolkit/Maps/MapCard";
import MapDetail from "../../../Components/DMToolkit/Maps/MapDetail";

export default function Maps() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMap, setSelectedMap] = useState(null);
  const [mapList, setMapList] = useState([]);
  const [editingMap, setEditingMap] = useState(null);

  const handleMapSubmit = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const payload = new FormData();

      if (formData.image instanceof File) {
        payload.append("image", formData.image); // to be handled server-side
      }

      const mapData = {
        id: `map-${Date.now()}`, // generate a unique id
        name: formData.name,
        image: formData.image instanceof File ? "" : formData.image,
        width: Number(formData.width),
        height: Number(formData.height),
        gridSize: Number(formData.gridSize),
        gridType: formData.gridType,
        fogOfWarEnabled: formData.fogOfWarEnabled,
        snapToGrid: formData.snapToGrid,
        campaignId: currentCampaign,
        userId: JSON.parse(localStorage.getItem("user"))?.id, // pull user id from localStorage
        fogOfWar: { revealedCells: [], blockingCells: [] },
        notes: [],
        layers: {
          player: { tokens: [], assets: [] },
          dm: { tokens: [], assets: [] },
          hidden: { tokens: [], assets: [] },
        },
      };

      payload.append("map", JSON.stringify(mapData));

      const url = editingMap
        ? `${import.meta.env.VITE_API_BASE_URL}/api/maps/${editingMap._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/maps`;

      const method = editingMap ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to save map");
      const savedMap = await res.json();

      setMapList((prev) =>
        editingMap
          ? prev.map((m) => (m._id === savedMap._id ? savedMap : m))
          : [...prev, savedMap]
      );

      setEditingMap(null);
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error saving map:", err);
    }
  };

  const handleDeleteMap = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this map?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/maps/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete map");

      setMapList((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete map:", err);
    }
  };

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/maps?campaignId=${currentCampaign}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch maps");

        const data = await res.json();
        setMapList(data);
      } catch (err) {
        console.error("❌ Failed to load maps:", err);
      }
    };

    if (currentCampaign) {
      fetchMaps();
    }
  }, [currentCampaign]);

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
          defaultValues={editingMap}
        />
      )}

      <div className={styles.cardGrid}>
        {mapList
          .filter((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((map) => (
            <MapCard
              key={map._id}
              map={map}
              onClick={() => setSelectedMap(map)}
              onEdit={(mapData) => {
                setEditingMap(mapData);
                setShowForm(true);
              }}
              onDelete={handleDeleteMap}
            />
          ))}
      </div>

      {selectedMap && (
        <MapDetail map={selectedMap} onClose={() => setSelectedMap(null)} />
      )}
    </div>
  );
}
