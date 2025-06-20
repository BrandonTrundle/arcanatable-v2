import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../../../styles/DMToolkit/NPCs.module.css";
import NPCForm from "../../../Components/DMToolkit/NPC/NPCForm";
import NPCCard from "../../../Components/DMToolkit/NPC/NPCCard";
import NPCDetail from "../../../Components/DMToolkit/NPC/NPCDetail";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

export default function NPCs() {
  const { currentCampaign } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNPC, setSelectedNPC] = useState(null);
  const [npcList, setNpcList] = useState([]);
  const [editingNPC, setEditingNPC] = useState(null);
  const [campaignList, setCampaignList] = useState([]);

  // Submit NPC data to database
  const handleNPCSubmit = async (formData) => {
    //   console.log("🔁 Received campaigns from form:", formData.campaigns);
    const token = localStorage.getItem("token");
    const reshapeToArray = (obj) =>
      Object.entries(obj || {}).map(([name, value]) => ({ name, value }));

    try {
      const payload = new FormData();

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      // Log the campaignList currently loaded in state
      //     console.log("📋 Available campaignList:", campaignList);

      const cleanedCampaigns = formData.campaigns || [];
      //     console.log("✅ Cleaned campaigns to send:", cleanedCampaigns);

      const contentToSend = {
        ...formData,
        savingThrows: reshapeToArray(formData.savingThrows),
        skills: reshapeToArray(formData.skills),
        campaigns: cleanedCampaigns.length ? cleanedCampaigns : [],
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
      //    console.log("📦 Saved NPC campaigns from server:", newNPC.campaigns);

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
      console.error("❌ Error saving NPC:", err);
    }
  };

  // Delete an NPC
  const handleDeleteNPC = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this NPC?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/npcs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete NPC");

      setNpcList((prev) => prev.filter((npc) => npc._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete NPC:", err);
      alert("Could not delete the NPC.");
    }
  };

  //fetch campaigns
  useEffect(() => {
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

  //load campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    };

    if (user?.token) {
      loadCampaigns();
    }
  }, [user]);

  // fetch NPCs
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
        //      console.log("🧠 NPCs fetched for campaign", currentCampaign, data);

        // Manual client-side filtering fallback
        const filtered =
          currentCampaign && currentCampaign !== "none"
            ? data.filter(
                (npc) =>
                  (npc.campaigns || []).includes(currentCampaign) ||
                  (npc.content?.campaigns || []).includes(currentCampaign)
              )
            : data;

        //   console.log("🧪 Filtered NPCs:", filtered);
        setNpcList(filtered);
      } catch (err) {
        console.error("Failed to fetch NPCs:", err);
      }
    };

    fetchNPCs();
  }, [currentCampaign]);

  return (
    <div className={styles.npcs}>
      <h1 className={styles.title}>
        NPCs –{" "}
        {campaignList.find((c) => c._id === currentCampaign)?.name ||
          "Unassigned"}
      </h1>

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
          defaultValues={
            editingNPC
              ? {
                  ...editingNPC?.content,
                  campaigns: editingNPC?.campaigns || [],
                  savingThrows: Object.fromEntries(
                    (editingNPC.content?.savingThrows || []).map((pair) => [
                      pair.name,
                      pair.value,
                    ])
                  ),
                  skills: Object.fromEntries(
                    (editingNPC.content?.skills || []).map((pair) => [
                      pair.name,
                      pair.value,
                    ])
                  ),
                }
              : undefined
          }
        />
      )}
      <div className={styles.cardGrid}>
        {npcList
          .filter((npc) =>
            (npc?.content?.name ?? "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
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
              onDelete={handleDeleteNPC}
            />
          ))}
      </div>
      {selectedNPC && (
        <NPCDetail npc={selectedNPC} onClose={() => setSelectedNPC(null)} />
      )}
    </div>
  );
}
