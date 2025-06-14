import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/DMToolkit/Tokens.module.css";
import TokenForm from "../../../Components/DMToolkit/Tokens/TokenForm";
import TokenCard from "../../../Components/DMToolkit/Tokens/TokenCard";
import TokenDetail from "../../../Components/DMToolkit/Tokens/TokenDetail";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";
import fetchTokens from "../../../hooks/dmtoolkit/fetchTokens";

export default function Tokens() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const { currentCampaign } = useOutletContext();
  const { tokens, loading, error } = fetchTokens(currentCampaign);
  const { user } = useContext(AuthContext);
  const [campaignList, setCampaignList] = useState([]);

  // submit token data
  const handleTokenSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      // Prepare payload
      const payload = new FormData();
      for (const key in formData) {
        if (key === "size") {
          payload.append("sizeWidth", formData.size.width);
          payload.append("sizeHeight", formData.size.height);
        } else if (key === "image" && formData.image instanceof File) {
          payload.append("image", formData.image);
        } else {
          payload.append(key, formData[key]);
        }
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tokens`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      if (!res.ok) throw new Error("Failed to save token");

      const savedToken = await res.json();
      savedToken.type = "custom"; // Explicitly tag as custom
      savedToken.id = savedToken._id; // Ensure consistent ID reference
      setTokens((prev) => [...prev, savedToken]);

      setShowForm(false);
    } catch (err) {
      console.error("Error saving token:", err);
      alert("Failed to save token.");
    }
  };

  // delete custom tokens
  const handleDeleteToken = async (tokenId) => {
    try {
      const userToken = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tokens/${tokenId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete token");

      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      setSelectedToken(null);
    } catch (err) {
      console.error("Error deleting token:", err);
      alert("Failed to delete token.");
    }
  };

  // load camppaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    };

    if (user?.token) loadCampaigns();
  }, [user]);

  //fetch token data for NPC's and Monsters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const query =
          currentCampaign && currentCampaign !== "none"
            ? `?campaignId=${currentCampaign}`
            : "?unassigned=true";

        const [npcRes, monsterRes, customRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/npcs${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/monsters${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tokens${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [npcs, monsters, customTokens] = await Promise.all([
          npcRes.json(),
          monsterRes.json(),
          customRes.json(),
        ]);

        const npcTokens =
          currentCampaign && currentCampaign !== "none"
            ? npcs.filter(
                (npc) =>
                  (npc.campaigns || []).includes(currentCampaign) ||
                  (npc.content?.campaigns || []).includes(currentCampaign)
              )
            : npcs;

        const normalizedTokens = [...npcTokens, ...monsters].map((item) => {
          console.log("NPC item:", item);
          const content = item.content || {};
          const isNPC = item.toolkitType?.toLowerCase() === "npc";
          const isMonster = item.toolkitType === "Monster";

          return {
            id: item._id,
            name: content.name || item.title || "Unnamed",
            image: content.image || "/images/default-token.png",
            maxHp: parseInt(content.hitPoints) || 10,
            initiative: parseInt(content.initiative) || 0,
            size: { width: 1, height: 1 },
            type: isNPC ? "npc" : isMonster ? "creature" : "unknown",
            notes: content.description || "",
            isVisible: true,
            rotation: 0,
            statusConditions: [],
            effects: [],
          };
        });
        const normalizedCustomTokens = Array.isArray(customTokens)
          ? customTokens.map((token) => ({
              id: token._id,
              name: token.name,
              image: token.image || "/images/default-token.png",
              maxHp: token.maxHp,
              initiative: token.initiative,
              size: token.size || { width: 1, height: 1 },
              type: "custom",
              notes: token.notes || "",
              isVisible: true,
              rotation: token.rotation || 0,
              statusConditions: [],
              effects: [],
            }))
          : [];

        setTokens([...normalizedTokens, ...normalizedCustomTokens]);
      } catch (err) {
        console.error("Error loading NPCs/Monsters/Custom tokens:", err);
      }
    };

    fetchData();
  }, [currentCampaign]);

  return (
    <div className={styles.tokens}>
      <h1 className={styles.title}>Tokens Library</h1>

      <div className={styles.topBar}>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Token"}
        </button>
        <input
          type="text"
          className={styles.search}
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <TokenForm
          defaultValues={{}}
          onSubmit={handleTokenSubmit}
          currentCampaign={currentCampaign}
          campaignList={campaignList}
        />
      )}

      <div className={styles.cardGrid}>
        {tokens
          .filter((token) =>
            token.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onClick={() => {
                console.log("Selected token:", token);
                setSelectedToken(token);
              }}
            />
          ))}
      </div>

      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
          onDelete={handleDeleteToken}
        />
      )}
    </div>
  );
}
