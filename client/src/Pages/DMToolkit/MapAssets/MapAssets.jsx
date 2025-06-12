import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/MapAssets.module.css";
import MapAssetForm from "../../../Components/DMToolkit/MapAssets/MapAssetForm";
import MapAssetCard from "../../../Components/DMToolkit/MapAssets/MapAssetCard";
import MapAssetDetail from "../../../Components/DMToolkit/MapAssets/MapAssetDetail";
import { AuthContext } from "../../../context/AuthContext";

export default function MapAssets() {
  const { currentCampaign } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [mapAssets, setMapAssets] = useState([]);

  //Submit Assets
  const handleAssetSubmit = async (formData) => {
    setShowForm(false);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("width", formData.width);
    payload.append("height", formData.height);
    payload.append("description", formData.description);
    payload.append("tags", JSON.stringify(formData.tags));
    payload.append("userId", user.id);

    if (formData.imageFile) {
      payload.append("image", formData.imageFile);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/mapassets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: payload,
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to upload map asset");

      setMapAssets((prev) => [...prev, data.mapAsset]);
    } catch (err) {
      console.error("Error saving map asset:", err);
      alert("Failed to save map asset.");
    }
  };

  // fetchAssets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/mapassets`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch assets");

        setMapAssets(data.mapAssets || []);
      } catch (err) {
        console.error("Failed to load map assets:", err);
      }
    };

    fetchAssets();
  }, [user]);

  const handleDelete = async (assetId) => {
    if (!confirm("Are you sure you want to delete this map asset?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/mapassets/${assetId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setMapAssets((prev) => prev.filter((asset) => asset._id !== assetId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete asset.");
    }
  };

  const filteredAssets = mapAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.assets}>
      <h1 className={styles.title}>Map Assets – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Asset"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <MapAssetForm
          currentCampaign={currentCampaign}
          onSubmit={handleAssetSubmit}
        />
      )}

      <div className={styles.cardGrid}>
        {filteredAssets.map((asset) => (
          <MapAssetCard
            key={asset._id}
            asset={asset}
            onClick={() => setSelectedAsset(asset)}
            onDelete={() => handleDelete(asset._id)}
          />
        ))}
      </div>

      {selectedAsset && (
        <MapAssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}
