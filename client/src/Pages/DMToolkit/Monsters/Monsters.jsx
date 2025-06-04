import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/Monsters.module.css";
import monsterTemplate from "../../../Mock/Monster.json";
import MonsterForm from "../../../Components/DMToolkit/Monsters/MonsterForm";
import MonsterCard from "../../../Components/DMToolkit/Monsters/MonsterCard";
import MonsterDetail from "../../../Components/DMToolkit/Monsters/MonsterDetail";

export default function Monsters() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const handleMonsterSubmit = (formData, campaign) => {
    //    console.log("Submitting Monster:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  return (
    <div className={styles.monsters}>
      <h1 className={styles.title}>Monsters – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Monster"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search monsters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <MonsterForm
          currentCampaign={currentCampaign}
          onSubmit={handleMonsterSubmit}
          defaultValues={monsterTemplate.content}
        />
      )}
      <div className={styles.cardGrid}>
        {Array.from({ length: 10 })
          .map((_, i) => monsterTemplate.content)
          .filter((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((monster, i) => (
            <MonsterCard
              key={i}
              monster={monster}
              onClick={() => setSelectedMonster(monster)}
            />
          ))}
      </div>
      {selectedMonster && (
        <MonsterDetail
          monster={selectedMonster}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}
