import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import Navbar from "../../Components/General/Navbar";
import CampaignCard from "../../Components/Campaign/CampaignCard";
import RuleCard from "../../Components/DMToolkit/Rules/RuleCard";
import placeholderImg from "../../assets/FantasyMapBackground.png";
import defaultAvatar from "../../assets/defaultav.png";

const CampaignDashboard = () => {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const { user } = useContext(AuthContext);
  const handleDeleteCampaign = (deletedId) => {
    setCampaigns((prev) => prev.filter((c) => c._id !== deletedId));
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        setCampaigns(data.campaigns);
        //      console.log("Fetched campaigns:", data.campaigns);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    };

    if (user?.token) fetchCampaigns();
  }, [user]);

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
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onInfoClick={setSelectedCampaign}
              onDelete={handleDeleteCampaign}
            />
          ))}
        </ul>

        {selectedCampaign && (
          <div
            className={styles.overlay}
            onClick={() => {
              setSelectedCampaign(null);
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

              <p>
                <strong>Next Session:</strong> July 15th, 7PM EST
              </p>

              <button
                onClick={() => {
                  setSelectedCampaign(null);
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
