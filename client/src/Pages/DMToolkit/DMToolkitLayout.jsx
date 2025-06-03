import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import DMToolkitNavbar from "../../Components/DMToolkit/DMToolkitGeneral/DMToolkitNavbar";
import styles from "../../styles/DMToolkit/DMToolkitLayout.module.css";

export default function DMToolkitLayout() {
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");

  // Simulate campaign loading (replace with API later)
  useEffect(() => {
    const fakeCampaigns = ["Stormreach", "Elderglen", "Voidborn Saga"];
    setCampaigns(fakeCampaigns);
    setCurrentCampaign(fakeCampaigns[0]);
  }, []);

  return (
    <div className={styles.container}>
      <DMToolkitNavbar
        currentCampaign={currentCampaign}
        onCampaignChange={setCurrentCampaign}
      />
      <main className={styles.content}>
        <Outlet context={{ currentCampaign }} />
      </main>
    </div>
  );
}
