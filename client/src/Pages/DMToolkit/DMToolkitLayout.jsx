import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"; // 👈 added useLocation
import DMToolkitNavbar from "../../Components/DMToolkit/DMToolkitGeneral/DMToolkitNavbar";
import styles from "../../styles/DMToolkit/DMToolkitLayout.module.css";

export default function DMToolkitLayout() {
  const location = useLocation(); // 👈 get current path
  const hideNavbar = location.pathname.startsWith("/dmtoolkit/maps/editor"); // 👈 condition

  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("none");

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
      {/* 👇 conditionally render navbar */}
      {!hideNavbar && (
        <DMToolkitNavbar
          currentCampaign={currentCampaign}
          onCampaignChange={handleCampaignChange}
          campaignList={campaigns}
        />
      )}

      <main
        className={styles.content}
        style={hideNavbar ? { marginLeft: 0, padding: 0 } : {}}
      >
        <Outlet context={{ currentCampaign }} />
      </main>
    </div>
  );
}
