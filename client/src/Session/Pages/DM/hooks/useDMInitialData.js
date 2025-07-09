import { useEffect, useState } from "react";

export function useDMInitialData(sessionCode, user) {
  const [campaign, setCampaign] = useState(null);
  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      if (!sessionCode || !user?.token) return;

      try {
        const token = user.token;

        // 1. Fetch the session by sessionCode
        const sessionRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/sessions/by-code/${sessionCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sessionData = await sessionRes.json();
        const campaignId = sessionData.session?.campaignId;
        if (!campaignId) {
          console.warn("❌ No campaignId found in session.");
          return;
        }

        // 2. Fetch the campaign
        const campaignRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const campaignData = await campaignRes.json();
        const fetchedCampaign = campaignData.campaign;

        if (
          String(fetchedCampaign?.creatorId) !== String(user._id || user.id)
        ) {
          console.warn(
            "🚫 Mismatch: User is not creator of campaign from session."
          );
          console.warn("🧾 campaign.creatorId:", fetchedCampaign?.creatorId);
          console.warn("🧾 user._id:", user._id || user.id);
          return;
        }

        setCampaign(fetchedCampaign);

        // 3. Fetch maps
        const mapsRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/maps?campaignId=${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const mapData = await mapsRes.json();
        setMaps(mapData || []);

        // 4. Set active map if present
        const currentMapId = sessionData.session?.currentMapId;
        if (currentMapId) {
          const active = mapData.find((m) => m._id === currentMapId);
          if (active) setActiveMap(active);
        }
      } catch (err) {
        console.error("❌ Error loading session data:", err);
      }
    };

    fetchSessionAndData();
  }, [sessionCode, user]);

  return {
    campaign,
    maps,
    activeMap,
    setActiveMap,
  };
}
