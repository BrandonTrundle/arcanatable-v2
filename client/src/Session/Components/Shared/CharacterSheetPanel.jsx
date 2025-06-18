import React, { useState, useEffect, useRef } from "react";
import PageOne from "../../../Components/Character/CharacterSheetPages/PageOne";
import PageTwo from "../../../Components/Character/CharacterSheetPages/PageTwo";
import PageThree from "../../../Components/Character/CharacterSheetPages/PageThree";
import CampaignSelectorBlock from "../../../Components/Character/CharacterSheetPages/CampaignSelectorBlock";
import styles from "../../styles/CharacterSheetPanel.module.css";

export default function CharacterSheetPanel({ character, onClose }) {
  const panelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const [activeTab, setActiveTab] = useState(1);
  const [characterData, setCharacterData] = useState(null);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { campaigns } = await res.json();
        setAvailableCampaigns(campaigns || []);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    if (character) {
      setCharacterData(character);
      fetchCampaigns();
    }
  }, [character]);

  const startDrag = (e) => {
    const panel = panelRef.current;
    pos.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop,
    };
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };

  const drag = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - pos.current.x}px`;
    panel.style.top = `${e.clientY - pos.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  };

  const handleCloseAndSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("characterData", JSON.stringify(characterData));

      if (characterData.portraitImage instanceof File) {
        formData.append("portraitImage", characterData.portraitImage);
      }

      if (
        characterData.organization?.symbolImage &&
        characterData.organization.symbolImage instanceof File
      ) {
        formData.append("symbolImage", characterData.organization.symbolImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/characters/${
          characterData._id
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update character: ${response.status}`);
      }

      onClose(true); // successful save
    } catch (error) {
      console.error("Auto-save failed on close:", error);
      onClose(false); // failed save
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 1:
        return (
          <PageOne
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
      case 2:
        return (
          <PageTwo
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
      case 3:
        return (
          <PageThree
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
      default:
        return null;
    }
  };

  if (!characterData) return null;

  return (
    <div
      className={styles.panel}
      ref={panelRef}
      style={{ top: 120, left: 120 }}
    >
      <div
        className={styles.header}
        onMouseDown={startDrag}
        onDoubleClick={() => {}}
      >
        <span>{characterData.name}'s Sheet</span>
        <button onClick={handleCloseAndSave}>×</button>
      </div>

      <div className={styles.content}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${
              activeTab === 1 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            Page One
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 2 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            Page Two
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 3 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(3)}
          >
            Page Three
          </button>
        </div>

        <CampaignSelectorBlock
          availableCampaigns={availableCampaigns}
          selectedIds={characterData.campaignIds}
          onChange={(updated) =>
            setCharacterData((prev) => ({ ...prev, campaignIds: updated }))
          }
        />

        <div>{renderTab()}</div>
      </div>
    </div>
  );
}
