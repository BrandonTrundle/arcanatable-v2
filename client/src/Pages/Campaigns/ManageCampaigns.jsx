import React, { useState } from "react";
import styles from "../../styles/Campaign/ManageCampaigns.module.css";
import Navbar from "../../Components/General/Navbar";
import ManageCampaignCard from "../../Components/Campaign/ManageCampaignCard";
import EditCampaignOverlay from "../../Components/Campaign/EditCampaignOverlay";

// Simulated rules from the user's toolkit
const MOCK_RULES = [
  {
    _id: "rule-001",
    title: "Lingering Injuries",
    description: "Drop to 0 HP? Roll for lasting wounds.",
    tags: ["combat"],
  },
  {
    _id: "rule-002",
    title: "Critical Fumbles",
    description: "Natural 1 means trouble.",
    tags: ["fumble", "combat"],
  },
];

const MOCK_CAMPAIGNS = Array.from({ length: 4 }, (_, i) => ({
  _id: `manage-${i}`,
  name: `The Lost Realms ${i + 1}`,
  gameSystem: "D&D 5e",
  inviteCode: `JOINME${i}`,
  nextSession: "July 22, 6PM EST",
  players: [
    { _id: "u1", username: "DMHero" },
    { _id: "u2", username: "BardBarian" },
    { _id: "u3", username: "Clerica" },
  ],
  rules: i === 0 ? ["rule-001"] : [],
}));

const ManageCampaigns = () => {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const startEditing = (campaign) => {
    setEditingCampaign(campaign._id);
    setFormData({ ...campaign });
  };

  const stopEditing = () => {
    setIsClosing(true);
    setTimeout(() => {
      setEditingCampaign(null);
      setFormData(null);
      setIsClosing(false);
    }, 300);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removePlayer = (id) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p._id !== id),
    }));
  };

  const addRule = (ruleId) => {
    setFormData((prev) => ({
      ...prev,
      rules: [...(prev.rules || []), ruleId],
    }));
  };

  const removeRule = (ruleId) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((id) => id !== ruleId),
    }));
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <h1 className={styles.title}>Manage Campaigns</h1>

        <ul className={styles.grid}>
          {MOCK_CAMPAIGNS.map((c) => (
            <ManageCampaignCard
              key={c._id}
              campaign={c}
              onEdit={startEditing}
            />
          ))}
        </ul>

        {editingCampaign && formData && (
          <EditCampaignOverlay
            formData={formData}
            onChange={handleFormChange}
            onClose={stopEditing}
            onRemovePlayer={removePlayer}
            isClosing={isClosing}
            availableRules={MOCK_RULES}
            onAddRule={addRule}
            onRemoveRule={removeRule}
          />
        )}
      </div>
    </>
  );
};

export default ManageCampaigns;
