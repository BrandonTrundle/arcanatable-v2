import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";

export default function useMapAssets(currentCampaign) {
  const { user } = useContext(AuthContext);
  const [mapAssets, setMapAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.token || !currentCampaign || currentCampaign === "none") {
      setMapAssets([]);
      setLoading(false);
      return;
    }

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/mapassets?campaignId=${currentCampaign}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch map assets");

        const data = await res.json();

        const normalizedAssets = (data.mapAssets || []).map((asset) => ({
          id: asset._id,
          name: asset.name || "Unnamed Asset",
          image: asset.image || "/images/default-asset.png",
          size: {
            width: asset.width || 1,
            height: asset.height || 1,
          },
          description: asset.description || "",
          tags: asset.tags || [],
          userId: asset.userId,
        }));

        setMapAssets(normalizedAssets);
        setError(null);
      } catch (err) {
        console.error("Error fetching map assets:", err);
        setError(err);
        setMapAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [user, currentCampaign]);

  return { mapAssets, loading, error };
}
