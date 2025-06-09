import React from "react";
import styles from "../../../styles/Characters/CampaignSelectorBlock.module.css"; // Create this CSS file

const CampaignSelectorBlock = ({
  availableCampaigns,
  selectedIds,
  onChange,
}) => {
  const handleSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !selectedIds.includes(selectedId)) {
      onChange([...selectedIds, selectedId]);
    }
  };

  const handleRemove = (id) => {
    onChange(selectedIds.filter((cid) => cid !== id));
  };

  const getCampaignName = (id) =>
    availableCampaigns.find((c) => c._id === id)?.name || "Unknown";

  return (
    <div className={styles.container}>
      <label htmlFor="campaignSelect">Add to Campaign:</label>
      <select id="campaignSelect" onChange={handleSelect} value="">
        <option value="" disabled>
          Select campaign...
        </option>
        {availableCampaigns
          .filter((camp) => !selectedIds.includes(camp._id))
          .map((camp) => (
            <option key={camp._id} value={camp._id}>
              {camp.name}
            </option>
          ))}
      </select>

      <div className={styles.tags}>
        {selectedIds.map((id) => (
          <div key={id} className={styles.tag}>
            {getCampaignName(id)}
            <button
              className={styles.removeBtn}
              onClick={() => handleRemove(id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignSelectorBlock;
