import { useEffect } from "react";

export default function usePlayerSessionLoader(
  inviteCode,
  user,
  setCampaign,
  setMaps,
  setActiveMap
) {
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = user.token;

        const sessionRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/sessions/by-code/${inviteCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sessionData = await sessionRes.json();
        if (!sessionData?.session) {
          console.error("Invalid session response:", sessionData);
          return;
        }
        const campaignId = sessionData.session.campaignId;

        const campaignRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const campaignData = await campaignRes.json();
        setCampaign(campaignData.campaign);

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

        if (sessionData.session.currentMapId) {
          const active = mapData.find(
            (m) => m._id === sessionData.session.currentMapId
          );
          if (active) setActiveMap(active);
        }
      } catch (err) {
        console.error("Player session fetch error:", err);
      }
    };

    if (inviteCode && user?.token) {
      fetchSessionData();
    }
  }, [inviteCode, user, setCampaign, setMaps, setActiveMap]);
}
