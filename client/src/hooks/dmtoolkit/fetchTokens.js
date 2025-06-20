import { useEffect, useState } from "react";

export default function fetchTokens(currentCampaign) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
          const content = item.content || {};
          const toolkitType = item.toolkitType || "";
          const isNPC = toolkitType.toLowerCase() === "npc";
          const isMonster = toolkitType === "Monster";
          const entityType = isNPC ? "NPC" : isMonster ? "Monster" : "NPC"; // fallback

          const parsedHp = parseInt(content.hitPoints) || 10;

          return {
            id: item._id,
            name: content.name || item.title || "Unnamed",
            image: content.image || "/images/default-token.png",
            hp: parsedHp,
            maxHp: parsedHp,
            initiative: parseInt(content.initiative) || 0,
            size: { width: 1, height: 1 },
            type: entityType.toLowerCase(),
            entityType,
            entityId: item._id,
            isPC: entityType === "PC",
            pcId: entityType === "PC" ? item._id : undefined,
            npcId: entityType === "NPC" ? item._id : undefined,
            monsterId: entityType === "Monster" ? item._id : undefined,
            notes: content.description || "",
            isVisible: true,
            rotation: 0,
            statusConditions: [],
            effects: [],
          };
        });

        const normalizedCustomTokens = Array.isArray(customTokens)
          ? customTokens.map((token) => {
              const hp = token.hp ?? token.maxHp ?? 10;
              return {
                id: token._id,
                name: token.name,
                image: token.image || "/images/default-token.png",
                hp,
                maxHp: token.maxHp ?? hp,
                initiative: token.initiative,
                size: token.size || { width: 1, height: 1 },
                type: "custom",
                entityType: "NPC",
                entityId: token._id,
                isPC: false,
                pcId: undefined,
                npcId: token._id,
                monsterId: undefined,
                notes: token.notes || "",
                isVisible: true,
                rotation: token.rotation || 0,
                statusConditions: [],
                effects: [],
              };
            })
          : [];

        setTokens([...normalizedTokens, ...normalizedCustomTokens]);
        setError(null);
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError(err);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCampaign]);

  return { tokens, loading, error };
}
