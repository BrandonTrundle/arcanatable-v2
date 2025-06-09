import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageOne from "../../Components/Character/CharacterSheetPages/PageOne";
import PageTwo from "../../Components/Character/CharacterSheetPages/PageTwo";
import PageThree from "../../Components/Character/CharacterSheetPages/PageThree";
import CampaignSelectorBlock from "../../Components/Character/CharacterSheetPages/CampaignSelectorBlock";
import styles from "../../styles/Characters/CharacterSheet.module.css";
import { useNavigate } from "react-router-dom";

import mockCharacter from "../../mock/Character.json";
import mockCampaigns from "../../mock/Campaigns.json";

const EditCharacter = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const [characterData, setCharacterData] = useState(null);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const navigate = useNavigate();

  const normalizeCharacter = (raw) => ({
    ...raw,
    ac: raw.combat?.ac ?? 10,
    initiative: raw.combat?.initiative ?? 0,
    speed: `${raw.combat?.speed ?? 30}ft`,
    maxHp: raw.combat?.maxhp ?? 0,
    currenthp: raw.combat?.currenthp ?? 0,
    temphp: raw.combat?.temphp ?? 0,
    hitdice: raw.combat?.hitdice ?? "",
    deathSaves: raw.combat?.deathSaves ?? {
      successes: [false, false, false],
      failures: [false, false, false],
    },
    campaignIds: Array.isArray(raw.campaign)
      ? raw.campaign
      : raw.campaign
      ? [raw.campaign]
      : [],
  });

  useEffect(() => {
    const normalized = normalizeCharacter(mockCharacter);
    setCharacterData(normalized);
    setAvailableCampaigns(mockCampaigns);
  }, [id]);

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

  if (!characterData) return <div>Loading...</div>;

  return (
    <div className={styles.sheetContainer}>
      <div className={styles.topBar}>
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
          <button
            className={styles.tabButton}
            onClick={() => navigate("/characters")}
          >
            Dashboard
          </button>
          <div className={styles.saveContainer}>
            <button
              className={styles.saveButton}
              onClick={() => console.log("Character to save:", characterData)}
            >
              Save Character
            </button>
          </div>
        </div>

        <CampaignSelectorBlock
          availableCampaigns={availableCampaigns}
          selectedIds={characterData.campaignIds}
          onChange={(updated) =>
            setCharacterData((prev) => ({ ...prev, campaignIds: updated }))
          }
        />
      </div>

      <div className={styles.tabContent}>{renderTab()}</div>
    </div>
  );
};

export default EditCharacter;
