import React, { useState, useContext, useEffect } from "react";
import PageOne from "../../Components/Character/CharacterSheetPages/PageOne";
import PageTwo from "../../Components/Character/CharacterSheetPages/PageTwo";
import PageThree from "../../Components/Character/CharacterSheetPages/PageThree";
import CampaignSelectorBlock from "../../Components/Character/CharacterSheetPages/CampaignSelectorBlock";
import styles from "../../styles/Characters/CharacterSheet.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllCampaigns } from "../../hooks/characters/fetchAllCampaigns";

const CharacterSheet = ({ mode }) => {
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);

  const [characterData, setCharacterData] = useState({
    campaignIds: [],
    name: "",
    class: "",
    level: 1,
    race: "",
    background: "",
    alignment: "",
    experiencepoints: 0,
    abilities: {
      Strength: 10,
      Dexterity: 10,
      Constitution: 10,
      Intelligence: 10,
      Wisdom: 10,
      Charisma: 10,
    },
    savingThrows: {
      Strength: { checked: false, bonus: "" },
      Dexterity: { checked: false, bonus: "" },
      Constitution: { checked: false, bonus: "" },
      Intelligence: { checked: false, bonus: "" },
      Wisdom: { checked: false, bonus: "" },
      Charisma: { checked: false, bonus: "" },
    },
    skills: [
      "Acrobatics (Dex)",
      "Animal Handling (Wis)",
      "Arcana (Int)",
      "Athletics (Str)",
      "Deception (Cha)",
      "History (Int)",
      "Insight (Wis)",
      "Intimidation (Cha)",
      "Investigation (Int)",
      "Medicine (Wis)",
      "Nature (Int)",
      "Perception (Wis)",
      "Performance (Cha)",
      "Persuasion (Cha)",
      "Religion (Int)",
      "Sleight of Hand (Dex)",
      "Stealth (Dex)",
      "Survival (Wis)",
    ].map((skill) => ({ name: skill, checked: false, bonus: "" })),
    inspiration: 0,
    proficiencyBonus: 0,
    attacks: [],
    equipment: [],
    passiveWisdom: 0,
    languages: "",
    ac: 10,
    initiative: 0,
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    speed: "30ft",
    maxHp: 0,
    currenthp: 0,
    temphp: 0,
    hitdice: "",
    attackNotes: "",
    deathSaves: {
      successes: [false, false, false],
      failures: [false, false, false],
    },
    details: {
      age: "",
      height: "",
      weight: "",
      eyes: "",
      skin: "",
      hair: "",
    },
    appearance: "",
    portraitImage: null,
    backstory: "",
    organization: {
      name: "",
      symbolImage: null,
    },
    additionalFeatures: "",
    treasure: "",
    spellcasting: {
      class: "",
      ability: "",
      saveDC: "",
      attackBonus: "",
    },
    spellLevels: Array.from({ length: 10 }, (_, level) => ({
      level,
      slotsMax: level === 0 ? null : 0,
      slotsUsed: level === 0 ? null : 0,
      spells: [],
    })),
  });

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
        return (
          <PageOne
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
    }
  };

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const realCampaigns = await fetchAllCampaigns(user);
        setAvailableCampaigns(realCampaigns);
      } catch (err) {
        console.error("Failed to load campaigns", err);
      }
    };

    if (user?.token) {
      loadCampaigns();
    }
  }, [user]);

  const handleSave = async () => {
    try {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/characters`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to save character: ${response.status} ${errorText}`
        );
      }

      navigate("/characters");
    } catch (error) {
      console.error("Error saving character:", error);
    }
  };

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
            <button className={styles.saveButton} onClick={handleSave}>
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

export default CharacterSheet;
