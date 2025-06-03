import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Potions.module.css";
import potionTemplate from "../../../Mock/Potion.json";
import PotionForm from "../../../Components/DMToolkit/Potions/PotionForm";
import PotionCard from "../../../Components/DMToolkit/Potions/PotionCard";
import PotionDetail from "../../../Components/DMToolkit/Potions/PotionDetail";

export default function Potions() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPotion, setSelectedPotion] = useState(null);

  const handlePotionSubmit = (formData, campaign) => {
    console.log("Submitting Potion:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  return (
    <div className={styles.potions}>
      <h1 className={styles.title}>Potions – {currentCampaign}</h1>

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
