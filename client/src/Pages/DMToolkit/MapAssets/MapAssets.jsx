import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/MapAssets.module.css";
import mapAssetTemplate from "../../../Mock/MapAsset.json"; // Replace with actual MapAsset JSON
import MapAssetForm from "../../../Components/DMToolkit/MapAssets/MapAssetForm";
import MapAssetCard from "../../../Components/DMToolkit/MapAssets/MapAssetCard";
import MapAssetDetail from "../../../Components/DMToolkit/MapAssets/MapAssetDetail";

export default function MapAssets() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleAssetSubmit = (formData, campaign) => {
    setShowForm(false);
    // TODO: hook into backend or local storage
  };

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
          defaultValues={mapAssetTemplate.content} // You'll need to create a proper mock
        />
      )}

      <div className={styles.cardGrid}>
        {Array.from({ length: 6 }) // placeholder loop
          .map(() => mapAssetTemplate.content)
          .filter((asset) =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((asset, i) => (
            <MapAssetCard
              key={i}
              asset={asset}
              onClick={() => setSelectedAsset(asset)}
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
