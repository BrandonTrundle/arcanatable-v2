import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/NPCs.module.css";
import NPCForm from "../../../Components/DMToolkit/NPC/NPCForm";
import NPCCard from "../../../Components/DMToolkit/NPC/NPCCard";
import NPCDetail from "../../../Components/DMToolkit/NPC/NPCDetail";

export default function NPCs() {
  const { currentCampaign } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [npcList, setNpcList] = useState([]);
  const [editingNPC, setEditingNPC] = useState(null);

  const handleNPCSubmit = async (formData, campaign) => {
    const token = localStorage.getItem("token");
    const reshapeToArray = (obj) =>
      Object.entries(obj || {}).map(([name, value]) => ({ name, value }));

    try {
      const payload = new FormData();

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      const contentToSend = {
        ...formData,
        savingThrows: reshapeToArray(formData.savingThrows),
        skills: reshapeToArray(formData.skills),
        campaigns: campaign !== "none" ? [campaign] : [],
      };

      payload.append("content", JSON.stringify(contentToSend));

      const url = editingNPC
        ? `${import.meta.env.VITE_API_BASE_URL}/api/npcs/${editingNPC._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/npcs`;

      const method = editingNPC ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to save NPC");

      const newNPC = await res.json();

      if (editingNPC) {
        setNpcList((prev) =>
          prev.map((npc) => (npc._id === newNPC._id ? newNPC : npc))
        );
      } else {
        setNpcList((prev) => [...prev, newNPC]);
      }

      setEditingNPC(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error saving NPC:", err);
    }
  };

  useEffect(() => {
    const fetchNPCs = async () => {
      try {
        const token = localStorage.getItem("token");

        const query =
          currentCampaign && currentCampaign !== "none"
            ? `?campaignId=${currentCampaign}`
            : `?unassigned=true`;

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/npcs${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setNpcList(data);
      } catch (err) {
        console.error("Failed to fetch NPCs:", err);
      }
    };

    fetchNPCs();
  }, [currentCampaign]);

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

      {(showForm || editingNPC) && (
        <NPCForm
          currentCampaign={currentCampaign}
          onSubmit={handleNPCSubmit}
          defaultValues={editingNPC?.content || {}}
        />
      )}
      <div className={styles.cardGrid}>
        {npcList
          .filter(
            (npc) =>
              npc?.content?.name &&
              npc.content.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((npc) => (
            <NPCCard
              key={npc._id}
              npc={npc}
              onClick={() => setSelectedNPC(npc.content)}
              onEdit={(npcData) => {
                setEditingNPC(npc);
                setShowForm(true);
              }}
              onDelete={(id) => {
                // implement delete logic later
              }}
            />
          ))}
      </div>
      {selectedNPC && (
        <NPCDetail npc={selectedNPC} onClose={() => setSelectedNPC(null)} />
      )}
    </div>
  );
}
