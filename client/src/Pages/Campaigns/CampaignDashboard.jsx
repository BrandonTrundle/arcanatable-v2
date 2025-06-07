import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import Navbar from "../../Components/General/Navbar";
import CampaignCard from "../../Components/Campaign/CampaignCard";
import RuleCard from "../../Components/DMToolkit/Rules/RuleCard";
import placeholderImg from "../../assets/FantasyMapBackground.png";
import defaultAvatar from "../../assets/defaultav.png";

// Simulated rules data (as if loaded from backend)
const mockRules = [
  {
    _id: "rule-001",
    title: "Lingering Injuries",
    description:
      "Whenever a creature drops to 0 hit points but isn’t killed outright, they must roll on the Lingering Injuries table.",
    tags: ["combat", "injury", "optional"],
    image: "/images/rules/lingering.png",
    campaigns: ["Campaign 1", "Campaign 3"],
  },
  {
    _id: "rule-002",
    title: "Critical Fumbles",
    description: "Rolling a natural 1 causes a fumble effect.",
    tags: ["combat", "fumble"],
    image: "/images/rules/critfail.png",
    campaigns: ["Campaign 1"],
  },
];

const MOCK_CAMPAIGNS = Array.from({ length: 8 }, (_, i) => ({
  _id: `mock-${i}`,
  name: `Campaign ${i + 1}`,
  gameSystem: "D&D 5e",
  inviteCode: `ABC123${i}`,
  imageUrl: "",
  creator: `user-0`,
  players: [
    { _id: `user-0`, username: "DungeonMaster", avatarUrl: "" },
    { _id: `user-1`, username: "RogueOne", avatarUrl: "" },
    { _id: `user-2`, username: "WizardGuy", avatarUrl: "" },
  ],
}));

const CampaignDashboard = () => {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedRuleId, setSelectedRuleId] = useState(null);

  const campaignRules =
    selectedCampaign &&
    mockRules.filter((rule) => rule.campaigns.includes(selectedCampaign.name));

  const selectedRule =
    selectedRuleId &&
    campaignRules?.find((rule) => rule._id === selectedRuleId);

  return (
    <>
      <Navbar />
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Your Campaigns</h1>

        <div className={styles.actions}>
          <button
            className={styles.createBtn}
            onClick={() => navigate("/create-campaign")}
          >
            Create New Campaign
          </button>
          <button
            className={styles.manageBtn}
            onClick={() => navigate("/manage-campaign")}
          >
            Manage Your DM'd Campaigns
          </button>
          <button
            className={styles.joinBtn}
            onClick={() => navigate("/join-campaign")}
          >
            Join Campaign
          </button>
        </div>

        <ul className={styles.campaignList}>
          {MOCK_CAMPAIGNS.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onInfoClick={setSelectedCampaign}
            />
          ))}
        </ul>

        {selectedCampaign && (
          <div
            className={styles.overlay}
            onClick={() => {
              setSelectedCampaign(null);
              setSelectedRuleId(null);
            }}
          >
            <div
              className={styles.infoPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedCampaign.name}</h2>
              <p>
                <strong>System:</strong> {selectedCampaign.gameSystem}
              </p>
              <p>
                <strong>Players:</strong> {selectedCampaign.players.length}
              </p>
              <ul>
                {selectedCampaign.players.map((p) => (
                  <li key={p._id}>{p.username}</li>
                ))}
              </ul>

              <p>
                <strong>House Rules:</strong>
              </p>

              {campaignRules?.length ? (
                <>
                  <select
                    className={styles.dropdown}
                    value={selectedRuleId || ""}
                    onChange={(e) => setSelectedRuleId(e.target.value)}
                  >
                    <option value="">Select a rule...</option>
                    {campaignRules.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                  {selectedRule && (
                    <div className={styles.ruleCard}>
                      <div className={styles.ruleDetails}>
                        <h3>{selectedRule.title}</h3>
                        <p>{selectedRule.description}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>None assigned yet.</p>
              )}

              <p>
                <strong>Next Session:</strong> July 15th, 7PM EST
              </p>

              <button
                onClick={() => {
                  setSelectedCampaign(null);
                  setSelectedRuleId(null);
                }}
                className={styles.closeBtn}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignDashboard;
