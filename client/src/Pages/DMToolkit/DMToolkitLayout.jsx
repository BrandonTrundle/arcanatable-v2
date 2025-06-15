import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DMToolkitNavbar from "../../Components/DMToolkit/DMToolkitGeneral/DMToolkitNavbar";
import styles from "../../styles/DMToolkit/DMToolkitLayout.module.css";
import { AuthContext } from "../../context/AuthContext";
import { fetchCampaigns } from "../../hooks/dmtoolkit/fetchCampaigns";

export default function DMToolkitLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dmtoolkit/maps/editor");
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("none");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const userCampaigns = await fetchCampaigns(user);
        setCampaigns(userCampaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    if (user?.token) {
      loadCampaigns();
    }

    if (!currentCampaign || currentCampaign === "none") {
      setCurrentCampaign("none");
    }
  }, [user]);

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
