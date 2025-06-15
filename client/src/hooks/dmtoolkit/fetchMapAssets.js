import { useEffect, useState } from "react";

export default function fetchMapAssets(user) {
  const [mapAssets, setMapAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/mapassets`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch assets");

        setMapAssets(data.mapAssets || []);
      } catch (err) {
        console.error("Failed to load map assets:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchAssets();
    }
  }, [user]);

  return { mapAssets, setMapAssets, loading, error };
}