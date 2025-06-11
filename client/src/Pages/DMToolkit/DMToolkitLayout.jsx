import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DMToolkitNavbar from "../../Components/DMToolkit/DMToolkitGeneral/DMToolkitNavbar";
import styles from "../../styles/DMToolkit/DMToolkitLayout.module.css";

export default function DMToolkitLayout() {
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("none");

  // Simulate campaign loading (replace with API later)
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setCampaigns(Array.isArray(data.campaigns) ? data.campaigns : []);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    fetchCampaigns();
    if (!currentCampaign || currentCampaign === "none") {
      setCurrentCampaign("none");
    }
  }, []);

  const handleCampaignChange = (newCampaignId) => {
    setCurrentCampaign(newCampaignId);
  };

  return (
    <div className={styles.container}>
      <DMToolkitNavbar
        currentCampaign={currentCampaign}
        onCampaignChange={handleCampaignChange}
        campaignList={campaigns}
      />
      <main className={styles.content}>
        <Outlet context={{ currentCampaign }} />
      </main>
    </div>
  );
}
