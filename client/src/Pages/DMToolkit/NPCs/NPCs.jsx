import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/NPCs.module.css";
import npcTemplate from "../../../Mock/NPC.json"; // <- You'll need to create this
import NPCForm from "../../../Components/DMToolkit/NPC/NPCForm";
import NPCCard from "../../../Components/DMToolkit/NPC/NPCCard";
import NPCDetail from "../../../Components/DMToolkit/NPC/NPCDetail";

export default function NPCs() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNPC, setSelectedNPC] = useState(null);

  const handleNPCSubmit = (formData, campaign) => {
    //  console.log("Submitting NPC:", formData, "for campaign:", campaign);
    setShowForm(false);
    // TODO: Hook into backend or local state store
  };

  return (
    <div className={styles.npcs}>
      <h1 className={styles.title}>NPCs – {currentCampaign}</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New NPC"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search NPCs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <NPCForm
          currentCampaign={currentCampaign}
          onSubmit={handleNPCSubmit}
          defaultValues={npcTemplate.content}
        />
      )}
      <div className={styles.cardGrid}>
        {Array.from({ length: 10 }) // placeholder loop
          .map((_, i) => npcTemplate.content)
          .filter((npc) =>
            npc.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((npc, i) => (
            <NPCCard key={i} npc={npc} onClick={() => setSelectedNPC(npc)} />
          ))}
      </div>
      {selectedNPC && (
        <NPCDetail npc={selectedNPC} onClose={() => setSelectedNPC(null)} />
      )}
    </div>
  );
}
