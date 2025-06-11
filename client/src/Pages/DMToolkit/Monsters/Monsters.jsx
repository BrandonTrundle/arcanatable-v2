import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../../styles/DMToolkit/Monsters.module.css";
import monsterTemplate from "../../../Mock/Monster.json";
import MonsterForm from "../../../Components/DMToolkit/Monsters/MonsterForm";
import MonsterCard from "../../../Components/DMToolkit/Monsters/MonsterCard";
import MonsterDetail from "../../../Components/DMToolkit/Monsters/MonsterDetail";

export default function Monsters() {
  const [campaignList, setCampaignList] = useState([]);
  const { currentCampaign } = useOutletContext();
  const [monsters, setMonsters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const { user } = useContext(AuthContext);
  const [editingMonster, setEditingMonster] = useState(null);
  const dummyCampaigns = [
    { _id: "68349aed1bdc5fec32846c73", name: "Darkness" },
    { _id: "6830f434e70e351c09d65d68", name: "Light" },
    { _id: "6830f4abc123456789abcd01", name: "Otherworld" },
  ];

  const handleMonsterSubmit = async (formData) => {
    const campaignParam =
      currentCampaign && currentCampaign !== "none"
        ? `?campaignId=${currentCampaign}`
        : "?unassigned=true";

    // Clean up campaign IDs
    const cleanedCampaigns = (formData.campaigns || []).filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );
    const cleanedFormData = {
      ...formData,
      campaigns: cleanedCampaigns.length > 0 ? cleanedCampaigns : [],
    };

    try {
      console.log("🔍 Creating Monster");
      console.log("Token used:", user?.token);
      console.log("Cleaned Payload:", cleanedFormData);

      // Construct FormData with data field
      const payload = new FormData();
      payload.append("data", JSON.stringify({ content: cleanedFormData }));

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/monsters${campaignParam}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            // NOTE: Don't manually set Content-Type when using FormData
          },
          body: payload,
        }
      );

      const newMonster = await res.json();
      console.log("✅ Parsed monster from server:", newMonster);

      if (!res.ok) {
        console.error("Failed to create monster. Response:", newMonster);
        throw new Error("Failed to create monster");
      }

      setMonsters((prev) => [...prev, newMonster]);
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error creating monster:", err);
    }
  };

  const handleMonsterUpdate = async (updatedMonster) => {
    setMonsters((prev) =>
      prev.map((m) => (m._id === updatedMonster._id ? updatedMonster : m))
    );
    setEditingMonster(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this monster?"))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/monsters/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const result = await res.json();
      if (!res.ok) {
        console.error("Delete failed:", result);
        alert("Failed to delete monster.");
        return;
      }

      setMonsters((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting monster:", err);
      alert("An error occurred while deleting the monster.");
    }
  };

  const fetchMonsters = async () => {
    if (!user) return;

    try {
      const campaignParam =
        currentCampaign && currentCampaign !== "none"
          ? `?campaignId=${currentCampaign}`
          : "?unassigned=true";

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/monsters${campaignParam}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      setMonsters(data);
    } catch (err) {
      console.error("Failed to fetch monsters:", err);
    }
  };

  useEffect(() => {
    fetchMonsters();
  }, [currentCampaign, user]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch campaigns");

        const data = await res.json();
        console.log("Fetched campaigns:", data);
        setCampaignList(Array.isArray(data.campaigns) ? data.campaigns : []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    if (user) fetchCampaigns();
  }, [user]);

  return (
    <div className={styles.monsters}>
      <h1 className={styles.title}>
        Monsters –{" "}
        {campaignList.find((c) => c._id === currentCampaign)?.name ||
          "Unassigned"}
      </h1>

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

      {(showForm || editingMonster) && (
        <MonsterForm
          currentCampaign={currentCampaign}
          campaignList={campaignList}
          onSubmit={
            editingMonster
              ? handleMonsterUpdate
              : () => {
                  fetchMonsters(); // ✅ re-fetch from backend
                }
          }
          onClose={() => {
            setShowForm(false);
            setEditingMonster(null);
          }}
          defaultValues={editingMonster?.content}
        />
      )}
      <div className={styles.cardGrid}>
        {monsters
          .filter((m) =>
            m?.content?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((monster) => (
            <MonsterCard
              key={monster._id}
              monster={monster}
              onClick={() => setSelectedMonster(monster)}
              onEdit={(m) => setEditingMonster(m)}
              onDelete={handleDelete}
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
