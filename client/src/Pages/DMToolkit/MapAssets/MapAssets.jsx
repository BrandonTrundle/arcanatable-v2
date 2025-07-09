import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/MapAssets.module.css";
import MapAssetForm from "../../../Components/DMToolkit/MapAssets/MapAssetForm";
import MapAssetCard from "../../../Components/DMToolkit/MapAssets/MapAssetCard";
import MapAssetDetail from "../../../Components/DMToolkit/MapAssets/MapAssetDetail";
import { AuthContext } from "../../../context/AuthContext";
import fetchMapAssets from "../../../hooks/dmtoolkit/fetchMapAssets";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";

export default function MapAssets() {
  const { currentCampaign } = useOutletContext();
  const { user } = useContext(AuthContext);

  const [campaignList, setCampaignList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { mapAssets, setMapAssets, loading, error } = fetchMapAssets(user);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Could not load campaigns", err);
      }
    };

    if (user?.token) {
      loadCampaigns();
    }
  }, [user]);

  // Submit Assets
  const handleAssetSubmit = async (formData) => {
    setShowForm(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/mapassets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData, // ✅ use the raw FormData from MapAssetForm
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload map asset.");
      }

      setMapAssets((prev) => [...prev, data.mapAsset]);
    } catch (err) {
      console.error("Error saving map asset:", err.message);
      alert("Failed to save map asset.");
    }
  };

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
      <h1 className={styles.title}>
        Map Assets –{" "}
        {campaignList.find((c) => c._id === currentCampaign)?.name ||
          "Unassigned"}
      </h1>

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
          userId={user.id}
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
