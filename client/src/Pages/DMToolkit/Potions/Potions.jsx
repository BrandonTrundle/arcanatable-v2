import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Potions.module.css";
import potionTemplate from "../../../Mock/Potion.json";
import PotionForm from "../../../Components/DMToolkit/Potions/PotionForm";
import PotionCard from "../../../Components/DMToolkit/Potions/PotionCard";
import PotionDetail from "../../../Components/DMToolkit/Potions/PotionDetail";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

export default function Potions() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPotion, setSelectedPotion] = useState(null);
  const [campaignList, setCampaignList] = useState([]);
  const { user } = useContext(AuthContext);

  const handlePotionSubmit = (formData, campaign) => {
    //  console.log("Submitting Potion:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  useEffect(() => {
    if (!user?.token) return;

    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Could not load campaigns", err);
      }
    };

    loadCampaigns();
  }, [user]);

  return (
    <div className={styles.potions}>
      <h1 className={styles.title}>
        Potions –{" "}
        {campaignList.find((c) => c._id === currentCampaign)?.name ||
          "Unassigned"}
      </h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Potion"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search potions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <PotionForm
          currentCampaign={currentCampaign}
          onSubmit={handlePotionSubmit}
          defaultValues={potionTemplate.content}
        />
      )}
      <div className={styles.cardGrid}>
        {Array.from({ length: 6 }) // placeholder cards
          .map(() => potionTemplate.content)
          .filter((potion) =>
            potion.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((potion, i) => (
            <PotionCard
              key={i}
              potion={potion}
              onClick={() => setSelectedPotion(potion)}
            />
          ))}
      </div>

      {selectedPotion && (
        <PotionDetail
          potion={selectedPotion}
          onClose={() => setSelectedPotion(null)}
        />
      )}
    </div>
  );
}
